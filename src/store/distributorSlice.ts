
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import {
  getDistributorCalendar,
  applyForDistributorLeave,
  // getDistributorLeaveRequestDetails
} from '../apiServices/allApi';

interface DistributorLeaveCalendarItem {
  date: string;
  status: string;
  remarks?: string;
  milkman_id?: number;
}

interface CustomMarking {
  marked?: boolean;
  dotColor?: string;
  selected?: boolean;
  selectedColor?: string;
}

interface LeaveItem {
  id: string;
  date: string;
  reason: string;
  status: 'approved' | 'pending' | 'leave';
}

interface MonthlySummary {
  totalLeaves: number;
  approvedLeaves: number;
  pendingLeaves: number;
}

interface DistributorCalendarState {
  calendarData: { [date: string]: CustomMarking };
  leaveTypes: Record<string, string>;
  upcomingLeaves: LeaveItem[];
  monthlySummary: MonthlySummary;
  loading: boolean;
  error: string | null;
  currentMonth: number;
  currentYear: number;
}

const initialState: DistributorCalendarState = {
  calendarData: {},
  leaveTypes: {},
  upcomingLeaves: [],
  monthlySummary: {
    totalLeaves: 0,
    approvedLeaves: 0,
    pendingLeaves: 0,
  },
  loading: false,
  error: null,
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
};

export const fetchDistributorCalendarData = createAsyncThunk(
  'distributorCalendar/fetchCalendarData',
  async ({ milkmanId, month }: { milkmanId?: number; month: string }, thunkAPI) => {
    try {
      const response = await getDistributorCalendar({
        milkman_id: milkmanId,
        month,
      });
      return { data: response.data, month };
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to fetch distributor calendar data');
    }
  }
);

interface LeaveRequestInput {
  startDate: string;
  endDate: string;
  reason: string;
  leaveType: 'single' | 'multiple';
  milkmanId?: number;
}

export const submitDistributorLeaveRequest = createAsyncThunk(
  'distributorCalendar/submitLeaveRequest',
  async (
    {
      milkmanId,
      leaveData,
    }: { milkmanId?: number; leaveData: LeaveRequestInput },
    thunkAPI,
  ) => {
    try {
      const dates =
        leaveData.leaveType === 'single'
          ? [leaveData.startDate]
          : getDatesBetween(leaveData.startDate, leaveData.endDate);

      for (const date of dates) {
        await applyForDistributorLeave({
          milkman_id: leaveData.milkmanId || milkmanId,
          date,
          remarks: leaveData.reason, // Simple mapping
        });
      }
      return { dates, reason: leaveData.reason, milkmanId: leaveData.milkmanId || milkmanId };
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to submit leave request');
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

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'approved':
      return '#4CAF50';
    case 'pending':
      return '#FF9800';
    case 'leave':
      return '#9C27B0';
    default:
      return '#FF9800';
  }
};

const distributorCalendarSlice = createSlice({
  name: 'distributorCalendar',
  initialState,
  reducers: {
    setCurrentMonth: (state, action: PayloadAction<{ month: number; year: number }>) => {
      state.currentMonth = action.payload.month;
      state.currentYear = action.payload.year;
    },
    clearError: (state) => {
      state.error = null;
    },
    cancelLeave: (state, action: PayloadAction<{ leaveId: string; leaveDate: string }>) => {
      const { leaveId, leaveDate } = action.payload;
      state.upcomingLeaves = state.upcomingLeaves.filter((leave) => leave.id !== leaveId);
      if (state.calendarData[leaveDate]) {delete state.calendarData[leaveDate];}
      if (state.leaveTypes[leaveDate]) {delete state.leaveTypes[leaveDate];}
    },
    clearDistributorCalendar: (state) => {
      state.calendarData = {};
      state.leaveTypes = {};
      state.upcomingLeaves = [];
      state.monthlySummary = {
        totalLeaves: 0,
        approvedLeaves: 0,
        pendingLeaves: 0,
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistributorCalendarData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistributorCalendarData.fulfilled, (state, action) => {
        state.loading = false;
        const newCalendarData: { [date: string]: CustomMarking } = {};
        const newLeaveTypes: Record<string, string> = {};
        let approvedCount = 0;
        let pendingCount = 0;

        if (Array.isArray(action.payload.data)) {
          action.payload.data.forEach((item: DistributorLeaveCalendarItem) => {
            const color = getStatusColor(item.status);
            newCalendarData[item.date] = { marked: true, dotColor: color };
            newLeaveTypes[item.date] = item.status;

            if (item.status === 'approved') {
              approvedCount++;
            } else if (item.status === 'pending') {
              pendingCount++;
            }
          });
        }

        state.calendarData = newCalendarData;
        state.leaveTypes = newLeaveTypes;
        state.monthlySummary.totalLeaves = approvedCount + pendingCount;
        state.monthlySummary.approvedLeaves = approvedCount;
        state.monthlySummary.pendingLeaves = pendingCount;
      })
      .addCase(fetchDistributorCalendarData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitDistributorLeaveRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitDistributorLeaveRequest.fulfilled, (state, action) => {
        state.loading = false;
        const { dates, reason } = action.payload;
        dates.forEach((date: string) => {
          state.calendarData[date] = { marked: true, dotColor: '#FF9800' };
          state.leaveTypes[date] = 'pending';
        });
        const newLeave: LeaveItem = {
          id: Date.now().toString(),
          date:
            dates.length === 1
              ? dates[0]
              : `${dates[0]} to ${dates[dates.length - 1]}`,
          reason,
          status: 'pending',
        };
        state.upcomingLeaves.push(newLeave);
        state.monthlySummary.totalLeaves += dates.length;
        state.monthlySummary.pendingLeaves += dates.length;
      })
      .addCase(submitDistributorLeaveRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(REHYDRATE, (state, action: any) => {
        if (action.payload?.distributorCalendar) {
          return { ...state, ...action.payload.distributorCalendar, loading: false };
        }
      });
  },
});

export const {
  setCurrentMonth,
  clearError,
  cancelLeave,
  clearDistributorCalendar,
} = distributorCalendarSlice.actions;

export default distributorCalendarSlice.reducer;
