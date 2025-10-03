
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
// //   'July', 'August', 'September', 'October', 'November', 'December',
// // ];

// // // CONSUMER-ONLY MODALS
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
// //   viewerRole,
// // }) => {
// //   if (viewerRole !== 'consumer') {return null;}

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

// // // DISTRIBUTOR SEES: Delivery + Leave statuses (for delivery planning)
// // const StatusLegend: React.FC<{ isDistributor: boolean }> = React.memo(({ isDistributor }) => (
// //   <View style={calendarScreenStyles.legendContainer}>
// //     <Text style={calendarScreenStyles.legendTitle}>
// //       {isDistributor ? 'Delivery Planning Guide' : 'Status Legend'}
// //     </Text>
// //     <View style={calendarScreenStyles.legendGrid}>
// //       <View style={calendarScreenStyles.legendItem}>
// //         <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.delivered }]} />
// //         <Text style={calendarScreenStyles.legendText}>
// //           {isDistributor ? 'Delivered' : 'Delivered'}
// //         </Text>
// //       </View>
// //       <View style={calendarScreenStyles.legendItem}>
// //         <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.vendor_unavailable }]} />
// //         <Text style={calendarScreenStyles.legendText}>
// //           {isDistributor ? 'Unavailable' : 'Unavailable'}
// //         </Text>
// //       </View>

// //       {/* DISTRIBUTORS SEE LEAVES (for delivery planning) */}
// //       <View style={calendarScreenStyles.legendItem}>
// //         <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.leave }]} />
// //         <Text style={calendarScreenStyles.legendText}>
// //           {isDistributor ? 'Customer Leave' : 'Leave'}
// //         </Text>
// //       </View>

// //       {/* ONLY CONSUMERS see extra milk */}
// //       {!isDistributor && (
// //         <View style={calendarScreenStyles.legendItem}>
// //           <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.extra_milk }]} />
// //           <Text style={calendarScreenStyles.legendText}>Extra Milk</Text>
// //         </View>
// //       )}
// //     </View>
// //   </View>
// // ));

// // StatusLegend.displayName = 'StatusLegend';

// // // DISTRIBUTOR SEES: Delivery summary (no billing info)
// // const MonthlySummary: React.FC<{
// //   monthlySummary: any;
// //   currentMonth: number;
// //   currentYear: number;
// //   isDistributor: boolean;
// //   leavesCount: number;
// // }> = React.memo(({ monthlySummary, currentMonth, currentYear, isDistributor, leavesCount }) => {
// //   const formatMilkQuantity = (quantity: number | string) => {
// //     const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
// //     if (isNaN(num)) {return '0L';}
// //     return `${num}L`;
// //   };

// //   const formatCurrency = (amount: number | string) => {
// //     const num = typeof amount === 'string' ? parseFloat(amount) : amount;
// //     if (isNaN(num)) {return '₹0';}
// //     return `₹${num}`;
// //   };

// //   return (
// //     <View style={calendarScreenStyles.summaryContainer}>
// //       <Text style={calendarScreenStyles.summaryTitle}>
// //         {monthNames[currentMonth]} {currentYear} - {isDistributor ? 'Delivery Summary' : 'Summary'}
// //       </Text>
// //       <View style={calendarScreenStyles.summaryGrid}>
// //         <View style={calendarScreenStyles.summaryItem}>
// //           <Ionicons name="water-outline" size={24} color={colors.primary} />
// //           <Text style={calendarScreenStyles.summaryValue}>
// //             {formatMilkQuantity(monthlySummary?.totalMilk)}
// //           </Text>
// //           <Text style={calendarScreenStyles.summaryLabel}>
// //             {isDistributor ? 'Total Delivered' : 'Total Milk'}
// //           </Text>
// //         </View>

// //         <View style={calendarScreenStyles.summaryItem}>
// //           <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
// //           <Text style={calendarScreenStyles.summaryValue}>
// //             {monthlySummary?.totalDeliveries || 0}
// //           </Text>
// //           <Text style={calendarScreenStyles.summaryLabel}>Deliveries</Text>
// //         </View>

// //         {/* DISTRIBUTOR SEES LEAVES (for planning) */}
// //         <View style={calendarScreenStyles.summaryItem}>
// //           <Ionicons name="calendar-outline" size={24} color={colors.danger} />
// //           <Text style={calendarScreenStyles.summaryValue}>{leavesCount || 0}</Text>
// //           <Text style={calendarScreenStyles.summaryLabel}>
// //             {isDistributor ? 'Customer Leaves' : 'Leaves'}
// //           </Text>
// //         </View>

// //         {/* ONLY CONSUMERS see billing */}
// //         {!isDistributor && (
// //           <View style={calendarScreenStyles.summaryItem}>
// //             <Ionicons name="receipt-outline" size={24} color={colors.success} />
// //             <Text style={calendarScreenStyles.summaryValue}>
// //               {formatCurrency(monthlySummary?.totalBill)}
// //             </Text>
// //             <Text style={calendarScreenStyles.summaryLabel}>Total Bill</Text>
// //           </View>
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

// //   // ROUTE PARAMS DETECTION
// //   const routeParams = route.params as {
// //     viewerRole?: 'consumer' | 'distributor' | 'vendor';
// //     targetConsumerId?: number;
// //     targetConsumerName?: string;
// //     showBackButton?: boolean;
// //   } || {};

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
// //     if (actualTargetConsumerName) {return actualTargetConsumerName;}

// //     if (customerId && consumers?.length) {
// //       const consumer = consumers.find(c => c?.customer_id === customerId);
// //       if (consumer?.customer_name) {return consumer.customer_name;}
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

// //   const [modalState, setModalState] = useState({
// //     showLeaveModal: false,
// //     showExtraMilkModal: false,
// //   });
// //   const [selectedDate, setSelectedDate] = useState('');
// //   const [refreshing, setRefreshing] = useState(false);

// //   // MODAL ACCESS CONTROL - CONSUMERS ONLY
// //   const handleModalToggle = useCallback((modalType: 'leave' | 'extraMilk', isOpen: boolean) => {
// //     if (isDistributor) {
// //       return; // Silent block for distributors
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

// //   // DISTRIBUTORS SEE LEAVES (for delivery planning)
// //   const leavesForCustomer = useMemo(() => {
// //     if (!customerId || !upcomingLeaves) {return [];}
// //     const value = upcomingLeaves[customerId];
// //     return Array.isArray(value) ? value : [];
// //   }, [upcomingLeaves, customerId]);

// //   // DISTRIBUTORS DON'T SEE EXTRA MILK REQUESTS
// //   const milkRequestsForCustomer = useMemo(() => {
// //     if (isDistributor || !customerId || !upcomingMilkRequests) {return [];}
// //     const value = upcomingMilkRequests[customerId];
// //     return Array.isArray(value) ? value : [];
// //   }, [upcomingMilkRequests, customerId, isDistributor]);

// //   // CALENDAR MARKERS: Distributors see delivery status + leaves
// //   const markedDates: MarkedDates = useMemo(() => {
// //     const marks: MarkedDates = {};

// //     // DISTRIBUTOR SEES: delivered, vendor_unavailable, leave (for planning)
// //     // CONSUMER SEES: delivered, vendor_unavailable, leave, extra_milk
// //     const allowedStatuses = isDistributor
// //       ? ['delivered', 'vendor_unavailable', 'leave']
// //       : ['delivered', 'vendor_unavailable', 'leave', 'extra_milk'];

// //     const allStatusesPerDate: Record<string, string[]> = {};

// //     // Delivery status data
// //     if (deliveryTypes && typeof deliveryTypes === 'object') {
// //       Object.entries(deliveryTypes).forEach(([date, status]) => {
// //         if (allowedStatuses.includes(status)) {
// //           if (!allStatusesPerDate[date]) {allStatusesPerDate[date] = [];}
// //           allStatusesPerDate[date].push(status);
// //         }
// //       });
// //     }

// //     // DISTRIBUTORS SEE LEAVES (for delivery planning)
// //     if (Array.isArray(leavesForCustomer)) {
// //       leavesForCustomer.forEach((leave: LeaveItem) => {
// //         if (leave?.date) {
// //           if (!allStatusesPerDate[leave.date]) {allStatusesPerDate[leave.date] = [];}
// //           allStatusesPerDate[leave.date].push('leave');
// //         }
// //       });
// //     }

// //     // CONSUMERS ONLY see extra milk requests
// //     if (!isDistributor && Array.isArray(milkRequestsForCustomer)) {
// //       milkRequestsForCustomer.forEach((request: ExtraMilkItem) => {
// //         if (request?.date) {
// //           if (!allStatusesPerDate[request.date]) {allStatusesPerDate[request.date] = [];}
// //           allStatusesPerDate[request.date].push('extra_milk');
// //         }
// //       });
// //     }

// //     // Delivery history data
// //     if (customerId && Array.isArray(consumers)) {
// //       const consumerData = consumers.find(c => c?.customer_id === customerId);
// //       if (consumerData?.deliveryHistory && Array.isArray(consumerData.deliveryHistory)) {
// //         consumerData.deliveryHistory.forEach(delivery => {
// //           if (delivery?.status === 'delivered' && delivery?.date && allowedStatuses.includes('delivered')) {
// //             if (!allStatusesPerDate[delivery.date]) {allStatusesPerDate[delivery.date] = [];}
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
// //         const messages: Record<string, string> = isDistributor
// //           ? {
// //               delivered: 'Delivery completed',
// //               vendor_unavailable: 'Vendor unavailable',
// //               leave: 'Customer on leave - No delivery needed',
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
// //     if (customerId === null) {return;}

// //     setRefreshing(true);
// //     dispatch(clearError());

// //     const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
// //     dispatch(fetchCalendarData({ customerId, month: monthString }))
// //       .finally(() => setRefreshing(false));
// //   }, [customerId, currentMonth, currentYear, dispatch]);

// //   // CONSUMER-ONLY FUNCTIONS
// //   const handleLeaveSubmit = useCallback(async (leaveData: LeaveRequestData) => {
// //     if (isDistributor || customerId === null) {return;}

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
// //     if (isDistributor || customerId === null) {return;}

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
// //     if (isDistributor || customerId === null) {return;}

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
// //         },
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
// //       {/* HEADER */}
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
// //         {/* CALENDAR - Both see (different data) */}
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

// //         {/* LEGEND */}
// //         <StatusLegend isDistributor={isDistributor} />

// //         {/* SUMMARY */}
// //         <MonthlySummary
// //           monthlySummary={monthlySummary}
// //           currentMonth={currentMonth}
// //           currentYear={currentYear}
// //           isDistributor={isDistributor}
// //           leavesCount={leavesForCustomer.length}
// //         />

// //         {/* DISTRIBUTOR INFO SECTION */}
// //         {isDistributor && leavesForCustomer.length > 0 && (
// //           <View style={styles.distributorInfoSection}>
// //             <View style={styles.distributorInfoHeader}>
// //               <Ionicons name="information-circle-outline" size={20} color="#007AFF" />
// //               <Text style={styles.distributorInfoTitle}>Customer Leave Schedule</Text>
// //             </View>
// //             <Text style={styles.distributorInfoText}>
// //               Customer has {leavesForCustomer.length} scheduled leave{leavesForCustomer.length > 1 ? 's' : ''} this month.
// //               No deliveries needed on leave days.
// //             </Text>
// //             {leavesForCustomer.slice(0, 3).map((leave, index) => (
// //               <View key={leave?.id ?? `leave-${index}`} style={styles.distributorLeaveItem}>
// //                 <Ionicons name="calendar-outline" size={14} color="#9C27B0" />
// //                 <Text style={styles.distributorLeaveText}>
// //                   {leave?.date ?? 'N/A'} - Customer on leave
// //                 </Text>
// //               </View>
// //             ))}
// //             {leavesForCustomer.length > 3 && (
// //               <Text style={styles.distributorInfoExtra}>
// //                 +{leavesForCustomer.length - 3} more leave days this month
// //               </Text>
// //             )}
// //           </View>
// //         )}

// //         {/* CONSUMER-ONLY SECTIONS */}
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

// //             {/* CONSUMER ACTION BUTTONS */}
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

// //       {/* CONSUMER-ONLY MODALS */}
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
// //   // DISTRIBUTOR INFO SECTION
// //   distributorInfoSection: {
// //     backgroundColor: '#F0F8FF',
// //     marginHorizontal: 16,
// //     marginBottom: 16,
// //     padding: 16,
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: '#B3E5FC',
// //   },
// //   distributorInfoHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   distributorInfoTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#007AFF',
// //     marginLeft: 8,
// //   },
// //   distributorInfoText: {
// //     fontSize: 14,
// //     color: '#1C1C1E',
// //     lineHeight: 20,
// //     marginBottom: 12,
// //   },
// //   distributorLeaveItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 6,
// //   },
// //   distributorLeaveText: {
// //     fontSize: 13,
// //     color: '#9C27B0',
// //     fontWeight: '500',
// //     marginLeft: 8,
// //   },
// //   distributorInfoExtra: {
// //     fontSize: 12,
// //     color: '#8E8E93',
// //     fontStyle: 'italic',
// //     marginTop: 4,
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

// // ✅ UPDATED: Status colors with proper vendor_unavailable mapping
// const statusColors: Record<string, string> = {
//   delivered: '#4CAF50', // Green for delivered
//   vendor_unavailable: '#F44336', // Red for vendor/distributor unavailable
//   distributor_unavailable: '#F44336', // Red for distributor unavailable  
//   cancelled: '#FF5722', // Orange-red for regular cancelled
//   leave: '#9C27B0', // Purple for customer leave
//   extra_milk: '#FFC107', // Yellow for extra milk
//   pending: '#FF9500', // Orange for pending
// };

// const monthNames = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December',
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
//   viewerRole,
// }) => {
//   if (viewerRole !== 'consumer') {return null;}

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

// // ✅ UPDATED: Status legend with proper unavailable handling
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
      
//       {/* ✅ UPDATED: Proper unavailable legend */}
//       <View style={calendarScreenStyles.legendItem}>
//         <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.vendor_unavailable }]} />
//         <Text style={calendarScreenStyles.legendText}>
//           {isDistributor ? 'Distributor Unavailable' : 'Unavailable'}
//         </Text>
//       </View>
      
//       {/* Show cancelled as separate status if needed */}
//       <View style={calendarScreenStyles.legendItem}>
//         <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.cancelled }]} />
//         <Text style={calendarScreenStyles.legendText}>
//           {isDistributor ? 'Cancelled' : 'Cancelled'}
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
//     if (isNaN(num)) {return '0L';}
//     return `${num}L`;
//   };

//   const formatCurrency = (amount: number | string) => {
//     const num = typeof amount === 'string' ? parseFloat(amount) : amount;
//     if (isNaN(num)) {return '₹0';}
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
//     if (actualTargetConsumerName) {return actualTargetConsumerName;}

//     if (customerId && consumers?.length) {
//       const consumer = consumers.find(c => c?.customer_id === customerId);
//       if (consumer?.customer_name) {return consumer.customer_name;}
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
//     if (!customerId || !upcomingLeaves) {return [];}
//     const value = upcomingLeaves[customerId];
//     return Array.isArray(value) ? value : [];
//   }, [upcomingLeaves, customerId]);

//   // DISTRIBUTORS DON'T SEE EXTRA MILK REQUESTS
//   const milkRequestsForCustomer = useMemo(() => {
//     if (isDistributor || !customerId || !upcomingMilkRequests) {return [];}
//     const value = upcomingMilkRequests[customerId];
//     return Array.isArray(value) ? value : [];
//   }, [upcomingMilkRequests, customerId, isDistributor]);

//   // ✅ UPDATED: Calendar markers with proper vendor_unavailable handling
//   const markedDates: MarkedDates = useMemo(() => {
//     const marks: MarkedDates = {};

//     // DISTRIBUTOR SEES: delivered, vendor_unavailable, cancelled, leave (for planning)
//     // CONSUMER SEES: delivered, vendor_unavailable, cancelled, leave, extra_milk
//     const allowedStatuses = isDistributor
//       ? ['delivered', 'vendor_unavailable', 'distributor_unavailable', 'cancelled', 'leave']
//       : ['delivered', 'vendor_unavailable', 'distributor_unavailable', 'cancelled', 'leave', 'extra_milk'];

//     const allStatusesPerDate: Record<string, string[]> = {};

//     // Delivery status data
//     if (deliveryTypes && typeof deliveryTypes === 'object') {
//       Object.entries(deliveryTypes).forEach(([date, status]) => {
//         if (allowedStatuses.includes(status)) {
//           if (!allStatusesPerDate[date]) {allStatusesPerDate[date] = [];}
//           allStatusesPerDate[date].push(status);
//         }
//       });
//     }

//     // DISTRIBUTORS SEE LEAVES (for delivery planning)
//     if (Array.isArray(leavesForCustomer)) {
//       leavesForCustomer.forEach((leave: LeaveItem) => {
//         if (leave?.date) {
//           if (!allStatusesPerDate[leave.date]) {allStatusesPerDate[leave.date] = [];}
//           allStatusesPerDate[leave.date].push('leave');
//         }
//       });
//     }

//     // CONSUMERS ONLY see extra milk requests
//     if (!isDistributor && Array.isArray(milkRequestsForCustomer)) {
//       milkRequestsForCustomer.forEach((request: ExtraMilkItem) => {
//         if (request?.date) {
//           if (!allStatusesPerDate[request.date]) {allStatusesPerDate[request.date] = [];}
//           allStatusesPerDate[request.date].push('extra_milk');
//         }
//       });
//     }

//     // ✅ UPDATED: Delivery history data with proper status mapping
//     if (customerId && Array.isArray(consumers)) {
//       const consumerData = consumers.find(c => c?.customer_id === customerId);
//       if (consumerData?.deliveryHistory && Array.isArray(consumerData.deliveryHistory)) {
//         consumerData.deliveryHistory.forEach(delivery => {
//           if (delivery?.status && delivery?.date && allowedStatuses.includes(delivery.status)) {
//             if (!allStatusesPerDate[delivery.date]) {allStatusesPerDate[delivery.date] = [];}
//             allStatusesPerDate[delivery.date].push(delivery.status);
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

//   // ✅ UPDATED: Handle day press with proper status text
//   const handleDayPress = useCallback((day: DateData) => {
//     setSelectedDate(day.dateString);

//     if (Array.isArray(consumers) && customerId) {
//       const consumerData = consumers.find(c => c?.customer_id === customerId);
//       const deliveryForDate = consumerData?.deliveryHistory?.find(d => d?.date === day.dateString);

//       if (deliveryForDate) {
//         // ✅ UPDATED: Proper status text mapping
//         const getStatusText = (status: string) => {
//           switch (status) {
//             case 'delivered':
//               return 'Delivered ✅';
//             case 'vendor_unavailable':
//             case 'distributor_unavailable':
//               return 'Unavailable ❌';
//             case 'cancelled':
//               return 'Cancelled ❌';
//             default:
//               return status;
//           }
//         };

//         const statusText = getStatusText(deliveryForDate.status);
//         Alert.alert(
//           'Delivery Status',
//           `${statusText} on ${day.dateString}${deliveryForDate.remarks ? `\n\nRemarks: ${deliveryForDate.remarks}` : ''}`,
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
//               delivered: 'Delivery completed ✅',
//               vendor_unavailable: 'Distributor unavailable ❌',
//               distributor_unavailable: 'Distributor unavailable ❌',
//               cancelled: 'Delivery cancelled ❌',
//               leave: 'Customer on leave - No delivery needed 🏠',
//             }
//           : {
//               delivered: 'Milk delivered ✅',
//               vendor_unavailable: 'Vendor unavailable ❌',
//               distributor_unavailable: 'Distributor unavailable ❌',
//               cancelled: 'Delivery cancelled ❌',
//               leave: 'On leave 🏠',
//               extra_milk: 'Extra milk requested 🥛',
//             };

//         if (messages[status]) {
//           Alert.alert('Status', `${messages[status]} on ${day.dateString}`);
//         }
//       }
//     }
//   }, [deliveryTypes, consumers, customerId, isDistributor]);

//   const onRefresh = useCallback(() => {
//     if (customerId === null) {return;}

//     setRefreshing(true);
//     dispatch(clearError());

//     const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
//     dispatch(fetchCalendarData({ customerId, month: monthString }))
//       .finally(() => setRefreshing(false));
//   }, [customerId, currentMonth, currentYear, dispatch]);

//   // CONSUMER-ONLY FUNCTIONS
//   const handleLeaveSubmit = useCallback(async (leaveData: LeaveRequestData) => {
//     if (isDistributor || customerId === null) {return;}

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
//     if (isDistributor || customerId === null) {return;}

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
//     if (isDistributor || customerId === null) {return;}

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
//         },
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

// ✅ SIMPLE: Just the essential status colors
const statusColors: Record<string, string> = {
  delivered: '#4CAF50', // Green
  vendor_unavailable: '#F44336', // Red
  distributor_unavailable: '#F44336', // Red
  cancelled: '#FF5722', // Orange-red
  leave: '#9C27B0', // Purple
  extra_milk: '#FFC107', // Yellow
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

// ✅ SIMPLE: Clean legend
const StatusLegend: React.FC<{ isDistributor: boolean }> = React.memo(({ isDistributor }) => (
  <View style={calendarScreenStyles.legendContainer}>
    <Text style={calendarScreenStyles.legendTitle}>
      {isDistributor ? 'My Delivery Record' : 'Status Legend'}
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
      
      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.cancelled }]} />
        <Text style={calendarScreenStyles.legendText}>Cancelled</Text>
      </View>

      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.leave }]} />
        <Text style={calendarScreenStyles.legendText}>
          {isDistributor ? 'Customer Leave' : 'Leave'}
        </Text>
      </View>

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

// ✅ SIMPLE: Basic summary
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

        <View style={calendarScreenStyles.summaryItem}>
          <Ionicons name="calendar-outline" size={24} color={colors.danger} />
          <Text style={calendarScreenStyles.summaryValue}>{leavesCount || 0}</Text>
          <Text style={calendarScreenStyles.summaryLabel}>
            {isDistributor ? 'Customer Leaves' : 'Leaves'}
          </Text>
        </View>

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

  const handleModalToggle = useCallback((modalType: 'leave' | 'extraMilk', isOpen: boolean) => {
    if (isDistributor) {
      return;
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

  const leavesForCustomer = useMemo(() => {
    if (!customerId || !upcomingLeaves) {return [];}
    const value = upcomingLeaves[customerId];
    return Array.isArray(value) ? value : [];
  }, [upcomingLeaves, customerId]);

  const milkRequestsForCustomer = useMemo(() => {
    if (isDistributor || !customerId || !upcomingMilkRequests) {return [];}
    const value = upcomingMilkRequests[customerId];
    return Array.isArray(value) ? value : [];
  }, [upcomingMilkRequests, customerId, isDistributor]);

  // ✅ SIMPLE: Just show delivery history dots - already working perfectly!
  const markedDates: MarkedDates = useMemo(() => {
    const marks: MarkedDates = {};

    const allowedStatuses = isDistributor
      ? ['delivered', 'vendor_unavailable', 'distributor_unavailable', 'cancelled', 'leave']
      : ['delivered', 'vendor_unavailable', 'distributor_unavailable', 'cancelled', 'leave', 'extra_milk'];

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

    // Customer leaves
    if (Array.isArray(leavesForCustomer)) {
      leavesForCustomer.forEach((leave: LeaveItem) => {
        if (leave?.date) {
          if (!allStatusesPerDate[leave.date]) {allStatusesPerDate[leave.date] = [];}
          allStatusesPerDate[leave.date].push('leave');
        }
      });
    }

    // Extra milk (consumers only)
    if (!isDistributor && Array.isArray(milkRequestsForCustomer)) {
      milkRequestsForCustomer.forEach((request: ExtraMilkItem) => {
        if (request?.date) {
          if (!allStatusesPerDate[request.date]) {allStatusesPerDate[request.date] = [];}
          allStatusesPerDate[request.date].push('extra_milk');
        }
      });
    }

    // ✅ PERFECT: Delivery history from consumers data (this is what shows the distributor's delivery record!)
    if (customerId && Array.isArray(consumers)) {
      const consumerData = consumers.find(c => c?.customer_id === customerId);
      if (consumerData?.deliveryHistory && Array.isArray(consumerData.deliveryHistory)) {
        consumerData.deliveryHistory.forEach(delivery => {
          if (delivery?.status && delivery?.date && allowedStatuses.includes(delivery.status)) {
            if (!allStatusesPerDate[delivery.date]) {allStatusesPerDate[delivery.date] = [];}
            allStatusesPerDate[delivery.date].push(delivery.status);
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
        const getStatusText = (status: string) => {
          switch (status) {
            case 'delivered':
              return isDistributor ? 'You delivered successfully ✅' : 'Delivered ✅';
            case 'vendor_unavailable':
            case 'distributor_unavailable':
              return isDistributor ? 'You were unavailable ❌' : 'Unavailable ❌';
            case 'cancelled':
              return isDistributor ? 'You cancelled delivery ❌' : 'Cancelled ❌';
            default:
              return status;
          }
        };

        const statusText = getStatusText(deliveryForDate.status);
        Alert.alert(
          'Delivery Status',
          `${statusText} on ${day.dateString}${deliveryForDate.remarks ? `\n\nRemarks: ${deliveryForDate.remarks}` : ''}`,
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
              delivered: 'You delivered successfully ✅',
              vendor_unavailable: 'You were unavailable ❌',
              distributor_unavailable: 'You were unavailable ❌',
              cancelled: 'You cancelled delivery ❌',
              leave: 'Customer was on leave 🏠',
            }
          : {
              delivered: 'Milk delivered ✅',
              vendor_unavailable: 'Vendor unavailable ❌',
              distributor_unavailable: 'Distributor unavailable ❌',
              cancelled: 'Delivery cancelled ❌',
              leave: 'On leave 🏠',
              extra_milk: 'Extra milk requested 🥛',
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
        {/* ✅ PERFECT: Calendar with delivery tracking dots */}
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
});

export default React.memo(ConsumerCalendarScreen);
