import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { deleteConsumerAccountPermanently, getConsumerDetailsById, updateCustomerProfile } from '../apiServices/allApi';

interface ConsumerProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
  flat_no?: string;
  society_name?: string;
  village?: string;
  tal?: string;
  dist?: string;
  state?: string;
  provider?: number;
  milkman?: number;
  cow_milk_litre?: string;
  buffalo_milk_litre?: string;
  service_start_date?: string;
  service_end_date?: string;
  pincode?: string;
  [key: string]: any;
}

interface ConsumerProfileState {
  profile: ConsumerProfileData | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
  success: boolean;
  lastUpdated: number | null;
  deleting: boolean;
  deleteSuccess: boolean;
}

const initialState: ConsumerProfileState = {
  profile: null,
  loading: false,
  updating: false,
  error: null,
  success: false,
  lastUpdated: null,
  deleting: false,
  deleteSuccess: false,
};

// Fetch Consumer Profile
export const fetchConsumerProfile = createAsyncThunk<
  ConsumerProfileData,
  string | number,
  { rejectValue: string }
>(
  'consumerProfile/fetchConsumerProfile',
  async (userID, { rejectWithValue }) => {
    if (!userID) { return rejectWithValue('User ID is required'); }
    try {
      console.log('🔍 Fetching consumer profile for ID:', userID);
      const response = await getConsumerDetailsById(userID);
      console.log('✅ Consumer API Response:', response);

      if (!response?.data) {
        console.log('❌ No data in response');
        throw new Error('No profile data received');
      }

      console.log('📝 Consumer profile data:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Fetch consumer profile error:', error);
      console.log('❌ Error details:', JSON.stringify(error?.response?.data, null, 2));
      if (error?.response?.status === 404) {
        return rejectWithValue('Consumer profile not found. Please create a consumer profile first.');
      }

      if (error?.response?.status === 401) {
        return rejectWithValue('Authentication failed. Please login again.');
      }

      return rejectWithValue(
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        'Failed to fetch consumer profile'
      );
    }
  }
);

// Update Consumer Profile
export const updateConsumerProfile = createAsyncThunk<
  ConsumerProfileData,
  { id: string | number; data: ConsumerProfileData },
  { rejectValue: string }
>(
  'consumerProfile/updateConsumerProfile',
  async ({ id, data }, { rejectWithValue }) => {
    if (!id) { return rejectWithValue('User ID is required'); }
    try {
      // Clean the data - remove empty values
      const cleanData: ConsumerProfileData = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanData[key] = value;
        }
      });

      if (Object.keys(cleanData).length === 0) {
        throw new Error('No valid data to update');
      }

      console.log('🔄 Updating consumer profile:', { id, data: cleanData });
      const response = await updateCustomerProfile(id, cleanData);
      console.log('✅ Consumer update response:', response);

      if (!response?.data) {
        throw new Error('No response data received');
      }

      return response.data;
    } catch (error: any) {
      console.error('❌ Update consumer profile error:', error);

      let message = 'Failed to update consumer profile';

      if (error?.response) {
        const status = error.response.status;
        const detail = error.response.data?.detail || error.response.data?.message;

        switch (status) {
          case 400:
            message = detail || 'Invalid data provided';
            break;
          case 401:
            message = 'Authentication failed. Please login again.';
            break;
          case 403:
            message = 'Permission denied';
            break;
          case 404:
            message = 'Consumer profile not found';
            break;
          case 422:
            message = detail || 'Validation error - Please check your input';
            break;
          case 500:
            message = 'Server error. Please try again later.';
            break;
          default:
            message = detail || `Server error: ${status}`;
        }
      } else if (error?.code === 'NETWORK_ERROR' || error?.message === 'Network Error') {
        message = 'Network error. Please check your internet connection.';
      } else if (error?.message) {
        message = error.message;
      }

      return rejectWithValue(message);
    }
  }
);

export const deleteConsumerAccount = createAsyncThunk(
  "profile/deleteConsumerAccount",
  async (consumerId: string | number, { rejectWithValue }) => {
    try {
      const response = await deleteConsumerAccountPermanently(consumerId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete account");
    }
  }
);

// Redux Slice
const consumerProfileSlice = createSlice({
  name: 'consumerProfile',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.success = false;
    },
    resetConsumerProfileState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Consumer Profile
      .addCase(fetchConsumerProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConsumerProfile.fulfilled, (state, action: PayloadAction<ConsumerProfileData>) => {
        state.loading = false;
        state.error = null;
        state.profile = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchConsumerProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        // Keep existing profile on fetch error - don't clear it
      })

      // Update Consumer Profile
      .addCase(updateConsumerProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateConsumerProfile.fulfilled, (state, action: PayloadAction<ConsumerProfileData>) => {
        state.updating = false;
        state.success = true;
        state.error = null;
        state.lastUpdated = Date.now();
        // Merge updated data with existing profile
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateConsumerProfile.rejected, (state, action) => {
        state.updating = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess, resetConsumerProfileState } = consumerProfileSlice.actions;
export default consumerProfileSlice.reducer;
