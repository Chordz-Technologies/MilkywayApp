// // // // screens/ConsumerListScreen.tsx
// // // import React, { useCallback, useEffect } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   FlatList,
// // //   StyleSheet,
// // //   RefreshControl,
// // //   ActivityIndicator,
// // //   Platform,
// // //   TouchableOpacity,
// // //   Alert,
// // // } from 'react-native';
// // // import Ionicons from 'react-native-vector-icons/Ionicons';
// // // import { useNavigation, useFocusEffect } from '@react-navigation/native';
// // // import { useDispatch, useSelector } from 'react-redux';
// // // import { RootState, AppDispatch } from '../../store/index';
// // // import {
// // //   fetchAssignedConsumers,
// // //   markDelivery,
// // //   refreshConsumers,
// // //   setSelectedConsumer,
// // //   clearError,
// // //   selectConsumers,
// // //   selectConsumersLoading,
// // //   selectConsumersError,
// // //   selectMarkingDelivery,
// // //   selectConsumersRefreshing,
// // //   selectConsumersStats,
// // //   selectLastActiveDate,
// // //   checkDailyReset,
// // //   AssignedConsumer,
// // // } from '../../store/consumersSlice';
// // // import { useDailyDeliveryReset } from '../../hooks/useDailyDeliveryReset';


// // // type NavigationProp = {
// // //   navigate: (screen: string, params?: any) => void;
// // //   goBack: () => void;
// // // };

// // // const safeParseMilkQuantity = (value: number | string | null | undefined): number => {
// // //   if (value === null || value === undefined) {
// // //     return 0;
// // //   }

// // //   if (typeof value === 'string') {
// // //     if (value.trim() === '') {
// // //       return 0;
// // //     }
// // //     const parsed = parseFloat(value);
// // //     return isNaN(parsed) ? 0 : parsed;
// // //   }

// // //   if (typeof value === 'number') {
// // //     return isNaN(value) ? 0 : value;
// // //   }

// // //   return 0;
// // // };

// // // const ConsumerListScreen = () => {
// // //   const navigation = useNavigation<NavigationProp>();
// // //   const dispatch = useDispatch<AppDispatch>();

// // //   useDailyDeliveryReset();

// // //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
// // //   const consumers = useSelector(selectConsumers);
// // //   const loading = useSelector(selectConsumersLoading);
// // //   const error = useSelector(selectConsumersError);
// // //   const markingDelivery = useSelector(selectMarkingDelivery);
// // //   const refreshing = useSelector(selectConsumersRefreshing);
// // //   const stats = useSelector(selectConsumersStats);
// // //   const lastActiveDate = useSelector(selectLastActiveDate);

// // //   const getMilkmanId = useCallback(() => {
// // //     if (!user?.userID) {return 0;}
// // //     return typeof user.userID === 'string' ? parseInt(user.userID, 10) : Number(user.userID);
// // //   }, [user?.userID]);

// // //   const getTodayString = useCallback(() => {
// // //     return new Date().toISOString().split('T')[0];
// // //   }, []);

// // //   const getTodayDeliveryStatus = useCallback((consumer: AssignedConsumer) => {
// // //     const today = getTodayString();

// // //     const todayDelivery = consumer.deliveryHistory?.find(d => d.date === today);

// // //     if (todayDelivery) {
// // //       return {
// // //         hasDelivery: true,
// // //         status: todayDelivery.status,
// // //         isDelivered: todayDelivery.status === 'delivered',
// // //         isCancelled: todayDelivery.status === 'cancelled',
// // //         remarks: todayDelivery.remarks,
// // //       };
// // //     }

// // //     return {
// // //       hasDelivery: false,
// // //       status: null,
// // //       isDelivered: false,
// // //       isCancelled: false,
// // //       remarks: null,
// // //     };
// // //   }, [getTodayString]);

// // //   const formatAddress = useCallback((address?: string) => {
// // //     if (!address) {return '';}
// // //     return address;
// // //   }, []);

// // //   const getMilkRequirementText = useCallback((requirement?: AssignedConsumer['milk_requirement']) => {
// // //     if (!requirement) {
// // //       return 'No requirement specified';
// // //     }

// // //     const cow = safeParseMilkQuantity(requirement.cow_milk_litre);
// // //     const buffalo = safeParseMilkQuantity(requirement.buffalo_milk_litre);
// // //     const total = cow + buffalo;

// // //     if (total === 0) {
// // //       return 'No milk required';
// // //     }

// // //     if (cow > 0 && buffalo > 0) {
// // //       return `Mixed: ${cow}L Cow + ${buffalo}L Buffalo = ${total}L Total`;
// // //     } else if (cow > 0) {
// // //       return `Cow Milk Only: ${cow}L Daily`;
// // //     } else {
// // //       return `Buffalo Milk Only: ${buffalo}L Daily`;
// // //     }
// // //   }, []);

// // //   useEffect(() => {
// // //     if (isAuthenticated && user?.userID) {
// // //       dispatch(checkDailyReset()).then(() => {
// // //         dispatch(fetchAssignedConsumers(getMilkmanId()));
// // //       });
// // //     }
// // //   }, [dispatch, isAuthenticated, user?.userID, getMilkmanId]);

// // //   useFocusEffect(
// // //     useCallback(() => {
// // //       if (isAuthenticated && user?.userID) {
// // //         dispatch(checkDailyReset()).then(() => {
// // //           const lastFetch = new Date().getTime();
// // //           const fiveMinutes = 5 * 60 * 1000;

// // //           if (!consumers.length || (lastFetch - fiveMinutes > lastFetch)) {
// // //             dispatch(fetchAssignedConsumers(getMilkmanId()));
// // //           }
// // //         });
// // //       }
// // //     }, [dispatch, isAuthenticated, user?.userID, getMilkmanId, consumers.length])
// // //   );

// // //   const handleRefresh = useCallback(() => {
// // //     if (!user?.userID) {return;}

// // //     const today = getTodayString();
// // //     const isNewDay = lastActiveDate && lastActiveDate !== today;

// // //     if (isNewDay) {
// // //       Alert.alert(
// // //         '🗓️ New Day Detected',
// // //         'This is a new day! Delivery status will be reset but all other data will be preserved.',
// // //         [
// // //           { text: 'Cancel', style: 'cancel' },
// // //           {
// // //             text: 'Refresh',
// // //             onPress: () => {
// // //               dispatch(checkDailyReset()).then(() => {
// // //                 dispatch(refreshConsumers(getMilkmanId()));
// // //               });
// // //             },
// // //           },
// // //         ]
// // //       );
// // //     } else {
// // //       dispatch(checkDailyReset()).then(() => {
// // //         dispatch(refreshConsumers(getMilkmanId()));
// // //       });
// // //     }
// // //   }, [dispatch, user?.userID, getMilkmanId, getTodayString, lastActiveDate]);

// // //   const handleMarkDelivery = useCallback(async (consumer: AssignedConsumer) => {
// // //     const today = getTodayString();
// // //     const milkmanId = getMilkmanId();
// // //     const todayStatus = getTodayDeliveryStatus(consumer);

// // //     const currentStatusInfo = todayStatus.hasDelivery
// // //       ? `\n\nCurrent status: ${todayStatus.status === 'delivered' ? 'Delivered' : 'Cancelled'}\nThis will replace the existing status.`
// // //       : '';

// // //     Alert.alert(
// // //       'Mark as Delivered ✅',
// // //       `Mark delivery as successful for:\n\n👤 ${consumer.customer_name}\n📅 ${today}\n🥛 ${getMilkRequirementText(consumer.milk_requirement)}${currentStatusInfo}`,
// // //       [
// // //         { text: 'Cancel', style: 'cancel' },
// // //         {
// // //           text: 'Mark Delivered',
// // //           onPress: async () => {
// // //             try {
// // //               await dispatch(markDelivery({
// // //                 customer_id: consumer.customer_id,
// // //                 date: today,
// // //                 milkman_id: milkmanId,
// // //                 status: 'delivered',
// // //                 remarks: `Delivery completed successfully for ${consumer.customer_name}`,
// // //                 replaceExisting: true,
// // //               })).unwrap();

// // //               Alert.alert(
// // //                 'Success! ✅',
// // //                 `Delivery marked as successful for ${consumer.customer_name || 'customer'}`,
// // //                 [{ text: 'OK' }]
// // //               );
// // //             } catch (error: any) {
// // //               Alert.alert('Error ❌', error || 'Failed to mark delivery. Please try again.');
// // //             }
// // //           },
// // //         },
// // //       ]
// // //     );
// // //   }, [dispatch, getMilkmanId, getMilkRequirementText, getTodayString, getTodayDeliveryStatus]);

// // //   const handleMarkDeliveryCancelled = useCallback(async (consumer: AssignedConsumer, reason?: string) => {
// // //     const today = getTodayString();
// // //     const milkmanId = getMilkmanId();

// // //     try {
// // //       await dispatch(markDelivery({
// // //         customer_id: consumer.customer_id,
// // //         date: today,
// // //         milkman_id: milkmanId,
// // //         status: 'cancelled',
// // //         remarks: reason || `Delivery cancelled for ${consumer.customer_name}`,
// // //         replaceExisting: true,
// // //       })).unwrap();

// // //       Alert.alert(
// // //         'Delivery Cancelled ❌',
// // //         `Delivery has been cancelled for ${consumer.customer_name}.\nReason: ${reason}`,
// // //         [{ text: 'OK' }]
// // //       );
// // //     } catch (error: any) {
// // //       Alert.alert('Error', error || 'Failed to cancel delivery. Please try again.');
// // //     }
// // //   }, [dispatch, getMilkmanId, getTodayString]);

// // //   const handleViewCalendar = useCallback((consumer: AssignedConsumer) => {
// // //     dispatch(setSelectedConsumer(consumer));

// // //     const consumerData = {
// // //       consumerId: consumer.customer_id,
// // //       consumerName: consumer.customer_name,
// // //       consumerContact: consumer.customer_contact,
// // //       distributorId: getMilkmanId(),
// // //       milkRequirement: consumer.milk_requirement,
// // //       consumerAddress: formatAddress(consumer.customer_address),
// // //       vendorName: consumer.provider?.provider_name || consumer.vendor_name,
// // //       assignmentDate: consumer.assignment_date,
// // //       deliveryStatus: consumer.deliveryStatus,
// // //       lastDeliveryDate: consumer.lastDeliveryDate,
// // //       source: 'distributor',
// // //       sourceScreen: 'ConsumerList',
// // //     };

// // //     navigation.navigate('DistributorConsumerCalendar', consumerData);
// // //   }, [dispatch, navigation, getMilkmanId, formatAddress]);

// // //   useEffect(() => {
// // //     return () => {
// // //       if (error) {
// // //         dispatch(clearError());
// // //       }
// // //     };
// // //   }, [dispatch, error]);

// // //   const renderConsumerItem = ({ item }: { item: AssignedConsumer }) => {
// // //     const address = formatAddress(item.customer_address);
// // //     const isMarkingThisDelivery = markingDelivery === item.customer_id;

// // //     const cowMilk = safeParseMilkQuantity(item.milk_requirement?.cow_milk_litre);
// // //     const buffaloMilk = safeParseMilkQuantity(item.milk_requirement?.buffalo_milk_litre);
// // //     const totalMilk = cowMilk + buffaloMilk;

// // //     const hasCow = cowMilk > 0;
// // //     const hasBuffalo = buffaloMilk > 0;
// // //     const hasAnyMilk = hasCow || hasBuffalo;

// // //     const todayStatus = getTodayDeliveryStatus(item);

// // //     return (
// // //       <View style={styles.modernCard}>
// // //         <View style={styles.cardHeader}>
// // //           <View style={styles.customerInfo}>
// // //             <View style={styles.modernAvatar}>
// // //               <Text style={styles.avatarText}>
// // //                 {item.customer_name?.[0]?.toUpperCase() || 'C'}
// // //               </Text>
// // //             </View>
// // //             <View style={styles.customerDetails}>
// // //               <Text style={styles.customerName}>
// // //                 {item.customer_name || 'Unknown Customer'}
// // //               </Text>
// // //               <View style={styles.contactContainer}>
// // //                 <Ionicons name="call" size={12} color="#007AFF" />
// // //                 <Text style={styles.contactText}>
// // //                   {item.customer_contact || 'No contact'}
// // //                 </Text>
// // //               </View>
// // //             </View>
// // //           </View>

// // //           <View style={styles.statusContainer}>
// // //             {todayStatus.hasDelivery ? (
// // //               <View style={[
// // //                 styles.statusBadge,
// // //                 { backgroundColor: todayStatus.isDelivered ? '#34C759' : '#FF3B30' },
// // //               ]}>
// // //                 <Ionicons
// // //                   name={todayStatus.isDelivered ? 'checkmark-circle' : 'close-circle'}
// // //                   size={14}
// // //                   color="#fff"
// // //                 />
// // //                 <Text style={styles.statusText}>
// // //                   {todayStatus.isDelivered ? 'Delivered Today' : 'Cancelled Today'}
// // //                 </Text>
// // //               </View>
// // //             ) : (
// // //               <View style={[styles.statusBadge, { backgroundColor: '#FF9500' }]}>
// // //                 <Ionicons name="time" size={14} color="#fff" />
// // //                 <Text style={styles.statusText}>Pending Today</Text>
// // //               </View>
// // //             )}
// // //           </View>
// // //         </View>

// // //         {address && (
// // //           <View style={styles.addressSection}>
// // //             <Ionicons name="location" size={14} color="#FF9500" />
// // //             <Text style={styles.addressText} numberOfLines={2}>
// // //               {address}
// // //             </Text>
// // //           </View>
// // //         )}

// // //         <View style={styles.milkSection}>
// // //           <View style={styles.milkHeader}>
// // //             <Ionicons name="water" size={16} color="#007AFF" />
// // //             <Text style={styles.milkHeaderText}>Daily Requirement</Text>
// // //             <View style={styles.totalMilkBadge}>
// // //               <Text style={styles.totalMilkBadgeText}>{totalMilk}L</Text>
// // //             </View>
// // //           </View>
// // //           <View style={styles.milkDetails}>
// // //             {hasAnyMilk ? (
// // //               <>
// // //                 {/* ✅ SIMPLIFIED: Show only individual milk types without summary */}
// // //                 {hasCow && (
// // //                   <View style={styles.milkType}>
// // //                     <View style={[styles.milkTypeDot, { backgroundColor: '#34C759' }]} />
// // //                     <Text style={styles.milkTypeText}>
// // //                       Cow: {cowMilk}L
// // //                     </Text>
// // //                   </View>
// // //                 )}

// // //                 {hasBuffalo && (
// // //                   <View style={styles.milkType}>
// // //                     <View style={[styles.milkTypeDot, { backgroundColor: '#FF9500' }]} />
// // //                     <Text style={styles.milkTypeText}>
// // //                       Buffalo: {buffaloMilk}L
// // //                     </Text>
// // //                   </View>
// // //                 )}

// // //                 {/* ✅ REMOVED: Milk summary section completely removed */}
// // //               </>
// // //             ) : (
// // //               <View style={styles.noMilkContainer}>
// // //                 <Text style={styles.noMilkText}>
// // //                   ⚠️ No milk requirement specified
// // //                 </Text>
// // //               </View>
// // //             )}
// // //           </View>
// // //         </View>

// // //         <View style={styles.actionButtonsContainer}>
// // //           <TouchableOpacity
// // //             style={[styles.actionButton, styles.calendarButton]}
// // //             onPress={() => handleViewCalendar(item)}
// // //             activeOpacity={0.8}
// // //           >
// // //             <Ionicons name="calendar" size={18} color="#007AFF" />
// // //             <Text style={[styles.actionButtonText, { color: '#007AFF' }]}>
// // //               Calendar
// // //             </Text>
// // //           </TouchableOpacity>

// // //           <TouchableOpacity
// // //             style={[
// // //               styles.actionButton,
// // //               styles.deliverButton,
// // //               (isMarkingThisDelivery || todayStatus.isCancelled || !hasAnyMilk) && styles.deliverButtonDisabled,
// // //             ]}
// // //             onPress={() => handleMarkDelivery(item)}
// // //             activeOpacity={0.8}
// // //             disabled={isMarkingThisDelivery || todayStatus.isCancelled || !hasAnyMilk}
// // //           >
// // //             {isMarkingThisDelivery ? (
// // //               <ActivityIndicator size="small" color="#fff" />
// // //             ) : (
// // //               <View style={styles.buttonContent}>
// // //                 <Ionicons name="checkmark-circle" size={18} color="#fff" />
// // //                 <Text style={[styles.actionButtonText, { color: '#fff' }]}>
// // //                   {todayStatus.isDelivered ? 'Delivered ✓' : 'Delivery'}
// // //                 </Text>
// // //               </View>
// // //             )}
// // //           </TouchableOpacity>

// // //           <TouchableOpacity
// // //             style={[
// // //               styles.actionButton,
// // //               styles.cancelButton,
// // //               (isMarkingThisDelivery || todayStatus.isDelivered || !hasAnyMilk) && styles.cancelButtonDisabled,
// // //             ]}
// // //             onPress={() => {
// // //               Alert.alert(
// // //                 'Cancel Delivery',
// // //                 'Select reason for cancellation:',
// // //                 [
// // //                   { text: 'Customer Unavailable', onPress: () => handleMarkDeliveryCancelled(item, 'Customer unavailable') },
// // //                   { text: 'Address Issue', onPress: () => handleMarkDeliveryCancelled(item, 'Address issue') },
// // //                   { text: 'Product Issue', onPress: () => handleMarkDeliveryCancelled(item, 'Product issue') },
// // //                   { text: 'Weather/Traffic', onPress: () => handleMarkDeliveryCancelled(item, 'Weather/Traffic delay') },
// // //                   { text: 'Other', onPress: () => handleMarkDeliveryCancelled(item, 'Other reason') },
// // //                   { text: 'Back', style: 'cancel' },
// // //                 ]
// // //               );
// // //             }}
// // //             activeOpacity={0.8}
// // //             disabled={isMarkingThisDelivery || todayStatus.isDelivered || !hasAnyMilk}
// // //           >
// // //             <View style={styles.buttonContent}>
// // //               <Ionicons name="close-circle" size={18} color={todayStatus.isDelivered || !hasAnyMilk ? '#999' : '#FF3B30'} />
// // //               <Text style={[
// // //                 styles.actionButtonText,
// // //                 { color: todayStatus.isDelivered || !hasAnyMilk ? '#999' : '#FF3B30' },
// // //               ]}>
// // //                 {todayStatus.isCancelled ? 'Cancelled ✗' : 'Cancel'}
// // //               </Text>
// // //             </View>
// // //           </TouchableOpacity>
// // //         </View>

// // //         <View style={styles.bottomSection}>
// // //           {item.provider?.provider_name && (
// // //             <View style={styles.vendorInfo}>
// // //               <Ionicons name="business" size={12} color="#8E8E93" />
// // //               <Text style={styles.vendorText}>
// // //                 Vendor: {item.provider.provider_name}
// // //               </Text>
// // //             </View>
// // //           )}

// // //           {item.milkman?.milkman_name && (
// // //             <View style={styles.vendorInfo}>
// // //               <Ionicons name="person" size={12} color="#8E8E93" />
// // //               <Text style={styles.vendorText}>
// // //                 Distributor: {item.milkman.milkman_name}
// // //               </Text>
// // //             </View>
// // //           )}

// // //           {todayStatus.hasDelivery && todayStatus.remarks && (
// // //             <View style={styles.remarksInfo}>
// // //               <Ionicons name="chatbubble" size={12} color="#8E8E93" />
// // //               <Text style={styles.remarksText}>
// // //                 Today: {todayStatus.remarks}
// // //               </Text>
// // //             </View>
// // //           )}
// // //         </View>
// // //       </View>
// // //     );
// // //   };

// // //   if (!isAuthenticated) {
// // //     return (
// // //       <View style={styles.centerContainer}>
// // //         <ActivityIndicator size="large" color="#007AFF" />
// // //         <Text style={styles.loadingText}>Loading...</Text>
// // //       </View>
// // //     );
// // //   }

// // //   return (
// // //     <View style={styles.container}>
// // //       <View style={styles.modernHeader}>
// // //         <TouchableOpacity
// // //           onPress={() => navigation.goBack()}
// // //           style={styles.headerBackButton}
// // //         >
// // //           <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
// // //         </TouchableOpacity>
// // //         <View style={styles.headerContent}>
// // //           <Text style={styles.headerTitle}>Daily Deliveries</Text>
// // //           <Text style={styles.headerSubtitle}>
// // //             {getTodayString()} • {stats.totalConsumers} consumers • {stats.totalMilk}L total
// // //             {lastActiveDate && lastActiveDate !== getTodayString() && ' • New Day!'}
// // //           </Text>
// // //         </View>
// // //         <TouchableOpacity onPress={handleRefresh} style={styles.headerRefreshButton}>
// // //           {refreshing ? (
// // //             <ActivityIndicator size="small" color="#007AFF" />
// // //           ) : (
// // //             <Ionicons name="refresh" size={22} color="#007AFF" />
// // //           )}
// // //         </TouchableOpacity>
// // //       </View>

// // //       <View style={styles.modernStatsContainer}>
// // //         <View style={styles.statCard}>
// // //           <View style={[styles.statIconContainer, { backgroundColor: '#E8F4FD' }]}>
// // //             <Ionicons name="people" size={20} color="#007AFF" />
// // //           </View>
// // //           <Text style={styles.statValue}>{stats.totalConsumers}</Text>
// // //           <Text style={styles.statLabel}>Total</Text>
// // //         </View>

// // //         <View style={styles.statCard}>
// // //           <View style={[styles.statIconContainer, { backgroundColor: '#F0FFF4' }]}>
// // //             <Ionicons name="checkmark-circle" size={20} color="#34C759" />
// // //           </View>
// // //           <Text style={styles.statValue}>
// // //             {consumers.filter(c => getTodayDeliveryStatus(c).isDelivered).length}
// // //           </Text>
// // //           <Text style={styles.statLabel}>Delivered</Text>
// // //         </View>

// // //         <View style={styles.statCard}>
// // //           <View style={[styles.statIconContainer, { backgroundColor: '#FFF5F5' }]}>
// // //             <Ionicons name="close-circle" size={20} color="#FF3B30" />
// // //           </View>
// // //           <Text style={styles.statValue}>
// // //             {consumers.filter(c => getTodayDeliveryStatus(c).isCancelled).length}
// // //           </Text>
// // //           <Text style={styles.statLabel}>Cancelled</Text>
// // //         </View>

// // //         <View style={styles.statCard}>
// // //           <View style={[styles.statIconContainer, { backgroundColor: '#FFF9F0' }]}>
// // //             <Ionicons name="time" size={20} color="#FF9500" />
// // //           </View>
// // //           <Text style={styles.statValue}>
// // //             {consumers.filter(c => !getTodayDeliveryStatus(c).hasDelivery).length}
// // //           </Text>
// // //           <Text style={styles.statLabel}>Pending</Text>
// // //         </View>
// // //       </View>

// // //       {error && (
// // //         <View style={styles.modernErrorBanner}>
// // //           <Ionicons name="alert-circle" size={20} color="#FF3B30" />
// // //           <Text style={styles.errorText}>{error}</Text>
// // //           <TouchableOpacity
// // //             onPress={() => {
// // //               dispatch(clearError());
// // //               handleRefresh();
// // //             }}
// // //             style={styles.errorRetryButton}
// // //           >
// // //             <Text style={styles.errorRetryText}>Retry</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       )}

// // //       {loading && consumers.length === 0 ? (
// // //         <View style={styles.centerContainer}>
// // //           <ActivityIndicator size="large" color="#007AFF" />
// // //           <Text style={styles.loadingText}>Loading your assigned consumers...</Text>
// // //         </View>
// // //       ) : (
// // //         <FlatList
// // //           data={consumers}
// // //           keyExtractor={(item, index) => `consumer_${item.id || item.customer_id || index}`}
// // //           renderItem={renderConsumerItem}
// // //           contentContainerStyle={styles.modernListContainer}
// // //           refreshControl={
// // //             <RefreshControl
// // //               refreshing={refreshing}
// // //               onRefresh={handleRefresh}
// // //               colors={['#007AFF']}
// // //               tintColor="#007AFF"
// // //             />
// // //           }
// // //           ListEmptyComponent={() => (
// // //             <View style={styles.modernEmptyContainer}>
// // //               <View style={styles.emptyIconContainer}>
// // //                 <Ionicons name="people-outline" size={60} color="#C7C7CC" />
// // //               </View>
// // //               <Text style={styles.emptyTitle}>No Consumers Assigned</Text>
// // //               <Text style={styles.emptyText}>
// // //                 You don't have any consumers assigned yet. Contact your vendor to get started with deliveries.
// // //               </Text>
// // //               <TouchableOpacity onPress={handleRefresh} style={styles.modernRefreshButton}>
// // //                 <Ionicons name="refresh" size={18} color="#fff" />
// // //                 <Text style={styles.modernRefreshButtonText}>Refresh</Text>
// // //               </TouchableOpacity>
// // //             </View>
// // //           )}
// // //           showsVerticalScrollIndicator={false}
// // //         />
// // //       )}
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#F8F9FA',
// // //   },
// // //   modernHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingVertical: 16,
// // //     paddingHorizontal: 20,
// // //     paddingTop: Platform.OS === 'ios' ? 50 : 20,
// // //     backgroundColor: '#fff',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#E1E4E8',
// // //     ...Platform.select({
// // //       ios: {
// // //         shadowColor: '#000',
// // //         shadowOpacity: 0.03,
// // //         shadowRadius: 8,
// // //         shadowOffset: { width: 0, height: 2 },
// // //       },
// // //       android: {
// // //         elevation: 2,
// // //       },
// // //     }),
// // //   },
// // //   headerBackButton: {
// // //     width: 44,
// // //     height: 44,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderRadius: 22,
// // //     backgroundColor: '#F8F9FA',
// // //   },
// // //   headerContent: {
// // //     flex: 1,
// // //     marginLeft: 16,
// // //   },
// // //   headerTitle: {
// // //     fontSize: 24,
// // //     fontWeight: '700',
// // //     color: '#1C1C1E',
// // //     letterSpacing: -0.5,
// // //   },
// // //   headerSubtitle: {
// // //     fontSize: 14,
// // //     color: '#8E8E93',
// // //     marginTop: 2,
// // //     fontWeight: '500',
// // //   },
// // //   headerRefreshButton: {
// // //     width: 44,
// // //     height: 44,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     borderRadius: 22,
// // //     backgroundColor: '#F0F8FF',
// // //   },
// // //   modernStatsContainer: {
// // //     flexDirection: 'row',
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 16,
// // //     gap: 12,
// // //   },
// // //   statCard: {
// // //     flex: 1,
// // //     backgroundColor: '#fff',
// // //     borderRadius: 16,
// // //     padding: 16,
// // //     alignItems: 'center',
// // //     ...Platform.select({
// // //       ios: {
// // //         shadowColor: '#000',
// // //         shadowOpacity: 0.04,
// // //         shadowRadius: 8,
// // //         shadowOffset: { width: 0, height: 2 },
// // //       },
// // //       android: {
// // //         elevation: 2,
// // //       },
// // //     }),
// // //   },
// // //   statIconContainer: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   statValue: {
// // //     fontSize: 20,
// // //     fontWeight: '700',
// // //     color: '#1C1C1E',
// // //     marginBottom: 2,
// // //   },
// // //   statLabel: {
// // //     fontSize: 10,
// // //     color: '#8E8E93',
// // //     fontWeight: '500',
// // //   },
// // //   modernCard: {
// // //     backgroundColor: '#fff',
// // //     borderRadius: 20,
// // //     marginHorizontal: 20,
// // //     marginBottom: 16,
// // //     padding: 20,
// // //     ...Platform.select({
// // //       ios: {
// // //         shadowColor: '#000',
// // //         shadowOpacity: 0.06,
// // //         shadowRadius: 12,
// // //         shadowOffset: { width: 0, height: 4 },
// // //       },
// // //       android: {
// // //         elevation: 4,
// // //       },
// // //     }),
// // //   },
// // //   cardHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 16,
// // //   },
// // //   customerInfo: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flex: 1,
// // //   },
// // //   modernAvatar: {
// // //     width: 48,
// // //     height: 48,
// // //     borderRadius: 24,
// // //     backgroundColor: '#007AFF',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //   },
// // //   avatarText: {
// // //     color: '#fff',
// // //     fontWeight: '700',
// // //     fontSize: 18,
// // //   },
// // //   customerDetails: {
// // //     flex: 1,
// // //   },
// // //   customerName: {
// // //     fontSize: 17,
// // //     fontWeight: '600',
// // //     color: '#1C1C1E',
// // //     marginBottom: 4,
// // //   },
// // //   contactContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 4,
// // //   },
// // //   contactText: {
// // //     fontSize: 14,
// // //     color: '#007AFF',
// // //     fontWeight: '500',
// // //   },
// // //   statusContainer: {
// // //     alignItems: 'flex-end',
// // //   },
// // //   statusBadge: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 6,
// // //     borderRadius: 12,
// // //     gap: 4,
// // //   },
// // //   statusText: {
// // //     fontSize: 12,
// // //     fontWeight: '600',
// // //     color: '#fff',
// // //   },
// // //   addressSection: {
// // //     flexDirection: 'row',
// // //     alignItems: 'flex-start',
// // //     backgroundColor: '#FFF9F0',
// // //     padding: 12,
// // //     borderRadius: 12,
// // //     marginBottom: 16,
// // //     gap: 8,
// // //   },
// // //   addressText: {
// // //     fontSize: 13,
// // //     color: '#8E8E93',
// // //     lineHeight: 18,
// // //     flex: 1,
// // //   },
// // //   milkSection: {
// // //     backgroundColor: '#F0F8FF',
// // //     borderRadius: 12,
// // //     padding: 12,
// // //     marginBottom: 16,
// // //   },
// // //   milkHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     marginBottom: 8,
// // //   },
// // //   milkHeaderText: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: '#007AFF',
// // //     flex: 1,
// // //     marginLeft: 6,
// // //   },
// // //   totalMilkBadge: {
// // //     backgroundColor: '#007AFF',
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 4,
// // //     borderRadius: 8,
// // //   },
// // //   totalMilkBadgeText: {
// // //     fontSize: 12,
// // //     fontWeight: '700',
// // //     color: '#fff',
// // //   },
// // //   milkDetails: {
// // //     gap: 6,
// // //   },
// // //   milkType: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 8,
// // //   },
// // //   milkTypeDot: {
// // //     width: 8,
// // //     height: 8,
// // //     borderRadius: 4,
// // //   },
// // //   milkTypeText: {
// // //     fontSize: 13,
// // //     color: '#1C1C1E',
// // //     fontWeight: '500',
// // //   },
// // //   noMilkContainer: {
// // //     backgroundColor: '#FFF8E1',
// // //     padding: 8,
// // //     borderRadius: 6,
// // //     alignItems: 'center',
// // //   },
// // //   noMilkText: {
// // //     fontSize: 13,
// // //     color: '#FF9500',
// // //     fontStyle: 'italic',
// // //     textAlign: 'center',
// // //     fontWeight: '600',
// // //   },
// // //   actionButtonsContainer: {
// // //     flexDirection: 'row',
// // //     gap: 8,
// // //     marginBottom: 12,
// // //   },
// // //   actionButton: {
// // //     flex: 1,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     paddingVertical: 12,
// // //     paddingHorizontal: 16,
// // //     borderRadius: 12,
// // //     gap: 6,
// // //   },
// // //   buttonContent: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 6,
// // //   },
// // //   calendarButton: {
// // //     backgroundColor: '#F0F8FF',
// // //     borderWidth: 1,
// // //     borderColor: '#007AFF',
// // //   },
// // //   deliverButton: {
// // //     backgroundColor: '#34C759',
// // //   },
// // //   deliverButtonDisabled: {
// // //     backgroundColor: '#C7C7CC',
// // //   },
// // //   cancelButton: {
// // //     backgroundColor: '#FFF5F5',
// // //     borderWidth: 1,
// // //     borderColor: '#FF3B30',
// // //   },
// // //   cancelButtonDisabled: {
// // //     backgroundColor: '#F8F9FA',
// // //     borderColor: '#C7C7CC',
// // //   },
// // //   actionButtonText: {
// // //     fontSize: 13,
// // //     fontWeight: '600',
// // //   },
// // //   bottomSection: {
// // //     paddingTop: 12,
// // //     borderTopWidth: 1,
// // //     borderTopColor: '#F1F3F4',
// // //     gap: 8,
// // //   },
// // //   vendorInfo: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 6,
// // //   },
// // //   vendorText: {
// // //     fontSize: 12,
// // //     color: '#8E8E93',
// // //     fontWeight: '500',
// // //   },
// // //   remarksInfo: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 6,
// // //   },
// // //   remarksText: {
// // //     fontSize: 12,
// // //     color: '#8E8E93',
// // //     fontStyle: 'italic',
// // //     flex: 1,
// // //   },
// // //   modernErrorBanner: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#FFF5F5',
// // //     borderWidth: 1,
// // //     borderColor: '#FFD6D6',
// // //     padding: 16,
// // //     marginHorizontal: 20,
// // //     marginBottom: 16,
// // //     borderRadius: 12,
// // //     gap: 12,
// // //   },
// // //   errorText: {
// // //     color: '#FF3B30',
// // //     fontSize: 14,
// // //     flex: 1,
// // //     fontWeight: '500',
// // //   },
// // //   errorRetryButton: {
// // //     backgroundColor: '#FF3B30',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 8,
// // //     borderRadius: 8,
// // //   },
// // //   errorRetryText: {
// // //     color: '#fff',
// // //     fontSize: 12,
// // //     fontWeight: '600',
// // //   },
// // //   centerContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 20,
// // //   },
// // //   loadingText: {
// // //     marginTop: 16,
// // //     color: '#8E8E93',
// // //     fontSize: 16,
// // //     fontWeight: '500',
// // //   },
// // //   modernListContainer: {
// // //     paddingBottom: 40,
// // //   },
// // //   modernEmptyContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 40,
// // //     paddingTop: 60,
// // //   },
// // //   emptyIconContainer: {
// // //     width: 120,
// // //     height: 120,
// // //     borderRadius: 60,
// // //     backgroundColor: '#F8F9FA',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginBottom: 24,
// // //   },
// // //   emptyTitle: {
// // //     fontSize: 22,
// // //     fontWeight: '700',
// // //     color: '#1C1C1E',
// // //     marginBottom: 12,
// // //     textAlign: 'center',
// // //   },
// // //   emptyText: {
// // //     fontSize: 16,
// // //     color: '#8E8E93',
// // //     textAlign: 'center',
// // //     lineHeight: 22,
// // //     marginBottom: 32,
// // //   },
// // //   modernRefreshButton: {
// // //     backgroundColor: '#007AFF',
// // //     borderRadius: 12,
// // //     paddingHorizontal: 24,
// // //     paddingVertical: 12,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 8,
// // //   },
// // //   modernRefreshButtonText: {
// // //     color: '#fff',
// // //     fontWeight: '600',
// // //     fontSize: 16,
// // //   },
// // // });

// // // export default ConsumerListScreen;
// // // screens/ConsumerListScreen.tsx
// // import React, { useCallback, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   FlatList,
// //   StyleSheet,
// //   RefreshControl,
// //   ActivityIndicator,
// //   Platform,
// //   TouchableOpacity,
// //   Alert,
// // } from 'react-native';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import { useNavigation, useFocusEffect } from '@react-navigation/native';
// // import { useDispatch, useSelector } from 'react-redux';
// // import { RootState, AppDispatch } from '../../store/index';
// // import {
// //   fetchAssignedConsumers,
// //   markDelivery,
// //   refreshConsumers,
// //   setSelectedConsumer,
// //   clearError,
// //   selectConsumers,
// //   selectConsumersLoading,
// //   selectConsumersError,
// //   selectMarkingDelivery,
// //   selectConsumersRefreshing,
// //   selectConsumersStats,
// //   selectLastActiveDate,
// //   checkDailyReset,
// //   AssignedConsumer,
// // } from '../../store/consumersSlice';
// // import { useDailyDeliveryReset } from '../../hooks/useDailyDeliveryReset';

// // type NavigationProp = {
// //   navigate: (screen: string, params?: any) => void;
// //   goBack: () => void;
// // };

// // const safeParseMilkQuantity = (value: number | string | null | undefined): number => {
// //   if (value === null || value === undefined) {
// //     return 0;
// //   }

// //   if (typeof value === 'string') {
// //     if (value.trim() === '') {
// //       return 0;
// //     }
// //     const parsed = parseFloat(value);
// //     return isNaN(parsed) ? 0 : parsed;
// //   }

// //   if (typeof value === 'number') {
// //     return isNaN(value) ? 0 : value;
// //   }

// //   return 0;
// // };

// // const ConsumerListScreen = () => {
// //   const navigation = useNavigation<NavigationProp>();
// //   const dispatch = useDispatch<AppDispatch>();

// //   useDailyDeliveryReset();

// //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
// //   const consumers = useSelector(selectConsumers);
// //   const loading = useSelector(selectConsumersLoading);
// //   const error = useSelector(selectConsumersError);
// //   const markingDelivery = useSelector(selectMarkingDelivery);
// //   const refreshing = useSelector(selectConsumersRefreshing);
// //   const stats = useSelector(selectConsumersStats);
// //   const lastActiveDate = useSelector(selectLastActiveDate);

// //   const getMilkmanId = useCallback(() => {
// //     if (!user?.userID) {return 0;}
// //     return typeof user.userID === 'string' ? parseInt(user.userID, 10) : Number(user.userID);
// //   }, [user?.userID]);

// //   const getTodayString = useCallback(() => {
// //     return new Date().toISOString().split('T')[0];
// //   }, []);

// //   const getTodayDeliveryStatus = useCallback((consumer: AssignedConsumer) => {
// //     const today = getTodayString();

// //     const todayDelivery = consumer.deliveryHistory?.find(d => d.date === today);

// //     if (todayDelivery) {
// //       return {
// //         hasDelivery: true,
// //         status: todayDelivery.status,
// //         isDelivered: todayDelivery.status === 'delivered',
// //         isCancelled: todayDelivery.status === 'cancelled',
// //         remarks: todayDelivery.remarks,
// //       };
// //     }

// //     return {
// //       hasDelivery: false,
// //       status: null,
// //       isDelivered: false,
// //       isCancelled: false,
// //       remarks: null,
// //     };
// //   }, [getTodayString]);

// //   const formatAddress = useCallback((address?: string) => {
// //     if (!address) {return '';}
// //     return address;
// //   }, []);

// //   const getMilkRequirementText = useCallback((requirement?: AssignedConsumer['milk_requirement']) => {
// //     if (!requirement) {
// //       return 'No requirement specified';
// //     }

// //     const cow = safeParseMilkQuantity(requirement.cow_milk_litre);
// //     const buffalo = safeParseMilkQuantity(requirement.buffalo_milk_litre);
// //     const total = cow + buffalo;

// //     if (total === 0) {
// //       return 'No milk required';
// //     }

// //     if (cow > 0 && buffalo > 0) {
// //       return `Mixed: ${cow}L Cow + ${buffalo}L Buffalo = ${total}L Total`;
// //     } else if (cow > 0) {
// //       return `Cow Milk Only: ${cow}L Daily`;
// //     } else {
// //       return `Buffalo Milk Only: ${buffalo}L Daily`;
// //     }
// //   }, []);

// //   useEffect(() => {
// //     if (isAuthenticated && user?.userID) {
// //       dispatch(checkDailyReset()).then(() => {
// //         dispatch(fetchAssignedConsumers(getMilkmanId()));
// //       });
// //     }
// //   }, [dispatch, isAuthenticated, user?.userID, getMilkmanId]);

// //   useFocusEffect(
// //     useCallback(() => {
// //       if (isAuthenticated && user?.userID) {
// //         dispatch(checkDailyReset()).then(() => {
// //           const lastFetch = new Date().getTime();
// //           const fiveMinutes = 5 * 60 * 1000;

// //           if (!consumers.length || (lastFetch - fiveMinutes > lastFetch)) {
// //             dispatch(fetchAssignedConsumers(getMilkmanId()));
// //           }
// //         });
// //       }
// //     }, [dispatch, isAuthenticated, user?.userID, getMilkmanId, consumers.length])
// //   );

// //   const handleRefresh = useCallback(() => {
// //     if (!user?.userID) {return;}

// //     const today = getTodayString();
// //     const isNewDay = lastActiveDate && lastActiveDate !== today;

// //     if (isNewDay) {
// //       Alert.alert(
// //         '🗓️ New Day Detected',
// //         'This is a new day! Delivery status will be reset but all other data will be preserved.',
// //         [
// //           { text: 'Cancel', style: 'cancel' },
// //           {
// //             text: 'Refresh',
// //             onPress: () => {
// //               dispatch(checkDailyReset()).then(() => {
// //                 dispatch(refreshConsumers(getMilkmanId()));
// //               });
// //             },
// //           },
// //         ]
// //       );
// //     } else {
// //       dispatch(checkDailyReset()).then(() => {
// //         dispatch(refreshConsumers(getMilkmanId()));
// //       });
// //     }
// //   }, [dispatch, user?.userID, getMilkmanId, getTodayString, lastActiveDate]);

// //   const handleMarkDelivery = useCallback(async (consumer: AssignedConsumer) => {
// //     const today = getTodayString();
// //     const milkmanId = getMilkmanId();
// //     const todayStatus = getTodayDeliveryStatus(consumer);

// //     const currentStatusInfo = todayStatus.hasDelivery
// //       ? `\n\nCurrent status: ${todayStatus.status === 'delivered' ? 'Delivered' : 'Cancelled'}\nThis will replace the existing status.`
// //       : '';

// //     Alert.alert(
// //       'Mark as Delivered ✅',
// //       `Mark delivery as successful for:\n\n👤 ${consumer.customer_name}\n📅 ${today}\n🥛 ${getMilkRequirementText(consumer.milk_requirement)}${currentStatusInfo}`,
// //       [
// //         { text: 'Cancel', style: 'cancel' },
// //         {
// //           text: 'Mark Delivered',
// //           onPress: async () => {
// //             try {
// //               await dispatch(markDelivery({
// //                 customer_id: consumer.customer_id,
// //                 date: today,
// //                 milkman_id: milkmanId,
// //                 status: 'delivered',
// //                 remarks: `Delivery completed successfully for ${consumer.customer_name}`,
// //                 replaceExisting: true,
// //               })).unwrap();

// //               Alert.alert(
// //                 'Success! ✅',
// //                 `Delivery marked as successful for ${consumer.customer_name || 'customer'}`,
// //                 [{ text: 'OK' }]
// //               );
// //             } catch (error: any) {
// //               Alert.alert('Error ❌', error || 'Failed to mark delivery. Please try again.');
// //             }
// //           },
// //         },
// //       ]
// //     );
// //   }, [dispatch, getMilkmanId, getMilkRequirementText, getTodayString, getTodayDeliveryStatus]);

// //   const handleMarkDeliveryCancelled = useCallback(async (consumer: AssignedConsumer, reason?: string) => {
// //     const today = getTodayString();
// //     const milkmanId = getMilkmanId();

// //     try {
// //       await dispatch(markDelivery({
// //         customer_id: consumer.customer_id,
// //         date: today,
// //         milkman_id: milkmanId,
// //         status: 'cancelled',
// //         remarks: reason || `Delivery cancelled for ${consumer.customer_name}`,
// //         replaceExisting: true,
// //       })).unwrap();

// //       Alert.alert(
// //         'Delivery Cancelled ❌',
// //         `Delivery has been cancelled for ${consumer.customer_name}.\nReason: ${reason}`,
// //         [{ text: 'OK' }]
// //       );
// //     } catch (error: any) {
// //       Alert.alert('Error', error || 'Failed to cancel delivery. Please try again.');
// //     }
// //   }, [dispatch, getMilkmanId, getTodayString]);

// //   // UPDATED: Navigate to isolated stack screen for security
// //   const handleViewCalendar = useCallback((consumer: AssignedConsumer) => {
// //     dispatch(setSelectedConsumer(consumer));

// //     // Navigate to ISOLATED stack screen - no tab access
// //     navigation.navigate('DistributorConsumerCalendar', {
// //       viewerRole: 'distributor',
// //       targetConsumerId: consumer.customer_id,
// //       targetConsumerName: consumer.customer_name,
// //       showBackButton: true,
// //     });
// //   }, [dispatch, navigation]);

// //   useEffect(() => {
// //     return () => {
// //       if (error) {
// //         dispatch(clearError());
// //       }
// //     };
// //   }, [dispatch, error]);

// //   const renderConsumerItem = ({ item }: { item: AssignedConsumer }) => {
// //     const address = formatAddress(item.customer_address);
// //     const isMarkingThisDelivery = markingDelivery === item.customer_id;

// //     const cowMilk = safeParseMilkQuantity(item.milk_requirement?.cow_milk_litre);
// //     const buffaloMilk = safeParseMilkQuantity(item.milk_requirement?.buffalo_milk_litre);
// //     const totalMilk = cowMilk + buffaloMilk;

// //     const hasCow = cowMilk > 0;
// //     const hasBuffalo = buffaloMilk > 0;
// //     const hasAnyMilk = hasCow || hasBuffalo;

// //     const todayStatus = getTodayDeliveryStatus(item);

// //     return (
// //       <View style={styles.modernCard}>
// //         <View style={styles.cardHeader}>
// //           <View style={styles.customerInfo}>
// //             <View style={styles.modernAvatar}>
// //               <Text style={styles.avatarText}>
// //                 {item.customer_name?.[0]?.toUpperCase() || 'C'}
// //               </Text>
// //             </View>
// //             <View style={styles.customerDetails}>
// //               <Text style={styles.customerName}>
// //                 {item.customer_name || 'Unknown Customer'}
// //               </Text>
// //               <View style={styles.contactContainer}>
// //                 <Ionicons name="call" size={12} color="#007AFF" />
// //                 <Text style={styles.contactText}>
// //                   {item.customer_contact || 'No contact'}
// //                 </Text>
// //               </View>
// //             </View>
// //           </View>

// //           <View style={styles.statusContainer}>
// //             {todayStatus.hasDelivery ? (
// //               <View style={[
// //                 styles.statusBadge,
// //                 { backgroundColor: todayStatus.isDelivered ? '#34C759' : '#FF3B30' },
// //               ]}>
// //                 <Ionicons
// //                   name={todayStatus.isDelivered ? 'checkmark-circle' : 'close-circle'}
// //                   size={14}
// //                   color="#fff"
// //                 />
// //                 <Text style={styles.statusText}>
// //                   {todayStatus.isDelivered ? 'Delivered Today' : 'Cancelled Today'}
// //                 </Text>
// //               </View>
// //             ) : (
// //               <View style={[styles.statusBadge, { backgroundColor: '#FF9500' }]}>
// //                 <Ionicons name="time" size={14} color="#fff" />
// //                 <Text style={styles.statusText}>Pending Today</Text>
// //               </View>
// //             )}
// //           </View>
// //         </View>

// //         {address && (
// //           <View style={styles.addressSection}>
// //             <Ionicons name="location" size={14} color="#FF9500" />
// //             <Text style={styles.addressText} numberOfLines={2}>
// //               {address}
// //             </Text>
// //           </View>
// //         )}

// //         <View style={styles.milkSection}>
// //           <View style={styles.milkHeader}>
// //             <Ionicons name="water" size={16} color="#007AFF" />
// //             <Text style={styles.milkHeaderText}>Daily Requirement</Text>
// //             <View style={styles.totalMilkBadge}>
// //               <Text style={styles.totalMilkBadgeText}>{totalMilk}L</Text>
// //             </View>
// //           </View>
// //           <View style={styles.milkDetails}>
// //             {hasAnyMilk ? (
// //               <>
// //                 {hasCow && (
// //                   <View style={styles.milkType}>
// //                     <View style={[styles.milkTypeDot, { backgroundColor: '#34C759' }]} />
// //                     <Text style={styles.milkTypeText}>
// //                       Cow: {cowMilk}L
// //                     </Text>
// //                   </View>
// //                 )}

// //                 {hasBuffalo && (
// //                   <View style={styles.milkType}>
// //                     <View style={[styles.milkTypeDot, { backgroundColor: '#FF9500' }]} />
// //                     <Text style={styles.milkTypeText}>
// //                       Buffalo: {buffaloMilk}L
// //                     </Text>
// //                   </View>
// //                 )}
// //               </>
// //             ) : (
// //               <View style={styles.noMilkContainer}>
// //                 <Text style={styles.noMilkText}>
// //                   ⚠️ No milk requirement specified
// //                 </Text>
// //               </View>
// //             )}
// //           </View>
// //         </View>

// //         <View style={styles.actionButtonsContainer}>
// //           <TouchableOpacity
// //             style={[styles.actionButton, styles.calendarButton]}
// //             onPress={() => handleViewCalendar(item)}
// //             activeOpacity={0.8}
// //           >
// //             <Ionicons name="calendar" size={18} color="#007AFF" />
// //             <Text style={[styles.actionButtonText, { color: '#007AFF' }]}>
// //               Calendar
// //             </Text>
// //           </TouchableOpacity>

// //           <TouchableOpacity
// //             style={[
// //               styles.actionButton,
// //               styles.deliverButton,
// //               (isMarkingThisDelivery || todayStatus.isCancelled || !hasAnyMilk) && styles.deliverButtonDisabled,
// //             ]}
// //             onPress={() => handleMarkDelivery(item)}
// //             activeOpacity={0.8}
// //             disabled={isMarkingThisDelivery || todayStatus.isCancelled || !hasAnyMilk}
// //           >
// //             {isMarkingThisDelivery ? (
// //               <ActivityIndicator size="small" color="#fff" />
// //             ) : (
// //               <View style={styles.buttonContent}>
// //                 <Ionicons name="checkmark-circle" size={18} color="#fff" />
// //                 <Text style={[styles.actionButtonText, { color: '#fff' }]}>
// //                   {todayStatus.isDelivered ? 'Delivered ✓' : 'Delivery'}
// //                 </Text>
// //               </View>
// //             )}
// //           </TouchableOpacity>

// //           <TouchableOpacity
// //             style={[
// //               styles.actionButton,
// //               styles.cancelButton,
// //               (isMarkingThisDelivery || todayStatus.isDelivered || !hasAnyMilk) && styles.cancelButtonDisabled,
// //             ]}
// //             onPress={() => {
// //               Alert.alert(
// //                 'Cancel Delivery',
// //                 'Select reason for cancellation:',
// //                 [
// //                   { text: 'Customer Unavailable', onPress: () => handleMarkDeliveryCancelled(item, 'Customer unavailable') },
// //                   { text: 'Address Issue', onPress: () => handleMarkDeliveryCancelled(item, 'Address issue') },
// //                   { text: 'Product Issue', onPress: () => handleMarkDeliveryCancelled(item, 'Product issue') },
// //                   { text: 'Weather/Traffic', onPress: () => handleMarkDeliveryCancelled(item, 'Weather/Traffic delay') },
// //                   { text: 'Other', onPress: () => handleMarkDeliveryCancelled(item, 'Other reason') },
// //                   { text: 'Back', style: 'cancel' },
// //                 ]
// //               );
// //             }}
// //             activeOpacity={0.8}
// //             disabled={isMarkingThisDelivery || todayStatus.isDelivered || !hasAnyMilk}
// //           >
// //             <View style={styles.buttonContent}>
// //               <Ionicons name="close-circle" size={18} color={todayStatus.isDelivered || !hasAnyMilk ? '#999' : '#FF3B30'} />
// //               <Text style={[
// //                 styles.actionButtonText,
// //                 { color: todayStatus.isDelivered || !hasAnyMilk ? '#999' : '#FF3B30' },
// //               ]}>
// //                 {todayStatus.isCancelled ? 'Cancelled ✗' : 'Cancel'}
// //               </Text>
// //             </View>
// //           </TouchableOpacity>
// //         </View>

// //         <View style={styles.bottomSection}>
// //           {item.provider?.provider_name && (
// //             <View style={styles.vendorInfo}>
// //               <Ionicons name="business" size={12} color="#8E8E93" />
// //               <Text style={styles.vendorText}>
// //                 Vendor: {item.provider.provider_name}
// //               </Text>
// //             </View>
// //           )}

// //           {item.milkman?.milkman_name && (
// //             <View style={styles.vendorInfo}>
// //               <Ionicons name="person" size={12} color="#8E8E93" />
// //               <Text style={styles.vendorText}>
// //                 Distributor: {item.milkman.milkman_name}
// //               </Text>
// //             </View>
// //           )}

// //           {todayStatus.hasDelivery && todayStatus.remarks && (
// //             <View style={styles.remarksInfo}>
// //               <Ionicons name="chatbubble" size={12} color="#8E8E93" />
// //               <Text style={styles.remarksText}>
// //                 Today: {todayStatus.remarks}
// //               </Text>
// //             </View>
// //           )}
// //         </View>
// //       </View>
// //     );
// //   };

// //   if (!isAuthenticated) {
// //     return (
// //       <View style={styles.centerContainer}>
// //         <ActivityIndicator size="large" color="#007AFF" />
// //         <Text style={styles.loadingText}>Loading...</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.modernHeader}>
// //         <TouchableOpacity
// //           onPress={() => navigation.goBack()}
// //           style={styles.headerBackButton}
// //         >
// //           <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
// //         </TouchableOpacity>
// //         <View style={styles.headerContent}>
// //           <Text style={styles.headerTitle}>Daily Deliveries</Text>
// //           <Text style={styles.headerSubtitle}>
// //             {getTodayString()} • {stats.totalConsumers} consumers • {stats.totalMilk}L total
// //             {lastActiveDate && lastActiveDate !== getTodayString() && ' • New Day!'}
// //           </Text>
// //         </View>
// //         <TouchableOpacity onPress={handleRefresh} style={styles.headerRefreshButton}>
// //           {refreshing ? (
// //             <ActivityIndicator size="small" color="#007AFF" />
// //           ) : (
// //             <Ionicons name="refresh" size={22} color="#007AFF" />
// //           )}
// //         </TouchableOpacity>
// //       </View>

// //       <View style={styles.modernStatsContainer}>
// //         <View style={styles.statCard}>
// //           <View style={[styles.statIconContainer, { backgroundColor: '#E8F4FD' }]}>
// //             <Ionicons name="people" size={20} color="#007AFF" />
// //           </View>
// //           <Text style={styles.statValue}>{stats.totalConsumers}</Text>
// //           <Text style={styles.statLabel}>Total</Text>
// //         </View>

// //         <View style={styles.statCard}>
// //           <View style={[styles.statIconContainer, { backgroundColor: '#F0FFF4' }]}>
// //             <Ionicons name="checkmark-circle" size={20} color="#34C759" />
// //           </View>
// //           <Text style={styles.statValue}>
// //             {consumers.filter(c => getTodayDeliveryStatus(c).isDelivered).length}
// //           </Text>
// //           <Text style={styles.statLabel}>Delivered</Text>
// //         </View>

// //         <View style={styles.statCard}>
// //           <View style={[styles.statIconContainer, { backgroundColor: '#FFF5F5' }]}>
// //             <Ionicons name="close-circle" size={20} color="#FF3B30" />
// //           </View>
// //           <Text style={styles.statValue}>
// //             {consumers.filter(c => getTodayDeliveryStatus(c).isCancelled).length}
// //           </Text>
// //           <Text style={styles.statLabel}>Cancelled</Text>
// //         </View>

// //         <View style={styles.statCard}>
// //           <View style={[styles.statIconContainer, { backgroundColor: '#FFF9F0' }]}>
// //             <Ionicons name="time" size={20} color="#FF9500" />
// //           </View>
// //           <Text style={styles.statValue}>
// //             {consumers.filter(c => !getTodayDeliveryStatus(c).hasDelivery).length}
// //           </Text>
// //           <Text style={styles.statLabel}>Pending</Text>
// //         </View>
// //       </View>

// //       {error && (
// //         <View style={styles.modernErrorBanner}>
// //           <Ionicons name="alert-circle" size={20} color="#FF3B30" />
// //           <Text style={styles.errorText}>{error}</Text>
// //           <TouchableOpacity
// //             onPress={() => {
// //               dispatch(clearError());
// //               handleRefresh();
// //             }}
// //             style={styles.errorRetryButton}
// //           >
// //             <Text style={styles.errorRetryText}>Retry</Text>
// //           </TouchableOpacity>
// //         </View>
// //       )}

// //       {loading && consumers.length === 0 ? (
// //         <View style={styles.centerContainer}>
// //           <ActivityIndicator size="large" color="#007AFF" />
// //           <Text style={styles.loadingText}>Loading your assigned consumers...</Text>
// //         </View>
// //       ) : (
// //         <FlatList
// //           data={consumers}
// //           keyExtractor={(item, index) => `consumer_${item.id || item.customer_id || index}`}
// //           renderItem={renderConsumerItem}
// //           contentContainerStyle={styles.modernListContainer}
// //           refreshControl={
// //             <RefreshControl
// //               refreshing={refreshing}
// //               onRefresh={handleRefresh}
// //               colors={['#007AFF']}
// //               tintColor="#007AFF"
// //             />
// //           }
// //           ListEmptyComponent={() => (
// //             <View style={styles.modernEmptyContainer}>
// //               <View style={styles.emptyIconContainer}>
// //                 <Ionicons name="people-outline" size={60} color="#C7C7CC" />
// //               </View>
// //               <Text style={styles.emptyTitle}>No Consumers Assigned</Text>
// //               <Text style={styles.emptyText}>
// //                 You don't have any consumers assigned yet. Contact your vendor to get started with deliveries.
// //               </Text>
// //               <TouchableOpacity onPress={handleRefresh} style={styles.modernRefreshButton}>
// //                 <Ionicons name="refresh" size={18} color="#fff" />
// //                 <Text style={styles.modernRefreshButtonText}>Refresh</Text>
// //               </TouchableOpacity>
// //             </View>
// //           )}
// //           showsVerticalScrollIndicator={false}
// //         />
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#F8F9FA',
// //   },
// //   modernHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 16,
// //     paddingHorizontal: 20,
// //     paddingTop: Platform.OS === 'ios' ? 50 : 20,
// //     backgroundColor: '#fff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#E1E4E8',
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOpacity: 0.03,
// //         shadowRadius: 8,
// //         shadowOffset: { width: 0, height: 2 },
// //       },
// //       android: {
// //         elevation: 2,
// //       },
// //     }),
// //   },
// //   headerBackButton: {
// //     width: 44,
// //     height: 44,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: 22,
// //     backgroundColor: '#F8F9FA',
// //   },
// //   headerContent: {
// //     flex: 1,
// //     marginLeft: 16,
// //   },
// //   headerTitle: {
// //     fontSize: 24,
// //     fontWeight: '700',
// //     color: '#1C1C1E',
// //     letterSpacing: -0.5,
// //   },
// //   headerSubtitle: {
// //     fontSize: 14,
// //     color: '#8E8E93',
// //     marginTop: 2,
// //     fontWeight: '500',
// //   },
// //   headerRefreshButton: {
// //     width: 44,
// //     height: 44,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderRadius: 22,
// //     backgroundColor: '#F0F8FF',
// //   },
// //   modernStatsContainer: {
// //     flexDirection: 'row',
// //     paddingHorizontal: 20,
// //     paddingVertical: 16,
// //     gap: 12,
// //   },
// //   statCard: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: 16,
// //     alignItems: 'center',
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOpacity: 0.04,
// //         shadowRadius: 8,
// //         shadowOffset: { width: 0, height: 2 },
// //       },
// //       android: {
// //         elevation: 2,
// //       },
// //     }),
// //   },
// //   statIconContainer: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   statValue: {
// //     fontSize: 20,
// //     fontWeight: '700',
// //     color: '#1C1C1E',
// //     marginBottom: 2,
// //   },
// //   statLabel: {
// //     fontSize: 10,
// //     color: '#8E8E93',
// //     fontWeight: '500',
// //   },
// //   modernCard: {
// //     backgroundColor: '#fff',
// //     borderRadius: 20,
// //     marginHorizontal: 20,
// //     marginBottom: 16,
// //     padding: 20,
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOpacity: 0.06,
// //         shadowRadius: 12,
// //         shadowOffset: { width: 0, height: 4 },
// //       },
// //       android: {
// //         elevation: 4,
// //       },
// //     }),
// //   },
// //   cardHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //   },
// //   customerInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //   },
// //   modernAvatar: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 24,
// //     backgroundColor: '#007AFF',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   avatarText: {
// //     color: '#fff',
// //     fontWeight: '700',
// //     fontSize: 18,
// //   },
// //   customerDetails: {
// //     flex: 1,
// //   },
// //   customerName: {
// //     fontSize: 17,
// //     fontWeight: '600',
// //     color: '#1C1C1E',
// //     marginBottom: 4,
// //   },
// //   contactContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 4,
// //   },
// //   contactText: {
// //     fontSize: 14,
// //     color: '#007AFF',
// //     fontWeight: '500',
// //   },
// //   statusContainer: {
// //     alignItems: 'flex-end',
// //   },
// //   statusBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 12,
// //     gap: 4,
// //   },
// //   statusText: {
// //     fontSize: 12,
// //     fontWeight: '600',
// //     color: '#fff',
// //   },
// //   addressSection: {
// //     flexDirection: 'row',
// //     alignItems: 'flex-start',
// //     backgroundColor: '#FFF9F0',
// //     padding: 12,
// //     borderRadius: 12,
// //     marginBottom: 16,
// //     gap: 8,
// //   },
// //   addressText: {
// //     fontSize: 13,
// //     color: '#8E8E93',
// //     lineHeight: 18,
// //     flex: 1,
// //   },
// //   milkSection: {
// //     backgroundColor: '#F0F8FF',
// //     borderRadius: 12,
// //     padding: 12,
// //     marginBottom: 16,
// //   },
// //   milkHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     marginBottom: 8,
// //   },
// //   milkHeaderText: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#007AFF',
// //     flex: 1,
// //     marginLeft: 6,
// //   },
// //   totalMilkBadge: {
// //     backgroundColor: '#007AFF',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 8,
// //   },
// //   totalMilkBadgeText: {
// //     fontSize: 12,
// //     fontWeight: '700',
// //     color: '#fff',
// //   },
// //   milkDetails: {
// //     gap: 6,
// //   },
// //   milkType: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   milkTypeDot: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //   },
// //   milkTypeText: {
// //     fontSize: 13,
// //     color: '#1C1C1E',
// //     fontWeight: '500',
// //   },
// //   noMilkContainer: {
// //     backgroundColor: '#FFF8E1',
// //     padding: 8,
// //     borderRadius: 6,
// //     alignItems: 'center',
// //   },
// //   noMilkText: {
// //     fontSize: 13,
// //     color: '#FF9500',
// //     fontStyle: 'italic',
// //     textAlign: 'center',
// //     fontWeight: '600',
// //   },
// //   actionButtonsContainer: {
// //     flexDirection: 'row',
// //     gap: 8,
// //     marginBottom: 12,
// //   },
// //   actionButton: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 12,
// //     paddingHorizontal: 16,
// //     borderRadius: 12,
// //     gap: 6,
// //   },
// //   buttonContent: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 6,
// //   },
// //   calendarButton: {
// //     backgroundColor: '#F0F8FF',
// //     borderWidth: 1,
// //     borderColor: '#007AFF',
// //   },
// //   deliverButton: {
// //     backgroundColor: '#34C759',
// //   },
// //   deliverButtonDisabled: {
// //     backgroundColor: '#C7C7CC',
// //   },
// //   cancelButton: {
// //     backgroundColor: '#FFF5F5',
// //     borderWidth: 1,
// //     borderColor: '#FF3B30',
// //   },
// //   cancelButtonDisabled: {
// //     backgroundColor: '#F8F9FA',
// //     borderColor: '#C7C7CC',
// //   },
// //   actionButtonText: {
// //     fontSize: 13,
// //     fontWeight: '600',
// //   },
// //   bottomSection: {
// //     paddingTop: 12,
// //     borderTopWidth: 1,
// //     borderTopColor: '#F1F3F4',
// //     gap: 8,
// //   },
// //   vendorInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 6,
// //   },
// //   vendorText: {
// //     fontSize: 12,
// //     color: '#8E8E93',
// //     fontWeight: '500',
// //   },
// //   remarksInfo: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 6,
// //   },
// //   remarksText: {
// //     fontSize: 12,
// //     color: '#8E8E93',
// //     fontStyle: 'italic',
// //     flex: 1,
// //   },
// //   modernErrorBanner: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#FFF5F5',
// //     borderWidth: 1,
// //     borderColor: '#FFD6D6',
// //     padding: 16,
// //     marginHorizontal: 20,
// //     marginBottom: 16,
// //     borderRadius: 12,
// //     gap: 12,
// //   },
// //   errorText: {
// //     color: '#FF3B30',
// //     fontSize: 14,
// //     flex: 1,
// //     fontWeight: '500',
// //   },
// //   errorRetryButton: {
// //     backgroundColor: '#FF3B30',
// //     paddingHorizontal: 16,
// //     paddingVertical: 8,
// //     borderRadius: 8,
// //   },
// //   errorRetryText: {
// //     color: '#fff',
// //     fontSize: 12,
// //     fontWeight: '600',
// //   },
// //   centerContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingHorizontal: 20,
// //   },
// //   loadingText: {
// //     marginTop: 16,
// //     color: '#8E8E93',
// //     fontSize: 16,
// //     fontWeight: '500',
// //   },
// //   modernListContainer: {
// //     paddingBottom: 40,
// //   },
// //   modernEmptyContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingHorizontal: 40,
// //     paddingTop: 60,
// //   },
// //   emptyIconContainer: {
// //     width: 120,
// //     height: 120,
// //     borderRadius: 60,
// //     backgroundColor: '#F8F9FA',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginBottom: 24,
// //   },
// //   emptyTitle: {
// //     fontSize: 22,
// //     fontWeight: '700',
// //     color: '#1C1C1E',
// //     marginBottom: 12,
// //     textAlign: 'center',
// //   },
// //   emptyText: {
// //     fontSize: 16,
// //     color: '#8E8E93',
// //     textAlign: 'center',
// //     lineHeight: 22,
// //     marginBottom: 32,
// //   },
// //   modernRefreshButton: {
// //     backgroundColor: '#007AFF',
// //     borderRadius: 12,
// //     paddingHorizontal: 24,
// //     paddingVertical: 12,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   modernRefreshButtonText: {
// //     color: '#fff',
// //     fontWeight: '600',
// //     fontSize: 16,
// //   },
// // });

// // export default ConsumerListScreen;
// import React, { useCallback, useEffect } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   RefreshControl,
//   ActivityIndicator,
//   Platform,
//   TouchableOpacity,
//   Alert,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import { useDispatch, useSelector } from 'react-redux';
// import { RootState, AppDispatch } from '../../store/index';
// import {
//   fetchAssignedConsumers,
//   markDelivery,
//   refreshConsumers,
//   setSelectedConsumer,
//   clearError,
//   selectConsumers,
//   selectConsumersLoading,
//   selectConsumersError,
//   selectMarkingDelivery,
//   selectConsumersRefreshing,
//   selectConsumersStats,
//   selectLastActiveDate,
//   checkDailyReset,
//   AssignedConsumer,
// } from '../../store/consumersSlice';
// import { useDailyDeliveryReset } from '../../hooks/useDailyDeliveryReset';

// type NavigationProp = {
//   navigate: (screen: string, params?: any) => void;
//   goBack: () => void;
// };

// const safeParseMilkQuantity = (value: number | string | null | undefined): number => {
//   if (value === null || value === undefined) {
//     return 0;
//   }

//   if (typeof value === 'string') {
//     if (value.trim() === '') {
//       return 0;
//     }
//     const parsed = parseFloat(value);
//     return isNaN(parsed) ? 0 : parsed;
//   }

//   if (typeof value === 'number') {
//     return isNaN(value) ? 0 : value;
//   }

//   return 0;
// };

// const ConsumerListScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const dispatch = useDispatch<AppDispatch>();

//   useDailyDeliveryReset();

//   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
//   const consumers = useSelector(selectConsumers);
//   const loading = useSelector(selectConsumersLoading);
//   const error = useSelector(selectConsumersError);
//   const markingDelivery = useSelector(selectMarkingDelivery);
//   const refreshing = useSelector(selectConsumersRefreshing);
//   const stats = useSelector(selectConsumersStats);
//   const lastActiveDate = useSelector(selectLastActiveDate);

//   const getMilkmanId = useCallback(() => {
//     if (!user?.userID) {return 0;}
//     return typeof user.userID === 'string' ? parseInt(user.userID, 10) : Number(user.userID);
//   }, [user?.userID]);

//   const getTodayString = useCallback(() => {
//     return new Date().toISOString().split('T')[0];
//   }, []);

//   // ✅ DELIVERY STATUS WITH LOCKING LOGIC (but clean UI display)
//   const getTodayDeliveryStatus = useCallback((consumer: AssignedConsumer) => {
//     const today = getTodayString();
//     const todayDelivery = consumer.deliveryHistory?.find(d => d.date === today);

//     if (todayDelivery) {
//       const isDelivered = todayDelivery.status === 'delivered';
//       const isCancelled = todayDelivery.status === 'cancelled';

//       return {
//         hasDelivery: true,
//         status: todayDelivery.status,
//         isDelivered,
//         isCancelled,
//         remarks: todayDelivery.remarks,
//         // 🔒 LOCK LOGIC: Both delivered AND cancelled are locked for the day
//         isLocked: isDelivered || isCancelled,
//         canDeliver: false, // Cannot deliver again once marked
//         canCancel: false,  // Cannot cancel again once marked
//         nextAvailable: 'Tomorrow',
//       };
//     }

//     return {
//       hasDelivery: false,
//       status: null,
//       isDelivered: false,
//       isCancelled: false,
//       remarks: null,
//       isLocked: false,
//       canDeliver: true,
//       canCancel: true,
//       nextAvailable: 'Now',
//     };
//   }, [getTodayString]);

//   const formatAddress = useCallback((address?: string) => {
//     if (!address) {return '';}
//     return address;
//   }, []);

//   const getMilkRequirementText = useCallback((requirement?: AssignedConsumer['milk_requirement']) => {
//     if (!requirement) {
//       return 'No requirement specified';
//     }

//     const cow = safeParseMilkQuantity(requirement.cow_milk_litre);
//     const buffalo = safeParseMilkQuantity(requirement.buffalo_milk_litre);
//     const total = cow + buffalo;

//     if (total === 0) {
//       return 'No milk required';
//     }

//     if (cow > 0 && buffalo > 0) {
//       return `Mixed: ${cow}L Cow + ${buffalo}L Buffalo = ${total}L Total`;
//     } else if (cow > 0) {
//       return `Cow Milk Only: ${cow}L Daily`;
//     } else {
//       return `Buffalo Milk Only: ${buffalo}L Daily`;
//     }
//   }, []);

//   useEffect(() => {
//     if (isAuthenticated && user?.userID) {
//       dispatch(checkDailyReset()).then(() => {
//         dispatch(fetchAssignedConsumers(getMilkmanId()));
//       });
//     }
//   }, [dispatch, isAuthenticated, user?.userID, getMilkmanId]);

//   useFocusEffect(
//     useCallback(() => {
//       if (isAuthenticated && user?.userID) {
//         dispatch(checkDailyReset()).then(() => {
//           const lastFetch = new Date().getTime();
//           const fiveMinutes = 5 * 60 * 1000;

//           if (!consumers.length || (lastFetch - fiveMinutes > lastFetch)) {
//             dispatch(fetchAssignedConsumers(getMilkmanId()));
//           }
//         });
//       }
//     }, [dispatch, isAuthenticated, user?.userID, getMilkmanId, consumers.length])
//   );

//   const handleRefresh = useCallback(() => {
//     if (!user?.userID) {return;}

//     const today = getTodayString();
//     const isNewDay = lastActiveDate && lastActiveDate !== today;

//     if (isNewDay) {
//       Alert.alert(
//         'New Day Detected',
//         'New day started! All delivery buttons have been unlocked. You can now mark deliveries for today.',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           {
//             text: 'Refresh',
//             onPress: () => {
//               dispatch(checkDailyReset()).then(() => {
//                 dispatch(refreshConsumers(getMilkmanId()));
//               });
//             },
//           },
//         ]
//       );
//     } else {
//       dispatch(checkDailyReset()).then(() => {
//         dispatch(refreshConsumers(getMilkmanId()));
//       });
//     }
//   }, [dispatch, user?.userID, getMilkmanId, getTodayString, lastActiveDate]);

//   // ✅ DELIVERY MARKING WITH IMMEDIATE LOCKING
//   const handleMarkDelivery = useCallback(async (consumer: AssignedConsumer) => {
//     const today = getTodayString();
//     const milkmanId = getMilkmanId();
//     const todayStatus = getTodayDeliveryStatus(consumer);

//     // 🔒 SECURITY CHECK: Prevent delivery if already processed
//     if (todayStatus.isLocked) {
//       Alert.alert(
//         'Already Processed',
//         `Delivery for ${consumer.customer_name} has already been processed today.\n\nStatus: ${todayStatus.isDelivered ? 'Delivered' : 'Cancelled'}\n\nNext delivery available: Tomorrow`,
//         [{ text: 'OK', style: 'default' }]
//       );
//       return;
//     }

//     Alert.alert(
//       'Mark as Delivered',
//       `Confirm delivery for:\n\n${consumer.customer_name}\nDate: ${today}\nAmount: ${getMilkRequirementText(consumer.milk_requirement)}`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Mark Delivered',
//           style: 'default',
//           onPress: async () => {
//             try {
//               await dispatch(markDelivery({
//                 customer_id: consumer.customer_id,
//                 date: today,
//                 milkman_id: milkmanId,
//                 status: 'delivered',
//                 remarks: `Delivery completed successfully for ${consumer.customer_name}`,
//                 replaceExisting: true,
//               })).unwrap();

//               Alert.alert(
//                 'Success!',
//                 `Delivery marked as completed for ${consumer.customer_name}.\n\nButtons are now disabled until tomorrow.`,
//                 [{ text: 'OK' }]
//               );
//             } catch (error: any) {
//               Alert.alert('Error', error || 'Failed to mark delivery. Please try again.');
//             }
//           },
//         },
//       ]
//     );
//   }, [dispatch, getMilkmanId, getMilkRequirementText, getTodayString, getTodayDeliveryStatus]);

//   // ✅ CANCEL DELIVERY WITH IMMEDIATE LOCKING
//   const handleMarkDeliveryCancelled = useCallback(async (consumer: AssignedConsumer, reason?: string) => {
//     const today = getTodayString();
//     const milkmanId = getMilkmanId();
//     const todayStatus = getTodayDeliveryStatus(consumer);

//     // 🔒 SECURITY CHECK: Cannot cancel if already processed
//     if (todayStatus.isLocked) {
//       Alert.alert(
//         'Already Processed',
//         `Delivery for ${consumer.customer_name} has already been processed today.\n\nStatus: ${todayStatus.isDelivered ? 'Delivered' : 'Cancelled'}\n\nNext action available: Tomorrow`,
//         [{ text: 'OK' }]
//       );
//       return;
//     }

//     try {
//       await dispatch(markDelivery({
//         customer_id: consumer.customer_id,
//         date: today,
//         milkman_id: milkmanId,
//         status: 'cancelled',
//         remarks: reason || `Delivery cancelled for ${consumer.customer_name}`,
//         replaceExisting: true,
//       })).unwrap();

//       Alert.alert(
//         'Delivery Cancelled',
//         `Delivery cancelled for ${consumer.customer_name}.\nReason: ${reason}\n\nButtons are now disabled until tomorrow.`,
//         [{ text: 'OK' }]
//       );
//     } catch (error: any) {
//       Alert.alert('Error', error || 'Failed to cancel delivery. Please try again.');
//     }
//   }, [dispatch, getMilkmanId, getTodayString, getTodayDeliveryStatus]);

//   const handleViewCalendar = useCallback((consumer: AssignedConsumer) => {
//     dispatch(setSelectedConsumer(consumer));

//     navigation.navigate('DistributorConsumerCalendar', {
//       viewerRole: 'distributor',
//       targetConsumerId: consumer.customer_id,
//       targetConsumerName: consumer.customer_name,
//       showBackButton: true,
//     });
//   }, [dispatch, navigation]);

//   useEffect(() => {
//     return () => {
//       if (error) {
//         dispatch(clearError());
//       }
//     };
//   }, [dispatch, error]);

//   const renderConsumerItem = ({ item }: { item: AssignedConsumer }) => {
//     const address = formatAddress(item.customer_address);
//     const isMarkingThisDelivery = markingDelivery === item.customer_id;

//     const cowMilk = safeParseMilkQuantity(item.milk_requirement?.cow_milk_litre);
//     const buffaloMilk = safeParseMilkQuantity(item.milk_requirement?.buffalo_milk_litre);
//     const totalMilk = cowMilk + buffaloMilk;

//     const hasCow = cowMilk > 0;
//     const hasBuffalo = buffaloMilk > 0;
//     const hasAnyMilk = hasCow || hasBuffalo;

//     const todayStatus = getTodayDeliveryStatus(item);

//     // ✅ Both buttons disabled once ANY action is taken
//     const deliveryButtonDisabled = isMarkingThisDelivery || !hasAnyMilk || todayStatus.isLocked;
//     const cancelButtonDisabled = isMarkingThisDelivery || !hasAnyMilk || todayStatus.isLocked;

//     return (
//       <View style={styles.modernCard}>
//         <View style={styles.cardHeader}>
//           <View style={styles.customerInfo}>
//             <View style={styles.modernAvatar}>
//               <Text style={styles.avatarText}>
//                 {item.customer_name?.[0]?.toUpperCase() || 'C'}
//               </Text>
//             </View>
//             <View style={styles.customerDetails}>
//               <Text style={styles.customerName} numberOfLines={1}>
//                 {item.customer_name || 'Unknown Customer'}
//               </Text>
//               <View style={styles.contactContainer}>
//                 <Ionicons name="call" size={12} color="#007AFF" />
//                 <Text style={styles.contactText} numberOfLines={1}>
//                   {item.customer_contact || 'No contact'}
//                 </Text>
//               </View>
//             </View>
//           </View>

//           {/* ✅ CLEAN: Simple status badges - no "locked" text */}
//           <View style={styles.statusContainer}>
//             {todayStatus.hasDelivery ? (
//               <View style={[
//                 styles.statusBadge,
//                 todayStatus.isDelivered ? styles.deliveredBadge : styles.cancelledBadge,
//               ]}>
//                 <Ionicons
//                   name={todayStatus.isDelivered ? 'checkmark-circle' : 'close-circle'}
//                   size={12}
//                   color="#fff"
//                 />
//                 <Text style={styles.statusText}>
//                   {todayStatus.isDelivered ? 'Delivered' : 'Cancelled'}
//                 </Text>
//               </View>
//             ) : (
//               <View style={[styles.statusBadge, styles.pendingBadge]}>
//                 <Ionicons name="time" size={12} color="#fff" />
//                 <Text style={styles.statusText}>Pending</Text>
//               </View>
//             )}
//           </View>
//         </View>

//         {address && (
//           <View style={styles.addressSection}>
//             <Ionicons name="location" size={14} color="#FF9500" />
//             <Text style={styles.addressText} numberOfLines={2}>
//               {address}
//             </Text>
//           </View>
//         )}

//         <View style={styles.milkSection}>
//           <View style={styles.milkHeader}>
//             <Ionicons name="water" size={16} color="#007AFF" />
//             <Text style={styles.milkHeaderText}>Daily Requirement</Text>
//             <View style={styles.totalMilkBadge}>
//               <Text style={styles.totalMilkBadgeText}>{totalMilk}L</Text>
//             </View>
//           </View>
//           <View style={styles.milkDetails}>
//             {hasAnyMilk ? (
//               <>
//                 {hasCow && (
//                   <View style={styles.milkType}>
//                     <View style={[styles.milkTypeDot, { backgroundColor: '#34C759' }]} />
//                     <Text style={styles.milkTypeText}>
//                       Cow: {cowMilk}L
//                     </Text>
//                   </View>
//                 )}

//                 {hasBuffalo && (
//                   <View style={styles.milkType}>
//                     <View style={[styles.milkTypeDot, { backgroundColor: '#FF9500' }]} />
//                     <Text style={styles.milkTypeText}>
//                       Buffalo: {buffaloMilk}L
//                     </Text>
//                   </View>
//                 )}
//               </>
//             ) : (
//               <View style={styles.noMilkContainer}>
//                 <Text style={styles.noMilkText}>
//                   No milk requirement specified
//                 </Text>
//               </View>
//             )}
//           </View>
//         </View>

//         {/* ✅ CLEAN: Simple completion message when processed */}
//         {todayStatus.isLocked && (
//           <View style={styles.lockIndicator}>
//             <Ionicons name="shield-checkmark" size={16} color="#6B7280" />
//             <Text style={styles.lockIndicatorText}>
//               Processing completed - available again tomorrow
//             </Text>
//           </View>
//         )}

//         <View style={styles.actionButtonsContainer}>
//           <TouchableOpacity
//             style={[styles.actionButton, styles.calendarButton]}
//             onPress={() => handleViewCalendar(item)}
//             activeOpacity={0.8}
//           >
//             <Ionicons name="calendar" size={18} color="#007AFF" />
//             <Text style={[styles.actionButtonText, { color: '#007AFF' }]}>
//               Calendar
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.actionButton,
//               styles.deliverButton,
//               deliveryButtonDisabled && styles.deliverButtonDisabled,
//             ]}
//             onPress={() => handleMarkDelivery(item)}
//             activeOpacity={0.8}
//             disabled={deliveryButtonDisabled}
//           >
//             {isMarkingThisDelivery ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <View style={styles.buttonContent}>
//                 <Ionicons
//                   name="checkmark-circle"
//                   size={18}
//                   color="#fff"
//                 />
//                 <Text style={[styles.actionButtonText, { color: '#fff' }]}>
//                   {todayStatus.isDelivered ? 'Delivered' : 'Mark Delivered'}
//                 </Text>
//               </View>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.actionButton,
//               styles.cancelButton,
//               cancelButtonDisabled && styles.cancelButtonDisabled,
//             ]}
//             onPress={() => {
//               if (todayStatus.isLocked) {
//                 Alert.alert(
//                   'Already Processed',
//                   'This delivery has already been processed for today.',
//                   [{ text: 'OK' }]
//                 );
//                 return;
//               }

//               Alert.alert(
//                 'Cancel Delivery',
//                 'Select reason for cancellation:',
//                 [
//                   { text: 'Customer Unavailable', onPress: () => handleMarkDeliveryCancelled(item, 'Customer unavailable') },
//                   { text: 'Address Issue', onPress: () => handleMarkDeliveryCancelled(item, 'Address issue') },
//                   { text: 'Product Issue', onPress: () => handleMarkDeliveryCancelled(item, 'Product issue') },
//                   { text: 'Weather/Traffic', onPress: () => handleMarkDeliveryCancelled(item, 'Weather/Traffic delay') },
//                   { text: 'Other', onPress: () => handleMarkDeliveryCancelled(item, 'Other reason') },
//                   { text: 'Back', style: 'cancel' },
//                 ]
//               );
//             }}
//             activeOpacity={0.8}
//             disabled={cancelButtonDisabled}
//           >
//             <View style={styles.buttonContent}>
//               <Ionicons
//                 name="close-circle"
//                 size={18}
//                 color={cancelButtonDisabled ? '#999' : '#FF3B30'}
//               />
//               <Text style={[
//                 styles.actionButtonText,
//                 { color: cancelButtonDisabled ? '#999' : '#FF3B30' },
//               ]}>
//                 {todayStatus.isCancelled ? 'Cancelled' : 'Cancel'}
//               </Text>
//             </View>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.bottomSection}>
//           {item.provider?.provider_name && (
//             <View style={styles.vendorInfo}>
//               <Ionicons name="business" size={12} color="#8E8E93" />
//               <Text style={styles.vendorText}>
//                 Vendor: {item.provider.provider_name}
//               </Text>
//             </View>
//           )}

//           {item.milkman?.milkman_name && (
//             <View style={styles.vendorInfo}>
//               <Ionicons name="person" size={12} color="#8E8E93" />
//               <Text style={styles.vendorText}>
//                 Distributor: {item.milkman.milkman_name}
//               </Text>
//             </View>
//           )}

//           {todayStatus.hasDelivery && todayStatus.remarks && (
//             <View style={styles.remarksInfo}>
//               <Ionicons name="chatbubble" size={12} color="#8E8E93" />
//               <Text style={styles.remarksText} numberOfLines={2}>
//                 Today: {todayStatus.remarks}
//               </Text>
//             </View>
//           )}
//         </View>
//       </View>
//     );
//   };

//   if (!isAuthenticated) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#007AFF" />
//         <Text style={styles.loadingText}>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.modernHeader}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.headerBackButton}
//         >
//           <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
//         </TouchableOpacity>
//         <View style={styles.headerContent}>
//           <Text style={styles.headerTitle}>Daily Deliveries</Text>
//           <Text style={styles.headerSubtitle}>
//             {getTodayString()} • {stats.totalConsumers} consumers • {stats.totalMilk}L total
//             {lastActiveDate && lastActiveDate !== getTodayString() && ' • New Day!'}
//           </Text>
//         </View>
//         <TouchableOpacity onPress={handleRefresh} style={styles.headerRefreshButton}>
//           {refreshing ? (
//             <ActivityIndicator size="small" color="#007AFF" />
//           ) : (
//             <Ionicons name="refresh" size={22} color="#007AFF" />
//           )}
//         </TouchableOpacity>
//       </View>

//       <View style={styles.modernStatsContainer}>
//         <View style={styles.statCard}>
//           <View style={[styles.statIconContainer, { backgroundColor: '#E8F4FD' }]}>
//             <Ionicons name="people" size={20} color="#007AFF" />
//           </View>
//           <Text style={styles.statValue}>{stats.totalConsumers}</Text>
//           <Text style={styles.statLabel}>Total</Text>
//         </View>

//         <View style={styles.statCard}>
//           <View style={[styles.statIconContainer, { backgroundColor: '#F0FFF4' }]}>
//             <Ionicons name="checkmark-circle" size={20} color="#34C759" />
//           </View>
//           <Text style={styles.statValue}>
//             {consumers.filter(c => getTodayDeliveryStatus(c).isDelivered).length}
//           </Text>
//           <Text style={styles.statLabel}>Delivered</Text>
//         </View>

//         <View style={styles.statCard}>
//           <View style={[styles.statIconContainer, { backgroundColor: '#FFF5F5' }]}>
//             <Ionicons name="close-circle" size={20} color="#FF3B30" />
//           </View>
//           <Text style={styles.statValue}>
//             {consumers.filter(c => getTodayDeliveryStatus(c).isCancelled).length}
//           </Text>
//           <Text style={styles.statLabel}>Cancelled</Text>
//         </View>

//         <View style={styles.statCard}>
//           <View style={[styles.statIconContainer, { backgroundColor: '#FFF9F0' }]}>
//             <Ionicons name="time" size={20} color="#FF9500" />
//           </View>
//           <Text style={styles.statValue}>
//             {consumers.filter(c => !getTodayDeliveryStatus(c).hasDelivery).length}
//           </Text>
//           <Text style={styles.statLabel}>Pending</Text>
//         </View>
//       </View>

//       {error && (
//         <View style={styles.modernErrorBanner}>
//           <Ionicons name="alert-circle" size={20} color="#FF3B30" />
//           <Text style={styles.errorText}>{error}</Text>
//           <TouchableOpacity
//             onPress={() => {
//               dispatch(clearError());
//               handleRefresh();
//             }}
//             style={styles.errorRetryButton}
//           >
//             <Text style={styles.errorRetryText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {loading && consumers.length === 0 ? (
//         <View style={styles.centerContainer}>
//           <ActivityIndicator size="large" color="#007AFF" />
//           <Text style={styles.loadingText}>Loading your assigned consumers...</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={consumers}
//           keyExtractor={(item, index) => `consumer_${item.id || item.customer_id || index}`}
//           renderItem={renderConsumerItem}
//           contentContainerStyle={styles.modernListContainer}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={handleRefresh}
//               colors={['#007AFF']}
//               tintColor="#007AFF"
//             />
//           }
//           ListEmptyComponent={() => (
//             <View style={styles.modernEmptyContainer}>
//               <View style={styles.emptyIconContainer}>
//                 <Ionicons name="people-outline" size={60} color="#C7C7CC" />
//               </View>
//               <Text style={styles.emptyTitle}>No Consumers Assigned</Text>
//               <Text style={styles.emptyText}>
//                 You don't have any consumers assigned yet. Contact your vendor to get started with deliveries.
//               </Text>
//               <TouchableOpacity onPress={handleRefresh} style={styles.modernRefreshButton}>
//                 <Ionicons name="refresh" size={18} color="#fff" />
//                 <Text style={styles.modernRefreshButtonText}>Refresh</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA',
//   },
//   modernHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     paddingTop: Platform.OS === 'ios' ? 50 : 20,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E1E4E8',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.03,
//         shadowRadius: 8,
//         shadowOffset: { width: 0, height: 2 },
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
//   },
//   headerBackButton: {
//     width: 44,
//     height: 44,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 22,
//     backgroundColor: '#F8F9FA',
//   },
//   headerContent: {
//     flex: 1,
//     marginLeft: 16,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#1C1C1E',
//     letterSpacing: -0.5,
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#8E8E93',
//     marginTop: 2,
//     fontWeight: '500',
//   },
//   headerRefreshButton: {
//     width: 44,
//     height: 44,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 22,
//     backgroundColor: '#F0F8FF',
//   },
//   modernStatsContainer: {
//     flexDirection: 'row',
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     gap: 12,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     alignItems: 'center',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.04,
//         shadowRadius: 8,
//         shadowOffset: { width: 0, height: 2 },
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
//   },
//   statIconContainer: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   statValue: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#1C1C1E',
//     marginBottom: 2,
//   },
//   statLabel: {
//     fontSize: 10,
//     color: '#8E8E93',
//     fontWeight: '500',
//   },
//   modernCard: {
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     marginHorizontal: 20,
//     marginBottom: 16,
//     padding: 20,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.06,
//         shadowRadius: 12,
//         shadowOffset: { width: 0, height: 4 },
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   customerInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//     marginRight: 12,
//   },
//   modernAvatar: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   avatarText: {
//     color: '#fff',
//     fontWeight: '700',
//     fontSize: 18,
//   },
//   customerDetails: {
//     flex: 1,
//   },
//   customerName: {
//     fontSize: 17,
//     fontWeight: '600',
//     color: '#1C1C1E',
//     marginBottom: 4,
//   },
//   contactContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   contactText: {
//     fontSize: 14,
//     color: '#007AFF',
//     fontWeight: '500',
//   },
//   statusContainer: {
//     alignItems: 'flex-end',
//   },
//   statusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//     gap: 4,
//   },
//   // ✅ Clean status badge colors
//   deliveredBadge: {
//     backgroundColor: '#34C759',
//   },
//   cancelledBadge: {
//     backgroundColor: '#FF3B30',
//   },
//   pendingBadge: {
//     backgroundColor: '#FF9500',
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   addressSection: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     backgroundColor: '#FFF9F0',
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 16,
//     gap: 8,
//   },
//   addressText: {
//     fontSize: 13,
//     color: '#8E8E93',
//     lineHeight: 18,
//     flex: 1,
//   },
//   milkSection: {
//     backgroundColor: '#F0F8FF',
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 16,
//   },
//   milkHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 8,
//   },
//   milkHeaderText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#007AFF',
//     flex: 1,
//     marginLeft: 6,
//   },
//   totalMilkBadge: {
//     backgroundColor: '#007AFF',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   totalMilkBadgeText: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#fff',
//   },
//   milkDetails: {
//     gap: 6,
//   },
//   milkType: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   milkTypeDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//   },
//   milkTypeText: {
//     fontSize: 13,
//     color: '#1C1C1E',
//     fontWeight: '500',
//   },
//   noMilkContainer: {
//     backgroundColor: '#FFF8E1',
//     padding: 8,
//     borderRadius: 6,
//     alignItems: 'center',
//   },
//   noMilkText: {
//     fontSize: 13,
//     color: '#FF9500',
//     fontStyle: 'italic',
//     textAlign: 'center',
//     fontWeight: '600',
//   },
//   // ✅ Clean completion indicator
//   lockIndicator: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#F9FAFB',
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   lockIndicatorText: {
//     fontSize: 13,
//     color: '#6B7280',
//     fontWeight: '600',
//     marginLeft: 8,
//     flex: 1,
//   },
//   actionButtonsContainer: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 12,
//   },
//   actionButton: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     gap: 6,
//   },
//   buttonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   calendarButton: {
//     backgroundColor: '#F0F8FF',
//     borderWidth: 1,
//     borderColor: '#007AFF',
//   },
//   deliverButton: {
//     backgroundColor: '#34C759',
//   },
//   deliverButtonDisabled: {
//     backgroundColor: '#C7C7CC',
//   },
//   cancelButton: {
//     backgroundColor: '#FFF5F5',
//     borderWidth: 1,
//     borderColor: '#FF3B30',
//   },
//   cancelButtonDisabled: {
//     backgroundColor: '#F8F9FA',
//     borderColor: '#C7C7CC',
//   },
//   actionButtonText: {
//     fontSize: 13,
//     fontWeight: '600',
//   },
//   bottomSection: {
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#F1F3F4',
//     gap: 8,
//   },
//   vendorInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   vendorText: {
//     fontSize: 12,
//     color: '#8E8E93',
//     fontWeight: '500',
//   },
//   remarksInfo: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 6,
//   },
//   remarksText: {
//     fontSize: 12,
//     color: '#8E8E93',
//     fontStyle: 'italic',
//     flex: 1,
//     lineHeight: 16,
//   },
//   modernErrorBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFF5F5',
//     borderWidth: 1,
//     borderColor: '#FFD6D6',
//     padding: 16,
//     marginHorizontal: 20,
//     marginBottom: 16,
//     borderRadius: 12,
//     gap: 12,
//   },
//   errorText: {
//     color: '#FF3B30',
//     fontSize: 14,
//     flex: 1,
//     fontWeight: '500',
//   },
//   errorRetryButton: {
//     backgroundColor: '#FF3B30',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   errorRetryText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   loadingText: {
//     marginTop: 16,
//     color: '#8E8E93',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   modernListContainer: {
//     paddingBottom: 40,
//   },
//   modernEmptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 40,
//     paddingTop: 60,
//   },
//   emptyIconContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#F8F9FA',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#1C1C1E',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#8E8E93',
//     textAlign: 'center',
//     lineHeight: 22,
//     marginBottom: 32,
//   },
//   modernRefreshButton: {
//     backgroundColor: '#007AFF',
//     borderRadius: 12,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   modernRefreshButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });

// export default ConsumerListScreen;
import React, { useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/index';
import {
  fetchAssignedConsumers,
  markDelivery,
  refreshConsumers,
  setSelectedConsumer,
  clearError,
  selectConsumers,
  selectConsumersLoading,
  selectConsumersError,
  selectMarkingDelivery,
  selectConsumersRefreshing,
  selectConsumersStats,
  selectLastActiveDate,
  checkDailyReset,
  AssignedConsumer,
} from '../../store/consumersSlice';
import { useDailyDeliveryReset } from '../../hooks/useDailyDeliveryReset';

type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
};

const safeParseMilkQuantity = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === 'string') {
    if (value.trim() === '') {
      return 0;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value;
  }

  return 0;
};

const ConsumerListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  useDailyDeliveryReset();

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const consumers = useSelector(selectConsumers);
  const loading = useSelector(selectConsumersLoading);
  const error = useSelector(selectConsumersError);
  const markingDelivery = useSelector(selectMarkingDelivery);
  const refreshing = useSelector(selectConsumersRefreshing);
  const stats = useSelector(selectConsumersStats);
  const lastActiveDate = useSelector(selectLastActiveDate);

  const getMilkmanId = useCallback(() => {
    if (!user?.userID) {return 0;}
    return typeof user.userID === 'string' ? parseInt(user.userID, 10) : Number(user.userID);
  }, [user?.userID]);

  const getTodayString = useCallback(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  // ✅ DELIVERY STATUS WITH LOCKING LOGIC (but clean UI display)
  const getTodayDeliveryStatus = useCallback((consumer: AssignedConsumer) => {
    const today = getTodayString();
    const todayDelivery = consumer.deliveryHistory?.find(d => d.date === today);

    if (todayDelivery) {
      const isDelivered = todayDelivery.status === 'delivered';
      const isCancelled = todayDelivery.status === 'cancelled';

      return {
        hasDelivery: true,
        status: todayDelivery.status,
        isDelivered,
        isCancelled,
        remarks: todayDelivery.remarks,
        // 🔒 LOCK LOGIC: Both delivered AND cancelled are locked for the day
        isLocked: isDelivered || isCancelled,
        canDeliver: false, // Cannot deliver again once marked
        canCancel: false,  // Cannot cancel again once marked
        nextAvailable: 'Tomorrow',
      };
    }

    return {
      hasDelivery: false,
      status: null,
      isDelivered: false,
      isCancelled: false,
      remarks: null,
      isLocked: false,
      canDeliver: true,
      canCancel: true,
      nextAvailable: 'Now',
    };
  }, [getTodayString]);

  const formatAddress = useCallback((address?: string) => {
    if (!address) {return '';}
    return address;
  }, []);

  const getMilkRequirementText = useCallback((requirement?: AssignedConsumer['milk_requirement']) => {
    if (!requirement) {
      return 'No requirement specified';
    }

    const cow = safeParseMilkQuantity(requirement.cow_milk_litre);
    const buffalo = safeParseMilkQuantity(requirement.buffalo_milk_litre);
    const total = cow + buffalo;

    if (total === 0) {
      return 'No milk required';
    }

    if (cow > 0 && buffalo > 0) {
      return `Mixed: ${cow}L Cow + ${buffalo}L Buffalo = ${total}L Total`;
    } else if (cow > 0) {
      return `Cow Milk Only: ${cow}L Daily`;
    } else {
      return `Buffalo Milk Only: ${buffalo}L Daily`;
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.userID) {
      dispatch(checkDailyReset()).then(() => {
        dispatch(fetchAssignedConsumers(getMilkmanId()));
      });
    }
  }, [dispatch, isAuthenticated, user?.userID, getMilkmanId]);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated && user?.userID) {
        dispatch(checkDailyReset()).then(() => {
          const lastFetch = new Date().getTime();
          const fiveMinutes = 5 * 60 * 1000;

          if (!consumers.length || (lastFetch - fiveMinutes > lastFetch)) {
            dispatch(fetchAssignedConsumers(getMilkmanId()));
          }
        });
      }
    }, [dispatch, isAuthenticated, user?.userID, getMilkmanId, consumers.length])
  );

  const handleRefresh = useCallback(() => {
    if (!user?.userID) {return;}

    const today = getTodayString();
    const isNewDay = lastActiveDate && lastActiveDate !== today;

    if (isNewDay) {
      Alert.alert(
        'New Day Detected',
        'New day started! All delivery buttons have been unlocked. You can now mark deliveries for today.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Refresh',
            onPress: () => {
              dispatch(checkDailyReset()).then(() => {
                dispatch(refreshConsumers(getMilkmanId()));
              });
            },
          },
        ]
      );
    } else {
      dispatch(checkDailyReset()).then(() => {
        dispatch(refreshConsumers(getMilkmanId()));
      });
    }
  }, [dispatch, user?.userID, getMilkmanId, getTodayString, lastActiveDate]);

  // ✅ DELIVERY MARKING WITH IMMEDIATE LOCKING
  const handleMarkDelivery = useCallback(async (consumer: AssignedConsumer) => {
    const today = getTodayString();
    const milkmanId = getMilkmanId();
    const todayStatus = getTodayDeliveryStatus(consumer);

    // 🔒 SECURITY CHECK: Prevent delivery if already processed
    if (todayStatus.isLocked) {
      Alert.alert(
        'Already Processed',
        `Delivery for ${consumer.customer_name} has already been processed today.\n\nStatus: ${todayStatus.isDelivered ? 'Delivered' : 'Cancelled'}\n\nNext delivery available: Tomorrow`,
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    Alert.alert(
      'Mark as Delivered',
      `Confirm delivery for:\n\n${consumer.customer_name}\nDate: ${today}\nAmount: ${getMilkRequirementText(consumer.milk_requirement)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Delivered',
          style: 'default',
          onPress: async () => {
            try {
              await dispatch(markDelivery({
                customer_id: consumer.customer_id,
                date: today,
                milkman_id: milkmanId,
                status: 'delivered',
                remarks: `Delivery completed successfully for ${consumer.customer_name}`,
                replaceExisting: true,
              })).unwrap();

              Alert.alert(
                'Success!',
                `Delivery marked as completed for ${consumer.customer_name}.\n\nButtons are now disabled until tomorrow.`,
                [{ text: 'OK' }]
              );
            } catch (error: any) {
              Alert.alert('Error', error || 'Failed to mark delivery. Please try again.');
            }
          },
        },
      ]
    );
  }, [dispatch, getMilkmanId, getMilkRequirementText, getTodayString, getTodayDeliveryStatus]);

  // ✅ CANCEL DELIVERY WITH IMMEDIATE LOCKING
  const handleMarkDeliveryCancelled = useCallback(async (consumer: AssignedConsumer, reason?: string) => {
    const today = getTodayString();
    const milkmanId = getMilkmanId();
    const todayStatus = getTodayDeliveryStatus(consumer);

    // 🔒 SECURITY CHECK: Cannot cancel if already processed
    if (todayStatus.isLocked) {
      Alert.alert(
        'Already Processed',
        `Delivery for ${consumer.customer_name} has already been processed today.\n\nStatus: ${todayStatus.isDelivered ? 'Delivered' : 'Cancelled'}\n\nNext action available: Tomorrow`,
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      await dispatch(markDelivery({
        customer_id: consumer.customer_id,
        date: today,
        milkman_id: milkmanId,
        status: 'cancelled',
        remarks: reason || `Delivery cancelled for ${consumer.customer_name}`,
        replaceExisting: true,
      })).unwrap();

      Alert.alert(
        'Delivery Cancelled',
        `Delivery cancelled for ${consumer.customer_name}.\nReason: ${reason}\n\nButtons are now disabled until tomorrow.`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to cancel delivery. Please try again.');
    }
  }, [dispatch, getMilkmanId, getTodayString, getTodayDeliveryStatus]);

  const handleViewCalendar = useCallback((consumer: AssignedConsumer) => {
    dispatch(setSelectedConsumer(consumer));

    navigation.navigate('DistributorConsumerCalendar', {
      viewerRole: 'distributor',
      targetConsumerId: consumer.customer_id,
      targetConsumerName: consumer.customer_name,
      showBackButton: true,
    });
  }, [dispatch, navigation]);

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  const renderConsumerItem = ({ item }: { item: AssignedConsumer }) => {
    const address = formatAddress(item.customer_address);
    const isMarkingThisDelivery = markingDelivery === item.customer_id;

    const cowMilk = safeParseMilkQuantity(item.milk_requirement?.cow_milk_litre);
    const buffaloMilk = safeParseMilkQuantity(item.milk_requirement?.buffalo_milk_litre);
    const totalMilk = cowMilk + buffaloMilk;

    const hasCow = cowMilk > 0;
    const hasBuffalo = buffaloMilk > 0;
    const hasAnyMilk = hasCow || hasBuffalo;

    const todayStatus = getTodayDeliveryStatus(item);

    // ✅ Both buttons disabled once ANY action is taken
    const deliveryButtonDisabled = isMarkingThisDelivery || !hasAnyMilk || todayStatus.isLocked;
    const cancelButtonDisabled = isMarkingThisDelivery || !hasAnyMilk || todayStatus.isLocked;

    return (
      <View style={styles.modernCard}>
        <View style={styles.cardHeader}>
          <View style={styles.customerInfo}>
            <View style={styles.modernAvatar}>
              <Text style={styles.avatarText}>
                {item.customer_name?.[0]?.toUpperCase() || 'C'}
              </Text>
            </View>
            <View style={styles.customerDetails}>
              <Text style={styles.customerName} numberOfLines={1}>
                {item.customer_name || 'Unknown Customer'}
              </Text>
              <View style={styles.contactContainer}>
                <Ionicons name="call" size={12} color="#007AFF" />
                <Text style={styles.contactText} numberOfLines={1}>
                  {item.customer_contact || 'No contact'}
                </Text>
              </View>
            </View>
          </View>

          {/* ✅ CLEAN: Simple status badges - no "locked" text */}
          <View style={styles.statusContainer}>
            {todayStatus.hasDelivery ? (
              <View style={[
                styles.statusBadge,
                todayStatus.isDelivered ? styles.deliveredBadge : styles.cancelledBadge,
              ]}>
                <Ionicons
                  name={todayStatus.isDelivered ? 'checkmark-circle' : 'close-circle'}
                  size={12}
                  color="#fff"
                />
                <Text style={styles.statusText}>
                  {todayStatus.isDelivered ? 'Delivered' : 'Cancelled'}
                </Text>
              </View>
            ) : (
              <View style={[styles.statusBadge, styles.pendingBadge]}>
                <Ionicons name="time" size={12} color="#fff" />
                <Text style={styles.statusText}>Pending</Text>
              </View>
            )}
          </View>
        </View>

        {address && (
          <View style={styles.addressSection}>
            <Ionicons name="location" size={14} color="#FF9500" />
            <Text style={styles.addressText} numberOfLines={2}>
              {address}
            </Text>
          </View>
        )}

        <View style={styles.milkSection}>
          <View style={styles.milkHeader}>
            <Ionicons name="water" size={16} color="#007AFF" />
            <Text style={styles.milkHeaderText}>Daily Requirement</Text>
            <View style={styles.totalMilkBadge}>
              <Text style={styles.totalMilkBadgeText}>{totalMilk}L</Text>
            </View>
          </View>
          <View style={styles.milkDetails}>
            {hasAnyMilk ? (
              <>
                {hasCow && (
                  <View style={styles.milkType}>
                    <View style={[styles.milkTypeDot, { backgroundColor: '#34C759' }]} />
                    <Text style={styles.milkTypeText}>
                      Cow: {cowMilk}L
                    </Text>
                  </View>
                )}

                {hasBuffalo && (
                  <View style={styles.milkType}>
                    <View style={[styles.milkTypeDot, { backgroundColor: '#FF9500' }]} />
                    <Text style={styles.milkTypeText}>
                      Buffalo: {buffaloMilk}L
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <View style={styles.noMilkContainer}>
                <Text style={styles.noMilkText}>
                  No milk requirement specified
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* ✅ CLEAN: Simple completion message when processed */}
        {todayStatus.isLocked && (
          <View style={styles.lockIndicator}>
            <Ionicons name="shield-checkmark" size={16} color="#6B7280" />
            <Text style={styles.lockIndicatorText}>
              Processing completed - available again tomorrow
            </Text>
          </View>
        )}

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.calendarButton]}
            onPress={() => handleViewCalendar(item)}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar" size={18} color="#007AFF" />
            <Text style={[styles.actionButtonText, { color: '#007AFF' }]}>
              Calendar
            </Text>
          </TouchableOpacity>

          {/* ✅ UPDATED: Simplified button text - just "Delivery" */}
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.deliverButton,
              deliveryButtonDisabled && styles.deliverButtonDisabled,
            ]}
            onPress={() => handleMarkDelivery(item)}
            activeOpacity={0.8}
            disabled={deliveryButtonDisabled}
          >
            {isMarkingThisDelivery ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color="#fff"
                />
                <Text style={[styles.actionButtonText, { color: '#fff' }]}>
                  {todayStatus.isDelivered ? 'Delivered' : 'Delivery'}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.cancelButton,
              cancelButtonDisabled && styles.cancelButtonDisabled,
            ]}
            onPress={() => {
              if (todayStatus.isLocked) {
                Alert.alert(
                  'Already Processed',
                  'This delivery has already been processed for today.',
                  [{ text: 'OK' }]
                );
                return;
              }

              Alert.alert(
                'Cancel Delivery',
                'Select reason for cancellation:',
                [
                  { text: 'Customer Unavailable', onPress: () => handleMarkDeliveryCancelled(item, 'Customer unavailable') },
                  { text: 'Address Issue', onPress: () => handleMarkDeliveryCancelled(item, 'Address issue') },
                  { text: 'Product Issue', onPress: () => handleMarkDeliveryCancelled(item, 'Product issue') },
                  { text: 'Weather/Traffic', onPress: () => handleMarkDeliveryCancelled(item, 'Weather/Traffic delay') },
                  { text: 'Other', onPress: () => handleMarkDeliveryCancelled(item, 'Other reason') },
                  { text: 'Back', style: 'cancel' },
                ]
              );
            }}
            activeOpacity={0.8}
            disabled={cancelButtonDisabled}
          >
            <View style={styles.buttonContent}>
              <Ionicons
                name="close-circle"
                size={18}
                color={cancelButtonDisabled ? '#999' : '#FF3B30'}
              />
              <Text style={[
                styles.actionButtonText,
                { color: cancelButtonDisabled ? '#999' : '#FF3B30' },
              ]}>
                {todayStatus.isCancelled ? 'Cancelled' : 'Cancel'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSection}>
          {item.provider?.provider_name && (
            <View style={styles.vendorInfo}>
              <Ionicons name="business" size={12} color="#8E8E93" />
              <Text style={styles.vendorText}>
                Vendor: {item.provider.provider_name}
              </Text>
            </View>
          )}

          {item.milkman?.milkman_name && (
            <View style={styles.vendorInfo}>
              <Ionicons name="person" size={12} color="#8E8E93" />
              <Text style={styles.vendorText}>
                Distributor: {item.milkman.milkman_name}
              </Text>
            </View>
          )}

          {todayStatus.hasDelivery && todayStatus.remarks && (
            <View style={styles.remarksInfo}>
              <Ionicons name="chatbubble" size={12} color="#8E8E93" />
              <Text style={styles.remarksText} numberOfLines={2}>
                Today: {todayStatus.remarks}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.modernHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBackButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Daily Deliveries</Text>
          <Text style={styles.headerSubtitle}>
            {getTodayString()} • {stats.totalConsumers} consumers • {stats.totalMilk}L total
            {lastActiveDate && lastActiveDate !== getTodayString() && ' • New Day!'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleRefresh} style={styles.headerRefreshButton}>
          {refreshing ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            <Ionicons name="refresh" size={22} color="#007AFF" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.modernStatsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#E8F4FD' }]}>
            <Ionicons name="people" size={20} color="#007AFF" />
          </View>
          <Text style={styles.statValue}>{stats.totalConsumers}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#F0FFF4' }]}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
          </View>
          <Text style={styles.statValue}>
            {consumers.filter(c => getTodayDeliveryStatus(c).isDelivered).length}
          </Text>
          <Text style={styles.statLabel}>Delivered</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#FFF5F5' }]}>
            <Ionicons name="close-circle" size={20} color="#FF3B30" />
          </View>
          <Text style={styles.statValue}>
            {consumers.filter(c => getTodayDeliveryStatus(c).isCancelled).length}
          </Text>
          <Text style={styles.statLabel}>Cancelled</Text>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#FFF9F0' }]}>
            <Ionicons name="time" size={20} color="#FF9500" />
          </View>
          <Text style={styles.statValue}>
            {consumers.filter(c => !getTodayDeliveryStatus(c).hasDelivery).length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {error && (
        <View style={styles.modernErrorBanner}>
          <Ionicons name="alert-circle" size={20} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={() => {
              dispatch(clearError());
              handleRefresh();
            }}
            style={styles.errorRetryButton}
          >
            <Text style={styles.errorRetryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && consumers.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading your assigned consumers...</Text>
        </View>
      ) : (
        <FlatList
          data={consumers}
          keyExtractor={(item, index) => `consumer_${item.id || item.customer_id || index}`}
          renderItem={renderConsumerItem}
          contentContainerStyle={styles.modernListContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
          ListEmptyComponent={() => (
            <View style={styles.modernEmptyContainer}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="people-outline" size={60} color="#C7C7CC" />
              </View>
              <Text style={styles.emptyTitle}>No Consumers Assigned</Text>
              <Text style={styles.emptyText}>
                You don't have any consumers assigned yet. Contact your vendor to get started with deliveries.
              </Text>
              <TouchableOpacity onPress={handleRefresh} style={styles.modernRefreshButton}>
                <Ionicons name="refresh" size={18} color="#fff" />
                <Text style={styles.modernRefreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modernHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E4E8',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerBackButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
    fontWeight: '500',
  },
  headerRefreshButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#F0F8FF',
  },
  modernStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '500',
  },
  modernCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  modernAvatar: {
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
    fontWeight: '700',
    fontSize: 18,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  // ✅ Clean status badge colors
  deliveredBadge: {
    backgroundColor: '#34C759',
  },
  cancelledBadge: {
    backgroundColor: '#FF3B30',
  },
  pendingBadge: {
    backgroundColor: '#FF9500',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF9F0',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  addressText: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
    flex: 1,
  },
  milkSection: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  milkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  milkHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    flex: 1,
    marginLeft: 6,
  },
  totalMilkBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  totalMilkBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  milkDetails: {
    gap: 6,
  },
  milkType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  milkTypeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  milkTypeText: {
    fontSize: 13,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  noMilkContainer: {
    backgroundColor: '#FFF8E1',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  noMilkText: {
    fontSize: 13,
    color: '#FF9500',
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '600',
  },
  // ✅ Clean completion indicator
  lockIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  lockIndicatorText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calendarButton: {
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  deliverButton: {
    backgroundColor: '#34C759',
  },
  deliverButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  cancelButton: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  cancelButtonDisabled: {
    backgroundColor: '#F8F9FA',
    borderColor: '#C7C7CC',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bottomSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F4',
    gap: 8,
  },
  vendorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vendorText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  remarksInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  remarksText: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
    flex: 1,
    lineHeight: 16,
  },
  modernErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFD6D6',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    gap: 12,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  errorRetryButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  errorRetryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '500',
  },
  modernListContainer: {
    paddingBottom: 40,
  },
  modernEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  modernRefreshButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modernRefreshButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ConsumerListScreen;
