import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/authSlice';
import {
  getVendorDetailsById,
  getAcceptedCustomers,
  getAcceptedMilkmen,
  getVendorPendingRequests,
} from '../../apiServices/allApi';

type AcceptedItem = {
  id: number;
  user_id: number;
  status: string;
  customer?: {
    id: number;
    first_name: string;
    last_name: string;
  } | null;
  milkman?: {
    id: number;
    full_name: string;
  };
  name?: string | null;
  user_type: 'customer' | 'milkman';
  user_contact: string;
  vendor: number;
  assigned_customers_count?: number;
};

type NavigationProp = any;

// SKELETON LOADER COMPONENT
const SkeletonLoader = () => {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.skeletonContainer}>
        {/* Header Skeleton */}
        <View style={styles.skeletonHeader}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonSubtitle} />
        </View>

        {/* Profile Card Skeleton */}
        <View style={styles.skeletonProfileCard}>
          <View style={styles.skeletonAvatar} />
          <View style={styles.skeletonProfileInfo}>
            <View style={styles.skeletonProfileName} />
            <View style={styles.skeletonProfileLocation} />
          </View>
        </View>

        {/* Stats Cards Skeleton */}
        <View style={styles.skeletonStatsGrid}>
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.skeletonStatCard}>
              <View style={styles.skeletonStatIcon} />
              <View style={styles.skeletonStatValue} />
              <View style={styles.skeletonStatLabel} />
            </View>
          ))}
        </View>

        {/* Loading Indicator */}
        <View style={styles.loadingIndicatorContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading ...</Text>
        </View>
      </View>
    </View>
  );
};

// ANIMATED STAT CARD COMPONENT - 2 PER ROW
const AnimatedStatCard = ({ stat, onPress }: { stat: any; onPress?: () => void }) => {
  const scaleValue = useState(new Animated.Value(1))[0];

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      style={styles.statCardContainer}
    >
      <Animated.View
        style={[
          styles.statCard,
          {
            backgroundColor: stat.backgroundColor,
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        <View style={[styles.iconCircle, { backgroundColor: stat.iconBg }]}>
          <Ionicons name={stat.icon} size={24} color={stat.iconColor} />
        </View>

        <View style={styles.statContent}>
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
          <Text style={styles.statSubtext}>{stat.subtext}</Text>
        </View>

        <View style={styles.statTrend}>
          <Ionicons
            name={stat.trending === 'up' ? 'trending-up' : 'trending-down'}
            size={16}
            color={stat.trending === 'up' ? '#34C759' : '#FF3B30'}
          />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const VendorHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [vendorData, setVendorData] = useState<any>(null);
  const [acceptedConsumers, setAcceptedConsumers] = useState<AcceptedItem[]>([]);
  const [acceptedDistributors, setAcceptedDistributors] = useState<AcceptedItem[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'consumer' | 'distributor'>('consumer');

  const fetchData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const vendorId = user?.userID;

      if (!vendorId) {
        throw new Error('Vendor ID not found. Please log in again.');
      }

      console.log('🔍 Fetching data for vendor ID:', vendorId);

      // Fetch Vendor Profile
      try {
        const vendorRes = await getVendorDetailsById(vendorId);
        console.log('Vendor profile response:', vendorRes.data);
        const vData = vendorRes.data?.data || vendorRes.data;
        setVendorData(vData);
      } catch (vendorError) {
        console.error('Vendor profile fetch error:', vendorError);
      }

      // Fetch Accepted Consumers - FIXED MAPPING
      try {
        const consumerRes = await getAcceptedCustomers(vendorId);
        console.log('🔍 Raw consumer response:', JSON.stringify(consumerRes.data, null, 2));
        
        let consumersData = consumerRes?.data?.data || consumerRes?.data || [];
        if (!Array.isArray(consumersData)) {
          console.log('❌ Consumer data is not array:', typeof consumersData);
          consumersData = [];
        }

        console.log('📊 Total raw consumers:', consumersData.length);

        // Map the API response to the expected format
        const mappedConsumers = consumersData.map((item: any, index: number) => ({
          id: item.join_request_id || item.customer_id || index + 1,
          user_id: item.customer_id || item.user_id || index + 1,
          status: item.status || 'accepted',
          customer: item.customer_name ? {
            id: item.customer_id || index + 1,
            first_name: item.customer_name?.split(' ')[0] || 'Unknown',
            last_name: item.customer_name?.split(' ').slice(1).join(' ') || '',
          } : null,
          name: item.customer_name || item.name || `Consumer ${index + 1}`,
          user_type: 'customer' as const,
          user_contact: item.customer_contact || item.contact || 'No contact',
          vendor: item.vendor_id || vendorId,
        }));

        console.log('✅ Mapped consumers:', mappedConsumers.length, mappedConsumers);
        setAcceptedConsumers(mappedConsumers);
      } catch (consumerError) {
        console.error('Consumer fetch error:', consumerError);
        setAcceptedConsumers([]);
      }

      // Fetch Accepted Distributors - FIXED MAPPING
      try {
        const distributorRes = await getAcceptedMilkmen(vendorId);
        console.log('🔍 Raw distributor response:', JSON.stringify(distributorRes.data, null, 2));
        
        let distributorsData = distributorRes?.data?.data || distributorRes?.data || [];
        if (!Array.isArray(distributorsData)) {
          console.log('❌ Distributor data is not array:', typeof distributorsData);
          distributorsData = [];
        }

        console.log('📊 Total raw distributors:', distributorsData.length);

        // Map the API response to the expected format
        const mappedDistributors = distributorsData.map((item: any, index: number) => ({
          id: item.join_request_id || item.milkman_id || index + 1,
          user_id: item.milkman_id || item.user_id || index + 1,
          status: item.status || 'accepted',
          milkman: {
            id: item.milkman_id || index + 1,
            full_name: item.milkman_name || 'Unknown Distributor',
          },
          name: item.milkman_name || `Distributor ${index + 1}`,
          user_type: 'milkman' as const,
          user_contact: item.milkman_contact || 'No contact',
          vendor: item.vendor_id || vendorId,
          assigned_customers_count: item.assigned_customers_count || 0,
        }));

        console.log('✅ Mapped distributors:', mappedDistributors.length, mappedDistributors);
        setAcceptedDistributors(mappedDistributors);
      } catch (distributorError) {
        console.error('Distributor fetch error:', distributorError);
        setAcceptedDistributors([]);
      }

      // Fetch Pending Requests
      try {
        const pendingRes = await getVendorPendingRequests(vendorId);
        const pendingData = pendingRes?.data?.data || [];
        setPendingRequests(Array.isArray(pendingData) ? pendingData : []);
      } catch (pendingError) {
        console.error('Pending requests fetch error:', pendingError);
        setPendingRequests([]);
      }
    } catch (e: any) {
      console.error('General fetch data error:', e);
      setError(e.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [user?.userID]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const handleLogout = useCallback(() => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
            dispatch(logout());
            navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
          } catch (err) {
            console.error('Logout error:', err);
          }
        },
      },
    ]);
  }, [dispatch, navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return '#4CD964';
      case 'pending':
        return '#FFA500';
      case 'rejected':
        return '#FF6B6B';
      default:
        return '#4CD964'; // Default to green for accepted items
    }
  };

  // Extract village from vendorData.location string (third segment)
  const village = vendorData?.location?.split(',')[2]?.trim() || 'No village provided';

  // LOADING STATE WITH SKELETON
  if (!isAuthenticated || !user?.userID || isLoading) {
    return <SkeletonLoader />;
  }

  // ERROR STATE
  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statsData = [
    {
      icon: 'people-outline',
      label: 'Total Consumers',
      value: acceptedConsumers.length,
      subtext: 'Active Today',
      backgroundColor: '#E8F4FD',
      iconBg: '#007AFF',
      iconColor: '#fff',
      trending: 'up',
    },
    {
      icon: 'business-outline',
      label: 'Total Distributors',
      value: acceptedDistributors.length,
      subtext: 'Working Now',
      backgroundColor: '#FFF4E6',
      iconBg: '#FF9500',
      iconColor: '#fff',
      trending: 'up',
    },
    {
      icon: 'cash-outline',
      label: 'Total Billed Amount',
      value: 25000, // Replace with API data
      subtext: 'This Month',
      backgroundColor: '#E8F8F0',
      iconBg: '#34C759',
      iconColor: '#fff',
      trending: 'up',
    },
    {
      icon: 'alert-circle-outline',
      label: 'Total Overdue Amount',
      value: 15000, // Replace with API data
      subtext: 'Need Action',
      backgroundColor: '#FFE8E8',
      iconBg: '#FF3B30',
      iconColor: '#fff',
      trending: 'down',
    },
  ];

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Vendor Home</Text>
            <Text style={styles.headerSubtitle}>Welcome back! 👋</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={26} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        {/* PROFILE */}
        <View style={styles.profileCard}>
          <Image
            style={styles.avatar}
            source={{
              uri: vendorData?.profile_image || 'https://randomuser.me/api/portraits/men/32.jpg',
            }}
            defaultSource={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {vendorData?.name || vendorData?.business_name || 'Vendor Name'}
            </Text>
            <Text style={styles.profileLocation}>{village}</Text>
            <View style={styles.profileBadge}>
              <Text style={styles.profileBadgeText}>Premium ⭐</Text>
            </View>
          </View>
        </View>

        {/* STATS GRID - 2 CARDS PER ROW */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Analytics Overview</Text>
          <View style={styles.statsGrid}>
            {statsData.map((stat, index) => (
              <AnimatedStatCard
                key={index}
                stat={stat}
                onPress={() => {
                  console.log(`Pressed ${stat.label}`);
                }}
              />
            ))}
          </View>
        </View>

        {/* PENDING REQUESTS CARD */}
        <TouchableOpacity
          style={styles.pendingCard}
          onPress={() => {
            try {
              navigation.navigate('PendingRequests');
            } catch (navError) {
              console.error('Navigation error:', navError);
              Alert.alert('Error', 'Cannot navigate to Pending Requests screen');
            }
          }}
          activeOpacity={0.8}
        >
          <View style={styles.pendingLeft}>
            <View style={styles.pendingIconContainer}>
              <Ionicons name="notifications" size={24} color="#FF9500" />
            </View>
            <View>
              <Text style={styles.pendingTitle}>Pending Requests</Text>
              <Text style={styles.pendingSubtitle}>Requires your attention</Text>
            </View>
          </View>
          <View style={styles.pendingRight}>
            <Text style={styles.pendingCount}>{pendingRequests.length}</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </View>
        </TouchableOpacity>

        {/* TABS */}
        <View style={styles.tabContainer}>
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'consumer' && styles.activeTab]}
              onPress={() => setSelectedTab('consumer')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, selectedTab === 'consumer' && styles.activeTabText]}>
                Consumers ({acceptedConsumers.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'distributor' && styles.activeTab]}
              onPress={() => setSelectedTab('distributor')}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, selectedTab === 'distributor' && styles.activeTabText]}>
                Distributors ({acceptedDistributors.length})
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Enhanced DEBUG INFO */}
        {__DEV__ && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>🐛 Debug Info</Text>
            <Text style={styles.debugText}>Consumers: {acceptedConsumers.length}</Text>
            <Text style={styles.debugText}>Distributors: {acceptedDistributors.length}</Text>
            {acceptedConsumers.length > 0 && (
              <Text style={styles.debugText}>
                First Consumer: {acceptedConsumers[0]?.name}
              </Text>
            )}
            {acceptedDistributors.length > 0 && (
              <Text style={styles.debugText}>
                First Distributor: {acceptedDistributors[0]?.name}
              </Text>
            )}
          </View>
        )}

        {/* LIST */}
        <View style={styles.listContainer}>
          {selectedTab === 'consumer' ? (
            acceptedConsumers.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No accepted consumers found.</Text>
                <Text style={styles.emptySubtext}>Check console logs for more details</Text>
              </View>
            ) : (
              <FlatList
                data={acceptedConsumers}
                keyExtractor={(item, index) => `consumer_${item.id || index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
                    <View style={styles.listItemLeft}>
                      <View style={styles.avatarSmall}>
                        <Text style={styles.avatarText}>
                          {((item.customer?.first_name?.[0] || '') +
                            (item.customer?.last_name?.[0] || ''))
                            .toUpperCase() || item.name?.[0]?.toUpperCase() || 'U'}
                        </Text>
                      </View>
                      <View>
                        <Text style={styles.listItemText}>
                          {item.customer
                            ? `${item.customer.first_name} ${item.customer.last_name}`.trim()
                            : item.name || 'Unknown Consumer'}
                        </Text>
                        <Text style={styles.listItemSubtext}>
                          {item.user_contact || 'No contact'}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}
                    >
                      <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.status?.toUpperCase() || 'ACCEPTED'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            )
          ) : acceptedDistributors.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="business-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No accepted distributors found.</Text>
              <Text style={styles.emptySubtext}>Check console logs for more details</Text>
            </View>
          ) : (
            <FlatList
              data={acceptedDistributors}
              keyExtractor={(item, index) => `distributor_${item.id || index}`}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.listItem} activeOpacity={0.7}>
                  <View style={styles.listItemLeft}>
                    <View style={styles.avatarSmall}>
                      <Text style={styles.avatarText}>
                        {(item.milkman?.full_name?.[0] || item.name?.[0] || 'U').toUpperCase()}
                      </Text>
                    </View>
                    <View>
                      <Text style={styles.listItemText}>
                        {item.milkman?.full_name || item.name || 'Unknown Distributor'}
                      </Text>
                      <Text style={styles.listItemSubtext}>
                        {item.user_contact || 'No contact'}
                      </Text>
                      {item.assigned_customers_count !== undefined && item.assigned_customers_count > 0 && (
                        <Text style={styles.assignedCount}>
                          {item.assigned_customers_count} customers assigned
                        </Text>
                      )}
                    </View>
                  </View>
                  <View
                    style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}
                  >
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                      {item.status?.toUpperCase() || 'ACCEPTED'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default VendorHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },

  // LOADING SCREEN STYLES
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    justifyContent: 'flex-start',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  skeletonContainer: {
    paddingHorizontal: 20,
    width: '100%',
  },
  skeletonHeader: {
    marginBottom: 20,
  },
  skeletonTitle: {
    width: '60%',
    height: 28,
    backgroundColor: '#E1E9EE',
    borderRadius: 6,
    marginBottom: 8,
  },
  skeletonSubtitle: {
    width: '40%',
    height: 16,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
  skeletonProfileCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
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
  skeletonAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#E1E9EE',
  },
  skeletonProfileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  skeletonProfileName: {
    width: '70%',
    height: 20,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonProfileLocation: {
    width: '50%',
    height: 14,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
  },
  skeletonStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  skeletonStatCard: {
    width: '48%',
    height: 120,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  skeletonStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E1E9EE',
  },
  skeletonStatValue: {
    width: '60%',
    height: 24,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginTop: 8,
  },
  skeletonStatLabel: {
    width: '80%',
    height: 14,
    backgroundColor: '#E1E9EE',
    borderRadius: 4,
    marginTop: 4,
  },
  loadingIndicatorContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    fontWeight: '500',
  },

  // HEADER
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },

  // PROFILE
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
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
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e0e0e0',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  profileLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 8,
  },
  profileBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  profileBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // STATS SECTION - 2 PER ROW
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCardContainer: {
    width: '48%',
    marginBottom: 12,
  },
  statCard: {
    borderRadius: 16,
    padding: 16,
    minHeight: 195,
    justifyContent: 'space-between',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  statContent: {
    marginTop: 8,
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  statSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statTrend: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },

  // PENDING REQUESTS
  pendingCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
  pendingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF4E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pendingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  pendingSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  pendingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9500',
    marginRight: 8,
  },

  // TABS
  tabContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },

  // DEBUG INFO
  debugContainer: {
    backgroundColor: '#FFF3CD',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 4,
  },

  // LIST
  listContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  listItemSubtext: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  assignedCount: {
    fontSize: 11,
    color: '#FF9500',
    fontWeight: '600',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  // EMPTY STATE
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },

  // ERROR STATE
  errorText: {
    color: '#FF3B30',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
