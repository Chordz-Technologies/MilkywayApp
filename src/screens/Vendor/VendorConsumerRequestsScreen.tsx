import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Platform,
  TextInput
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getConsumerRequests, manageConsumerRequest } from '../../apiServices/allApi';
import { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCalendarData } from '../../store/calendarSlice';
import type { AppDispatch } from '../../store';
import SafeAreaWrapper from '../../styles/SafeAreaWrapper';

type RootStackParamList = {
  VendorConsumerRequests: undefined;
  VendorHome: undefined;
  MilkRequestDistributorAssign: { consumerId: number, consumerName: string, requestId: number };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VendorConsumerRequests'>;

type ConsumerRequest = {
  id: number;
  request_id: number;
  customer_id: number;
  customer_name: string;
  customer_contact?: string;
  date: string;
  cow_milk_quantity?: number;
  buffalo_milk_quantity?: number;
  total_quantity: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  distributor_name?: string;
};

const VendorConsumerRequestsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const [requests, setRequests] = useState<ConsumerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  // const [processingId, setProcessingId] = useState<number | null>(null);
  const [processingState, setProcessingState] = useState<{ id: number | null; action: 'approve' | 'reject' | null }>({
    id: null,
    action: null,
  });
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRejectId, setSelectedRejectId] = useState<number | null>(null);
  const [acceptedRequestIds, setAcceptedRequestIds] = useState<Set<number>>(new Set());

  const { user } = useSelector((state: RootState) => state.auth);

  const fetchRequests = useCallback(async () => {
    try {
      const vendorId = user?.userID;
      if (!vendorId) {
        throw new Error('Vendor ID not found');
      }
      setIsLoading(true);
      const response = await getConsumerRequests(vendorId);
      const data = response?.data?.data?.extra_milk_requests || [];

      // Map and format the data
      const formattedRequests = Array.isArray(data) ? data.map((item: any, index: number) => ({
        id: item.id || item.request_id || index,
        request_id: item.request_id || item.id || index,
        customer_id: item.customer_id || item.consumer_id || 0,
        customer_name: item.customer.first_name + ' ' + item.customer.last_name || 'Unknown Consumer',
        customer_contact: item.customer_contact || item.contact,
        date: item.date || item.request_date || new Date().toISOString().split('T')[0],
        cow_milk_quantity: item.cow_milk_extra || 0,
        buffalo_milk_quantity: item.buffalo_milk_extra || 0,
        total_quantity: (item.cow_milk_extra || 0) + (item.buffalo_milk_extra || 0),
        status: item.status || 'pending',
        created_at: item.created_at || new Date().toISOString(),
        distributor_name: item.distributor_name || item.milkman_name,
      })) : [];

      // Show pending and accepted requests (not rejected)
      const activeRequests = formattedRequests.filter((req: ConsumerRequest) =>
        req.status === 'pending' || req.status === 'accepted'
      );

      setRequests(activeRequests);
    } catch (error: any) {
      console.error('Error fetching consumer requests:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to load consumer requests');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Only fetch on initial load (isLoading is true) or on manual refresh
      if (isLoading) {
        fetchRequests();
      }
    }, [fetchRequests, isLoading])
  );

  // Listen for when returning from assignment screen - clear acceptedRequestIds if assignment succeeded
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // When leaving this screen, preserve acceptedRequestIds for when returning
    });

    return () => unsubscribe();
  }, [navigation]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests();
  }, [fetchRequests]);

  const handleManageRequest = async (requestId: number, action: 'approve' | 'reject') => {
    const actionText = action === 'approve' ? 'Approve' : 'Reject';

    Alert.alert(
      `${actionText} Request`,
      `Are you sure you want to ${action} this extra milk request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: actionText,
          style: action === 'reject' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              // 👇 Track both ID and action
              setProcessingState({ id: requestId, action });

              const payload = { customer_request_id: requestId, action };
              console.log("📦 Sending manage request payload:", JSON.stringify(payload, null, 2));

              await manageConsumerRequest(payload);

              if (action === 'approve') {
                // Mark request as accepted locally
                setAcceptedRequestIds(prev => new Set([...prev, requestId]));

                // Refetch consumer's calendar to show updated status (pending_extra_milk → extra_milk)
                const consumerRequest = requests.find(r => r.request_id === requestId);
                if (consumerRequest?.customer_id) {
                  const now = new Date();
                  const monthString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
                  dispatch(fetchCalendarData({ customerId: consumerRequest.customer_id, month: monthString }));
                }

                Alert.alert(
                  'Request Accepted',
                  'Now assign a distributor for this extra milk request.',
                  [{ text: 'OK' }]
                );
              } else {
                // For reject, refresh to remove the card
                Alert.alert(
                  'Success',
                  `Request ${action}ed successfully!`,
                  [{ text: 'OK', onPress: () => fetchRequests() }]
                );
              }
            } catch (error: any) {
              console.error(`Error ${action}ing request:`, error);
              Alert.alert('Error', error?.response?.data?.message || `Failed to ${action} request`);
            } finally {
              // ✅ Reset loader state
              setProcessingState({ id: null, action: null });
            }
          },
        },
      ]
    );
  };

  const submitRejectReason = async () => {
    if (!rejectReason.trim()) {
      Alert.alert("Reason Required", "Please enter a reason for rejecting the request.");
      return;
    }

    // Ensure we have a valid selected ID before proceeding
    if (selectedRejectId == null) {
      Alert.alert("Error", "No request selected to reject.");
      return;
    }

    try {
      setProcessingState({ id: selectedRejectId, action: "reject" });

      const payload = {
        customer_request_id: selectedRejectId,
        action: "reject" as const,
        rejection_reason: rejectReason,
      };

      console.log("📦 Reject Payload:", payload);

      await manageConsumerRequest(payload);

      Alert.alert("Success", "Request rejected successfully!");

      setShowRejectModal(false);
      setRejectReason("");
      fetchRequests();
    } catch (error: any) {
      console.error("Reject error:", error);
      Alert.alert("Error", error?.response?.data?.message || "Failed to reject request");
    } finally {
      setProcessingState({ id: null, action: null });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const renderRequestItem = ({ item }: { item: ConsumerRequest }) => {
    const isAccepting = processingState.id === item.request_id && processingState.action === 'approve';
    const isRejecting = processingState.id === item.request_id && processingState.action === 'reject';
    const isAccepted = acceptedRequestIds.has(item.request_id) || item.status === 'accepted';

    return (
      <View style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <View style={styles.consumerInfo}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {item.customer_name.substring(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.consumerDetails}>
              <Text style={styles.consumerName}>{item.customer_name}</Text>
              {item.customer_contact && (
                <Text style={styles.consumerContact}>{item.customer_contact}</Text>
              )}
              {item.distributor_name && (
                <Text style={styles.distributorText}>
                  Distributor: {item.distributor_name} (On Leave)
                </Text>
              )}
            </View>
          </View>
          <View style={[styles.statusBadge, isAccepted && styles.statusBadgeAccepted]}>
            <Ionicons name={isAccepted ? "checkmark-circle" : "time-outline"} size={14} color={isAccepted ? "#34C759" : "#FF9500"} />
            <Text style={[styles.statusText, isAccepted && styles.statusTextAccepted]}>
              {isAccepted ? 'ACCEPTED' : 'PENDING'}
            </Text>
          </View>
        </View>

        <View style={styles.requestBody}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{formatDate(item.date)}</Text>
          </View>

          {/* <View style={styles.milkQuantities}>
            {item.total_quantity > 0 && (
              <View style={styles.milkItem}>
                <Ionicons name="water-outline" size={16} color="#007AFF" />
                <Text style={styles.milkText}>Cow: {item.cow_milk_quantity}L</Text>
              </View>
            )}
            {item.total_quantity > 0 && (
              <View style={styles.milkItem}>
                <Ionicons name="water-outline" size={16} color="#34C759" />
                <Text style={styles.milkText}>Buffalo: {item.buffalo_milk_quantity}L</Text>
              </View>
            )}
          </View> */}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Cow Milk:</Text>
            <Text style={styles.totalValue}>{item.cow_milk_quantity}L</Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Buffalo Milk:</Text>
            <Text style={styles.totalValue}>{item.buffalo_milk_quantity}L</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => {
              setSelectedRejectId(item.request_id);
              setShowRejectModal(true);
            }}
            disabled={isRejecting || isAccepting || isAccepted}
            activeOpacity={0.7}
          >
            {isRejecting ? (
              <ActivityIndicator size="small" color="#FF3B30" />
            ) : (
              <>
                <Ionicons name="close-circle-outline" size={20} color="#FF3B30" />
                <Text style={styles.rejectButtonText}>Reject</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.acceptButton, isAccepted && styles.acceptButtonDisabled]}
            onPress={() => handleManageRequest(item.request_id, 'approve')}
            disabled={isAccepting || isRejecting || isAccepted}
            activeOpacity={0.7}
          >
            {isAccepting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.acceptButtonText}>{isAccepted ? 'Accepted' : 'Accept'}</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {isAccepted && (
          <>
            <View style={styles.pendingAssignmentBar}>
              <Ionicons name="alert-circle-outline" size={18} color="#FF9500" />
              <Text style={styles.pendingAssignmentText}>Awaiting Distributor Assignment</Text>
            </View>

            <TouchableOpacity
              style={styles.assignDistributorBtn}
              onPress={() => navigation.navigate("MilkRequestDistributorAssign", { consumerId: item.customer_id, consumerName: item.customer_name, requestId: item.request_id })}
            >
              <Ionicons name="person-add-outline" size={18} color="#fff" />
              <Text style={styles.assignDistributorText}>Assign Distributor</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading requests...</Text>
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
                <Text style={styles.modalTitle}>Reject Request</Text>
                <Text style={styles.modalSubtitle}>Please enter the reason for rejecting:</Text>

                <TextInput
                  style={styles.reasonInput}
                  placeholder="Write reason here..."
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
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.submitBtn]}
                    onPress={submitRejectReason}
                  >
                    {processingState.action === "reject" ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.submitText}>Submit</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )
        }

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Consumer Requests</Text>
            <Text style={styles.headerSubtitle}>
              Extra milk requests from consumers
            </Text>
          </View>
        </View>

        {requests.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="water-outline" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Pending Requests</Text>
            <Text style={styles.emptySubtitle}>
              There are currently no pending extra milk requests from consumers.
            </Text>
          </View>
        ) : (
          <FlatList
            data={requests}
            keyExtractor={(item) => `request_${item.request_id}`}
            renderItem={renderRequestItem}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaWrapper>
  );
};

export default VendorConsumerRequestsScreen;

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
  consumerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  consumerDetails: {
    flex: 1,
  },
  consumerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  consumerContact: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  distributorText: {
    fontSize: 11,
    color: '#FF9500',
    fontWeight: '500',
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
  statusBadgeAccepted: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  statusTextAccepted: {
    color: '#34C759',
  },
  pendingAssignmentBar: {
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pendingAssignmentText: {
    fontSize: 14,
    color: '#FF9500',
    fontWeight: '500',
    flex: 1,
  },
  acceptButtonDisabled: {
    opacity: 0.6,
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
  },
  milkQuantities: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  milkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  milkText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
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
    backgroundColor: '#007AFF',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  assignDistributorBtn: {
    marginTop: 15,
    backgroundColor: "#34C759",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: 'row',
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#34C759',
        shadowOpacity: 0.3,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  assignDistributorText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
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
