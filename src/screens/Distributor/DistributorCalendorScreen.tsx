
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

interface DistributorCalendarViewerProps {
  viewerRole?: 'distributor' | 'vendor';
  targetDistributorId?: number;
  targetDistributorName?: string;
  showBackButton?: boolean;
}

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

interface LeaveItem {
  id: string;
  date: string;
  reason: string;
  status: string;
}

const statusColors: Record<string, string> = {
  leave: '#9C27B0',
  distributed: '#4CAF50',
  // pending: '#FF9800',
  approved: '#4CAF50',
  missed: '#2196F3',
  cancelled: '#FF5722',
};

// Statuses allowed for vendor viewing (delivery-related only)
const allowedVendorStatuses = ['distributed', 'missed', 'cancelled'];

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

// DISTRIBUTOR-ONLY MODAL
const DistributorModals: React.FC<{
  showLeaveModal: boolean;
  onClose: () => void;
  onSubmit: (data: LeaveRequestData) => void;
  viewerRole: string;
}> = React.memo(({ showLeaveModal, onClose, onSubmit, viewerRole }) => {
  if (viewerRole !== 'distributor') return null;

  return (
    <React.Suspense fallback={null}>
      {showLeaveModal && (
        <LeaveRequestModal
          isVisible={showLeaveModal}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </React.Suspense>
  );
});

DistributorModals.displayName = 'DistributorModals';

// STATUS LEGEND - Role-based filtering
const StatusLegend: React.FC<{ isVendor: boolean }> = React.memo(({ isVendor }) => (
  <View style={calendarScreenStyles.legendContainer}>
    <Text style={calendarScreenStyles.legendTitle}>Status Legend</Text>
    <View style={calendarScreenStyles.legendGrid}>
      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.distributed }]} />
        <Text style={calendarScreenStyles.legendText}>Distributed</Text>
      </View>

      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.missed }]} />
        <Text style={calendarScreenStyles.legendText}>Missed</Text>
      </View>

      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.cancelled }]} />
        <Text style={calendarScreenStyles.legendText}>Cancelled</Text>
      </View>

      {/* Hide leave for vendors */}
      {!isVendor && (
        <>
          <View style={calendarScreenStyles.legendItem}>
            <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.leave }]} />
            <Text style={calendarScreenStyles.legendText}>Leave</Text>
          </View>

          {/* <View style={calendarScreenStyles.legendItem}>
            <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.pending }]} />
            <Text style={calendarScreenStyles.legendText}>Pending</Text>
          </View> */}
        </>
      )}
    </View>
  </View>
));

StatusLegend.displayName = 'StatusLegend';

// MONTHLY SUMMARY
const MonthlySummary: React.FC<{
  monthlySummary: any;
  currentMonth: number;
  currentYear: number;
  isVendor: boolean;
  leavesCount: number;
}> = React.memo(({ monthlySummary, currentMonth, currentYear, isVendor, leavesCount }) => (
  <View style={calendarScreenStyles.summaryContainer}>
    <Text style={calendarScreenStyles.summaryTitle}>
      {monthNames[currentMonth]} {currentYear} - Summary
    </Text>
    <View style={calendarScreenStyles.summaryGrid}>
      <View style={calendarScreenStyles.summaryItem}>
        <Ionicons name="calendar-outline" size={24} color={colors.primary} />
        <Text style={calendarScreenStyles.summaryValue}>{leavesCount || 0}</Text>
        <Text style={calendarScreenStyles.summaryLabel}>Total Days</Text>
      </View>

      <View style={calendarScreenStyles.summaryItem}>
        <Ionicons name="checkmark-circle-outline" size={24} color={'#4CAF50'} />
        <Text style={calendarScreenStyles.summaryValue}>{monthlySummary?.approvedLeaves || 0}</Text>
        <Text style={calendarScreenStyles.summaryLabel}>Distributed</Text>
      </View>

      {/* Hide leaves count for vendors */}
      {!isVendor && (
        <View style={calendarScreenStyles.summaryItem}>
          <Ionicons name="remove-circle-outline" size={24} color={'#9C27B0'} />
          <Text style={calendarScreenStyles.summaryValue}>{leavesCount}</Text>
          <Text style={calendarScreenStyles.summaryLabel}>Leaves</Text>
        </View>
      )}
    </View>
  </View>
));

MonthlySummary.displayName = 'MonthlySummary';

const DistributorCalendarScreen: React.FC<DistributorCalendarViewerProps> = ({
  viewerRole = 'distributor',
  targetDistributorId,
  targetDistributorName,
  showBackButton = false,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as {
    viewerRole?: 'distributor' | 'vendor';
    targetDistributorId?: number;
    targetDistributorName?: string;
    showBackButton?: boolean;
  } || {};

  const actualViewerRole = routeParams.viewerRole || viewerRole;
  const actualTargetDistributorId = routeParams.targetDistributorId || targetDistributorId;
  const actualTargetDistributorName = routeParams.targetDistributorName || targetDistributorName;
  const actualShowBackButton = routeParams.showBackButton !== undefined
    ? routeParams.showBackButton
    : showBackButton;

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const distributorId: number | null = useMemo(() => {
    return actualTargetDistributorId || (user?.userID ? parseInt(user.userID.toString(), 10) : null);
  }, [actualTargetDistributorId, user?.userID]);

  const distributorName = useMemo(() => {
    if (actualTargetDistributorName) return actualTargetDistributorName;
    return user?.name || 'Distributor';
  }, [actualTargetDistributorName, user?.name]);

  const isVendor = actualViewerRole === 'vendor';

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

  // Prevent modals from opening when vendor is viewing
  useEffect(() => {
    if (isVendor) {
      setShowLeaveModal(false);
    }
  }, [isVendor]);

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
    }, [distributorId, isAuthenticated, dispatch])
  );

  // Filter leaves - hide for vendors
  const leavesForDistributor = useMemo(() => {
    if (distributorId == null || isVendor) return [];
    const leaves = upcomingLeaves[distributorId];
    return Array.isArray(leaves) ? leaves : [];
  }, [distributorId, upcomingLeaves, isVendor]);

  // Build marked dates with role-based filtering - FIXED
  const markedDates: MarkedDates = useMemo(() => {
    const marks: MarkedDates = {};

    // Determine allowed statuses based on viewer role
    const allowedStatuses = isVendor
      ? allowedVendorStatuses
      : ['distributed', 'missed', 'cancelled', 'leave', 'pending', 'approved'];

    // 1. Mark leaveTypes statuses
    if (leaveTypes && typeof leaveTypes === 'object') {
      Object.entries(leaveTypes).forEach(([date, status]) => {
        if (typeof status === 'string' && statusColors[status] && allowedStatuses.includes(status)) {
          marks[date] = {
            marked: true,
            dotColor: statusColors[status],
          };
        }
      });
    }

    // 2. Mark upcoming leaves - only if not vendor
    if (!isVendor && Array.isArray(leavesForDistributor) && leavesForDistributor.length > 0) {
      leavesForDistributor.forEach((leave: LeaveItem) => {
        if (leave?.date) {
          const leaveStatus = leave.status || 'leave';
          if (allowedStatuses.includes(leaveStatus)) {
            marks[leave.date] = {
              ...(marks[leave.date] || {}),
              marked: true,
              dotColor: statusColors[leaveStatus] || statusColors.leave,
            };
          }
        }
      });
    }

    // 3. Mark calendarData items if they exist
    if (calendarData && typeof calendarData === 'object') {
      Object.entries(calendarData).forEach(([date, item]) => {
        if (item && typeof item === 'object') {
          const calItem = item as any;
          if (calItem.marked && calItem.dotColor) {
            marks[date] = {
              ...(marks[date] || {}),
              marked: true,
              dotColor: calItem.dotColor,
            };
          }
        }
      });
    }

    // 4. Highlight selected date
    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: colors.primary,
      };
    }

    return marks;
  }, [leaveTypes, leavesForDistributor, calendarData, selectedDate, isVendor]);

  const handleLeaveSubmit = useCallback(
    async (leaveData: LeaveRequestData) => {
      if (isVendor || !distributorId) {
        Alert.alert('Error', 'You do not have permission to submit leave requests');
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
    [distributorId, dispatch, isVendor]
  );

  const handleDayPress = useCallback(
    (day: DateData) => {
      setSelectedDate(day.dateString);
      const type = leaveTypes[day.dateString];
      if (type) {
        // Vendors shouldn't see leave details
        if (isVendor && !allowedVendorStatuses.includes(type)) return;

        const messages: Record<string, string> = {
          leave: 'Distributor on leave',
          distributed: 'Milk distributed',
          missed: 'Delivery missed',
          cancelled: 'Delivery cancelled',
          pending: 'Leave request pending',
          approved: 'Leave approved - milk distributed',
        };
        Alert.alert('Status', `${messages[type] ?? `Status: ${type}`} on ${day.dateString}`);
      }
    },
    [leaveTypes, isVendor]
  );

  const handleMonthChange = useCallback(
    (month: DateData) => {
      if (!distributorId) return;

      dispatch(setCurrentMonth({ month: month.month - 1, year: month.year }));

      const monthString = `${month.year}-${month.month.toString().padStart(2, '0')}`;
      dispatch(fetchDistributorCalendarData({ milkmanId: distributorId, month: monthString }));
    },
    [dispatch, distributorId]
  );

  const handleApplyLeave = useCallback(() => {
    if (isVendor) {
      Alert.alert('Error', 'You do not have permission to apply for leave');
      return;
    }
    if (!distributorId) {
      Alert.alert('Error', 'Please login first');
      return;
    }
    setShowLeaveModal(true);
  }, [distributorId, isVendor]);

  const handleCancelLeave = useCallback(
    (leaveId: string, leaveDate: string) => {
      if (isVendor) {
        Alert.alert('Error', 'You do not have permission to cancel leave requests');
        return;
      }

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
    [dispatch, distributorId, isVendor]
  );

  const onRefresh = useCallback(() => {
    if (!distributorId) return;
    setRefreshing(true);
    dispatch(clearError());
    const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
    dispatch(fetchDistributorCalendarData({ milkmanId: distributorId, month: monthString })).finally(() =>
      setRefreshing(false)
    );
  }, [currentMonth, currentYear, distributorId, dispatch]);

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
            {distributorName} - Calendar
          </Text>
          <View style={calendarScreenStyles.monthSelector}>
            <Text style={calendarScreenStyles.monthText}>
              {monthNames[currentMonth]} {currentYear}
            </Text>
          </View>
          {distributorId && (
            <Text style={calendarScreenStyles.customerIdText}>Distributor ID: {distributorId}</Text>
          )}
        </View>
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

        <StatusLegend isVendor={isVendor} />

        <MonthlySummary
          monthlySummary={monthlySummary}
          currentMonth={currentMonth}
          currentYear={currentYear}
          isVendor={isVendor}
          leavesCount={leavesForDistributor.length}
        />

        {/* Only show leave requests and actions for distributors, not vendors */}
        {!isVendor && (
          <>
            {/* <View style={calendarScreenStyles.leavesContainer}>
              <Text style={calendarScreenStyles.leavesTitle}>Leave Requests</Text>
              {leavesForDistributor.length === 0 ? (
                <Text style={calendarScreenStyles.noLeavesText}>No leave requests</Text>
              ) : (
                leavesForDistributor.map((leave: LeaveItem) => (
                  <View key={leave.id} style={calendarScreenStyles.leaveItem}>
                    <View style={calendarScreenStyles.leaveItemContent}>
                      <Text style={calendarScreenStyles.leaveDate}>{leave.date}</Text>
                      <Text style={calendarScreenStyles.leaveReason}>
                        {leave.reason}
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
            </View> */}

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
          </>
        )}
      </ScrollView>

      {actualViewerRole === 'distributor' && (
        <DistributorModals
          viewerRole={actualViewerRole}
          showLeaveModal={showLeaveModal}
          onClose={() => setShowLeaveModal(false)}
          onSubmit={handleLeaveSubmit}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default DistributorCalendarScreen;
