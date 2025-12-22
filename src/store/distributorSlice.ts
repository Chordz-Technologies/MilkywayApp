

// import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
// import { REHYDRATE } from 'redux-persist';
// import {
//   getDistributorCalendar,
//   applyForDistributorLeave,
// } from '../apiServices/allApi';

// interface DistributorLeaveCalendarItem {
//   date: string;
//   status: string;
//   remarks?: string;
//   milkman_id?: number;
// }

// interface CustomMarking {
//   marked?: boolean;
//   dotColor?: string;
//   dots?: Array<{
//     key: string;
//     color: string;
//     selectedDotColor?: string;
//   }>;
//   selected?: boolean;
//   selectedColor?: string;
// }

// interface LeaveItem {
//   id: string;
//   date: string;
//   reason: string;
//   status: 'approved' | 'pending' | 'leave';
// }

// interface MonthlySummary {
//   totalLeaves: number;
//   approvedLeaves: number;
//   pendingLeaves: number;
// }

// interface DistributorCalendarState {
//   calendarData: { [date: string]: CustomMarking };
//   leaveTypes: Record<string, string>;
//   upcomingLeaves: Record<number, LeaveItem[]>; // scoped by milkmanId
//   monthlySummary: MonthlySummary;
//   calendarDetails: Record<string, any>;
//   loading: boolean;
//   error: string | null;
//   currentMonth: number;
//   currentYear: number;
// }

// const initialState: DistributorCalendarState = {
//   calendarData: {},
//   leaveTypes: {},
//   upcomingLeaves: {},
//   monthlySummary: {
//     totalLeaves: 0,
//     approvedLeaves: 0,
//     pendingLeaves: 0,
//   },
//   calendarDetails: {},
//   loading: false,
//   error: null,
//   currentMonth: new Date().getMonth(),
//   currentYear: new Date().getFullYear(),
// };

// export const fetchDistributorCalendarData = createAsyncThunk(
//   'distributorCalendar/fetchCalendarData',
//   async (params: { milkmanId: number; month: string }, thunkAPI) => {
//     try {
//       console.log('📡 Fetching calendar data:', params);

//       const response = await getDistributorCalendar({
//         milkman_id: params.milkmanId,
//         month: params.month,
//       });
//       console.log('✅ Fetched calendar data:', response.data);
//       return { data: response.data, month: params.month, milkmanId: params.milkmanId };
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue('Failed to fetch distributor calendar data');
//     }
//   }
// );

// interface LeaveRequestInput {
//   startDate: string;
//   endDate: string;
//   reason: string;
//   leaveType: 'single' | 'multiple';
//   milkmanId?: number;
// }

// export const submitDistributorLeaveRequest = createAsyncThunk(
//   'distributorCalendar/submitLeaveRequest',
//   async (
//     { milkmanId, leaveData }: { milkmanId?: number; leaveData: LeaveRequestInput },
//     thunkAPI,
//   ) => {
//     try {
//       const dates =
//         leaveData.leaveType === 'single'
//           ? [leaveData.startDate]
//           : getDatesBetween(leaveData.startDate, leaveData.endDate);

//       for (const date of dates) {
//         await applyForDistributorLeave({
//           milkman_id: leaveData.milkmanId || milkmanId,
//           date,
//           remarks: leaveData.reason,
//         });
//       }
//       return { dates, reason: leaveData.reason, milkmanId: leaveData.milkmanId || milkmanId };
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue('Failed to submit leave request');
//     }
//   }
// );

// const getDatesBetween = (startDate: string, endDate: string): string[] => {
//   const dates: string[] = [];
//   const start = new Date(startDate);
//   const end = new Date(endDate);
//   for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
//     dates.push(dt.toISOString().split('T')[0]);
//   }
//   return dates;
// };

// const getStatusColor = (status: string): string => {
//   switch (status) {
//     case 'delivered':
//       return '#4CAF50'; // green
//     case 'pending_leave':
//       return '#FF9800'; // orange
//     case 'pending':
//       return '#F44336'; // red
//     case 'leave':
//       return '#9C27B0'; // purple
//     case 'cancelled':
//       return '#E91E63'; // pink
//     default:
//       return '#757575';
//   }
// };

// const distributorCalendarSlice = createSlice({
//   name: 'distributorCalendar',
//   initialState,
//   reducers: {
//     setCurrentMonth: (state, action: PayloadAction<{ month: number; year: number }>) => {
//       state.currentMonth = action.payload.month;
//       state.currentYear = action.payload.year;
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//     cancelLeave: (
//       state,
//       action: PayloadAction<{ leaveId: string; leaveDate: string; milkmanId: number }>,
//     ) => {
//       const { leaveId, leaveDate, milkmanId } = action.payload;
//       // Remove leave only for given distributor
//       state.upcomingLeaves[milkmanId] = (state.upcomingLeaves[milkmanId] || []).filter(
//         (leave) => leave.id !== leaveId,
//       );
//       if (state.calendarData[leaveDate]) {
//         delete state.calendarData[leaveDate];
//       }
//       if (state.leaveTypes[leaveDate]) {
//         delete state.leaveTypes[leaveDate];
//       }
//     },
//     clearDistributorCalendar: (state) => {
//       state.calendarData = {};
//       state.leaveTypes = {};
//       state.upcomingLeaves = {};
//       state.monthlySummary = {
//         totalLeaves: 0,
//         approvedLeaves: 0,
//         pendingLeaves: 0,
//       };
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchDistributorCalendarData.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchDistributorCalendarData.fulfilled, (state, action) => {
//         const { data, milkmanId } = action.payload;
//         state.loading = false;
//         const newCalendarData: { [date: string]: CustomMarking } = {};
//         const newLeaveTypes: Record<string, string> = {};
//         const newCalendarDetails: Record<string, any> = {};
//         let approvedCount = 0;
//         let pendingCount = 0;

//         if (Array.isArray(data)) {
//           // Group items by date
//           const grouped: Record<string, any[]> = {};
//           data.forEach((item: DistributorLeaveCalendarItem) => {
//             if (!grouped[item.date]) grouped[item.date] = [];
//             grouped[item.date].push(item);
//           });

//           Object.entries(grouped).forEach(([date, items]) => {
//             // collect unique statuses and details
//             const statuses: Set<string> = new Set();
//             const countsByStatus: Record<string, number> = {};
//             const namesByStatus: Record<string, string[]> = {};

//             items.forEach((it: any) => {
//               const status = it.status || 'pending';
//               statuses.add(status);
//               countsByStatus[status] = (countsByStatus[status] || 0) + (it.count || it.customers_count || 1);
//               // try to collect names if present
//               if (Array.isArray(it.names)) {
//                 namesByStatus[status] = (namesByStatus[status] || []).concat(it.names);
//               } else if (it.customer_name) {
//                 namesByStatus[status] = (namesByStatus[status] || []).concat([it.customer_name]);
//               } else if (it.customers && Array.isArray(it.customers)) {
//                 // maybe API returns array of customer objects
//                 const names = it.customers.map((c: any) => c.name).filter(Boolean);
//                 if (names.length) namesByStatus[status] = (namesByStatus[status] || []).concat(names);
//               }

//               if (status === 'approved' || status === 'distributed' || status === 'delivered') {
//                 approvedCount += it.count || it.customers_count || 1;
//               } else if (status === 'pending') {
//                 pendingCount += it.count || it.customers_count || 1;
//               }
//             });

//             const dots = Array.from(statuses).map((s) => ({ key: `${s}_${date}`, color: getStatusColor(s) }));

//             newCalendarData[date] = { marked: true, dots };
//             // remember the predominant status as leaveTypes for compatibility (pick highest priority)
//             const priority = ['leave', 'pending', 'cancelled', 'missed', 'delivered', 'distributed', 'approved'];
//             const chosen = Array.from(statuses).sort((a, b) => priority.indexOf(a) - priority.indexOf(b))[0];
//             if (chosen) newLeaveTypes[date] = chosen;

//             newCalendarDetails[date] = {
//               items,
//               countsByStatus,
//               namesByStatus,
//             };
//           });
//         }

//         state.calendarData = newCalendarData;
//         state.leaveTypes = newLeaveTypes;
//         state.calendarDetails = newCalendarDetails;
//         state.monthlySummary.totalLeaves = approvedCount + pendingCount;
//         state.monthlySummary.approvedLeaves = approvedCount;
//         state.monthlySummary.pendingLeaves = pendingCount;

//         // Initialize leaves array for distributor if missing
//         if (milkmanId != null && !(milkmanId in state.upcomingLeaves)) {
//           state.upcomingLeaves[milkmanId] = [];
//         }
//       })
//       .addCase(fetchDistributorCalendarData.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(submitDistributorLeaveRequest.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(submitDistributorLeaveRequest.fulfilled, (state, action) => {
//         const { dates, reason, milkmanId } = action.payload;
//         state.loading = false;

//         if (milkmanId == null) { return; }

//         const leaves = state.upcomingLeaves[milkmanId] || [];

//         dates.forEach((date) => {
//           const uniqueId = `${milkmanId}_${date}_${Date.now()}`;
//           state.calendarData[date] = { marked: true, dotColor: '#9C27B0' };
//           state.leaveTypes[date] = 'pending';

//           if (!leaves.some((leave) => leave.id === uniqueId)) {
//             leaves.push({
//               id: uniqueId,
//               date: dates.length === 1 ? dates[0] : `${dates[0]} to ${dates[dates.length - 1]}`,
//               reason,
//               status: 'pending',
//             });
//           }
//         });

//         state.upcomingLeaves[milkmanId] = leaves;
//         state.monthlySummary.totalLeaves += dates.length;
//         state.monthlySummary.pendingLeaves += dates.length;
//       })
//       .addCase(submitDistributorLeaveRequest.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       .addCase(REHYDRATE, (state, action: any) => {
//         if (action.payload?.distributorCalendar) {
//           return { ...state, ...action.payload.distributorCalendar, loading: false };
//         }
//       });
//   },
// });

// export const {
//   setCurrentMonth,
//   clearError,
//   cancelLeave,
//   clearDistributorCalendar,
// } = distributorCalendarSlice.actions;

// export default distributorCalendarSlice.reducer;


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
} = distributorSlice.actions;

export default distributorSlice.reducer;
