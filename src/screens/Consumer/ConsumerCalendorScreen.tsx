import React, { useEffect, useCallback, useMemo, useState, useRef } from 'react';
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
  fetchConsumerSummary,
  cancelLeave,
} from '../../store/calendarSlice';
import { selectConsumers } from '../../store/consumersSlice';
import { checkStoredAuth } from '../../store/authSlice';
import { getUnreadCount, markAllAsRead, showLocalNotification, notificationEmitter } from "../../notifications/NotificationService";
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import SafeAreaWrapper from '../../styles/SafeAreaWrapper';
import RatingModal from '../../screens/RatingModal';
import {
  incrementAppOpen,
  shouldShowRating,
} from '../../utils/ratingManager';

const SEEN_CUSTOMERS_KEY = 'seen_consumers_v1';

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
}

const statusColors: Record<string, string> = {
  delivered: '#009e05ff',
  vendor_unavailable: '#F44336',
  distributor_unavailable: '#F44336',
  cancelled: '#ff3c00ff',
  leave: '#9C27B0',
  delivered_extra_milk: '#45ca49ff',
  extra_milk: '#FFC107',
  pending_extra_milk: '#2196F3',
  customer_paused: '#9C27B0',
  missed: '#2196F3',
  not_requested: '#FF9800',
};

// Statuses allowed for vendor viewing (delivery-related only)
const allowedVendorStatuses = ['delivered', 'vendor_unavailable', 'distributor_unavailable', 'cancelled', 'missed'];

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
  if (viewerRole !== 'consumer') { return null; }

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

// STATUS LEGEND - Role-based filtering
const StatusLegend: React.FC<{ isDistributor: boolean; isVendor: boolean }> = React.memo(({ isDistributor, isVendor }) => (
  <View style={calendarScreenStyles.legendContainer}>
    <Text style={calendarScreenStyles.legendTitle}>
      {isDistributor ? 'My Delivery Record' : 'Status Legend'}
    </Text>
    <View style={calendarScreenStyles.legendGrid}>
      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.delivered }]} />
        <Text style={calendarScreenStyles.legendText}>Delivered</Text>
      </View>

      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.cancelled }]} />
        <Text style={calendarScreenStyles.legendText}>Cancel Delivery</Text>
      </View>

      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.leave }]} />
        <Text style={calendarScreenStyles.legendText}>
          {isDistributor ? 'Leave' : 'Leave'}
        </Text>
      </View>

      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.extra_milk }]} />
        <Text style={calendarScreenStyles.legendText}>Extra Milk</Text>
      </View>

      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.pending_extra_milk }]} />
        <Text style={calendarScreenStyles.legendText}>Pending Extra Milk</Text>
      </View>

      <View style={calendarScreenStyles.legendItem}>
        <View style={[calendarScreenStyles.legendDot, { backgroundColor: statusColors.delivered_extra_milk }]} />
        <Text style={calendarScreenStyles.legendText}>Extra Milk Delivered</Text>
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
  isDistributor: boolean;
  isVendor: boolean;
  leavesCount: number;
}> = React.memo(({ monthlySummary, currentMonth, currentYear, isDistributor, isVendor, leavesCount }) => {
  const formatMilkQuantity = (quantity: number | string) => {
    const num = typeof quantity === 'string' ? parseFloat(quantity) : quantity;
    if (isNaN(num)) { return '0L'; }
    return `${num}L`;
  };

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) { return '₹0'; }
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
          <Text style={calendarScreenStyles.summaryLabel}>Total Deliveries</Text>
        </View>

        <View style={calendarScreenStyles.summaryItem}>
          <Ionicons name="calendar-outline" size={24} color={colors.danger} />
          <Text style={calendarScreenStyles.summaryValue}>{leavesCount || 0}</Text>
          <Text style={calendarScreenStyles.summaryLabel}>
            {isDistributor ? 'Customer Leaves' : 'Total Leaves'}
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
  const [summaryLoading, setSummaryLoading] = useState(true);

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
    if (actualTargetConsumerName) { return actualTargetConsumerName; }

    if (customerId && consumers?.length) {
      const consumer = consumers.find(c => c?.customer_id === customerId);
      if (consumer?.customer_name) { return consumer.customer_name; }
    }

    return user?.name || 'Consumer';
  }, [actualTargetConsumerName, customerId, consumers, user?.name]);

  const isDistributor = actualViewerRole === 'distributor';
  const isVendor = actualViewerRole === 'vendor';

  const {
    calendarDataByCustomer = {},
    deliveryTypesByCustomer = {},
    upcomingLeaves = {},
    upcomingMilkRequests = {},
    monthlySummaryByCustomer = {},
    loading = false,
    currentMonth = new Date().getMonth(),
    currentYear = new Date().getFullYear(),
  } = useSelector((state: RootState) => state.calendar as any);

  const deliveryTypes: Record<string, string[] | string> = useMemo(() => {
    if (!customerId) { return {}; }
    return deliveryTypesByCustomer[String(customerId)] || {};
  }, [deliveryTypesByCustomer, customerId]);

  const calendarDataForCustomer = useMemo(() => {
    if (!customerId) { return {}; }
    return calendarDataByCustomer[String(customerId)] || {};
  }, [calendarDataByCustomer, customerId]);

  const monthlySummary = useMemo(() => {
    if (!customerId) { return {}; }
    return monthlySummaryByCustomer[String(customerId)] || {};
  }, [monthlySummaryByCustomer, customerId]);

  const [modalState, setModalState] = useState({
    showLeaveModal: false,
    showExtraMilkModal: false,
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const prevCustomerRef = useRef<number | null>(null);
  const fetchedCustomerIds = useRef<Set<number>>(new Set());
  const [localDeliveryTypes, setLocalDeliveryTypes] = useState<Record<string, string> | null>(null);
  const [localCalendarData, setLocalCalendarData] = useState<Record<string, any> | null>(null);
  const [localMonthlySummary, setLocalMonthlySummary] = useState<any | null>(null);
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    const checkRating = async () => {
      try {
        await incrementAppOpen();
        const shouldShow = await shouldShowRating();

        if (shouldShow) {
          setShowRating(true);
        }
      } catch (e) {
        console.log('Rating check error', e);
      }
    };

    // slight delay so UI loads first
    const timer = setTimeout(checkRating, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Helper to normalize date strings
  const normalizeDate = useCallback((dateStr: string) => {
    if (!dateStr) { return ''; }
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) { return ''; }
      return d.toISOString().split('T')[0];
    } catch (e) {
      console.error('Date normalization error:', e);
      return '';
    }
  }, []);

  const handleModalToggle = useCallback((modalType: 'leave' | 'extraMilk', isOpen: boolean) => {
    if (isDistributor || isVendor) { return; }

    setModalState(prev => ({
      ...prev,
      [`show${modalType === 'leave' ? 'Leave' : 'ExtraMilk'}Modal`]: isOpen,
    }));
  }, [isDistributor, isVendor]);

  const openLeaveModal = useCallback(() => handleModalToggle('leave', true), [handleModalToggle]);
  const openExtraMilkModal = useCallback(() => handleModalToggle('extraMilk', true), [handleModalToggle]);
  const closeLeaveModal = useCallback(() => handleModalToggle('leave', false), [handleModalToggle]);
  const closeExtraMilkModal = useCallback(() => handleModalToggle('extraMilk', false), [handleModalToggle]);

  useEffect(() => {
    if (isDistributor || isVendor) {
      setModalState({ showLeaveModal: false, showExtraMilkModal: false });
    }
  }, [isDistributor, isVendor]);

  useEffect(() => {
    dispatch(checkStoredAuth());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      if (customerId !== null && isAuthenticated) {
        const now = new Date();
        dispatch(setCurrentMonth({ month: now.getMonth(), year: now.getFullYear() }));

        const monthString = `${now.getFullYear()}-${(now.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;

        if (prevCustomerRef.current !== customerId) {
          (async () => {
            try {
              setSummaryLoading(true); // start loader

              // FIRST: fetch calendar
              await dispatch(fetchCalendarData({ customerId, month: monthString }));

              // THEN: fetch summary
              const monthMM = (now.getMonth() + 1).toString().padStart(2, '0');
              const yearYYYY = now.getFullYear().toString();
              await dispatch(fetchConsumerSummary({ customerId, month: monthMM, year: yearYYYY }));

            } catch (e) {
              console.warn('Calendar/Summary fetch failed', e);
            } finally {
              setSummaryLoading(false); // stop loader
            }
          })();

          prevCustomerRef.current = customerId;
        }
      }
    }, [customerId, isAuthenticated, dispatch])
  );

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

    // Handle FCM foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log("Foreground message:", remoteMessage);
        const notificationRaw = remoteMessage.notification || {
          title: remoteMessage.data?.title,
          body: remoteMessage.data?.body,
        };
        const notification = {
          title: typeof notificationRaw.title === "string" ? notificationRaw.title : JSON.stringify(notificationRaw.title),
          body: typeof notificationRaw.body === "string" ? notificationRaw.body : JSON.stringify(notificationRaw.body),
        };
        await showLocalNotification(notification);
      }
    });

    return () => {
      unsubscribe();
      notificationEmitter.removeListener('newNotification', updateBadge);
    };
  }, []);

  // Filter leaves - hide for vendors
  const leavesForCustomer = useMemo(() => {
    if (!customerId || !upcomingLeaves || isVendor) { return []; }
    const value = upcomingLeaves[customerId];
    return Array.isArray(value) ? value : [];
  }, [upcomingLeaves, customerId, isVendor]);

  // Filter extra milk - hide for vendors
  const milkRequestsForCustomer = useMemo(() => {
    if (!customerId || !upcomingMilkRequests || isVendor) { return []; }
    const value = upcomingMilkRequests[customerId];
    return Array.isArray(value) ? value : [];
  }, [upcomingMilkRequests, customerId, isVendor]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';

    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  // Build marked dates with role-based filtering
  const markedDates: MarkedDates = useMemo(() => {
    const marks: MarkedDates = {};

    const allowedStatuses = ['delivered', 'vendor_unavailable', 'pending_extra_milk', 'distributor_unavailable', 'cancelled', 'leave', 'extra_milk', 'delivered_extra_milk', 'customer_paused', 'missed', 'not_requested'];

    const allStatusesPerDate: Record<string, string[]> = {};

    // 1. Delivery status data from Redux store
    if (deliveryTypes && typeof deliveryTypes === 'object') {
      Object.entries(deliveryTypes).forEach(([dateRaw, statusOrArray]) => {
        const date = normalizeDate(dateRaw);
        if (!date) { return; }

        const statuses = Array.isArray(statusOrArray) ? statusOrArray : [statusOrArray as any];
        statuses.forEach((status) => {
          if (allowedStatuses.includes(status)) {
            if (!allStatusesPerDate[date]) { allStatusesPerDate[date] = []; }
            allStatusesPerDate[date].push(status);
          }
        });
      });
    }

    // 2. Customer leaves - only if not vendor
    if (!isVendor && Array.isArray(leavesForCustomer) && leavesForCustomer.length > 0) {
      leavesForCustomer.forEach((leave: LeaveItem) => {
        const date = normalizeDate(leave?.date);
        if (date) {
          if (!allStatusesPerDate[date]) { allStatusesPerDate[date] = []; }
          if (!allStatusesPerDate[date].includes('leave')) {
            allStatusesPerDate[date].push('leave');
          }
        }
      });
    }

    // 3. Skip duplicating extra milk from upcomingMilkRequests — pending_extra_milk status is already in deliveryTypes

    // 4. Past delivery history from consumers Redux state
    if (customerId && Array.isArray(consumers) && consumers.length > 0) {
      const consumerData = consumers.find(c => c?.customer_id === customerId);

      if (consumerData?.deliveryHistory && Array.isArray(consumerData.deliveryHistory)) {
        consumerData.deliveryHistory.forEach((delivery) => {
          const date = normalizeDate(delivery?.date);
          const status = delivery?.status;

          if (date && status && allowedStatuses.includes(status)) {
            if (!allStatusesPerDate[date]) { allStatusesPerDate[date] = []; }
            if (!allStatusesPerDate[date].includes(status)) {
              allStatusesPerDate[date].push(status);
            }
          }
        });
      }
    }

    // Create dots for each date
    Object.entries(allStatusesPerDate).forEach(([date, statuses]) => {
      const uniqueStatuses = Array.from(new Set(statuses));
      marks[date] = {
        dots: uniqueStatuses.map((status) => ({
          key: `${status}-${date}`,
          color: statusColors[status] || '#757575',
          selectedDotColor: statusColors[status] || '#757575',
        })),
      };
    });

    // Highlight selected date
    if (selectedDate) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: colors.primary,
      };
    }

    return marks;
  }, [
    deliveryTypes,
    leavesForCustomer,
    milkRequestsForCustomer,
    selectedDate,
    consumers,
    customerId,
    normalizeDate,
    isVendor,
  ]);

  // Debug: log per-customer delivery types and markedDates to help diagnose missing dots
  useEffect(() => {
    try {
      console.log('🧭 Calendar Debug - customerId:', customerId);
      console.log('  deliveryTypes for customer:', deliveryTypes);
      console.log('  calendarDataForCustomer (sample 5):', Object.keys(calendarDataForCustomer || {}).slice(0, 5));
      const markedKeys = Object.keys(markedDates || {});
      console.log('  markedDates count:', markedKeys.length, 'sample:', markedKeys.slice(0, 5));
    } catch (e) {
      // swallow logging errors
      console.error('Calendar debug error:', e);
    }
  }, [customerId, deliveryTypes, calendarDataForCustomer, markedDates]);

  const handleDayPress = useCallback((day: DateData) => {
    setSelectedDate(day.dateString);

    // Check for extra milk requests first
    const extraMilkForDate = milkRequestsForCustomer.find(
      (request: ExtraMilkItem) => normalizeDate(request?.date) === day.dateString
    );

    // Check for leave requests
    const leaveForDate = leavesForCustomer.find(
      (leave: LeaveItem) => normalizeDate(leave?.date) === day.dateString
    );

    if (leaveForDate) {
      Alert.alert(
        'Leave',
        `On leave 🏠 on ${formatDate(day.dateString)}`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Check delivery history from consumers Redux state
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
            case 'missed':
              return isDistributor ? 'Delivery was missed ❌' : 'Missed ❌';
            default:
              return status;
          }
        };
      }
    }

    // Check calendar delivery types (may contain multiple statuses per date)
    if (deliveryTypes && typeof deliveryTypes === 'object') {
      const statusOrArray = deliveryTypes[day.dateString];
      if (statusOrArray) {
        const statuses = Array.isArray(statusOrArray) ? statusOrArray : [statusOrArray as any];

        const messageMap: Record<string, string> = isDistributor
          ? {
            delivered: 'Daily milk delivered successfully ✅',
            vendor_unavailable: 'You were unavailable ❌',
            distributor_unavailable: 'You were unavailable ❌',
            cancelled: 'You cancelled delivery ❌',
            leave: 'Customer was on leave 🏠',
            missed: 'Delivery was missed ❌',
            extra_milk: 'Customer requested extra milk 🥛',
            pending_extra_milk: 'Extra milk request pending for approval 🥛',
            delivered_extra_milk: 'Extra milk delivered 🥛✅',
          }
          : {
            delivered: 'Daily milk delivered successfully ✅',
            vendor_unavailable: 'Vendor unavailable ❌',
            distributor_unavailable: 'Distributor unavailable ❌',
            cancelled: 'Delivery cancelled ❌',
            leave: 'On leave 🏠',
            extra_milk: 'Extra milk requested 🥛',
            delivered_extra_milk: 'Extra milk delivered 🥛✅',
            missed: 'Delivery missed ❌',
            pending_extra_milk: 'Extra milk request pending for approval 🥛',
          };

        const messagesToShow = statuses
          .map(s => messageMap[s])
          .filter(Boolean) as string[];

        if (messagesToShow.length > 0) {
          Alert.alert('Status', `${messagesToShow.join('\n')}
on ${formatDate(day.dateString)}`, [{ text: 'OK' }]);
        }
      }
    }
  }, [
    deliveryTypes,
    consumers,
    customerId,
    isDistributor,
    isVendor,
    milkRequestsForCustomer,
    leavesForCustomer,
    normalizeDate,
  ]);

  const handleMonthChange = useCallback(
    async (month: any) => {
      if (customerId === null) return;

      const newMonth = month.month - 1;
      const newYear = month.year;

      dispatch(setCurrentMonth({ month: newMonth, year: newYear }));

      const monthString = `${newYear}-${month.month.toString().padStart(2, '0')}`;

      try {
        setSummaryLoading(true);

        // 1.calendar first
        await dispatch(fetchCalendarData({ customerId, month: monthString }));

        // 2.summary after calendar
        const monthMM = month.month.toString().padStart(2, '0');
        const yearYYYY = month.year.toString();
        await dispatch(fetchConsumerSummary({ customerId, month: monthMM, year: yearYYYY }));
      } finally {
        setSummaryLoading(false);
      }
    },
    [customerId, dispatch]
  );

  const onRefresh = useCallback(async () => {
    if (customerId === null) return;

    setRefreshing(true);
    setSummaryLoading(true);
    dispatch(clearError());

    try {
      const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;

      // calendar first
      await dispatch(fetchCalendarData({ customerId, month: monthString }));

      // summary next
      const monthMM = (currentMonth + 1).toString().padStart(2, '0');
      const yearYYYY = currentYear.toString();
      await dispatch(fetchConsumerSummary({ customerId, month: monthMM, year: yearYYYY }));
    } finally {
      setRefreshing(false);
      setSummaryLoading(false);
    }
  }, [customerId, currentMonth, currentYear, dispatch]);

  const handleLeaveSubmit = useCallback(async (leaveData: LeaveRequestData) => {
    if (isDistributor || isVendor || customerId === null) { return; }

    try {
      await dispatch(submitLeaveRequest({ customerId, leaveData }));
      const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
      await dispatch(fetchCalendarData({ customerId, month: monthString }));
      const monthMM = (currentMonth + 1).toString().padStart(2, '0');
      const yearYYYY = currentYear.toString();
      await dispatch(fetchConsumerSummary({ customerId, month: monthMM, year: yearYYYY }));
      Alert.alert('Success', 'Leave request submitted successfully!');
      closeLeaveModal();
    } catch (err) {
      Alert.alert('Error', typeof err === 'string' ? err : 'Failed to submit leave request');
    }
  }, [isDistributor, isVendor, customerId, dispatch, currentMonth, currentYear, closeLeaveModal]);

  const handleExtraMilkSubmit = useCallback(async (extraMilkData: ExtraMilkData) => {
    if (isDistributor || isVendor || customerId === null) { return; }

    try {
      await dispatch(submitExtraMilk({ customerId, milkData: extraMilkData }));
      const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
      await dispatch(fetchCalendarData({ customerId, month: monthString }));
      const monthMM = (currentMonth + 1).toString().padStart(2, '0');
      const yearYYYY = currentYear.toString();
      await dispatch(fetchConsumerSummary({ customerId, month: monthMM, year: yearYYYY }));
      Alert.alert('Success', 'Extra milk request submitted successfully!');
      closeExtraMilkModal();
    } catch (err) {
      Alert.alert('Error', typeof err === 'string' ? err : 'Failed to request extra milk');
    }
  }, [isDistributor, isVendor, customerId, dispatch, currentMonth, currentYear, closeExtraMilkModal]);

  const handleCancelLeave = useCallback((leaveId: string, leaveDate: string) => {
    if (isDistributor || isVendor || customerId === null) { return; }

    Alert.alert('Cancel Leave', `Cancel leave for ${leaveDate}?`, [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          dispatch(cancelLeave({ leaveId, leaveDate, customerId }));
          const monthString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}`;
          await dispatch(fetchCalendarData({ customerId, month: monthString }));
          const monthMM = (currentMonth + 1).toString().padStart(2, '0');
          const yearYYYY = currentYear.toString();
          await dispatch(fetchConsumerSummary({ customerId, month: monthMM, year: yearYYYY }));
          Alert.alert('Success', 'Leave cancelled successfully!');
        },
      },
    ]);
  }, [isDistributor, isVendor, customerId, dispatch, currentMonth, currentYear]);

  if (!isAuthenticated || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
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

          {/* Notification Icon - Placeholder for future implementation */}
          {!isVendor && !isDistributor && (
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={async () => {
                await markAllAsRead();
                setNotificationCount(0);
                (navigation as any).navigate('Notifications');
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
          )}
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
          <View style={calendarScreenStyles.calendarContainer}>
            <Calendar
              style={calendarScreenStyles.calendar}
              theme={calendarTheme}
              onDayPress={handleDayPress}
              onMonthChange={handleMonthChange}
              markedDates={markedDates}
              markingType="multi-dot"
              hideExtraDays={true}
              disableMonthChange={false}
              firstDay={1}
              enableSwipeMonths={true}
              current={`${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`}
            />
          </View>

          <StatusLegend isDistributor={isDistributor} isVendor={isVendor} />

          {summaryLoading ? (
            <View style={calendarScreenStyles.summaryContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
            </View>
          ) : (
            <MonthlySummary
              monthlySummary={monthlySummary}
              currentMonth={currentMonth}
              currentYear={currentYear}
              isDistributor={isDistributor}
              isVendor={isVendor}
              leavesCount={monthlySummary?.totalLeaves ?? leavesForCustomer.length}
            />
          )}

          {/* Only show action buttons and lists for actual consumer, not distributor or vendor viewing */}
          {!isDistributor && !isVendor && (
            <>
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

      {/* Rating Modal */}
      <RatingModal
        visible={showRating}
        onClose={() => setShowRating(false)}
      />
    </SafeAreaWrapper>
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

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  notificationButton: {
    position: 'absolute',
    right: 16,
    top: 44,

    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default React.memo(ConsumerCalendarScreen);