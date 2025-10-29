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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getDistributorLeaveRequestsForVendor, manageDistributorLeave } from '../../apiServices/allApi';

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
  remarks: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

const VendorDistributorLeaveScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  // TODO: replace the fallback 0 with the actual vendor id from your auth/user context or route params
  const vendorId = 7;
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getDistributorLeaveRequestsForVendor(vendorId);
      const data = response?.data?.data || response?.data || [];

      // Map and format the data
      const formattedRequests = Array.isArray(data) ? data.map((item: any, index: number) => ({
        id: item.id || item.request_id || index,
        request_id: item.request_id || item.id || index,
        milkman_id: item.milkman_id || item.distributor_id || 0,
        milkman_name: item.milkman_name || item.distributor_name || 'Unknown Distributor',
        milkman_contact: item.milkman_contact || item.contact,
        date: item.start_date || item.start_date || new Date().toISOString().split('T')[0],
        remarks: item.remarks || item.reason || 'No reason provided',
        status: item.status || 'pending',
        created_at: item.created_at || new Date().toISOString(),
      })) : [];

      // Filter only pending requests
      const pendingRequests = formattedRequests.filter((req: LeaveRequest) =>
        req.status === 'pending'
      );

      setRequests(pendingRequests);
    } catch (error: any) {
      console.error('Error fetching distributor leave requests:', error);
      Alert.alert('Error', error?.response?.data?.message || 'Failed to load leave requests');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRequests();
    }, [fetchRequests])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests();
  }, [fetchRequests]);

  const handleManageLeave = async (milkman_id: number, request_id: number, action: 'approve' | 'reject') => {
    const actionText = action === 'approve' ? 'Approve' : 'Reject';
    const apiAction = action === 'approve' ? 'accept' : 'reject';

    Alert.alert(
      `${actionText} Leave`,
      `Are you sure you want to ${action} this leave request?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: actionText,
          style: action === 'reject' ? 'destructive' : 'default',
          onPress: async () => {
            try {
              setProcessingId(milkman_id);
              await manageDistributorLeave({ milkman_id, leave_request_id: request_id, action: apiAction });

              Alert.alert(
                'Success',
                `Leave request ${action}d successfully!`,
                [{ text: 'OK', onPress: () => fetchRequests() }]
              );
            } catch (error: any) {
              console.error(`Error ${action}ing leave:`, error);
              Alert.alert(
                'Error',
                error?.response?.data?.message || `Failed to ${action} leave request`
              );
            } finally {
              setProcessingId(null);
            }
          },
        },
      ]
    );
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

  const renderLeaveRequest = ({ item }: { item: LeaveRequest }) => {
    const isProcessing = processingId === item.milkman_id;

    return (
      <View style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <View style={styles.distributorInfo}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {item.milkman_name.substring(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={styles.distributorDetails}>
              <Text style={styles.distributorName}>{item.milkman_name}</Text>
              {item.milkman_contact && (
                <Text style={styles.distributorContact}>{item.milkman_contact}</Text>
              )}
            </View>
          </View>
          <View style={styles.statusBadge}>
            <Ionicons name="time-outline" size={14} color="#FF9500" />
            <Text style={styles.statusText}>PENDING</Text>
          </View>
        </View>

        <View style={styles.requestBody}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.infoText}>Leave Date: {formatDate(item.date)}</Text>
          </View>

          <View style={styles.remarksContainer}>
            <Ionicons name="document-text-outline" size={16} color="#666" />
            <Text style={styles.remarksText}>{item.remarks}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleManageLeave(item.milkman_id, item.request_id, 'reject')}
            disabled={isProcessing}
            activeOpacity={0.7}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FF3B30" />
            ) : (
              <>
                <Ionicons name="close-circle-outline" size={20} color="#FF3B30" />
                <Text style={styles.rejectButtonText}>Reject</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleManageLeave(item.milkman_id, item.request_id, 'approve')}
            disabled={isProcessing}
            activeOpacity={0.7}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.acceptButtonText}>Approve</Text>
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
        <Text style={styles.loadingText}>Loading leave requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Distributor Leave</Text>
          <Text style={styles.headerSubtitle}>
            Manage distributor leave requests
          </Text>
        </View>
      </View>

      {requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Pending Leave Requests</Text>
          <Text style={styles.emptySubtitle}>
            Distributor leave requests will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => `leave_${item.request_id}`}
          renderItem={renderLeaveRequest}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
});
