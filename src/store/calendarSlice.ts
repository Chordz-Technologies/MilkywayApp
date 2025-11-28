
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import {
  getConsumerCalendar,
  applyForLeave,
  requestExtraMilk,
} from '../apiServices/allApi';

interface DeliveryCalendarItem {
  date: string;
  status: string;
  remarks?: string;
}

interface CustomMarking {
  marked?: boolean;
  dotColor?: string;
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
  totalMilk: string;
  totalBill: string;
  totalLeaves: number;
  totalDeliveries: number;
}

interface CalendarState {
  calendarData: { [key: string]: CustomMarking };
  deliveryTypes: Record<string, string>;
  upcomingLeaves: Record<number, LeaveItem[]>;
  upcomingMilkRequests: Record<number, ExtraMilkItem[]>;
  monthlySummary: MonthlySummary;
  loading: boolean;
  error: string | null;
  currentMonth: number;
  currentYear: number;
  lastUpdated: number | null;
  lastFetchedMonths: string[];
}

const initialState: CalendarState = {
  calendarData: {},
  deliveryTypes: {},
  upcomingLeaves: {},
  upcomingMilkRequests: {},
  monthlySummary: {
    totalMilk: '0L',
    totalBill: '₹0',
    totalLeaves: 0,
    totalDeliveries: 0,
  },
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
      return '#4CAF50';
    case 'missed':
      return '#2196F3';
    case 'not_requested':
      return '#FF9800';
    case 'consumer_unavailable':
      return '#F44336';
    case 'customer_paused':
      return '#9C27B0';
    case 'extra_milk':
      return '#FFC107';
    case 'vendor_unavailable':
      return '#F44336';
    case 'distributor_unavailable':
      return '#F44336';
    case 'cancelled':
      return '#FF5722';
    case 'leave':
      return '#9C27B0';
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
      if (state.calendarData[leaveDate]) {
        delete state.calendarData[leaveDate];
      }
      if (state.deliveryTypes[leaveDate]) {
        delete state.deliveryTypes[leaveDate];
      }
    },
    clearCalendar(state) {
      state.calendarData = {};
      state.deliveryTypes = {};
      state.upcomingLeaves = {};
      state.upcomingMilkRequests = {};
      state.monthlySummary = {
        totalMilk: '0L',
        totalBill: '₹0',
        totalLeaves: 0,
        totalDeliveries: 0,
      };
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

        // Log BEFORE merge
        console.log('📊 BEFORE MERGE:');
        console.log('  - deliveryTypes count:', Object.keys(state.deliveryTypes).length);
        console.log('  - calendarData count:', Object.keys(state.calendarData).length);
        if (Object.keys(state.deliveryTypes).length > 0) {
          const dates = Object.keys(state.deliveryTypes).sort();
          console.log('  - Date range:', `${dates[0]} to ${dates[dates.length - 1]}`);
          console.log('  - Sample dates:', dates.slice(0, 5));
        }

        // Process new data with date normalization
        const newCalendarData: { [key: string]: CustomMarking } = {};
        const newDeliveryTypes: Record<string, string> = {};
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
            newCalendarData[normalizedDate] = { marked: true, dotColor: color };
            newDeliveryTypes[normalizedDate] = item.status;

            // Count deliveries and leaves from calendar data
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

        // MERGE instead of REPLACE
        state.calendarData = {
          ...state.calendarData,
          ...newCalendarData,
        };

        state.deliveryTypes = {
          ...state.deliveryTypes,
          ...newDeliveryTypes,
        };

        // Update tracking
        state.lastUpdated = Date.now();
        const monthKey = action.payload.month;
        if (!state.lastFetchedMonths.includes(monthKey)) {
          state.lastFetchedMonths.push(monthKey);
        }

        // Log AFTER merge
        console.log('📊 AFTER MERGE:');
        console.log('  - deliveryTypes count:', Object.keys(state.deliveryTypes).length);
        console.log('  - calendarData count:', Object.keys(state.calendarData).length);
        if (Object.keys(state.deliveryTypes).length > 0) {
          const dates = Object.keys(state.deliveryTypes).sort();
          console.log('  - Date range:', `${dates[0]} to ${dates[dates.length - 1]}`);
          console.log('  - Recent dates:', dates.slice(-5));
        }
        console.log('  - Fetched months:', state.lastFetchedMonths);
        console.log('  - Last updated:', new Date(state.lastUpdated).toISOString());

        // ✅ IMPROVED: Use backend summary, but validate and fallback to calculated values
        if (action.payload.summary) {
          console.log('✅ Backend summary received:', action.payload.summary);

          // Check if backend values are valid (not zero/empty)
          const hasValidMilk = action.payload.summary.totalMilk &&
            action.payload.summary.totalMilk !== '0L' &&
            action.payload.summary.totalMilk !== '0';
          const hasValidLeaves = action.payload.summary.totalLeaves > 0;
          const hasValidDeliveries = action.payload.summary.totalDeliveries > 0;

          state.monthlySummary = {
            totalMilk: hasValidMilk ? action.payload.summary.totalMilk : '0L',
            totalBill: action.payload.summary.totalBill || '₹0',
            totalDeliveries: hasValidDeliveries ? action.payload.summary.totalDeliveries : deliveredCount,
            totalLeaves: hasValidLeaves ? action.payload.summary.totalLeaves : leaveCount,
          };

          console.log('📊 Summary validation:', {
            backendValues: action.payload.summary,
            hasValidMilk,
            hasValidLeaves,
            hasValidDeliveries,
            calculatedDeliveries: deliveredCount,
            calculatedLeaves: leaveCount,
            usingBackend: { milk: hasValidMilk, leaves: hasValidLeaves, deliveries: hasValidDeliveries },
            usingCalculated: { deliveries: !hasValidDeliveries, leaves: !hasValidLeaves },
          });
        } else {
          console.log('⚠️ No backend summary, using calculated values');
          state.monthlySummary.totalDeliveries = deliveredCount;
          state.monthlySummary.totalLeaves = leaveCount;
        }

        console.log('📊 Final Summary:', state.monthlySummary);
        console.log('   - Total Milk:', state.monthlySummary.totalMilk);
        console.log('   - Total Bill:', state.monthlySummary.totalBill);
        console.log('   - Deliveries:', state.monthlySummary.totalDeliveries);
        console.log('   - Leaves:', state.monthlySummary.totalLeaves);
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
      .addCase(submitLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;

        const { dates, reason, customerId } = action.payload;

        const leaves = state.upcomingLeaves[customerId] || [];

        dates.forEach(date => {
          const uniqueId = `${customerId}_${date}_${Date.now()}`;
          state.calendarData[date] = { marked: true, dotColor: '#9C27B0' };
          state.deliveryTypes[date] = 'customer_paused';

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
        state.monthlySummary.totalLeaves += dates.length;
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

        state.calendarData[date] = {
          ...state.calendarData[date],
          marked: true,
          dotColor: '#FFC107',
        };

        state.deliveryTypes[date] = 'extra_milk';

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
          console.log('  - deliveryTypes:', Object.keys(action.payload.calendar.deliveryTypes || {}).length);
          console.log('  - calendarData:', Object.keys(action.payload.calendar.calendarData || {}).length);
          console.log('  - lastFetchedMonths:', action.payload.calendar.lastFetchedMonths);
          console.log('===================================');
          return { ...state, ...action.payload.calendar, loading: false };
        }
      });
  },
});

export const { setCurrentMonth, clearError, cancelLeave, clearCalendar } = calendarSlice.actions;

export default calendarSlice.reducer;
