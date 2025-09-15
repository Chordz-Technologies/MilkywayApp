

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
  upcomingLeaves: Record<number, LeaveItem[]>; // scoped by customerId
  upcomingMilkRequests: Record<number, ExtraMilkItem[]>; // scoped by customerId
  monthlySummary: MonthlySummary;
  loading: boolean;
  error: string | null;
  currentMonth: number;
  currentYear: number;
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
};

export const fetchCalendarData = createAsyncThunk(
  'calendar/fetchCalendarData',
  async (params: { customerId: number; month: string }, thunkAPI) => {
    try {
      const response = await getConsumerCalendar({
        customer_id: params.customerId,
        month: params.month,
      });
      return { data: response.data, month: params.month, customerId: params.customerId };
    } catch (error: any) {
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
  reason: string;
}

export const submitExtraMilk = createAsyncThunk(
  'calendar/submitExtraMilk',
  async (
    params: { customerId: number; milkData: MilkRequestInput },
    thunkAPI
  ) => {
    try {
      const { customerId, milkData } = params;
      await requestExtraMilk({
        customer_id: customerId,
        date: milkData.date,
        quantity: milkData.quantity,
        remarks: milkData.reason,
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
      // Remove leave only for given customer
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalendarData.fulfilled, (state, action) => {
        state.loading = false;
        const newCalendarData: { [key: string]: CustomMarking } = {};
        const newDeliveryTypes: Record<string, string> = {};
        let deliveredCount = 0;
        let leaveCount = 0;

        if (Array.isArray(action.payload.data)) {
          action.payload.data.forEach((item: DeliveryCalendarItem) => {
            const color = getStatusColor(item.status);
            newCalendarData[item.date] = { marked: true, dotColor: color };
            newDeliveryTypes[item.date] = item.status;

            if (item.status === 'delivered') {deliveredCount++;}
            if (item.status === 'customer_paused') {leaveCount++;}
          });
        }

        state.calendarData = newCalendarData;
        state.deliveryTypes = newDeliveryTypes;
        state.monthlySummary.totalDeliveries = deliveredCount;
        state.monthlySummary.totalLeaves = leaveCount;

        // Initialize leave and milk requests arrays for this customer if not existing
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

        const { date, quantity, reason, customerId } = action.payload;

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
            reason,
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
          return { ...state, ...action.payload.calendar, loading: false };
        }
      });
  },
});

export const { setCurrentMonth, clearError, cancelLeave, clearCalendar } = calendarSlice.actions;

export default calendarSlice.reducer;
