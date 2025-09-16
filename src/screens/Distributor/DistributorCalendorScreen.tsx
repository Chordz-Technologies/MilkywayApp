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

// import {
//   calendarScreenStyles,
//   calendarTheme,
//   colors,
// } from '../../styles/CalendorScreenStyle';

// import {
//   fetchDistributorCalendarData,
//   submitDistributorLeaveRequest,
//   setCurrentMonth,
//   clearError,
//   cancelLeave,
// } from '../../store/distributorSlice';

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
//   milkmanId?: number;
// }

// // ✅ Use colors from StyleSheet
// const statusColors: Record<string, string> = {
//   leave: '#9C27B0',        // Purple - from StyleSheet leaveDot
//   distributed: '#4CAF50',   // Green - from StyleSheet deliveredDot
//   pending: '#FF9800',       // Orange - from StyleSheet notRequestedDot
//   approved: '#4CAF50',      // Green - same as distributed
// };

// const DistributorCalendarScreen: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
//   const distributorId = user?.userID ? parseInt(user.userID.toString(), 10) : null;

//   const {
//     calendarData,
//     leaveTypes,
//     upcomingLeaves,
//     monthlySummary,
//     loading,
//     error,
//     currentMonth,
//     currentYear,
//   } = useSelector((state: RootState) => state.distributorCalendar);

//   const [showLeaveModal, setShowLeaveModal] = useState(false);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [refreshing, setRefreshing] = useState(false);

//   // Load auth info on mount
//   useEffect(() => {
//     dispatch(checkStoredAuth());
//   }, [dispatch]);

//   // Fetch calendar data on screen focus - same as consumer calendar
//   useFocusEffect(
//     useCallback(() => {
//       if (distributorId && isAuthenticated) {
//         const today = new Date();

//         // Reset Redux to today's month & year whenever screen is focused
//         dispatch(
//           setCurrentMonth({
//             month: today.getMonth(),   // 0-based
//             year: today.getFullYear(),
//           })
//         );

//         const monthString = `${today.getFullYear()}-${(today.getMonth() + 1)
//           .toString()
//           .padStart(2, '0')}`;

//         // Always fetch calendar data for today's month
//         dispatch(fetchDistributorCalendarData({ milkmanId: distributorId, month: monthString }));
//       }
//     }, [distributorId, isAuthenticated, dispatch])
//   );

//   // Prepare marked dates for calendar - same pattern as consumer calendar
//   const markedDates: MarkedDates = useMemo(() => {
//     const marked: MarkedDates = {};

//     // Mark leave statuses from server
//     Object.keys(leaveTypes).forEach(date => {
//       const status = leaveTypes[date];
//       if (status && statusColors[status]) {
//         marked[date] = {
//           ...(marked[date] || {}),
//           marked: true,
//           dotColor: statusColors[status],
//         };
//       }
//     });

//     // Mark upcoming leaves
//     upcomingLeaves.forEach(leave => {
//       if (leave.date) {
//         marked[leave.date] = {
//           ...(marked[leave.date] || {}),
//           marked: true,
//           dotColor: statusColors[leave.status] || statusColors.leave,
//         };
//       }
//     });

//     // Add from calendarData if it exists
//     Object.keys(calendarData).forEach(date => {
//       const item = calendarData[date];
//       if (item && item.marked && item.dotColor) {
//         marked[date] = {
//           ...(marked[date] || {}),
//           marked: true,
//           dotColor: item.dotColor,
//         };
//       }
//     });

//     // Add selected date highlight (but keep dots)
//     if (selectedDate) {
//       marked[selectedDate] = {
//         ...(marked[selectedDate] || {}),
//         selected: true,
//         selectedColor: colors.primary,
//       };
//     }

//     return marked;
//   }, [leaveTypes, upcomingLeaves, calendarData, selectedDate]);

//   // Handlers for leave submission
//   const handleLeaveSubmit = useCallback(
//     async (leaveData: LeaveRequestData) => {
//       if (!distributorId) {
//         Alert.alert('Error', 'Distributor ID not found');
//         return;
//       }
//       try {
//         await dispatch(submitDistributorLeaveRequest({ milkmanId: distributorId, leaveData })).unwrap();
//         Alert.alert('Success', 'Leave request submitted successfully!');
//         setShowLeaveModal(false);
//       } catch (err) {
//         Alert.alert('Error', (err as string) || 'Failed to submit leave request');
//       }
//     },
//     [dispatch, distributorId]
//   );

//   // Handlers for user actions and calendar interaction
//   const handleDayPress = useCallback(
//     (day: DateData) => {
//       setSelectedDate(day.dateString);
//       const type = leaveTypes[day.dateString];
//       if (type) {
//         const messages: Record<string, string> = {
//           leave: 'Distributor on leave',
//           distributed: 'Milk distributed',
//           pending: 'Leave request pending',
//           approved: 'Leave approved - milk distributed',
//         };
//         Alert.alert('Status', `${messages[type] ?? `Status: ${type}`} on ${day.dateString}`);
//       }
//     },
//     [leaveTypes]
//   );

//   const handleMonthChange = useCallback(
//     (month: DateData) => {
//       dispatch(setCurrentMonth({ month: month.month - 1, year: month.year }));
//     },
//     [dispatch]
//   );

//   const handleApplyLeave = useCallback(() => {
//     if (!distributorId) {
//       Alert.alert('Error', 'Please login first');
//       return;
//     }
//     setShowLeaveModal(true);
//   }, [distributorId]);

//   const handleCancelLeave = useCallback(
//     (leaveId: string, leaveDate: string) => {
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
//     if (distributorId) {
//       setRefreshing(true);
//       dispatch(clearError());
//       const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
//       dispatch(fetchDistributorCalendarData({ milkmanId: distributorId, month: monthString })).finally(() =>
//         setRefreshing(false)
//       );
//     }
//   }, [dispatch, distributorId, currentMonth, currentYear]);

//   const monthNames = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December',
//   ];

//   if (!isAuthenticated) {
//     return (
//       <View style={calendarScreenStyles.loadingContainer}>
//         <Text style={calendarScreenStyles.loadingText}>Please login to view distributor calendar</Text>
//       </View>
//     );
//   }

//   if (loading && !refreshing) {
//     return (
//       <View style={calendarScreenStyles.loadingContainer}>
//         <ActivityIndicator size="large" color={colors.primary} />
//         <Text style={calendarScreenStyles.loadingText}>Loading distributor calendar...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={calendarScreenStyles.container}>
//       {/* Header */}
//       <View style={calendarScreenStyles.header}>
//         <Text style={calendarScreenStyles.title}>Distributor Calendar</Text>
//         <View style={calendarScreenStyles.monthSelector}>
//           <Text style={calendarScreenStyles.monthText}>
//             {monthNames[currentMonth]} {currentYear}
//           </Text>
//         </View>
//         {distributorId && (
//           <Text style={calendarScreenStyles.customerIdText}>
//             Distributor ID: {distributorId}
//           </Text>
//         )}
//       </View>

//       {/* Error Banner */}
//       {error && (
//         <View style={calendarScreenStyles.errorContainer}>
//           <Text style={calendarScreenStyles.errorText}>{error}</Text>
//           <TouchableOpacity style={calendarScreenStyles.retryButton} onPress={() => dispatch(clearError())}>
//             <Text style={calendarScreenStyles.retryButtonText}>Dismiss</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Content ScrollView */}
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
//             markingType="dot"
//             hideExtraDays
//             disableMonthChange={false}
//             firstDay={1}
//             enableSwipeMonths
//             // Sync Calendar with Redux
//             current={`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`}
//           />
//         </View>

//         {/* ✅ Legend using StyleSheet colors */}
//         <View style={calendarScreenStyles.legendContainer}>
//           <Text style={calendarScreenStyles.legendTitle}>Status Legend</Text>
//           <View style={calendarScreenStyles.legendGrid}>
//             <View style={calendarScreenStyles.legendItem}>
//               <View style={[calendarScreenStyles.legendDot, calendarScreenStyles.notRequestedDot]} />
//               <Text style={calendarScreenStyles.legendText}>leave</Text>
//             </View>
//             {/* <View style={calendarScreenStyles.legendItem}>
//               <View style={[calendarScreenStyles.legendDot, calendarScreenStyles.leaveDot]} />
//               <Text style={calendarScreenStyles.legendText}>Leave</Text>
//             </View> */}
//             <View style={calendarScreenStyles.legendItem}>
//               <View style={[calendarScreenStyles.legendDot, calendarScreenStyles.deliveredDot]} />
//               <Text style={calendarScreenStyles.legendText}>Distributed</Text>
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
//               <Ionicons name="calendar-outline" size={24} color={colors.primary} />
//               <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalLeaves}</Text>
//               <Text style={calendarScreenStyles.summaryLabel}>Total Days</Text>
//             </View>
//             <View style={calendarScreenStyles.summaryItem}>
//               <Ionicons name="checkmark-circle-outline" size={24} color={'#4CAF50'} />
//               <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.approvedLeaves}</Text>
//               <Text style={calendarScreenStyles.summaryLabel}>Distributed</Text>
//             </View>
//             <View style={calendarScreenStyles.summaryItem}>
//               <Ionicons name="remove-circle-outline" size={24} color={'#9C27B0'} />
//               <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.pendingLeaves}</Text>
//               <Text style={calendarScreenStyles.summaryLabel}>Leave</Text>
//             </View>
//           </View>
//         </View>

//         {/* Leave Requests */}
//         <View style={calendarScreenStyles.leavesContainer}>
//           <Text style={calendarScreenStyles.leavesTitle}>Leave Requests</Text>
//           {upcomingLeaves.length > 0 ? (
//             upcomingLeaves.map(leave => (
//               <View key={leave.id} style={calendarScreenStyles.leaveItem}>
//                 <View style={calendarScreenStyles.leaveItemContent}>
//                   <Text style={calendarScreenStyles.leaveDate}>{leave.date}</Text>
//                   <Text style={calendarScreenStyles.leaveReason}>
//                     {leave.reason} • {leave.status}
//                   </Text>
//                 </View>
//                 {leave.status !== 'leave' && (
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
//             <Text style={calendarScreenStyles.noLeavesText}>No leave requests</Text>
//           )}
//         </View>

//         {/* Quick Actions */}
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
//               <Text style={calendarScreenStyles.actionTitle}>Request Leave</Text>
//               <Text style={calendarScreenStyles.actionSubtitle}>
//                 Request leave for specific date
//               </Text>
//             </View>
//             <Ionicons name="chevron-forward-outline" size={16} color={colors.gray500} />
//           </TouchableOpacity>
//         </View>
//       </ScrollView>

//       {/* Leave Request Modal */}
//       <LeaveRequestModal
//         isVisible={showLeaveModal}
//         onClose={() => setShowLeaveModal(false)}
//         onSubmit={handleLeaveSubmit}
//       />
//     </View>
//   );
// };

// export default DistributorCalendarScreen;
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

import {
  calendarScreenStyles,
  calendarTheme,
  colors,
} from '../../styles/CalendorScreenStyle';

import {
  fetchDistributorCalendarData,
  submitDistributorLeaveRequest,
  setCurrentMonth,
  clearError,
  cancelLeave,
} from '../../store/distributorSlice';

import { checkStoredAuth } from '../../store/authSlice';

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
  milkmanId?: number;
}

const statusColors: Record<string, string> = {
  leave: '#9C27B0',
  distributed: '#4CAF50',
  pending: '#FF9800',
  approved: '#4CAF50',
};

const DistributorCalendarScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const distributorId = user?.userID ? parseInt(user.userID.toString(), 10) : null;

  const {
    calendarData,
    leaveTypes,
    upcomingLeaves,
    monthlySummary,
    loading,
    error,
    currentMonth,
    currentYear,
  } = useSelector((state: RootState) => state.distributorCalendar);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(checkStoredAuth());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      if (distributorId && isAuthenticated) {
        const today = new Date();
        dispatch(setCurrentMonth({ month: today.getMonth(), year: today.getFullYear() }));
        const monthString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
        dispatch(fetchDistributorCalendarData({ milkmanId: distributorId, month: monthString }));
      }
    }, [distributorId, isAuthenticated, dispatch]),
  );

  // Memoize leaves for current distributor
  const leavesForDistributor = useMemo(() => {
    if (distributorId == null) return [];
    const leaves = upcomingLeaves[distributorId];
    return Array.isArray(leaves) ? leaves : [];
  }, [distributorId, upcomingLeaves]);

  const markedDates: MarkedDates = useMemo(() => {
    const marks: MarkedDates = {};

    Object.keys(leaveTypes).forEach((date) => {
      const status = leaveTypes[date];
      if (status && statusColors[status]) {
        marks[date] = {
          ...(marks[date] || {}),
          marked: true,
          dotColor: statusColors[status],
        };
      }
    });

    leavesForDistributor.forEach((leave) => {
      if (leave.date) {
        marks[leave.date] = {
          ...(marks[leave.date] || {}),
          marked: true,
          dotColor: statusColors[leave.status] || statusColors.leave,
        };
      }
    });

    Object.keys(calendarData).forEach((date) => {
      const item = calendarData[date];
      if (item && item.marked && item.dotColor) {
        marks[date] = {
          ...(marks[date] || {}),
          marked: true,
          dotColor: item.dotColor,
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
  }, [leaveTypes, leavesForDistributor, calendarData, selectedDate]);

  const handleLeaveSubmit = useCallback(
    async (leaveData: LeaveRequestData) => {
      if (!distributorId) {
        Alert.alert('Error', 'Distributor ID not found');
        return;
      }
      try {
        await dispatch(submitDistributorLeaveRequest({ milkmanId: distributorId, leaveData })).unwrap();
        Alert.alert('Success', 'Leave request submitted successfully!');
        setShowLeaveModal(false);
      } catch (err) {
        Alert.alert('Error', (err as string) || 'Failed to submit leave request');
      }
    },
    [distributorId, dispatch],
  );

  const handleDayPress = useCallback(
    (day: DateData) => {
      setSelectedDate(day.dateString);
      const type = leaveTypes[day.dateString];
      if (type) {
        const messages: Record<string, string> = {
          leave: 'Distributor on leave',
          distributed: 'Milk distributed',
          pending: 'Leave request pending',
          approved: 'Leave approved - milk distributed',
        };
        Alert.alert('Status', `${messages[type] ?? `Status: ${type}`} on ${day.dateString}`);
      }
    },
    [leaveTypes],
  );

  const handleMonthChange = useCallback(
    (month: DateData) => {
      dispatch(setCurrentMonth({ month: month.month - 1, year: month.year }));
    },
    [dispatch],
  );

  const handleApplyLeave = useCallback(() => {
    if (!distributorId) {
      Alert.alert('Error', 'Please login first');
      return;
    }
    setShowLeaveModal(true);
  }, [distributorId]);

  const handleCancelLeave = useCallback(
    (leaveId: string, leaveDate: string) => {
      Alert.alert('Cancel Leave', `Cancel leave for ${leaveDate}?`, [
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            if (distributorId) {
              dispatch(cancelLeave({ leaveId, leaveDate, milkmanId: distributorId }));
              Alert.alert('Success', 'Leave cancelled successfully!');
            }
          },
        },
        { text: 'No', style: 'cancel' },
      ]);
    },
    [dispatch, distributorId],
  );

  const onRefresh = useCallback(() => {
    if (!distributorId) return;
    setRefreshing(true);
    dispatch(clearError());
    const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
    dispatch(fetchDistributorCalendarData({ milkmanId: distributorId, month: monthString })).finally(() =>
      setRefreshing(false),
    );
  }, [currentMonth, currentYear, distributorId, dispatch]);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  if (!isAuthenticated) {
    return (
      <View style={calendarScreenStyles.loadingContainer}>
        <Text>Please login to view distributor calendar</Text>
      </View>
    );
  }

  if (loading && !refreshing) {
    return (
      <View style={calendarScreenStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Loading distributor calendar...</Text>
      </View>
    );
  }

  return (
    <View style={calendarScreenStyles.container}>
      <View style={calendarScreenStyles.header}>
        <Text style={calendarScreenStyles.title}>Distributor Calendar</Text>
        <View style={calendarScreenStyles.monthSelector}>
          <Text style={calendarScreenStyles.monthText}>
            {monthNames[currentMonth]} {currentYear}
          </Text>
        </View>
        {distributorId && (
          <Text style={calendarScreenStyles.customerIdText}>Distributor ID: {distributorId}</Text>
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
      >
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
            enableSwipeMonths
            current={`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`}
          />
        </View>

        <View style={calendarScreenStyles.legendContainer}>
          <Text style={calendarScreenStyles.legendTitle}>Status Legend</Text>
          <View style={calendarScreenStyles.legendGrid}>
            <View style={calendarScreenStyles.legendItem}>
              <View style={[calendarScreenStyles.legendDot, calendarScreenStyles.notRequestedDot]} />
              <Text style={calendarScreenStyles.legendText}>Leave</Text>
            </View>
            <View style={calendarScreenStyles.legendItem}>
              <View style={[calendarScreenStyles.legendDot, calendarScreenStyles.deliveredDot]} />
              <Text style={calendarScreenStyles.legendText}>Distributed</Text>
            </View>
          </View>
        </View>

        <View style={calendarScreenStyles.summaryContainer}>
          <Text style={calendarScreenStyles.summaryTitle}>
            {monthNames[currentMonth]} {currentYear} Summary
          </Text>
          <View style={calendarScreenStyles.summaryGrid}>
            <View style={calendarScreenStyles.summaryItem}>
              <Ionicons name="calendar-outline" size={24} color={colors.primary} />
              <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalLeaves}</Text>
              <Text style={calendarScreenStyles.summaryLabel}>Total Days</Text>
            </View>
            <View style={calendarScreenStyles.summaryItem}>
              <Ionicons name="checkmark-circle-outline" size={24} color={'#4CAF50'} />
              <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.approvedLeaves}</Text>
              <Text style={calendarScreenStyles.summaryLabel}>Distributed</Text>
            </View>
            <View style={calendarScreenStyles.summaryItem}>
              <Ionicons name="remove-circle-outline" size={24} color={'#9C27B0'} />
              <Text style={calendarScreenStyles.summaryValue}>{leavesForDistributor.length}</Text>
              <Text style={calendarScreenStyles.summaryLabel}>Leave</Text>
            </View>
          </View>
        </View>

        <View style={calendarScreenStyles.leavesContainer}>
          <Text style={calendarScreenStyles.leavesTitle}>Leave Requests</Text>
          {leavesForDistributor.length === 0 ? (
            <Text style={calendarScreenStyles.noLeavesText}>No leave requests</Text>
          ) : (
            leavesForDistributor.map((leave) => (
              <View key={leave.id} style={calendarScreenStyles.leaveItem}>
                <View style={calendarScreenStyles.leaveItemContent}>
                  <Text style={calendarScreenStyles.leaveDate}>{leave.date}</Text>
                  <Text style={calendarScreenStyles.leaveReason}>
                    {leave.reason} • {leave.status}
                  </Text>
                </View>
                {leave.status !== 'leave' && (
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
              <Text style={calendarScreenStyles.actionTitle}>Request Leave</Text>
              <Text style={calendarScreenStyles.actionSubtitle}>
                Request leave for specific date
              </Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={16} color={colors.gray500} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <LeaveRequestModal
        isVisible={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onSubmit={handleLeaveSubmit}
      />
    </View>
  );
};

export default DistributorCalendarScreen;
