
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
  BackHandler,
  Platform,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index';
import {
  getAcceptedMilkmen,
  assignConsumerToDistributor,
} from '../../apiServices/allApi';

type Distributor = {
  id: number;
  full_name: string;
  phone_number: string;
  email?: string;
  status: string;
  vendor_id: number;
  assigned_customers_count?: number;
};

type Consumer = {
  id: number;
  name: string;
  vendor: number;
  status: string;
  user_type: 'customer' | 'milkman';
  user_contact: string;
  vendor_name: string;
  milk_requirement: {
    cow_milk_litre: number | null;
    buffalo_milk_litre: number | null;
  };
  object_id: number;
};

type RouteParams = {
  AssignDistributor: {
    consumer: Consumer;
  };
};

type AssignDistributorRouteProp = RouteProp<RouteParams, 'AssignDistributor'>;

const AssignDistributorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<AssignDistributorRouteProp>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const { consumer } = route.params;

  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [filteredDistributors, setFilteredDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [selectedDistributorId, setSelectedDistributorId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('VendorHome' as never);
    }
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      handleGoBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [handleGoBack]);

  const getConsumerName = useCallback(() => {
    return consumer.name || 'Unknown Consumer';
  }, [consumer]);

  const fetchDistributors = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const vendorId = user?.userID;

      if (!vendorId) {
        throw new Error('Vendor ID not found. Please log in again.');
      }

      console.log('🔍 Current vendor ID:', vendorId, typeof vendorId);
      console.log('🔍 Consumer vendor ID:', consumer.vendor, typeof consumer.vendor);

      // Verify vendor match first
      if (Number(vendorId) !== Number(consumer.vendor)) {
        console.log('⚠️ VENDOR MISMATCH DETECTED!');
        console.log('Current user vendor:', vendorId);
        console.log('Consumer vendor:', consumer.vendor);

        Alert.alert(
          'Vendor Mismatch',
          'This consumer belongs to a different vendor. You cannot assign distributors to consumers from other vendors.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
        return;
      }

      // Fetch distributors for the current vendor
      const response = await getAcceptedMilkmen(vendorId);
      console.log('📦 Distributors API Response:', JSON.stringify(response.data, null, 2));

      const data = response.data?.data || response.data || [];

      if (Array.isArray(data) && data.length > 0) {
        const transformedDistributors = data.map((item: any, index: number) => {
          const distributor = {
            id: item.milkman_id || item.id || index + 1,
            full_name: item.milkman_name || item.full_name || `Distributor ${index + 1}`,
            phone_number: item.milkman_contact || item.phone_number || 'N/A',
            email: item.email || '',
            status: item.status || 'active',
            vendor_id: Number(vendorId), // All distributors from this API belong to current vendor
            assigned_customers_count: item.assigned_customers_count || 0,
          };

          console.log(`✅ Distributor ${distributor.id}: ${distributor.full_name} (Vendor: ${distributor.vendor_id})`);
          return distributor;
        });

        // Filter only active distributors
        const activeDistributors = transformedDistributors.filter(d =>
          d.status?.toLowerCase() === 'accepted' || d.status?.toLowerCase() === 'active'
        );

        console.log('✅ Active distributors for assignment:', activeDistributors.length);
        setDistributors(activeDistributors);
        setFilteredDistributors(activeDistributors);
      } else {
        console.log('❌ No distributor data found');
        setDistributors([]);
        setFilteredDistributors([]);
      }

    } catch (err: any) {
      console.error('❌ Error fetching distributors:', err);

      let errorMessage = 'Failed to load distributors.';
      if (err.response?.status === 404) {
        errorMessage = 'No distributors found for this vendor.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setDistributors([]);
      setFilteredDistributors([]);
    }

    setLoading(false);
    setRefreshing(false);
  }, [user?.userID, consumer.vendor, navigation]);

  useEffect(() => {
    fetchDistributors();
  }, [fetchDistributors]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDistributors();
  }, [fetchDistributors]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDistributors(distributors);
    } else {
      const filtered = distributors.filter(distributor =>
        distributor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        distributor.phone_number.includes(searchQuery)
      );
      setFilteredDistributors(filtered);
    }
  }, [searchQuery, distributors]);

  const handleAssignDistributor = useCallback(async (distributorId: number) => {
    if (processing) {return;}

    setSelectedDistributorId(distributorId);
    setProcessing(true);

    try {
      const selectedDistributor = distributors.find(d => d.id === distributorId);

      if (!selectedDistributor) {
        Alert.alert('Error', 'Selected distributor not found.');
        return;
      }

      // Final vendor validation before assignment
      console.log('🔍 Final Assignment Validation:');
      console.log('Current user (vendor) ID:', user?.userID, typeof user?.userID);
      console.log('Consumer vendor ID:', consumer.vendor, typeof consumer.vendor);
      console.log('Selected distributor vendor ID:', selectedDistributor.vendor_id, typeof selectedDistributor.vendor_id);

      const currentVendorId = Number(user?.userID);
      const consumerVendorId = Number(consumer.vendor);
      const distributorVendorId = Number(selectedDistributor.vendor_id);

      if (currentVendorId !== consumerVendorId) {
        Alert.alert('Error', 'Consumer belongs to a different vendor.');
        return;
      }

      if (currentVendorId !== distributorVendorId) {
        Alert.alert('Error', 'Distributor belongs to a different vendor.');
        return;
      }

      console.log('✅ All vendor IDs match. Proceeding with assignment...');

      const assignmentData = {
        customer_id: consumer.object_id,
        milkman_id: distributorId,
      };

      console.log('🔄 Assignment payload:', assignmentData);

      const response = await assignConsumerToDistributor(assignmentData);

      console.log('✅ Assignment successful:', response.data);

      Alert.alert(
        'Success!',
        `${getConsumerName()} has been assigned to ${selectedDistributor.full_name}.`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('VendorHome' as never);
            },
          },
        ]
      );

    } catch (err: any) {
      console.error('❌ Assignment error:', err);
      console.error('❌ Error response:', err.response?.data);

      let errorMessage = 'Failed to assign consumer.';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 404) {
        if (err.response.data?.message?.includes('not accepted by the same vendor')) {
          errorMessage = 'Vendor validation failed. Please ensure both customer and distributor belong to your vendor account.';
        } else {
          errorMessage = 'Customer or distributor not found.';
        }
      }

      Alert.alert('Assignment Error', errorMessage);
      setSelectedDistributorId(null);
    } finally {
      setProcessing(false);
    }
  }, [processing, consumer, distributors, navigation, getConsumerName, user?.userID]);

  const renderDistributorItem = ({ item }: { item: Distributor }) => {
    const isSelected = selectedDistributorId === item.id;
    const isProcessing = processing && selectedDistributorId === item.id;

    return (
      <TouchableOpacity
        style={[styles.distributorItem, isSelected && styles.selectedItem]}
        onPress={() => handleAssignDistributor(item.id)}
        disabled={processing}
      >
        <View style={styles.distributorContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="business" size={24} color="#fff" />
            </View>
          </View>

          <View style={styles.contentSection}>
            <Text style={styles.name}>{item.full_name}</Text>
            <Text style={styles.contact}>{item.phone_number}</Text>
            {item.email && <Text style={styles.email}>{item.email}</Text>}
            <Text style={styles.status}>{item.status?.toUpperCase()}</Text>
            {item.assigned_customers_count !== undefined && item.assigned_customers_count > 0 && (
              <Text style={styles.customerCount}>
                {item.assigned_customers_count} customers assigned
              </Text>
            )}
          </View>

          <View style={styles.actionContainer}>
            {isProcessing ? (
              <ActivityIndicator color="#007AFF" size="small" />
            ) : (
              <Ionicons
                name={isSelected ? 'checkmark-circle' : 'add-circle-outline'}
                size={24}
                color={isSelected ? '#34C759' : '#007AFF'}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!isAuthenticated || !user?.userID) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Assign Distributor</Text>
          <Text style={styles.headerSubtitle}>For: {getConsumerName()}</Text>
        </View>
      </View>

      {/* Consumer Info */}
      <View style={styles.consumerCard}>
        <Text style={styles.consumerName}>{getConsumerName()}</Text>
        <Text style={styles.consumerContact}>{consumer.user_contact}</Text>
        <Text style={styles.assignmentNote}>Select a distributor to assign this consumer</Text>
      </View>

      {/* Vendor Info Card */}
      <View style={styles.vendorInfoCard}>
        <Text style={styles.vendorInfoTitle}>Vendor Information</Text>
        <Text style={styles.vendorInfoText}>
          Consumer Vendor: {consumer.vendor} | Current Vendor: {user?.userID}
        </Text>
        {Number(user?.userID) === Number(consumer.vendor) ? (
          <Text style={styles.vendorMatch}>✅ Vendor match - Assignment allowed</Text>
        ) : (
          <Text style={styles.vendorMismatch}>❌ Vendor mismatch - Assignment blocked</Text>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search distributors..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#8E8E93"
        />
      </View>

      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchDistributors} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text>Loading distributors...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDistributors}
          keyExtractor={(item, index) => `distributor_${item.id || index}`}
          renderItem={renderDistributorItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="business-outline" size={80} color="#E5E5EA" />
              <Text style={styles.emptyTitle}>No Distributors Available</Text>
              <Text style={styles.emptyText}>
                {searchQuery
                  ? `No distributors match "${searchQuery}".`
                  : 'No distributors available for assignment from your vendor account.'
                }
              </Text>
              <TouchableOpacity onPress={fetchDistributors} style={styles.refreshButton}>
                <Ionicons name="refresh-outline" size={20} color="#fff" />
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },

  // Consumer Info
  consumerCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
    elevation: 1,
  },
  consumerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  consumerContact: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
  },
  assignmentNote: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
    marginTop: 8,
  },

  // Vendor Info Card
  vendorInfoCard: {
    backgroundColor: '#F8F9FA',
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  vendorInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  vendorInfoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  vendorMatch: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: 'bold',
  },
  vendorMismatch: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: 'bold',
  },

  // Search
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    elevation: 1,
  },

  // Error
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEB',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Loading
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#8E8E93',
    fontSize: 16,
  },

  // List
  listContainer: {
    paddingBottom: 40,
  },

  // Distributor Item
  distributorItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 2,
  },
  selectedItem: {
    borderColor: '#34C759',
    backgroundColor: '#F0FFF4',
  },
  distributorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },

  // Avatar
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Content
  contentSection: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  contact: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#34C759',
    marginTop: 4,
  },
  customerCount: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },

  // Action
  actionContainer: {
    marginLeft: 16,
    alignItems: 'center',
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AssignDistributorScreen;
