

// import React, { useEffect, useCallback, useMemo, useState } from 'react';
// import { useFocusEffect } from '@react-navigation/native';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import { Calendar, DateData } from 'react-native-calendars';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useSelector, useDispatch } from 'react-redux';
// import type { RootState, AppDispatch } from '../../store';

// import LeaveRequestModal from '../../components/LeaveRequestModal';
// import ExtraMilkModal from '../../components/ExtraMilkModal';

// import { calendarScreenStyles, calendarTheme, colors } from '../../styles/CalendorScreenStyle';

// import {
//   fetchCalendarData,
//   submitLeaveRequest,
//   submitExtraMilk,
//   setCurrentMonth,
//   clearError,
//   cancelLeave,
//   LeaveItem,
//   ExtraMilkItem,
// } from '../../store/calendarSlice';

// import { checkStoredAuth } from '../../store/authSlice';

// type MarkedDates = Record<
//   string,
//   {
//     selected?: boolean;
//     marked?: boolean;
//     selectedColor?: string;
//     dotColor?: string;
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
//   missed: '#2196F3',
//   not_requested: '#FF9800',
//   vendor_unavailable: '#F44336',
//   customer_paused: '#9C27B0',
//   extra_milk: '#FFC107',
//   leave: '#9C27B0',
// };

// const ConsumerCalendarScreen: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
//   const customerId: number | null = user?.userID ? parseInt(user.userID.toString(), 10) : null;

//   const {
//     calendarData,
//     deliveryTypes,
//     upcomingLeaves,
//     upcomingMilkRequests,
//     monthlySummary,
//     loading,
//     error,
//     currentMonth,
//     currentYear,
//   } = useSelector((state: RootState) => state.calendar);

//   const [showLeaveModal, setShowLeaveModal] = useState(false);
//   const [showExtraMilkModal, setShowExtraMilkModal] = useState(false);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [refreshing, setRefreshing] = useState(false);

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

//   // Memoize filtered leaves for current customer safely
// const leavesForCustomer = useMemo(() => {
//   if (!customerId || !upcomingLeaves) {return [];}
//   const value = upcomingLeaves[customerId];
//   return Array.isArray(value) ? value : [];
// }, [upcomingLeaves, customerId]);

//   // Memoize filtered milk requests for current customer safely
//   const milkRequestsForCustomer = useMemo(() => {
//   if (!customerId || !upcomingMilkRequests) {return [];}
//   const value = upcomingMilkRequests[customerId];
//   return Array.isArray(value) ? value : [];
// }, [upcomingMilkRequests, customerId]);

//   const markedDates: MarkedDates = useMemo(() => {
//     const marks: MarkedDates = {};

//     Object.entries(calendarData).forEach(([date, mark]) => {
//       marks[date] = { ...mark };
//     });

//     Object.entries(deliveryTypes).forEach(([date, status]) => {
//       if (!marks[date] && statusColors[status]) {
//         marks[date] = {
//           marked: true,
//           dotColor: statusColors[status],
//         };
//       }
//     });

//     leavesForCustomer.forEach((leave: LeaveItem) => {
//       marks[leave.date] = {
//         ...(marks[leave.date] || {}),
//         marked: true,
//         dotColor: statusColors.leave,
//       };
//     });

//     milkRequestsForCustomer.forEach((request: ExtraMilkItem) => {
//       marks[request.date] = {
//         ...(marks[request.date] || {}),
//         marked: true,
//         dotColor: statusColors.extra_milk,
//       };
//     });

//     if (selectedDate) {
//       marks[selectedDate] = {
//         ...(marks[selectedDate] || {}),
//         selected: true,
//         selectedColor: colors.primary,
//       };
//     }

//     return marks;
//   }, [calendarData, deliveryTypes, leavesForCustomer, milkRequestsForCustomer, selectedDate]);

//   const handleDayPress = useCallback(
//     (day: DateData) => {
//       setSelectedDate(day.dateString);
//       const status = deliveryTypes[day.dateString];
//       if (status) {
//         const messages: Record<string, string> = {
//           delivered: 'Milk delivered',
//           missed: 'Delivery missed',
//           not_requested: 'Not requested',
//           vendor_unavailable: 'Vendor unavailable',
//           customer_paused: 'Customer on leave',
//           extra_milk: 'Extra milk requested',
//           leave: 'On leave',
//         };
//         Alert.alert('Status', `${messages[status] ?? 'Unknown'} on ${day.dateString}`);
//       }
//     },
//     [deliveryTypes],
//   );

//   const onRefresh = useCallback(() => {
//     if (customerId === null) {return;}
//     setRefreshing(true);
//     dispatch(clearError());
//     const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
//     dispatch(fetchCalendarData({ customerId, month: monthString })).finally(() =>
//       setRefreshing(false),
//     );
//   }, [customerId, currentMonth, currentYear, dispatch]);

//   const handleLeaveSubmit = useCallback(
//     async (leaveData: LeaveRequestData) => {
//       if (customerId === null) {
//         Alert.alert('Error', 'Customer ID not found');
//         return;
//       }
//       try {
//         await dispatch(submitLeaveRequest({ customerId, leaveData })).unwrap();
//         Alert.alert('Success', 'Leave request submitted successfully!');
//         setShowLeaveModal(false);
//       } catch (err) {
//         Alert.alert('Error', (err as string) || 'Failed to submit leave request');
//       }
//     },
//     [dispatch, customerId],
//   );

//   const handleExtraMilkSubmit = useCallback(
//     async (extraMilkData: ExtraMilkData) => {
//       if (customerId === null) {
//         Alert.alert('Error', 'Customer ID not found');
//         return;
//       }
//       try {
//         await dispatch(submitExtraMilk({ customerId, milkData: extraMilkData })).unwrap();
//         Alert.alert('Success', 'Extra milk request submitted successfully!');
//         setShowExtraMilkModal(false);
//       } catch (err) {
//         Alert.alert('Error', (err as string) || 'Failed to request extra milk');
//       }
//     },
//     [dispatch, customerId],
//   );

//   const handleCancelLeave = useCallback(
//     (leaveId: string, leaveDate: string) => {
//       Alert.alert('Cancel Leave', `Cancel leave for ${leaveDate}?`, [
//         {
//           text: 'Yes, Cancel',
//           style: 'destructive',
//           onPress: () => {
//             if (customerId !== null) {
//               dispatch(cancelLeave({ leaveId, leaveDate, customerId }));
//               Alert.alert('Success', 'Leave cancelled successfully!');
//             }
//           },
//         },
//         { text: 'No', style: 'cancel' },
//       ]);
//     },
//     [dispatch, customerId],
//   );

//   const monthNames = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
//     'July',
//     'August',
//     'September',
//     'October',
//     'November',
//     'December',
//   ];

//   if (!isAuthenticated) {
//     return (
//       <View style={calendarScreenStyles.loadingContainer}>
//         <Text>Please login to view your calendar</Text>
//       </View>
//     );
//   }

//   if (loading && !refreshing) {
//     return (
//       <View style={calendarScreenStyles.loadingContainer}>
//         <ActivityIndicator size="large" color={colors.primary} />
//         <Text>Loading calendar...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={calendarScreenStyles.container}>
//       <View style={calendarScreenStyles.header}>
//         <Text style={calendarScreenStyles.title}>Milkyway Calendar</Text>
//         <View style={calendarScreenStyles.monthSelector}>
//           <Text style={calendarScreenStyles.monthText}>
//             {monthNames[currentMonth]} {currentYear}
//           </Text>
//         </View>
//         {customerId !== null && (
//           <Text style={calendarScreenStyles.customerIdText}>Customer ID: {customerId}</Text>
//         )}
//       </View>

//       {error && (
//         <View style={calendarScreenStyles.errorContainer}>
//           <Text style={calendarScreenStyles.errorText}>{error}</Text>
//           <TouchableOpacity
//             style={calendarScreenStyles.retryButton}
//             onPress={() => dispatch(clearError())}
//           >
//             <Text style={calendarScreenStyles.retryButtonText}>Dismiss</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       <ScrollView
//         style={calendarScreenStyles.content}
//         contentContainerStyle={calendarScreenStyles.scrollContainer}
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
//         <View style={calendarScreenStyles.calendarContainer}>
//           <Calendar
//             style={calendarScreenStyles.calendar}
//             theme={calendarTheme}
//             onDayPress={handleDayPress}
//             onMonthChange={(month) =>
//               dispatch(setCurrentMonth({ month: month.month - 1, year: month.year }))
//             }
//             markedDates={markedDates}
//             markingType="dot"
//             hideExtraDays
//             disableMonthChange={false}
//             firstDay={1}
//             enableSwipeMonths
//             current={`${currentYear}-${(currentMonth + 1)
//               .toString()
//               .padStart(2, '0')}-01`}
//           />
//         </View>

//         <View style={calendarScreenStyles.legendContainer}>
//           <Text style={calendarScreenStyles.legendTitle}>Status Legend</Text>
//           <View style={calendarScreenStyles.legendGrid}>
//             <View style={calendarScreenStyles.legendItem}>
//               <View
//                 style={[calendarScreenStyles.legendDot, calendarScreenStyles.deliveredDot]}
//               />
//               <Text style={calendarScreenStyles.legendText}>Delivered</Text>
//             </View>
//             <View style={calendarScreenStyles.legendItem}>
//               <View style={[calendarScreenStyles.legendDot, calendarScreenStyles.missedDot]} />
//               <Text style={calendarScreenStyles.legendText}>Missed</Text>
//             </View>
//             <View style={calendarScreenStyles.legendItem}>
//               <View
//                 style={[calendarScreenStyles.legendDot, calendarScreenStyles.notRequestedDot]}
//               />
//               <Text style={calendarScreenStyles.legendText}>Not Requested</Text>
//             </View>
//             <View style={calendarScreenStyles.legendItem}>
//               <View
//                 style={[calendarScreenStyles.legendDot, calendarScreenStyles.vendorUnavailableDot]}
//               />
//               <Text style={calendarScreenStyles.legendText}>Vendor Unavailable</Text>
//             </View>
//             <View style={calendarScreenStyles.legendItem}>
//               <View style={[calendarScreenStyles.legendDot, calendarScreenStyles.leaveDot]} />
//               <Text style={calendarScreenStyles.legendText}>Leave</Text>
//             </View>
//             <View style={calendarScreenStyles.legendItem}>
//               <View style={[calendarScreenStyles.legendDot, calendarScreenStyles.extraMilkDot]} />
//               <Text style={calendarScreenStyles.legendText}>Extra Milk</Text>
//             </View>
//           </View>
//         </View>

//         <View style={calendarScreenStyles.summaryContainer}>
//           <Text style={calendarScreenStyles.summaryTitle}>
//             {monthNames[currentMonth]} {currentYear} Summary
//           </Text>
//           <View style={calendarScreenStyles.summaryGrid}>
//             <View style={calendarScreenStyles.summaryItem}>
//               <Ionicons name="water-outline" size={24} color={colors.primary} />
//               <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalMilk}</Text>
//               <Text style={calendarScreenStyles.summaryLabel}>Total Milk</Text>
//             </View>
//             <View style={calendarScreenStyles.summaryItem}>
//               <Ionicons name="receipt-outline" size={24} color={colors.success} />
//               <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalBill}</Text>
//               <Text style={calendarScreenStyles.summaryLabel}>Total Bill</Text>
//             </View>
//             <View style={calendarScreenStyles.summaryItem}>
//               <Ionicons name="calendar-outline" size={24} color={colors.danger} />
//               <Text style={calendarScreenStyles.summaryValue}>{leavesForCustomer.length}</Text>
//               <Text style={calendarScreenStyles.summaryLabel}>Total Leaves</Text>
//             </View>
//             <View style={calendarScreenStyles.summaryItem}>
//               <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
//               <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalDeliveries}</Text>
//               <Text style={calendarScreenStyles.summaryLabel}>Deliveries</Text>
//             </View>
//           </View>
//         </View>

//         <View style={calendarScreenStyles.leavesContainer}>
//           <Text style={calendarScreenStyles.leavesTitle}>Upcoming Leaves</Text>
//           {leavesForCustomer.length === 0 ? (
//             <Text style={calendarScreenStyles.noLeavesText}>No upcoming leaves</Text>
//           ) : (
//             leavesForCustomer.map((leave) => (
//               <View key={leave.id} style={calendarScreenStyles.leaveItem}>
//                 <View style={calendarScreenStyles.leaveItemContent}>
//                   <Text style={calendarScreenStyles.leaveDate}>{leave.date}</Text>
//                   <Text style={calendarScreenStyles.leaveReason}>
//                     {leave.reason} • {leave.status}
//                   </Text>
//                 </View>
//                 {leave.status !== 'cancelled' && (
//                   <TouchableOpacity
//                     style={calendarScreenStyles.leaveButton}
//                     onPress={() => handleCancelLeave(leave.id, leave.date)}
//                   >
//                     <Text style={calendarScreenStyles.leaveButtonText}>Cancel</Text>
//                   </TouchableOpacity>
//                 )}
//               </View>
//             ))
//           )}
//         </View>

//         <View style={calendarScreenStyles.leavesContainer}>
//           <Text style={calendarScreenStyles.leavesTitle}>Extra Milk Requests</Text>
//           {milkRequestsForCustomer.length === 0 ? (
//             <Text style={calendarScreenStyles.noLeavesText}>No extra milk requests</Text>
//           ) : (
//             milkRequestsForCustomer.map((request) => (
//               <View key={request.id} style={calendarScreenStyles.leaveItem}>
//                 <View style={calendarScreenStyles.leaveItemContent}>
//                   <Text style={calendarScreenStyles.leaveDate}>{request.date}</Text>
//                   <Text style={calendarScreenStyles.leaveReason}>
//                     {request.quantity}L - {request.reason} • {request.status}
//                   </Text>
//                 </View>
//               </View>
//             ))
//           )}
//         </View>

//         <View style={calendarScreenStyles.actionsContainer}>
//           <Text style={calendarScreenStyles.actionsTitle}>Quick Actions</Text>
//           <TouchableOpacity
//             style={calendarScreenStyles.actionButton}
//             onPress={() => setShowLeaveModal(true)}
//             activeOpacity={0.7}
//           >
//             <View style={calendarScreenStyles.actionIcon}>
//               <Ionicons name="calendar-outline" size={22} color={colors.white} />
//             </View>
//             <View style={calendarScreenStyles.actionTextContainer}>
//               <Text style={calendarScreenStyles.actionTitle}>Apply for Leave</Text>
//             </View>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[calendarScreenStyles.actionButton, calendarScreenStyles.actionButton]}
//             onPress={() => setShowExtraMilkModal(true)}
//             activeOpacity={0.7}
//           >
//             <View style={calendarScreenStyles.actionIcon}>
//               <Ionicons name="add-circle-outline" size={22} color={colors.white} />
//             </View>
//             <View style={calendarScreenStyles.actionTextContainer}>
//               <Text style={calendarScreenStyles.actionTitle}>Request Extra Milk</Text>
//             </View>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       <LeaveRequestModal
//         isVisible={showLeaveModal}
//         onClose={() => setShowLeaveModal(false)}
//         onSubmit={handleLeaveSubmit}
//       />
//       <ExtraMilkModal
//         isVisible={showExtraMilkModal}
//         onClose={() => setShowExtraMilkModal(false)}
//         onSubmit={handleExtraMilkSubmit}
//       />
//     </View>
//   );
// };

// export default ConsumerCalendarScreen;

import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../store';

import LeaveRequestModal from '../../components/LeaveRequestModal';
import ExtraMilkModal from '../../components/ExtraMilkModal';

import { calendarScreenStyles, calendarTheme, colors } from '../../styles/CalendorScreenStyle';

import {
  fetchCalendarData,
  submitLeaveRequest,
  submitExtraMilk,
  setCurrentMonth,
  clearError,
  cancelLeave,
  LeaveItem,
  ExtraMilkItem,
} from '../../store/calendarSlice';

// ✅ ADD: Import consumers slice selectors
import { selectConsumers } from '../../store/consumersSlice';

import { checkStoredAuth } from '../../store/authSlice';

// ✅ ENHANCED: Updated MarkedDates type to support multi-dot
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
  missed: '#2196F3',
  not_requested: '#FF9800',
  vendor_unavailable: '#F44336',
  customer_paused: '#9C27B0',
  extra_milk: '#FFC107',
  leave: '#9C27B0',
  // ✅ ADD: Delivery status colors from distributor actions
  delivery_delivered: '#34C759',  // Green for delivered
  delivery_cancelled: '#FF3B30',  // Red for cancelled
};

const ConsumerCalendarScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const customerId: number | null = user?.userID ? parseInt(user.userID.toString(), 10) : null;

  const {
    calendarData,
    deliveryTypes,
    upcomingLeaves,
    upcomingMilkRequests,
    monthlySummary,
    loading,
    error,
    currentMonth,
    currentYear,
  } = useSelector((state: RootState) => state.calendar);

  // ✅ ADD: Get delivery status data from consumers slice
  const consumers = useSelector(selectConsumers);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showExtraMilkModal, setShowExtraMilkModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);

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

  // Memoize filtered leaves for current customer safely
  const leavesForCustomer = useMemo(() => {
    if (!customerId || !upcomingLeaves) { return []; }
    const value = upcomingLeaves[customerId];
    return Array.isArray(value) ? value : [];
  }, [upcomingLeaves, customerId]);

  // Memoize filtered milk requests for current customer safely
  const milkRequestsForCustomer = useMemo(() => {
    if (!customerId || !upcomingMilkRequests) { return []; }
    const value = upcomingMilkRequests[customerId];
    return Array.isArray(value) ? value : [];
  }, [upcomingMilkRequests, customerId]);

  // ✅ ADD: Get delivery dots for this consumer from distributor actions
  const deliveryDots = useMemo(() => {
    const dots: { [key: string]: any } = {};

    if (!customerId) {return dots;}

    // Find this consumer's data
    const consumerData = consumers.find(c => c.customer_id === customerId);

    if (!consumerData) {return dots;}

    // Process delivery history for this consumer
    if (consumerData.deliveryHistory) {
      consumerData.deliveryHistory.forEach(delivery => {
        if (!dots[delivery.date]) {
          dots[delivery.date] = { dots: [] };
        }

        dots[delivery.date].dots.push({
          key: `delivery-${customerId}-${delivery.status}`,
          color: delivery.status === 'delivered' ? statusColors.delivery_delivered : statusColors.delivery_cancelled,
          selectedDotColor: delivery.status === 'delivered' ? statusColors.delivery_delivered : statusColors.delivery_cancelled,
        });
      });
    }

    return dots;
  }, [consumers, customerId]);

  // ✅ ENHANCED: Updated markedDates with delivery status integration
  const markedDates: MarkedDates = useMemo(() => {
    const marks: MarkedDates = {};

    // Existing calendar data
    Object.entries(calendarData).forEach(([date, mark]) => {
      marks[date] = { ...mark };
    });

    // Existing delivery types as dots
    Object.entries(deliveryTypes).forEach(([date, status]) => {
      if (!marks[date] && statusColors[status]) {
        marks[date] = {
          dots: [{
            key: `status-${status}`,
            color: statusColors[status],
            selectedDotColor: statusColors[status],
          }],
        };
      } else if (marks[date] && statusColors[status]) {
        if (!marks[date].dots) {
          marks[date].dots = [];
        }
        marks[date].dots!.push({
          key: `status-${status}`,
          color: statusColors[status],
          selectedDotColor: statusColors[status],
        });
      }
    });

    // Leave dots
    leavesForCustomer.forEach((leave: LeaveItem) => {
      if (!marks[leave.date]) {
        marks[leave.date] = {
          dots: [{
            key: 'leave',
            color: statusColors.leave,
            selectedDotColor: statusColors.leave,
          }],
        };
      } else {
        if (!marks[leave.date].dots) {
          marks[leave.date].dots = [];
        }
        marks[leave.date].dots!.push({
          key: 'leave',
          color: statusColors.leave,
          selectedDotColor: statusColors.leave,
        });
      }
    });

    // Extra milk dots
    milkRequestsForCustomer.forEach((request: ExtraMilkItem) => {
      if (!marks[request.date]) {
        marks[request.date] = {
          dots: [{
            key: 'extra_milk',
            color: statusColors.extra_milk,
            selectedDotColor: statusColors.extra_milk,
          }],
        };
      } else {
        if (!marks[request.date].dots) {
          marks[request.date].dots = [];
        }
        marks[request.date].dots!.push({
          key: 'extra_milk',
          color: statusColors.extra_milk,
          selectedDotColor: statusColors.extra_milk,
        });
      }
    });

    // ✅ ADD: Merge delivery dots from distributor actions
    Object.keys(deliveryDots).forEach(date => {
      if (!marks[date]) {
        marks[date] = { ...deliveryDots[date] };
      } else {
        const existingDots = marks[date].dots || [];
        const newDeliveryDots = deliveryDots[date].dots || [];

        marks[date] = {
          ...marks[date],
          dots: [...existingDots, ...newDeliveryDots],
        };
      }
    });

    // Selected date styling
    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: colors.primary,
      };
    }

    return marks;
  }, [calendarData, deliveryTypes, leavesForCustomer, milkRequestsForCustomer, selectedDate, deliveryDots]);

  // ✅ ENHANCED: Updated handleDayPress to show delivery status
  const handleDayPress = useCallback(
    (day: DateData) => {
      setSelectedDate(day.dateString);

      // Check for delivery status first
      const consumerData = consumers.find(c => c.customer_id === customerId);
      const deliveryForDate = consumerData?.deliveryHistory?.find(d => d.date === day.dateString);

      if (deliveryForDate) {
        const statusText = deliveryForDate.status === 'delivered' ? 'Delivered' : 'Cancelled';
        const statusIcon = deliveryForDate.status === 'delivered' ? '✅' : '❌';
        Alert.alert(
          'Delivery Status',
          `${statusIcon} Milk ${statusText.toLowerCase()} on ${day.dateString}\n\nRemarks: ${deliveryForDate.remarks || 'No remarks'}`,
          [{ text: 'OK' }]
        );
        return;
      }

      // Existing status check
      const status = deliveryTypes[day.dateString];
      if (status) {
        const messages: Record<string, string> = {
          delivered: 'Milk delivered',
          missed: 'Delivery missed',
          not_requested: 'Not requested',
          vendor_unavailable: 'Vendor unavailable',
          customer_paused: 'Customer on leave',
          extra_milk: 'Extra milk requested',
          leave: 'On leave',
        };
        Alert.alert('Status', `${messages[status] ?? 'Unknown'} on ${day.dateString}`);
      }
    },
    [deliveryTypes, consumers, customerId],
  );

  const onRefresh = useCallback(() => {
    if (customerId === null) { return; }
    setRefreshing(true);
    dispatch(clearError());
    const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
    dispatch(fetchCalendarData({ customerId, month: monthString })).finally(() =>
      setRefreshing(false),
    );
  }, [customerId, currentMonth, currentYear, dispatch]);

  const handleLeaveSubmit = useCallback(
    async (leaveData: LeaveRequestData) => {
      if (customerId === null) {
        Alert.alert('Error', 'Customer ID not found');
        return;
      }
      try {
        await dispatch(submitLeaveRequest({ customerId, leaveData })).unwrap();
        Alert.alert('Success', 'Leave request submitted successfully!');
        setShowLeaveModal(false);
      } catch (err) {
        Alert.alert('Error', (err as string) || 'Failed to submit leave request');
      }
    },
    [dispatch, customerId],
  );

  const handleExtraMilkSubmit = useCallback(
    async (extraMilkData: ExtraMilkData) => {
      if (customerId === null) {
        Alert.alert('Error', 'Customer ID not found');
        return;
      }
      try {
        await dispatch(submitExtraMilk({ customerId, milkData: extraMilkData })).unwrap();
        Alert.alert('Success', 'Extra milk request submitted successfully!');
        setShowExtraMilkModal(false);
      } catch (err) {
        Alert.alert('Error', (err as string) || 'Failed to request extra milk');
      }
    },
    [dispatch, customerId],
  );

  const handleCancelLeave = useCallback(
    (leaveId: string, leaveDate: string) => {
      Alert.alert('Cancel Leave', `Cancel leave for ${leaveDate}?`, [
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            if (customerId !== null) {
              dispatch(cancelLeave({ leaveId, leaveDate, customerId }));
              Alert.alert('Success', 'Leave cancelled successfully!');
            }
          },
        },
        { text: 'No', style: 'cancel' },
      ]);
    },
    [dispatch, customerId],
  );

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  if (!isAuthenticated) {
    return (
      <View style={calendarScreenStyles.loadingContainer}>
        <Text>Please login to view your calendar</Text>
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={calendarScreenStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Loading calendar...</Text>
      </View>
    );
  }

  return (
    <View style={calendarScreenStyles.container}>
      <View style={calendarScreenStyles.header}>
        <Text style={calendarScreenStyles.title}>Milkyway Calendar</Text>
        <View style={calendarScreenStyles.monthSelector}>
          <Text style={calendarScreenStyles.monthText}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
        </View>
        {customerId !== null && (
          <Text style={calendarScreenStyles.customerIdText}>Customer ID: {customerId}</Text>
        )}
      </View>

      {error && (
        <View style={calendarScreenStyles.errorContainer}>
          <Text style={calendarScreenStyles.errorText}>{error}</Text>
          <TouchableOpacity
            style={calendarScreenStyles.retryButton}
            onPress={() => dispatch(clearError())}
          >
            <Text style={calendarScreenStyles.retryButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        style={calendarScreenStyles.content}
        contentContainerStyle={calendarScreenStyles.scrollContainer}
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
        <View style={calendarScreenStyles.calendarContainer}>
          <Calendar
            style={calendarScreenStyles.calendar}
            theme={calendarTheme}
            onDayPress={handleDayPress}
            onMonthChange={(month) =>
              dispatch(setCurrentMonth({ month: month.month - 1, year: month.year }))
            }
            markedDates={markedDates}
            markingType="multi-dot" // ✅ CHANGED: Enable multi-dot marking
            hideExtraDays
            disableMonthChange={false}
            firstDay={1}
            enableSwipeMonths
            current={`${currentYear}-${(currentMonth + 1)
              .toString()
              .padStart(2, '0')}-01`}
          />
        </View>

        {/* ✅ ENHANCED: Updated legend with delivery status */}
        <View style={calendarScreenStyles.legendContainer}>
          <Text style={calendarScreenStyles.legendTitle}>Status Legend</Text>
          <View style={calendarScreenStyles.legendGrid}>
            <View style={calendarScreenStyles.legendItem}>
              <View
                style={[calendarScreenStyles.legendDot, calendarScreenStyles.deliveredDot]}
              />
              <Text style={calendarScreenStyles.legendText}>Delivered</Text>
            </View>
            <View style={calendarScreenStyles.legendItem}>
              <View style={[calendarScreenStyles.legendDot, calendarScreenStyles.missedDot]} />
              <Text style={calendarScreenStyles.legendText}>Missed</Text>
            </View>
            <View style={calendarScreenStyles.legendItem}>
              <View
                style={[calendarScreenStyles.legendDot, calendarScreenStyles.notRequestedDot]}
              />
              <Text style={calendarScreenStyles.legendText}>Not Requested</Text>
            </View>
            <View style={calendarScreenStyles.legendItem}>
              <View
                style={[calendarScreenStyles.legendDot, calendarScreenStyles.vendorUnavailableDot]}
              />
              <Text style={calendarScreenStyles.legendText}>Vendor Unavailable</Text>
            </View>
            <View style={calendarScreenStyles.legendItem}>
              <View style={[calendarScreenStyles.legendDot, calendarScreenStyles.leaveDot]} />
              <Text style={calendarScreenStyles.legendText}>Leave</Text>
            </View>
            <View style={calendarScreenStyles.legendItem}>
              <View style={[calendarScreenStyles.legendDot, calendarScreenStyles.extraMilkDot]} />
              <Text style={calendarScreenStyles.legendText}>Extra Milk</Text>
            </View>
            {/* ✅ ADD: New legend items for delivery status */}
            <View style={calendarScreenStyles.legendItem}>
              <View
                style={[
                  calendarScreenStyles.legendDot,
                  { backgroundColor: statusColors.delivery_delivered },
                ]}
              />
              <Text style={calendarScreenStyles.legendText}>Distributor Delivered</Text>
            </View>
            <View style={calendarScreenStyles.legendItem}>
              <View
                style={[
                  calendarScreenStyles.legendDot,
                  { backgroundColor: statusColors.delivery_cancelled },
                ]}
              />
              <Text style={calendarScreenStyles.legendText}>Delivery Cancelled</Text>
            </View>
          </View>
        </View>

        <View style={calendarScreenStyles.summaryContainer}>
          <Text style={calendarScreenStyles.summaryTitle}>
            {monthNames[currentMonth]} {currentYear} Summary
          </Text>
          <View style={calendarScreenStyles.summaryGrid}>
            <View style={calendarScreenStyles.summaryItem}>
              <Ionicons name="water-outline" size={24} color={colors.primary} />
              <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalMilk}</Text>
              <Text style={calendarScreenStyles.summaryLabel}>Total Milk</Text>
            </View>
            <View style={calendarScreenStyles.summaryItem}>
              <Ionicons name="receipt-outline" size={24} color={colors.success} />
              <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalBill}</Text>
              <Text style={calendarScreenStyles.summaryLabel}>Total Bill</Text>
            </View>
            <View style={calendarScreenStyles.summaryItem}>
              <Ionicons name="calendar-outline" size={24} color={colors.danger} />
              <Text style={calendarScreenStyles.summaryValue}>{leavesForCustomer.length}</Text>
              <Text style={calendarScreenStyles.summaryLabel}>Total Leaves</Text>
            </View>
            <View style={calendarScreenStyles.summaryItem}>
              <Ionicons name="checkmark-circle-outline" size={24} color={colors.success} />
              <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalDeliveries}</Text>
              <Text style={calendarScreenStyles.summaryLabel}>Deliveries</Text>
            </View>
          </View>
        </View>

        <View style={calendarScreenStyles.leavesContainer}>
          <Text style={calendarScreenStyles.leavesTitle}>Upcoming Leaves</Text>
          {leavesForCustomer.length === 0 ? (
            <Text style={calendarScreenStyles.noLeavesText}>No upcoming leaves</Text>
          ) : (
            leavesForCustomer.map((leave) => (
              <View key={leave.id} style={calendarScreenStyles.leaveItem}>
                <View style={calendarScreenStyles.leaveItemContent}>
                  <Text style={calendarScreenStyles.leaveDate}>{leave.date}</Text>
                  <Text style={calendarScreenStyles.leaveReason}>
                    {leave.reason} • {leave.status}
                  </Text>
                </View>
                {leave.status !== 'cancelled' && (
                  <TouchableOpacity
                    style={calendarScreenStyles.leaveButton}
                    onPress={() => handleCancelLeave(leave.id, leave.date)}
                  >
                    <Text style={calendarScreenStyles.leaveButtonText}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </View>

        <View style={calendarScreenStyles.leavesContainer}>
          <Text style={calendarScreenStyles.leavesTitle}>Extra Milk Requests</Text>
          {milkRequestsForCustomer.length === 0 ? (
            <Text style={calendarScreenStyles.noLeavesText}>No extra milk requests</Text>
          ) : (
            milkRequestsForCustomer.map((request) => (
              <View key={request.id} style={calendarScreenStyles.leaveItem}>
                <View style={calendarScreenStyles.leaveItemContent}>
                  <Text style={calendarScreenStyles.leaveDate}>{request.date}</Text>
                  <Text style={calendarScreenStyles.leaveReason}>
                    {request.quantity}L - {request.reason} • {request.status}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={calendarScreenStyles.actionsContainer}>
          <Text style={calendarScreenStyles.actionsTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={calendarScreenStyles.actionButton}
            onPress={() => setShowLeaveModal(true)}
            activeOpacity={0.7}
          >
            <View style={calendarScreenStyles.actionIcon}>
              <Ionicons name="calendar-outline" size={22} color={colors.white} />
            </View>
            <View style={calendarScreenStyles.actionTextContainer}>
              <Text style={calendarScreenStyles.actionTitle}>Apply for Leave</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[calendarScreenStyles.actionButton, calendarScreenStyles.actionButton]}
            onPress={() => setShowExtraMilkModal(true)}
            activeOpacity={0.7}
          >
            <View style={calendarScreenStyles.actionIcon}>
              <Ionicons name="add-circle-outline" size={22} color={colors.white} />
            </View>
            <View style={calendarScreenStyles.actionTextContainer}>
              <Text style={calendarScreenStyles.actionTitle}>Request Extra Milk</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LeaveRequestModal
        isVisible={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onSubmit={handleLeaveSubmit}
      />
      <ExtraMilkModal
        isVisible={showExtraMilkModal}
        onClose={() => setShowExtraMilkModal(false)}
        onSubmit={handleExtraMilkSubmit}
      />
    </View>
  );
};

export default ConsumerCalendarScreen;
