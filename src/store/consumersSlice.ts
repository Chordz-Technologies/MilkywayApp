
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getDistributorAssignedConsumers,
  markDeliveryAsSuccessful,
} from '../apiServices/allApi';
import NetInfo from '@react-native-community/netinfo';
import { saveOfflineDelivery } from '../realm/offlineDeliveryRealm';

export interface EnhancedDeliveryRecord {
  date: string;
  status: 'delivered' | 'cancelled';
  remarks?: string;
  milkman_id?: number;
  timestamp?: string;
}

export interface AssignedConsumer {
  id: number;
  customer_id: number;
  customer_name: string;
  customer_contact: string;
  customer_address?: string;
  assignment_date?: string;
  status?: string;

  milk_requirement?: {
    cow_milk_litre?: number | string | null;
    buffalo_milk_litre?: number | string | null;
  } | null;

  provider?: {
    provider_id: number;
    provider_name: string;
  };
  milkman?: {
    milkman_id: number;
    milkman_name: string;
    milkman_contact: string;
  };

  vendor_name?: string;

  deliveryStatus?: 'delivered' | 'cancelled' | 'pending';
  lastDeliveryDate?: string;
  lastDeliveryRemarks?: string;

  deliveryHistory?: EnhancedDeliveryRecord[];
  assigned_distributor_id?: number;
}

export interface DeliveryPayload {
  customer_id: number;
  date: string;
  milkman_id: number;
  status: 'delivered' | 'cancelled';
  cow_milk: number;
  buffalo_milk: number;
  reason: string;
  remarks?: string;
  replaceExisting?: boolean;
}

interface ConsumersState {
  consumers: AssignedConsumer[];
  loading: boolean;
  error: string | null;
  markingDelivery: number | null;
  selectedConsumer: AssignedConsumer | null;
  refreshing: boolean;
  lastFetchTime: number | null;
  lastActiveDate: string | null;

  extraMilkRequirement?: {
    cow_milk_litres: number;
    buffalo_milk_litres: number;
    total_litres: number;
  } | null;
}

const initialState: ConsumersState = {
  consumers: [],
  loading: false,
  error: null,
  markingDelivery: null,
  selectedConsumer: null,
  refreshing: false,
  lastFetchTime: null,
  lastActiveDate: null,
  extraMilkRequirement: null,
};

const safeParseMilkQuantity = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === 'string') {
    if (value.trim() === '') {
      return 0;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value;
  }

  return 0;
};

export const checkDailyReset = createAsyncThunk(
  'consumers/checkDailyReset',
  async (_, { getState, dispatch }) => {
    const state = getState() as { consumers: ConsumersState };
    const { lastActiveDate } = state.consumers;
    const today = new Date().toISOString().split('T')[0];

    if (lastActiveDate && lastActiveDate !== today) {
      dispatch(consumersSlice.actions.performDailyDeliveryReset());
    }

    return { today };
  }
);

const parseMilkRequirement = (consumer: any): { cow_milk_litre: number; buffalo_milk_litre: number } => {
  if (consumer.cow_milk_litre !== undefined || consumer.buffalo_milk_litre !== undefined) {
    const cowMilk = safeParseMilkQuantity(consumer.cow_milk_litre);
    const buffaloMilk = safeParseMilkQuantity(consumer.buffalo_milk_litre);
    return { cow_milk_litre: cowMilk, buffalo_milk_litre: buffaloMilk };
  }

  if (consumer.cow_milk !== undefined || consumer.buffalo_milk !== undefined) {
    const cowMilk = safeParseMilkQuantity(consumer.cow_milk);
    const buffaloMilk = safeParseMilkQuantity(consumer.buffalo_milk);
    return { cow_milk_litre: cowMilk, buffalo_milk_litre: buffaloMilk };
  }

  if (consumer.milk_requirement && typeof consumer.milk_requirement === 'object') {
    const cowMilk = safeParseMilkQuantity(
      consumer.milk_requirement.cow_milk_litre ||
      consumer.milk_requirement.cow_milk
    );
    const buffaloMilk = safeParseMilkQuantity(
      consumer.milk_requirement.buffalo_milk_litre ||
      consumer.milk_requirement.buffalo_milk
    );
    return { cow_milk_litre: cowMilk, buffalo_milk_litre: buffaloMilk };
  }

  return { cow_milk_litre: 0, buffalo_milk_litre: 0 };
};

export const fetchAssignedConsumers = createAsyncThunk(
  'consumers/fetchAssigned',
  async (milkmanId: number, { rejectWithValue }) => {
    try {
      const response = await getDistributorAssignedConsumers(milkmanId);

      const customers = response.data?.data?.customers;
      const extraMilk = response.data?.data?.daily_milk_requirement;

      if (!Array.isArray(customers)) {
        throw new Error("Invalid response format: customers must be an array");
      }

      const enhancedData = customers.map((consumer: any) => ({
        ...consumer,
        assigned_distributor_id: milkmanId,
        deliveryHistory: consumer.deliveryHistory || [],
        milk_requirement: parseMilkRequirement(consumer),
        id: consumer.customer_id,
      }));

      return {
        consumers: enhancedData,
        extraMilkRequirement: extraMilk,
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch consumers');
    }
  }
);

export const markDelivery = createAsyncThunk(
  'consumers/markDelivery',
  async (payload: DeliveryPayload, { rejectWithValue }) => {
    try {
      // ✅ Check network connectivity first
      const netState = await NetInfo.fetch();
      const isConnected = netState.isConnected ?? false;

      if (!isConnected) {
        // 📱 OFFLINE: Save to Realm instead of trying API
        console.log('[Delivery] Offline mode - saving to Realm...');
        saveOfflineDelivery({
          customer_id: payload.customer_id,
          date: payload.date,
          milkman_id: payload.milkman_id,
          status: payload.status,
          cow_milk: payload.cow_milk,
          buffalo_milk: payload.buffalo_milk,
          reason: payload.reason,
          remarks: payload.remarks,
        });

        // Return success with offline flag
        return {
          ...payload,
          timestamp: new Date().toISOString(),
          isOffline: true,
          response: { success: true, message: 'Saved offline - will sync when online' },
        };
      }

      // 🌐 ONLINE: Call API normally
      const response = await markDeliveryAsSuccessful(payload);
      console.log("Delivery data payload:", payload);
      return {
        ...payload,
        timestamp: new Date().toISOString(),
        isOffline: false,
        response: response.data,
      };
    } catch (error: any) {
      // ❌ API Error: Try to save offline as fallback
      try {
        console.log('[Delivery] API failed - saving to Realm as fallback...');
        saveOfflineDelivery({
          customer_id: payload.customer_id,
          date: payload.date,
          milkman_id: payload.milkman_id,
          status: payload.status,
          cow_milk: payload.cow_milk,
          buffalo_milk: payload.buffalo_milk,
          reason: payload.reason,
          remarks: payload.remarks,
        });

        return {
          ...payload,
          timestamp: new Date().toISOString(),
          isOffline: true,
          response: { success: true, message: 'Saved offline - will sync when online' },
        };
      } catch (realmError) {
        console.log('[Delivery] ❌ Both API and Realm failed:', realmError);
        return rejectWithValue(error.response?.data?.message || error.message || 'Failed to mark delivery');
      }
    }
  }
);

export const refreshConsumers = createAsyncThunk(
  'consumers/refresh',
  async (milkmanId: number, { dispatch }) => {
    dispatch(consumersSlice.actions.setRefreshing(true));
    const result = await dispatch(fetchAssignedConsumers(milkmanId));
    dispatch(consumersSlice.actions.setRefreshing(false));
    return result;
  }
);

const consumersSlice = createSlice({
  name: 'consumers',
  initialState,
  reducers: {
    setSelectedConsumer: (state, action: PayloadAction<AssignedConsumer | null>) => {
      state.selectedConsumer = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setRefreshing: (state, action: PayloadAction<boolean>) => {
      state.refreshing = action.payload;
    },
    resetConsumers: (state) => {
      state.consumers = [];
      state.selectedConsumer = null;
      state.error = null;
      state.lastFetchTime = null;
    },
    updateConsumerOptimistic: (state, action: PayloadAction<{
      customerId: number;
      updates: Partial<AssignedConsumer>
    }>) => {
      const { customerId, updates } = action.payload;
      const consumerIndex = state.consumers.findIndex(c => c.customer_id === customerId);
      if (consumerIndex !== -1) {
        Object.assign(state.consumers[consumerIndex], updates);
      }
    },
    forceCalendarUpdate: (state) => {
      state.lastFetchTime = Date.now();
    },

    performDailyDeliveryReset: (state) => {
      state.consumers.forEach(consumer => {
        consumer.deliveryStatus = undefined;
        consumer.lastDeliveryDate = undefined;
        consumer.lastDeliveryRemarks = undefined;
      });

      state.lastActiveDate = new Date().toISOString().split('T')[0];
    },

    updateLastActiveDate: (state) => {
      state.lastActiveDate = new Date().toISOString().split('T')[0];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignedConsumers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedConsumers.fulfilled, (state, action) => {
        state.loading = false;

        const { consumers, extraMilkRequirement } = action.payload;

        state.extraMilkRequirement = extraMilkRequirement;

        // 🔥 Same merging logic you already use
        if (state.consumers.length > 0) {
          state.consumers = consumers.map(apiConsumer => {
            const existing = state.consumers.find(c => c.customer_id === apiConsumer.customer_id);

            if (existing) {
              return {
                ...apiConsumer,
                deliveryStatus: existing.deliveryStatus,
                lastDeliveryDate: existing.lastDeliveryDate,
                lastDeliveryRemarks: existing.lastDeliveryRemarks,
                deliveryHistory: existing.deliveryHistory || [],
              };
            }
            return apiConsumer;
          });
        } else {
          state.consumers = consumers;
        }

        state.lastFetchTime = Date.now();
        state.error = null;
      })
      .addCase(fetchAssignedConsumers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(markDelivery.pending, (state, action) => {
        state.markingDelivery = action.meta.arg.customer_id;
        state.error = null;
      })
      .addCase(markDelivery.fulfilled, (state, action) => {
        state.markingDelivery = null;

        const consumerIndex = state.consumers.findIndex(
          c => c.customer_id === action.payload.customer_id
        );

        if (consumerIndex !== -1) {
          const consumer = state.consumers[consumerIndex];

          consumer.deliveryStatus = action.payload.status;
          consumer.lastDeliveryDate = action.payload.date;
          consumer.lastDeliveryRemarks = action.payload.remarks;

          if (!consumer.deliveryHistory) {
            consumer.deliveryHistory = [];
          }

          const newRecord = {
            date: action.payload.date,
            status: action.payload.status,
            remarks: action.payload.remarks,
            milkman_id: action.payload.milkman_id,
            timestamp: action.payload.timestamp,
          };

          if (action.payload.replaceExisting) {
            const existingRecordIndex = consumer.deliveryHistory.findIndex(
              d => d.date === action.payload.date
            );

            if (existingRecordIndex !== -1) {
              consumer.deliveryHistory[existingRecordIndex] = newRecord;
            } else {
              consumer.deliveryHistory.push(newRecord);
            }
          } else {
            consumer.deliveryHistory.push(newRecord);
          }
        }

        state.lastActiveDate = new Date().toISOString().split('T')[0];
        state.lastFetchTime = Date.now();
      })
      .addCase(markDelivery.rejected, (state, action) => {
        state.markingDelivery = null;
        state.error = action.payload as string;
      })

      .addCase(checkDailyReset.fulfilled, (state, action) => {
        state.lastActiveDate = action.payload.today;
      });
  },
});

export const {
  setSelectedConsumer,
  clearError,
  setRefreshing,
  resetConsumers,
  updateConsumerOptimistic,
  forceCalendarUpdate,
  performDailyDeliveryReset,
  updateLastActiveDate,
} = consumersSlice.actions;

export const selectConsumers = (state: { consumers: ConsumersState }) => state.consumers.consumers;
export const selectConsumersLoading = (state: { consumers: ConsumersState }) => state.consumers.loading;
export const selectConsumersError = (state: { consumers: ConsumersState }) => state.consumers.error;
export const selectMarkingDelivery = (state: { consumers: ConsumersState }) => state.consumers.markingDelivery;
export const selectSelectedConsumer = (state: { consumers: ConsumersState }) => state.consumers.selectedConsumer;
export const selectConsumersRefreshing = (state: { consumers: ConsumersState }) => state.consumers.refreshing;
export const selectLastActiveDate = (state: { consumers: ConsumersState }) => state.consumers.lastActiveDate;

export const selectConsumersStats = (state: { consumers: ConsumersState }) => {
  const consumers = state.consumers.consumers;
  const totalConsumers = consumers.length;
  const totalMilk = consumers.reduce((total, consumer) => {
    const cow = safeParseMilkQuantity(consumer.milk_requirement?.cow_milk_litre) || 0;
    const buffalo = safeParseMilkQuantity(consumer.milk_requirement?.buffalo_milk_litre) || 0;
    return total + cow + buffalo;
  }, 0);
  const activeConsumers = consumers.filter(c =>
    c.status?.toLowerCase() === 'active' || !c.status
  ).length;

  return { totalConsumers, totalMilk, activeConsumers };
};

export const selectConsumerById = (customerId: number) =>
  (state: { consumers: ConsumersState }) =>
    state.consumers.consumers.find(c => c.customer_id === customerId);

export default consumersSlice.reducer;
