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
import { getConsumerRequests, manageConsumerRequest } from '../../apiServices/allApi';

type RootStackParamList = {
  VendorConsumerRequests: undefined;
  VendorHome: undefined;
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
  const [requests, setRequests] = useState<ConsumerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getConsumerRequests();
      const data = response?.data?.data || response?.data || [];
      
      // Map and format the data
      const formattedRequests = Array.isArray(data) ? data.map((item: any, index: number) => ({
        id: item.id || item.request_id || index,
        request_id: item.request_id || item.id || index,
        customer_id: item.customer_id || item.consumer_id || 0,
        customer_name: item.customer_name || item.consumer_name || 'Unknown Consumer',
        customer_contact: item.customer_contact || item.contact,
        date: item.date || item.request_date || new Date().toISOString().split('T')[0],
        cow_milk_quantity: item.cow_milk_quantity || 0,
        buffalo_milk_quantity: item.buffalo_milk_quantity || 0,
        total_quantity: (item.cow_milk_quantity || 0) + (item.buffalo_milk_quantity || 0),
        status: item.status || 'pending',
        created_at: item.created_at || new Date().toISOString(),
        distributor_name: item.distributor_name || item.milkman_name,
      })) : [];

      // Filter only pending requests
      const pendingRequests = formattedRequests.filter((req: ConsumerRequest) => 
        req.status === 'pending'
      );

      setRequests(pendingRequests);
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
      fetchRequests();
    }, [fetchRequests])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests();
  }, [fetchRequests]);

  const handleManageRequest = async (requestId: number, action: 'accept' | 'reject') => {
    const actionText = action === 'accept' ? 'Accept' : 'Reject';
    
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
              setProcessingId(requestId);
              await manageConsumerRequest({ request_id: requestId, action });
              
              Alert.alert(
                'Success',
                `Request ${action}ed successfully!`,
                [{ text: 'OK', onPress: () => fetchRequests() }]
              );
            } catch (error: any) {
              console.error(`Error ${action}ing request:`, error);
              Alert.alert(
                'Error',
                error?.response?.data?.message || `Failed to ${action} request`
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

  const renderRequestItem = ({ item }: { item: ConsumerRequest }) => {
    const isProcessing = processingId === item.request_id;

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
          <View style={styles.statusBadge}>
            <Ionicons name="time-outline" size={14} color="#FF9500" />
            <Text style={styles.statusText}>PENDING</Text>
          </View>
        </View>

        <View style={styles.requestBody}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{formatDate(item.date)}</Text>
          </View>

          <View style={styles.milkQuantities}>
            {item.cow_milk_quantity > 0 && (
              <View style={styles.milkItem}>
                <Ionicons name="water-outline" size={16} color="#007AFF" />
                <Text style={styles.milkText}>Cow: {item.cow_milk_quantity}L</Text>
              </View>
            )}
            {item.buffalo_milk_quantity > 0 && (
              <View style={styles.milkItem}>
                <Ionicons name="water-outline" size={16} color="#34C759" />
                <Text style={styles.milkText}>Buffalo: {item.buffalo_milk_quantity}L</Text>
              </View>
            )}
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Quantity:</Text>
            <Text style={styles.totalValue}>{item.total_quantity}L</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleManageRequest(item.request_id, 'reject')}
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
            onPress={() => handleManageRequest(item.request_id, 'accept')}
            disabled={isProcessing}
            activeOpacity={0.7}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.acceptButtonText}>Accept</Text>
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
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading requests...</Text>
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
          <Text style={styles.headerTitle}>Consumer Requests</Text>
          <Text style={styles.headerSubtitle}>
            Extra milk when distributor on leave
          </Text>
        </View>
      </View>

      {requests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="water-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>No Pending Requests</Text>
          <Text style={styles.emptySubtitle}>
            Consumer extra milk requests will appear here when their distributor is on leave
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
