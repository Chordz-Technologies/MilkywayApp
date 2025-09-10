
//New code for testing:
// import React, { useEffect, useCallback, useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   RefreshControl,
// } from 'react-native';
// import { Calendar, DateData, MarkedDates } from 'react-native-calendars';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useSelector, useDispatch } from 'react-redux';
// import type { RootState, AppDispatch } from '../../store/index';

// import LeaveRequestModal from '../../components/LeaveRequestModal';
// import ExtraMilkModal from '../../components/ExtraMilkModal';

// import {
//   calendarScreenStyles,
//   calendarTheme,
//   colors,
// } from './../../styles/CalendorScreenStyle';

// import {
//   fetchCalendarData,
//   submitLeaveRequest,
//   submitExtraMilkRequest,
//   setCurrentMonth,
//   clearError,
//   cancelLeave,
// } from '../../store/calendarSlice';

// import { checkStoredAuth } from '../../store/authSlice';

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

// const ConsumerCalendarScreen: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
//   const customerId = user?.userID ? parseInt(user.userID.toString(), 10) : null;

//   const {
//     calendarData,
//     deliveryTypes,
//     upcomingLeaves,
//     monthlySummary,
//     loading,
//     error,
//     currentMonth,
//     currentYear,
//   } = useSelector((state: RootState) => state.calendar);

//   const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
//   const [showExtraMilkModal, setShowExtraMilkModal] = useState<boolean>(false);
//   const [selectedDate, setSelectedDate] = useState<string>('');
//   const [refreshing, setRefreshing] = useState<boolean>(false);

//   useEffect(() => {
//     dispatch(checkStoredAuth());
//   }, [dispatch]);

//   useEffect(() => {
//     if (customerId && isAuthenticated) {
//       const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
//       dispatch(fetchCalendarData({ customerId, month: monthString }));
//     }
//   }, [dispatch, customerId, isAuthenticated, currentMonth, currentYear]);

//   const handleLeaveSubmit = useCallback(
//     async (leaveData: LeaveRequestData): Promise<void> => {
//       if (!customerId) {
//         Alert.alert('Error', 'Customer ID not found');
//         return;
//       }
//       try {
//         await dispatch(submitLeaveRequest({ customerId, leaveData })).unwrap();
//         Alert.alert('Success', 'Leave request submitted successfully!');
//         setShowLeaveModal(false);
//       } catch (error) {
//         Alert.alert('Error', (error as string) || 'Failed to submit leave request');
//       }
//     },
//     [dispatch, customerId]
//   );

//   const handleExtraMilkSubmit = useCallback(
//     async (extraMilkData: ExtraMilkData): Promise<void> => {
//       if (!customerId) {
//         Alert.alert('Error', 'Customer ID not found');
//         return;
//       }
//       const requestData = {
//         date: extraMilkData.date,
//         quantity: extraMilkData.quantity,
//         reason: extraMilkData.reason,
//       };
//       try {
//         await dispatch(submitExtraMilkRequest({ customerId, extraMilkData: requestData })).unwrap();
//         Alert.alert('Success', 'Extra milk request submitted successfully!');
//         setShowExtraMilkModal(false);
//       } catch (error) {
//         Alert.alert('Error', (error as string) || 'Failed to request extra milk');
//       }
//     },
//     [dispatch, customerId]
//   );

//   const markedDates: MarkedDates = useMemo(() => {
//     const combinedDates = { ...calendarData };

//     if (selectedDate) {
//       combinedDates[selectedDate] = {
//         selected: true,
//         selectedColor: colors.primary,
//         marked: combinedDates[selectedDate]?.marked ?? false,
//         dotColor: colors.white,
//       };
//     }

//     return combinedDates;
//   }, [selectedDate, calendarData]);

//   const handleDayPress = useCallback(
//     (day: DateData): void => {
//       setSelectedDate(day.dateString);
//       const deliveryType = deliveryTypes[day.dateString];
//       if (deliveryType) {
//         const statusMessages: Record<string, string> = {
//           delivered: 'Milk delivery completed',
//           missed: 'Delivery missed (customer not at home)',
//           not_requested: 'Customer requested no delivery',
//           vendor_unavailable: 'Vendor/milkman unavailable',
//           customer_paused: 'Customer on leave',
//           extra_milk: 'Extra milk requested',
//         };
//         const message = statusMessages[deliveryType] || 'Unknown status';
//         Alert.alert('Delivery Status', `${message} on ${day.dateString}`);
//       }
//     },
//     [deliveryTypes]
//   );

//   const handleMonthChange = useCallback(
//     (month: DateData): void => {
//       dispatch(setCurrentMonth({ month: month.month - 1, year: month.year }));
//     },
//     [dispatch]
//   );

//   const handleApplyLeave = useCallback(() => {
//     if (!customerId) {
//       Alert.alert('Error', 'Please login first');
//       return;
//     }
//     setShowLeaveModal(true);
//   }, [customerId]);

//   const handleExtraMilk = useCallback(() => {
//     if (!customerId) {
//       Alert.alert('Error', 'Please login first');
//       return;
//     }
//     setShowExtraMilkModal(true);
//   }, [customerId]);

//   const handleCancelLeave = useCallback(
//     (leaveId: string, leaveDate: string): void => {
//       Alert.alert(
//         'Cancel Leave',
//         `Cancel leave for ${leaveDate}?`,
//         [
//           {
//             text: 'Yes, Cancel',
//             style: 'destructive',
//             onPress: () => {
//               dispatch(cancelLeave({ leaveId, leaveDate }));
//               Alert.alert('Success', 'Leave cancelled successfully!');
//             },
//           },
//           { text: 'No', style: 'cancel' },
//         ]
//       );
//     },
//     [dispatch]
//   );

//   const onRefresh = useCallback(() => {
//     if (customerId) {
//       setRefreshing(true);
//       dispatch(clearError());
//       const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
//       dispatch(fetchCalendarData({ customerId, month: monthString })).finally(() =>
//         setRefreshing(false)
//       );
//     }
//   }, [dispatch, customerId, currentMonth, currentYear]);

//   const monthNames: string[] = [
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
//         <Text style={calendarScreenStyles.loadingText}>Please login to view your calendar</Text>
//       </View>
//     );
//   }

//   if (loading && !refreshing) {
//     return (
//       <View style={calendarScreenStyles.loadingContainer}>
//         <ActivityIndicator size="large" color={colors.primary} />
//         <Text style={calendarScreenStyles.loadingText}>Loading calendar...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={calendarScreenStyles.container}>
//       {/* Header */}
//       <View style={calendarScreenStyles.header}>
//         <Text style={calendarScreenStyles.title}>Milkyway Calendar</Text>
//         <View style={calendarScreenStyles.monthSelector}>
//           <Text style={calendarScreenStyles.monthText}>
//             {monthNames[currentMonth]} {currentYear}
//           </Text>
//         </View>
//         {customerId && (
//           <Text style={{ fontSize: 12, color: colors.gray500, textAlign: 'center' }}>
//             Customer ID: {customerId}
//           </Text>
//         )}
//       </View>

//       {/* Error banner */}
//       {error && (
//         <View style={calendarScreenStyles.errorContainer}>
//           <Text style={calendarScreenStyles.errorText}>{error}</Text>
//           <TouchableOpacity style={calendarScreenStyles.retryButton} onPress={() => dispatch(clearError())}>
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
//         {/* Calendar */}
//         <View style={calendarScreenStyles.calendarContainer}>
//           <Calendar
//             style={calendarScreenStyles.calendar}
//             theme={calendarTheme}
//             onDayPress={handleDayPress}
//             onMonthChange={handleMonthChange}
//             markedDates={markedDates}
//             markingType={'dot'}
//             hideExtraDays={true}
//             disableMonthChange={false}
//             firstDay={1}
//             showWeekNumbers={false}
//             enableSwipeMonths={true}
//           />
//         </View>

//         {/* Legend */}
//         <View style={calendarScreenStyles.legendContainer}>
//           <Text style={calendarScreenStyles.legendTitle}>Status Legend</Text>
//           <View style={calendarScreenStyles.legendGrid}>
//             <View style={calendarScreenStyles.legendItem}>
//               <View style={[calendarScreenStyles.legendDot, { backgroundColor: '#4CAF50' }]} />
//               <Text style={calendarScreenStyles.legendText}>Delivered</Text>
//             </View>
//             <View style={calendarScreenStyles.legendItem}>
//               <View style={[calendarScreenStyles.legendDot, { backgroundColor: colors.primary }]} />
//               <Text style={calendarScreenStyles.legendText}>Missed</Text>
//             </View>
//             <View style={calendarScreenStyles.legendItem}>
//               <View style={[calendarScreenStyles.legendDot, { backgroundColor: '#FF9800' }]} />
//               <Text style={calendarScreenStyles.legendText}>Not Requested</Text>
//             </View>
//             <View style={calendarScreenStyles.legendItem}>
//               <View style={[calendarScreenStyles.legendDot, { backgroundColor: '#F44336' }]} />
//               <Text style={calendarScreenStyles.legendText}>Vendor Unavailable</Text>
//             </View>
//             <View style={calendarScreenStyles.legendItem}>
//               <View style={[calendarScreenStyles.legendDot, { backgroundColor: '#9C27B0' }]} />
//               <Text style={calendarScreenStyles.legendText}>Leave</Text>
//             </View>
//             <View style={calendarScreenStyles.legendItem}>
//               <View style={[calendarScreenStyles.legendDot, { backgroundColor: '#FFC107' }]} />
//               <Text style={calendarScreenStyles.legendText}>Extra Milk</Text>
//             </View>
//           </View>
//         </View>

//         {/* Monthly Summary */}
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
//               <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalLeaves}</Text>
//               <Text style={calendarScreenStyles.summaryLabel}>Total Leaves</Text>
//             </View>
//             <View style={calendarScreenStyles.summaryItem}>
//               <Ionicons name="checkmark-circle-outline" size={24} color={'#4CAF50'} />
//               <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalDeliveries}</Text>
//               <Text style={calendarScreenStyles.summaryLabel}>Deliveries</Text>
//             </View>
//           </View>
//         </View>

//         {/* Leaves Section */}
//         <View style={calendarScreenStyles.leavesContainer}>
//           <Text style={calendarScreenStyles.leavesTitle}>Upcoming Leaves</Text>
//           {upcomingLeaves.length > 0 ? (
//             upcomingLeaves.map((leave) => (
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
//           ) : (
//             <Text style={calendarScreenStyles.noLeavesText}>No upcoming leaves</Text>
//           )}
//         </View>

//         {/* Actions */}
//         <View style={calendarScreenStyles.actionsContainer}>
//           <Text style={calendarScreenStyles.actionsTitle}>Quick Actions</Text>

//           <TouchableOpacity
//             style={calendarScreenStyles.actionButton}
//             onPress={handleApplyLeave}
//             activeOpacity={0.7}
//           >
//             <View style={calendarScreenStyles.actionIcon}>
//               <Ionicons name="calendar-outline" size={22} color={colors.white} />
//             </View>
//             <View style={calendarScreenStyles.actionTextContainer}>
//               <Text style={calendarScreenStyles.actionTitle}>Apply for Leave</Text>
//               <Text style={calendarScreenStyles.actionSubtitle}>
//                 Request leave for specific date
//               </Text>
//             </View>
//             <Ionicons name="chevron-forward-outline" size={16} color={colors.gray500} />
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={calendarScreenStyles.actionButton}
//             onPress={handleExtraMilk}
//             activeOpacity={0.7}
//           >
//             <View style={[calendarScreenStyles.actionIcon, calendarScreenStyles.actionIconGreen]}>
//               <Ionicons name="add-circle-outline" size={22} color={colors.white} />
//             </View>
//             <View style={calendarScreenStyles.actionTextContainer}>
//               <Text style={calendarScreenStyles.actionTitle}>Request Extra Milk</Text>
//               <Text style={calendarScreenStyles.actionSubtitle}>
//                 Request additional milk delivery
//               </Text>
//             </View>
//             <Ionicons name="chevron-forward-outline" size={16} color={colors.gray500} />
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

////////
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

import {
  calendarScreenStyles,
  calendarTheme,
  colors,
} from '../../styles/CalendorScreenStyle';

import {
  fetchCalendarData,
  submitLeaveRequest,
  submitExtraMilkRequest,
  setCurrentMonth,
  clearError,
  cancelLeave,
} from '../../store/calendarSlice';

import { checkStoredAuth } from '../../store/authSlice';

// Custom type for react-native-calendars markedDates
type MarkedDates = Record<
  string,
  {
    selected?: boolean;
    marked?: boolean;
    selectedColor?: string;
    dotColor?: string;
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

const ConsumerCalendarScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const customerId = user?.userID ? parseInt(user.userID.toString(), 10) : null;

  const {
    calendarData,
    deliveryTypes,
    upcomingLeaves,
    monthlySummary,
    loading,
    error,
    currentMonth,
    currentYear,
  } = useSelector((state: RootState) => state.calendar);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showExtraMilkModal, setShowExtraMilkModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Load auth info on mount
  useEffect(() => {
    dispatch(checkStoredAuth());
  }, [dispatch]);

  // Fetch calendar data on screen focus
  useFocusEffect(
    useCallback(() => {
      if (customerId && isAuthenticated) {
        const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
        dispatch(fetchCalendarData({ customerId, month: monthString }));
      }
    }, [customerId, isAuthenticated, currentMonth, currentYear, dispatch])
  );

  // Debug: log calendar state for verification
  console.log('Redux calendarData:', calendarData);
  console.log('Redux deliveryTypes:', deliveryTypes);

  // Handlers for leave and extra milk submission
  const handleLeaveSubmit = useCallback(
    async (leaveData: LeaveRequestData) => {
      if (!customerId) {
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
    [dispatch, customerId]
  );

  const handleExtraMilkSubmit = useCallback(
    async (extraMilkData: ExtraMilkData) => {
      if (!customerId) {
        Alert.alert('Error', 'Customer ID not found');
        return;
      }
      const requestData = {
        date: extraMilkData.date,
        quantity: extraMilkData.quantity,
        reason: extraMilkData.reason,
      };
      try {
        await dispatch(submitExtraMilkRequest({ customerId, extraMilkData: requestData })).unwrap();
        Alert.alert('Success', 'Extra milk request submitted successfully!');
        setShowExtraMilkModal(false);
      } catch (err) {
        Alert.alert('Error', (err as string) || 'Failed to request extra milk');
      }
    },
    [dispatch, customerId]
  );

  // Prepare marked dates for calendar component
  const markedDates: MarkedDates = useMemo(() => {
    const combined = { ...calendarData };

    if (selectedDate) {
      combined[selectedDate] = {
        selected: true,
        selectedColor: colors.primary,
        marked: combined[selectedDate]?.marked ?? false,
        dotColor: colors.white,
      };
    }

    return combined;
  }, [calendarData, selectedDate]);

  // Handlers for user actions and calendar interaction
  const handleDayPress = useCallback(
    (day: DateData) => {
      setSelectedDate(day.dateString);
      const type = deliveryTypes[day.dateString];
      if (type) {
        const messages: Record<string, string> = {
          delivered: 'Milk delivery completed',
          missed: 'Delivery missed (customer not at home)',
          not_requested: 'Customer requested no delivery',
          vendor_unavailable: 'Vendor/milkman unavailable',
          customer_paused: 'Customer on leave',
          extra_milk: 'Extra milk requested',
        };
        Alert.alert('Delivery Status', `${messages[type] ?? 'Unknown status'} on ${day.dateString}`);
      }
    },
    [deliveryTypes]
  );

  const handleMonthChange = useCallback(
    (month: DateData) => {
      dispatch(setCurrentMonth({ month: month.month - 1, year: month.year }));
    },
    [dispatch]
  );

  const handleApplyLeave = useCallback(() => {
    if (!customerId) {
      Alert.alert('Error', 'Please login first');
      return;
    }
    setShowLeaveModal(true);
  }, [customerId]);

  const handleExtraMilk = useCallback(() => {
    if (!customerId) {
      Alert.alert('Error', 'Please login first');
      return;
    }
    setShowExtraMilkModal(true);
  }, [customerId]);

  const handleCancelLeave = useCallback(
    (leaveId: string, leaveDate: string) => {
      Alert.alert(
        'Cancel Leave',
        `Cancel leave for ${leaveDate}?`,
        [
          {
            text: 'Yes, Cancel',
            style: 'destructive',
            onPress: () => {
              dispatch(cancelLeave({ leaveId, leaveDate }));
              Alert.alert('Success', 'Leave cancelled successfully!');
            },
          },
          { text: 'No', style: 'cancel' },
        ]
      );
    },
    [dispatch]
  );

  const onRefresh = useCallback(() => {
    if (customerId) {
      setRefreshing(true);
      dispatch(clearError());
      const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
      dispatch(fetchCalendarData({ customerId, month: monthString })).finally(() =>
        setRefreshing(false)
      );
    }
  }, [dispatch, customerId, currentMonth, currentYear]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  if (!isAuthenticated) {
    return (
      <View style={calendarScreenStyles.loadingContainer}>
        <Text style={calendarScreenStyles.loadingText}>Please login to view your calendar</Text>
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={calendarScreenStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={calendarScreenStyles.loadingText}>Loading calendar...</Text>
      </View>
    );
  }

  return (
    <View style={calendarScreenStyles.container}>
      {/* Header */}
      <View style={calendarScreenStyles.header}>
        <Text style={calendarScreenStyles.title}>Milkyway Calendar</Text>
        <View style={calendarScreenStyles.monthSelector}>
          <Text style={calendarScreenStyles.monthText}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
        </View>
        {customerId && (
          <Text style={{ fontSize: 12, color: colors.gray500, textAlign: 'center' }}>
            Customer ID: {customerId}
          </Text>
        )}
      </View>

      {/* Error Banner */}
      {error && (
        <View style={calendarScreenStyles.errorContainer}>
          <Text style={calendarScreenStyles.errorText}>{error}</Text>
          <TouchableOpacity style={calendarScreenStyles.retryButton} onPress={() => dispatch(clearError())}>
            <Text style={calendarScreenStyles.retryButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content ScrollView */}
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

        {/* Calendar */}
        <View style={calendarScreenStyles.calendarContainer}>
          <Calendar
            style={calendarScreenStyles.calendar}
            theme={calendarTheme}
            onDayPress={handleDayPress}
            onMonthChange={handleMonthChange}
            markedDates={markedDates}
            markingType="dot"
            hideExtraDays
            disableMonthChange={false}
            firstDay={1}
            showWeekNumbers={false}
            enableSwipeMonths
          />
        </View>

        {/* Legend */}
        <View style={calendarScreenStyles.legendContainer}>
          <Text style={calendarScreenStyles.legendTitle}>Status Legend</Text>
          <View style={calendarScreenStyles.legendGrid}>
            <View style={calendarScreenStyles.legendItem}>
              <View style={[calendarScreenStyles.legendDot, { backgroundColor: '#4CAF50' }]} />
              <Text style={calendarScreenStyles.legendText}>Delivered</Text>
            </View>
            <View style={calendarScreenStyles.legendItem}>
              <View style={[calendarScreenStyles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={calendarScreenStyles.legendText}>Missed</Text>
            </View>
            <View style={calendarScreenStyles.legendItem}>
              <View style={[calendarScreenStyles.legendDot, { backgroundColor: '#FF9800' }]} />
              <Text style={calendarScreenStyles.legendText}>Not Requested</Text>
            </View>
            <View style={calendarScreenStyles.legendItem}>
              <View style={[calendarScreenStyles.legendDot, { backgroundColor: '#F44336' }]} />
              <Text style={calendarScreenStyles.legendText}>Vendor Unavailable</Text>
            </View>
            <View style={calendarScreenStyles.legendItem}>
              <View style={[calendarScreenStyles.legendDot, { backgroundColor: '#9C27B0' }]} />
              <Text style={calendarScreenStyles.legendText}>Leave</Text>
            </View>
            <View style={calendarScreenStyles.legendItem}>
              <View style={[calendarScreenStyles.legendDot, { backgroundColor: '#FFC107' }]} />
              <Text style={calendarScreenStyles.legendText}>Extra Milk</Text>
            </View>
          </View>
        </View>

        {/* Monthly Summary */}
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
              <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalLeaves}</Text>
              <Text style={calendarScreenStyles.summaryLabel}>Total Leaves</Text>
            </View>
            <View style={calendarScreenStyles.summaryItem}>
              <Ionicons name="checkmark-circle-outline" size={24} color={'#4CAF50'} />
              <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalDeliveries}</Text>
              <Text style={calendarScreenStyles.summaryLabel}>Deliveries</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Leaves */}
        <View style={calendarScreenStyles.leavesContainer}>
          <Text style={calendarScreenStyles.leavesTitle}>Upcoming Leaves</Text>
          {upcomingLeaves.length > 0 ? (
            upcomingLeaves.map(leave => (
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
          ) : (
            <Text style={calendarScreenStyles.noLeavesText}>No upcoming leaves</Text>
          )}
        </View>

        {/* Quick Actions */}
        <View style={calendarScreenStyles.actionsContainer}>
          <Text style={calendarScreenStyles.actionsTitle}>Quick Actions</Text>

          <TouchableOpacity
            style={calendarScreenStyles.actionButton}
            onPress={handleApplyLeave}
            activeOpacity={0.7}
          >
            <View style={calendarScreenStyles.actionIcon}>
              <Ionicons name="calendar-outline" size={22} color={colors.white} />
            </View>
            <View style={calendarScreenStyles.actionTextContainer}>
              <Text style={calendarScreenStyles.actionTitle}>Apply for Leave</Text>
              <Text style={calendarScreenStyles.actionSubtitle}>
                Request leave for specific date
              </Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={16} color={colors.gray500} />
          </TouchableOpacity>

          <TouchableOpacity
            style={calendarScreenStyles.actionButton}
            onPress={handleExtraMilk}
            activeOpacity={0.7}
          >
            <View style={[calendarScreenStyles.actionIcon, calendarScreenStyles.actionIconGreen]}>
              <Ionicons name="add-circle-outline" size={22} color={colors.white} />
            </View>
            <View style={calendarScreenStyles.actionTextContainer}>
              <Text style={calendarScreenStyles.actionTitle}>Request Extra Milk</Text>
              <Text style={calendarScreenStyles.actionSubtitle}>
                Request additional milk delivery
              </Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={16} color={colors.gray500} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modals for leave and extra milk */}
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
