import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, RefreshControl, Platform, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getDistributorLeaveRequestsForVendor, manageDistributorLeave } from '../../apiServices/allApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import SafeAreaWrapper from '../../styles/SafeAreaWrapper';
import { useTranslation } from '../../i18n/LanguageProvider';

type RootStackParamList = {
  VendorDistributorLeave: undefined;
  VendorHome: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VendorDistributorLeave'>;

type LeaveRequest = {
  id: number;
  request_id: number;
  milkman_id: number;
  milkman_name: string;
  milkman_contact?: string;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

type GroupedLeaveRequest = {
  milkman_id: number;
  milkman_name: string;
  milkman_contact?: string;
  leaves: { date: string; request_id: number }[]; // store both
  reason: string;
};

const VendorDistributorLeaveScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [groupedRequests, setGroupedRequests] = useState<GroupedLeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingState, setProcessingState] = useState<{ key: string | null; action: 'approve' | 'reject' | null }>({
    key: null,
    action: null,
  });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRejectId, setSelectedRejectId] = useState<number | null>(null);
  const { t } = useTranslation();

  // Group consecutive leaves per milkman
  const groupConsecutiveLeaves = (leaves: LeaveRequest[]): GroupedLeaveRequest[] => {
    const grouped: GroupedLeaveRequest[] = [];
    const sortedLeaves = leaves.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedLeaves.forEach((leave) => {
      const lastGroup = grouped.length ? grouped[grouped.length - 1] : null;
      const lastDate = lastGroup?.leaves[lastGroup.leaves.length - 1].date;

      if (
        lastGroup &&
        lastGroup.milkman_id === leave.milkman_id &&
        new Date(leave.date).getTime() - new Date(lastDate!).getTime() === 24 * 60 * 60 * 1000
      ) {
        // Consecutive day
        lastGroup.leaves.push({ date: leave.date, request_id: leave.request_id });
      } else {
        grouped.push({
          milkman_id: leave.milkman_id,
          milkman_name: leave.milkman_name,
          milkman_contact: leave.milkman_contact,
          leaves: [{ date: leave.date, request_id: leave.request_id }],
          reason: leave.reason,
        });
      }
    });

    return grouped;
  };

  const fetchRequests = useCallback(async () => {
    try {
      const vendorId = user?.userID;
      if (!vendorId) throw new Error(t('vendorLeave.vendorIdNotFound'));

      setIsLoading(true);
      const response = await getDistributorLeaveRequestsForVendor(vendorId);
      const data = response?.data?.data || response?.data || [];

      const formattedRequests: LeaveRequest[] = Array.isArray(data)
        ? data.map((item: any, index: number) => ({
          id: item.id || item.request_id || index,
          request_id: item.request_id || item.id || index,
          milkman_id: item.milkman_id || item.distributor_id || 0,
          milkman_name: item.milkman_name || item.distributor_name || t('vendorLeave.unknownDistributor'),
          milkman_contact: item.milkman_contact || item.contact,
          date: item.start_date || new Date().toISOString().split('T')[0],
          reason: item.reason || t('vendorLeave.noReasonProvided'),
          status: item.status || 'pending',
          created_at: item.created_at || new Date().toISOString(),
        }))
        : [];

      const pendingLeaves = formattedRequests.filter((req) => req.status === 'pending');
      setGroupedRequests(groupConsecutiveLeaves(pendingLeaves));
    } catch (error: any) {
      Alert.alert(t('common.error'), error?.response?.data?.message || t('vendorLeave.failedToLoadRequests'));
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [user?.userID]);

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [fetchRequests])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests();
  }, [fetchRequests]);

  const handleManageLeave = async (milkman_id: number, leaves: { date: string; request_id: number }[], action: 'approve' | 'reject') => {
    const actionText = action === 'approve' ? t('vendorLeave.approve') : t('vendorLeave.reject');

    Alert.alert(
      action === 'approve' ? t('vendorLeave.approveLeave') : t('vendorLeave.rejectLeave'),
      action === 'approve' ? t('vendorLeave.confirmApprove', { days: leaves.length, })
        : t('vendorLeave.confirmReject', { days: leaves.length, }),
      [{
        text: t('common.cancel'),
        style: 'cancel',
      },
      {
        text: actionText,
        style: action === 'reject' ? 'destructive' : 'default',
        onPress: async () => {
          try {
            const cardKey = `${milkman_id}_${leaves.map(l => l.date).join('-')}`;
            setProcessingState({ key: cardKey, action });

            for (const leave of leaves) {
              const payload = {
                milkman_id,
                leave_request_id: leave.request_id, // ✅ dynamic now
                action,
              };
              await manageDistributorLeave(payload);
            }

            Alert.alert(
              t('common.success'),
              action === 'approve' ? t('vendorLeave.leaveApproved') : t('vendorLeave.leaveRejected'),
              [{
                text: 'OK', onPress: () => fetchRequests()
              },]);
          } catch (error: any) {
            Alert.alert(t('common.error'), error?.response?.data?.message ||
              (action === 'approve' ? t('vendorLeave.failedApprove') : t('vendorLeave.failedReject')));
          } finally {
            setProcessingState({ key: null, action: null });
          }
        },
      },
      ]
    );
  };

  const submitRejectReason = async () => {
    if (!rejectReason.trim()) {
      Alert.alert(t('vendorLeave.reasonRequired'), t('vendorLeave.enterRejectReason'));
      return;
    }

    if (selectedRejectId == null) {
      Alert.alert(t('common.error'), t('vendorLeave.noRequestSelected'));
      return;
    }

    try {
      setProcessingState({ key: selectedRejectId.toString(), action: "reject" });

      const payload = {
        leave_request_id: selectedRejectId,   // ⭐ FIXED
        action: "reject" as const,
        rejection_reason: rejectReason,
      };

      await manageDistributorLeave(payload);

      Alert.alert(t('common.success'), t('vendorLeave.requestRejected'));

      setShowRejectModal(false);
      setRejectReason("");
      fetchRequests();
    } catch (error: any) {
      Alert.alert(t('common.error'), error?.response?.data?.message || t('vendorLeave.failedRejectRequest'));
    } finally {
      setProcessingState({ key: null, action: null });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const renderLeaveRequest = ({ item }: { item: GroupedLeaveRequest }) => {
    const cardKey = `${item.milkman_id}_${item.leaves.map(l => l.date).join('-')}`;
    const isProcessing = processingState.key === cardKey;
    const singleDay = item.leaves.length === 1;
    const dateText = singleDay
      ? `${t('vendorLeave.leaveDate')}: ${formatDate(item.leaves[0].date)}`
      : `${t('vendorLeave.leaveDate')}: ${formatDate(item.leaves[0].date)} ${t('common.to')} ${formatDate(item.leaves[item.leaves.length - 1].date)}`;

    return (
      <View style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <View style={styles.distributorInfo}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{item.milkman_name.substring(0, 2).toUpperCase()}</Text>
            </View>
            <View style={styles.distributorDetails}>
              <Text style={styles.distributorName}>{item.milkman_name}</Text>
              {item.milkman_contact && <Text style={styles.distributorContact}>{item.milkman_contact}</Text>}
            </View>
          </View>
          <View style={styles.statusBadge}>
            <Ionicons name="time-outline" size={14} color="#FF9500" />
            <Text style={styles.statusText}>{t('vendorLeave.pending')}</Text>
          </View>
        </View>

        <View style={styles.requestBody}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{dateText}</Text>
          </View>

          <View style={styles.remarksContainer}>
            <Ionicons name="document-text-outline" size={16} color="#666" />
            <Text style={styles.remarksText}>{item.reason}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => {
              setSelectedRejectId(item.leaves[0].request_id);   // ✅ FIXED
              setShowRejectModal(true);
            }} disabled={isProcessing}
            activeOpacity={0.7}
          >
            {isProcessing && processingState.action === 'reject' ? (
              <ActivityIndicator size="small" color="#FF3B30" />
            ) : (
              <>
                <Ionicons name="close-circle-outline" size={20} color="#FF3B30" />
                <Text style={styles.rejectButtonText}>{t('vendorLeave.reject')}</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleManageLeave(item.milkman_id, item.leaves, 'approve')}
            disabled={isProcessing}
            activeOpacity={0.7}
          >
            {isProcessing && processingState.action === 'approve' ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.acceptButtonText}>{t('vendorLeave.approve')}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9500" />
        <Text style={styles.loadingText}>{t('vendorLeave.loadingRequests')}</Text>
      </View>
    );
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Reject Reason Modal */}
        {
          showRejectModal && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>{t('vendorLeave.rejectRequest')}</Text>
                <Text style={styles.modalSubtitle}>{t('vendorLeave.rejectReasonSubtitle')}</Text>

                <TextInput
                  style={styles.reasonInput}
                  placeholder={t('vendorLeave.writeReason')}
                  placeholderTextColor="#999"
                  multiline
                  value={rejectReason}
                  onChangeText={setRejectReason}
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelBtn]}
                    onPress={() => {
                      setShowRejectModal(false);
                      setRejectReason("");
                    }}
                  >
                    <Text style={styles.cancelText}>{t('common.cancel')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.submitBtn]}
                    onPress={submitRejectReason}
                  >
                    {processingState.action === "reject" ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.submitText}>{t('vendorLeave.submit')}</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )
        }
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{t('vendorLeave.distributorLeave')}</Text>
            <Text style={styles.headerSubtitle}>{t('vendorLeave.manageDistributorLeave')}</Text>
          </View>
        </View>

        {groupedRequests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>{t('vendorLeave.noPendingRequests')}</Text>
            <Text style={styles.emptySubtitle}>{t('vendorLeave.requestsAppearHere')}</Text>
          </View>
        ) : (
          <FlatList
            data={groupedRequests}
            keyExtractor={(item) => `leave_${item.milkman_id}_${item.leaves.map(leave => leave.date).join('-')}`}
            renderItem={renderLeaveRequest}
            contentContainerStyle={styles.listContainer}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default VendorDistributorLeaveScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 20,
  },
  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  distributorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  distributorDetails: {
    flex: 1,
  },
  distributorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  distributorContact: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  requestBody: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  remarksContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  remarksText: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  rejectButton: {
    backgroundColor: '#FFE8E8',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  rejectButtonText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: '600',
  },
  acceptButton: {
    backgroundColor: '#34C759',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    zIndex: 9999,     // iOS + Android
    elevation: 10,    // Android
  },

  modalContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    zIndex: 10000,
    elevation: 15,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },

  modalSubtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
  },

  reasonInput: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    textAlignVertical: "top",
    padding: 12,
    fontSize: 14,
    color: "#1a1a1a",
    marginBottom: 20,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },

  modalButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },

  cancelBtn: {
    backgroundColor: "#eee",
  },

  cancelText: {
    color: "#333",
    fontWeight: "600",
  },

  submitBtn: {
    backgroundColor: "#FF3B30",
  },

  submitText: {
    color: "#fff",
    fontWeight: "600",
  },
});
