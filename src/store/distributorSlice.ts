import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import {
  getDistributorCalendar,
  applyForDistributorLeave,
  getDistributorMonthSummary,
} from '../apiServices/allApi';

/* -------------------- TYPES -------------------- */

interface DistributorCalendarItem {
  date: string;
  status: string;
  remarks?: string;
}

interface CustomMarking {
  marked?: boolean;
  dots?: Array<{
    key: string;
    color: string;
    selectedDotColor?: string;
  }>;
}

interface LeaveItem {
  id: string;
  date: string;
  reason: string;
  status: string;
}

interface MonthlySummary {
  totalDays: number;
  distributed: number;
  totalMilk: number
  leaves: number;
}

interface DistributorCalendarState {
  calendarDataByMilkman: Record<string, Record<string, CustomMarking>>;
  deliveryTypesByMilkman: Record<string, Record<string, string[]>>;
  calendarDetailsByMilkman: Record<string, Record<string, any>>;
  upcomingLeaves: Record<number, LeaveItem[]>;
  monthlySummaryByMilkman: Record<string, MonthlySummary>;
  loading: boolean;
  error: string | null;
  currentMonth: number;
  currentYear: number;
  lastFetchedMonths: string[];
  calendarData: { [date: string]: CustomMarking };
  leaveTypes: Record<string, string>;
  monthlySummary: MonthlySummary;
  monthlySummaryRaw: any | null;
  calendarDetails: Record<string, any>;
}

/* -------------------- INITIAL -------------------- */

const initialState: DistributorCalendarState = {
  calendarDataByMilkman: {},
  deliveryTypesByMilkman: {},
  upcomingLeaves: {},
  monthlySummaryByMilkman: {},
  loading: false,
  error: null,
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  lastFetchedMonths: [],
  calendarDetailsByMilkman: {},
  calendarData: {},
  leaveTypes: {},
  monthlySummary: {
    totalDays: 0,
    distributed: 0,
    totalMilk: 0,
    leaves: 0,
  },
  monthlySummaryRaw: null,
  calendarDetails: {},
};

/* -------------------- HELPERS -------------------- */

const normalizeDate = (date: string) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  return new Date(date).toISOString().split('T')[0];
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'leave': return '#9C27B0'; // purple
    case 'delivered': return '#009e05ff'; // green
    case 'pending_leave': return '#2196F3'; // blue
    case 'pending': return '#FFC107'; // amber
    case 'cancelled': return '#ff3c00ff'; // red
    default: return '#757575';
  }
};

/* -------------------- THUNKS -------------------- */

export const fetchDistributorCalendarData = createAsyncThunk(
  'distributorCalendar/fetch',
  async (params: { milkmanId: number; month: string }, thunkAPI) => {
    try {
      const res = await getDistributorCalendar({
        milkman_id: params.milkmanId,
        month: params.month,
      });
      const data = res?.data?.data || res?.data || [];
      return { data, ...params };
    } catch {
      return thunkAPI.rejectWithValue('Failed to fetch distributor calendar');
    }
  }
);

export const fetchDistributorMonthSummary = createAsyncThunk(
  'distributorCalendar/fetchMonthSummary',
  async (params: { milkmanId: number; month: number | string; year: number | string }, thunkAPI) => {
    try {
      const response = await getDistributorMonthSummary({ milkman_id: params.milkmanId, month: params.month, year: params.year });
      const payload = response?.data?.data || response?.data;
      return { milkmanId: params.milkmanId, month: params.month, year: params.year, data: payload };
    } catch (error: any) {
      return thunkAPI.rejectWithValue('Failed to fetch distributor month summary');
    }
  }
);

export const submitDistributorLeaveRequest = createAsyncThunk(
  'distributorCalendar/leave',
  async (
    params: { milkmanId: number; leaveData: any },
    thunkAPI
  ) => {
    try {
      await applyForDistributorLeave(params.leaveData);
      return params;
    } catch {
      return thunkAPI.rejectWithValue('Leave request failed');
    }
  }
);

/* -------------------- SLICE -------------------- */

const distributorSlice = createSlice({
  name: 'distributorCalendar',
  initialState,
  reducers: {
    setCurrentMonth(state, action: PayloadAction<{ month: number; year: number }>) {
      state.currentMonth = action.payload.month;
      state.currentYear = action.payload.year;
    },
    clearError(state) {
      state.error = null;
    },
    applySyncedDelivery(state, action: PayloadAction<{ milkmanId: number; date: string; status: string }>) {
      const { milkmanId, date, status } = action.payload;
      const key = String(milkmanId);
      const normalized = normalizeDate(date);

      const existingCalendar = state.calendarDataByMilkman[key] || {};
      const existingMark = existingCalendar[normalized] || { marked: true, dots: [] } as any;
      const dots = Array.isArray(existingMark.dots) ? existingMark.dots.slice() : [];
      const dotKey = `${status}-${normalized}`;
      if (!dots.find((d: any) => d.key === dotKey)) {
        const color = getStatusColor(status);
        dots.push({ key: dotKey, color, selectedDotColor: color });
      }
      state.calendarDataByMilkman[key] = { ...(state.calendarDataByMilkman[key] || {}), [normalized]: { ...existingMark, marked: true, dots } };

      const types = state.deliveryTypesByMilkman[key] || {};
      const arr = types[normalized] ? Array.from(new Set([...types[normalized], status])) : [status];
      types[normalized] = arr;
      state.deliveryTypesByMilkman[key] = types;
    },
    cancelLeave(
      state,
      action: PayloadAction<{ leaveId: string; leaveDate: string; milkmanId: number }>
    ) {
      const { leaveId, leaveDate, milkmanId } = action.payload;
      state.upcomingLeaves[milkmanId] =
        (state.upcomingLeaves[milkmanId] || []).filter(l => l.id !== leaveId);

      const key = String(milkmanId);
      delete state.calendarDataByMilkman[key]?.[leaveDate];
      delete state.deliveryTypesByMilkman[key]?.[leaveDate];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchDistributorCalendarData.pending, state => {
        state.loading = true;
      })
      .addCase(fetchDistributorCalendarData.fulfilled, (state, action) => {
        state.loading = false;

        const { milkmanId, month, data } = action.payload;
        const key = String(milkmanId);

        const newCalendar: Record<string, CustomMarking> = {};
        const newTypes: Record<string, string[]> = {};
        const newDetails: Record<string, any> = {};

        let delivered = 0;
        let leaves = 0;

        const grouped: Record<string, DistributorCalendarItem[]> = {};
        data.forEach((item: DistributorCalendarItem) => {
          const date = normalizeDate(item.date);
          grouped[date] ??= [];
          grouped[date].push({ ...item, date });
        });

        Object.entries(grouped).forEach(([date, items]) => {
          const statuses = new Set<string>();
          const countsByStatus: Record<string, number> = {};
          const namesByStatus: Record<string, string[]> = {};

          items.forEach((it: any) => {
            const status = it.status || 'pending';
            statuses.add(status);

            const count = Number(it.customers || it.customers_count || 1) || 1;
            countsByStatus[status] = (countsByStatus[status] || 0) + count;

            if (it.name) {
              namesByStatus[status] = (namesByStatus[status] || []).concat([it.name]);
            } else if (Array.isArray(it.customers)) {
              const names = it.customers.map((c: any) => c.name).filter(Boolean);
              if (names.length) namesByStatus[status] = (namesByStatus[status] || []).concat(names);
            }

            if (status === 'delivered') delivered += count;
            if (status === 'leave') leaves += count;
          });

          const dots = Array.from(statuses).map((s) => ({ key: `${s}-${date}`, color: getStatusColor(s), selectedDotColor: getStatusColor(s) }));
          newCalendar[date] = { marked: true, dots };
          newTypes[date] = Array.from(statuses);
          newDetails[date] = { items, countsByStatus, namesByStatus };
        });

        state.calendarDataByMilkman[key] = newCalendar;
        state.deliveryTypesByMilkman[key] = newTypes;
        state.calendarDetailsByMilkman[key] = newDetails;

        // Fallback summary only if API month summary is not yet fetched
        if (!state.monthlySummaryByMilkman[key]) {
          state.monthlySummaryByMilkman[key] = {
            totalDays: Object.keys(newCalendar).length,
            distributed: delivered,
            totalMilk: delivered, // fallback, can change if API has real milk amount
            leaves,
          };
        }

        if (!state.lastFetchedMonths.includes(month)) {
          state.lastFetchedMonths.push(month);
        }
      })
      .addCase(fetchDistributorCalendarData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDistributorMonthSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistributorMonthSummary.fulfilled, (state, action) => {
        state.loading = false;
        const { milkmanId, data } = action.payload;
        const key = String(milkmanId);
        state.monthlySummaryRaw = data || null;

        // Map backend fields to our monthlySummaryByMilkman
        state.monthlySummaryByMilkman[key] = {
          totalDays: Number(data?.total_working_days ?? data?.totalDays ?? 0),
          distributed: Number(data?.days_delivered ?? data?.daysDelivered ?? 0),
          totalMilk: Number(data?.total_deliveries_made ?? data?.totalDeliveriesMade ?? 0),
          leaves: Number(data?.leaves_taken ?? data?.leavesTaken ?? 0),
        };
      })
      .addCase(fetchDistributorMonthSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(REHYDRATE, (state, action: any) => {
        if (action.payload?.distributorCalendar) {
          return { ...state, ...action.payload.distributorCalendar };
        }
      });
  },
});

export const {
  setCurrentMonth,
  clearError,
  cancelLeave,
  applySyncedDelivery,
} = distributorSlice.actions;

export default distributorSlice.reducer;
