import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  getAllVendorRequests,
  acceptRequest,
  rejectRequest,
} from '../apiServices/allApi';

type Request = {
  id: number;
  user_id: number;
  contact?: string;
  status: string;
  customer?: {
    id: number;
    first_name: string;
    last_name: string;
    contact: string;
  };
  milkman?: {
    id: number;
    full_name: string;
    phone_number: string;
  };
  name?: string | null;
  user_type: 'customer' | 'milkman';
  created_at: string;
  vendor: number;
};

type Props = {
  navigation: any;
  route?: any;
};

const PendingRequestsScreen = ({ navigation }: Props) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const vendorId = await AsyncStorage.getItem('userID');
      if (!vendorId) {
        Alert.alert('Error', 'Vendor ID not found, please log in again.');
        setRequests([]);
        return;
      }

      console.log('Fetching requests for vendor ID:', vendorId);

      const response = await getAllVendorRequests(vendorId);
      console.log('All requests API response:', JSON.stringify(response.data, null, 2));

      const data = response.data?.data || response.data || [];
      console.log('Parsed requests data:', data);

      if (Array.isArray(data)) {
        setRequests(data);
        console.log('Total requests found:', data.length);
      } else {
        console.warn('API response is not an array:', data);
        setRequests([]);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      Alert.alert('Error', 'Failed to load requests. Please try again.');
      setRequests([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const handleRequestAction = async (
    requestId: string,
    action: 'accepted' | 'rejected'
  ) => {
    try {
      setProcessingRequestId(requestId);
      console.log(`${action === 'accepted' ? 'Accepting' : 'Rejecting'} request:`, requestId);

      if (action === 'accepted') {
        await acceptRequest(requestId);
      } else {
        await rejectRequest(requestId);
      }

      Alert.alert('Success', `Request successfully ${action === 'accepted' ? 'accepted' : 'rejected'}.`);

      // Update the status of the request in current list immediately
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id.toString() === requestId
            ? { ...req, status: action }
            : req
        )
      );

    } catch (error) {
      console.error(`Error ${action === 'accepted' ? 'accepting' : 'rejecting'} request:`, error);
      Alert.alert('Error', `Failed to ${action === 'accepted' ? 'accept' : 'reject'} request. Please try again.`);
    } finally {
      setProcessingRequestId(null);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending':
        return '#FFA500'; // Orange
      case 'accepted':
        return '#4CD964'; // Green
      case 'rejected':
        return '#FF6B6B'; // Red
      default:
        return '#666'; // Gray
    }
  };

  const renderRequestItem = ({ item }: { item: Request }) => {
    // Get display name based on API response structure
    let displayName = item.name || 'Unknown';

    if (item.user_type === 'customer' && item.customer) {
      const firstName = item.customer.first_name || '';
      const lastName = item.customer.last_name || '';
      displayName = `${firstName} ${lastName}`.trim();
    } else if (item.user_type === 'milkman' && item.milkman) {
      displayName = item.milkman.full_name || 'Unknown Distributor';
    }

    const roleText = item.user_type === 'customer' ? 'Consumer' : 'Distributor';
    const formattedDate = new Date(item.created_at).toLocaleDateString();

    return (
      <View style={styles.requestItem}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{displayName}</Text>
          <Text style={styles.role}>Role: {roleText}</Text>
          <Text style={styles.date}>Date: {formattedDate}</Text>
          <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
            Status: {(item.status || 'pending').charAt(0).toUpperCase() + (item.status || 'pending').slice(1)}
          </Text>
        </View>

        {/* Always show Accept/Reject buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleRequestAction(item.id.toString(), 'accepted')}
            disabled={processingRequestId === item.id.toString()}
          >
            {processingRequestId === item.id.toString() ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Accept</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleRequestAction(item.id.toString(), 'rejected')}
            disabled={processingRequestId === item.id.toString()}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Requests</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading requests...</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item, index) => `request_${item.id || index}`}
          renderItem={renderRequestItem}
          contentContainerStyle={
            requests.length === 0 ? styles.emptyContainer : styles.listContainer
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No requests found.</Text>
              <TouchableOpacity onPress={fetchRequests} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default PendingRequestsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },

  backButton: {
    marginRight: 16,
    padding: 4,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    flex: 1,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },

  listContainer: {
    flexGrow: 1,
  },

  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#fff',
  },

  name: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },

  role: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },

  date: {
    fontSize: 13,
    color: '#999',
    marginBottom: 2,
  },

  status: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },

  actions: {
    flexDirection: 'row',
    marginLeft: 12,
  },

  button: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },

  acceptButton: {
    backgroundColor: '#4CD964',
  },

  rejectButton: {
    backgroundColor: '#FF6B6B',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
  },

  emptyText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
