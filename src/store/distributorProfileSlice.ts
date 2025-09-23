import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getDistributorDetailsById, updateMilkmanProfile } from '../apiServices/allApi';

interface DistributorProfileData {
  full_name?: string;
  flat_house?: string;
  society_name?: string;
  village?: string;
  tal?: string;
  dist?: string;
  state?: string;
  pincode?: string;
  provider?: number;
  [key: string]: any;
}

interface DistributorProfileState {
  profile: DistributorProfileData | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
  success: boolean;
  lastUpdated: number | null;
}

const initialState: DistributorProfileState = {
  profile: null,
  loading: false,
  updating: false,
  error: null,
  success: false,
  lastUpdated: null,
};

export const fetchDistributorProfile = createAsyncThunk<
  DistributorProfileData,
  string | number,
  { rejectValue: string }
>(
  'distributorProfile/fetchDistributorProfile',
  async (userID, { rejectWithValue }) => {
    if (!userID) {return rejectWithValue('User ID is required');}
    try {
      const response = await getDistributorDetailsById(userID);
      if (!response?.data) {throw new Error('No profile data received');}
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) {
        return rejectWithValue('Distributor profile not found');
      }
      if (error?.response?.status === 401) {
        return rejectWithValue('Authentication failed. Please login again.');
      }
      return rejectWithValue(
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        error?.message ||
        'Failed to fetch profile'
      );
    }
  }
);

export const updateDistributorProfile = createAsyncThunk<
  DistributorProfileData,
  { id: string | number; data: DistributorProfileData },
  { rejectValue: string }
>(
  'distributorProfile/updateDistributorProfile',
  async ({ id, data }, { rejectWithValue }) => {
    if (!id) {return rejectWithValue('User ID is required');}
    try {
      const cleanData: DistributorProfileData = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanData[key] = value;
        }
      });

      if (Object.keys(cleanData).length === 0) {
        throw new Error('No data to update');
      }

      const response = await updateMilkmanProfile(id, cleanData);
      if (!response?.data) {throw new Error('Update failed');}
      return response.data;
    } catch (error: any) {
      let message = 'Failed to update profile';
      if (error?.response) {
        const status = error.response.status;
        const detail = error.response.data?.detail || error.response.data?.message;
        switch (status) {
          case 400: message = detail || 'Invalid data provided'; break;
          case 401: message = 'Authentication failed'; break;
          case 403: message = 'Permission denied'; break;
          case 404: message = 'Profile not found'; break;
          case 422: message = detail || 'Validation error'; break;
          case 500: message = 'Server error'; break;
          default: message = detail || `Error: ${status}`;
        }
      } else if (error?.code === 'NETWORK_ERROR' || error?.message === 'Network Error') {
        message = 'Network error. Please check your connection.';
      } else if (error?.message) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

const distributorProfileSlice = createSlice({
  name: 'distributorProfile',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.success = false;
    },
    resetDistributorProfileState() {
      return initialState;
    },
    setProfile(state, action: PayloadAction<DistributorProfileData>) {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistributorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistributorProfile.fulfilled, (state, action: PayloadAction<DistributorProfileData>) => {
        state.loading = false;
        state.error = null;
        state.profile = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchDistributorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateDistributorProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDistributorProfile.fulfilled, (state, action: PayloadAction<DistributorProfileData>) => {
        state.updating = false;
        state.success = true;
        state.error = null;
        state.lastUpdated = Date.now();
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateDistributorProfile.rejected, (state, action) => {
        state.updating = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  resetDistributorProfileState,
  setProfile,
} = distributorProfileSlice.actions;

export default distributorProfileSlice.reducer;
