import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
    getMilkmanMonthSummary,
    getConsumerDeliverySummary,
    getDailyDeliveryStatus,
    getConsumerDeliveryHistory,
} from '../realm/calendarRealm';

export interface MilkmanMonthSummary {
    totalDelivered: number;
    totalCancelled: number;
    totalConsumers: number;
    totalCount: number;
}

export interface ConsumerMonthlySummary {
    customerId: number;
    customerName: string;
    delivered: number;
    cancelled: number;
    pending: number;
    total: number;
}

export interface DailyDelivery {
    customer_id: number;
    customer_name: string;
    status: 'delivered' | 'cancelled';
    remarks?: string;
}

interface DistributorCalendarState {
    selectedMonth: number;
    selectedYear: number;
    monthlySummary: MilkmanMonthSummary | null;
    consumerSummaries: { [key: number]: ConsumerMonthlySummary };
    dailyDeliveries: { [key: string]: DailyDelivery[] };
    selectedConsumerId: number | null;
    consumerDeliveryHistory: any[];
    loading: boolean;
    isOffline: boolean;
}

const initialState: DistributorCalendarState = {
    selectedMonth: new Date().getMonth() + 1,
    selectedYear: new Date().getFullYear(),
    monthlySummary: null,
    consumerSummaries: {},
    dailyDeliveries: {},
    selectedConsumerId: null,
    consumerDeliveryHistory: [],
    loading: false,
    isOffline: false,
};

export const loadMonthlyData = createAsyncThunk(
    'distributorCalendar/loadMonthly',
    async ({ milkmanId, year, month }: { milkmanId: number; year: number; month: number }) => {
        try {
            // 🔥 Load from offline Realm
            const summary = getMilkmanMonthSummary(milkmanId, year, month);

            return {
                monthlySummary: summary,
                isOffline: true,
            };
        } catch (error) {
            console.error('Error loading monthly data:', error);
            return {
                monthlySummary: { totalDelivered: 0, totalCancelled: 0, totalConsumers: 0, totalCount: 0 },
                isOffline: false,
            };
        }
    }
);

export const loadConsumerDeliveryHistory = createAsyncThunk(
    'distributorCalendar/loadConsumerHistory',
    async ({ customerId, year, month }: { customerId: number; year: number; month: number }) => {
        try {
            // 🔥 Get from offline Realm
            const firstDay = `${year}-${String(month).padStart(2, '0')}-01`;
            const lastDay = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;

            const history = getConsumerDeliveryHistory(customerId, firstDay, lastDay);
            const summary = {
                customerId,
                delivered: history.filter((h: any) => h.status === 'delivered').length,
                cancelled: history.filter((h: any) => h.status === 'cancelled').length,
                pending: 0,
            };

            return {
                customerId,
                history,
                summary,
                isOffline: true,
            };
        } catch (error) {
            console.error('Error loading consumer history:', error);
            return {
                customerId,
                history: [],
                summary: { delivered: 0, cancelled: 0, pending: 0 },
                isOffline: false,
            };
        }
    }
);

export const loadDailyDeliveries = createAsyncThunk(
    'distributorCalendar/loadDailyDeliveries',
    async ({ milkmanId, date }: { milkmanId: number; date: string }) => {
        try {
            // 🔥 Get from offline Realm
            const deliveries = getDailyDeliveryStatus(milkmanId, date);

            return {
                date,
                deliveries,
                isOffline: true,
            };
        } catch (error) {
            console.error('Error loading daily deliveries:', error);
            return {
                date,
                deliveries: [],
                isOffline: false,
            };
        }
    }
);

const distributorCalendarSlice = createSlice({
    name: 'distributorCalendar',
    initialState,
    reducers: {
        setSelectedMonth: (state, action: PayloadAction<{ month: number; year: number }>) => {
            state.selectedMonth = action.payload.month;
            state.selectedYear = action.payload.year;
        },
        setSelectedConsumer: (state, action: PayloadAction<number | null>) => {
            state.selectedConsumerId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadMonthlyData.pending, (state) => {
                state.loading = true;
            })
            .addCase(loadMonthlyData.fulfilled, (state, action) => {
                state.loading = false;
                state.monthlySummary = action.payload.monthlySummary;
                state.isOffline = action.payload.isOffline;
            })
            .addCase(loadMonthlyData.rejected, (state) => {
                state.loading = false;
            })
            .addCase(loadConsumerDeliveryHistory.fulfilled, (state, action) => {
                state.consumerDeliveryHistory = action.payload.history;
                const summary = action.payload.summary;
                state.consumerSummaries[action.payload.customerId] = {
                    customerId: action.payload.customerId,
                    customerName: '',
                    delivered: summary.delivered,
                    cancelled: summary.cancelled,
                    pending: summary.pending,
                    total: summary.delivered + summary.cancelled + summary.pending,
                };
                state.isOffline = action.payload.isOffline;
            })
            .addCase(loadDailyDeliveries.fulfilled, (state, action) => {
                state.dailyDeliveries[action.payload.date] = action.payload.deliveries;
                state.isOffline = action.payload.isOffline;
            });
    },
});

export const { setSelectedMonth, setSelectedConsumer } = distributorCalendarSlice.actions;

export const selectDistributorCalendar = (state: { distributorCalendar: DistributorCalendarState }) => state.distributorCalendar;
export const selectMonthlySummary = (state: { distributorCalendar: DistributorCalendarState }) => state.distributorCalendar.monthlySummary;
export const selectConsumerDeliveryHistory = (state: { distributorCalendar: DistributorCalendarState }) => state.distributorCalendar.consumerDeliveryHistory;
export const selectIsCalendarOffline = (state: { distributorCalendar: DistributorCalendarState }) => state.distributorCalendar.isOffline;

export default distributorCalendarSlice.reducer;
