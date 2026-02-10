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
  Modal,
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
  fetchDistributorMonthSummary,
  submitDistributorLeaveRequest,
  setCurrentMonth,
  clearError,
  cancelLeave,
} from '../../store/distributorSlice';
import { checkStoredAuth } from '../../store/authSlice';
import SafeAreaWrapper from '../../styles/SafeAreaWrapper';

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
    dots?: Array<{ key?: string; color: string }>;
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
  leave: '#9C27B0', // purple
  delivered: '#009e05ff', // green
  pending_leave: '#2196F3', // blue
  pending: '#FFC107', // amber
  cancelled: '#ff3c00ff', // red
};

// Statuses allowed for vendor viewing (delivery-related only)
const allowedVendorStatuses = ['delivered', 'pending', 'leave', 'pending_leave', 'cancelled'];

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
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.delivered }]} />
        <Text style={calendarScreenStyles.legendText}>Milk Delivered</Text>
      </View>

      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.pending }]} />
        <Text style={calendarScreenStyles.legendText}>Milk Delivery Pending</Text>
      </View>

      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.leave }]} />
        <Text style={calendarScreenStyles.legendText}>Leave</Text>
      </View>

      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.pending_leave }]} />
        <Text style={calendarScreenStyles.legendText}>Pending Leave</Text>
      </View>

      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.cancelled }]} />
        <Text style={calendarScreenStyles.legendText}>Milk Cancelled</Text>
      </View>
      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot]} />
        <Text style={calendarScreenStyles.legendText}></Text>
      </View>
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
}> = React.memo(({ monthlySummary, currentMonth, currentYear, isVendor, leavesCount }) => {
  const totalDays = monthlySummary?.totalDays ?? leavesCount ?? 0;
  const distributed = monthlySummary?.distributed ?? 0;
  const totalMilk = monthlySummary?.totalMilk ?? 0;
  const leaves = monthlySummary?.leaves ?? leavesCount ?? 0;

  return (

    <View style={calendarScreenStyles.summaryContainer}>
      <Text style={calendarScreenStyles.summaryTitle}>
        {monthNames[currentMonth]} {currentYear} - Summary
      </Text>
      <View style={calendarScreenStyles.summaryGrid}>
        <View style={calendarScreenStyles.summaryItem}>
          <Ionicons name="calendar-outline" size={24} color={colors.primary} />
          <Text style={calendarScreenStyles.summaryValue}>{totalDays}</Text>
          <Text style={calendarScreenStyles.summaryLabel}>Total Days</Text>
        </View>

        <View style={calendarScreenStyles.summaryItem}>
          <Ionicons name="checkmark-circle-outline" size={24} color={'#4CAF50'} />
          <Text style={calendarScreenStyles.summaryValue}>{distributed}</Text>
          <Text style={calendarScreenStyles.summaryLabel}>Distributed</Text>
        </View>

        <View style={calendarScreenStyles.summaryItem}>
          <Ionicons name="water-outline" size={24} color={colors.primary} />
          <Text style={calendarScreenStyles.summaryValue}>{totalMilk}L</Text>
          <Text style={calendarScreenStyles.summaryLabel}>Total Milk</Text>
        </View>

        {/* {!isVendor && ( */}
        <View style={calendarScreenStyles.summaryItem}>
          <Ionicons name="calendar-outline" size={24} color={colors.danger} />
          <Text style={calendarScreenStyles.summaryValue}>{leaves}</Text>
          <Text style={calendarScreenStyles.summaryLabel}>Leaves</Text>
        </View>
        {/* )} */}
      </View>
    </View>
  );
});

MonthlySummary.displayName = 'MonthlySummary';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';

  const [year, month, day] = dateStr.split('-');
  return `${day}-${month}-${year}`;
};

// DETAILS MODAL - shows scrollable lists for delivered/pending/cancelled
const DetailsModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  date: string;
  details: any;
  isVendor: boolean;
}> = React.memo(({ visible, onClose, date, details, isVendor }) => {
  if (!visible) return null;

  let countsByStatus: Record<string, number> = (details && details.countsByStatus) || {};
  let namesByStatus: Record<string, string[]> = (details && details.namesByStatus) || {};

  // Fallback: if API returned raw items but not aggregated counts/names, compute them here
  if (details && (!countsByStatus || Object.keys(countsByStatus).length === 0)) {
    countsByStatus = {};
    namesByStatus = {};
    const items = Array.isArray(details.items) ? details.items : [];
    items.forEach((it: any) => {
      const status = it.status || 'pending';
      const name = it.name || (it.customer_name) || null;
      const count = Number(it.customers || it.customers_count || 1) || 1;
      countsByStatus[status] = (countsByStatus[status] || 0) + count;
      if (name) namesByStatus[status] = (namesByStatus[status] || []).concat([name]);
    });
  }

  const statusOrder = ['delivered', 'pending', 'cancelled'];
  const statusLabels: Record<string, string> = {
    delivered: 'Delivered',
    pending: 'Pending',
    cancelled: 'Cancelled',
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 10,
            maxHeight: '70%', // Makes it scrollable
            padding: 20,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 15,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{formatDate(date)} Details</Text>
            <TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
              <Text style={{ fontSize: 16, color: colors.primary }}>Close</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable content */}
          <ScrollView>
            {statusOrder.map((status) => {
              const count = countsByStatus[status] || 0;
              if (isVendor && !allowedVendorStatuses.includes(status)) return null;
              const namesRaw = namesByStatus[status] || [];

              // Split each name by comma and trim
              const names: string[] = namesRaw.flatMap((n: string) =>
                n.split(',').map((name) => name.trim())
              );

              return (
                <View key={status} style={{ marginBottom: 15 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 6 }}>
                    {statusLabels[status] ?? status} : {count}
                  </Text>

                  {count > 0 ? (
                    names.length > 0 ? (
                      names.map((n: string, i: number) => (
                        <View
                          key={`${status}-${i}-${n}`}
                          style={{ paddingVertical: 4 }}
                        >
                          <Text style={{ fontSize: 15 }}>{n}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={{ color: 'black', marginTop: 6 }}>
                        {count} customers (names not available)
                      </Text>
                    )
                  ) : (
                    <Text style={{ color: 'black', marginTop: 6 }}>
                      No {statusLabels[status] ?? status} Records
                    </Text>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
});

DetailsModal.displayName = 'DetailsModal';

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
  const [summaryLoading, setSummaryLoading] = useState(true);

  const distributorId: number | null = useMemo(() => {
    return actualTargetDistributorId || (user?.userID ? parseInt(user.userID.toString(), 10) : null);
  }, [actualTargetDistributorId, user?.userID]);

  const distributorName = useMemo(() => {
    if (actualTargetDistributorName) return actualTargetDistributorName;
    return user?.name || 'Distributor';
  }, [actualTargetDistributorName, user?.name]);

  const isVendor = actualViewerRole === 'vendor';

  const {
    calendarDataByMilkman,
    deliveryTypesByMilkman,
    calendarDetailsByMilkman,
    monthlySummaryByMilkman,
    upcomingLeaves,
    loading,
    error,
    currentMonth,
    currentYear,
  } = useSelector((state: RootState) => state.distributorCalendar);

  // Per-milkman scoped values
  const calendarData = useMemo(() => {
    const key = distributorId ? String(distributorId) : 'null';
    return (calendarDataByMilkman && calendarDataByMilkman[key]) || {};
  }, [calendarDataByMilkman, distributorId]);

  const leaveTypes = useMemo(() => {
    const key = distributorId ? String(distributorId) : 'null';
    return (deliveryTypesByMilkman && deliveryTypesByMilkman[key]) || {};
  }, [deliveryTypesByMilkman, distributorId]);

  const monthlySummary = useMemo(() => {
    const key = distributorId ? String(distributorId) : 'null';
    return (monthlySummaryByMilkman && monthlySummaryByMilkman[key]) || { totalDays: 0, distributed: 0, leaves: 0 };
  }, [monthlySummaryByMilkman, distributorId]);

  const calendarDetails = useMemo(() => {
    const key = distributorId ? String(distributorId) : 'null';
    return (calendarDetailsByMilkman && calendarDetailsByMilkman[key]) || {};
  }, [calendarDetailsByMilkman, distributorId]);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [detailsForModal, setDetailsForModal] = useState<any>(null);
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

        const monthString = `${today.getFullYear()}-${(today.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;

        // First fetch calendar
        dispatch(fetchDistributorCalendarData({ milkmanId: distributorId, month: monthString }));

        // Then fetch summary, with loader
        setSummaryLoading(true);
        dispatch(fetchDistributorMonthSummary({
          milkmanId: distributorId,
          month: today.getMonth() + 1,
          year: today.getFullYear(),
        }))
          .finally(() => setSummaryLoading(false));
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
    const allowedStatuses = ['delivered', 'leave', 'pending_leave', 'cancelled'];

    // 1. Mark leaveTypes statuses
    if (leaveTypes && typeof leaveTypes === 'object') {
      Object.entries(leaveTypes).forEach(([date, status]) => {
        if (typeof status === 'string' && statusColors[status] && allowedStatuses.includes(status)) {
          marks[date] = {
            marked: true,
            dots: [{ key: `${status}_${date}`, color: statusColors[status] }],
          } as any;
        }
      });
    }

    // 2. Mark upcoming leaves - only if not vendor
    if (!isVendor && Array.isArray(leavesForDistributor) && leavesForDistributor.length > 0) {
      leavesForDistributor.forEach((leave: LeaveItem) => {
        if (leave?.date) {
          const leaveStatus = leave.status || 'leave';
          if (allowedStatuses.includes(leaveStatus)) {
            const existing = (marks[leave.date] as any) || {};
            const existingDots = Array.isArray(existing.dots)
              ? existing.dots.slice()
              : (existing.dotColor ? [{ key: `existing_${leave.date}`, color: existing.dotColor }] : []);
            // push this leave dot (use unique key)
            existingDots.push({ key: `${leaveStatus}_${leave.date}`, color: statusColors[leaveStatus] || statusColors.leave });
            marks[leave.date] = {
              ...existing,
              marked: true,
              dots: existingDots,
            } as any;
          }
        }
      });
    }

    // 3. Mark calendarData items if they exist
    if (calendarData && typeof calendarData === 'object') {
      Object.entries(calendarData).forEach(([date, item]) => {
        if (item && typeof item === 'object') {
          const calItem = item as any;
          if (calItem.marked) {
            // prefer multi-dot if provided
            if (Array.isArray(calItem.dots) && calItem.dots.length > 0) {
              marks[date] = {
                ...(marks[date] || {}),
                marked: true,
                dots: calItem.dots,
              } as any;
            } else if (calItem.dotColor) {
              marks[date] = {
                ...(marks[date] || {}),
                marked: true,
                dotColor: calItem.dotColor,
              };
            }
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
        const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
        await dispatch(fetchDistributorCalendarData({ milkmanId: distributorId, month: monthString }));
        const monthMM = (currentMonth + 1).toString().padStart(2, '0');
        const yearYYYY = currentYear.toString();
        await dispatch(fetchDistributorMonthSummary({ milkmanId: distributorId, month: monthMM, year: yearYYYY }));
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
      const details = (calendarDetails && calendarDetails[day.dateString]) || null;

      // If API provided details for this date, decide whether to show list modal or a simple message
      if (details) {
        const { countsByStatus = {}, namesByStatus = {} } = details as any;
        const visibleStatuses = Object.keys(countsByStatus).filter(s => !isVendor || allowedVendorStatuses.includes(s));

        // For consumer lists (delivered/pending/cancelled) open scrollable modal
        const listStatuses = ['delivered', 'pending', 'cancelled'];
        const hasList = visibleStatuses.some(s => listStatuses.includes(s));
        if (hasList) {
          setDetailsForModal(details);
          setSelectedDate(day.dateString);
          setDetailsModalVisible(true);
          return;
        }

        // For leave-like statuses show a simple message
        if (visibleStatuses.includes('leave')) {
          Alert.alert('Status', `Distributor was on leave on ${formatDate(day.dateString)}`);
          return;
        }
        if (visibleStatuses.includes('pending_leave')) {
          Alert.alert('Status', `Leave request pending approval for ${formatDate(day.dateString)}`);
          return;
        }

        Alert.alert('Status', `No visible details for ${day.dateString}`);
        return;
      }

      // Fallback: use leaveTypes (legacy) if present
      const type = leaveTypes[day.dateString];
      if (type) {
        const typeStr = Array.isArray(type) ? type[0] : type;
        if (isVendor && !allowedVendorStatuses.includes(typeStr)) return;

        if (typeStr === 'leave') {
          Alert.alert('Status', `Distributor was on leave on ${day.dateString}`);
          return;
        }
        if (typeStr === 'pending_leave') {
          Alert.alert('Status', `Leave request pending approval for ${day.dateString}`);
          return;
        }

        // For other statuses without details, just show a simple alert
        Alert.alert('Status', `Status: ${typeStr} on ${day.dateString}`);
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

      // Fetch summary with loader
      setSummaryLoading(true);
      dispatch(fetchDistributorMonthSummary({ milkmanId: distributorId, month: month.month, year: month.year }))
        .finally(() => setSummaryLoading(false));
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
    dispatch(fetchDistributorCalendarData({ milkmanId: distributorId, month: monthString }))
      .finally(() => setRefreshing(false));
    dispatch(fetchDistributorMonthSummary({ milkmanId: distributorId, month: currentMonth + 1, year: currentYear }));
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
    <SafeAreaWrapper>
      <View style={calendarScreenStyles.container}>
        <View style={[calendarScreenStyles.header, actualShowBackButton && styles.headerWithBackButton]}>
          {!actualShowBackButton && (
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
              markingType="multi-dot"
              hideExtraDays
              disableMonthChange={false}
              firstDay={1}
              enableSwipeMonths
              current={`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`}
            />
          </View>

          <StatusLegend isVendor={isVendor} />

          {summaryLoading ? (
            <View style={calendarScreenStyles.summaryContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : (
            <MonthlySummary
              monthlySummary={monthlySummary}
              currentMonth={currentMonth}
              currentYear={currentYear}
              isVendor={isVendor}
              leavesCount={leavesForDistributor.length}
            />
          )}

          {/* Only show leave requests and actions for distributors, not vendors */}
          {!isVendor && (
            <>
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
        <DetailsModal
          visible={detailsModalVisible}
          onClose={() => { setDetailsModalVisible(false); setDetailsForModal(null); }}
          date={selectedDate}
          details={detailsForModal}
          isVendor={isVendor}
        />
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  headerWithBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerContent: {
    position: 'absolute',
    top: 25,          // same visual effect as paddingTop
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  backButtonStyle: {
    position: 'absolute',
    left: 16,
    top: 44,          // aligns with title center

    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: '80%',
    padding: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalClose: {
    padding: 6,
  },
  modalSection: {
    marginBottom: 12,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  nameItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  nameText: {
    fontSize: 13,
  },
});

export default DistributorCalendarScreen;