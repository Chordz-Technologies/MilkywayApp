import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator, Platform, ScrollView, Animated, } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState, AppDispatch } from '../../store';
// import { logout } from '../../store/authSlice';
import {
  getVendorDetailsById,
  getVendorPendingRequests,
  getConsumerRequests, // <-- NEW
  getDistributorLeaveRequestsForVendor,
  postDashboardSummaryAPI, // <-- NEW
} from '../../apiServices/allApi';
import { getUnreadCount, markAllAsRead, showLocalNotification, notificationEmitter } from '../../notifications/NotificationService';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import MonthPicker from "react-native-month-year-picker";
import SafeAreaWrapper from '../../styles/SafeAreaWrapper';

// Navigation Types
type RootStackParamList = {
  VendorHome: undefined;
  VendorProfile: undefined;
  PendingRequests: undefined;
  VendorConsumerRequests: undefined; // <-- NEW
  VendorDistributorLeave: undefined; // <-- NEW
  VendorSubscription: undefined; // <-- NEW
  AllConsumersList: undefined;
  DistributorsList: undefined;
  Notifications: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VendorHome'>;

// SKELETON LOADER COMPONENT
const SkeletonLoader = () => {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.skeletonContainer}>
        <View style={styles.skeletonHeader}>
          <View style={styles.skeletonTitle} />
          <View style={styles.skeletonSubtitle} />
        </View>

        <View style={styles.skeletonProfileCard}>
          <View style={styles.skeletonAvatar} />
          <View style={styles.skeletonProfileInfo}>
            <View style={styles.skeletonProfileName} />
            <View style={styles.skeletonProfileLocation} />
          </View>
        </View>

        <View style={styles.skeletonStatsGrid}>
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.skeletonStatCard}>
              <View style={styles.skeletonStatIcon} />
              <View style={styles.skeletonStatValue} />
              <View style={styles.skeletonStatLabel} />
            </View>
          ))}
        </View>

        <View style={styles.loadingIndicatorContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading ...</Text>
        </View>
      </View>
    </View>
  );
};

// ANIMATED STAT CARD COMPONENT
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
  // const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [vendorData, setVendorData] = useState<any>(null);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [consumerExtraMilkRequests, setConsumerExtraMilkRequests] = useState<any[]>([]); // <-- NEW
  const [distributorLeaveRequests, setDistributorLeaveRequests] = useState<any[]>([]); // <-- NEW
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    total_consumer: 0,
    total_distributor: 0,
    total_billed_amount: 0,
    total_overdue_amount: 0,
    pending_request_count: 0,
    consumer_extra_milk_amount: 0,
    distributor_leave_count: 0,
  });

  const loadNotificationCount = async () => {
    try {
      const count = await getUnreadCount();
      setNotificationCount(count);
    } catch (error) {
      console.error('Error loading notification count:', error);
    }
  };

  useEffect(() => {
    loadNotificationCount();

    // Listen for updates via emitter
    const updateBadge = async () => {
      const count = await getUnreadCount();
      setNotificationCount(count);
    };
    notificationEmitter.on('newNotification', updateBadge);

    // Handle FCM foreground messages - FIXED VERSION
    const unsubscribe = messaging().onMessage(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      console.log('Foreground message:', remoteMessage);
      const notificationRaw = remoteMessage.notification || {
        title: remoteMessage.data?.title,
        body: remoteMessage.data?.body,
      };
      const notification = {
        title: typeof notificationRaw.title === 'string' ? notificationRaw.title : JSON.stringify(notificationRaw.title),
        body: typeof notificationRaw.body === 'string' ? notificationRaw.body : JSON.stringify(notificationRaw.body),
      };
      await showLocalNotification(notification);
    });

    return () => {
      unsubscribe();
      notificationEmitter.removeListener('newNotification', updateBadge);
    };
  }, []);

  const fetchDashboardSummary = useCallback(async (month?: number, year?: number) => {
    try {
      const vendorId = user?.userID;
      if (!vendorId) throw new Error('Vendor ID not found. Please log in again.');
      const payload = { vendor_id: vendorId, month: month ?? selectedMonth.getMonth() + 1, year: year ?? selectedMonth.getFullYear() };
      const response = await postDashboardSummaryAPI(payload);

      if (response?.data?.status === 'success') {
        setDashboardData(response.data.data);
      }
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
    }
  }, [selectedMonth, user?.userID]);

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
        const vData = vendorRes.data?.data || vendorRes.data;
        setVendorData(vData);
      } catch (vendorError) {
        console.error('Vendor profile fetch error:', vendorError);
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

      // <-- NEW: Fetch Consumer Extra Milk Requests (when distributor on leave)
      try {
        const consumerReqRes = await getConsumerRequests(vendorId);
        const consumerReqData = consumerReqRes?.data?.data?.extra_milk_requests || [];
        setConsumerExtraMilkRequests(Array.isArray(consumerReqData) ? consumerReqData : []);
        console.log('✅ Consumer extra milk requests fetched:', consumerReqData.length);
      } catch (consumerReqError: any) {
        console.error('Consumer requests fetch error:', consumerReqError);
        console.log('Consumer fetch error:', JSON.stringify(consumerReqError?.response?.data, null, 2));
        setConsumerExtraMilkRequests([]);
      }

      // <-- NEW: Fetch Distributor Leave Requests
      try {
        const distributorLeaveRes = await getDistributorLeaveRequestsForVendor(vendorId);
        const distributorLeaveData = distributorLeaveRes?.data?.data || distributorLeaveRes?.data || [];
        setDistributorLeaveRequests(Array.isArray(distributorLeaveData) ? distributorLeaveData : []);
        console.log('✅ Distributor leave requests fetched:', distributorLeaveData.length);
      } catch (distributorLeaveError) {
        console.error('Distributor leave requests fetch error:', distributorLeaveError);
        setDistributorLeaveRequests([]);
      }

      // Fetch dashboard for current month
      fetchDashboardSummary();
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

  const onMonthChange = (_: any, date?: Date) => {
    setShowMonthPicker(false);
    if (date) {
      setSelectedMonth(date);
      fetchDashboardSummary(date.getMonth() + 1, date.getFullYear());
    }
  };
  // const handleLogout = useCallback(() => {
  //   Alert.alert('Logout', 'Are you sure you want to log out?', [
  //     { text: 'Cancel', style: 'cancel' },
  //     {
  //       text: 'Logout',
  //       style: 'destructive',
  //       onPress: async () => {
  //         try {
  //           await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
  //           dispatch(logout());
  //           navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  //         } catch (err) {
  //           console.error('Logout error:', err);
  //         }
  //       },
  //     },
  //   ]);
  // }, [dispatch, navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData]),
  );

  const getInitials = (name: string) => {
    if (!name) { return 'V'; }
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const village = vendorData?.location?.split(',')[2]?.trim() || vendorData?.village || 'No village provided';
  const vendorName = vendorData?.name || vendorData?.business_name || 'Vendor Name';

  if (!isAuthenticated || !user?.userID || isLoading) {
    return <SkeletonLoader />;
  }

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
      value: dashboardData.total_consumer,
      subtext: 'Active Today',
      backgroundColor: '#E8F4FD',
      iconBg: '#007AFF',
      iconColor: '#fff',
      trending: 'up',
    },
    {
      icon: 'business-outline',
      label: 'Total Distributors',
      value: dashboardData.total_distributor,
      subtext: 'Working Now',
      backgroundColor: '#FFF4E6',
      iconBg: '#FF9500',
      iconColor: '#fff',
      trending: 'up',
    },
    {
      icon: 'cash-outline',
      label: 'Total Billed Amount',
      value: dashboardData.total_billed_amount,
      subtext: 'This Month',
      backgroundColor: '#E8F8F0',
      iconBg: '#34C759',
      iconColor: '#fff',
      trending: 'up',
    },
    {
      icon: 'alert-circle-outline',
      label: 'Total Overdue Amount',
      value: dashboardData.total_overdue_amount,
      subtext: 'Need Action',
      backgroundColor: '#FFE8E8',
      iconBg: '#FF3B30',
      iconColor: '#fff',
      trending: 'down',
    },
  ];

  const handleCardPress = (label: string) => {
    if (label === 'Total Consumers') {
      navigation.navigate('AllConsumersList');
    } else if (label === 'Total Distributors') {
      navigation.navigate('DistributorsList');
    } else {
      console.log('No navigation for:', label);
    }
  };

  return (
    <SafeAreaWrapper>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* HEADER WITH NOTIFICATION */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.headerTitle}>Vendor Home</Text>
              <Text style={styles.headerSubtitle}>Welcome back! 👋</Text>
            </View>
            <View style={styles.headerActions}>
              {/* ✅ Calendar Button */}
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => setShowMonthPicker(true)}
              >
                <Ionicons name="calendar-outline" size={24} color="#007AFF" />
              </TouchableOpacity>

              {/* Month Picker */}
              {showMonthPicker && (
                <MonthPicker
                  onChange={onMonthChange}
                  value={selectedMonth}
                  minimumDate={new Date(2023, 0)}
                  maximumDate={new Date()}
                  locale="en"
                />
              )}

              {/* Notification Button */}
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={async () => {
                  await markAllAsRead();
                  setNotificationCount(0);
                  navigation.navigate('Notifications');
                }}
              >
                <View>
                  <Ionicons name="notifications-outline" size={24} color="#333" />
                  {notificationCount > 0 && (
                    <View
                      style={{
                        position: 'absolute',
                        right: -6,
                        top: -3,
                        backgroundColor: 'red',
                        borderRadius: 10,
                        paddingHorizontal: 5,
                        paddingVertical: 1,
                        minWidth: 18,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                        {notificationCount}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>

              {/* Logout Button */}
              {/* <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            </TouchableOpacity> */}
            </View>
          </View>

          {/* PROFILE CARD */}
          <TouchableOpacity
            style={styles.profileCard}
            onPress={() => navigation.navigate('VendorProfile')}
            activeOpacity={0.8}
          >
            <View style={styles.profileImageContainer}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitials}>{getInitials(vendorName)}</Text>
              </View>
              <View style={styles.editBadge}>
                <Ionicons name="pencil" size={12} color="#fff" />
              </View>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{vendorName}</Text>
              <Text style={styles.profileLocation}>{village}</Text>
              <View style={styles.profileBadge}>
                <Text style={styles.profileBadgeText}>Premium ⭐</Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          {/* STATS GRID */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Analytics Overview</Text>
            <View style={styles.statsGrid}>
              {statsData.map((stat, index) => (
                <AnimatedStatCard
                  key={index}
                  stat={stat}
                  onPress={() => handleCardPress(stat.label)}
                />
              ))}
            </View>
          </View>

          {/* PENDING REQUESTS */}
          <TouchableOpacity
            style={styles.pendingCard}
            onPress={() => navigation.navigate('PendingRequests')}
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
              <Text style={styles.pendingCount}>{dashboardData.pending_request_count}</Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          {/* <-- NEW: CONSUMER EXTRA MILK REQUESTS CARD */}
          <TouchableOpacity
            style={styles.pendingCard}
            onPress={() => navigation.navigate('VendorConsumerRequests')}
            activeOpacity={0.8}
          >
            <View style={styles.pendingLeft}>
              <View style={[styles.pendingIconContainer, { backgroundColor: '#E8F4FD' }]}>
                <Ionicons name="water" size={24} color="#007AFF" />
              </View>
              <View>
                <Text style={styles.pendingTitle}>Consumer Extra Milk</Text>
                <Text style={styles.pendingSubtitle}>Extra milk requests from consumers</Text>
              </View>
            </View>
            <View style={styles.pendingRight}>
              <Text style={[styles.pendingCount, { color: '#007AFF' }]}>
                {dashboardData.consumer_extra_milk_amount}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          {/* <-- NEW: DISTRIBUTOR LEAVE REQUESTS CARD */}
          <TouchableOpacity
            style={styles.pendingCard}
            onPress={() => navigation.navigate('VendorDistributorLeave')}
            activeOpacity={0.8}
          >
            <View style={styles.pendingLeft}>
              <View style={[styles.pendingIconContainer, { backgroundColor: '#FFF4E6' }]}>
                <Ionicons name="calendar" size={24} color="#FF9500" />
              </View>
              <View>
                <Text style={styles.pendingTitle}>Distributor Leave</Text>
                <Text style={styles.pendingSubtitle}>Leave requests from distributors</Text>
              </View>
            </View>
            <View style={styles.pendingRight}>
              <Text style={[styles.pendingCount, { color: '#FF9500' }]}>
                {dashboardData.distributor_leave_count}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pendingCard}
            onPress={() => navigation.navigate('VendorSubscription')}
            activeOpacity={0.8}
          >
            <View style={styles.pendingLeft}>
              <View style={[styles.pendingIconContainer, { backgroundColor: '#E8F4FD' }]}>
                <Ionicons name="cash-outline" size={24} color="#007AFF" />
              </View>
              <View>
                <Text style={styles.pendingTitle}>Subscriptions</Text>
                <Text style={styles.pendingSubtitle}>Choose your preferred plan here</Text>
              </View>
            </View>
            <View style={styles.pendingRight}>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default VendorHomeScreen;

// Styles remain the same as your original file
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 35,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  // LOADING
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

  // HEADER WITH NOTIFICATION
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    position: 'relative',
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
  // logoutButton: {
  //   padding: 8,
  //   borderRadius: 8,
  //   backgroundColor: '#fff',
  //   ...Platform.select({
  //     ios: {
  //       shadowColor: '#000',
  //       shadowOpacity: 0.1,
  //       shadowRadius: 4,
  //       shadowOffset: { width: 0, height: 2 },
  //     },
  //     android: {
  //       elevation: 2,
  //     },
  //   }),
  // },

  // PROFILE CARD
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
  profileImageContainer: {
    position: 'relative',
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#34C759',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
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

  // STATS
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
    minHeight: 135,
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

  // PENDING
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

  // EMPTY
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

  // ERROR
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
