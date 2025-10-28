
// // import React, { useEffect, useState, useCallback } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   FlatList,
// //   StyleSheet,
// //   RefreshControl,
// //   Alert,
// //   ActivityIndicator,
// //   Platform,
// //   ScrollView,
// //   Animated,
// // } from 'react-native';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import { useNavigation, useFocusEffect } from '@react-navigation/native';
// // import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import { useSelector, useDispatch } from 'react-redux';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { RootState, AppDispatch } from '../../store';
// // import { logout } from '../../store/authSlice';
// // import {
// //   getVendorDetailsById,
// //   getAcceptedCustomers,
// //   getAcceptedMilkmen,
// //   getVendorPendingRequests,
// // } from '../../apiServices/allApi';
// // import { getUnreadCount, markAllAsRead, showLocalNotification, notificationEmitter } from '../../notifications/NotificationService';
// // import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

// // // Navigation Types
// // type RootStackParamList = {
// //   VendorHome: undefined;
// //   VendorProfile: undefined;
// //   UserDetails: {
// //     userId: number;
// //     userType: 'consumer' | 'distributor';
// //     userName: string;
// //   };
// //   ConsumerCalendar: {
// //     viewerRole: 'vendor';
// //     targetConsumerId: number;
// //     targetConsumerName: string;
// //     showBackButton: boolean;
// //   };
// //   VendorDistributorCalendar: {
// //     viewerRole: 'vendor';
// //     targetDistributorId: number;
// //     targetDistributorName: string;
// //     showBackButton: boolean;
// //   };
// //   TemporaryDistributorAssignment: {
// //     consumerId: number;
// //     consumerName: string;
// //     currentDistributorId?: number;
// //     currentDistributorName?: string;
// //     isTemporary: boolean;
// //   };
// //   PendingRequests: undefined;
// //   Notifications: undefined;
// //   Login: undefined;
// // };

// // type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VendorHome'>;

// // type AcceptedItem = {
// //   id: number;
// //   user_id: number;
// //   status: string;
// //   customer?: {
// //     id: number;
// //     first_name: string;
// //     last_name: string;
// //   } | null;
// //   milkman?: {
// //     id: number;
// //     full_name: string;
// //   };
// //   name?: string | null;
// //   user_type: 'customer' | 'milkman';
// //   user_contact: string;
// //   vendor: number;
// //   assigned_customers_count?: number;
// //   assigned_distributor_id?: number;
// //   assigned_distributor_name?: string;
// //   has_temporary_distributor?: boolean;
// // };

// // // SKELETON LOADER COMPONENT
// // const SkeletonLoader = () => {
// //   return (
// //     <View style={styles.loadingContainer}>
// //       <View style={styles.skeletonContainer}>
// //         <View style={styles.skeletonHeader}>
// //           <View style={styles.skeletonTitle} />
// //           <View style={styles.skeletonSubtitle} />
// //         </View>

// //         <View style={styles.skeletonProfileCard}>
// //           <View style={styles.skeletonAvatar} />
// //           <View style={styles.skeletonProfileInfo}>
// //             <View style={styles.skeletonProfileName} />
// //             <View style={styles.skeletonProfileLocation} />
// //           </View>
// //         </View>

// //         <View style={styles.skeletonStatsGrid}>
// //           {[1, 2, 3, 4].map((item) => (
// //             <View key={item} style={styles.skeletonStatCard}>
// //               <View style={styles.skeletonStatIcon} />
// //               <View style={styles.skeletonStatValue} />
// //               <View style={styles.skeletonStatLabel} />
// //             </View>
// //           ))}
// //         </View>

// //         <View style={styles.loadingIndicatorContainer}>
// //           <ActivityIndicator size="large" color="#007AFF" />
// //           <Text style={styles.loadingText}>Loading ...</Text>
// //         </View>
// //       </View>
// //     </View>
// //   );
// // };

// // // ANIMATED STAT CARD COMPONENT
// // const AnimatedStatCard = ({ stat, onPress }: { stat: any; onPress?: () => void }) => {
// //   const scaleValue = useState(new Animated.Value(1))[0];

// //   const handlePressIn = () => {
// //     Animated.spring(scaleValue, {
// //       toValue: 0.96,
// //       useNativeDriver: true,
// //     }).start();
// //   };

// //   const handlePressOut = () => {
// //     Animated.spring(scaleValue, {
// //       toValue: 1,
// //       useNativeDriver: true,
// //     }).start();
// //   };

// //   return (
// //     <TouchableOpacity
// //       activeOpacity={0.8}
// //       onPressIn={handlePressIn}
// //       onPressOut={handlePressOut}
// //       onPress={onPress}
// //       style={styles.statCardContainer}
// //     >
// //       <Animated.View
// //         style={[
// //           styles.statCard,
// //           {
// //             backgroundColor: stat.backgroundColor,
// //             transform: [{ scale: scaleValue }],
// //           },
// //         ]}
// //       >
// //         <View style={[styles.iconCircle, { backgroundColor: stat.iconBg }]}>
// //           <Ionicons name={stat.icon} size={24} color={stat.iconColor} />
// //         </View>

// //         <View style={styles.statContent}>
// //           <Text style={styles.statValue}>{stat.value}</Text>
// //           <Text style={styles.statLabel}>{stat.label}</Text>
// //           <Text style={styles.statSubtext}>{stat.subtext}</Text>
// //         </View>

// //         <View style={styles.statTrend}>
// //           <Ionicons
// //             name={stat.trending === 'up' ? 'trending-up' : 'trending-down'}
// //             size={16}
// //             color={stat.trending === 'up' ? '#34C759' : '#FF3B30'}
// //           />
// //         </View>
// //       </Animated.View>
// //     </TouchableOpacity>
// //   );
// // };

// // const VendorHomeScreen = () => {
// //   const navigation = useNavigation<NavigationProp>();
// //   const dispatch = useDispatch<AppDispatch>();
// //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

// //   const [vendorData, setVendorData] = useState<any>(null);
// //   const [acceptedConsumers, setAcceptedConsumers] = useState<AcceptedItem[]>([]);
// //   const [acceptedDistributors, setAcceptedDistributors] = useState<AcceptedItem[]>([]);
// //   const [pendingRequests, setPendingRequests] = useState<any[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [selectedTab, setSelectedTab] = useState<'consumer' | 'distributor'>('consumer');
// //   const [notificationCount, setNotificationCount] = useState(0);

// //   const loadNotificationCount = async () => {
// //     try {
// //       const count = await getUnreadCount();
// //       setNotificationCount(count);
// //     } catch (error) {
// //       console.error('Error loading notification count:', error);
// //     }
// //   };

// //   useEffect(() => {
// //     loadNotificationCount();

// //     // Listen for updates via emitter
// //     const updateBadge = async () => {
// //       const count = await getUnreadCount();
// //       setNotificationCount(count);
// //     };
// //     notificationEmitter.on('newNotification', updateBadge);

// //     // Handle FCM foreground messages
// //     const unsubscribe = messaging().onMessage(async remoteMessage => {
// //       async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
// //         console.log('Foreground message:', remoteMessage);
// //         const notificationRaw = remoteMessage.notification || {
// //           title: remoteMessage.data?.title,
// //           body: remoteMessage.data?.body,
// //         };
// //         const notification = {
// //           title: typeof notificationRaw.title === 'string' ? notificationRaw.title : JSON.stringify(notificationRaw.title),
// //           body: typeof notificationRaw.body === 'string' ? notificationRaw.body : JSON.stringify(notificationRaw.body),
// //         };
// //         await showLocalNotification(notification);
// //       };
// //     });

// //     return () => {
// //       unsubscribe();
// //       notificationEmitter.removeListener('newNotification', updateBadge);
// //     };
// //   }, []);

// //   const fetchData = useCallback(async () => {
// //     setError(null);
// //     setIsLoading(true);
// //     try {
// //       const vendorId = user?.userID;

// //       if (!vendorId) {
// //         throw new Error('Vendor ID not found. Please log in again.');
// //       }

// //       console.log('🔍 Fetching data for vendor ID:', vendorId);

// //       // Fetch Vendor Profile
// //       try {
// //         const vendorRes = await getVendorDetailsById(vendorId);
// //         const vData = vendorRes.data?.data || vendorRes.data;
// //         setVendorData(vData);
// //       } catch (vendorError) {
// //         console.error('Vendor profile fetch error:', vendorError);
// //       }

// //       // Fetch Accepted Consumers
// //       try {
// //         const consumerRes = await getAcceptedCustomers(vendorId);
// //         let consumersData = consumerRes?.data?.data || consumerRes?.data || [];
// //         if (!Array.isArray(consumersData)) {
// //           consumersData = [];
// //         }

// //         const mappedConsumers = consumersData.map((item: any, index: number) => ({
// //           id: item.join_request_id || item.customer_id || index + 1,
// //           user_id: item.customer_id || item.user_id || index + 1,
// //           status: item.status || 'accepted',
// //           customer: item.customer_name ? {
// //             id: item.customer_id || index + 1,
// //             first_name: item.customer_name?.split(' ')[0] || 'Unknown',
// //             last_name: item.customer_name?.split(' ').slice(1).join(' ') || '',
// //           } : null,
// //           name: item.customer_name || item.name || `Consumer ${index + 1}`,
// //           user_type: 'customer' as const,
// //           user_contact: item.customer_contact || item.contact || 'No contact',
// //           vendor: item.vendor_id || vendorId,
// //           assigned_distributor_id: item.assigned_distributor_id || item.permanent_distributor_id,
// //           assigned_distributor_name: item.assigned_distributor_name || item.permanent_distributor_name,
// //           has_temporary_distributor: item.has_temporary_distributor || false,
// //         }));

// //         setAcceptedConsumers(mappedConsumers);
// //       } catch (consumerError) {
// //         console.error('Consumer fetch error:', consumerError);
// //         setAcceptedConsumers([]);
// //       }

// //       // Fetch Accepted Distributors
// //       try {
// //         const distributorRes = await getAcceptedMilkmen(vendorId);
// //         let distributorsData = distributorRes?.data?.data || distributorRes?.data || [];
// //         if (!Array.isArray(distributorsData)) {
// //           distributorsData = [];
// //         }

// //         const mappedDistributors = distributorsData.map((item: any, index: number) => ({
// //           id: item.join_request_id || item.milkman_id || index + 1,
// //           user_id: item.milkman_id || item.user_id || index + 1,
// //           status: item.status || 'accepted',
// //           milkman: {
// //             id: item.milkman_id || index + 1,
// //             full_name: item.milkman_name || 'Unknown Distributor',
// //           },
// //           name: item.milkman_name || `Distributor ${index + 1}`,
// //           user_type: 'milkman' as const,
// //           user_contact: item.milkman_contact || 'No contact',
// //           vendor: item.vendor_id || vendorId,
// //           assigned_customers_count: item.assigned_customers_count || 0,
// //         }));

// //         setAcceptedDistributors(mappedDistributors);
// //       } catch (distributorError) {
// //         console.error('Distributor fetch error:', distributorError);
// //         setAcceptedDistributors([]);
// //       }

// //       // Fetch Pending Requests
// //       try {
// //         const pendingRes = await getVendorPendingRequests(vendorId);
// //         const pendingData = pendingRes?.data?.data || [];
// //         setPendingRequests(Array.isArray(pendingData) ? pendingData : []);
// //       } catch (pendingError) {
// //         console.error('Pending requests fetch error:', pendingError);
// //         setPendingRequests([]);
// //       }
// //     } catch (e: any) {
// //       console.error('General fetch data error:', e);
// //       setError(e.message || 'Failed to load data');
// //     } finally {
// //       setIsLoading(false);
// //       setRefreshing(false);
// //     }
// //   }, [user?.userID]);

// //   const onRefresh = useCallback(() => {
// //     setRefreshing(true);
// //     fetchData();
// //   }, [fetchData]);

// //   const handleLogout = useCallback(() => {
// //     Alert.alert('Logout', 'Are you sure you want to log out?', [
// //       { text: 'Cancel', style: 'cancel' },
// //       {
// //         text: 'Logout',
// //         style: 'destructive',
// //         onPress: async () => {
// //           try {
// //             await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
// //             dispatch(logout());
// //             navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
// //           } catch (err) {
// //             console.error('Logout error:', err);
// //           }
// //         },
// //       },
// //     ]);
// //   }, [dispatch, navigation]);

// //   useFocusEffect(
// //     useCallback(() => {
// //       fetchData();
// //     }, [fetchData])
// //   );

// //   const getStatusColor = (status: string) => {
// //     switch (status?.toLowerCase()) {
// //       case 'accepted':
// //         return '#4CD964';
// //       case 'pending':
// //         return '#FFA500';
// //       case 'rejected':
// //         return '#FF6B6B';
// //       default:
// //         return '#4CD964';
// //     }
// //   };

// //   const getInitials = (name: string) => {
// //     if (!name) { return 'V'; }
// //     const parts = name.trim().split(' ');
// //     if (parts.length >= 2) {
// //       return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
// //     }
// //     return name.substring(0, 2).toUpperCase();
// //   };

// //   // NAVIGATION TO USER DETAILS
// //   const handleNavigateToUserDetails = useCallback((item: AcceptedItem) => {
// //     try {
// //       const userName = item.user_type === 'customer'
// //         ? (item.customer
// //           ? `${item.customer.first_name} ${item.customer.last_name}`.trim()
// //           : item.name || 'Unknown Consumer')
// //         : (item.milkman?.full_name || item.name || 'Unknown Distributor');

// //       navigation.navigate('UserDetails', {
// //         userId: item.user_id,
// //         userType: item.user_type === 'customer' ? 'consumer' : 'distributor',
// //         userName: userName,
// //       });
// //     } catch (navError) {
// //       console.error('Navigation error:', navError);
// //       Alert.alert('Error', 'Cannot navigate to user details');
// //     }
// //   }, [navigation]);

// //   const handleNavigateToTempAssignment = useCallback((item: AcceptedItem) => {
// //     try {
// //       navigation.navigate('TemporaryDistributorAssignment', {
// //         consumerId: item.user_id,
// //         consumerName: item.name || 'Unknown Consumer',
// //         currentDistributorId: item.assigned_distributor_id,
// //         currentDistributorName: item.assigned_distributor_name,
// //         isTemporary: item.has_temporary_distributor || false,
// //       });
// //     } catch (navError) {
// //       console.error('Navigation error:', navError);
// //       Alert.alert('Error', 'Cannot navigate to temporary assignment');
// //     }
// //   }, [navigation]);

// //   const village = vendorData?.location?.split(',')[2]?.trim() || vendorData?.village || 'No village provided';
// //   const vendorName = vendorData?.name || vendorData?.business_name || 'Vendor Name';

// //   if (!isAuthenticated || !user?.userID || isLoading) {
// //     return <SkeletonLoader />;
// //   }

// //   if (error) {
// //     return (
// //       <View style={[styles.container, styles.center]}>
// //         <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
// //         <Text style={styles.errorText}>{error}</Text>
// //         <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
// //           <Text style={styles.retryButtonText}>Try Again</Text>
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   }

// //   const statsData = [
// //     {
// //       icon: 'people-outline',
// //       label: 'Total Consumers',
// //       value: acceptedConsumers.length,
// //       subtext: 'Active Today',
// //       backgroundColor: '#E8F4FD',
// //       iconBg: '#007AFF',
// //       iconColor: '#fff',
// //       trending: 'up',
// //     },
// //     {
// //       icon: 'business-outline',
// //       label: 'Total Distributors',
// //       value: acceptedDistributors.length,
// //       subtext: 'Working Now',
// //       backgroundColor: '#FFF4E6',
// //       iconBg: '#FF9500',
// //       iconColor: '#fff',
// //       trending: 'up',
// //     },
// //     {
// //       icon: 'cash-outline',
// //       label: 'Total Billed Amount',
// //       value: 25000,
// //       subtext: 'This Month',
// //       backgroundColor: '#E8F8F0',
// //       iconBg: '#34C759',
// //       iconColor: '#fff',
// //       trending: 'up',
// //     },
// //     {
// //       icon: 'alert-circle-outline',
// //       label: 'Total Overdue Amount',
// //       value: 15000,
// //       subtext: 'Need Action',
// //       backgroundColor: '#FFE8E8',
// //       iconBg: '#FF3B30',
// //       iconColor: '#fff',
// //       trending: 'down',
// //     },
// //   ];

// //   return (
// //     <ScrollView
// //       style={{ flex: 1 }}
// //       contentContainerStyle={{ flexGrow: 1 }}
// //       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// //       showsVerticalScrollIndicator={false}
// //     >
// //       <View style={styles.container}>
// //         {/* HEADER WITH NOTIFICATION */}
// //         {/* HEADER WITH NOTIFICATION */}
// //         <View style={styles.headerRow}>
// //           <View>
// //             <Text style={styles.headerTitle}>Vendor Home</Text>
// //             <Text style={styles.headerSubtitle}>Welcome back! 👋</Text>
// //           </View>

// //           <View style={styles.headerActions}>
// //             {/* Notification Button - Placeholder for future implementation */}
// //             <TouchableOpacity
// //               style={styles.notificationButton}
// //               onPress={async () => {
// //                 await markAllAsRead();
// //                 setNotificationCount(0);
// //                 navigation.navigate('Notifications');
// //               }}
// //             >
// //               <View>
// //                 <Ionicons name="notifications-outline" size={24} color="#333" />
// //                 {notificationCount > 0 && (
// //                   <View
// //                     style={{
// //                       position: 'absolute',
// //                       right: -6,
// //                       top: -3,
// //                       backgroundColor: 'red',
// //                       borderRadius: 10,
// //                       paddingHorizontal: 5,
// //                       paddingVertical: 1,
// //                       minWidth: 18,
// //                       alignItems: 'center',
// //                       justifyContent: 'center',
// //                     }}
// //                   >
// //                     <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
// //                       {notificationCount}
// //                     </Text>
// //                   </View>
// //                 )}
// //               </View>
// //             </TouchableOpacity>

// //             {/* Logout Button */}
// //             <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
// //               <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
// //             </TouchableOpacity>
// //           </View>
// //         </View>


// //         {/* PROFILE CARD */}
// //         <TouchableOpacity
// //           style={styles.profileCard}
// //           onPress={() => navigation.navigate('VendorProfile')}
// //           activeOpacity={0.8}
// //         >
// //           <View style={styles.profileImageContainer}>
// //             <View style={styles.avatarCircle}>
// //               <Text style={styles.avatarInitials}>{getInitials(vendorName)}</Text>
// //             </View>
// //             <View style={styles.editBadge}>
// //               <Ionicons name="pencil" size={12} color="#fff" />
// //             </View>
// //           </View>

// //           <View style={styles.profileInfo}>
// //             <Text style={styles.profileName}>{vendorName}</Text>
// //             <Text style={styles.profileLocation}>{village}</Text>
// //             <View style={styles.profileBadge}>
// //               <Text style={styles.profileBadgeText}>Premium ⭐</Text>
// //             </View>
// //           </View>

// //           <Ionicons name="chevron-forward" size={20} color="#ccc" />
// //         </TouchableOpacity>

// //         {/* STATS GRID */}
// //         <View style={styles.statsSection}>
// //           <Text style={styles.sectionTitle}>Analytics Overview</Text>
// //           <View style={styles.statsGrid}>
// //             {statsData.map((stat, index) => (
// //               <AnimatedStatCard key={index} stat={stat} />
// //             ))}
// //           </View>
// //         </View>

// //         {/* PENDING REQUESTS */}
// //         <TouchableOpacity
// //           style={styles.pendingCard}
// //           onPress={() => navigation.navigate('PendingRequests')}
// //           activeOpacity={0.8}
// //         >
// //           <View style={styles.pendingLeft}>
// //             <View style={styles.pendingIconContainer}>
// //               <Ionicons name="notifications" size={24} color="#FF9500" />
// //             </View>
// //             <View>
// //               <Text style={styles.pendingTitle}>Pending Requests</Text>
// //               <Text style={styles.pendingSubtitle}>Requires your attention</Text>
// //             </View>
// //           </View>
// //           <View style={styles.pendingRight}>
// //             <Text style={styles.pendingCount}>{pendingRequests.length}</Text>
// //             <Ionicons name="chevron-forward" size={20} color="#666" />
// //           </View>
// //         </TouchableOpacity>

// //         {/* TABS */}
// //         <View style={styles.tabContainer}>
// //           <View style={styles.tabRow}>
// //             <TouchableOpacity
// //               style={[styles.tabButton, selectedTab === 'consumer' && styles.activeTab]}
// //               onPress={() => setSelectedTab('consumer')}
// //               activeOpacity={0.8}
// //             >
// //               <Text style={[styles.tabText, selectedTab === 'consumer' && styles.activeTabText]}>
// //                 Consumers ({acceptedConsumers.length})
// //               </Text>
// //             </TouchableOpacity>
// //             <TouchableOpacity
// //               style={[styles.tabButton, selectedTab === 'distributor' && styles.activeTab]}
// //               onPress={() => setSelectedTab('distributor')}
// //               activeOpacity={0.8}
// //             >
// //               <Text style={[styles.tabText, selectedTab === 'distributor' && styles.activeTabText]}>
// //                 Distributors ({acceptedDistributors.length})
// //               </Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>

// //         {/* LIST */}
// //         <View style={styles.listContainer}>
// //           {selectedTab === 'consumer' ? (
// //             acceptedConsumers.length === 0 ? (
// //               <View style={styles.emptyState}>
// //                 <Ionicons name="people-outline" size={48} color="#ccc" />
// //                 <Text style={styles.emptyText}>No accepted consumers found.</Text>
// //               </View>
// //             ) : (
// //               <FlatList
// //                 data={acceptedConsumers}
// //                 keyExtractor={(item, index) => `consumer_${item.id || index}`}
// //                 renderItem={({ item }) => (
// //                   <View style={styles.listItemContainer}>
// //                     <TouchableOpacity
// //                       style={styles.listItem}
// //                       activeOpacity={0.7}
// //                       onPress={() => handleNavigateToUserDetails(item)}
// //                     >
// //                       <View style={styles.listItemLeft}>
// //                         <View style={styles.avatarSmall}>
// //                           <Text style={styles.avatarText}>
// //                             {((item.customer?.first_name?.[0] || '') +
// //                               (item.customer?.last_name?.[0] || ''))
// //                               .toUpperCase() || item.name?.[0]?.toUpperCase() || 'U'}
// //                           </Text>
// //                         </View>
// //                         <View style={styles.listItemInfo}>
// //                           <View style={styles.nameRow}>
// //                             <Text style={styles.listItemText}>
// //                               {item.customer
// //                                 ? `${item.customer.first_name} ${item.customer.last_name}`.trim()
// //                                 : item.name || 'Unknown Consumer'}
// //                             </Text>
// //                             {item.has_temporary_distributor && (
// //                               <View style={styles.tempBadge}>
// //                                 <Ionicons name="swap-horizontal" size={10} color="#FF9500" />
// //                                 <Text style={styles.tempBadgeText}>TEMP</Text>
// //                               </View>
// //                             )}
// //                           </View>
// //                           <Text style={styles.listItemSubtext}>
// //                             {item.user_contact || 'No contact'}
// //                           </Text>
// //                           {item.assigned_distributor_name && (
// //                             <Text style={styles.assignedDistributor}>
// //                               Assigned: {item.assigned_distributor_name}
// //                             </Text>
// //                           )}
// //                         </View>
// //                       </View>
// //                       <View style={styles.listItemRight}>
// //                         <View
// //                           style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}
// //                         >
// //                           <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
// //                             {item.status?.toUpperCase() || 'ACCEPTED'}
// //                           </Text>
// //                         </View>
// //                         <Ionicons name="chevron-forward" size={20} color="#ccc" style={{ marginLeft: 8 }} />
// //                       </View>
// //                     </TouchableOpacity>

// //                     <TouchableOpacity
// //                       style={[
// //                         styles.tempAssignButton,
// //                         item.has_temporary_distributor && styles.tempAssignButtonActive,
// //                       ]}
// //                       onPress={() => handleNavigateToTempAssignment(item)}
// //                       activeOpacity={0.7}
// //                     >
// //                       <Ionicons
// //                         name={item.has_temporary_distributor ? 'close-circle' : 'swap-horizontal'}
// //                         size={18}
// //                         color={item.has_temporary_distributor ? '#FF3B30' : '#007AFF'}
// //                       />
// //                     </TouchableOpacity>
// //                   </View>
// //                 )}
// //                 showsVerticalScrollIndicator={false}
// //                 scrollEnabled={false}
// //               />
// //             )
// //           ) : acceptedDistributors.length === 0 ? (
// //             <View style={styles.emptyState}>
// //               <Ionicons name="business-outline" size={48} color="#ccc" />
// //               <Text style={styles.emptyText}>No accepted distributors found.</Text>
// //             </View>
// //           ) : (
// //             <FlatList
// //               data={acceptedDistributors}
// //               keyExtractor={(item, index) => `distributor_${item.id || index}`}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity
// //                   style={styles.listItem}
// //                   activeOpacity={0.7}
// //                   onPress={() => handleNavigateToUserDetails(item)}
// //                 >
// //                   <View style={styles.listItemLeft}>
// //                     <View style={styles.avatarSmall}>
// //                       <Text style={styles.avatarText}>
// //                         {getInitials(item.milkman?.full_name || item.name || 'U')}
// //                       </Text>
// //                     </View>
// //                     <View style={styles.listItemInfo}>
// //                       <Text style={styles.listItemText}>
// //                         {item.milkman?.full_name || item.name || 'Unknown Distributor'}
// //                       </Text>
// //                       <Text style={styles.listItemSubtext}>
// //                         {item.user_contact || 'No contact'}
// //                       </Text>
// //                       {item.assigned_customers_count !== undefined && item.assigned_customers_count > 0 && (
// //                         <Text style={styles.assignedCount}>
// //                           {item.assigned_customers_count} customers assigned
// //                         </Text>
// //                       )}
// //                     </View>
// //                   </View>
// //                   <View style={styles.listItemRight}>
// //                     <View
// //                       style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}
// //                     >
// //                       <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
// //                         {item.status?.toUpperCase() || 'ACCEPTED'}
// //                       </Text>
// //                     </View>
// //                     <Ionicons name="chevron-forward" size={20} color="#ccc" style={{ marginLeft: 8 }} />
// //                   </View>
// //                 </TouchableOpacity>
// //               )}
// //               showsVerticalScrollIndicator={false}
// //               scrollEnabled={false}
// //             />
// //           )}
// //         </View>
// //       </View>
// //     </ScrollView>
// //   );
// // };

// // export default VendorHomeScreen;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f8f9fa',
// //     paddingTop: Platform.OS === 'ios' ? 50 : 20,
// //   },
// //   center: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     flex: 1,
// //     paddingHorizontal: 20,
// //   },

// //   // LOADING
// //   loadingContainer: {
// //     flex: 1,
// //     backgroundColor: '#f8f9fa',
// //     justifyContent: 'flex-start',
// //     paddingTop: Platform.OS === 'ios' ? 50 : 20,
// //   },
// //   skeletonContainer: {
// //     paddingHorizontal: 20,
// //     width: '100%',
// //   },
// //   skeletonHeader: {
// //     marginBottom: 20,
// //   },
// //   skeletonTitle: {
// //     width: '60%',
// //     height: 28,
// //     backgroundColor: '#E1E9EE',
// //     borderRadius: 6,
// //     marginBottom: 8,
// //   },
// //   skeletonSubtitle: {
// //     width: '40%',
// //     height: 16,
// //     backgroundColor: '#E1E9EE',
// //     borderRadius: 4,
// //   },
// //   skeletonProfileCard: {
// //     flexDirection: 'row',
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: 20,
// //     marginBottom: 24,
// //     alignItems: 'center',
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOpacity: 0.08,
// //         shadowRadius: 8,
// //         shadowOffset: { width: 0, height: 4 },
// //       },
// //       android: {
// //         elevation: 4,
// //       },
// //     }),
// //   },
// //   skeletonAvatar: {
// //     width: 70,
// //     height: 70,
// //     borderRadius: 35,
// //     backgroundColor: '#E1E9EE',
// //   },
// //   skeletonProfileInfo: {
// //     marginLeft: 16,
// //     flex: 1,
// //   },
// //   skeletonProfileName: {
// //     width: '70%',
// //     height: 20,
// //     backgroundColor: '#E1E9EE',
// //     borderRadius: 4,
// //     marginBottom: 8,
// //   },
// //   skeletonProfileLocation: {
// //     width: '50%',
// //     height: 14,
// //     backgroundColor: '#E1E9EE',
// //     borderRadius: 4,
// //   },
// //   skeletonStatsGrid: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     justifyContent: 'space-between',
// //     marginBottom: 30,
// //   },
// //   skeletonStatCard: {
// //     width: '48%',
// //     height: 120,
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: 16,
// //     marginBottom: 12,
// //     justifyContent: 'space-between',
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOpacity: 0.06,
// //         shadowRadius: 6,
// //         shadowOffset: { width: 0, height: 3 },
// //       },
// //       android: {
// //         elevation: 3,
// //       },
// //     }),
// //   },
// //   skeletonStatIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: '#E1E9EE',
// //   },
// //   skeletonStatValue: {
// //     width: '60%',
// //     height: 24,
// //     backgroundColor: '#E1E9EE',
// //     borderRadius: 4,
// //     marginTop: 8,
// //   },
// //   skeletonStatLabel: {
// //     width: '80%',
// //     height: 14,
// //     backgroundColor: '#E1E9EE',
// //     borderRadius: 4,
// //     marginTop: 4,
// //   },
// //   loadingIndicatorContainer: {
// //     alignItems: 'center',
// //     marginTop: 20,
// //   },
// //   loadingText: {
// //     fontSize: 16,
// //     color: '#666',
// //     marginTop: 12,
// //     fontWeight: '500',
// //   },

// //   // HEADER WITH NOTIFICATION
// //   headerRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingHorizontal: 20,
// //     paddingBottom: 20,
// //   },
// //   headerTitle: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     color: '#1a1a1a',
// //   },
// //   headerSubtitle: {
// //     fontSize: 16,
// //     color: '#666',
// //     marginTop: 4,
// //   },
// //   headerActions: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 12,
// //   },
// //   notificationButton: {
// //     padding: 8,
// //     borderRadius: 8,
// //     backgroundColor: '#fff',
// //     position: 'relative',
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOpacity: 0.1,
// //         shadowRadius: 4,
// //         shadowOffset: { width: 0, height: 2 },
// //       },
// //       android: {
// //         elevation: 2,
// //       },
// //     }),
// //   },
// //   logoutButton: {
// //     padding: 8,
// //     borderRadius: 8,
// //     backgroundColor: '#fff',
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOpacity: 0.1,
// //         shadowRadius: 4,
// //         shadowOffset: { width: 0, height: 2 },
// //       },
// //       android: {
// //         elevation: 2,
// //       },
// //     }),
// //   },

// //   // PROFILE CARD
// //   profileCard: {
// //     backgroundColor: '#fff',
// //     marginHorizontal: 20,
// //     borderRadius: 16,
// //     padding: 20,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 24,
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOpacity: 0.08,
// //         shadowRadius: 8,
// //         shadowOffset: { width: 0, height: 4 },
// //       },
// //       android: {
// //         elevation: 4,
// //       },
// //     }),
// //   },
// //   profileImageContainer: {
// //     position: 'relative',
// //   },
// //   avatarCircle: {
// //     width: 70,
// //     height: 70,
// //     borderRadius: 35,
// //     backgroundColor: '#007AFF',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   avatarInitials: {
// //     fontSize: 26,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //   },
// //   editBadge: {
// //     position: 'absolute',
// //     bottom: 0,
// //     right: 0,
// //     backgroundColor: '#34C759',
// //     width: 24,
// //     height: 24,
// //     borderRadius: 12,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 2,
// //     borderColor: '#fff',
// //   },
// //   profileInfo: {
// //     marginLeft: 16,
// //     flex: 1,
// //   },
// //   profileName: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     color: '#1a1a1a',
// //   },
// //   profileLocation: {
// //     fontSize: 14,
// //     color: '#666',
// //     marginTop: 4,
// //     marginBottom: 8,
// //   },
// //   profileBadge: {
// //     backgroundColor: '#007AFF',
// //     paddingHorizontal: 12,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //     alignSelf: 'flex-start',
// //   },
// //   profileBadgeText: {
// //     color: '#fff',
// //     fontSize: 12,
// //     fontWeight: '600',
// //   },

// //   // STATS
// //   statsSection: {
// //     paddingHorizontal: 20,
// //     marginBottom: 24,
// //   },
// //   sectionTitle: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     color: '#1a1a1a',
// //     marginBottom: 16,
// //   },
// //   statsGrid: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     justifyContent: 'space-between',
// //   },
// //   statCardContainer: {
// //     width: '48%',
// //     marginBottom: 12,
// //   },
// //   statCard: {
// //     borderRadius: 16,
// //     padding: 16,
// //     minHeight: 135,
// //     justifyContent: 'space-between',
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOpacity: 0.06,
// //         shadowRadius: 6,
// //         shadowOffset: { width: 0, height: 3 },
// //       },
// //       android: {
// //         elevation: 3,
// //       },
// //     }),
// //   },
// //   iconCircle: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     alignSelf: 'flex-start',
// //   },
// //   statContent: {
// //     marginTop: 8,
// //     flex: 1,
// //   },
// //   statValue: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: '#1a1a1a',
// //   },
// //   statLabel: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#333',
// //     marginTop: 4,
// //   },
// //   statSubtext: {
// //     fontSize: 12,
// //     color: '#666',
// //     marginTop: 2,
// //   },
// //   statTrend: {
// //     alignSelf: 'flex-end',
// //     marginTop: 8,
// //   },

// //   // PENDING
// //   pendingCard: {
// //     backgroundColor: '#fff',
// //     marginHorizontal: 20,
// //     borderRadius: 16,
// //     padding: 20,
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 24,
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOpacity: 0.08,
// //         shadowRadius: 8,
// //         shadowOffset: { width: 0, height: 4 },
// //       },
// //       android: {
// //         elevation: 4,
// //       },
// //     }),
// //   },
// //   pendingLeft: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   pendingIconContainer: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 24,
// //     backgroundColor: '#FFF4E6',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 16,
// //   },
// //   pendingTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#1a1a1a',
// //   },
// //   pendingSubtitle: {
// //     fontSize: 13,
// //     color: '#666',
// //     marginTop: 2,
// //   },
// //   pendingRight: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   pendingCount: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#FF9500',
// //     marginRight: 8,
// //   },

// //   // TABS
// //   tabContainer: {
// //     paddingHorizontal: 20,
// //     marginBottom: 16,
// //   },
// //   tabRow: {
// //     flexDirection: 'row',
// //     backgroundColor: '#f0f0f0',
// //     borderRadius: 12,
// //     padding: 4,
// //   },
// //   tabButton: {
// //     flex: 1,
// //     paddingVertical: 12,
// //     alignItems: 'center',
// //     borderRadius: 8,
// //   },
// //   activeTab: {
// //     backgroundColor: '#007AFF',
// //   },
// //   tabText: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#666',
// //   },
// //   activeTabText: {
// //     color: '#fff',
// //   },

// //   // LIST
// //   listContainer: {
// //     paddingHorizontal: 20,
// //     flex: 1,
// //   },
// //   listItemContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   listItem: {
// //     backgroundColor: '#fff',
// //     borderRadius: 12,
// //     padding: 16,
// //     flex: 1,
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginRight: 8,
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOpacity: 0.04,
// //         shadowRadius: 4,
// //         shadowOffset: { width: 0, height: 2 },
// //       },
// //       android: {
// //         elevation: 2,
// //       },
// //     }),
// //   },
// //   listItemLeft: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //   },
// //   listItemRight: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   listItemInfo: {
// //     flex: 1,
// //   },
// //   nameRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 6,
// //     marginBottom: 2,
// //   },
// //   avatarSmall: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: '#007AFF',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   avatarText: {
// //     color: '#fff',
// //     fontWeight: 'bold',
// //     fontSize: 14,
// //   },
// //   listItemText: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#1a1a1a',
// //   },
// //   listItemSubtext: {
// //     fontSize: 13,
// //     color: '#666',
// //     marginTop: 2,
// //   },
// //   assignedCount: {
// //     fontSize: 11,
// //     color: '#FF9500',
// //     fontWeight: '600',
// //     marginTop: 2,
// //   },
// //   assignedDistributor: {
// //     fontSize: 11,
// //     color: '#007AFF',
// //     fontWeight: '500',
// //     marginTop: 2,
// //   },
// //   statusBadge: {
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 12,
// //   },
// //   statusText: {
// //     fontSize: 11,
// //     fontWeight: 'bold',
// //   },
// //   tempBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#FFF4E6',
// //     paddingHorizontal: 6,
// //     paddingVertical: 2,
// //     borderRadius: 8,
// //     gap: 2,
// //   },
// //   tempBadgeText: {
// //     fontSize: 9,
// //     color: '#FF9500',
// //     fontWeight: '700',
// //   },
// //   tempAssignButton: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: '#E8F4FD',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOpacity: 0.04,
// //         shadowRadius: 4,
// //         shadowOffset: { width: 0, height: 2 },
// //       },
// //       android: {
// //         elevation: 2,
// //       },
// //     }),
// //   },
// //   tempAssignButtonActive: {
// //     backgroundColor: '#FFE8E8',
// //   },

// //   // EMPTY
// //   emptyState: {
// //     alignItems: 'center',
// //     paddingVertical: 40,
// //   },
// //   emptyText: {
// //     fontSize: 16,
// //     color: '#888',
// //     marginTop: 12,
// //     textAlign: 'center',
// //   },

// //   // ERROR
// //   errorText: {
// //     color: '#FF3B30',
// //     fontSize: 18,
// //     fontWeight: '600',
// //     marginBottom: 16,
// //     textAlign: 'center',
// //     marginTop: 16,
// //   },
// //   retryButton: {
// //     backgroundColor: '#007AFF',
// //     borderRadius: 8,
// //     paddingHorizontal: 24,
// //     paddingVertical: 12,
// //     marginTop: 8,
// //   },
// //   retryButtonText: {
// //     color: '#fff',
// //     fontWeight: '600',
// //     fontSize: 16,
// //   },
// // });
// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   RefreshControl,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   ScrollView,
//   Animated,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { useSelector, useDispatch } from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { RootState, AppDispatch } from '../../store';
// import { logout } from '../../store/authSlice';
// import {
//   getVendorDetailsById,
//   getAcceptedCustomers,
//   getAcceptedMilkmen,
//   getVendorPendingRequests,
// } from '../../apiServices/allApi';
// import { getUnreadCount, markAllAsRead, showLocalNotification, notificationEmitter } from '../../notifications/NotificationService';
// import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

// // Navigation Types
// type RootStackParamList = {
//   VendorHome: undefined;
//   VendorProfile: undefined;
//   UserDetails: {
//     userId: number;
//     userType: 'consumer' | 'distributor';
//     userName: string;
//   };
//   ConsumerCalendar: {
//     viewerRole: 'vendor';
//     targetConsumerId: number;
//     targetConsumerName: string;
//     showBackButton: boolean;
//   };
//   VendorDistributorCalendar: {
//     viewerRole: 'vendor';
//     targetDistributorId: number;
//     targetDistributorName: string;
//     showBackButton: boolean;
//   };
//   TemporaryDistributorAssignment: {
//     consumerId: number;
//     consumerName: string;
//     currentDistributorId?: number;
//     currentDistributorName?: string;
//     isTemporary: boolean;
//   };
//   PendingRequests: undefined;
//   Notifications: undefined;
//   Login: undefined;
// };

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VendorHome'>;

// type AcceptedItem = {
//   id: number;
//   user_id: number;
//   status: string;
//   customer?: {
//     id: number;
//     first_name: string;
//     last_name: string;
//   } | null;
//   milkman?: {
//     id: number;
//     full_name: string;
//   };
//   name?: string | null;
//   user_type: 'customer' | 'milkman';
//   user_contact: string;
//   vendor: number;
//   assigned_customers_count?: number;
//   assigned_distributor_id?: number;
//   assigned_distributor_name?: string;
//   has_temporary_distributor?: boolean;
// };

// // SKELETON LOADER COMPONENT
// const SkeletonLoader = () => {
//   return (
//     <View style={styles.loadingContainer}>
//       <View style={styles.skeletonContainer}>
//         <View style={styles.skeletonHeader}>
//           <View style={styles.skeletonTitle} />
//           <View style={styles.skeletonSubtitle} />
//         </View>

//         <View style={styles.skeletonProfileCard}>
//           <View style={styles.skeletonAvatar} />
//           <View style={styles.skeletonProfileInfo}>
//             <View style={styles.skeletonProfileName} />
//             <View style={styles.skeletonProfileLocation} />
//           </View>
//         </View>

//         <View style={styles.skeletonStatsGrid}>
//           {[1, 2, 3, 4].map((item) => (
//             <View key={item} style={styles.skeletonStatCard}>
//               <View style={styles.skeletonStatIcon} />
//               <View style={styles.skeletonStatValue} />
//               <View style={styles.skeletonStatLabel} />
//             </View>
//           ))}
//         </View>

//         <View style={styles.loadingIndicatorContainer}>
//           <ActivityIndicator size="large" color="#007AFF" />
//           <Text style={styles.loadingText}>Loading ...</Text>
//         </View>
//       </View>
//     </View>
//   );
// };

// // ANIMATED STAT CARD COMPONENT
// const AnimatedStatCard = ({ stat, onPress }: { stat: any; onPress?: () => void }) => {
//   const scaleValue = useState(new Animated.Value(1))[0];

//   const handlePressIn = () => {
//     Animated.spring(scaleValue, {
//       toValue: 0.96,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handlePressOut = () => {
//     Animated.spring(scaleValue, {
//       toValue: 1,
//       useNativeDriver: true,
//     }).start();
//   };

//   return (
//     <TouchableOpacity
//       activeOpacity={0.8}
//       onPressIn={handlePressIn}
//       onPressOut={handlePressOut}
//       onPress={onPress}
//       style={styles.statCardContainer}
//     >
//       <Animated.View
//         style={[
//           styles.statCard,
//           {
//             backgroundColor: stat.backgroundColor,
//             transform: [{ scale: scaleValue }],
//           },
//         ]}
//       >
//         <View style={[styles.iconCircle, { backgroundColor: stat.iconBg }]}>
//           <Ionicons name={stat.icon} size={24} color={stat.iconColor} />
//         </View>
//         <View style={styles.statContent}>
//           <Text style={styles.statValue}>{stat.value}</Text>
//           <Text style={styles.statLabel}>{stat.label}</Text>
//           <Text style={styles.statSubtext}>{stat.subtext}</Text>
//         </View>

//         <View style={styles.statTrend}>
//           <Ionicons
//             name={stat.trending === 'up' ? 'trending-up' : 'trending-down'}
//             size={16}
//             color={stat.trending === 'up' ? '#34C759' : '#FF3B30'}
//           />
//         </View>
//       </Animated.View>
//     </TouchableOpacity>
//   );
// };

// const VendorHomeScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const dispatch = useDispatch<AppDispatch>();
//   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

//   const [vendorData, setVendorData] = useState<any>(null);
//   const [acceptedConsumers, setAcceptedConsumers] = useState<AcceptedItem[]>([]);
//   const [acceptedDistributors, setAcceptedDistributors] = useState<AcceptedItem[]>([]);
//   const [pendingRequests, setPendingRequests] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedTab, setSelectedTab] = useState<'consumer' | 'distributor'>('consumer');
//   const [notificationCount, setNotificationCount] = useState(0);

//   const loadNotificationCount = async () => {
//     try {
//       const count = await getUnreadCount();
//       setNotificationCount(count);
//     } catch (error) {
//       console.error('Error loading notification count:', error);
//     }
//   };

//   useEffect(() => {
//     loadNotificationCount();

//     // Listen for updates via emitter
//     const updateBadge = async () => {
//       const count = await getUnreadCount();
//       setNotificationCount(count);
//     };
//     notificationEmitter.on('newNotification', updateBadge);

//     // Handle FCM foreground messages - FIXED VERSION
//     const unsubscribe = messaging().onMessage(async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
//       console.log('Foreground message:', remoteMessage);
//       const notificationRaw = remoteMessage.notification || {
//         title: remoteMessage.data?.title,
//         body: remoteMessage.data?.body,
//       };
//       const notification = {
//         title: typeof notificationRaw.title === 'string' ? notificationRaw.title : JSON.stringify(notificationRaw.title),
//         body: typeof notificationRaw.body === 'string' ? notificationRaw.body : JSON.stringify(notificationRaw.body),
//       };
//       await showLocalNotification(notification);
//     });

//     return () => {
//       unsubscribe();
//       notificationEmitter.removeListener('newNotification', updateBadge);
//     };
//   }, []);

//   const fetchData = useCallback(async () => {
//     setError(null);
//     setIsLoading(true);
//     try {
//       const vendorId = user?.userID;

//       if (!vendorId) {
//         throw new Error('Vendor ID not found. Please log in again.');
//       }

//       console.log('🔍 Fetching data for vendor ID:', vendorId);

//       // Fetch Vendor Profile
//       try {
//         const vendorRes = await getVendorDetailsById(vendorId);
//         const vData = vendorRes.data?.data || vendorRes.data;
//         setVendorData(vData);
//       } catch (vendorError) {
//         console.error('Vendor profile fetch error:', vendorError);
//       }

//       // Fetch Accepted Consumers
//       try {
//         const consumerRes = await getAcceptedCustomers(vendorId);
//         let consumersData = consumerRes?.data?.data || consumerRes?.data || [];
//         if (!Array.isArray(consumersData)) {
//           consumersData = [];
//         }
//         const mappedConsumers = consumersData.map((item: any, index: number) => ({
//           id: item.join_request_id || item.customer_id || index + 1,
//           user_id: item.customer_id || item.user_id || index + 1,
//           status: item.status || 'accepted',
//           customer: item.customer_name ? {
//             id: item.customer_id || index + 1,
//             first_name: item.customer_name?.split(' ')[0] || 'Unknown',
//             last_name: item.customer_name?.split(' ').slice(1).join(' ') || '',
//           } : null,
//           name: item.customer_name || item.name || `Consumer ${index + 1}`,
//           user_type: 'customer' as const,
//           user_contact: item.customer_contact || item.contact || 'No contact',
//           vendor: item.vendor_id || vendorId,
//           assigned_distributor_id: item.assigned_distributor_id || item.permanent_distributor_id,
//           assigned_distributor_name: item.assigned_distributor_name || item.permanent_distributor_name,
//           has_temporary_distributor: item.has_temporary_distributor || false,
//         }));

//         setAcceptedConsumers(mappedConsumers);
//       } catch (consumerError) {
//         console.error('Consumer fetch error:', consumerError);
//         setAcceptedConsumers([]);
//       }

//       // Fetch Accepted Distributors
//       try {
//         const distributorRes = await getAcceptedMilkmen(vendorId);
//         let distributorsData = distributorRes?.data?.data || distributorRes?.data || [];
//         if (!Array.isArray(distributorsData)) {
//           distributorsData = [];
//         }

//         const mappedDistributors = distributorsData.map((item: any, index: number) => ({
//           id: item.join_request_id || item.milkman_id || index + 1,
//           user_id: item.milkman_id || item.user_id || index + 1,
//           status: item.status || 'accepted',
//           milkman: {
//             id: item.milkman_id || index + 1,
//             full_name: item.milkman_name || 'Unknown Distributor',
//           },
//           name: item.milkman_name || `Distributor ${index + 1}`,
//           user_type: 'milkman' as const,
//           user_contact: item.milkman_contact || 'No contact',
//           vendor: item.vendor_id || vendorId,
//           assigned_customers_count: item.assigned_customers_count || 0,
//         }));

//         setAcceptedDistributors(mappedDistributors);
//       } catch (distributorError) {
//         console.error('Distributor fetch error:', distributorError);
//         setAcceptedDistributors([]);
//       }

//       // Fetch Pending Requests
//       try {
//         const pendingRes = await getVendorPendingRequests(vendorId);
//         const pendingData = pendingRes?.data?.data || [];
//         setPendingRequests(Array.isArray(pendingData) ? pendingData : []);
//       } catch (pendingError) {
//         console.error('Pending requests fetch error:', pendingError);
//         setPendingRequests([]);
//       }
//     } catch (e: any) {
//       console.error('General fetch data error:', e);
//       setError(e.message || 'Failed to load data');
//     } finally {
//       setIsLoading(false);
//       setRefreshing(false);
//     }
//   }, [user?.userID]);

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchData();
//   }, [fetchData]);

//   const handleLogout = useCallback(() => {
//     Alert.alert('Logout', 'Are you sure you want to log out?', [
//       { text: 'Cancel', style: 'cancel' },
//       {
//         text: 'Logout',
//         style: 'destructive',
//         onPress: async () => {
//           try {
//             await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
//             dispatch(logout());
//             navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
//           } catch (err) {
//             console.error('Logout error:', err);
//           }
//         },
//       },
//     ]);
//   }, [dispatch, navigation]);

//   useFocusEffect(
//     useCallback(() => {
//       fetchData();
//     }, [fetchData])
//   );

//   const getStatusColor = (status: string) => {
//     switch (status?.toLowerCase()) {
//       case 'accepted':
//         return '#4CD964';
//       case 'pending':
//         return '#FFA500';
//       case 'rejected':
//         return '#FF6B6B';
//       default:
//         return '#4CD964';
//     }
//   };

//   const getInitials = (name: string) => {
//     if (!name) { return 'V'; }
//     const parts = name.trim().split(' ');
//     if (parts.length >= 2) {
//       return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
//     }
//     return name.substring(0, 2).toUpperCase();
//   };

//   // NAVIGATION TO USER DETAILS
//   const handleNavigateToUserDetails = useCallback((item: AcceptedItem) => {
//     try {
//       const userName = item.user_type === 'customer'
//         ? (item.customer
//           ? `${item.customer.first_name} ${item.customer.last_name}`.trim()
//           : item.name || 'Unknown Consumer')
//         : (item.milkman?.full_name || item.name || 'Unknown Distributor');

//       navigation.navigate('UserDetails', {
//         userId: item.user_id,
//         userType: item.user_type === 'customer' ? 'consumer' : 'distributor',
//         userName: userName,
//       });
//     } catch (navError) {
//       console.error('Navigation error:', navError);
//       Alert.alert('Error', 'Cannot navigate to user details');
//     }
//   }, [navigation]);

//   const handleNavigateToTempAssignment = useCallback((item: AcceptedItem) => {
//     try {
//       navigation.navigate('TemporaryDistributorAssignment', {
//         consumerId: item.user_id,
//         consumerName: item.name || 'Unknown Consumer',
//         currentDistributorId: item.assigned_distributor_id,
//         currentDistributorName: item.assigned_distributor_name,
//         isTemporary: item.has_temporary_distributor || false,
//       });
//     } catch (navError) {
//       console.error('Navigation error:', navError);
//       Alert.alert('Error', 'Cannot navigate to temporary assignment');
//     }
//   }, [navigation]);

//   const village = vendorData?.location?.split(',')[2]?.trim() || vendorData?.village || 'No village provided';
//   const vendorName = vendorData?.name || vendorData?.business_name || 'Vendor Name';

//   if (!isAuthenticated || !user?.userID || isLoading) {
//     return <SkeletonLoader />;
//   }

//   if (error) {
//     return (
//       <View style={[styles.container, styles.center]}>
//         <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
//           <Text style={styles.retryButtonText}>Try Again</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const statsData = [
//     {
//       icon: 'people-outline',
//       label: 'Total Consumers',
//       value: acceptedConsumers.length,
//       subtext: 'Active Today',
//       backgroundColor: '#E8F4FD',
//       iconBg: '#007AFF',
//       iconColor: '#fff',
//       trending: 'up',
//     },
//     {
//       icon: 'business-outline',
//       label: 'Total Distributors',
//       value: acceptedDistributors.length,
//       subtext: 'Working Now',
//       backgroundColor: '#FFF4E6',
//       iconBg: '#FF9500',
//       iconColor: '#fff',
//       trending: 'up',
//     },
//     {
//       icon: 'cash-outline',
//       label: 'Total Billed Amount',
//       value: 25000,
//       subtext: 'This Month',
//       backgroundColor: '#E8F8F0',
//       iconBg: '#34C759',
//       iconColor: '#fff',
//       trending: 'up',
//     },
//     {
//       icon: 'alert-circle-outline',
//       label: 'Total Overdue Amount',
//       value: 15000,
//       subtext: 'Need Action',
//       backgroundColor: '#FFE8E8',
//       iconBg: '#FF3B30',
//       iconColor: '#fff',
//       trending: 'down',
//     },
//   ];

//   return (
//     <ScrollView
//       style={{ flex: 1 }}
//       contentContainerStyle={{ flexGrow: 1 }}
//       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//       showsVerticalScrollIndicator={false}
//     >
//       <View style={styles.container}>
//         {/* HEADER WITH NOTIFICATION */}
//         <View style={styles.headerRow}>
//           <View>
//             <Text style={styles.headerTitle}>Vendor Home</Text>
//             <Text style={styles.headerSubtitle}>Welcome back! 👋</Text>
//           </View>
//           <View style={styles.headerActions}>
//             {/* Notification Button */}
//             <TouchableOpacity
//               style={styles.notificationButton}
//               onPress={async () => {
//                 await markAllAsRead();
//                 setNotificationCount(0);
//                 navigation.navigate('Notifications');
//               }}
//             >
//               <View>
//                 <Ionicons name="notifications-outline" size={24} color="#333" />
//                 {notificationCount > 0 && (
//                   <View
//                     style={{
//                       position: 'absolute',
//                       right: -6,
//                       top: -3,
//                       backgroundColor: 'red',
//                       borderRadius: 10,
//                       paddingHorizontal: 5,
//                       paddingVertical: 1,
//                       minWidth: 18,
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                     }}
//                   >
//                     <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
//                       {notificationCount}
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             </TouchableOpacity>

//             {/* Logout Button */}
//             <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//               <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* PROFILE CARD */}
//         <TouchableOpacity
//           style={styles.profileCard}
//           onPress={() => navigation.navigate('VendorProfile')}
//           activeOpacity={0.8}
//         >
//           <View style={styles.profileImageContainer}>
//             <View style={styles.avatarCircle}>
//               <Text style={styles.avatarInitials}>{getInitials(vendorName)}</Text>
//             </View>
//             <View style={styles.editBadge}>
//               <Ionicons name="pencil" size={12} color="#fff" />
//             </View>
//           </View>

//           <View style={styles.profileInfo}>
//             <Text style={styles.profileName}>{vendorName}</Text>
//             <Text style={styles.profileLocation}>{village}</Text>
//             <View style={styles.profileBadge}>
//               <Text style={styles.profileBadgeText}>Premium ⭐</Text>
//             </View>
//           </View>

//           <Ionicons name="chevron-forward" size={20} color="#ccc" />
//         </TouchableOpacity>

//         {/* STATS GRID */}
//         <View style={styles.statsSection}>
//           <Text style={styles.sectionTitle}>Analytics Overview</Text>
//           <View style={styles.statsGrid}>
//             {statsData.map((stat, index) => (
//               <AnimatedStatCard key={index} stat={stat} />
//             ))}
//           </View>
//         </View>

//         {/* PENDING REQUESTS */}
//         <TouchableOpacity
//           style={styles.pendingCard}
//           onPress={() => navigation.navigate('PendingRequests')}
//           activeOpacity={0.8}
//         >
//           <View style={styles.pendingLeft}>
//             <View style={styles.pendingIconContainer}>
//               <Ionicons name="notifications" size={24} color="#FF9500" />
//             </View>
//             <View>
//               <Text style={styles.pendingTitle}>Pending Requests</Text>
//               <Text style={styles.pendingSubtitle}>Requires your attention</Text>
//             </View>
//           </View>
//           <View style={styles.pendingRight}>
//             <Text style={styles.pendingCount}>{pendingRequests.length}</Text>
//             <Ionicons name="chevron-forward" size={20} color="#666" />
//           </View>
//         </TouchableOpacity>

//         {/* TABS */}
//         <View style={styles.tabContainer}>
//           <View style={styles.tabRow}>
//             <TouchableOpacity
//               style={[styles.tabButton, selectedTab === 'consumer' && styles.activeTab]}
//               onPress={() => setSelectedTab('consumer')}
//               activeOpacity={0.8}
//             >
//               <Text style={[styles.tabText, selectedTab === 'consumer' && styles.activeTabText]}>
//                 Consumers ({acceptedConsumers.length})
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.tabButton, selectedTab === 'distributor' && styles.activeTab]}
//               onPress={() => setSelectedTab('distributor')}
//               activeOpacity={0.8}
//             >
//               <Text style={[styles.tabText, selectedTab === 'distributor' && styles.activeTabText]}>
//                 Distributors ({acceptedDistributors.length})
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* LIST */}
//         <View style={styles.listContainer}>
//           {selectedTab === 'consumer' ? (
//             acceptedConsumers.length === 0 ? (
//               <View style={styles.emptyState}>
//                 <Ionicons name="people-outline" size={48} color="#ccc" />
//                 <Text style={styles.emptyText}>No accepted consumers found.</Text>
//               </View>
//             ) : (
//               <FlatList
//                 data={acceptedConsumers}
//                 keyExtractor={(item, index) => `consumer_${item.id || index}`}
//                 renderItem={({ item }) => (
//                   <View style={styles.listItemContainer}>
//                     <TouchableOpacity
//                       style={styles.listItem}
//                       activeOpacity={0.7}
//                       onPress={() => handleNavigateToUserDetails(item)}
//                     >
//                       <View style={styles.listItemLeft}>
//                         <View style={styles.avatarSmall}>
//                           <Text style={styles.avatarText}>
//                             {((item.customer?.first_name?.[0] || '') +
//                               (item.customer?.last_name?.[0] || ''))
//                               .toUpperCase() || item.name?.[0]?.toUpperCase() || 'U'}
//                           </Text>
//                         </View>
//                         <View style={styles.listItemInfo}>
//                           <View style={styles.nameRow}>
//                             <Text style={styles.listItemText}>
//                               {item.customer
//                                 ? `${item.customer.first_name} ${item.customer.last_name}`.trim()
//                                 : item.name || 'Unknown Consumer'}
//                             </Text>
//                             {item.has_temporary_distributor && (
//                               <View style={styles.tempBadge}>
//                                 <Ionicons name="swap-horizontal" size={10} color="#FF9500" />
//                                 <Text style={styles.tempBadgeText}>TEMP</Text>
//                               </View>
//                             )}
//                           </View>
//                           <Text style={styles.listItemSubtext}>
//                             {item.user_contact || 'No contact'}
//                           </Text>
//                           {item.assigned_distributor_name && (
//                             <Text style={styles.assignedDistributor}>
//                               Assigned: {item.assigned_distributor_name}
//                             </Text>
//                           )}
//                         </View>
//                       </View>
//                       <View style={styles.listItemRight}>
//                         <View
//                           style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}
//                         >
//                           <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
//                             {item.status?.toUpperCase() || 'ACCEPTED'}
//                           </Text>
//                         </View>
//                         <Ionicons name="chevron-forward" size={20} color="#ccc" style={{ marginLeft: 8 }} />
//                       </View>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                       style={[
//                         styles.tempAssignButton,
//                         item.has_temporary_distributor && styles.tempAssignButtonActive,
//                       ]}
//                       onPress={() => handleNavigateToTempAssignment(item)}
//                       activeOpacity={0.7}
//                     >
//                       <Ionicons
//                         name={item.has_temporary_distributor ? 'close-circle' : 'swap-horizontal'}
//                         size={18}
//                         color={item.has_temporary_distributor ? '#FF3B30' : '#007AFF'}
//                       />
//                     </TouchableOpacity>
//                   </View>
//                 )}
//                 showsVerticalScrollIndicator={false}
//                 scrollEnabled={false}
//               />
//             )
//           ) : acceptedDistributors.length === 0 ? (
//             <View style={styles.emptyState}>
//               <Ionicons name="business-outline" size={48} color="#ccc" />
//               <Text style={styles.emptyText}>No accepted distributors found.</Text>
//             </View>
//           ) : (
//             <FlatList
//               data={acceptedDistributors}
//               keyExtractor={(item, index) => `distributor_${item.id || index}`}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.listItem}
//                   activeOpacity={0.7}
//                   onPress={() => handleNavigateToUserDetails(item)}
//                 >
//                   <View style={styles.listItemLeft}>
//                     <View style={styles.avatarSmall}>
//                       <Text style={styles.avatarText}>
//                         {getInitials(item.milkman?.full_name || item.name || 'U')}
//                       </Text>
//                     </View>
//                     <View style={styles.listItemInfo}>
//                       <Text style={styles.listItemText}>
//                         {item.milkman?.full_name || item.name || 'Unknown Distributor'}
//                       </Text>
//                       <Text style={styles.listItemSubtext}>
//                         {item.user_contact || 'No contact'}
//                       </Text>
//                       {item.assigned_customers_count !== undefined && item.assigned_customers_count > 0 && (
//                         <Text style={styles.assignedCount}>
//                           {item.assigned_customers_count} customers assigned
//                         </Text>
//                       )}
//                     </View>
//                   </View>
//                   <View style={styles.listItemRight}>
//                     <View
//                       style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}
//                     >
//                       <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
//                         {item.status?.toUpperCase() || 'ACCEPTED'}
//                       </Text>
//                     </View>
//                     <Ionicons name="chevron-forward" size={20} color="#ccc" style={{ marginLeft: 8 }} />
//                   </View>
//                 </TouchableOpacity>
//               )}
//               showsVerticalScrollIndicator={false}
//               scrollEnabled={false}
//             />
//           )}
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default VendorHomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//     paddingTop: Platform.OS === 'ios' ? 50 : 20,
//   },
//   center: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   // LOADING
//   loadingContainer: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//     justifyContent: 'flex-start',
//     paddingTop: Platform.OS === 'ios' ? 50 : 20,
//   },
//   skeletonContainer: {
//     paddingHorizontal: 20,
//     width: '100%',
//   },
//   skeletonHeader: {
//     marginBottom: 20,
//   },
//   skeletonTitle: {
//     width: '60%',
//     height: 28,
//     backgroundColor: '#E1E9EE',
//     borderRadius: 6,
//     marginBottom: 8,
//   },
//   skeletonSubtitle: {
//     width: '40%',
//     height: 16,
//     backgroundColor: '#E1E9EE',
//     borderRadius: 4,
//   },
//   skeletonProfileCard: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 24,
//     alignItems: 'center',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.08,
//         shadowRadius: 8,
//         shadowOffset: { width: 0, height: 4 },
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   skeletonAvatar: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: '#E1E9EE',
//   },
//   skeletonProfileInfo: {
//     marginLeft: 16,
//     flex: 1,
//   },
//   skeletonProfileName: {
//     width: '70%',
//     height: 20,
//     backgroundColor: '#E1E9EE',
//     borderRadius: 4,
//     marginBottom: 8,
//   },
//   skeletonProfileLocation: {
//     width: '50%',
//     height: 14,
//     backgroundColor: '#E1E9EE',
//     borderRadius: 4,
//   },
//   skeletonStatsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     marginBottom: 30,
//   },
//   skeletonStatCard: {
//     width: '48%',
//     height: 120,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     justifyContent: 'space-between',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.06,
//         shadowRadius: 6,
//         shadowOffset: { width: 0, height: 3 },
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },
//   skeletonStatIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#E1E9EE',
//   },
//   skeletonStatValue: {
//     width: '60%',
//     height: 24,
//     backgroundColor: '#E1E9EE',
//     borderRadius: 4,
//     marginTop: 8,
//   },
//   skeletonStatLabel: {
//     width: '80%',
//     height: 14,
//     backgroundColor: '#E1E9EE',
//     borderRadius: 4,
//     marginTop: 4,
//   },
//   loadingIndicatorContainer: {
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   loadingText: {
//     fontSize: 16,
//     color: '#666',
//     marginTop: 12,
//     fontWeight: '500',
//   },

//   // HEADER WITH NOTIFICATION
//   headerRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//   },
//   headerSubtitle: {
//     fontSize: 16,
//     color: '#666',
//     marginTop: 4,
//   },
//   headerActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//   },
//   notificationButton: {
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     position: 'relative',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         shadowOffset: { width: 0, height: 2 },
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
//   },
//   logoutButton: {
//     padding: 8,
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         shadowOffset: { width: 0, height: 2 },
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
//   },

//   // PROFILE CARD
//   profileCard: {
//     backgroundColor: '#fff',
//     marginHorizontal: 20,
//     borderRadius: 16,
//     padding: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.08,
//         shadowRadius: 8,
//         shadowOffset: { width: 0, height: 4 },
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   profileImageContainer: {
//     position: 'relative',
//   },
//   avatarCircle: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   avatarInitials: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   editBadge: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#34C759',
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   profileInfo: {
//     marginLeft: 16,
//     flex: 1,
//   },
//   profileName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//   },
//   profileLocation: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 4,
//     marginBottom: 8,
//   },
//   profileBadge: {
//     backgroundColor: '#007AFF',
//     paddingHorizontal: 12,
//     paddingVertical: 4,
//     borderRadius: 12,
//     alignSelf: 'flex-start',
//   },
//   profileBadgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },

//   // STATS
//   statsSection: {
//     paddingHorizontal: 20,
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginBottom: 16,
//   },
//   statsGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   statCardContainer: {
//     width: '48%',
//     marginBottom: 12,
//   },
//   statCard: {
//     borderRadius: 16,
//     padding: 16,
//     minHeight: 135,
//     justifyContent: 'space-between',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.06,
//         shadowRadius: 6,
//         shadowOffset: { width: 0, height: 3 },
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },
//   iconCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'flex-start',
//   },
//   statContent: {
//     marginTop: 8,
//     flex: 1,
//   },
//   statValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//   },
//   statLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginTop: 4,
//   },
//   statSubtext: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 2,
//   },
//   statTrend: {
//     alignSelf: 'flex-end',
//     marginTop: 8,
//   },

//   // PENDING
//   pendingCard: {
//     backgroundColor: '#fff',
//     marginHorizontal: 20,
//     borderRadius: 16,
//     padding: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 24,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.08,
//         shadowRadius: 8,
//         shadowOffset: { width: 0, height: 4 },
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   pendingLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   pendingIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#FFF4E6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   pendingTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1a1a1a',
//   },
//   pendingSubtitle: {
//     fontSize: 13,
//     color: '#666',
//     marginTop: 2,
//   },
//   pendingRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   pendingCount: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#FF9500',
//     marginRight: 8,
//   },

//   // TABS
//   tabContainer: {
//     paddingHorizontal: 20,
//     marginBottom: 16,
//   },
//   tabRow: {
//     flexDirection: 'row',
//     backgroundColor: '#f0f0f0',
//     borderRadius: 12,
//     padding: 4,
//   },
//   tabButton: {
//     flex: 1,
//     paddingVertical: 12,
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   activeTab: {
//     backgroundColor: '#007AFF',
//   },
//   tabText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#666',
//   },
//   activeTabText: {
//     color: '#fff',
//   },

//   // LIST
//   listContainer: {
//     paddingHorizontal: 20,
//     flex: 1,
//   },
//   listItemContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   listItem: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginRight: 8,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.04,
//         shadowRadius: 4,
//         shadowOffset: { width: 0, height: 2 },
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
//   },
//   listItemLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   listItemRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   listItemInfo: {
//     flex: 1,
//   },
//   nameRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     marginBottom: 2,
//   },
//   avatarSmall: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   avatarText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 14,
//   },
//   listItemText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1a1a1a',
//   },
//   listItemSubtext: {
//     fontSize: 13,
//     color: '#666',
//     marginTop: 2,
//   },
//   assignedCount: {
//     fontSize: 11,
//     color: '#FF9500',
//     fontWeight: '600',
//     marginTop: 2,
//   },
//   assignedDistributor: {
//     fontSize: 11,
//     color: '#007AFF',
//     fontWeight: '500',
//     marginTop: 2,
//   },
//   statusBadge: {
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   statusText: {
//     fontSize: 11,
//     fontWeight: 'bold',
//   },
//   tempBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFF4E6',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 8,
//     gap: 2,
//   },
//   tempBadgeText: {
//     fontSize: 9,
//     color: '#FF9500',
//     fontWeight: '700',
//   },
//   tempAssignButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#E8F4FD',
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.04,
//         shadowRadius: 4,
//         shadowOffset: { width: 0, height: 2 },
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
//   },
//   tempAssignButtonActive: {
//     backgroundColor: '#FFE8E8',
//   },

//   // EMPTY
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#888',
//     marginTop: 12,
//     textAlign: 'center',
//   },

//   // ERROR
//   errorText: {
//     color: '#FF3B30',
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 16,
//     textAlign: 'center',
//     marginTop: 16,
//   },
//   retryButton: {
//     backgroundColor: '#007AFF',
//     borderRadius: 8,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     marginTop: 8,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/authSlice';
import {
  getVendorDetailsById,
  getAcceptedCustomers,
  getAcceptedMilkmen,
  getVendorPendingRequests,
  getConsumerRequests, // <-- NEW
  getDistributorLeaveRequestsForVendor, // <-- NEW
} from '../../apiServices/allApi';
import { getUnreadCount, markAllAsRead, showLocalNotification, notificationEmitter } from '../../notifications/NotificationService';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';

// Navigation Types
type RootStackParamList = {
  VendorHome: undefined;
  VendorProfile: undefined;
  UserDetails: {
    userId: number;
    userType: 'consumer' | 'distributor';
    userName: string;
  };
  ConsumerCalendar: {
    viewerRole: 'vendor';
    targetConsumerId: number;
    targetConsumerName: string;
    showBackButton: boolean;
  };
  VendorDistributorCalendar: {
    viewerRole: 'vendor';
    targetDistributorId: number;
    targetDistributorName: string;
    showBackButton: boolean;
  };
  TemporaryDistributorAssignment: {
    consumerId: number;
    consumerName: string;
    currentDistributorId?: number;
    currentDistributorName?: string;
    isTemporary: boolean;
  };
  PendingRequests: undefined;
  VendorConsumerRequests: undefined; // <-- NEW
  VendorDistributorLeave: undefined; // <-- NEW
  Notifications: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VendorHome'>;

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
  assigned_distributor_id?: number;
  assigned_distributor_name?: string;
  has_temporary_distributor?: boolean;
};

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
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [vendorData, setVendorData] = useState<any>(null);
  const [acceptedConsumers, setAcceptedConsumers] = useState<AcceptedItem[]>([]);
  const [acceptedDistributors, setAcceptedDistributors] = useState<AcceptedItem[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [consumerExtraMilkRequests, setConsumerExtraMilkRequests] = useState<any[]>([]); // <-- NEW
  const [distributorLeaveRequests, setDistributorLeaveRequests] = useState<any[]>([]); // <-- NEW
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'consumer' | 'distributor'>('consumer');
  const [notificationCount, setNotificationCount] = useState(0);

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

      // Fetch Accepted Consumers
      try {
        const consumerRes = await getAcceptedCustomers(vendorId);
        let consumersData = consumerRes?.data?.data || consumerRes?.data || [];
        if (!Array.isArray(consumersData)) {
          consumersData = [];
        }
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
          assigned_distributor_id: item.assigned_distributor_id || item.permanent_distributor_id,
          assigned_distributor_name: item.assigned_distributor_name || item.permanent_distributor_name,
          has_temporary_distributor: item.has_temporary_distributor || false,
        }));

        setAcceptedConsumers(mappedConsumers);
      } catch (consumerError) {
        console.error('Consumer fetch error:', consumerError);
        setAcceptedConsumers([]);
      }

      // Fetch Accepted Distributors
      try {
        const distributorRes = await getAcceptedMilkmen(vendorId);
        let distributorsData = distributorRes?.data?.data || distributorRes?.data || [];
        if (!Array.isArray(distributorsData)) {
          distributorsData = [];
        }

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

      // <-- NEW: Fetch Consumer Extra Milk Requests (when distributor on leave)
      try {
        const consumerReqRes = await getConsumerRequests();
        const consumerReqData = consumerReqRes?.data?.data || consumerReqRes?.data || [];
        setConsumerExtraMilkRequests(Array.isArray(consumerReqData) ? consumerReqData : []);
        console.log('✅ Consumer extra milk requests fetched:', consumerReqData.length);
      } catch (consumerReqError) {
        console.error('Consumer requests fetch error:', consumerReqError);
        setConsumerExtraMilkRequests([]);
      }

      // <-- NEW: Fetch Distributor Leave Requests
      try {
        const distributorLeaveRes = await getDistributorLeaveRequestsForVendor();
        const distributorLeaveData = distributorLeaveRes?.data?.data || distributorLeaveRes?.data || [];
        setDistributorLeaveRequests(Array.isArray(distributorLeaveData) ? distributorLeaveData : []);
        console.log('✅ Distributor leave requests fetched:', distributorLeaveData.length);
      } catch (distributorLeaveError) {
        console.error('Distributor leave requests fetch error:', distributorLeaveError);
        setDistributorLeaveRequests([]);
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
        return '#4CD964';
    }
  };

  const getInitials = (name: string) => {
    if (!name) { return 'V'; }
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // NAVIGATION TO USER DETAILS
  const handleNavigateToUserDetails = useCallback((item: AcceptedItem) => {
    try {
      const userName = item.user_type === 'customer'
        ? (item.customer
          ? `${item.customer.first_name} ${item.customer.last_name}`.trim()
          : item.name || 'Unknown Consumer')
        : (item.milkman?.full_name || item.name || 'Unknown Distributor');

      navigation.navigate('UserDetails', {
        userId: item.user_id,
        userType: item.user_type === 'customer' ? 'consumer' : 'distributor',
        userName: userName,
      });
    } catch (navError) {
      console.error('Navigation error:', navError);
      Alert.alert('Error', 'Cannot navigate to user details');
    }
  }, [navigation]);

  const handleNavigateToTempAssignment = useCallback((item: AcceptedItem) => {
    try {
      navigation.navigate('TemporaryDistributorAssignment', {
        consumerId: item.user_id,
        consumerName: item.name || 'Unknown Consumer',
        currentDistributorId: item.assigned_distributor_id,
        currentDistributorName: item.assigned_distributor_name,
        isTemporary: item.has_temporary_distributor || false,
      });
    } catch (navError) {
      console.error('Navigation error:', navError);
      Alert.alert('Error', 'Cannot navigate to temporary assignment');
    }
  }, [navigation]);

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
      value: 25000,
      subtext: 'This Month',
      backgroundColor: '#E8F8F0',
      iconBg: '#34C759',
      iconColor: '#fff',
      trending: 'up',
    },
    {
      icon: 'alert-circle-outline',
      label: 'Total Overdue Amount',
      value: 15000,
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
        {/* HEADER WITH NOTIFICATION */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Vendor Home</Text>
            <Text style={styles.headerSubtitle}>Welcome back! 👋</Text>
          </View>
          <View style={styles.headerActions}>
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
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
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
              <AnimatedStatCard key={index} stat={stat} />
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
            <Text style={styles.pendingCount}>{pendingRequests.length}</Text>
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
              <Text style={styles.pendingSubtitle}>Requests when distributor on leave</Text>
            </View>
          </View>
          <View style={styles.pendingRight}>
            <Text style={[styles.pendingCount, { color: '#007AFF' }]}>
              {consumerExtraMilkRequests.length}
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
              {distributorLeaveRequests.length}
            </Text>
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

        {/* LIST */}
        <View style={styles.listContainer}>
          {selectedTab === 'consumer' ? (
            acceptedConsumers.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No accepted consumers found.</Text>
              </View>
            ) : (
              <FlatList
                data={acceptedConsumers}
                keyExtractor={(item, index) => `consumer_${item.id || index}`}
                renderItem={({ item }) => (
                  <View style={styles.listItemContainer}>
                    <TouchableOpacity
                      style={styles.listItem}
                      activeOpacity={0.7}
                      onPress={() => handleNavigateToUserDetails(item)}
                    >
                      <View style={styles.listItemLeft}>
                        <View style={styles.avatarSmall}>
                          <Text style={styles.avatarText}>
                            {((item.customer?.first_name?.[0] || '') +
                              (item.customer?.last_name?.[0] || ''))
                              .toUpperCase() || item.name?.[0]?.toUpperCase() || 'U'}
                          </Text>
                        </View>
                        <View style={styles.listItemInfo}>
                          <View style={styles.nameRow}>
                            <Text style={styles.listItemText}>
                              {item.customer
                                ? `${item.customer.first_name} ${item.customer.last_name}`.trim()
                                : item.name || 'Unknown Consumer'}
                            </Text>
                            {item.has_temporary_distributor && (
                              <View style={styles.tempBadge}>
                                <Ionicons name="swap-horizontal" size={10} color="#FF9500" />
                                <Text style={styles.tempBadgeText}>TEMP</Text>
                              </View>
                            )}
                          </View>
                          <Text style={styles.listItemSubtext}>
                            {item.user_contact || 'No contact'}
                          </Text>
                          {item.assigned_distributor_name && (
                            <Text style={styles.assignedDistributor}>
                              Assigned: {item.assigned_distributor_name}
                            </Text>
                          )}
                        </View>
                      </View>
                      <View style={styles.listItemRight}>
                        <View
                          style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}
                        >
                          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                            {item.status?.toUpperCase() || 'ACCEPTED'}
                          </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#ccc" style={{ marginLeft: 8 }} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.tempAssignButton,
                        item.has_temporary_distributor && styles.tempAssignButtonActive,
                      ]}
                      onPress={() => handleNavigateToTempAssignment(item)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={item.has_temporary_distributor ? 'close-circle' : 'swap-horizontal'}
                        size={18}
                        color={item.has_temporary_distributor ? '#FF3B30' : '#007AFF'}
                      />
                    </TouchableOpacity>
                  </View>
                )}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            )
          ) : acceptedDistributors.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="business-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No accepted distributors found.</Text>
            </View>
          ) : (
            <FlatList
              data={acceptedDistributors}
              keyExtractor={(item, index) => `distributor_${item.id || index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  activeOpacity={0.7}
                  onPress={() => handleNavigateToUserDetails(item)}
                >
                  <View style={styles.listItemLeft}>
                    <View style={styles.avatarSmall}>
                      <Text style={styles.avatarText}>
                        {getInitials(item.milkman?.full_name || item.name || 'U')}
                      </Text>
                    </View>
                    <View style={styles.listItemInfo}>
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
                  <View style={styles.listItemRight}>
                    <View
                      style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}
                    >
                      <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.status?.toUpperCase() || 'ACCEPTED'}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" style={{ marginLeft: 8 }} />
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

// Styles remain the same as your original file
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

  // LIST
  listContainer: {
    paddingHorizontal: 20,
    flex: 1,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 8,
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
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
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
  assignedDistributor: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '500',
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
  tempBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },
  tempBadgeText: {
    fontSize: 9,
    color: '#FF9500',
    fontWeight: '700',
  },
  tempAssignButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FD',
    justifyContent: 'center',
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
  tempAssignButtonActive: {
    backgroundColor: '#FFE8E8',
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
