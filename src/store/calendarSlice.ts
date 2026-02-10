import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import {
  getConsumerCalendar,
  applyForLeave,
  requestExtraMilk,
  getConsumerSummary
} from '../apiServices/allApi';

interface DeliveryCalendarItem {
  date: string;
  status: string;
  remarks?: string;
}

interface CustomMarking {
  marked?: boolean;
  dotColor?: string;
  dots?: Array<{
    key: string;
    color: string;
    selectedDotColor?: string;
  }>;
  selected?: boolean;
  selectedColor?: string;
}

export interface LeaveItem {
  id: string;
  date: string;
  reason: string;
  status: 'approved' | 'pending' | 'cancelled';
}

export interface ExtraMilkItem {
  id: string;
  date: string;
  quantity: number;
  reason: string;
  status: 'approved' | 'pending' | 'cancelled';
}

interface MonthlySummary {
  totalMilk: number;
  totalBill: number;
  totalLeaves: number;
  totalDeliveries: number;
}

interface CalendarState {
  // store calendar data scoped by customerId to avoid cross-customer merges
  calendarDataByCustomer: Record<string, { [date: string]: CustomMarking }>;
  deliveryTypesByCustomer: Record<string, Record<string, string[]>>;
  upcomingLeaves: Record<number, LeaveItem[]>;
  upcomingMilkRequests: Record<number, ExtraMilkItem[]>;
  // per-customer monthly summaries
  monthlySummaryByCustomer: Record<string, MonthlySummary>;
  loading: boolean;
  error: string | null;
  currentMonth: number;
  currentYear: number;
  lastUpdated: number | null;
  lastFetchedMonths: string[];
}

const initialState: CalendarState = {
  calendarDataByCustomer: {},
  deliveryTypesByCustomer: {},
  upcomingLeaves: {},
  upcomingMilkRequests: {},
  monthlySummaryByCustomer: {},
  loading: false,
  error: null,
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  lastUpdated: null,
  lastFetchedMonths: [],
};

// ✅ Date normalization utility
const normalizeDateFormat = (dateStr: string): string => {
  if (!dateStr) { return ''; }

  // Already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // Convert DD-MM-YYYY to YYYY-MM-DD
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  }

  // Convert DD/MM/YYYY to YYYY-MM-DD
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  // Try parsing as Date object
  try {
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0];
    }
  } catch (e) {
    console.error('Failed to normalize date:', dateStr, e);
  }

  return dateStr;
};

export const fetchCalendarData = createAsyncThunk(
  'calendar/fetchCalendarData',
  async (params: { customerId: number; month: string }, thunkAPI) => {
    try {
      console.log('📡 Fetching calendar data:', params);
      const response = await getConsumerCalendar({
        customer_id: params.customerId,
        month: params.month,
      });

      console.log('🔍 RAW API Response:', {
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        keys: response.data ? Object.keys(response.data) : [],
        hasData: !!response.data,
      });

      // ✅ Extract actual calendar array from response
      let calendarArray: any[] = [];
      let summaryData: any = null;

      // Handle different response structures
      if (Array.isArray(response.data)) {
        calendarArray = response.data;
        console.log('✅ Direct array response');
      } else if (response.data && typeof response.data === 'object') {
        // Nested response structure
        if (Array.isArray(response.data.data)) {
          calendarArray = response.data.data;
          console.log('✅ Extracted from response.data.data');

          // ✅ Extract summary if it exists
          summaryData = {
            totalMilk: response.data.total_milk || response.data.totalMilk || '0L',
            totalBill: response.data.total_bill || response.data.totalBill || '₹0',
            totalDeliveries: response.data.total_deliveries || response.data.totalDeliveries || 0,
            totalLeaves: response.data.total_leaves || response.data.totalLeaves || 0,
          };

          console.log('📊 Extracted summary from response:', summaryData);
        } else if (Array.isArray(response.data.calendar)) {
          calendarArray = response.data.calendar;
          console.log('✅ Extracted from response.data.calendar');

          summaryData = {
            totalMilk: response.data.total_milk || '0L',
            totalBill: response.data.total_bill || '₹0',
            totalDeliveries: response.data.total_deliveries || 0,
            totalLeaves: response.data.total_leaves || 0,
          };
        } else if (Array.isArray(response.data.deliveries)) {
          calendarArray = response.data.deliveries;
          console.log('✅ Extracted from response.data.deliveries');
        } else if (Array.isArray(response.data.results)) {
          calendarArray = response.data.results;
          console.log('✅ Extracted from response.data.results');
        } else {
          const keys = Object.keys(response.data);
          if (keys.length > 0 && keys[0].match(/^\d{4}-\d{2}-\d{2}$/)) {
            console.log('🔄 Converting object with date keys to array');
            calendarArray = keys.map(date => ({
              date,
              status: response.data[date],
              remarks: '',
            }));
          } else {
            console.error('❌ Unknown response structure:', keys);
            console.error('Full response:', JSON.stringify(response.data, null, 2));
          }
        }
      }

      console.log('✅ Final calendar array:', {
        isArray: Array.isArray(calendarArray),
        length: calendarArray?.length || 0,
        firstItem: calendarArray?.[0],
        lastItem: calendarArray?.[calendarArray.length - 1],
      });

      return {
        data: calendarArray,
        summary: summaryData,
        month: params.month,
        customerId: params.customerId,
      };
    } catch (error: any) {
      console.error('❌ fetchCalendarData error:', error);
      console.error('Error details:', error.response?.data || error.message);
      return thunkAPI.rejectWithValue('Failed to fetch calendar data');
    }
  }
);

export const fetchConsumerSummary = createAsyncThunk(
  'calendar/fetchConsumerSummary',
  async (params: { customerId: number; month: string; year: string }, thunkAPI) => {
    try {
      console.log('📡 Fetching consumer summary:', params);
      const response = await getConsumerSummary({
        customer_id: params.customerId,
        month: params.month,
        year: params.year,
      });

      // Backend returns { status, code, message, data: { ... } }
      const payload = response?.data?.data || response?.data;

      console.log('📊 Consumer summary response payload:', payload);

      const summary = {
        // store numeric values; UI will format
        totalMilk: payload?.total_milk_delivered_litres != null
          ? Number(payload.total_milk_delivered_litres)
          : Number((payload?.cow_milk_delivered_litres || 0) + (payload?.buffalo_milk_delivered_litres || 0)),
        totalBill: Number(payload?.unpaid_amount ?? 0),
        totalDeliveries: Number(payload?.total_deliveries ?? 0),
        totalLeaves: Number(payload?.leaves_count ?? 0),
      };

      return { customerId: params.customerId, month: params.month, year: params.year, summary };
    } catch (error: any) {
      console.error('❌ fetchConsumerSummary error:', error?.response?.data || error?.message);
      return thunkAPI.rejectWithValue('Failed to fetch consumer summary');
    }
  }
);

interface LeaveRequestInput {
  id?: string;
  startDate: string;
  endDate: string;
  reason: string;
  leaveType: 'single' | 'multiple';
}

export const submitLeaveRequest = createAsyncThunk(
  'calendar/submitLeaveRequest',
  async (
    params: { customerId: number; leaveData: LeaveRequestInput },
    thunkAPI
  ) => {
    try {
      const { customerId, leaveData } = params;
      const dates =
        leaveData.leaveType === 'single'
          ? [leaveData.startDate]
          : getDatesBetween(leaveData.startDate, leaveData.endDate);

      for (const date of dates) {
        await applyForLeave({
          customer_id: customerId,
          date,
          remarks: leaveData.reason,
        });
      }
      return { dates, reason: leaveData.reason, customerId };
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to submit leave request');
    }
  }
);

interface MilkRequestInput {
  id?: string;
  date: string;
  quantity: number;
  // reason: string;
}

export const submitExtraMilk = createAsyncThunk(
  'calendar/submitExtraMilk',
  async (
    params: { customerId: number; milkData: MilkRequestInput & { milkType: 'cow' | 'buffalo' | 'mixed' } },
    thunkAPI
  ) => {
    try {
      const { customerId, milkData } = params;

      let cow_milk_extra = 0;
      let buffalo_milk_extra = 0;

      if (milkData.milkType === 'cow') {
        cow_milk_extra = milkData.quantity;
      } else if (milkData.milkType === 'buffalo') {
        buffalo_milk_extra = milkData.quantity;
      } else if (milkData.milkType === 'mixed') {
        cow_milk_extra = milkData.quantity;
        buffalo_milk_extra = milkData.quantity;
      }

      await requestExtraMilk({
        customer_id: customerId,
        date: milkData.date,
        cow_milk_extra,
        buffalo_milk_extra,
      });

      return { ...milkData, customerId };
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to request extra milk');
    }
  }
);

const getDatesBetween = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    dates.push(dt.toISOString().split('T')[0]);
  }
  return dates;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return '#009e05ff';
    case 'vendor_unavailable':
      return '#F44336';
    case 'distributor_unavailable':
      return '#F44336';
    case 'cancelled':
      return '#ff3c00ff';
    case 'leave':
      return '#9C27B0';
    case 'delivered_extra_milk':
      return '#45ca49ff';
    case 'extra_milk':
      return '#FFC107';
    case 'pending_extra_milk':
      return '#2196F3';
    case 'customer_paused':
      return '#9C27B0';
    case 'missed':
      return '#2196F3';
    case 'not_requested':
      return '#FF9800';
    default:
      return '#757575';
  }
};

const calendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    setCurrentMonth(state, action: PayloadAction<{ month: number; year: number }>) {
      state.currentMonth = action.payload.month;
      state.currentYear = action.payload.year;
    },
    clearError(state) {
      state.error = null;
    },
    cancelLeave(state, action: PayloadAction<{ leaveId: string; leaveDate: string; customerId: number }>) {
      const { leaveId, leaveDate, customerId } = action.payload;
      state.upcomingLeaves[customerId] = (state.upcomingLeaves[customerId] || []).filter(
        (leave) => leave.id !== leaveId
      );

      const custKey = String(customerId);

      // Remove leave dots for this customer only
      const custCalendar = state.calendarDataByCustomer[custKey] || {};
      if (custCalendar[leaveDate]) {
        const existing = custCalendar[leaveDate];
        const remainingDots = (existing.dots || []).filter(d => !d.key?.startsWith('leave-'));
        if (remainingDots.length > 0) {
          state.calendarDataByCustomer[custKey] = {
            ...(state.calendarDataByCustomer[custKey] || {}),
            [leaveDate]: { ...existing, dots: remainingDots },
          };
        } else {
          const copy = { ...(state.calendarDataByCustomer[custKey] || {}) };
          delete copy[leaveDate];
          state.calendarDataByCustomer[custKey] = copy;
        }
      }

      const custDelivery = state.deliveryTypesByCustomer[custKey] || {};
      if (custDelivery[leaveDate]) {
        const remaining = (custDelivery[leaveDate] || []).filter(s => s !== 'customer_paused' && s !== 'leave');
        if (remaining.length > 0) {
          state.deliveryTypesByCustomer[custKey] = {
            ...(state.deliveryTypesByCustomer[custKey] || {}),
            [leaveDate]: remaining,
          };
        } else {
          const copy = { ...(state.deliveryTypesByCustomer[custKey] || {}) };
          delete copy[leaveDate];
          state.deliveryTypesByCustomer[custKey] = copy;
        }
      }
    },
    // Clear calendar globally or for a specific customer when payload.customerId provided
    clearCalendar(state, action: PayloadAction<{ customerId?: number }>) {
      const custId = action && action.payload ? action.payload.customerId : undefined;
      if (custId != null) {
        const key = String(custId);
        delete state.calendarDataByCustomer[key];
        delete state.deliveryTypesByCustomer[key];
        delete state.monthlySummaryByCustomer[key];
        // keep upcoming arrays intact for other customers
        return;
      }

      // global clear
      state.calendarDataByCustomer = {};
      state.deliveryTypesByCustomer = {};
      state.upcomingLeaves = {};
      state.upcomingMilkRequests = {};
      state.monthlySummaryByCustomer = {};
      state.error = null;
      state.lastUpdated = null;
      state.lastFetchedMonths = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalendarData.fulfilled, (state, action) => {
        console.log('📅 ========== FETCH CALENDAR DATA ==========');
        console.log('📦 Payload:', {
          month: action.payload.month,
          customerId: action.payload.customerId,
          dataLength: action.payload.data?.length || 0,
          hasSummary: !!action.payload.summary,
        });

        state.loading = false;

        // Log BEFORE merge (per-customer)
        const _custKey = String(action.payload.customerId);
        const beforeDelivery = state.deliveryTypesByCustomer[_custKey] || {};
        const beforeCalendar = state.calendarDataByCustomer[_custKey] || {};
        console.log('📊 BEFORE MERGE (customer):');
        console.log('  - deliveryTypes count:', Object.keys(beforeDelivery).length);
        console.log('  - calendarData count:', Object.keys(beforeCalendar).length);
        if (Object.keys(beforeDelivery).length > 0) {
          const dates = Object.keys(beforeDelivery).sort();
          console.log('  - Date range:', `${dates[0]} to ${dates[dates.length - 1]}`);
          console.log('  - Sample dates:', dates.slice(0, 5));
        }

        // Process new data with date normalization
        const newCalendarData: { [key: string]: CustomMarking } = {};
        const newDeliveryTypes: Record<string, string[]> = {};
        let deliveredCount = 0;
        let leaveCount = 0;

        if (Array.isArray(action.payload.data)) {
          console.log('🔄 Processing', action.payload.data.length, 'items from backend');

          action.payload.data.forEach((item: DeliveryCalendarItem, index) => {
            const originalDate = item.date;
            const normalizedDate = normalizeDateFormat(item.date);

            if (index < 5) {
              console.log(`  [${index}] Date: ${originalDate} → ${normalizedDate}, Status: ${item.status}`);
            }

            const color = getStatusColor(item.status);

            // Aggregate dots for the date
            const existing = newCalendarData[normalizedDate] || { marked: true, dots: [] } as CustomMarking;
            const dots = (existing.dots || []) as any[];
            const dotKey = `${item.status}-${normalizedDate}`;
            if (!dots.find(d => d.key === dotKey)) {
              dots.push({ key: dotKey, color, selectedDotColor: color });
            }
            newCalendarData[normalizedDate] = { ...existing, marked: true, dots };

            // Aggregate delivery types as arrays
            if (!newDeliveryTypes[normalizedDate]) { newDeliveryTypes[normalizedDate] = []; }
            if (!newDeliveryTypes[normalizedDate].includes(item.status)) {
              newDeliveryTypes[normalizedDate].push(item.status);
            }

            // Count deliveries and leaves from calendar data (count each occurrence of delivered/leave once per item)
            if (item.status === 'delivered') { deliveredCount++; }
            if (item.status === 'customer_paused' || item.status === 'leave') { leaveCount++; }
          });

          console.log('✅ Processed data:', {
            newDates: Object.keys(newDeliveryTypes).length,
            delivered: deliveredCount,
            leaves: leaveCount,
          });
        } else {
          console.error('❌ Payload data is not an array!');
          console.error('   Type:', typeof action.payload.data);
          console.error('   Value:', action.payload.data);
        }

        // MERGE into per-customer storage instead of the global maps
        const custKey = String(action.payload.customerId);

        const existingCalendarForCust = state.calendarDataByCustomer[custKey] || {};
        const existingDeliveryForCust = state.deliveryTypesByCustomer[custKey] || {};

        // Merge arrays for deliveryTypes scoped to this customer
        const mergedDeliveryTypes: Record<string, string[]> = { ...existingDeliveryForCust };
        Object.entries(newDeliveryTypes).forEach(([date, statuses]) => {
          if (!mergedDeliveryTypes[date]) {
            mergedDeliveryTypes[date] = [...statuses];
          } else {
            const set = new Set([...(mergedDeliveryTypes[date] || []), ...statuses]);
            mergedDeliveryTypes[date] = Array.from(set);
          }
        });

        state.calendarDataByCustomer[custKey] = {
          ...existingCalendarForCust,
          ...newCalendarData,
        };

        state.deliveryTypesByCustomer[custKey] = mergedDeliveryTypes;
        // ✅ FIX: Replace data for this month (not merge) to clear stale pending requests
        // Extract month from payload.month (e.g., "2025-12")
        const [fetchedYear, fetchedMonth] = action.payload.month.split('-');

        // Clear old data for this month only - filter out dates from the fetched month
        const calendarAfterClear: Record<string, CustomMarking> = {};
        Object.entries(existingCalendarForCust).forEach(([dateStr, marking]) => {
          const [year, month] = dateStr.split('-');
          // Keep only dates NOT from the fetched month
          if (year !== fetchedYear || month !== fetchedMonth) {
            calendarAfterClear[dateStr] = marking;
          }
        });

        const deliveryAfterClear: Record<string, string[]> = {};
        Object.entries(existingDeliveryForCust).forEach(([dateStr, statuses]) => {
          const [year, month] = dateStr.split('-');
          // Keep only dates NOT from the fetched month
          if (year !== fetchedYear || month !== fetchedMonth) {
            deliveryAfterClear[dateStr] = statuses;
          }
        });

        // Now merge fresh data for this month with old data from other months
        state.calendarDataByCustomer[custKey] = {
          ...calendarAfterClear,
          ...newCalendarData,
        };

        state.deliveryTypesByCustomer[custKey] = {
          ...deliveryAfterClear,
          ...newDeliveryTypes,
        };

        // Update tracking
        state.lastUpdated = Date.now();
        const monthKey = action.payload.month;
        if (!state.lastFetchedMonths.includes(monthKey)) {
          state.lastFetchedMonths.push(monthKey);
        }

        // Log AFTER merge (per-customer)
        const _afterKey = String(action.payload.customerId);
        const afterDelivery = state.deliveryTypesByCustomer[_afterKey] || {};
        const afterCalendar = state.calendarDataByCustomer[_afterKey] || {};
        console.log('📊 AFTER MERGE (customer):');
        console.log('  - deliveryTypes count:', Object.keys(afterDelivery).length);
        console.log('  - calendarData count:', Object.keys(afterCalendar).length);
        if (Object.keys(afterDelivery).length > 0) {
          const dates = Object.keys(afterDelivery).sort();
          console.log('  - Date range:', `${dates[0]} to ${dates[dates.length - 1]}`);
          console.log('  - Recent dates:', dates.slice(-5));
        }
        console.log('  - Fetched months:', state.lastFetchedMonths);
        console.log('  - Last updated:', new Date(state.lastUpdated).toISOString());

        // ✅ IMPROVED: Use backend summary, but validate and fallback to calculated values
        if (action.payload.summary) {
          console.log('✅ Backend summary received:', action.payload.summary);

          const custKey = String(action.payload.customerId);
          // Prefer backend numeric values when provided; fallback to calculated counts where appropriate
          state.monthlySummaryByCustomer[custKey] = {
            totalMilk: typeof action.payload.summary.totalMilk === 'number' ? action.payload.summary.totalMilk : 0,
            totalBill: typeof action.payload.summary.totalBill === 'number' ? action.payload.summary.totalBill : 0,
            totalDeliveries: typeof action.payload.summary.totalDeliveries === 'number' ? action.payload.summary.totalDeliveries : deliveredCount,
            totalLeaves: typeof action.payload.summary.totalLeaves === 'number' ? action.payload.summary.totalLeaves : leaveCount,
          };

          console.log('📊 Summary validation (customer):', {
            customerId: action.payload.customerId,
            backendValues: action.payload.summary,
            calculatedDeliveries: deliveredCount,
            calculatedLeaves: leaveCount,
          });
        } else {
          console.log('⚠️ No backend summary, using calculated values');
          const custKey = String(action.payload.customerId);
          state.monthlySummaryByCustomer[custKey] = {
            totalMilk: 0,
            totalBill: 0,
            totalDeliveries: deliveredCount,
            totalLeaves: leaveCount,
          };
        }

        const custKeyForFinal = String(action.payload.customerId);
        const finalSummary = state.monthlySummaryByCustomer[custKeyForFinal] || { totalMilk: '0L', totalBill: '₹0', totalDeliveries: 0, totalLeaves: 0 };
        console.log('📊 Final Summary (customer):', finalSummary);
        console.log('   - Total Milk:', finalSummary.totalMilk);
        console.log('   - Total Bill:', finalSummary.totalBill);
        console.log('   - Deliveries:', finalSummary.totalDeliveries);
        console.log('   - Leaves:', finalSummary.totalLeaves);
        console.log('=========================================');

        // Initialize leave and milk requests arrays for this customer
        const custId = action.payload.customerId;
        if (!(custId in state.upcomingLeaves)) {
          state.upcomingLeaves[custId] = [];
        }
        if (!(custId in state.upcomingMilkRequests)) {
          state.upcomingMilkRequests[custId] = [];
        }
      })
      .addCase(fetchCalendarData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('❌ fetchCalendarData rejected:', action.payload);
      })
      // Consumer summary fetch
      .addCase(fetchConsumerSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsumerSummary.fulfilled, (state, action) => {
        state.loading = false;
        const custKey = String(action.payload.customerId);
        state.monthlySummaryByCustomer[custKey] = action.payload.summary || { totalMilk: 0, totalBill: 0, totalLeaves: 0, totalDeliveries: 0 };
      })
      .addCase(fetchConsumerSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;

        const { dates, reason, customerId } = action.payload;

        const leaves = state.upcomingLeaves[customerId] || [];
        const custKey = String(customerId);

        dates.forEach(date => {
          const uniqueId = `${customerId}_${date}_${Date.now()}`;

          // Ensure calendarData has a leave dot for this customer
          const existing = (state.calendarDataByCustomer[custKey] || {})[date] || { marked: true, dots: [] } as CustomMarking;
          const dots = (existing.dots || []) as any[];
          const dotKey = `leave-${date}`;
          if (!dots.find(d => d.key === dotKey)) {
            dots.push({ key: dotKey, color: getStatusColor('leave'), selectedDotColor: getStatusColor('leave') });
          }

          state.calendarDataByCustomer[custKey] = {
            ...(state.calendarDataByCustomer[custKey] || {}),
            [date]: { ...existing, marked: true, dots },
          };

          // Add to deliveryTypes array for customer
          const custDelivery = state.deliveryTypesByCustomer[custKey] || {};
          if (!custDelivery[date]) { custDelivery[date] = []; }
          if (!custDelivery[date].includes('customer_paused')) {
            custDelivery[date].push('customer_paused');
          }
          state.deliveryTypesByCustomer[custKey] = custDelivery;

          if (!leaves.some(leave => leave.id === uniqueId)) {
            leaves.push({
              id: uniqueId,
              date,
              reason,
              status: 'approved',
            });
          }
        });

        state.upcomingLeaves[customerId] = leaves;
        // update per-customer monthly summary
        const existingSummary = state.monthlySummaryByCustomer[custKey] || { totalMilk: '0L', totalBill: '₹0', totalLeaves: 0, totalDeliveries: 0 };
        state.monthlySummaryByCustomer[custKey] = {
          ...existingSummary,
          totalLeaves: existingSummary.totalLeaves + dates.length,
        };
      })
      .addCase(submitLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitExtraMilk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitExtraMilk.fulfilled, (state, action) => {
        state.loading = false;

        const { date, quantity, customerId } = action.payload;

        const milkRequests = state.upcomingMilkRequests[customerId] || [];

        const uniqueId = `${customerId}_${date}_${Date.now()}`;
        const custKey = String(customerId);

        const existing = (state.calendarDataByCustomer[custKey] || {})[date] || { marked: true, dots: [] } as CustomMarking;
        const dots = (existing.dots || []) as any[];
        // Show 'pending_extra_milk' status (request pending vendor approval) — don't show 'extra_milk' yet
        const dotKey = `pending_extra_milk-${date}`;
        if (!dots.find(d => d.key === dotKey)) {
          dots.push({ key: dotKey, color: getStatusColor('pending_extra_milk'), selectedDotColor: getStatusColor('pending_extra_milk') });
        }

        state.calendarDataByCustomer[custKey] = {
          ...(state.calendarDataByCustomer[custKey] || {}),
          [date]: { ...existing, marked: true, dots },
        };

        const custDelivery = state.deliveryTypesByCustomer[custKey] || {};
        if (!custDelivery[date]) { custDelivery[date] = []; }
        // Add 'pending_extra_milk' status instead of 'extra_milk'
        if (!custDelivery[date].includes('pending_extra_milk')) {
          custDelivery[date].push('pending_extra_milk');
        }
        state.deliveryTypesByCustomer[custKey] = custDelivery;

        if (!milkRequests.some(req => req.id === uniqueId)) {
          milkRequests.push({
            id: uniqueId,
            date,
            quantity,
            reason: 'Extra milk request',
            status: 'approved',
          });
        }

        state.upcomingMilkRequests[customerId] = milkRequests;
      })
      .addCase(submitExtraMilk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(REHYDRATE, (state, action: any) => {
        if (action.payload?.calendar) {
          console.log('🔄 ========== REHYDRATE ==========');
          console.log('  - Restoring calendar from storage');
          // Support both new per-customer shape and older flat shape
          const calendarPayload = action.payload.calendar;
          const deliveryCount = calendarPayload.deliveryTypesByCustomer
            ? Object.keys(calendarPayload.deliveryTypesByCustomer).length
            : Object.keys(calendarPayload.deliveryTypes || {}).length;
          const calendarCount = calendarPayload.calendarDataByCustomer
            ? Object.keys(calendarPayload.calendarDataByCustomer).length
            : Object.keys(calendarPayload.calendarData || {}).length;

          console.log('  - deliveryTypes entries:', deliveryCount);
          console.log('  - calendarData entries:', calendarCount);
          console.log('  - lastFetchedMonths:', calendarPayload.lastFetchedMonths);
          console.log('===================================');
          // Merge payload carefully to avoid shape mismatch
          return { ...state, ...action.payload.calendar, loading: false };
        }
      });
  },
});

export const { setCurrentMonth, clearError, cancelLeave, clearCalendar } = calendarSlice.actions;

export default calendarSlice.reducer;
