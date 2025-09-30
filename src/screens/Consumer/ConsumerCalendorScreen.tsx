

// // // // // // export default ConsumerCalendarScreen;
// // // // // import React, { useEffect, useCallback, useMemo, useState } from 'react';
// // // // // import { useFocusEffect, useNavigation } from '@react-navigation/native';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   ScrollView,
// // // // //   TouchableOpacity,
// // // // //   Alert,
// // // // //   ActivityIndicator,
// // // // //   RefreshControl,
// // // // //   StyleSheet,
// // // // // } from 'react-native';
// // // // // import { Calendar, DateData } from 'react-native-calendars';
// // // // // import Ionicons from 'react-native-vector-icons/Ionicons';
// // // // // import { useSelector, useDispatch } from 'react-redux';
// // // // // import type { RootState, AppDispatch } from '../../store';

// // // // // import LeaveRequestModal from '../../components/LeaveRequestModal';
// // // // // import ExtraMilkModal from '../../components/ExtraMilkModal';

// // // // // import { calendarScreenStyles, calendarTheme, colors } from '../../styles/CalendorScreenStyle';

// // // // // import {
// // // // //   fetchCalendarData,
// // // // //   setCurrentMonth,
// // // // //   clearError,
// // // // //   LeaveItem,
// // // // //   ExtraMilkItem,
// // // // //   submitLeaveRequest,
// // // // //   submitExtraMilk,
// // // // //   cancelLeave,
// // // // // } from '../../store/calendarSlice';

// // // // // import { selectConsumers } from '../../store/consumersSlice';
// // // // // import { checkStoredAuth } from '../../store/authSlice';

// // // // // interface CalendarViewerProps {
// // // // //   viewerRole?: 'consumer' | 'distributor' | 'vendor';
// // // // //   targetConsumerId?: number;
// // // // //   targetConsumerName?: string;
// // // // //   showBackButton?: boolean;
// // // // // }

// // // // // type MarkedDates = Record<
// // // // //   string,
// // // // //   {
// // // // //     selected?: boolean;
// // // // //     marked?: boolean;
// // // // //     selectedColor?: string;
// // // // //     dotColor?: string;
// // // // //     dots?: Array<{
// // // // //       key: string;
// // // // //       color: string;
// // // // //       selectedDotColor?: string;
// // // // //     }>;
// // // // //   }
// // // // // >;

// // // // // interface LeaveRequestData {
// // // // //   startDate: string;
// // // // //   endDate: string;
// // // // //   reason: string;
// // // // //   leaveType: 'single' | 'multiple';
// // // // // }

// // // // // interface ExtraMilkData {
// // // // //   date: string;
// // // // //   quantity: number;
// // // // //   milkType: 'cow' | 'buffalo' | 'mixed';
// // // // //   reason: string;
// // // // // }

// // // // // const statusColors: Record<string, string> = {
// // // // //   delivered: '#4CAF50',
// // // // //   vendor_unavailable: '#F44336',
// // // // //   leave: '#9C27B0',
// // // // //   extra_milk: '#FFC107',
// // // // // };

// // // // // const ConsumerCalendarScreen: React.FC<CalendarViewerProps> = ({
// // // // //   viewerRole = 'consumer',
// // // // //   targetConsumerId,
// // // // //   targetConsumerName,
// // // // //   showBackButton = false,
// // // // // }) => {
// // // // //   const dispatch = useDispatch<AppDispatch>();
// // // // //   const navigation = useNavigation();

// // // // //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

// // // // //   const customerId: number | null = targetConsumerId || (user?.userID ? parseInt(user.userID.toString(), 10) : null);
// // // // //   const displayName = targetConsumerName || user?.name || 'Consumer';

// // // // //   // ✅ CLEAN: Simple role checking without redundancy
// // // // //   const isDistributor = viewerRole === 'distributor';
// // // // //   const isConsumer = viewerRole === 'consumer';

// // // // //   // ✅ FINAL ACCESS CONTROL: Only consumers get full features
// // // // //   const hasFullAccess = isConsumer;

// // // // //   const {
// // // // //     deliveryTypes,
// // // // //     upcomingLeaves,
// // // // //     upcomingMilkRequests,
// // // // //     monthlySummary,
// // // // //     loading,
// // // // //     error,
// // // // //     currentMonth,
// // // // //     currentYear,
// // // // //   } = useSelector((state: RootState) => state.calendar);

// // // // //   const consumers = useSelector(selectConsumers);

// // // // //   // ✅ Modal states - only meaningful for consumers
// // // // //   const [showLeaveModal, setShowLeaveModal] = useState(false);
// // // // //   const [showExtraMilkModal, setShowExtraMilkModal] = useState(false);
// // // // //   const [selectedDate, setSelectedDate] = useState('');
// // // // //   const [refreshing, setRefreshing] = useState(false);

// // // // //   // ✅ Block modal access for distributors
// // // // //   const secureSetShowLeaveModal = useCallback((value: boolean) => {
// // // // //     if (isDistributor) {
// // // // //       Alert.alert('Access Denied', 'Distributors cannot access consumer functions');
// // // // //       return;
// // // // //     }
// // // // //     setShowLeaveModal(value);
// // // // //   }, [isDistributor]);

// // // // //   const secureSetShowExtraMilkModal = useCallback((value: boolean) => {
// // // // //     if (isDistributor) {
// // // // //       Alert.alert('Access Denied', 'Distributors cannot access consumer functions');
// // // // //       return;
// // // // //     }
// // // // //     setShowExtraMilkModal(value);
// // // // //   }, [isDistributor]);

// // // // //   // ✅ Force close modals for distributors
// // // // //   useEffect(() => {
// // // // //     if (isDistributor) {
// // // // //       setShowLeaveModal(false);
// // // // //       setShowExtraMilkModal(false);
// // // // //     }
// // // // //   }, [isDistributor]);

// // // // //   useEffect(() => {
// // // // //     dispatch(checkStoredAuth());
// // // // //   }, [dispatch]);

// // // // //   useFocusEffect(
// // // // //     useCallback(() => {
// // // // //       if (customerId !== null && isAuthenticated) {
// // // // //         const now = new Date();
// // // // //         dispatch(setCurrentMonth({ month: now.getMonth(), year: now.getFullYear() }));
// // // // //         const monthString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
// // // // //         dispatch(fetchCalendarData({ customerId, month: monthString }));
// // // // //       }
// // // // //     }, [customerId, isAuthenticated, dispatch]),
// // // // //   );

// // // // //   // ✅ Privacy-filtered data
// // // // //   const leavesForCustomer = useMemo(() => {
// // // // //     if (isDistributor || !customerId || !upcomingLeaves) {
// // // // //       return [];
// // // // //     }
// // // // //     const value = upcomingLeaves[customerId];
// // // // //     return Array.isArray(value) ? value : [];
// // // // //   }, [upcomingLeaves, customerId, isDistributor]);

// // // // //   const milkRequestsForCustomer = useMemo(() => {
// // // // //     if (isDistributor || !customerId || !upcomingMilkRequests) {
// // // // //       return [];
// // // // //     }
// // // // //     const value = upcomingMilkRequests[customerId];
// // // // //     return Array.isArray(value) ? value : [];
// // // // //   }, [upcomingMilkRequests, customerId, isDistributor]);

// // // // //   const markedDates: MarkedDates = useMemo(() => {
// // // // //     const marks: MarkedDates = {};

// // // // //     const allowedStatuses = isDistributor
// // // // //       ? ['delivered', 'vendor_unavailable']
// // // // //       : ['delivered', 'vendor_unavailable', 'leave', 'extra_milk'];

// // // // //     const allStatusesPerDate: Record<string, string[]> = {};

// // // // //     Object.entries(deliveryTypes).forEach(([date, status]) => {
// // // // //       if (allowedStatuses.includes(status)) {
// // // // //         if (!allStatusesPerDate[date]) {allStatusesPerDate[date] = [];}
// // // // //         allStatusesPerDate[date].push(status);
// // // // //       }
// // // // //     });

// // // // //     if (isConsumer) {
// // // // //       leavesForCustomer.forEach((leave: LeaveItem) => {
// // // // //         if (!allStatusesPerDate[leave.date]) {allStatusesPerDate[leave.date] = [];}
// // // // //         allStatusesPerDate[leave.date].push('leave');
// // // // //       });

// // // // //       milkRequestsForCustomer.forEach((request: ExtraMilkItem) => {
// // // // //         if (!allStatusesPerDate[request.date]) {allStatusesPerDate[request.date] = [];}
// // // // //         allStatusesPerDate[request.date].push('extra_milk');
// // // // //       });
// // // // //     }

// // // // //     if (customerId) {
// // // // //       const consumerData = consumers.find(c => c.customer_id === customerId);
// // // // //       if (consumerData?.deliveryHistory) {
// // // // //         consumerData.deliveryHistory.forEach(delivery => {
// // // // //           if (delivery.status === 'delivered' && allowedStatuses.includes('delivered')) {
// // // // //             if (!allStatusesPerDate[delivery.date]) {allStatusesPerDate[delivery.date] = [];}
// // // // //             allStatusesPerDate[delivery.date].push('delivered');
// // // // //           }
// // // // //         });
// // // // //       }
// // // // //     }

// // // // //     Object.entries(allStatusesPerDate).forEach(([date, statuses]) => {
// // // // //       const status = allowedStatuses.find(s => statuses.includes(s));
// // // // //       if (status && statusColors[status]) {
// // // // //         marks[date] = {
// // // // //           dots: [
// // // // //             {
// // // // //               key: `${status}-${date}`,
// // // // //               color: statusColors[status],
// // // // //               selectedDotColor: statusColors[status],
// // // // //             },
// // // // //           ],
// // // // //         };
// // // // //       }
// // // // //     });

// // // // //     if (selectedDate) {
// // // // //       marks[selectedDate] = {
// // // // //         ...(marks[selectedDate] || {}),
// // // // //         selected: true,
// // // // //         selectedColor: colors.primary,
// // // // //       };
// // // // //     }

// // // // //     return marks;
// // // // //   }, [deliveryTypes, leavesForCustomer, milkRequestsForCustomer, selectedDate, consumers, customerId, isDistributor, isConsumer]);

// // // // //   const handleDayPress = useCallback(
// // // // //     (day: DateData) => {
// // // // //       setSelectedDate(day.dateString);
// // // // //       const consumerData = consumers.find(c => c.customer_id === customerId);
// // // // //       const deliveryForDate = consumerData?.deliveryHistory?.find(d => d.date === day.dateString);

// // // // //       if (deliveryForDate) {
// // // // //         const statusText = deliveryForDate.status === 'delivered' ? 'Delivered' : 'Cancelled';
// // // // //         const statusIcon = deliveryForDate.status === 'delivered' ? '✅' : '❌';
// // // // //         Alert.alert(
// // // // //           isDistributor ? 'Delivery Information' : 'Delivery Status',
// // // // //           `${statusIcon} Milk ${statusText.toLowerCase()} on ${day.dateString}\n\nRemarks: ${deliveryForDate.remarks || 'No remarks'}`,
// // // // //           [{ text: 'OK' }]
// // // // //         );
// // // // //         return;
// // // // //       }

// // // // //       const status = deliveryTypes[day.dateString];
// // // // //       if (status) {
// // // // //         const messages: Record<string, string> = isDistributor
// // // // //           ? {
// // // // //               delivered: 'Delivery completed',
// // // // //               vendor_unavailable: 'Vendor unavailable for delivery',
// // // // //             }
// // // // //           : {
// // // // //               delivered: 'Milk delivered',
// // // // //               vendor_unavailable: 'Vendor unavailable',
// // // // //               leave: 'On leave',
// // // // //               extra_milk: 'Extra milk requested',
// // // // //             };

// // // // //         Alert.alert(
// // // // //           isDistributor ? 'Delivery Information' : 'Status',
// // // // //           `${messages[status] ?? 'Unknown'} on ${day.dateString}`
// // // // //         );
// // // // //       }
// // // // //     },
// // // // //     [deliveryTypes, consumers, customerId, isDistributor],
// // // // //   );

// // // // //   const onRefresh = useCallback(() => {
// // // // //     if (customerId === null) { return; }
// // // // //     setRefreshing(true);
// // // // //     dispatch(clearError());
// // // // //     const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
// // // // //     dispatch(fetchCalendarData({ customerId, month: monthString })).finally(() =>
// // // // //       setRefreshing(false),
// // // // //     );
// // // // //   }, [customerId, currentMonth, currentYear, dispatch]);

// // // // //   // ✅ Action handlers with clean access control
// // // // //   const handleLeaveSubmit = useCallback(
// // // // //     async (leaveData: LeaveRequestData) => {
// // // // //       if (!hasFullAccess) {
// // // // //         Alert.alert('Access Denied', 'Only consumers can perform this action');
// // // // //         return;
// // // // //       }

// // // // //       if (customerId === null) {
// // // // //         Alert.alert('Error', 'Customer ID not found');
// // // // //         return;
// // // // //       }

// // // // //       try {
// // // // //         await dispatch(submitLeaveRequest({ customerId, leaveData })).unwrap();
// // // // //         const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
// // // // //         await dispatch(fetchCalendarData({ customerId, month: monthString }));
// // // // //         Alert.alert('Success', 'Leave request submitted successfully!');
// // // // //         setShowLeaveModal(false);
// // // // //       } catch (err) {
// // // // //         Alert.alert('Error', (err as string) || 'Failed to submit leave request');
// // // // //       }
// // // // //     },
// // // // //     [dispatch, customerId, currentMonth, currentYear, hasFullAccess],
// // // // //   );

// // // // //   const handleExtraMilkSubmit = useCallback(
// // // // //     async (extraMilkData: ExtraMilkData) => {
// // // // //       if (!hasFullAccess) {
// // // // //         Alert.alert('Access Denied', 'Only consumers can perform this action');
// // // // //         return;
// // // // //       }

// // // // //       if (customerId === null) {
// // // // //         Alert.alert('Error', 'Customer ID not found');
// // // // //         return;
// // // // //       }

// // // // //       try {
// // // // //         await dispatch(submitExtraMilk({ customerId, milkData: extraMilkData })).unwrap();
// // // // //         const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
// // // // //         await dispatch(fetchCalendarData({ customerId, month: monthString }));
// // // // //         Alert.alert('Success', 'Extra milk request submitted successfully!');
// // // // //         setShowExtraMilkModal(false);
// // // // //       } catch (err) {
// // // // //         Alert.alert('Error', (err as string) || 'Failed to request extra milk');
// // // // //       }
// // // // //     },
// // // // //     [dispatch, customerId, currentMonth, currentYear, hasFullAccess],
// // // // //   );

// // // // //   const handleCancelLeave = useCallback(
// // // // //     (leaveId: string, leaveDate: string) => {
// // // // //       if (!hasFullAccess) {
// // // // //         Alert.alert('Access Denied', 'Only consumers can perform this action');
// // // // //         return;
// // // // //       }

// // // // //       Alert.alert('Cancel Leave', `Cancel leave for ${leaveDate}?`, [
// // // // //         {
// // // // //           text: 'Yes, Cancel',
// // // // //           style: 'destructive',
// // // // //           onPress: () => {
// // // // //             if (customerId !== null) {
// // // // //               dispatch(cancelLeave({ leaveId, leaveDate, customerId }));
// // // // //               const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
// // // // //               dispatch(fetchCalendarData({ customerId, month: monthString }));
// // // // //               Alert.alert('Success', 'Leave cancelled successfully!');
// // // // //             }
// // // // //           },
// // // // //         },
// // // // //         { text: 'No', style: 'cancel' },
// // // // //       ]);
// // // // //     },
// // // // //     [dispatch, customerId, currentMonth, currentYear, hasFullAccess],
// // // // //   );

// // // // //   const monthNames = [
// // // // //     'January', 'February', 'March', 'April', 'May', 'June',
// // // // //     'July', 'August', 'September', 'October', 'November', 'December',
// // // // //   ];

// // // // //   if (!isAuthenticated) {
// // // // //     return (
// // // // //       <View style={styles.loadingContainer}>
// // // // //         <Text style={styles.loadingText}>Please login to view calendar</Text>
// // // // //       </View>
// // // // //     );
// // // // //   }

// // // // //   if (loading && !refreshing) {
// // // // //     return (
// // // // //       <View style={styles.loadingContainer}>
// // // // //         <ActivityIndicator size="large" color={colors.primary} />
// // // // //         <Text style={styles.loadingText}>Loading calendar...</Text>
// // // // //       </View>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       {/* Header */}
// // // // //       <View style={[calendarScreenStyles.header, showBackButton && styles.headerWithBackButton]}>
// // // // //         {showBackButton && (
// // // // //           <TouchableOpacity
// // // // //             onPress={() => navigation.goBack()}
// // // // //             style={styles.backButtonStyle}
// // // // //           >
// // // // //             <Ionicons name="arrow-back" size={24} color="#007AFF" />
// // // // //           </TouchableOpacity>
// // // // //         )}

// // // // //         <View style={styles.headerContent}>
// // // // //           <Text style={calendarScreenStyles.title}>
// // // // //             {isDistributor ? `📅 ${displayName} - Delivery Calendar` : 'Milkyway Calendar'}
// // // // //           </Text>

// // // // //           <View style={calendarScreenStyles.monthSelector}>
// // // // //             <Text style={calendarScreenStyles.monthText}>
// // // // //               {monthNames[currentMonth]} {currentYear}
// // // // //             </Text>
// // // // //           </View>

// // // // //           {customerId !== null && (
// // // // //             <Text style={calendarScreenStyles.customerIdText}>
// // // // //               Customer ID: {customerId}
// // // // //               {isDistributor && (
// // // // //                 <Text style={styles.distributorBadge}> 🚛 READ-ONLY</Text>
// // // // //               )}
// // // // //             </Text>
// // // // //           )}
// // // // //         </View>
// // // // //       </View>

// // // // //       {/* Distributor Warning Banner */}
// // // // //       {isDistributor && (
// // // // //         <View style={styles.distributorBanner}>
// // // // //           <Ionicons name="shield-checkmark" size={16} color="#FF3B30" />
// // // // //           <Text style={styles.bannerText}>
// // // // //             🔒 DISTRIBUTOR MODE: Delivery tracking only - Consumer actions disabled
// // // // //           </Text>
// // // // //         </View>
// // // // //       )}

// // // // //       {error && (
// // // // //         <View style={calendarScreenStyles.errorContainer}>
// // // // //           <Text style={calendarScreenStyles.errorText}>{error}</Text>
// // // // //           <TouchableOpacity
// // // // //             style={calendarScreenStyles.retryButton}
// // // // //             onPress={() => dispatch(clearError())}
// // // // //           >
// // // // //             <Text style={calendarScreenStyles.retryButtonText}>Dismiss</Text>
// // // // //           </TouchableOpacity>
// // // // //         </View>
// // // // //       )}

// // // // //       <ScrollView
// // // // //         style={calendarScreenStyles.content}
// // // // //         contentContainerStyle={calendarScreenStyles.scrollContainer}
// // // // //         showsVerticalScrollIndicator={false}
// // // // //         refreshControl={
// // // // //           <RefreshControl
// // // // //             refreshing={refreshing}
// // // // //             onRefresh={onRefresh}
// // // // //             colors={[colors.primary]}
// // // // //             tintColor={colors.primary}
// // // // //           />
// // // // //         }
// // // // //       >
// // // // //         {/* Calendar */}
// // // // //         <View style={calendarScreenStyles.calendarContainer}>
// // // // //           <Calendar
// // // // //             style={calendarScreenStyles.calendar}
// // // // //             theme={calendarTheme}
// // // // //             onDayPress={handleDayPress}
// // // // //             onMonthChange={(month) =>
// // // // //               dispatch(setCurrentMonth({ month: month.month - 1, year: month.year }))
// // // // //             }
// // // // //             markedDates={markedDates}
// // // // //             markingType="multi-dot"
// // // // //             hideExtraDays
// // // // //             disableMonthChange={false}
// // // // //             firstDay={1}
// // // // //             enableSwipeMonths
// // // // //             current={`${currentYear}-${(currentMonth + 1)
// // // // //               .toString()
// // // // //               .padStart(2, '0')}-01`}
// // // // //           />
// // // // //         </View>

// // // // //         {/* Legend */}
// // // // //         <View style={calendarScreenStyles.legendContainer}>
// // // // //           <Text style={calendarScreenStyles.legendTitle}>
// // // // //             {isDistributor ? 'Delivery Status Only' : 'Status Legend'}
// // // // //           </Text>
// // // // //           <View style={calendarScreenStyles.legendGrid}>
// // // // //             <View style={calendarScreenStyles.legendItem}>
// // // // //               <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.delivered }]} />
// // // // //               <Text style={calendarScreenStyles.legendText}>Delivered</Text>
// // // // //             </View>
// // // // //             <View style={calendarScreenStyles.legendItem}>
// // // // //               <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.vendor_unavailable }]} />
// // // // //               <Text style={calendarScreenStyles.legendText}>Vendor Unavailable</Text>
// // // // //             </View>

// // // // //             {isConsumer && (
// // // // //               <>
// // // // //                 <View style={calendarScreenStyles.legendItem}>
// // // // //                   <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.leave }]} />
// // // // //                   <Text style={calendarScreenStyles.legendText}>Leave</Text>
// // // // //                 </View>
// // // // //                 <View style={calendarScreenStyles.legendItem}>
// // // // //                   <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.extra_milk }]} />
// // // // //                   <Text style={calendarScreenStyles.legendText}>Extra Milk</Text>
// // // // //                 </View>
// // // // //               </>
// // // // //             )}
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* Summary */}
// // // // //         <View style={calendarScreenStyles.summaryContainer}>
// // // // //           <Text style={calendarScreenStyles.summaryTitle}>
// // // // //             {monthNames[currentMonth]} {currentYear} Summary
// // // // //           </Text>
// // // // //           <View style={calendarScreenStyles.summaryGrid}>
// // // // //             <View style={calendarScreenStyles.summaryItem}>
// // // // //               <Ionicons name="water-outline" size={24} color={colors.primary} />
// // // // //               <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalMilk}</Text>
// // // // //               <Text style={calendarScreenStyles.summaryLabel}>Total Milk</Text>
// // // // //             </View>
// // // // //             <View style={calendarScreenStyles.summaryItem}>
// // // // //               <Ionicons name="receipt-outline" size={24} color={colors.success} />
// // // // //               <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalBill}</Text>
// // // // //               <Text style={calendarScreenStyles.summaryLabel}>Total Bill</Text>
// // // // //             </View>
// // // // //             <View style={calendarScreenStyles.summaryItem}>
// // // // //               <Ionicons name="calendar-outline" size={24} color={colors.danger} />
// // // // //               <Text style={calendarScreenStyles.summaryValue}>
// // // // //                 {isDistributor ? '🔒' : leavesForCustomer.length}
// // // // //               </Text>
// // // // //               <Text style={calendarScreenStyles.summaryLabel}>
// // // // //                 {isDistributor ? 'Private' : 'Total Leaves'}
// // // // //               </Text>
// // // // //             </View>
// // // // //             <View style={calendarScreenStyles.summaryItem}>
// // // // //               <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
// // // // //               <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalDeliveries}</Text>
// // // // //               <Text style={calendarScreenStyles.summaryLabel}>Deliveries</Text>
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* ✅ CONSUMER-ONLY SECTIONS */}
// // // // //         {hasFullAccess && (
// // // // //           <>
// // // // //             <View style={calendarScreenStyles.leavesContainer}>
// // // // //               <Text style={calendarScreenStyles.leavesTitle}>Upcoming Leaves</Text>
// // // // //               {leavesForCustomer.length === 0 ? (
// // // // //                 <Text style={calendarScreenStyles.noLeavesText}>No upcoming leaves</Text>
// // // // //               ) : (
// // // // //                 leavesForCustomer.map((leave) => (
// // // // //                   <View key={leave.id} style={calendarScreenStyles.leaveItem}>
// // // // //                     <View style={calendarScreenStyles.leaveItemContent}>
// // // // //                       <Text style={calendarScreenStyles.leaveDate}>{leave.date}</Text>
// // // // //                       <Text style={calendarScreenStyles.leaveReason}>
// // // // //                         {leave.reason} • {leave.status}
// // // // //                       </Text>
// // // // //                     </View>
// // // // //                     {leave.status !== 'cancelled' && (
// // // // //                       <TouchableOpacity
// // // // //                         style={calendarScreenStyles.leaveButton}
// // // // //                         onPress={() => handleCancelLeave(leave.id, leave.date)}
// // // // //                       >
// // // // //                         <Text style={calendarScreenStyles.leaveButtonText}>Cancel</Text>
// // // // //                       </TouchableOpacity>
// // // // //                     )}
// // // // //                   </View>
// // // // //                 ))
// // // // //               )}
// // // // //             </View>

// // // // //             <View style={calendarScreenStyles.leavesContainer}>
// // // // //               <Text style={calendarScreenStyles.leavesTitle}>Extra Milk Requests</Text>
// // // // //               {milkRequestsForCustomer.length === 0 ? (
// // // // //                 <Text style={calendarScreenStyles.noLeavesText}>No extra milk requests</Text>
// // // // //               ) : (
// // // // //                 milkRequestsForCustomer.map((request) => (
// // // // //                   <View key={request.id} style={calendarScreenStyles.leaveItem}>
// // // // //                     <View style={calendarScreenStyles.leaveItemContent}>
// // // // //                       <Text style={calendarScreenStyles.leaveDate}>{request.date}</Text>
// // // // //                       <Text style={calendarScreenStyles.leaveReason}>
// // // // //                         {request.quantity}L - {request.reason} • {request.status}
// // // // //                       </Text>
// // // // //                     </View>
// // // // //                   </View>
// // // // //                 ))
// // // // //               )}
// // // // //             </View>

// // // // //             {/* ✅ QUICK ACTIONS - ONLY FOR CONSUMERS */}
// // // // //             <View style={calendarScreenStyles.actionsContainer}>
// // // // //               <Text style={calendarScreenStyles.actionsTitle}>Quick Actions</Text>
// // // // //               <TouchableOpacity
// // // // //                 style={calendarScreenStyles.actionButton}
// // // // //                 onPress={() => secureSetShowLeaveModal(true)}
// // // // //                 activeOpacity={0.7}
// // // // //               >
// // // // //                 <View style={calendarScreenStyles.actionIcon}>
// // // // //                   <Ionicons name="calendar-outline" size={22} color={colors.white} />
// // // // //                 </View>
// // // // //                 <View style={calendarScreenStyles.actionTextContainer}>
// // // // //                   <Text style={calendarScreenStyles.actionTitle}>Apply for Leave</Text>
// // // // //                 </View>
// // // // //               </TouchableOpacity>

// // // // //               <TouchableOpacity
// // // // //                 style={calendarScreenStyles.actionButton}
// // // // //                 onPress={() => secureSetShowExtraMilkModal(true)}
// // // // //                 activeOpacity={0.7}
// // // // //               >
// // // // //                 <View style={calendarScreenStyles.actionIcon}>
// // // // //                   <Ionicons name="add-circle-outline" size={22} color={colors.white} />
// // // // //                 </View>
// // // // //                 <View style={calendarScreenStyles.actionTextContainer}>
// // // // //                   <Text style={calendarScreenStyles.actionTitle}>Request Extra Milk</Text>
// // // // //                 </View>
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           </>
// // // // //         )}

// // // // //         {/* ✅ DISTRIBUTOR INFO SECTION */}
// // // // //         {isDistributor && (
// // // // //           <View style={styles.distributorInfoSection}>
// // // // //             <Text style={styles.restrictedTitle}>🚫 DISTRIBUTOR ACCESS RESTRICTIONS</Text>
// // // // //             <Text style={styles.restrictedText}>
// // // // //               ✅ ALLOWED:{'\n'}
// // // // //               • View delivery dates and status{'\n'}
// // // // //               • Track delivery completion{'\n'}
// // // // //               • Monitor monthly delivery statistics{'\n'}
// // // // //               {'\n'}
// // // // //               🚫 BLOCKED:{'\n'}
// // // // //               • Leave request functionality{'\n'}
// // // // //               • Extra milk request functionality{'\n'}
// // // // //               • Quick Action buttons{'\n'}
// // // // //               • Consumer private data modification
// // // // //             </Text>
// // // // //           </View>
// // // // //         )}
// // // // //       </ScrollView>

// // // // //       {/* ✅ MODALS - ONLY FOR CONSUMERS */}
// // // // //       {hasFullAccess && (
// // // // //         <>
// // // // //           <LeaveRequestModal
// // // // //             isVisible={showLeaveModal}
// // // // //             onClose={() => setShowLeaveModal(false)}
// // // // //             onSubmit={handleLeaveSubmit}
// // // // //           />

// // // // //           <ExtraMilkModal
// // // // //             isVisible={showExtraMilkModal}
// // // // //             onClose={() => setShowExtraMilkModal(false)}
// // // // //             onSubmit={handleExtraMilkSubmit}
// // // // //           />
// // // // //         </>
// // // // //       )}
// // // // //     </View>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     backgroundColor: '#F8F9FA',
// // // // //   },

// // // // //   headerWithBackButton: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'flex-start',
// // // // //   },
// // // // //   headerContent: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   backButtonStyle: {
// // // // //     width: 44,
// // // // //     height: 44,
// // // // //     borderRadius: 22,
// // // // //     backgroundColor: '#F0F8FF',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 16,
// // // // //   },
// // // // //   distributorBadge: {
// // // // //     color: '#FF3B30',
// // // // //     fontWeight: '700',
// // // // //   },

// // // // //   distributorBanner: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#FFF5F5',
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 12,
// // // // //     gap: 8,
// // // // //     borderBottomWidth: 3,
// // // // //     borderBottomColor: '#FF3B30',
// // // // //   },
// // // // //   bannerText: {
// // // // //     fontSize: 13,
// // // // //     color: '#FF3B30',
// // // // //     fontWeight: '700',
// // // // //     flex: 1,
// // // // //   },

// // // // //   distributorInfoSection: {
// // // // //     backgroundColor: '#FFF5F5',
// // // // //     marginHorizontal: 20,
// // // // //     padding: 16,
// // // // //     borderRadius: 12,
// // // // //     marginBottom: 20,
// // // // //     borderWidth: 2,
// // // // //     borderColor: '#FF3B30',
// // // // //   },
// // // // //   restrictedTitle: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '700',
// // // // //     color: '#FF3B30',
// // // // //     marginBottom: 8,
// // // // //     textAlign: 'center',
// // // // //   },
// // // // //   restrictedText: {
// // // // //     fontSize: 13,
// // // // //     color: '#FF3B30',
// // // // //     lineHeight: 18,
// // // // //   },

// // // // //   loadingContainer: {
// // // // //     flex: 1,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#F8F9FA',
// // // // //     paddingHorizontal: 20,
// // // // //   },
// // // // //   loadingText: {
// // // // //     marginTop: 16,
// // // // //     color: '#8E8E93',
// // // // //     fontSize: 16,
// // // // //     fontWeight: '500',
// // // // //   },
// // // // // });

// // // // // export default ConsumerCalendarScreen;
// // // // import React, { useEffect, useCallback, useMemo, useState } from 'react';
// // // // import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   ScrollView,
// // // //   TouchableOpacity,
// // // //   Alert,
// // // //   ActivityIndicator,
// // // //   RefreshControl,
// // // //   StyleSheet,
// // // // } from 'react-native';
// // // // import { Calendar, DateData } from 'react-native-calendars';
// // // // import Ionicons from 'react-native-vector-icons/Ionicons';
// // // // import { useSelector, useDispatch } from 'react-redux';
// // // // import type { RootState, AppDispatch } from '../../store';

// // // // import { calendarScreenStyles, calendarTheme, colors } from '../../styles/CalendorScreenStyle';

// // // // import {
// // // //   fetchCalendarData,
// // // //   setCurrentMonth,
// // // //   clearError,
// // // //   LeaveItem,
// // // //   ExtraMilkItem,
// // // //   submitLeaveRequest,
// // // //   submitExtraMilk,
// // // //   cancelLeave,
// // // // } from '../../store/calendarSlice';

// // // // import { selectConsumers } from '../../store/consumersSlice';
// // // // import { checkStoredAuth } from '../../store/authSlice';

// // // // interface CalendarViewerProps {
// // // //   viewerRole?: 'consumer' | 'distributor' | 'vendor';
// // // //   targetConsumerId?: number;
// // // //   targetConsumerName?: string;
// // // //   showBackButton?: boolean;
// // // // }

// // // // type MarkedDates = Record<
// // // //   string,
// // // //   {
// // // //     selected?: boolean;
// // // //     marked?: boolean;
// // // //     selectedColor?: string;
// // // //     dotColor?: string;
// // // //     dots?: Array<{
// // // //       key: string;
// // // //       color: string;
// // // //       selectedDotColor?: string;
// // // //     }>;
// // // //   }
// // // // >;

// // // // interface LeaveRequestData {
// // // //   startDate: string;
// // // //   endDate: string;
// // // //   reason: string;
// // // //   leaveType: 'single' | 'multiple';
// // // // }

// // // // interface ExtraMilkData {
// // // //   date: string;
// // // //   quantity: number;
// // // //   milkType: 'cow' | 'buffalo' | 'mixed';
// // // //   reason: string;
// // // // }

// // // // const statusColors: Record<string, string> = {
// // // //   delivered: '#4CAF50',
// // // //   vendor_unavailable: '#F44336',
// // // //   leave: '#9C27B0',
// // // //   extra_milk: '#FFC107',
// // // // };

// // // // const monthNames = [
// // // //   'January', 'February', 'March', 'April', 'May', 'June',
// // // //   'July', 'August', 'September', 'October', 'November', 'December',
// // // // ];

// // // // const ConsumerModals: React.FC<{
// // // //   showLeaveModal: boolean;
// // // //   showExtraMilkModal: boolean;
// // // //   onCloseLeave: () => void;
// // // //   onCloseExtraMilk: () => void;
// // // //   onSubmitLeave: (data: LeaveRequestData) => void;
// // // //   onSubmitExtraMilk: (data: ExtraMilkData) => void;
// // // //   viewerRole: string;
// // // // }> = React.memo(({
// // // //   showLeaveModal,
// // // //   showExtraMilkModal,
// // // //   onCloseLeave,
// // // //   onCloseExtraMilk,
// // // //   onSubmitLeave,
// // // //   onSubmitExtraMilk,
// // // //   viewerRole,
// // // // }) => {
// // // //   if (viewerRole !== 'consumer') {return null;}

// // // //   const LazyLeaveRequestModal = React.lazy(() => import('../../components/LeaveRequestModal'));
// // // //   const LazyExtraMilkModal = React.lazy(() => import('../../components/ExtraMilkModal'));

// // // //   return (
// // // //     <React.Suspense fallback={null}>
// // // //       {showLeaveModal && (
// // // //         <LazyLeaveRequestModal
// // // //           isVisible={showLeaveModal}
// // // //           onClose={onCloseLeave}
// // // //           onSubmit={onSubmitLeave}
// // // //         />
// // // //       )}

// // // //       {showExtraMilkModal && (
// // // //         <LazyExtraMilkModal
// // // //           isVisible={showExtraMilkModal}
// // // //           onClose={onCloseExtraMilk}
// // // //           onSubmit={onSubmitExtraMilk}
// // // //         />
// // // //       )}
// // // //     </React.Suspense>
// // // //   );
// // // // });

// // // // ConsumerModals.displayName = 'ConsumerModals';

// // // // const StatusLegend: React.FC<{ isDistributor: boolean }> = React.memo(({ isDistributor }) => (
// // // //   <View style={calendarScreenStyles.legendContainer}>
// // // //     <Text style={calendarScreenStyles.legendTitle}>Legend</Text>
// // // //     <View style={calendarScreenStyles.legendGrid}>
// // // //       <View style={calendarScreenStyles.legendItem}>
// // // //         <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.delivered }]} />
// // // //         <Text style={calendarScreenStyles.legendText}>Delivered</Text>
// // // //       </View>
// // // //       <View style={calendarScreenStyles.legendItem}>
// // // //         <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.vendor_unavailable }]} />
// // // //         <Text style={calendarScreenStyles.legendText}>Unavailable</Text>
// // // //       </View>

// // // //       {!isDistributor && (
// // // //         <>
// // // //           <View style={calendarScreenStyles.legendItem}>
// // // //             <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.leave }]} />
// // // //             <Text style={calendarScreenStyles.legendText}>Leave</Text>
// // // //           </View>
// // // //           <View style={calendarScreenStyles.legendItem}>
// // // //             <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.extra_milk }]} />
// // // //             <Text style={calendarScreenStyles.legendText}>Extra Milk</Text>
// // // //           </View>
// // // //         </>
// // // //       )}
// // // //     </View>
// // // //   </View>
// // // // ));

// // // // StatusLegend.displayName = 'StatusLegend';

// // // // const MonthlySummary: React.FC<{
// // // //   monthlySummary: any;
// // // //   currentMonth: number;
// // // //   currentYear: number;
// // // //   isDistributor: boolean;
// // // //   leavesCount: number;
// // // // }> = React.memo(({ monthlySummary, currentMonth, currentYear, isDistributor, leavesCount }) => {
// // // //   const formatMilkQuantity = (quantity: number | string) => {
// // // //     const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
// // // //     if (isNaN(num)) {return '0L';}
// // // //     return `${num}L`;
// // // //   };

// // // //   const formatCurrency = (amount: number | string) => {
// // // //     const num = typeof amount === 'string' ? parseFloat(amount) : amount;
// // // //     if (isNaN(num)) {return '₹0';}
// // // //     return `₹${num}`;
// // // //   };

// // // //   return (
// // // //     <View style={calendarScreenStyles.summaryContainer}>
// // // //       <Text style={calendarScreenStyles.summaryTitle}>
// // // //         {monthNames[currentMonth]} {currentYear} Summary
// // // //       </Text>
// // // //       <View style={calendarScreenStyles.summaryGrid}>
// // // //         <View style={calendarScreenStyles.summaryItem}>
// // // //           <Ionicons name="water-outline" size={24} color={colors.primary} />
// // // //           <Text style={calendarScreenStyles.summaryValue}>
// // // //             {formatMilkQuantity(monthlySummary?.totalMilk)}
// // // //           </Text>
// // // //           <Text style={calendarScreenStyles.summaryLabel}>Total Milk</Text>
// // // //         </View>

// // // //         <View style={calendarScreenStyles.summaryItem}>
// // // //           <Ionicons name="receipt-outline" size={24} color={colors.success} />
// // // //           <Text style={calendarScreenStyles.summaryValue}>
// // // //             {formatCurrency(monthlySummary?.totalBill)}
// // // //           </Text>
// // // //           <Text style={calendarScreenStyles.summaryLabel}>Total Bill</Text>
// // // //         </View>

// // // //         {!isDistributor && (
// // // //           <View style={calendarScreenStyles.summaryItem}>
// // // //             <Ionicons name="calendar-outline" size={24} color={colors.danger} />
// // // //             <Text style={calendarScreenStyles.summaryValue}>{leavesCount || 0}</Text>
// // // //             <Text style={calendarScreenStyles.summaryLabel}>Leaves</Text>
// // // //           </View>
// // // //         )}

// // // //         <View style={calendarScreenStyles.summaryItem}>
// // // //           <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
// // // //           <Text style={calendarScreenStyles.summaryValue}>
// // // //             {monthlySummary?.totalDeliveries || 0}
// // // //           </Text>
// // // //           <Text style={calendarScreenStyles.summaryLabel}>Deliveries</Text>
// // // //         </View>
// // // //       </View>
// // // //     </View>
// // // //   );
// // // // });

// // // // MonthlySummary.displayName = 'MonthlySummary';

// // // // const ConsumerCalendarScreen: React.FC<CalendarViewerProps> = ({
// // // //   viewerRole = 'consumer',
// // // //   targetConsumerId,
// // // //   targetConsumerName,
// // // //   showBackButton = false,
// // // // }) => {
// // // //   const dispatch = useDispatch<AppDispatch>();
// // // //   const navigation = useNavigation();
// // // //   const route = useRoute();

// // // //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
// // // //   const consumers = useSelector(selectConsumers);

// // // //   const customerId: number | null = useMemo(() => {
// // // //     return targetConsumerId || (user?.userID ? parseInt(user.userID.toString(), 10) : null);
// // // //   }, [targetConsumerId, user?.userID]);

// // // //   // Safe consumer name determination
// // // //   const consumerName = useMemo(() => {
// // // //     if (targetConsumerName) {return targetConsumerName;}

// // // //     if (customerId && consumers?.length) {
// // // //       const consumer = consumers.find(c => c?.customer_id === customerId);
// // // //       if (consumer?.customer_name) {return consumer.customer_name;}
// // // //     }

// // // //     return user?.name || 'Consumer';
// // // //   }, [targetConsumerName, customerId, consumers, user?.name]);

// // // //   const actualViewerRole = useMemo(() => {
// // // //     const routeParams = route.params as any;
// // // //     return routeParams?.viewerRole || viewerRole;
// // // //   }, [route.params, viewerRole]);

// // // //   const isDistributor = actualViewerRole === 'distributor';

// // // //   const {
// // // //     deliveryTypes = {},
// // // //     upcomingLeaves = {},
// // // //     upcomingMilkRequests = {},
// // // //     monthlySummary = {},
// // // //     loading = false,
// // // //     currentMonth = new Date().getMonth(),
// // // //     currentYear = new Date().getFullYear(),
// // // //   } = useSelector((state: RootState) => state.calendar);

// // // //   const [modalState, setModalState] = useState({
// // // //     showLeaveModal: false,
// // // //     showExtraMilkModal: false,
// // // //   });
// // // //   const [selectedDate, setSelectedDate] = useState('');
// // // //   const [refreshing, setRefreshing] = useState(false);

// // // //   const handleModalToggle = useCallback((modalType: 'leave' | 'extraMilk', isOpen: boolean) => {
// // // //     if (isDistributor) {return;}

// // // //     setModalState(prev => ({
// // // //       ...prev,
// // // //       [`show${modalType === 'leave' ? 'Leave' : 'ExtraMilk'}Modal`]: isOpen,
// // // //     }));
// // // //   }, [isDistributor]);

// // // //   const openLeaveModal = useCallback(() => handleModalToggle('leave', true), [handleModalToggle]);
// // // //   const openExtraMilkModal = useCallback(() => handleModalToggle('extraMilk', true), [handleModalToggle]);
// // // //   const closeLeaveModal = useCallback(() => handleModalToggle('leave', false), [handleModalToggle]);
// // // //   const closeExtraMilkModal = useCallback(() => handleModalToggle('extraMilk', false), [handleModalToggle]);

// // // //   useEffect(() => {
// // // //     if (isDistributor) {
// // // //       setModalState({ showLeaveModal: false, showExtraMilkModal: false });
// // // //     }
// // // //   }, [isDistributor]);

// // // //   useEffect(() => {
// // // //     dispatch(checkStoredAuth());
// // // //   }, [dispatch]);

// // // //   useFocusEffect(
// // // //     useCallback(() => {
// // // //       if (customerId !== null && isAuthenticated) {
// // // //         const now = new Date();
// // // //         dispatch(setCurrentMonth({ month: now.getMonth(), year: now.getFullYear() }));
// // // //         const monthString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
// // // //         dispatch(fetchCalendarData({ customerId, month: monthString }));
// // // //       }
// // // //     }, [customerId, isAuthenticated, dispatch]),
// // // //   );

// // // //   const leavesForCustomer = useMemo(() => {
// // // //     if (isDistributor || !customerId || !upcomingLeaves) {return [];}
// // // //     const value = upcomingLeaves[customerId];
// // // //     return Array.isArray(value) ? value : [];
// // // //   }, [upcomingLeaves, customerId, isDistributor]);

// // // //   const milkRequestsForCustomer = useMemo(() => {
// // // //     if (isDistributor || !customerId || !upcomingMilkRequests) {return [];}
// // // //     const value = upcomingMilkRequests[customerId];
// // // //     return Array.isArray(value) ? value : [];
// // // //   }, [upcomingMilkRequests, customerId, isDistributor]);

// // // //   const markedDates: MarkedDates = useMemo(() => {
// // // //     const marks: MarkedDates = {};
// // // //     const allowedStatuses = isDistributor
// // // //       ? ['delivered', 'vendor_unavailable']
// // // //       : ['delivered', 'vendor_unavailable', 'leave', 'extra_milk'];

// // // //     const allStatusesPerDate: Record<string, string[]> = {};

// // // //     if (deliveryTypes && typeof deliveryTypes === 'object') {
// // // //       Object.entries(deliveryTypes).forEach(([date, status]) => {
// // // //         if (allowedStatuses.includes(status)) {
// // // //           if (!allStatusesPerDate[date]) {allStatusesPerDate[date] = [];}
// // // //           allStatusesPerDate[date].push(status);
// // // //         }
// // // //       });
// // // //     }

// // // //     if (!isDistributor && Array.isArray(leavesForCustomer)) {
// // // //       leavesForCustomer.forEach((leave: LeaveItem) => {
// // // //         if (leave?.date) {
// // // //           if (!allStatusesPerDate[leave.date]) {allStatusesPerDate[leave.date] = [];}
// // // //           allStatusesPerDate[leave.date].push('leave');
// // // //         }
// // // //       });
// // // //     }

// // // //     if (!isDistributor && Array.isArray(milkRequestsForCustomer)) {
// // // //       milkRequestsForCustomer.forEach((request: ExtraMilkItem) => {
// // // //         if (request?.date) {
// // // //           if (!allStatusesPerDate[request.date]) {allStatusesPerDate[request.date] = [];}
// // // //           allStatusesPerDate[request.date].push('extra_milk');
// // // //         }
// // // //       });
// // // //     }

// // // //     if (customerId && Array.isArray(consumers)) {
// // // //       const consumerData = consumers.find(c => c?.customer_id === customerId);
// // // //       if (consumerData?.deliveryHistory && Array.isArray(consumerData.deliveryHistory)) {
// // // //         consumerData.deliveryHistory.forEach(delivery => {
// // // //           if (delivery?.status === 'delivered' && delivery?.date && allowedStatuses.includes('delivered')) {
// // // //             if (!allStatusesPerDate[delivery.date]) {allStatusesPerDate[delivery.date] = [];}
// // // //             allStatusesPerDate[delivery.date].push('delivered');
// // // //           }
// // // //         });
// // // //       }
// // // //     }

// // // //     Object.entries(allStatusesPerDate).forEach(([date, statuses]) => {
// // // //       const status = allowedStatuses.find(s => statuses.includes(s));
// // // //       if (status && statusColors[status]) {
// // // //         marks[date] = {
// // // //           dots: [{
// // // //             key: `${status}-${date}`,
// // // //             color: statusColors[status],
// // // //             selectedDotColor: statusColors[status],
// // // //           }],
// // // //         };
// // // //       }
// // // //     });

// // // //     if (selectedDate) {
// // // //       marks[selectedDate] = {
// // // //         ...(marks[selectedDate] || {}),
// // // //         selected: true,
// // // //         selectedColor: colors.primary,
// // // //       };
// // // //     }

// // // //     return marks;
// // // //   }, [deliveryTypes, leavesForCustomer, milkRequestsForCustomer, selectedDate, consumers, customerId, isDistributor]);

// // // //   const handleDayPress = useCallback((day: DateData) => {
// // // //     setSelectedDate(day.dateString);

// // // //     if (Array.isArray(consumers) && customerId) {
// // // //       const consumerData = consumers.find(c => c?.customer_id === customerId);
// // // //       const deliveryForDate = consumerData?.deliveryHistory?.find(d => d?.date === day.dateString);

// // // //       if (deliveryForDate) {
// // // //         const statusText = deliveryForDate.status === 'delivered' ? 'Delivered' : 'Cancelled';
// // // //         const statusIcon = deliveryForDate.status === 'delivered' ? '✅' : '❌';
// // // //         Alert.alert(
// // // //           'Delivery Status',
// // // //           `${statusIcon} Milk ${statusText.toLowerCase()} on ${day.dateString}${deliveryForDate.remarks ? `\n\nRemarks: ${deliveryForDate.remarks}` : ''}`,
// // // //           [{ text: 'OK' }]
// // // //         );
// // // //         return;
// // // //       }
// // // //     }

// // // //     if (deliveryTypes && typeof deliveryTypes === 'object') {
// // // //       const status = deliveryTypes[day.dateString];
// // // //       if (status) {
// // // //         const messages: Record<string, string> = isDistributor
// // // //           ? {
// // // //               delivered: 'Delivery completed',
// // // //               vendor_unavailable: 'Vendor unavailable',
// // // //             }
// // // //           : {
// // // //               delivered: 'Milk delivered',
// // // //               vendor_unavailable: 'Vendor unavailable',
// // // //               leave: 'On leave',
// // // //               extra_milk: 'Extra milk requested',
// // // //             };

// // // //         if (messages[status]) {
// // // //           Alert.alert('Status', `${messages[status]} on ${day.dateString}`);
// // // //         }
// // // //       }
// // // //     }
// // // //   }, [deliveryTypes, consumers, customerId, isDistributor]);

// // // //   const onRefresh = useCallback(() => {
// // // //     if (customerId === null) {return;}

// // // //     setRefreshing(true);
// // // //     dispatch(clearError());

// // // //     const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
// // // //     dispatch(fetchCalendarData({ customerId, month: monthString }))
// // // //       .finally(() => setRefreshing(false));
// // // //   }, [customerId, currentMonth, currentYear, dispatch]);

// // // //   const handleLeaveSubmit = useCallback(async (leaveData: LeaveRequestData) => {
// // // //     if (isDistributor || customerId === null) {return;}

// // // //     try {
// // // //       await dispatch(submitLeaveRequest({ customerId, leaveData }));
// // // //       const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
// // // //       await dispatch(fetchCalendarData({ customerId, month: monthString }));
// // // //       Alert.alert('Success', 'Leave request submitted successfully!');
// // // //       closeLeaveModal();
// // // //     } catch (err) {
// // // //       Alert.alert('Error', typeof err === 'string' ? err : 'Failed to submit leave request');
// // // //     }
// // // //   }, [isDistributor, customerId, dispatch, currentMonth, currentYear, closeLeaveModal]);

// // // //   const handleExtraMilkSubmit = useCallback(async (extraMilkData: ExtraMilkData) => {
// // // //     if (isDistributor || customerId === null) {return;}

// // // //     try {
// // // //       await dispatch(submitExtraMilk({ customerId, milkData: extraMilkData }));
// // // //       const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
// // // //       await dispatch(fetchCalendarData({ customerId, month: monthString }));
// // // //       Alert.alert('Success', 'Extra milk request submitted successfully!');
// // // //       closeExtraMilkModal();
// // // //     } catch (err) {
// // // //       Alert.alert('Error', typeof err === 'string' ? err : 'Failed to request extra milk');
// // // //     }
// // // //   }, [isDistributor, customerId, dispatch, currentMonth, currentYear, closeExtraMilkModal]);

// // // //   const handleCancelLeave = useCallback((leaveId: string, leaveDate: string) => {
// // // //     if (isDistributor || customerId === null) {return;}

// // // //     Alert.alert('Cancel Leave', `Cancel leave for ${leaveDate}?`, [
// // // //       { text: 'No', style: 'cancel' },
// // // //       {
// // // //         text: 'Yes',
// // // //         style: 'destructive',
// // // //         onPress: () => {
// // // //           dispatch(cancelLeave({ leaveId, leaveDate, customerId }));
// // // //           const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
// // // //           dispatch(fetchCalendarData({ customerId, month: monthString }));
// // // //           Alert.alert('Success', 'Leave cancelled successfully!');
// // // //         },
// // // //       },
// // // //     ]);
// // // //   }, [isDistributor, customerId, dispatch, currentMonth, currentYear]);

// // // //   if (!isAuthenticated || loading) {
// // // //     return (
// // // //       <View style={styles.loadingContainer}>
// // // //         <ActivityIndicator size="large" color={colors.primary} />
// // // //       </View>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <View style={styles.container}>
// // // //       <View style={[calendarScreenStyles.header, showBackButton && styles.headerWithBackButton]}>
// // // //         {showBackButton && (
// // // //           <TouchableOpacity
// // // //             onPress={() => navigation.goBack()}
// // // //             style={styles.backButtonStyle}
// // // //             accessibilityLabel="Go back"
// // // //             accessibilityRole="button"
// // // //           >
// // // //             <Ionicons name="arrow-back" size={24} color="#007AFF" />
// // // //           </TouchableOpacity>
// // // //         )}

// // // //         <View style={styles.headerContent}>
// // // //           <Text style={calendarScreenStyles.title}>
// // // //             {consumerName} - Calendar
// // // //           </Text>

// // // //           <View style={calendarScreenStyles.monthSelector}>
// // // //             <Text style={calendarScreenStyles.monthText}>
// // // //               {monthNames[currentMonth]} {currentYear}
// // // //             </Text>
// // // //           </View>

// // // //           {customerId !== null && (
// // // //             <Text style={calendarScreenStyles.customerIdText}>
// // // //               Customer ID: {customerId}
// // // //             </Text>
// // // //           )}
// // // //         </View>
// // // //       </View>

// // // //       <ScrollView
// // // //         style={calendarScreenStyles.content}
// // // //         showsVerticalScrollIndicator={false}
// // // //         refreshControl={
// // // //           <RefreshControl
// // // //             refreshing={refreshing}
// // // //             onRefresh={onRefresh}
// // // //             colors={[colors.primary]}
// // // //             tintColor={colors.primary}
// // // //           />
// // // //         }
// // // //       >
// // // //         <View style={calendarScreenStyles.calendarContainer}>
// // // //           <Calendar
// // // //             style={calendarScreenStyles.calendar}
// // // //             theme={calendarTheme}
// // // //             onDayPress={handleDayPress}
// // // //             onMonthChange={(month) =>
// // // //               dispatch(setCurrentMonth({ month: month.month - 1, year: month.year }))
// // // //             }
// // // //             markedDates={markedDates}
// // // //             markingType="multi-dot"
// // // //             hideExtraDays={true}
// // // //             disableMonthChange={false}
// // // //             firstDay={1}
// // // //             enableSwipeMonths={true}
// // // //             current={`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`}
// // // //           />
// // // //         </View>

// // // //         <StatusLegend isDistributor={isDistributor} />

// // // //         <MonthlySummary
// // // //           monthlySummary={monthlySummary}
// // // //           currentMonth={currentMonth}
// // // //           currentYear={currentYear}
// // // //           isDistributor={isDistributor}
// // // //           leavesCount={leavesForCustomer.length}
// // // //         />

// // // //         {!isDistributor && (
// // // //           <>
// // // //             {leavesForCustomer.length > 0 && (
// // // //               <View style={calendarScreenStyles.leavesContainer}>
// // // //                 <Text style={calendarScreenStyles.leavesTitle}>Upcoming Leaves</Text>
// // // //                 {leavesForCustomer.map((leave, index) => (
// // // //                   <View key={leave?.id ?? `leave-${index}`} style={calendarScreenStyles.leaveItem}>
// // // //                     <View style={calendarScreenStyles.leaveItemContent}>
// // // //                       <Text style={calendarScreenStyles.leaveDate}>{leave?.date ?? 'N/A'}</Text>
// // // //                       <Text style={calendarScreenStyles.leaveReason}>
// // // //                         {leave?.reason ?? 'No reason'} • {leave?.status ?? 'Unknown'}
// // // //                       </Text>
// // // //                     </View>
// // // //                     {leave?.status !== 'cancelled' && leave?.id && leave?.date && (
// // // //                       <TouchableOpacity
// // // //                         style={calendarScreenStyles.leaveButton}
// // // //                         onPress={() => handleCancelLeave(leave.id, leave.date)}
// // // //                         accessibilityLabel={`Cancel leave for ${leave.date}`}
// // // //                       >
// // // //                         <Text style={calendarScreenStyles.leaveButtonText}>Cancel</Text>
// // // //                       </TouchableOpacity>
// // // //                     )}
// // // //                   </View>
// // // //                 ))}
// // // //               </View>
// // // //             )}

// // // //             {milkRequestsForCustomer.length > 0 && (
// // // //               <View style={calendarScreenStyles.leavesContainer}>
// // // //                 <Text style={calendarScreenStyles.leavesTitle}>Extra Milk Requests</Text>
// // // //                 {milkRequestsForCustomer.map((request, index) => (
// // // //                   <View key={request?.id ?? `milk-${index}`} style={calendarScreenStyles.leaveItem}>
// // // //                     <View style={calendarScreenStyles.leaveItemContent}>
// // // //                       <Text style={calendarScreenStyles.leaveDate}>{request?.date ?? 'N/A'}</Text>
// // // //                       <Text style={calendarScreenStyles.leaveReason}>
// // // //                         {request?.quantity ?? 0}L - {request?.reason ?? 'No reason'} • {request?.status ?? 'Unknown'}
// // // //                       </Text>
// // // //                     </View>
// // // //                   </View>
// // // //                 ))}
// // // //               </View>
// // // //             )}

// // // //             <View style={calendarScreenStyles.actionsContainer}>
// // // //               <TouchableOpacity
// // // //                 style={calendarScreenStyles.actionButton}
// // // //                 onPress={openLeaveModal}
// // // //                 activeOpacity={0.7}
// // // //                 accessibilityLabel="Apply for leave"
// // // //               >
// // // //                 <View style={calendarScreenStyles.actionIcon}>
// // // //                   <Ionicons name="calendar-outline" size={22} color={colors.white} />
// // // //                 </View>
// // // //                 <View style={calendarScreenStyles.actionTextContainer}>
// // // //                   <Text style={calendarScreenStyles.actionTitle}>Apply for Leave</Text>
// // // //                 </View>
// // // //               </TouchableOpacity>

// // // //               <TouchableOpacity
// // // //                 style={calendarScreenStyles.actionButton}
// // // //                 onPress={openExtraMilkModal}
// // // //                 activeOpacity={0.7}
// // // //                 accessibilityLabel="Request extra milk"
// // // //               >
// // // //                 <View style={calendarScreenStyles.actionIcon}>
// // // //                   <Ionicons name="add-circle-outline" size={22} color={colors.white} />
// // // //                 </View>
// // // //                 <View style={calendarScreenStyles.actionTextContainer}>
// // // //                   <Text style={calendarScreenStyles.actionTitle}>Request Extra Milk</Text>
// // // //                 </View>
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           </>
// // // //         )}
// // // //       </ScrollView>

// // // //       <ConsumerModals
// // // //         viewerRole={actualViewerRole}
// // // //         showLeaveModal={modalState.showLeaveModal}
// // // //         showExtraMilkModal={modalState.showExtraMilkModal}
// // // //         onCloseLeave={closeLeaveModal}
// // // //         onCloseExtraMilk={closeExtraMilkModal}
// // // //         onSubmitLeave={handleLeaveSubmit}
// // // //         onSubmitExtraMilk={handleExtraMilkSubmit}
// // // //       />
// // // //     </View>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: '#F8F9FA',
// // // //   },
// // // //   headerWithBackButton: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 16,
// // // //   },
// // // //   headerContent: {
// // // //     flex: 1,
// // // //     marginLeft: 12,
// // // //   },
// // // //   backButtonStyle: {
// // // //     width: 44,
// // // //     height: 44,
// // // //     borderRadius: 22,
// // // //     backgroundColor: '#F0F8FF',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   loadingContainer: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#F8F9FA',
// // // //   },
// // // // });

// // // // export default React.memo(ConsumerCalendarScreen);
// // // import React, { useEffect, useCallback, useMemo, useState } from 'react';
// // // import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
// // // import {
// // //   View,
// // //   Text,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   Alert,
// // //   ActivityIndicator,
// // //   RefreshControl,
// // //   StyleSheet,
// // // } from 'react-native';
// // // import { Calendar, DateData } from 'react-native-calendars';
// // // import Ionicons from 'react-native-vector-icons/Ionicons';
// // // import { useSelector, useDispatch } from 'react-redux';
// // // import type { RootState, AppDispatch } from '../../store';

// // // import { calendarScreenStyles, calendarTheme, colors } from '../../styles/CalendorScreenStyle';

// // // import {
// // //   fetchCalendarData,
// // //   setCurrentMonth,
// // //   clearError,
// // //   LeaveItem,
// // //   ExtraMilkItem,
// // //   submitLeaveRequest,
// // //   submitExtraMilk,
// // //   cancelLeave,
// // // } from '../../store/calendarSlice';

// // // import { selectConsumers } from '../../store/consumersSlice';
// // // import { checkStoredAuth } from '../../store/authSlice';

// // // interface CalendarViewerProps {
// // //   viewerRole?: 'consumer' | 'distributor' | 'vendor';
// // //   targetConsumerId?: number;
// // //   targetConsumerName?: string;
// // //   showBackButton?: boolean;
// // // }

// // // type MarkedDates = Record<
// // //   string,
// // //   {
// // //     selected?: boolean;
// // //     marked?: boolean;
// // //     selectedColor?: string;
// // //     dotColor?: string;
// // //     dots?: Array<{
// // //       key: string;
// // //       color: string;
// // //       selectedDotColor?: string;
// // //     }>;
// // //   }
// // // >;

// // // interface LeaveRequestData {
// // //   startDate: string;
// // //   endDate: string;
// // //   reason: string;
// // //   leaveType: 'single' | 'multiple';
// // // }

// // // interface ExtraMilkData {
// // //   date: string;
// // //   quantity: number;
// // //   milkType: 'cow' | 'buffalo' | 'mixed';
// // //   reason: string;
// // // }

// // // const statusColors: Record<string, string> = {
// // //   delivered: '#4CAF50',
// // //   vendor_unavailable: '#F44336',
// // //   leave: '#9C27B0',
// // //   extra_milk: '#FFC107',
// // // };

// // // const monthNames = [
// // //   'January', 'February', 'March', 'April', 'May', 'June',
// // //   'July', 'August', 'September', 'October', 'November', 'December'
// // // ];

// // // const ConsumerModals: React.FC<{
// // //   showLeaveModal: boolean;
// // //   showExtraMilkModal: boolean;
// // //   onCloseLeave: () => void;
// // //   onCloseExtraMilk: () => void;
// // //   onSubmitLeave: (data: LeaveRequestData) => void;
// // //   onSubmitExtraMilk: (data: ExtraMilkData) => void;
// // //   viewerRole: string;
// // // }> = React.memo(({
// // //   showLeaveModal,
// // //   showExtraMilkModal,
// // //   onCloseLeave,
// // //   onCloseExtraMilk,
// // //   onSubmitLeave,
// // //   onSubmitExtraMilk,
// // //   viewerRole
// // // }) => {
// // //   if (viewerRole !== 'consumer') return null;

// // //   const LazyLeaveRequestModal = React.lazy(() => import('../../components/LeaveRequestModal'));
// // //   const LazyExtraMilkModal = React.lazy(() => import('../../components/ExtraMilkModal'));

// // //   return (
// // //     <React.Suspense fallback={null}>
// // //       {showLeaveModal && (
// // //         <LazyLeaveRequestModal
// // //           isVisible={showLeaveModal}
// // //           onClose={onCloseLeave}
// // //           onSubmit={onSubmitLeave}
// // //         />
// // //       )}

// // //       {showExtraMilkModal && (
// // //         <LazyExtraMilkModal
// // //           isVisible={showExtraMilkModal}
// // //           onClose={onCloseExtraMilk}
// // //           onSubmit={onSubmitExtraMilk}
// // //         />
// // //       )}
// // //     </React.Suspense>
// // //   );
// // // });

// // // ConsumerModals.displayName = 'ConsumerModals';

// // // const StatusLegend: React.FC<{ isDistributor: boolean }> = React.memo(({ isDistributor }) => (
// // //   <View style={calendarScreenStyles.legendContainer}>
// // //     <Text style={calendarScreenStyles.legendTitle}>Legend</Text>
// // //     <View style={calendarScreenStyles.legendGrid}>
// // //       <View style={calendarScreenStyles.legendItem}>
// // //         <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.delivered }]} />
// // //         <Text style={calendarScreenStyles.legendText}>Delivered</Text>
// // //       </View>
// // //       <View style={calendarScreenStyles.legendItem}>
// // //         <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.vendor_unavailable }]} />
// // //         <Text style={calendarScreenStyles.legendText}>Unavailable</Text>
// // //       </View>

// // //       {!isDistributor && (
// // //         <>
// // //           <View style={calendarScreenStyles.legendItem}>
// // //             <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.leave }]} />
// // //             <Text style={calendarScreenStyles.legendText}>Leave</Text>
// // //           </View>
// // //           <View style={calendarScreenStyles.legendItem}>
// // //             <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.extra_milk }]} />
// // //             <Text style={calendarScreenStyles.legendText}>Extra Milk</Text>
// // //           </View>
// // //         </>
// // //       )}
// // //     </View>
// // //   </View>
// // // ));

// // // StatusLegend.displayName = 'StatusLegend';

// // // const MonthlySummary: React.FC<{
// // //   monthlySummary: any;
// // //   currentMonth: number;
// // //   currentYear: number;
// // //   isDistributor: boolean;
// // //   leavesCount: number;
// // // }> = React.memo(({ monthlySummary, currentMonth, currentYear, isDistributor, leavesCount }) => {
// // //   const formatMilkQuantity = (quantity: number | string) => {
// // //     const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
// // //     if (isNaN(num)) return '0L';
// // //     return `${num}L`;
// // //   };

// // //   const formatCurrency = (amount: number | string) => {
// // //     const num = typeof amount === 'string' ? parseFloat(amount) : amount;
// // //     if (isNaN(num)) return '₹0';
// // //     return `₹${num}`;
// // //   };

// // //   return (
// // //     <View style={calendarScreenStyles.summaryContainer}>
// // //       <Text style={calendarScreenStyles.summaryTitle}>
// // //         {monthNames[currentMonth]} {currentYear} Summary
// // //       </Text>
// // //       <View style={calendarScreenStyles.summaryGrid}>
// // //         <View style={calendarScreenStyles.summaryItem}>
// // //           <Ionicons name="water-outline" size={24} color={colors.primary} />
// // //           <Text style={calendarScreenStyles.summaryValue}>
// // //             {formatMilkQuantity(monthlySummary?.totalMilk)}
// // //           </Text>
// // //           <Text style={calendarScreenStyles.summaryLabel}>Total Milk</Text>
// // //         </View>

// // //         <View style={calendarScreenStyles.summaryItem}>
// // //           <Ionicons name="receipt-outline" size={24} color={colors.success} />
// // //           <Text style={calendarScreenStyles.summaryValue}>
// // //             {formatCurrency(monthlySummary?.totalBill)}
// // //           </Text>
// // //           <Text style={calendarScreenStyles.summaryLabel}>Total Bill</Text>
// // //         </View>

// // //         {!isDistributor && (
// // //           <View style={calendarScreenStyles.summaryItem}>
// // //             <Ionicons name="calendar-outline" size={24} color={colors.danger} />
// // //             <Text style={calendarScreenStyles.summaryValue}>{leavesCount || 0}</Text>
// // //             <Text style={calendarScreenStyles.summaryLabel}>Leaves</Text>
// // //           </View>
// // //         )}

// // //         <View style={calendarScreenStyles.summaryItem}>
// // //           <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
// // //           <Text style={calendarScreenStyles.summaryValue}>
// // //             {monthlySummary?.totalDeliveries || 0}
// // //           </Text>
// // //           <Text style={calendarScreenStyles.summaryLabel}>Deliveries</Text>
// // //         </View>
// // //       </View>
// // //     </View>
// // //   );
// // // });

// // // MonthlySummary.displayName = 'MonthlySummary';

// // // const ConsumerCalendarScreen: React.FC<CalendarViewerProps> = ({
// // //   viewerRole = 'consumer',
// // //   targetConsumerId,
// // //   targetConsumerName,
// // //   showBackButton = false,
// // // }) => {
// // //   const dispatch = useDispatch<AppDispatch>();
// // //   const navigation = useNavigation();
// // //   const route = useRoute();

// // //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
// // //   const consumers = useSelector(selectConsumers);

// // //   const customerId: number | null = useMemo(() => {
// // //     return targetConsumerId || (user?.userID ? parseInt(user.userID.toString(), 10) : null);
// // //   }, [targetConsumerId, user?.userID]);

// // //   const consumerName = useMemo(() => {
// // //     if (targetConsumerName) return targetConsumerName;

// // //     if (customerId && consumers?.length) {
// // //       const consumer = consumers.find(c => c?.customer_id === customerId);
// // //       if (consumer?.customer_name) return consumer.customer_name;
// // //     }

// // //     return user?.name || 'Consumer';
// // //   }, [targetConsumerName, customerId, consumers, user?.name]);

// // //   const actualViewerRole = useMemo(() => {
// // //     const routeParams = route.params as any;
// // //     return routeParams?.viewerRole || viewerRole;
// // //   }, [route.params, viewerRole]);

// // //   const isDistributor = actualViewerRole === 'distributor';

// // //   const {
// // //     deliveryTypes = {},
// // //     upcomingLeaves = {},
// // //     upcomingMilkRequests = {},
// // //     monthlySummary = {},
// // //     loading = false,
// // //     currentMonth = new Date().getMonth(),
// // //     currentYear = new Date().getFullYear(),
// // //   } = useSelector((state: RootState) => state.calendar);

// // //   const [modalState, setModalState] = useState({
// // //     showLeaveModal: false,
// // //     showExtraMilkModal: false,
// // //   });
// // //   const [selectedDate, setSelectedDate] = useState('');
// // //   const [refreshing, setRefreshing] = useState(false);

// // //   const handleModalToggle = useCallback((modalType: 'leave' | 'extraMilk', isOpen: boolean) => {
// // //     if (isDistributor) return;

// // //     setModalState(prev => ({
// // //       ...prev,
// // //       [`show${modalType === 'leave' ? 'Leave' : 'ExtraMilk'}Modal`]: isOpen,
// // //     }));
// // //   }, [isDistributor]);

// // //   const openLeaveModal = useCallback(() => handleModalToggle('leave', true), [handleModalToggle]);
// // //   const openExtraMilkModal = useCallback(() => handleModalToggle('extraMilk', true), [handleModalToggle]);
// // //   const closeLeaveModal = useCallback(() => handleModalToggle('leave', false), [handleModalToggle]);
// // //   const closeExtraMilkModal = useCallback(() => handleModalToggle('extraMilk', false), [handleModalToggle]);

// // //   useEffect(() => {
// // //     if (isDistributor) {
// // //       setModalState({ showLeaveModal: false, showExtraMilkModal: false });
// // //     }
// // //   }, [isDistributor]);

// // //   useEffect(() => {
// // //     dispatch(checkStoredAuth());
// // //   }, [dispatch]);

// // //   useFocusEffect(
// // //     useCallback(() => {
// // //       if (customerId !== null && isAuthenticated) {
// // //         const now = new Date();
// // //         dispatch(setCurrentMonth({ month: now.getMonth(), year: now.getFullYear() }));
// // //         const monthString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
// // //         dispatch(fetchCalendarData({ customerId, month: monthString }));
// // //       }
// // //     }, [customerId, isAuthenticated, dispatch]),
// // //   );

// // //   const leavesForCustomer = useMemo(() => {
// // //     if (isDistributor || !customerId || !upcomingLeaves) return [];
// // //     const value = upcomingLeaves[customerId];
// // //     return Array.isArray(value) ? value : [];
// // //   }, [upcomingLeaves, customerId, isDistributor]);

// // //   const milkRequestsForCustomer = useMemo(() => {
// // //     if (isDistributor || !customerId || !upcomingMilkRequests) return [];
// // //     const value = upcomingMilkRequests[customerId];
// // //     return Array.isArray(value) ? value : [];
// // //   }, [upcomingMilkRequests, customerId, isDistributor]);

// // //   const markedDates: MarkedDates = useMemo(() => {
// // //     const marks: MarkedDates = {};
// // //     const allowedStatuses = isDistributor
// // //       ? ['delivered', 'vendor_unavailable']
// // //       : ['delivered', 'vendor_unavailable', 'leave', 'extra_milk'];

// // //     const allStatusesPerDate: Record<string, string[]> = {};

// // //     if (deliveryTypes && typeof deliveryTypes === 'object') {
// // //       Object.entries(deliveryTypes).forEach(([date, status]) => {
// // //         if (allowedStatuses.includes(status)) {
// // //           if (!allStatusesPerDate[date]) allStatusesPerDate[date] = [];
// // //           allStatusesPerDate[date].push(status);
// // //         }
// // //       });
// // //     }

// // //     if (!isDistributor && Array.isArray(leavesForCustomer)) {
// // //       leavesForCustomer.forEach((leave: LeaveItem) => {
// // //         if (leave?.date) {
// // //           if (!allStatusesPerDate[leave.date]) allStatusesPerDate[leave.date] = [];
// // //           allStatusesPerDate[leave.date].push('leave');
// // //         }
// // //       });
// // //     }

// // //     if (!isDistributor && Array.isArray(milkRequestsForCustomer)) {
// // //       milkRequestsForCustomer.forEach((request: ExtraMilkItem) => {
// // //         if (request?.date) {
// // //           if (!allStatusesPerDate[request.date]) allStatusesPerDate[request.date] = [];
// // //           allStatusesPerDate[request.date].push('extra_milk');
// // //         }
// // //       });
// // //     }

// // //     if (customerId && Array.isArray(consumers)) {
// // //       const consumerData = consumers.find(c => c?.customer_id === customerId);
// // //       if (consumerData?.deliveryHistory && Array.isArray(consumerData.deliveryHistory)) {
// // //         consumerData.deliveryHistory.forEach(delivery => {
// // //           if (delivery?.status === 'delivered' && delivery?.date && allowedStatuses.includes('delivered')) {
// // //             if (!allStatusesPerDate[delivery.date]) allStatusesPerDate[delivery.date] = [];
// // //             allStatusesPerDate[delivery.date].push('delivered');
// // //           }
// // //         });
// // //       }
// // //     }

// // //     Object.entries(allStatusesPerDate).forEach(([date, statuses]) => {
// // //       const status = allowedStatuses.find(s => statuses.includes(s));
// // //       if (status && statusColors[status]) {
// // //         marks[date] = {
// // //           dots: [{
// // //             key: `${status}-${date}`,
// // //             color: statusColors[status],
// // //             selectedDotColor: statusColors[status],
// // //           }],
// // //         };
// // //       }
// // //     });

// // //     if (selectedDate) {
// // //       marks[selectedDate] = {
// // //         ...(marks[selectedDate] || {}),
// // //         selected: true,
// // //         selectedColor: colors.primary,
// // //       };
// // //     }

// // //     return marks;
// // //   }, [deliveryTypes, leavesForCustomer, milkRequestsForCustomer, selectedDate, consumers, customerId, isDistributor]);

// // //   const handleDayPress = useCallback((day: DateData) => {
// // //     setSelectedDate(day.dateString);

// // //     if (Array.isArray(consumers) && customerId) {
// // //       const consumerData = consumers.find(c => c?.customer_id === customerId);
// // //       const deliveryForDate = consumerData?.deliveryHistory?.find(d => d?.date === day.dateString);

// // //       if (deliveryForDate) {
// // //         const statusText = deliveryForDate.status === 'delivered' ? 'Delivered' : 'Cancelled';
// // //         const statusIcon = deliveryForDate.status === 'delivered' ? '✅' : '❌';
// // //         Alert.alert(
// // //           'Delivery Status',
// // //           `${statusIcon} Milk ${statusText.toLowerCase()} on ${day.dateString}${deliveryForDate.remarks ? `\n\nRemarks: ${deliveryForDate.remarks}` : ''}`,
// // //           [{ text: 'OK' }]
// // //         );
// // //         return;
// // //       }
// // //     }

// // //     if (deliveryTypes && typeof deliveryTypes === 'object') {
// // //       const status = deliveryTypes[day.dateString];
// // //       if (status) {
// // //         const messages: Record<string, string> = isDistributor
// // //           ? {
// // //               delivered: 'Delivery completed',
// // //               vendor_unavailable: 'Vendor unavailable',
// // //             }
// // //           : {
// // //               delivered: 'Milk delivered',
// // //               vendor_unavailable: 'Vendor unavailable',
// // //               leave: 'On leave',
// // //               extra_milk: 'Extra milk requested',
// // //             };

// // //         if (messages[status]) {
// // //           Alert.alert('Status', `${messages[status]} on ${day.dateString}`);
// // //         }
// // //       }
// // //     }
// // //   }, [deliveryTypes, consumers, customerId, isDistributor]);

// // //   const onRefresh = useCallback(() => {
// // //     if (customerId === null) return;

// // //     setRefreshing(true);
// // //     dispatch(clearError());

// // //     const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
// // //     dispatch(fetchCalendarData({ customerId, month: monthString }))
// // //       .finally(() => setRefreshing(false));
// // //   }, [customerId, currentMonth, currentYear, dispatch]);

// // //   const handleLeaveSubmit = useCallback(async (leaveData: LeaveRequestData) => {
// // //     if (isDistributor || customerId === null) return;

// // //     try {
// // //       await dispatch(submitLeaveRequest({ customerId, leaveData }));
// // //       const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
// // //       await dispatch(fetchCalendarData({ customerId, month: monthString }));
// // //       Alert.alert('Success', 'Leave request submitted successfully!');
// // //       closeLeaveModal();
// // //     } catch (err) {
// // //       Alert.alert('Error', typeof err === 'string' ? err : 'Failed to submit leave request');
// // //     }
// // //   }, [isDistributor, customerId, dispatch, currentMonth, currentYear, closeLeaveModal]);

// // //   const handleExtraMilkSubmit = useCallback(async (extraMilkData: ExtraMilkData) => {
// // //     if (isDistributor || customerId === null) return;

// // //     try {
// // //       await dispatch(submitExtraMilk({ customerId, milkData: extraMilkData }));
// // //       const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
// // //       await dispatch(fetchCalendarData({ customerId, month: monthString }));
// // //       Alert.alert('Success', 'Extra milk request submitted successfully!');
// // //       closeExtraMilkModal();
// // //     } catch (err) {
// // //       Alert.alert('Error', typeof err === 'string' ? err : 'Failed to request extra milk');
// // //     }
// // //   }, [isDistributor, customerId, dispatch, currentMonth, currentYear, closeExtraMilkModal]);

// // //   // Removed .unwrap() from cancelLeave dispatch
// // //   const handleCancelLeave = useCallback((leaveId: string, leaveDate: string) => {
// // //     if (isDistributor || customerId === null) return;

// // //     Alert.alert('Cancel Leave', `Cancel leave for ${leaveDate}?`, [
// // //       { text: 'No', style: 'cancel' },
// // //       {
// // //         text: 'Yes',
// // //         style: 'destructive',
// // //         onPress: () => {
// // //           dispatch(cancelLeave({ leaveId, leaveDate, customerId }));
// // //           const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
// // //           dispatch(fetchCalendarData({ customerId, month: monthString }));
// // //           Alert.alert('Success', 'Leave cancelled successfully!');
// // //         }
// // //       },
// // //     ]);
// // //   }, [isDistributor, customerId, dispatch, currentMonth, currentYear]);

// // //   if (!isAuthenticated || loading) {
// // //     return (
// // //       <View style={styles.loadingContainer}>
// // //         <ActivityIndicator size="large" color={colors.primary} />
// // //       </View>
// // //     );
// // //   }

// // //   return (
// // //     <View style={styles.container}>
// // //       <View style={[calendarScreenStyles.header, showBackButton && styles.headerWithBackButton]}>
// // //         {showBackButton && (
// // //           <TouchableOpacity
// // //             onPress={() => navigation.goBack()}
// // //             style={styles.backButtonStyle}
// // //             accessibilityLabel="Go back"
// // //             accessibilityRole="button"
// // //           >
// // //             <Ionicons name="arrow-back" size={24} color="#007AFF" />
// // //           </TouchableOpacity>
// // //         )}

// // //         <View style={styles.headerContent}>
// // //           <Text style={calendarScreenStyles.title}>
// // //             {consumerName} - Calendar
// // //           </Text>

// // //           <View style={calendarScreenStyles.monthSelector}>
// // //             <Text style={calendarScreenStyles.monthText}>
// // //               {monthNames[currentMonth]} {currentYear}
// // //             </Text>
// // //           </View>

// // //           {customerId !== null && (
// // //             <Text style={calendarScreenStyles.customerIdText}>
// // //               Customer ID: {customerId}
// // //             </Text>
// // //           )}
// // //         </View>
// // //       </View>

// // //       <ScrollView
// // //         style={calendarScreenStyles.content}
// // //         showsVerticalScrollIndicator={false}
// // //         refreshControl={
// // //           <RefreshControl
// // //             refreshing={refreshing}
// // //             onRefresh={onRefresh}
// // //             colors={[colors.primary]}
// // //             tintColor={colors.primary}
// // //           />
// // //         }
// // //       >
// // //         <View style={calendarScreenStyles.calendarContainer}>
// // //           <Calendar
// // //             style={calendarScreenStyles.calendar}
// // //             theme={calendarTheme}
// // //             onDayPress={handleDayPress}
// // //             onMonthChange={(month) =>
// // //               dispatch(setCurrentMonth({ month: month.month - 1, year: month.year }))
// // //             }
// // //             markedDates={markedDates}
// // //             markingType="multi-dot"
// // //             hideExtraDays={true}
// // //             disableMonthChange={false}
// // //             firstDay={1}
// // //             enableSwipeMonths={true}
// // //             current={`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`}
// // //           />
// // //         </View>

// // //         <StatusLegend isDistributor={isDistributor} />

// // //         <MonthlySummary
// // //           monthlySummary={monthlySummary}
// // //           currentMonth={currentMonth}
// // //           currentYear={currentYear}
// // //           isDistributor={isDistributor}
// // //           leavesCount={leavesForCustomer.length}
// // //         />

// // //         {!isDistributor && (
// // //           <>
// // //             {leavesForCustomer.length > 0 && (
// // //               <View style={calendarScreenStyles.leavesContainer}>
// // //                 <Text style={calendarScreenStyles.leavesTitle}>Upcoming Leaves</Text>
// // //                 {leavesForCustomer.map((leave, index) => (
// // //                   <View key={leave?.id ?? `leave-${index}`} style={calendarScreenStyles.leaveItem}>
// // //                     <View style={calendarScreenStyles.leaveItemContent}>
// // //                       <Text style={calendarScreenStyles.leaveDate}>{leave?.date ?? 'N/A'}</Text>
// // //                       <Text style={calendarScreenStyles.leaveReason}>
// // //                         {leave?.reason ?? 'No reason'} • {leave?.status ?? 'Unknown'}
// // //                       </Text>
// // //                     </View>
// // //                     {leave?.status !== 'cancelled' && leave?.id && leave?.date && (
// // //                       <TouchableOpacity
// // //                         style={calendarScreenStyles.leaveButton}
// // //                         onPress={() => handleCancelLeave(leave.id, leave.date)}
// // //                         accessibilityLabel={`Cancel leave for ${leave.date}`}
// // //                       >
// // //                         <Text style={calendarScreenStyles.leaveButtonText}>Cancel</Text>
// // //                       </TouchableOpacity>
// // //                     )}
// // //                   </View>
// // //                 ))}
// // //               </View>
// // //             )}

// // //             {milkRequestsForCustomer.length > 0 && (
// // //               <View style={calendarScreenStyles.leavesContainer}>
// // //                 <Text style={calendarScreenStyles.leavesTitle}>Extra Milk Requests</Text>
// // //                 {milkRequestsForCustomer.map((request, index) => (
// // //                   <View key={request?.id ?? `milk-${index}`} style={calendarScreenStyles.leaveItem}>
// // //                     <View style={calendarScreenStyles.leaveItemContent}>
// // //                       <Text style={calendarScreenStyles.leaveDate}>{request?.date ?? 'N/A'}</Text>
// // //                       <Text style={calendarScreenStyles.leaveReason}>
// // //                         {request?.quantity ?? 0}L - {request?.reason ?? 'No reason'} • {request?.status ?? 'Unknown'}
// // //                       </Text>
// // //                     </View>
// // //                   </View>
// // //                 ))}
// // //               </View>
// // //             )}

// // //             <View style={calendarScreenStyles.actionsContainer}>
// // //               <TouchableOpacity
// // //                 style={calendarScreenStyles.actionButton}
// // //                 onPress={openLeaveModal}
// // //                 activeOpacity={0.7}
// // //                 accessibilityLabel="Apply for leave"
// // //               >
// // //                 <View style={calendarScreenStyles.actionIcon}>
// // //                   <Ionicons name="calendar-outline" size={22} color={colors.white} />
// // //                 </View>
// // //                 <View style={calendarScreenStyles.actionTextContainer}>
// // //                   <Text style={calendarScreenStyles.actionTitle}>Apply for Leave</Text>
// // //                 </View>
// // //               </TouchableOpacity>

// // //               <TouchableOpacity
// // //                 style={calendarScreenStyles.actionButton}
// // //                 onPress={openExtraMilkModal}
// // //                 activeOpacity={0.7}
// // //                 accessibilityLabel="Request extra milk"
// // //               >
// // //                 <View style={calendarScreenStyles.actionIcon}>
// // //                   <Ionicons name="add-circle-outline" size={22} color={colors.white} />
// // //                 </View>
// // //                 <View style={calendarScreenStyles.actionTextContainer}>
// // //                   <Text style={calendarScreenStyles.actionTitle}>Request Extra Milk</Text>
// // //                 </View>
// // //               </TouchableOpacity>
// // //             </View>
// // //           </>
// // //         )}
// // //       </ScrollView>

// // //       <ConsumerModals
// // //         viewerRole={actualViewerRole}
// // //         showLeaveModal={modalState.showLeaveModal}
// // //         showExtraMilkModal={modalState.showExtraMilkModal}
// // //         onCloseLeave={closeLeaveModal}
// // //         onCloseExtraMilk={closeExtraMilkModal}
// // //         onSubmitLeave={handleLeaveSubmit}
// // //         onSubmitExtraMilk={handleExtraMilkSubmit}
// // //       />
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#F8F9FA',
// // //   },
// // //   headerWithBackButton: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 16,
// // //   },
// // //   headerContent: {
// // //     flex: 1,
// // //     marginLeft: 12,
// // //   },
// // //   backButtonStyle: {
// // //     width: 44,
// // //     height: 44,
// // //     borderRadius: 22,
// // //     backgroundColor: '#F0F8FF',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   loadingContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     backgroundColor: '#F8F9FA',
// // //   },
// // // });

// // // export default React.memo(ConsumerCalendarScreen);
// // import React, { useEffect, useCallback, useMemo, useState } from 'react';
// // import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   TouchableOpacity,
// //   Alert,
// //   ActivityIndicator,
// //   RefreshControl,
// //   StyleSheet,
// // } from 'react-native';
// // import { Calendar, DateData } from 'react-native-calendars';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import { useSelector, useDispatch } from 'react-redux';
// // import type { RootState, AppDispatch } from '../../store';

// // import { calendarScreenStyles, calendarTheme, colors } from '../../styles/CalendorScreenStyle';

// // import {
// //   fetchCalendarData,
// //   setCurrentMonth,
// //   clearError,
// //   LeaveItem,
// //   ExtraMilkItem,
// //   submitLeaveRequest,
// //   submitExtraMilk,
// //   cancelLeave,
// // } from '../../store/calendarSlice';

// // import { selectConsumers } from '../../store/consumersSlice';
// // import { checkStoredAuth } from '../../store/authSlice';

// // interface CalendarViewerProps {
// //   viewerRole?: 'consumer' | 'distributor' | 'vendor';
// //   targetConsumerId?: number;
// //   targetConsumerName?: string;
// //   showBackButton?: boolean;
// // }

// // type MarkedDates = Record<
// //   string,
// //   {
// //     selected?: boolean;
// //     marked?: boolean;
// //     selectedColor?: string;
// //     dotColor?: string;
// //     dots?: Array<{
// //       key: string;
// //       color: string;
// //       selectedDotColor?: string;
// //     }>;
// //   }
// // >;

// // interface LeaveRequestData {
// //   startDate: string;
// //   endDate: string;
// //   reason: string;
// //   leaveType: 'single' | 'multiple';
// // }

// // interface ExtraMilkData {
// //   date: string;
// //   quantity: number;
// //   milkType: 'cow' | 'buffalo' | 'mixed';
// //   reason: string;
// // }

// // const statusColors: Record<string, string> = {
// //   delivered: '#4CAF50',
// //   vendor_unavailable: '#F44336',
// //   leave: '#9C27B0',
// //   extra_milk: '#FFC107',
// // };

// // const monthNames = [
// //   'January', 'February', 'March', 'April', 'May', 'June',
// //   'July', 'August', 'September', 'October', 'November', 'December'
// // ];

// // // CONSUMER-ONLY MODALS - NEVER RENDERED FOR DISTRIBUTORS
// // const ConsumerModals: React.FC<{
// //   showLeaveModal: boolean;
// //   showExtraMilkModal: boolean;
// //   onCloseLeave: () => void;
// //   onCloseExtraMilk: () => void;
// //   onSubmitLeave: (data: LeaveRequestData) => void;
// //   onSubmitExtraMilk: (data: ExtraMilkData) => void;
// //   viewerRole: string;
// // }> = React.memo(({
// //   showLeaveModal,
// //   showExtraMilkModal,
// //   onCloseLeave,
// //   onCloseExtraMilk,
// //   onSubmitLeave,
// //   onSubmitExtraMilk,
// //   viewerRole
// // }) => {
// //   // STRICT: Only consumers can see these modals
// //   if (viewerRole !== 'consumer') return null;

// //   const LazyLeaveRequestModal = React.lazy(() => import('../../components/LeaveRequestModal'));
// //   const LazyExtraMilkModal = React.lazy(() => import('../../components/ExtraMilkModal'));

// //   return (
// //     <React.Suspense fallback={null}>
// //       {showLeaveModal && (
// //         <LazyLeaveRequestModal
// //           isVisible={showLeaveModal}
// //           onClose={onCloseLeave}
// //           onSubmit={onSubmitLeave}
// //         />
// //       )}

// //       {showExtraMilkModal && (
// //         <LazyExtraMilkModal
// //           isVisible={showExtraMilkModal}
// //           onClose={onCloseExtraMilk}
// //           onSubmit={onSubmitExtraMilk}
// //         />
// //       )}
// //     </React.Suspense>
// //   );
// // });

// // ConsumerModals.displayName = 'ConsumerModals';

// // // DISTRIBUTOR LEGEND - ONLY DELIVERY STATUSES
// // const StatusLegend: React.FC<{ isDistributor: boolean }> = React.memo(({ isDistributor }) => (
// //   <View style={calendarScreenStyles.legendContainer}>
// //     <Text style={calendarScreenStyles.legendTitle}>Status Legend</Text>
// //     <View style={calendarScreenStyles.legendGrid}>
// //       <View style={calendarScreenStyles.legendItem}>
// //         <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.delivered }]} />
// //         <Text style={calendarScreenStyles.legendText}>Delivered</Text>
// //       </View>
// //       <View style={calendarScreenStyles.legendItem}>
// //         <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.vendor_unavailable }]} />
// //         <Text style={calendarScreenStyles.legendText}>Unavailable</Text>
// //       </View>

// //       {/* DISTRIBUTOR ONLY SEES DELIVERY STATUSES - NO CONSUMER INFO */}
// //       {!isDistributor && (
// //         <>
// //           <View style={calendarScreenStyles.legendItem}>
// //             <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.leave }]} />
// //             <Text style={calendarScreenStyles.legendText}>Leave</Text>
// //           </View>
// //           <View style={calendarScreenStyles.legendItem}>
// //             <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.extra_milk }]} />
// //             <Text style={calendarScreenStyles.legendText}>Extra Milk</Text>
// //           </View>
// //         </>
// //       )}
// //     </View>
// //   </View>
// // ));

// // StatusLegend.displayName = 'StatusLegend';

// // // DISTRIBUTOR SEES LIMITED SUMMARY - NO CONSUMER PRIVATE INFO
// // const MonthlySummary: React.FC<{
// //   monthlySummary: any;
// //   currentMonth: number;
// //   currentYear: number;
// //   isDistributor: boolean;
// //   leavesCount: number;
// // }> = React.memo(({ monthlySummary, currentMonth, currentYear, isDistributor, leavesCount }) => {
// //   const formatMilkQuantity = (quantity: number | string) => {
// //     const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
// //     if (isNaN(num)) return '0L';
// //     return `${num}L`;
// //   };

// //   const formatCurrency = (amount: number | string) => {
// //     const num = typeof amount === 'string' ? parseFloat(amount) : amount;
// //     if (isNaN(num)) return '₹0';
// //     return `₹${num}`;
// //   };

// //   return (
// //     <View style={calendarScreenStyles.summaryContainer}>
// //       <Text style={calendarScreenStyles.summaryTitle}>
// //         {monthNames[currentMonth]} {currentYear} - Delivery Summary
// //       </Text>
// //       <View style={calendarScreenStyles.summaryGrid}>
// //         <View style={calendarScreenStyles.summaryItem}>
// //           <Ionicons name="water-outline" size={24} color={colors.primary} />
// //           <Text style={calendarScreenStyles.summaryValue}>
// //             {formatMilkQuantity(monthlySummary?.totalMilk)}
// //           </Text>
// //           <Text style={calendarScreenStyles.summaryLabel}>Total Delivered</Text>
// //         </View>

// //         <View style={calendarScreenStyles.summaryItem}>
// //           <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
// //           <Text style={calendarScreenStyles.summaryValue}>
// //             {monthlySummary?.totalDeliveries || 0}
// //           </Text>
// //           <Text style={calendarScreenStyles.summaryLabel}>Deliveries</Text>
// //         </View>

// //         {/* CONSUMER-ONLY INFORMATION - HIDDEN FROM DISTRIBUTORS */}
// //         {!isDistributor && (
// //           <>
// //             <View style={calendarScreenStyles.summaryItem}>
// //               <Ionicons name="receipt-outline" size={24} color={colors.success} />
// //               <Text style={calendarScreenStyles.summaryValue}>
// //                 {formatCurrency(monthlySummary?.totalBill)}
// //               </Text>
// //               <Text style={calendarScreenStyles.summaryLabel}>Total Bill</Text>
// //             </View>

// //             <View style={calendarScreenStyles.summaryItem}>
// //               <Ionicons name="calendar-outline" size={24} color={colors.danger} />
// //               <Text style={calendarScreenStyles.summaryValue}>{leavesCount || 0}</Text>
// //               <Text style={calendarScreenStyles.summaryLabel}>Leaves</Text>
// //             </View>
// //           </>
// //         )}
// //       </View>
// //     </View>
// //   );
// // });

// // MonthlySummary.displayName = 'MonthlySummary';

// // const ConsumerCalendarScreen: React.FC<CalendarViewerProps> = ({
// //   viewerRole = 'consumer',
// //   targetConsumerId,
// //   targetConsumerName,
// //   showBackButton = false,
// // }) => {
// //   const dispatch = useDispatch<AppDispatch>();
// //   const navigation = useNavigation();
// //   const route = useRoute();

// //   // ROUTE PARAMS DETECTION FOR DISTRIBUTOR NAVIGATION
// //   const routeParams = route.params as {
// //     viewerRole?: 'consumer' | 'distributor' | 'vendor';
// //     targetConsumerId?: number;
// //     targetConsumerName?: string;
// //     showBackButton?: boolean;
// //   } || {};

// //   // USE ROUTE PARAMS (from stack navigation) OR PROPS (from tab navigation)
// //   const actualViewerRole = routeParams.viewerRole || viewerRole;
// //   const actualTargetConsumerId = routeParams.targetConsumerId || targetConsumerId;
// //   const actualTargetConsumerName = routeParams.targetConsumerName || targetConsumerName;
// //   const actualShowBackButton = routeParams.showBackButton !== undefined
// //     ? routeParams.showBackButton
// //     : showBackButton;

// //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
// //   const consumers = useSelector(selectConsumers);

// //   const customerId: number | null = useMemo(() => {
// //     return actualTargetConsumerId || (user?.userID ? parseInt(user.userID.toString(), 10) : null);
// //   }, [actualTargetConsumerId, user?.userID]);

// //   const consumerName = useMemo(() => {
// //     if (actualTargetConsumerName) return actualTargetConsumerName;

// //     if (customerId && consumers?.length) {
// //       const consumer = consumers.find(c => c?.customer_id === customerId);
// //       if (consumer?.customer_name) return consumer.customer_name;
// //     }

// //     return user?.name || 'Consumer';
// //   }, [actualTargetConsumerName, customerId, consumers, user?.name]);

// //   const isDistributor = actualViewerRole === 'distributor';

// //   const {
// //     deliveryTypes = {},
// //     upcomingLeaves = {},
// //     upcomingMilkRequests = {},
// //     monthlySummary = {},
// //     loading = false,
// //     currentMonth = new Date().getMonth(),
// //     currentYear = new Date().getFullYear(),
// //   } = useSelector((state: RootState) => state.calendar);

// //   // CONSUMER-ONLY MODAL STATE - DISTRIBUTORS DON'T EVEN HAVE ACCESS
// //   const [modalState, setModalState] = useState({
// //     showLeaveModal: false,
// //     showExtraMilkModal: false,
// //   });
// //   const [selectedDate, setSelectedDate] = useState('');
// //   const [refreshing, setRefreshing] = useState(false);

// //   // DISTRIBUTOR MODAL BLOCKING - COMPLETE ACCESS DENIAL
// //   const handleModalToggle = useCallback((modalType: 'leave' | 'extraMilk', isOpen: boolean) => {
// //     // DISTRIBUTORS CANNOT ACCESS ANY MODALS - PERIOD
// //     if (isDistributor) {
// //       return; // Silent block - no alert needed since they can't see buttons
// //     }

// //     setModalState(prev => ({
// //       ...prev,
// //       [`show${modalType === 'leave' ? 'Leave' : 'ExtraMilk'}Modal`]: isOpen,
// //     }));
// //   }, [isDistributor]);

// //   const openLeaveModal = useCallback(() => handleModalToggle('leave', true), [handleModalToggle]);
// //   const openExtraMilkModal = useCallback(() => handleModalToggle('extraMilk', true), [handleModalToggle]);
// //   const closeLeaveModal = useCallback(() => handleModalToggle('leave', false), [handleModalToggle]);
// //   const closeExtraMilkModal = useCallback(() => handleModalToggle('extraMilk', false), [handleModalToggle]);

// //   useEffect(() => {
// //     if (isDistributor) {
// //       setModalState({ showLeaveModal: false, showExtraMilkModal: false });
// //     }
// //   }, [isDistributor]);

// //   useEffect(() => {
// //     dispatch(checkStoredAuth());
// //   }, [dispatch]);

// //   useFocusEffect(
// //     useCallback(() => {
// //       if (customerId !== null && isAuthenticated) {
// //         const now = new Date();
// //         dispatch(setCurrentMonth({ month: now.getMonth(), year: now.getFullYear() }));
// //         const monthString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
// //         dispatch(fetchCalendarData({ customerId, month: monthString }));
// //       }
// //     }, [customerId, isAuthenticated, dispatch]),
// //   );

// //   // DISTRIBUTORS DON'T SEE CONSUMER LEAVE DATA
// //   const leavesForCustomer = useMemo(() => {
// //     if (isDistributor || !customerId || !upcomingLeaves) return [];
// //     const value = upcomingLeaves[customerId];
// //     return Array.isArray(value) ? value : [];
// //   }, [upcomingLeaves, customerId, isDistributor]);

// //   // DISTRIBUTORS DON'T SEE CONSUMER MILK REQUESTS
// //   const milkRequestsForCustomer = useMemo(() => {
// //     if (isDistributor || !customerId || !upcomingMilkRequests) return [];
// //     const value = upcomingMilkRequests[customerId];
// //     return Array.isArray(value) ? value : [];
// //   }, [upcomingMilkRequests, customerId, isDistributor]);

// //   // DISTRIBUTOR CALENDAR SHOWS ONLY DELIVERY STATUS
// //   const markedDates: MarkedDates = useMemo(() => {
// //     const marks: MarkedDates = {};

// //     // DISTRIBUTOR SEES: delivered, vendor_unavailable ONLY
// //     // CONSUMER SEES: delivered, vendor_unavailable, leave, extra_milk
// //     const allowedStatuses = isDistributor
// //       ? ['delivered', 'vendor_unavailable']
// //       : ['delivered', 'vendor_unavailable', 'leave', 'extra_milk'];

// //     const allStatusesPerDate: Record<string, string[]> = {};

// //     if (deliveryTypes && typeof deliveryTypes === 'object') {
// //       Object.entries(deliveryTypes).forEach(([date, status]) => {
// //         if (allowedStatuses.includes(status)) {
// //           if (!allStatusesPerDate[date]) allStatusesPerDate[date] = [];
// //           allStatusesPerDate[date].push(status);
// //         }
// //       });
// //     }

// //     // CONSUMER-ONLY DATA - DISTRIBUTORS DON'T SEE THIS
// //     if (!isDistributor && Array.isArray(leavesForCustomer)) {
// //       leavesForCustomer.forEach((leave: LeaveItem) => {
// //         if (leave?.date) {
// //           if (!allStatusesPerDate[leave.date]) allStatusesPerDate[leave.date] = [];
// //           allStatusesPerDate[leave.date].push('leave');
// //         }
// //       });
// //     }

// //     if (!isDistributor && Array.isArray(milkRequestsForCustomer)) {
// //       milkRequestsForCustomer.forEach((request: ExtraMilkItem) => {
// //         if (request?.date) {
// //           if (!allStatusesPerDate[request.date]) allStatusesPerDate[request.date] = [];
// //           allStatusesPerDate[request.date].push('extra_milk');
// //         }
// //       });
// //     }

// //     // DELIVERY HISTORY - BOTH CAN SEE
// //     if (customerId && Array.isArray(consumers)) {
// //       const consumerData = consumers.find(c => c?.customer_id === customerId);
// //       if (consumerData?.deliveryHistory && Array.isArray(consumerData.deliveryHistory)) {
// //         consumerData.deliveryHistory.forEach(delivery => {
// //           if (delivery?.status === 'delivered' && delivery?.date && allowedStatuses.includes('delivered')) {
// //             if (!allStatusesPerDate[delivery.date]) allStatusesPerDate[delivery.date] = [];
// //             allStatusesPerDate[delivery.date].push('delivered');
// //           }
// //         });
// //       }
// //     }

// //     Object.entries(allStatusesPerDate).forEach(([date, statuses]) => {
// //       const status = allowedStatuses.find(s => statuses.includes(s));
// //       if (status && statusColors[status]) {
// //         marks[date] = {
// //           dots: [{
// //             key: `${status}-${date}`,
// //             color: statusColors[status],
// //             selectedDotColor: statusColors[status],
// //           }],
// //         };
// //       }
// //     });

// //     if (selectedDate) {
// //       marks[selectedDate] = {
// //         ...(marks[selectedDate] || {}),
// //         selected: true,
// //         selectedColor: colors.primary,
// //       };
// //     }

// //     return marks;
// //   }, [deliveryTypes, leavesForCustomer, milkRequestsForCustomer, selectedDate, consumers, customerId, isDistributor]);

// //   const handleDayPress = useCallback((day: DateData) => {
// //     setSelectedDate(day.dateString);

// //     if (Array.isArray(consumers) && customerId) {
// //       const consumerData = consumers.find(c => c?.customer_id === customerId);
// //       const deliveryForDate = consumerData?.deliveryHistory?.find(d => d?.date === day.dateString);

// //       if (deliveryForDate) {
// //         const statusText = deliveryForDate.status === 'delivered' ? 'Delivered' : 'Cancelled';
// //         const statusIcon = deliveryForDate.status === 'delivered' ? '✅' : '❌';
// //         Alert.alert(
// //           'Delivery Status',
// //           `${statusIcon} Milk ${statusText.toLowerCase()} on ${day.dateString}${deliveryForDate.remarks ? `\n\nRemarks: ${deliveryForDate.remarks}` : ''}`,
// //           [{ text: 'OK' }]
// //         );
// //         return;
// //       }
// //     }

// //     if (deliveryTypes && typeof deliveryTypes === 'object') {
// //       const status = deliveryTypes[day.dateString];
// //       if (status) {
// //         // DISTRIBUTOR SEES ONLY DELIVERY STATUS
// //         const messages: Record<string, string> = isDistributor
// //           ? {
// //               delivered: 'Delivery completed',
// //               vendor_unavailable: 'Vendor unavailable',
// //             }
// //           : {
// //               delivered: 'Milk delivered',
// //               vendor_unavailable: 'Vendor unavailable',
// //               leave: 'On leave',
// //               extra_milk: 'Extra milk requested',
// //             };

// //         if (messages[status]) {
// //           Alert.alert('Status', `${messages[status]} on ${day.dateString}`);
// //         }
// //       }
// //     }
// //   }, [deliveryTypes, consumers, customerId, isDistributor]);

// //   const onRefresh = useCallback(() => {
// //     if (customerId === null) return;

// //     setRefreshing(true);
// //     dispatch(clearError());

// //     const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
// //     dispatch(fetchCalendarData({ customerId, month: monthString }))
// //       .finally(() => setRefreshing(false));
// //   }, [customerId, currentMonth, currentYear, dispatch]);

// //   // CONSUMER-ONLY FUNCTIONS - DISTRIBUTORS CAN'T SUBMIT ANYTHING
// //   const handleLeaveSubmit = useCallback(async (leaveData: LeaveRequestData) => {
// //     if (isDistributor || customerId === null) return;

// //     try {
// //       await dispatch(submitLeaveRequest({ customerId, leaveData }));
// //       const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
// //       await dispatch(fetchCalendarData({ customerId, month: monthString }));
// //       Alert.alert('Success', 'Leave request submitted successfully!');
// //       closeLeaveModal();
// //     } catch (err) {
// //       Alert.alert('Error', typeof err === 'string' ? err : 'Failed to submit leave request');
// //     }
// //   }, [isDistributor, customerId, dispatch, currentMonth, currentYear, closeLeaveModal]);

// //   const handleExtraMilkSubmit = useCallback(async (extraMilkData: ExtraMilkData) => {
// //     if (isDistributor || customerId === null) return;

// //     try {
// //       await dispatch(submitExtraMilk({ customerId, milkData: extraMilkData }));
// //       const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
// //       await dispatch(fetchCalendarData({ customerId, month: monthString }));
// //       Alert.alert('Success', 'Extra milk request submitted successfully!');
// //       closeExtraMilkModal();
// //     } catch (err) {
// //       Alert.alert('Error', typeof err === 'string' ? err : 'Failed to request extra milk');
// //     }
// //   }, [isDistributor, customerId, dispatch, currentMonth, currentYear, closeExtraMilkModal]);

// //   const handleCancelLeave = useCallback((leaveId: string, leaveDate: string) => {
// //     if (isDistributor || customerId === null) return;

// //     Alert.alert('Cancel Leave', `Cancel leave for ${leaveDate}?`, [
// //       { text: 'No', style: 'cancel' },
// //       {
// //         text: 'Yes',
// //         style: 'destructive',
// //         onPress: () => {
// //           dispatch(cancelLeave({ leaveId, leaveDate, customerId }));
// //           const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
// //           dispatch(fetchCalendarData({ customerId, month: monthString }));
// //           Alert.alert('Success', 'Leave cancelled successfully!');
// //         }
// //       },
// //     ]);
// //   }, [isDistributor, customerId, dispatch, currentMonth, currentYear]);

// //   if (!isAuthenticated || loading) {
// //     return (
// //       <View style={styles.loadingContainer}>
// //         <ActivityIndicator size="large" color={colors.primary} />
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       {/* HEADER WITH DISTRIBUTOR INDICATOR */}
// //       <View style={[calendarScreenStyles.header, actualShowBackButton && styles.headerWithBackButton]}>
// //         {actualShowBackButton && (
// //           <TouchableOpacity
// //             onPress={() => navigation.goBack()}
// //             style={styles.backButtonStyle}
// //             accessibilityLabel="Go back"
// //             accessibilityRole="button"
// //           >
// //             <Ionicons name="arrow-back" size={24} color="#007AFF" />
// //           </TouchableOpacity>
// //         )}

// //         <View style={styles.headerContent}>
// //           <Text style={calendarScreenStyles.title}>
// //             {consumerName} - Calendar
// //           </Text>

// //           {/* DISTRIBUTOR VIEW INDICATOR
// //           {isDistributor && (
// //             <View style={styles.distributorBadge}>
// //               <Ionicons name="eye-outline" size={14} color="#007AFF" />
// //               <Text style={styles.distributorBadgeText}>Delivery View Only</Text>
// //             </View>
// //           )} */}

// //           <View style={calendarScreenStyles.monthSelector}>
// //             <Text style={calendarScreenStyles.monthText}>
// //               {monthNames[currentMonth]} {currentYear}
// //             </Text>
// //           </View>

// //           {customerId !== null && (
// //             <Text style={calendarScreenStyles.customerIdText}>
// //               Customer ID: {customerId}
// //             </Text>
// //           )}
// //         </View>
// //       </View>

// //       <ScrollView
// //         style={calendarScreenStyles.content}
// //         showsVerticalScrollIndicator={false}
// //         refreshControl={
// //           <RefreshControl
// //             refreshing={refreshing}
// //             onRefresh={onRefresh}
// //             colors={[colors.primary]}
// //             tintColor={colors.primary}
// //           />
// //         }
// //       >
// //         {/* CALENDAR - BOTH CAN SEE (BUT DIFFERENT DATA) */}
// //         <View style={calendarScreenStyles.calendarContainer}>
// //           <Calendar
// //             style={calendarScreenStyles.calendar}
// //             theme={calendarTheme}
// //             onDayPress={handleDayPress}
// //             onMonthChange={(month) =>
// //               dispatch(setCurrentMonth({ month: month.month - 1, year: month.year }))
// //             }
// //             markedDates={markedDates}
// //             markingType="multi-dot"
// //             hideExtraDays={true}
// //             disableMonthChange={false}
// //             firstDay={1}
// //             enableSwipeMonths={true}
// //             current={`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`}
// //           />
// //         </View>

// //         {/* LEGEND - DIFFERENT FOR DISTRIBUTOR VS CONSUMER */}
// //         <StatusLegend isDistributor={isDistributor} />

// //         {/* SUMMARY - LIMITED FOR DISTRIBUTORS */}
// //         <MonthlySummary
// //           monthlySummary={monthlySummary}
// //           currentMonth={currentMonth}
// //           currentYear={currentYear}
// //           isDistributor={isDistributor}
// //           leavesCount={leavesForCustomer.length}
// //         />

// //         {/* CONSUMER-ONLY SECTIONS - COMPLETELY HIDDEN FROM DISTRIBUTORS */}
// //         {!isDistributor && (
// //           <>
// //             {leavesForCustomer.length > 0 && (
// //               <View style={calendarScreenStyles.leavesContainer}>
// //                 <Text style={calendarScreenStyles.leavesTitle}>Upcoming Leaves</Text>
// //                 {leavesForCustomer.map((leave, index) => (
// //                   <View key={leave?.id ?? `leave-${index}`} style={calendarScreenStyles.leaveItem}>
// //                     <View style={calendarScreenStyles.leaveItemContent}>
// //                       <Text style={calendarScreenStyles.leaveDate}>{leave?.date ?? 'N/A'}</Text>
// //                       <Text style={calendarScreenStyles.leaveReason}>
// //                         {leave?.reason ?? 'No reason'} • {leave?.status ?? 'Unknown'}
// //                       </Text>
// //                     </View>
// //                     {leave?.status !== 'cancelled' && leave?.id && leave?.date && (
// //                       <TouchableOpacity
// //                         style={calendarScreenStyles.leaveButton}
// //                         onPress={() => handleCancelLeave(leave.id, leave.date)}
// //                         accessibilityLabel={`Cancel leave for ${leave.date}`}
// //                       >
// //                         <Text style={calendarScreenStyles.leaveButtonText}>Cancel</Text>
// //                       </TouchableOpacity>
// //                     )}
// //                   </View>
// //                 ))}
// //               </View>
// //             )}

// //             {milkRequestsForCustomer.length > 0 && (
// //               <View style={calendarScreenStyles.leavesContainer}>
// //                 <Text style={calendarScreenStyles.leavesTitle}>Extra Milk Requests</Text>
// //                 {milkRequestsForCustomer.map((request, index) => (
// //                   <View key={request?.id ?? `milk-${index}`} style={calendarScreenStyles.leaveItem}>
// //                     <View style={calendarScreenStyles.leaveItemContent}>
// //                       <Text style={calendarScreenStyles.leaveDate}>{request?.date ?? 'N/A'}</Text>
// //                       <Text style={calendarScreenStyles.leaveReason}>
// //                         {request?.quantity ?? 0}L - {request?.reason ?? 'No reason'} • {request?.status ?? 'Unknown'}
// //                       </Text>
// //                     </View>
// //                   </View>
// //                 ))}
// //               </View>
// //             )}

// //             {/* ACTION BUTTONS - CONSUMER ONLY */}
// //             <View style={calendarScreenStyles.actionsContainer}>
// //               <TouchableOpacity
// //                 style={calendarScreenStyles.actionButton}
// //                 onPress={openLeaveModal}
// //                 activeOpacity={0.7}
// //                 accessibilityLabel="Apply for leave"
// //               >
// //                 <View style={calendarScreenStyles.actionIcon}>
// //                   <Ionicons name="calendar-outline" size={22} color={colors.white} />
// //                 </View>
// //                 <View style={calendarScreenStyles.actionTextContainer}>
// //                   <Text style={calendarScreenStyles.actionTitle}>Apply for Leave</Text>
// //                 </View>
// //               </TouchableOpacity>

// //               <TouchableOpacity
// //                 style={calendarScreenStyles.actionButton}
// //                 onPress={openExtraMilkModal}
// //                 activeOpacity={0.7}
// //                 accessibilityLabel="Request extra milk"
// //               >
// //                 <View style={calendarScreenStyles.actionIcon}>
// //                   <Ionicons name="add-circle-outline" size={22} color={colors.white} />
// //                 </View>
// //                 <View style={calendarScreenStyles.actionTextContainer}>
// //                   <Text style={calendarScreenStyles.actionTitle}>Request Extra Milk</Text>
// //                 </View>
// //               </TouchableOpacity>
// //             </View>
// //           </>
// //         )}
// //       </ScrollView>

// //       {/* MODALS - CONSUMERS ONLY - DISTRIBUTORS NEVER SEE THESE */}
// //       {actualViewerRole === 'consumer' && (
// //         <ConsumerModals
// //           viewerRole={actualViewerRole}
// //           showLeaveModal={modalState.showLeaveModal}
// //           showExtraMilkModal={modalState.showExtraMilkModal}
// //           onCloseLeave={closeLeaveModal}
// //           onCloseExtraMilk={closeExtraMilkModal}
// //           onSubmitLeave={handleLeaveSubmit}
// //           onSubmitExtraMilk={handleExtraMilkSubmit}
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
// //   headerWithBackButton: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 16,
// //   },
// //   headerContent: {
// //     flex: 1,
// //     marginLeft: 12,
// //   },
// //   backButtonStyle: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: 22,
// //     backgroundColor: '#F0F8FF',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#F8F9FA',
// //   },
// //   // DISTRIBUTOR VIEW INDICATOR
// //   distributorBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     alignSelf: 'flex-start',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     backgroundColor: '#EBF8FF',
// //     borderRadius: 12,
// //     marginBottom: 4,
// //     borderWidth: 1,
// //     borderColor: '#B3E5FC',
// //   },
// //   distributorBadgeText: {
// //     fontSize: 12,
// //     color: '#007AFF',
// //     fontWeight: '600',
// //     marginLeft: 4,
// //   },
// // });

// // export default React.memo(ConsumerCalendarScreen);
// import React, { useEffect, useCallback, useMemo, useState } from 'react';
// import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   RefreshControl,
//   StyleSheet,
// } from 'react-native';
// import { Calendar, DateData } from 'react-native-calendars';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useSelector, useDispatch } from 'react-redux';
// import type { RootState, AppDispatch } from '../../store';

// import { calendarScreenStyles, calendarTheme, colors } from '../../styles/CalendorScreenStyle';

// import {
//   fetchCalendarData,
//   setCurrentMonth,
//   clearError,
//   LeaveItem,
//   ExtraMilkItem,
//   submitLeaveRequest,
//   submitExtraMilk,
//   cancelLeave,
// } from '../../store/calendarSlice';

// import { selectConsumers } from '../../store/consumersSlice';
// import { checkStoredAuth } from '../../store/authSlice';

// interface CalendarViewerProps {
//   viewerRole?: 'consumer' | 'distributor' | 'vendor';
//   targetConsumerId?: number;
//   targetConsumerName?: string;
//   showBackButton?: boolean;
// }

// type MarkedDates = Record<
//   string,
//   {
//     selected?: boolean;
//     marked?: boolean;
//     selectedColor?: string;
//     dotColor?: string;
//     dots?: Array<{
//       key: string;
//       color: string;
//       selectedDotColor?: string;
//     }>;
//   }
// >;

// interface LeaveRequestData {
//   startDate: string;
//   endDate: string;
//   reason: string;
//   leaveType: 'single' | 'multiple';
// }

// interface ExtraMilkData {
//   date: string;
//   quantity: number;
//   milkType: 'cow' | 'buffalo' | 'mixed';
//   reason: string;
// }

// const statusColors: Record<string, string> = {
//   delivered: '#4CAF50',
//   vendor_unavailable: '#F44336',
//   leave: '#9C27B0',
//   extra_milk: '#FFC107',
// };

// const monthNames = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ];

// // CONSUMER-ONLY MODALS
// const ConsumerModals: React.FC<{
//   showLeaveModal: boolean;
//   showExtraMilkModal: boolean;
//   onCloseLeave: () => void;
//   onCloseExtraMilk: () => void;
//   onSubmitLeave: (data: LeaveRequestData) => void;
//   onSubmitExtraMilk: (data: ExtraMilkData) => void;
//   viewerRole: string;
// }> = React.memo(({
//   showLeaveModal,
//   showExtraMilkModal,
//   onCloseLeave,
//   onCloseExtraMilk,
//   onSubmitLeave,
//   onSubmitExtraMilk,
//   viewerRole
// }) => {
//   if (viewerRole !== 'consumer') return null;

//   const LazyLeaveRequestModal = React.lazy(() => import('../../components/LeaveRequestModal'));
//   const LazyExtraMilkModal = React.lazy(() => import('../../components/ExtraMilkModal'));

//   return (
//     <React.Suspense fallback={null}>
//       {showLeaveModal && (
//         <LazyLeaveRequestModal
//           isVisible={showLeaveModal}
//           onClose={onCloseLeave}
//           onSubmit={onSubmitLeave}
//         />
//       )}

//       {showExtraMilkModal && (
//         <LazyExtraMilkModal
//           isVisible={showExtraMilkModal}
//           onClose={onCloseExtraMilk}
//           onSubmit={onSubmitExtraMilk}
//         />
//       )}
//     </React.Suspense>
//   );
// });

// ConsumerModals.displayName = 'ConsumerModals';

// // DISTRIBUTOR SEES: Delivery + Leave statuses (for delivery planning)
// const StatusLegend: React.FC<{ isDistributor: boolean }> = React.memo(({ isDistributor }) => (
//   <View style={calendarScreenStyles.legendContainer}>
//     <Text style={calendarScreenStyles.legendTitle}>
//       {isDistributor ? 'Delivery Planning Guide' : 'Status Legend'}
//     </Text>
//     <View style={calendarScreenStyles.legendGrid}>
//       <View style={calendarScreenStyles.legendItem}>
//         <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.delivered }]} />
//         <Text style={calendarScreenStyles.legendText}>
//           {isDistributor ? 'Delivered' : 'Delivered'}
//         </Text>
//       </View>
//       <View style={calendarScreenStyles.legendItem}>
//         <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.vendor_unavailable }]} />
//         <Text style={calendarScreenStyles.legendText}>
//           {isDistributor ? 'Unavailable' : 'Unavailable'}
//         </Text>
//       </View>

//       {/* DISTRIBUTORS SEE LEAVES (for delivery planning) */}
//       <View style={calendarScreenStyles.legendItem}>
//         <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.leave }]} />
//         <Text style={calendarScreenStyles.legendText}>
//           {isDistributor ? 'Customer Leave' : 'Leave'}
//         </Text>
//       </View>

//       {/* ONLY CONSUMERS see extra milk */}
//       {!isDistributor && (
//         <View style={calendarScreenStyles.legendItem}>
//           <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.extra_milk }]} />
//           <Text style={calendarScreenStyles.legendText}>Extra Milk</Text>
//         </View>
//       )}
//     </View>
//   </View>
// ));

// StatusLegend.displayName = 'StatusLegend';

// // DISTRIBUTOR SEES: Delivery summary (no billing info)
// const MonthlySummary: React.FC<{
//   monthlySummary: any;
//   currentMonth: number;
//   currentYear: number;
//   isDistributor: boolean;
//   leavesCount: number;
// }> = React.memo(({ monthlySummary, currentMonth, currentYear, isDistributor, leavesCount }) => {
//   const formatMilkQuantity = (quantity: number | string) => {
//     const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
//     if (isNaN(num)) return '0L';
//     return `${num}L`;
//   };

//   const formatCurrency = (amount: number | string) => {
//     const num = typeof amount === 'string' ? parseFloat(amount) : amount;
//     if (isNaN(num)) return '₹0';
//     return `₹${num}`;
//   };

//   return (
//     <View style={calendarScreenStyles.summaryContainer}>
//       <Text style={calendarScreenStyles.summaryTitle}>
//         {monthNames[currentMonth]} {currentYear} - {isDistributor ? 'Delivery Summary' : 'Summary'}
//       </Text>
//       <View style={calendarScreenStyles.summaryGrid}>
//         <View style={calendarScreenStyles.summaryItem}>
//           <Ionicons name="water-outline" size={24} color={colors.primary} />
//           <Text style={calendarScreenStyles.summaryValue}>
//             {formatMilkQuantity(monthlySummary?.totalMilk)}
//           </Text>
//           <Text style={calendarScreenStyles.summaryLabel}>
//             {isDistributor ? 'Total Delivered' : 'Total Milk'}
//           </Text>
//         </View>

//         <View style={calendarScreenStyles.summaryItem}>
//           <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
//           <Text style={calendarScreenStyles.summaryValue}>
//             {monthlySummary?.totalDeliveries || 0}
//           </Text>
//           <Text style={calendarScreenStyles.summaryLabel}>Deliveries</Text>
//         </View>

//         {/* DISTRIBUTOR SEES LEAVES (for planning) */}
//         <View style={calendarScreenStyles.summaryItem}>
//           <Ionicons name="calendar-outline" size={24} color={colors.danger} />
//           <Text style={calendarScreenStyles.summaryValue}>{leavesCount || 0}</Text>
//           <Text style={calendarScreenStyles.summaryLabel}>
//             {isDistributor ? 'Customer Leaves' : 'Leaves'}
//           </Text>
//         </View>

//         {/* ONLY CONSUMERS see billing */}
//         {!isDistributor && (
//           <View style={calendarScreenStyles.summaryItem}>
//             <Ionicons name="receipt-outline" size={24} color={colors.success} />
//             <Text style={calendarScreenStyles.summaryValue}>
//               {formatCurrency(monthlySummary?.totalBill)}
//             </Text>
//             <Text style={calendarScreenStyles.summaryLabel}>Total Bill</Text>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// });

// MonthlySummary.displayName = 'MonthlySummary';

// const ConsumerCalendarScreen: React.FC<CalendarViewerProps> = ({
//   viewerRole = 'consumer',
//   targetConsumerId,
//   targetConsumerName,
//   showBackButton = false,
// }) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const navigation = useNavigation();
//   const route = useRoute();

//   // ROUTE PARAMS DETECTION
//   const routeParams = route.params as {
//     viewerRole?: 'consumer' | 'distributor' | 'vendor';
//     targetConsumerId?: number;
//     targetConsumerName?: string;
//     showBackButton?: boolean;
//   } || {};

//   const actualViewerRole = routeParams.viewerRole || viewerRole;
//   const actualTargetConsumerId = routeParams.targetConsumerId || targetConsumerId;
//   const actualTargetConsumerName = routeParams.targetConsumerName || targetConsumerName;
//   const actualShowBackButton = routeParams.showBackButton !== undefined
//     ? routeParams.showBackButton
//     : showBackButton;

//   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
//   const consumers = useSelector(selectConsumers);

//   const customerId: number | null = useMemo(() => {
//     return actualTargetConsumerId || (user?.userID ? parseInt(user.userID.toString(), 10) : null);
//   }, [actualTargetConsumerId, user?.userID]);

//   const consumerName = useMemo(() => {
//     if (actualTargetConsumerName) return actualTargetConsumerName;

//     if (customerId && consumers?.length) {
//       const consumer = consumers.find(c => c?.customer_id === customerId);
//       if (consumer?.customer_name) return consumer.customer_name;
//     }

//     return user?.name || 'Consumer';
//   }, [actualTargetConsumerName, customerId, consumers, user?.name]);

//   const isDistributor = actualViewerRole === 'distributor';

//   const {
//     deliveryTypes = {},
//     upcomingLeaves = {},
//     upcomingMilkRequests = {},
//     monthlySummary = {},
//     loading = false,
//     currentMonth = new Date().getMonth(),
//     currentYear = new Date().getFullYear(),
//   } = useSelector((state: RootState) => state.calendar);

//   const [modalState, setModalState] = useState({
//     showLeaveModal: false,
//     showExtraMilkModal: false,
//   });
//   const [selectedDate, setSelectedDate] = useState('');
//   const [refreshing, setRefreshing] = useState(false);

//   // MODAL ACCESS CONTROL - CONSUMERS ONLY
//   const handleModalToggle = useCallback((modalType: 'leave' | 'extraMilk', isOpen: boolean) => {
//     if (isDistributor) {
//       return; // Silent block for distributors
//     }

//     setModalState(prev => ({
//       ...prev,
//       [`show${modalType === 'leave' ? 'Leave' : 'ExtraMilk'}Modal`]: isOpen,
//     }));
//   }, [isDistributor]);

//   const openLeaveModal = useCallback(() => handleModalToggle('leave', true), [handleModalToggle]);
//   const openExtraMilkModal = useCallback(() => handleModalToggle('extraMilk', true), [handleModalToggle]);
//   const closeLeaveModal = useCallback(() => handleModalToggle('leave', false), [handleModalToggle]);
//   const closeExtraMilkModal = useCallback(() => handleModalToggle('extraMilk', false), [handleModalToggle]);

//   useEffect(() => {
//     if (isDistributor) {
//       setModalState({ showLeaveModal: false, showExtraMilkModal: false });
//     }
//   }, [isDistributor]);

//   useEffect(() => {
//     dispatch(checkStoredAuth());
//   }, [dispatch]);

//   useFocusEffect(
//     useCallback(() => {
//       if (customerId !== null && isAuthenticated) {
//         const now = new Date();
//         dispatch(setCurrentMonth({ month: now.getMonth(), year: now.getFullYear() }));
//         const monthString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
//         dispatch(fetchCalendarData({ customerId, month: monthString }));
//       }
//     }, [customerId, isAuthenticated, dispatch]),
//   );

//   // DISTRIBUTORS SEE LEAVES (for delivery planning)
//   const leavesForCustomer = useMemo(() => {
//     if (!customerId || !upcomingLeaves) return [];
//     const value = upcomingLeaves[customerId];
//     return Array.isArray(value) ? value : [];
//   }, [upcomingLeaves, customerId]);

//   // DISTRIBUTORS DON'T SEE EXTRA MILK REQUESTS
//   const milkRequestsForCustomer = useMemo(() => {
//     if (isDistributor || !customerId || !upcomingMilkRequests) return [];
//     const value = upcomingMilkRequests[customerId];
//     return Array.isArray(value) ? value : [];
//   }, [upcomingMilkRequests, customerId, isDistributor]);

//   // CALENDAR MARKERS: Distributors see delivery status + leaves
//   const markedDates: MarkedDates = useMemo(() => {
//     const marks: MarkedDates = {};

//     // DISTRIBUTOR SEES: delivered, vendor_unavailable, leave (for planning)
//     // CONSUMER SEES: delivered, vendor_unavailable, leave, extra_milk
//     const allowedStatuses = isDistributor
//       ? ['delivered', 'vendor_unavailable', 'leave']
//       : ['delivered', 'vendor_unavailable', 'leave', 'extra_milk'];

//     const allStatusesPerDate: Record<string, string[]> = {};

//     // Delivery status data
//     if (deliveryTypes && typeof deliveryTypes === 'object') {
//       Object.entries(deliveryTypes).forEach(([date, status]) => {
//         if (allowedStatuses.includes(status)) {
//           if (!allStatusesPerDate[date]) allStatusesPerDate[date] = [];
//           allStatusesPerDate[date].push(status);
//         }
//       });
//     }

//     // DISTRIBUTORS SEE LEAVES (for delivery planning)
//     if (Array.isArray(leavesForCustomer)) {
//       leavesForCustomer.forEach((leave: LeaveItem) => {
//         if (leave?.date) {
//           if (!allStatusesPerDate[leave.date]) allStatusesPerDate[leave.date] = [];
//           allStatusesPerDate[leave.date].push('leave');
//         }
//       });
//     }

//     // CONSUMERS ONLY see extra milk requests
//     if (!isDistributor && Array.isArray(milkRequestsForCustomer)) {
//       milkRequestsForCustomer.forEach((request: ExtraMilkItem) => {
//         if (request?.date) {
//           if (!allStatusesPerDate[request.date]) allStatusesPerDate[request.date] = [];
//           allStatusesPerDate[request.date].push('extra_milk');
//         }
//       });
//     }

//     // Delivery history data
//     if (customerId && Array.isArray(consumers)) {
//       const consumerData = consumers.find(c => c?.customer_id === customerId);
//       if (consumerData?.deliveryHistory && Array.isArray(consumerData.deliveryHistory)) {
//         consumerData.deliveryHistory.forEach(delivery => {
//           if (delivery?.status === 'delivered' && delivery?.date && allowedStatuses.includes('delivered')) {
//             if (!allStatusesPerDate[delivery.date]) allStatusesPerDate[delivery.date] = [];
//             allStatusesPerDate[delivery.date].push('delivered');
//           }
//         });
//       }
//     }

//     Object.entries(allStatusesPerDate).forEach(([date, statuses]) => {
//       const status = allowedStatuses.find(s => statuses.includes(s));
//       if (status && statusColors[status]) {
//         marks[date] = {
//           dots: [{
//             key: `${status}-${date}`,
//             color: statusColors[status],
//             selectedDotColor: statusColors[status],
//           }],
//         };
//       }
//     });

//     if (selectedDate) {
//       marks[selectedDate] = {
//         ...(marks[selectedDate] || {}),
//         selected: true,
//         selectedColor: colors.primary,
//       };
//     }

//     return marks;
//   }, [deliveryTypes, leavesForCustomer, milkRequestsForCustomer, selectedDate, consumers, customerId, isDistributor]);

//   const handleDayPress = useCallback((day: DateData) => {
//     setSelectedDate(day.dateString);

//     if (Array.isArray(consumers) && customerId) {
//       const consumerData = consumers.find(c => c?.customer_id === customerId);
//       const deliveryForDate = consumerData?.deliveryHistory?.find(d => d?.date === day.dateString);

//       if (deliveryForDate) {
//         const statusText = deliveryForDate.status === 'delivered' ? 'Delivered' : 'Cancelled';
//         const statusIcon = deliveryForDate.status === 'delivered' ? '✅' : '❌';
//         Alert.alert(
//           'Delivery Status',
//           `${statusIcon} Milk ${statusText.toLowerCase()} on ${day.dateString}${deliveryForDate.remarks ? `\n\nRemarks: ${deliveryForDate.remarks}` : ''}`,
//           [{ text: 'OK' }]
//         );
//         return;
//       }
//     }

//     if (deliveryTypes && typeof deliveryTypes === 'object') {
//       const status = deliveryTypes[day.dateString];
//       if (status) {
//         const messages: Record<string, string> = isDistributor
//           ? {
//               delivered: 'Delivery completed',
//               vendor_unavailable: 'Vendor unavailable',
//               leave: 'Customer on leave - No delivery needed',
//             }
//           : {
//               delivered: 'Milk delivered',
//               vendor_unavailable: 'Vendor unavailable',
//               leave: 'On leave',
//               extra_milk: 'Extra milk requested',
//             };

//         if (messages[status]) {
//           Alert.alert('Status', `${messages[status]} on ${day.dateString}`);
//         }
//       }
//     }
//   }, [deliveryTypes, consumers, customerId, isDistributor]);

//   const onRefresh = useCallback(() => {
//     if (customerId === null) return;

//     setRefreshing(true);
//     dispatch(clearError());

//     const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
//     dispatch(fetchCalendarData({ customerId, month: monthString }))
//       .finally(() => setRefreshing(false));
//   }, [customerId, currentMonth, currentYear, dispatch]);

//   // CONSUMER-ONLY FUNCTIONS
//   const handleLeaveSubmit = useCallback(async (leaveData: LeaveRequestData) => {
//     if (isDistributor || customerId === null) return;

//     try {
//       await dispatch(submitLeaveRequest({ customerId, leaveData }));
//       const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
//       await dispatch(fetchCalendarData({ customerId, month: monthString }));
//       Alert.alert('Success', 'Leave request submitted successfully!');
//       closeLeaveModal();
//     } catch (err) {
//       Alert.alert('Error', typeof err === 'string' ? err : 'Failed to submit leave request');
//     }
//   }, [isDistributor, customerId, dispatch, currentMonth, currentYear, closeLeaveModal]);

//   const handleExtraMilkSubmit = useCallback(async (extraMilkData: ExtraMilkData) => {
//     if (isDistributor || customerId === null) return;

//     try {
//       await dispatch(submitExtraMilk({ customerId, milkData: extraMilkData }));
//       const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
//       await dispatch(fetchCalendarData({ customerId, month: monthString }));
//       Alert.alert('Success', 'Extra milk request submitted successfully!');
//       closeExtraMilkModal();
//     } catch (err) {
//       Alert.alert('Error', typeof err === 'string' ? err : 'Failed to request extra milk');
//     }
//   }, [isDistributor, customerId, dispatch, currentMonth, currentYear, closeExtraMilkModal]);

//   const handleCancelLeave = useCallback((leaveId: string, leaveDate: string) => {
//     if (isDistributor || customerId === null) return;

//     Alert.alert('Cancel Leave', `Cancel leave for ${leaveDate}?`, [
//       { text: 'No', style: 'cancel' },
//       {
//         text: 'Yes',
//         style: 'destructive',
//         onPress: () => {
//           dispatch(cancelLeave({ leaveId, leaveDate, customerId }));
//           const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
//           dispatch(fetchCalendarData({ customerId, month: monthString }));
//           Alert.alert('Success', 'Leave cancelled successfully!');
//         }
//       },
//     ]);
//   }, [isDistributor, customerId, dispatch, currentMonth, currentYear]);

//   if (!isAuthenticated || loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* HEADER */}
//       <View style={[calendarScreenStyles.header, actualShowBackButton && styles.headerWithBackButton]}>
//         {actualShowBackButton && (
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButtonStyle}
//             accessibilityLabel="Go back"
//             accessibilityRole="button"
//           >
//             <Ionicons name="arrow-back" size={24} color="#007AFF" />
//           </TouchableOpacity>
//         )}

//         <View style={styles.headerContent}>
//           <Text style={calendarScreenStyles.title}>
//             {consumerName} - Calendar
//           </Text>

//           {/* DISTRIBUTOR INDICATOR
//           {isDistributor && (
//             <View style={styles.distributorBadge}>
//               <Ionicons name="truck-outline" size={14} color="#007AFF" />
//               <Text style={styles.distributorBadgeText}>Delivery Planning View</Text>
//             </View>
//           )} */}

//           <View style={calendarScreenStyles.monthSelector}>
//             <Text style={calendarScreenStyles.monthText}>
//               {monthNames[currentMonth]} {currentYear}
//             </Text>
//           </View>

//           {customerId !== null && (
//             <Text style={calendarScreenStyles.customerIdText}>
//               Customer ID: {customerId}
//             </Text>
//           )}
//         </View>
//       </View>

//       <ScrollView
//         style={calendarScreenStyles.content}
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             colors={[colors.primary]}
//             tintColor={colors.primary}
//           />
//         }
//       >
//         {/* CALENDAR - Both see (different data) */}
//         <View style={calendarScreenStyles.calendarContainer}>
//           <Calendar
//             style={calendarScreenStyles.calendar}
//             theme={calendarTheme}
//             onDayPress={handleDayPress}
//             onMonthChange={(month) =>
//               dispatch(setCurrentMonth({ month: month.month - 1, year: month.year }))
//             }
//             markedDates={markedDates}
//             markingType="multi-dot"
//             hideExtraDays={true}
//             disableMonthChange={false}
//             firstDay={1}
//             enableSwipeMonths={true}
//             current={`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`}
//           />
//         </View>

//         {/* LEGEND */}
//         <StatusLegend isDistributor={isDistributor} />

//         {/* SUMMARY */}
//         <MonthlySummary
//           monthlySummary={monthlySummary}
//           currentMonth={currentMonth}
//           currentYear={currentYear}
//           isDistributor={isDistributor}
//           leavesCount={leavesForCustomer.length}
//         />

//         {/* DISTRIBUTOR INFO SECTION */}
//         {isDistributor && leavesForCustomer.length > 0 && (
//           <View style={styles.distributorInfoSection}>
//             <View style={styles.distributorInfoHeader}>
//               <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
//               <Text style={styles.distributorInfoTitle}>Customer Leave Schedule</Text>
//             </View>
//             <Text style={styles.distributorInfoText}>
//               Customer has {leavesForCustomer.length} scheduled leave{leavesForCustomer.length > 1 ? 's' : ''} this month.
//               No deliveries needed on leave days.
//             </Text>
//             {leavesForCustomer.slice(0, 3).map((leave, index) => (
//               <View key={leave?.id ?? `leave-${index}`} style={styles.distributorLeaveItem}>
//                 <Ionicons name="calendar-outline" size={14} color="#9C27B0" />
//                 <Text style={styles.distributorLeaveText}>
//                   {leave?.date ?? 'N/A'} - Customer on leave
//                 </Text>
//               </View>
//             ))}
//             {leavesForCustomer.length > 3 && (
//               <Text style={styles.distributorInfoExtra}>
//                 +{leavesForCustomer.length - 3} more leave days this month
//               </Text>
//             )}
//           </View>
//         )}

//         {/* CONSUMER-ONLY SECTIONS */}
//         {!isDistributor && (
//           <>
//             {leavesForCustomer.length > 0 && (
//               <View style={calendarScreenStyles.leavesContainer}>
//                 <Text style={calendarScreenStyles.leavesTitle}>Upcoming Leaves</Text>
//                 {leavesForCustomer.map((leave, index) => (
//                   <View key={leave?.id ?? `leave-${index}`} style={calendarScreenStyles.leaveItem}>
//                     <View style={calendarScreenStyles.leaveItemContent}>
//                       <Text style={calendarScreenStyles.leaveDate}>{leave?.date ?? 'N/A'}</Text>
//                       <Text style={calendarScreenStyles.leaveReason}>
//                         {leave?.reason ?? 'No reason'} • {leave?.status ?? 'Unknown'}
//                       </Text>
//                     </View>
//                     {leave?.status !== 'cancelled' && leave?.id && leave?.date && (
//                       <TouchableOpacity
//                         style={calendarScreenStyles.leaveButton}
//                         onPress={() => handleCancelLeave(leave.id, leave.date)}
//                         accessibilityLabel={`Cancel leave for ${leave.date}`}
//                       >
//                         <Text style={calendarScreenStyles.leaveButtonText}>Cancel</Text>
//                       </TouchableOpacity>
//                     )}
//                   </View>
//                 ))}
//               </View>
//             )}

//             {milkRequestsForCustomer.length > 0 && (
//               <View style={calendarScreenStyles.leavesContainer}>
//                 <Text style={calendarScreenStyles.leavesTitle}>Extra Milk Requests</Text>
//                 {milkRequestsForCustomer.map((request, index) => (
//                   <View key={request?.id ?? `milk-${index}`} style={calendarScreenStyles.leaveItem}>
//                     <View style={calendarScreenStyles.leaveItemContent}>
//                       <Text style={calendarScreenStyles.leaveDate}>{request?.date ?? 'N/A'}</Text>
//                       <Text style={calendarScreenStyles.leaveReason}>
//                         {request?.quantity ?? 0}L - {request?.reason ?? 'No reason'} • {request?.status ?? 'Unknown'}
//                       </Text>
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             )}

//             {/* CONSUMER ACTION BUTTONS */}
//             <View style={calendarScreenStyles.actionsContainer}>
//               <TouchableOpacity
//                 style={calendarScreenStyles.actionButton}
//                 onPress={openLeaveModal}
//                 activeOpacity={0.7}
//                 accessibilityLabel="Apply for leave"
//               >
//                 <View style={calendarScreenStyles.actionIcon}>
//                   <Ionicons name="calendar-outline" size={22} color={colors.white} />
//                 </View>
//                 <View style={calendarScreenStyles.actionTextContainer}>
//                   <Text style={calendarScreenStyles.actionTitle}>Apply for Leave</Text>
//                 </View>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={calendarScreenStyles.actionButton}
//                 onPress={openExtraMilkModal}
//                 activeOpacity={0.7}
//                 accessibilityLabel="Request extra milk"
//               >
//                 <View style={calendarScreenStyles.actionIcon}>
//                   <Ionicons name="add-circle-outline" size={22} color={colors.white} />
//                 </View>
//                 <View style={calendarScreenStyles.actionTextContainer}>
//                   <Text style={calendarScreenStyles.actionTitle}>Request Extra Milk</Text>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </>
//         )}
//       </ScrollView>

//       {/* CONSUMER-ONLY MODALS */}
//       {actualViewerRole === 'consumer' && (
//         <ConsumerModals
//           viewerRole={actualViewerRole}
//           showLeaveModal={modalState.showLeaveModal}
//           showExtraMilkModal={modalState.showExtraMilkModal}
//           onCloseLeave={closeLeaveModal}
//           onCloseExtraMilk={closeExtraMilkModal}
//           onSubmitLeave={handleLeaveSubmit}
//           onSubmitExtraMilk={handleExtraMilkSubmit}
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
//   headerWithBackButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//   },
//   headerContent: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   backButtonStyle: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#F0F8FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F8F9FA',
//   },
//   distributorBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     alignSelf: 'flex-start',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     backgroundColor: '#EBF8FF',
//     borderRadius: 12,
//     marginBottom: 4,
//     borderWidth: 1,
//     borderColor: '#B3E5FC',
//   },
//   distributorBadgeText: {
//     fontSize: 12,
//     color: '#007AFF',
//     fontWeight: '600',
//     marginLeft: 4,
//   },
//   // DISTRIBUTOR INFO SECTION
//   distributorInfoSection: {
//     backgroundColor: '#F0F8FF',
//     marginHorizontal: 16,
//     marginBottom: 16,
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#B3E5FC',
//   },
//   distributorInfoHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   distributorInfoTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#007AFF',
//     marginLeft: 8,
//   },
//   distributorInfoText: {
//     fontSize: 14,
//     color: '#1C1C1E',
//     lineHeight: 20,
//     marginBottom: 12,
//   },
//   distributorLeaveItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 6,
//   },
//   distributorLeaveText: {
//     fontSize: 13,
//     color: '#9C27B0',
//     fontWeight: '500',
//     marginLeft: 8,
//   },
//   distributorInfoExtra: {
//     fontSize: 12,
//     color: '#8E8E93',
//     fontStyle: 'italic',
//     marginTop: 4,
//   },
// });

// export default React.memo(ConsumerCalendarScreen);
import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';

import { calendarScreenStyles, calendarTheme, colors } from '../../styles/CalendorScreenStyle';

import {
  fetchCalendarData,
  setCurrentMonth,
  clearError,
  LeaveItem,
  ExtraMilkItem,
  submitLeaveRequest,
  submitExtraMilk,
  cancelLeave,
} from '../../store/calendarSlice';

import { selectConsumers } from '../../store/consumersSlice';
import { checkStoredAuth } from '../../store/authSlice';

interface CalendarViewerProps {
  viewerRole?: 'consumer' | 'distributor' | 'vendor';
  targetConsumerId?: number;
  targetConsumerName?: string;
  showBackButton?: boolean;
}

type MarkedDates = Record<
  string,
  {
    selected?: boolean;
    marked?: boolean;
    selectedColor?: string;
    dotColor?: string;
    dots?: Array<{
      key: string;
      color: string;
      selectedDotColor?: string;
    }>;
  }
>;

interface LeaveRequestData {
  startDate: string;
  endDate: string;
  reason: string;
  leaveType: 'single' | 'multiple';
}

interface ExtraMilkData {
  date: string;
  quantity: number;
  milkType: 'cow' | 'buffalo' | 'mixed';
  reason: string;
}

const statusColors: Record<string, string> = {
  delivered: '#4CAF50',
  vendor_unavailable: '#F44336',
  leave: '#9C27B0',
  extra_milk: '#FFC107',
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// CONSUMER-ONLY MODALS
const ConsumerModals: React.FC<{
  showLeaveModal: boolean;
  showExtraMilkModal: boolean;
  onCloseLeave: () => void;
  onCloseExtraMilk: () => void;
  onSubmitLeave: (data: LeaveRequestData) => void;
  onSubmitExtraMilk: (data: ExtraMilkData) => void;
  viewerRole: string;
}> = React.memo(({
  showLeaveModal,
  showExtraMilkModal,
  onCloseLeave,
  onCloseExtraMilk,
  onSubmitLeave,
  onSubmitExtraMilk,
  viewerRole,
}) => {
  if (viewerRole !== 'consumer') {return null;}

  const LazyLeaveRequestModal = React.lazy(() => import('../../components/LeaveRequestModal'));
  const LazyExtraMilkModal = React.lazy(() => import('../../components/ExtraMilkModal'));

  return (
    <React.Suspense fallback={null}>
      {showLeaveModal && (
        <LazyLeaveRequestModal
          isVisible={showLeaveModal}
          onClose={onCloseLeave}
          onSubmit={onSubmitLeave}
        />
      )}

      {showExtraMilkModal && (
        <LazyExtraMilkModal
          isVisible={showExtraMilkModal}
          onClose={onCloseExtraMilk}
          onSubmit={onSubmitExtraMilk}
        />
      )}
    </React.Suspense>
  );
});

ConsumerModals.displayName = 'ConsumerModals';

// DISTRIBUTOR SEES: Delivery + Leave statuses (for delivery planning)
const StatusLegend: React.FC<{ isDistributor: boolean }> = React.memo(({ isDistributor }) => (
  <View style={calendarScreenStyles.legendContainer}>
    <Text style={calendarScreenStyles.legendTitle}>
      {isDistributor ? 'Delivery Planning Guide' : 'Status Legend'}
    </Text>
    <View style={calendarScreenStyles.legendGrid}>
      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.delivered }]} />
        <Text style={calendarScreenStyles.legendText}>
          {isDistributor ? 'Delivered' : 'Delivered'}
        </Text>
      </View>
      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.vendor_unavailable }]} />
        <Text style={calendarScreenStyles.legendText}>
          {isDistributor ? 'Unavailable' : 'Unavailable'}
        </Text>
      </View>

      {/* DISTRIBUTORS SEE LEAVES (for delivery planning) */}
      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.leave }]} />
        <Text style={calendarScreenStyles.legendText}>
          {isDistributor ? 'Customer Leave' : 'Leave'}
        </Text>
      </View>

      {/* ONLY CONSUMERS see extra milk */}
      {!isDistributor && (
        <View style={calendarScreenStyles.legendItem}>
          <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.extra_milk }]} />
          <Text style={calendarScreenStyles.legendText}>Extra Milk</Text>
        </View>
      )}
    </View>
  </View>
));

StatusLegend.displayName = 'StatusLegend';

// DISTRIBUTOR SEES: Delivery summary (no billing info)
const MonthlySummary: React.FC<{
  monthlySummary: any;
  currentMonth: number;
  currentYear: number;
  isDistributor: boolean;
  leavesCount: number;
}> = React.memo(({ monthlySummary, currentMonth, currentYear, isDistributor, leavesCount }) => {
  const formatMilkQuantity = (quantity: number | string) => {
    const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
    if (isNaN(num)) {return '0L';}
    return `${num}L`;
  };

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) {return '₹0';}
    return `₹${num}`;
  };

  return (
    <View style={calendarScreenStyles.summaryContainer}>
      <Text style={calendarScreenStyles.summaryTitle}>
        {monthNames[currentMonth]} {currentYear} - {isDistributor ? 'Delivery Summary' : 'Summary'}
      </Text>
      <View style={calendarScreenStyles.summaryGrid}>
        <View style={calendarScreenStyles.summaryItem}>
          <Ionicons name="water-outline" size={24} color={colors.primary} />
          <Text style={calendarScreenStyles.summaryValue}>
            {formatMilkQuantity(monthlySummary?.totalMilk)}
          </Text>
          <Text style={calendarScreenStyles.summaryLabel}>
            {isDistributor ? 'Total Delivered' : 'Total Milk'}
          </Text>
        </View>

        <View style={calendarScreenStyles.summaryItem}>
          <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
          <Text style={calendarScreenStyles.summaryValue}>
            {monthlySummary?.totalDeliveries || 0}
          </Text>
          <Text style={calendarScreenStyles.summaryLabel}>Deliveries</Text>
        </View>

        {/* DISTRIBUTOR SEES LEAVES (for planning) */}
        <View style={calendarScreenStyles.summaryItem}>
          <Ionicons name="calendar-outline" size={24} color={colors.danger} />
          <Text style={calendarScreenStyles.summaryValue}>{leavesCount || 0}</Text>
          <Text style={calendarScreenStyles.summaryLabel}>
            {isDistributor ? 'Customer Leaves' : 'Leaves'}
          </Text>
        </View>

        {/* ONLY CONSUMERS see billing */}
        {!isDistributor && (
          <View style={calendarScreenStyles.summaryItem}>
            <Ionicons name="receipt-outline" size={24} color={colors.success} />
            <Text style={calendarScreenStyles.summaryValue}>
              {formatCurrency(monthlySummary?.totalBill)}
            </Text>
            <Text style={calendarScreenStyles.summaryLabel}>Total Bill</Text>
          </View>
        )}
      </View>
    </View>
  );
});

MonthlySummary.displayName = 'MonthlySummary';

const ConsumerCalendarScreen: React.FC<CalendarViewerProps> = ({
  viewerRole = 'consumer',
  targetConsumerId,
  targetConsumerName,
  showBackButton = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute();

  // ROUTE PARAMS DETECTION
  const routeParams = route.params as {
    viewerRole?: 'consumer' | 'distributor' | 'vendor';
    targetConsumerId?: number;
    targetConsumerName?: string;
    showBackButton?: boolean;
  } || {};

  const actualViewerRole = routeParams.viewerRole || viewerRole;
  const actualTargetConsumerId = routeParams.targetConsumerId || targetConsumerId;
  const actualTargetConsumerName = routeParams.targetConsumerName || targetConsumerName;
  const actualShowBackButton = routeParams.showBackButton !== undefined
    ? routeParams.showBackButton
    : showBackButton;

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const consumers = useSelector(selectConsumers);

  const customerId: number | null = useMemo(() => {
    return actualTargetConsumerId || (user?.userID ? parseInt(user.userID.toString(), 10) : null);
  }, [actualTargetConsumerId, user?.userID]);

  const consumerName = useMemo(() => {
    if (actualTargetConsumerName) {return actualTargetConsumerName;}

    if (customerId && consumers?.length) {
      const consumer = consumers.find(c => c?.customer_id === customerId);
      if (consumer?.customer_name) {return consumer.customer_name;}
    }

    return user?.name || 'Consumer';
  }, [actualTargetConsumerName, customerId, consumers, user?.name]);

  const isDistributor = actualViewerRole === 'distributor';

  const {
    deliveryTypes = {},
    upcomingLeaves = {},
    upcomingMilkRequests = {},
    monthlySummary = {},
    loading = false,
    currentMonth = new Date().getMonth(),
    currentYear = new Date().getFullYear(),
  } = useSelector((state: RootState) => state.calendar);

  const [modalState, setModalState] = useState({
    showLeaveModal: false,
    showExtraMilkModal: false,
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // MODAL ACCESS CONTROL - CONSUMERS ONLY
  const handleModalToggle = useCallback((modalType: 'leave' | 'extraMilk', isOpen: boolean) => {
    if (isDistributor) {
      return; // Silent block for distributors
    }

    setModalState(prev => ({
      ...prev,
      [`show${modalType === 'leave' ? 'Leave' : 'ExtraMilk'}Modal`]: isOpen,
    }));
  }, [isDistributor]);

  const openLeaveModal = useCallback(() => handleModalToggle('leave', true), [handleModalToggle]);
  const openExtraMilkModal = useCallback(() => handleModalToggle('extraMilk', true), [handleModalToggle]);
  const closeLeaveModal = useCallback(() => handleModalToggle('leave', false), [handleModalToggle]);
  const closeExtraMilkModal = useCallback(() => handleModalToggle('extraMilk', false), [handleModalToggle]);

  useEffect(() => {
    if (isDistributor) {
      setModalState({ showLeaveModal: false, showExtraMilkModal: false });
    }
  }, [isDistributor]);

  useEffect(() => {
    dispatch(checkStoredAuth());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      if (customerId !== null && isAuthenticated) {
        const now = new Date();
        dispatch(setCurrentMonth({ month: now.getMonth(), year: now.getFullYear() }));
        const monthString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
        dispatch(fetchCalendarData({ customerId, month: monthString }));
      }
    }, [customerId, isAuthenticated, dispatch]),
  );

  // DISTRIBUTORS SEE LEAVES (for delivery planning)
  const leavesForCustomer = useMemo(() => {
    if (!customerId || !upcomingLeaves) {return [];}
    const value = upcomingLeaves[customerId];
    return Array.isArray(value) ? value : [];
  }, [upcomingLeaves, customerId]);

  // DISTRIBUTORS DON'T SEE EXTRA MILK REQUESTS
  const milkRequestsForCustomer = useMemo(() => {
    if (isDistributor || !customerId || !upcomingMilkRequests) {return [];}
    const value = upcomingMilkRequests[customerId];
    return Array.isArray(value) ? value : [];
  }, [upcomingMilkRequests, customerId, isDistributor]);

  // CALENDAR MARKERS: Distributors see delivery status + leaves
  const markedDates: MarkedDates = useMemo(() => {
    const marks: MarkedDates = {};

    // DISTRIBUTOR SEES: delivered, vendor_unavailable, leave (for planning)
    // CONSUMER SEES: delivered, vendor_unavailable, leave, extra_milk
    const allowedStatuses = isDistributor
      ? ['delivered', 'vendor_unavailable', 'leave']
      : ['delivered', 'vendor_unavailable', 'leave', 'extra_milk'];

    const allStatusesPerDate: Record<string, string[]> = {};

    // Delivery status data
    if (deliveryTypes && typeof deliveryTypes === 'object') {
      Object.entries(deliveryTypes).forEach(([date, status]) => {
        if (allowedStatuses.includes(status)) {
          if (!allStatusesPerDate[date]) {allStatusesPerDate[date] = [];}
          allStatusesPerDate[date].push(status);
        }
      });
    }

    // DISTRIBUTORS SEE LEAVES (for delivery planning)
    if (Array.isArray(leavesForCustomer)) {
      leavesForCustomer.forEach((leave: LeaveItem) => {
        if (leave?.date) {
          if (!allStatusesPerDate[leave.date]) {allStatusesPerDate[leave.date] = [];}
          allStatusesPerDate[leave.date].push('leave');
        }
      });
    }

    // CONSUMERS ONLY see extra milk requests
    if (!isDistributor && Array.isArray(milkRequestsForCustomer)) {
      milkRequestsForCustomer.forEach((request: ExtraMilkItem) => {
        if (request?.date) {
          if (!allStatusesPerDate[request.date]) {allStatusesPerDate[request.date] = [];}
          allStatusesPerDate[request.date].push('extra_milk');
        }
      });
    }

    // Delivery history data
    if (customerId && Array.isArray(consumers)) {
      const consumerData = consumers.find(c => c?.customer_id === customerId);
      if (consumerData?.deliveryHistory && Array.isArray(consumerData.deliveryHistory)) {
        consumerData.deliveryHistory.forEach(delivery => {
          if (delivery?.status === 'delivered' && delivery?.date && allowedStatuses.includes('delivered')) {
            if (!allStatusesPerDate[delivery.date]) {allStatusesPerDate[delivery.date] = [];}
            allStatusesPerDate[delivery.date].push('delivered');
          }
        });
      }
    }

    Object.entries(allStatusesPerDate).forEach(([date, statuses]) => {
      const status = allowedStatuses.find(s => statuses.includes(s));
      if (status && statusColors[status]) {
        marks[date] = {
          dots: [{
            key: `${status}-${date}`,
            color: statusColors[status],
            selectedDotColor: statusColors[status],
          }],
        };
      }
    });

    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: colors.primary,
      };
    }

    return marks;
  }, [deliveryTypes, leavesForCustomer, milkRequestsForCustomer, selectedDate, consumers, customerId, isDistributor]);

  const handleDayPress = useCallback((day: DateData) => {
    setSelectedDate(day.dateString);

    if (Array.isArray(consumers) && customerId) {
      const consumerData = consumers.find(c => c?.customer_id === customerId);
      const deliveryForDate = consumerData?.deliveryHistory?.find(d => d?.date === day.dateString);

      if (deliveryForDate) {
        const statusText = deliveryForDate.status === 'delivered' ? 'Delivered' : 'Cancelled';
        const statusIcon = deliveryForDate.status === 'delivered' ? '✅' : '❌';
        Alert.alert(
          'Delivery Status',
          `${statusIcon} Milk ${statusText.toLowerCase()} on ${day.dateString}${deliveryForDate.remarks ? `\n\nRemarks: ${deliveryForDate.remarks}` : ''}`,
          [{ text: 'OK' }]
        );
        return;
      }
    }

    if (deliveryTypes && typeof deliveryTypes === 'object') {
      const status = deliveryTypes[day.dateString];
      if (status) {
        const messages: Record<string, string> = isDistributor
          ? {
              delivered: 'Delivery completed',
              vendor_unavailable: 'Vendor unavailable',
              leave: 'Customer on leave - No delivery needed',
            }
          : {
              delivered: 'Milk delivered',
              vendor_unavailable: 'Vendor unavailable',
              leave: 'On leave',
              extra_milk: 'Extra milk requested',
            };

        if (messages[status]) {
          Alert.alert('Status', `${messages[status]} on ${day.dateString}`);
        }
      }
    }
  }, [deliveryTypes, consumers, customerId, isDistributor]);

  const onRefresh = useCallback(() => {
    if (customerId === null) {return;}

    setRefreshing(true);
    dispatch(clearError());

    const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
    dispatch(fetchCalendarData({ customerId, month: monthString }))
      .finally(() => setRefreshing(false));
  }, [customerId, currentMonth, currentYear, dispatch]);

  // CONSUMER-ONLY FUNCTIONS
  const handleLeaveSubmit = useCallback(async (leaveData: LeaveRequestData) => {
    if (isDistributor || customerId === null) {return;}

    try {
      await dispatch(submitLeaveRequest({ customerId, leaveData }));
      const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
      await dispatch(fetchCalendarData({ customerId, month: monthString }));
      Alert.alert('Success', 'Leave request submitted successfully!');
      closeLeaveModal();
    } catch (err) {
      Alert.alert('Error', typeof err === 'string' ? err : 'Failed to submit leave request');
    }
  }, [isDistributor, customerId, dispatch, currentMonth, currentYear, closeLeaveModal]);

  const handleExtraMilkSubmit = useCallback(async (extraMilkData: ExtraMilkData) => {
    if (isDistributor || customerId === null) {return;}

    try {
      await dispatch(submitExtraMilk({ customerId, milkData: extraMilkData }));
      const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
      await dispatch(fetchCalendarData({ customerId, month: monthString }));
      Alert.alert('Success', 'Extra milk request submitted successfully!');
      closeExtraMilkModal();
    } catch (err) {
      Alert.alert('Error', typeof err === 'string' ? err : 'Failed to request extra milk');
    }
  }, [isDistributor, customerId, dispatch, currentMonth, currentYear, closeExtraMilkModal]);

  const handleCancelLeave = useCallback((leaveId: string, leaveDate: string) => {
    if (isDistributor || customerId === null) {return;}

    Alert.alert('Cancel Leave', `Cancel leave for ${leaveDate}?`, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(cancelLeave({ leaveId, leaveDate, customerId }));
          const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
          dispatch(fetchCalendarData({ customerId, month: monthString }));
          Alert.alert('Success', 'Leave cancelled successfully!');
        },
      },
    ]);
  }, [isDistributor, customerId, dispatch, currentMonth, currentYear]);

  if (!isAuthenticated || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={[calendarScreenStyles.header, actualShowBackButton && styles.headerWithBackButton]}>
        {actualShowBackButton && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButtonStyle}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}

        <View style={styles.headerContent}>
          <Text style={calendarScreenStyles.title}>
            {consumerName} - Calendar
          </Text>


          <View style={calendarScreenStyles.monthSelector}>
            <Text style={calendarScreenStyles.monthText}>
              {monthNames[currentMonth]} {currentYear}
            </Text>
          </View>

          {customerId !== null && (
            <Text style={calendarScreenStyles.customerIdText}>
              Customer ID: {customerId}
            </Text>
          )}
        </View>
      </View>

      <ScrollView
        style={calendarScreenStyles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* CALENDAR - Both see (different data) */}
        <View style={calendarScreenStyles.calendarContainer}>
          <Calendar
            style={calendarScreenStyles.calendar}
            theme={calendarTheme}
            onDayPress={handleDayPress}
            onMonthChange={(month) =>
              dispatch(setCurrentMonth({ month: month.month - 1, year: month.year }))
            }
            markedDates={markedDates}
            markingType="multi-dot"
            hideExtraDays={true}
            disableMonthChange={false}
            firstDay={1}
            enableSwipeMonths={true}
            current={`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`}
          />
        </View>

        {/* LEGEND */}
        <StatusLegend isDistributor={isDistributor} />

        {/* SUMMARY */}
        <MonthlySummary
          monthlySummary={monthlySummary}
          currentMonth={currentMonth}
          currentYear={currentYear}
          isDistributor={isDistributor}
          leavesCount={leavesForCustomer.length}
        />

        {/* DISTRIBUTOR INFO SECTION */}
        {isDistributor && leavesForCustomer.length > 0 && (
          <View style={styles.distributorInfoSection}>
            <View style={styles.distributorInfoHeader}>
              <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
              <Text style={styles.distributorInfoTitle}>Customer Leave Schedule</Text>
            </View>
            <Text style={styles.distributorInfoText}>
              Customer has {leavesForCustomer.length} scheduled leave{leavesForCustomer.length > 1 ? 's' : ''} this month.
              No deliveries needed on leave days.
            </Text>
            {leavesForCustomer.slice(0, 3).map((leave, index) => (
              <View key={leave?.id ?? `leave-${index}`} style={styles.distributorLeaveItem}>
                <Ionicons name="calendar-outline" size={14} color="#9C27B0" />
                <Text style={styles.distributorLeaveText}>
                  {leave?.date ?? 'N/A'} - Customer on leave
                </Text>
              </View>
            ))}
            {leavesForCustomer.length > 3 && (
              <Text style={styles.distributorInfoExtra}>
                +{leavesForCustomer.length - 3} more leave days this month
              </Text>
            )}
          </View>
        )}

        {/* CONSUMER-ONLY SECTIONS */}
        {!isDistributor && (
          <>
            {leavesForCustomer.length > 0 && (
              <View style={calendarScreenStyles.leavesContainer}>
                <Text style={calendarScreenStyles.leavesTitle}>Upcoming Leaves</Text>
                {leavesForCustomer.map((leave, index) => (
                  <View key={leave?.id ?? `leave-${index}`} style={calendarScreenStyles.leaveItem}>
                    <View style={calendarScreenStyles.leaveItemContent}>
                      <Text style={calendarScreenStyles.leaveDate}>{leave?.date ?? 'N/A'}</Text>
                      <Text style={calendarScreenStyles.leaveReason}>
                        {leave?.reason ?? 'No reason'} • {leave?.status ?? 'Unknown'}
                      </Text>
                    </View>
                    {leave?.status !== 'cancelled' && leave?.id && leave?.date && (
                      <TouchableOpacity
                        style={calendarScreenStyles.leaveButton}
                        onPress={() => handleCancelLeave(leave.id, leave.date)}
                        accessibilityLabel={`Cancel leave for ${leave.date}`}
                      >
                        <Text style={calendarScreenStyles.leaveButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}

            {milkRequestsForCustomer.length > 0 && (
              <View style={calendarScreenStyles.leavesContainer}>
                <Text style={calendarScreenStyles.leavesTitle}>Extra Milk Requests</Text>
                {milkRequestsForCustomer.map((request, index) => (
                  <View key={request?.id ?? `milk-${index}`} style={calendarScreenStyles.leaveItem}>
                    <View style={calendarScreenStyles.leaveItemContent}>
                      <Text style={calendarScreenStyles.leaveDate}>{request?.date ?? 'N/A'}</Text>
                      <Text style={calendarScreenStyles.leaveReason}>
                        {request?.quantity ?? 0}L - {request?.reason ?? 'No reason'} • {request?.status ?? 'Unknown'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* CONSUMER ACTION BUTTONS */}
            <View style={calendarScreenStyles.actionsContainer}>
              <TouchableOpacity
                style={calendarScreenStyles.actionButton}
                onPress={openLeaveModal}
                activeOpacity={0.7}
                accessibilityLabel="Apply for leave"
              >
                <View style={calendarScreenStyles.actionIcon}>
                  <Ionicons name="calendar-outline" size={22} color={colors.white} />
                </View>
                <View style={calendarScreenStyles.actionTextContainer}>
                  <Text style={calendarScreenStyles.actionTitle}>Apply for Leave</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={calendarScreenStyles.actionButton}
                onPress={openExtraMilkModal}
                activeOpacity={0.7}
                accessibilityLabel="Request extra milk"
              >
                <View style={calendarScreenStyles.actionIcon}>
                  <Ionicons name="add-circle-outline" size={22} color={colors.white} />
                </View>
                <View style={calendarScreenStyles.actionTextContainer}>
                  <Text style={calendarScreenStyles.actionTitle}>Request Extra Milk</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* CONSUMER-ONLY MODALS */}
      {actualViewerRole === 'consumer' && (
        <ConsumerModals
          viewerRole={actualViewerRole}
          showLeaveModal={modalState.showLeaveModal}
          showExtraMilkModal={modalState.showExtraMilkModal}
          onCloseLeave={closeLeaveModal}
          onCloseExtraMilk={closeExtraMilkModal}
          onSubmitLeave={handleLeaveSubmit}
          onSubmitExtraMilk={handleExtraMilkSubmit}
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
  headerWithBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  backButtonStyle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  distributorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#EBF8FF',
    borderRadius: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#B3E5FC',
  },
  distributorBadgeText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  // DISTRIBUTOR INFO SECTION
  distributorInfoSection: {
    backgroundColor: '#F0F8FF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B3E5FC',
  },
  distributorInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  distributorInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 8,
  },
  distributorInfoText: {
    fontSize: 14,
    color: '#1C1C1E',
    lineHeight: 20,
    marginBottom: 12,
  },
  distributorLeaveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  distributorLeaveText: {
    fontSize: 13,
    color: '#9C27B0',
    fontWeight: '500',
    marginLeft: 8,
  },
  distributorInfoExtra: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default React.memo(ConsumerCalendarScreen);
