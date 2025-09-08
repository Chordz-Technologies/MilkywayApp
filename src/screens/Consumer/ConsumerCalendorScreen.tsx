import React, { useState, useCallback, useEffect, useMemo } from 'react';
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
// Import the modal components
import LeaveRequestModal from '../../components/LeaveRequestModal';
import ExtraMilkModal from '../../components/ExtraMilkModal';
// Import the comprehensive style file
import {
  calendarScreenStyles,
  calendarTheme,
  colors,
} from './../../styles/CalendorScreenStyle';

// ✅ Define your own marking type that matches react-native-calendars expectations
type CustomMarking = {
  selected?: boolean;
  marked?: boolean;
  dotColor?: string;
  selectedColor?: string;
  disabled?: boolean;
  disableTouchEvent?: boolean;
  textColor?: string;
  selectedTextColor?: string;
};

// ✅ Define markedDates type
type MarkedDatesType = { [date: string]: CustomMarking };

interface LeaveItem {
  id: string;
  date: string;
  reason: string;
  status: 'approved' | 'pending' | 'cancelled';
}

interface MonthlySummary {
  totalMilk: string;
  totalBill: string;
  totalLeaves: number;
  totalDeliveries: number;
}

interface BillInfo {
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

// ✅ Define interfaces for modal data
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

export default function ConsumerCalendarScreen() {
  // State variables
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Add modal state variables
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showExtraMilkModal, setShowExtraMilkModal] = useState(false);

  // ✅ Dynamic state for calendar data (removed scheduled dates)
  const [calendarData, setCalendarData] = useState<MarkedDatesType>({
    '2025-09-02': { marked: true, dotColor: colors.delivered },
    '2025-09-05': { marked: true, dotColor: colors.delivered },
    '2025-09-10': { marked: true, dotColor: colors.pending },
    '2025-09-11': { marked: true, dotColor: colors.primary }, // Blue for not delivered
    '2025-09-12': { marked: true, dotColor: colors.delivered },
  });

  const [leaveDates, setLeaveDates] = useState<MarkedDatesType>({
    '2025-09-15': { marked: true, dotColor: colors.leave },
    '2025-09-20': { marked: true, dotColor: colors.leave },
    '2025-09-25': { marked: true, dotColor: colors.leave },
  });

  // ✅ Keep track of delivery types (removed scheduled)
  const [deliveryTypes, setDeliveryTypes] = useState<Record<string, string>>({
    '2025-09-02': 'delivered',
    '2025-09-05': 'delivered',
    '2025-09-10': 'pending',
    '2025-09-11': 'not_delivered', // Blue for not delivered
    '2025-09-12': 'delivered',
    '2025-09-15': 'leave',
    '2025-09-20': 'leave',
    '2025-09-25': 'leave',
  });

  // Memoize other local data
  const [upcomingLeaves, setUpcomingLeaves] = useState<LeaveItem[]>([
    { id: '1', date: 'Sep 15, 2025', reason: 'Personal Leave', status: 'approved' },
    { id: '2', date: 'Sep 20, 2025', reason: 'Festival Holiday', status: 'pending' },
    { id: '3', date: 'Sep 25, 2025', reason: 'Family Function', status: 'approved' },
  ]);

  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary>({
    totalMilk: '24L',
    totalBill: '₹1,200',
    totalLeaves: 3,
    totalDeliveries: 22,
  });

  const [billInfo, setBillInfo] = useState<BillInfo>({
    amount: 1450,
    dueDate: 'September 30, 2025',
    status: 'pending',
  });

  // Helper function to get dates between start and end
  const getDatesBetween = (startDate: string, endDate: string): string[] => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      dates.push(dt.toISOString().split('T')[0]);
    }

    return dates;
  };

  // ✅ Handle Leave Request Submission (Local Update)
  const handleLeaveSubmit = useCallback(async (leaveData: LeaveRequestData) => {
    try {
      setIsLoading(true);

      // Update local leave dates state
      const updatedLeaveDates = { ...leaveDates };
      const dates = getDatesBetween(leaveData.startDate, leaveData.endDate);

      dates.forEach(date => {
        updatedLeaveDates[date] = { marked: true, dotColor: colors.leave };
      });
      setLeaveDates(updatedLeaveDates);

      // Update delivery types
      const updatedDeliveryTypes = { ...deliveryTypes };
      dates.forEach(date => {
        updatedDeliveryTypes[date] = 'leave';
      });
      setDeliveryTypes(updatedDeliveryTypes);

      // Add to upcoming leaves list
      const newLeave: LeaveItem = {
        id: Date.now().toString(),
        date: `${leaveData.startDate} to ${leaveData.endDate}`,
        reason: leaveData.reason,
        status: 'approved',
      };
      setUpcomingLeaves(prev => [...prev, newLeave]);

      // Update monthly summary
      setMonthlySummary(prev => ({
        ...prev,
        totalLeaves: prev.totalLeaves + dates.length,
      }));

      // Simulate processing time
      setTimeout(() => {
        Alert.alert(
          'Success',
          `Leave request submitted successfully!\nDates: ${leaveData.startDate} to ${leaveData.endDate}\nReason: ${leaveData.reason}`
        );
        setIsLoading(false);
      }, 1000);

    } catch (err: any) {
      console.error('Leave request failed:', err);
      Alert.alert('Error', 'Failed to submit leave request');
      setIsLoading(false);
    }
  }, [leaveDates, deliveryTypes]);

  // ✅ Handle Extra Milk Request Submission (Local Update)
  const handleExtraMilkSubmit = useCallback(async (extraMilkData: ExtraMilkData) => {
    try {
      setIsLoading(true);

      // Update local calendar data
      const updatedCalendar = { ...calendarData };
      updatedCalendar[extraMilkData.date] = {
        ...updatedCalendar[extraMilkData.date],
        marked: true,
        dotColor: colors.warning || '#ffc107', // Orange for extra milk
      };
      setCalendarData(updatedCalendar);

      // Update delivery types
      const updatedDeliveryTypes = { ...deliveryTypes };
      updatedDeliveryTypes[extraMilkData.date] = 'extra_milk';
      setDeliveryTypes(updatedDeliveryTypes);

      // Simulate processing time
      setTimeout(() => {
        Alert.alert(
          'Success',
          `Extra milk request submitted!\nDate: ${extraMilkData.date}\nQuantity: ${extraMilkData.quantity}L\nType: ${extraMilkData.milkType}\nReason: ${extraMilkData.reason}`
        );
        setIsLoading(false);
      }, 1000);

    } catch (err: any) {
      console.error('Extra milk request failed:', err);
      Alert.alert('Error', 'Failed to request extra milk');
      setIsLoading(false);
    }
  }, [calendarData, deliveryTypes]);

  // ✅ Create marked dates with proper typing
  const markedDates: MarkedDatesType = useMemo(() => {
    const combinedDates: MarkedDatesType = { ...calendarData, ...leaveDates };

    if (selectedDate) {
      combinedDates[selectedDate] = {
        selected: true,
        selectedColor: colors.primary,
        marked: !!(combinedDates[selectedDate]),
        dotColor: colors.white,
      };
    }

    return combinedDates;
  }, [selectedDate, calendarData, leaveDates]);

  // ✅ Event handlers (removed scheduled case)
  const handleDayPress = useCallback((day: DateData) => {
    setSelectedDate(day.dateString);

    // Show info about selected date
    const deliveryType = deliveryTypes[day.dateString];

    if (deliveryType) {
      if (deliveryType === 'leave') {
        Alert.alert('Leave Day', `You have a leave on ${day.dateString}`);
      } else if (deliveryType === 'extra_milk') {
        Alert.alert('Extra Milk', `Extra milk requested on ${day.dateString}`);
      } else if (deliveryType === 'not_delivered') {
        Alert.alert('Delivery Status', `Milk delivery was not completed by distributor on ${day.dateString}`);
      } else if (deliveryType === 'delivered') {
        Alert.alert('Delivery Info', `Milk delivery completed on ${day.dateString}`);
      } else if (deliveryType === 'pending') {
        Alert.alert('Delivery Info', `Milk delivery pending on ${day.dateString}`);
      }
    }
  }, [deliveryTypes]);

  const handleMonthChange = useCallback((month: DateData) => {
    setCurrentMonth(month.month - 1);
  }, []);

  // ✅ Updated handlers to show modals
  const handleApplyLeave = useCallback(() => {
    setShowLeaveModal(true);
  }, []);

  const handleExtraMilk = useCallback(() => {
    setShowExtraMilkModal(true);
  }, []);

  const handlePayBill = useCallback(() => {
    Alert.alert(
      'Pay Bill',
      `Pay ₹${billInfo.amount} now?`,
      [
        {
          text: 'Pay Now',
          onPress: () => {
            setIsLoading(true);

            // Simulate payment processing
            setTimeout(() => {
              setIsLoading(false);
              Alert.alert('Success', 'Payment completed successfully!');

              // Update bill status locally
              setBillInfo(prev => ({ ...prev, status: 'paid' }));
            }, 2000);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, [billInfo.amount]);

  const handleCancelLeave = useCallback((leaveId: string, leaveDate: string) => {
    Alert.alert(
      'Cancel Leave',
      `Cancel leave for ${leaveDate}?`,
      [
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => {
            // Remove leave from upcoming leaves
            setUpcomingLeaves(prev => prev.filter(leave => leave.id !== leaveId));

            // Remove leave dates from calendar
            const updatedLeaveDates = { ...leaveDates };
            Object.keys(updatedLeaveDates).forEach(date => {
              if (leaveDate.includes(date)) {
                delete updatedLeaveDates[date];
              }
            });
            setLeaveDates(updatedLeaveDates);

            Alert.alert('Success', 'Leave cancelled successfully!');
          },
        },
        { text: 'No', style: 'cancel' },
      ]
    );
  }, [leaveDates]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setError(null);

    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
      console.log('Data refreshed');
      Alert.alert('Success', 'Calendar data refreshed!');
    }, 1500);
  }, []);

  useEffect(() => {
    setIsLoading(true);

    // Simulate initial loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const monthNames: string[] = useMemo(() => [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ], []);

  if (isLoading && !refreshing) {
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
            {monthNames[currentMonth]} 2025
          </Text>
        </View>
      </View>

      {/* Error Banner */}
      {error && (
        <View style={calendarScreenStyles.errorContainer}>
          <Text style={calendarScreenStyles.errorText}>{error}</Text>
          <TouchableOpacity style={calendarScreenStyles.retryButton} onPress={onRefresh}>
            <Text style={calendarScreenStyles.retryButtonText}>Retry</Text>
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
        {/* Calendar */}
        <View style={calendarScreenStyles.calendarContainer}>
          <Calendar
            style={calendarScreenStyles.calendar}
            theme={calendarTheme}
            onDayPress={handleDayPress}
            onMonthChange={handleMonthChange}
            markedDates={markedDates}
            markingType={'dot'}
            hideExtraDays={true}
            disableMonthChange={false}
            firstDay={1}
            showWeekNumbers={false}
            enableSwipeMonths={true}
          />
        </View>

        {/* ✅ Updated Legend (removed Scheduled) */}
        <View style={calendarScreenStyles.legendContainer}>
          <Text style={calendarScreenStyles.legendTitle}>Details</Text>
          <View style={calendarScreenStyles.legendGrid}>
            <View style={calendarScreenStyles.legendItem}>
              <View style={[calendarScreenStyles.legendDot, { backgroundColor: colors.delivered }]} />
              <Text style={calendarScreenStyles.legendText}>Delivered</Text>
            </View>
            <View style={calendarScreenStyles.legendItem}>
              <View style={[calendarScreenStyles.legendDot, { backgroundColor: colors.pending }]} />
              <Text style={calendarScreenStyles.legendText}>Pending</Text>
            </View>
            <View style={calendarScreenStyles.legendItem}>
              <View style={[calendarScreenStyles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={calendarScreenStyles.legendText}>Not Delivered</Text>
            </View>
            <View style={calendarScreenStyles.legendItem}>
              <View style={[calendarScreenStyles.legendDot, { backgroundColor: colors.leave }]} />
              <Text style={calendarScreenStyles.legendText}>Leave</Text>
            </View>
          </View>
        </View>

        {/* Monthly Summary */}
        <View style={calendarScreenStyles.summaryContainer}>
          <Text style={calendarScreenStyles.summaryTitle}>September Summary</Text>
          <View style={calendarScreenStyles.summaryGrid}>
            <View style={calendarScreenStyles.summaryItem}>
              <Ionicons
                name="water-outline"
                size={24}
                color={colors.primary}
                style={calendarScreenStyles.summaryIcon}
              />
              <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalMilk}</Text>
              <Text style={calendarScreenStyles.summaryLabel}>Total Milk</Text>
            </View>
            <View style={calendarScreenStyles.summaryItem}>
              <Ionicons
                name="receipt-outline"
                size={24}
                color={colors.success}
                style={calendarScreenStyles.summaryIcon}
              />
              <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalBill}</Text>
              <Text style={calendarScreenStyles.summaryLabel}>Total Bill</Text>
            </View>
            <View style={calendarScreenStyles.summaryItem}>
              <Ionicons
                name="calendar-outline"
                size={24}
                color={colors.danger}
                style={calendarScreenStyles.summaryIcon}
              />
              <Text style={calendarScreenStyles.summaryValue}>{monthlySummary.totalLeaves}</Text>
              <Text style={calendarScreenStyles.summaryLabel}>Total Leaves</Text>
            </View>
          </View>
        </View>

        {/* Leaves Section */}
        <View style={calendarScreenStyles.leavesContainer}>
          <Text style={calendarScreenStyles.leavesTitle}>Upcoming Leaves</Text>
          {upcomingLeaves.length > 0 ? (
            upcomingLeaves.map((leave) => (
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

        {/* Actions */}
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
                Request leave for specific dates
              </Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={16}
              color={colors.gray500}
              style={calendarScreenStyles.actionChevron}
            />
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
              <Text style={calendarScreenStyles.actionTitle}>Apply for Extra Milk</Text>
              <Text style={calendarScreenStyles.actionSubtitle}>
                Request additional milk delivery
              </Text>
            </View>
            <Ionicons
              name="chevron-forward-outline"
              size={16}
              color={colors.gray500}
              style={calendarScreenStyles.actionChevron}
            />
          </TouchableOpacity>
        </View>

        {/* Bill Payment */}
        <View style={calendarScreenStyles.billPayContainer}>
          <Text style={calendarScreenStyles.billPayTitle}>Bill Payment</Text>
          <View style={calendarScreenStyles.billInfo}>
            <Text style={calendarScreenStyles.billAmount}>₹{billInfo.amount}</Text>
            <Text style={calendarScreenStyles.billDueDate}>Due: {billInfo.dueDate}</Text>
            <Text style={[
              calendarScreenStyles.billStatus,
              { color: billInfo.status === 'overdue' ? colors.danger : colors.success },
            ]}>
              Status: {billInfo.status.toUpperCase()}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              calendarScreenStyles.payButton,
              billInfo.status === 'paid' && calendarScreenStyles.payButtonDisabled,
            ]}
            onPress={handlePayBill}
            disabled={billInfo.status === 'paid'}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Text style={[
                calendarScreenStyles.payButtonText,
                billInfo.status === 'paid' && calendarScreenStyles.payButtonTextDisabled,
              ]}>
                {billInfo.status === 'paid' ? 'Already Paid' : 'Pay Now'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ✅ Add the modal components */}
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
}
