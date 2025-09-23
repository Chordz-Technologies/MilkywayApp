import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getVendorDetailsById } from '../apiServices/allApi'; // Your existing API

interface VendorProfileData {
  name?: string;
  flat_house?: string;
  society_area?: string;
  village?: string;
  tal?: string;
  dist?: string;
  state?: string;
  confirm_password?: string;
  buffalo_milk_litre?: number;
  br?: string;
  gir_cow_milk_litre?: number;
  jarshi_cow_milk_litre?: number;
  deshi_milk_litre?: number;
  gir_cow_rate?: string;
  jarshi_cow_rate?: string;
  deshi_cow_rate?: string;
  cr?: string;
  email?: string;
  pincode?: string;
  [key: string]: any;
}

interface VendorProfileState {
  profile: VendorProfileData | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
  success: boolean;
  lastUpdated: number | null;
}

const initialState: VendorProfileState = {
  profile: null,
  loading: false,
  updating: false,
  error: null,
  success: false,
  lastUpdated: null,
};

export const fetchVendorProfile = createAsyncThunk<
  VendorProfileData,
  string | number,
  { rejectValue: string }
>(
  'vendorProfile/fetchVendorProfile',
  async (userID, { rejectWithValue }) => {
    if (!userID) {return rejectWithValue('User ID is required');}
    try {
      const response = await getVendorDetailsById(userID);
      if (!response?.data) {throw new Error('No profile data received');}
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to fetch vendor profile'
      );
    }
  }
);

export const updateVendorProfile = createAsyncThunk<
  VendorProfileData,
  { id: string | number; data: VendorProfileData },
  { rejectValue: string }
>(
  'vendorProfile/updateVendorProfile',
  async ({ id, data }, { rejectWithValue }) => {
    if (!id) {return rejectWithValue('User ID is required');}
    try {
      // Clean data - remove empty/null/undefined values
      const cleanData: VendorProfileData = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanData[key] = value;
        }
      });

      if (Object.keys(cleanData).length === 0) {throw new Error('No valid data to update');}

      const { default: apiClient } = await import('../apiServices/allApi');
      const response = await apiClient.put(`/vendor/vendors/${id}/`, cleanData);
      if (!response?.data) {throw new Error('No response data received');}

      return response.data;
    } catch (error: any) {
      let message = 'Failed to update vendor profile';
      if (error?.code === 'NETWORK_ERROR' || error?.message === 'Network Error')
        {message = 'Network error: Please check your internet connection';}
      else if (error?.response) {
        const status = error.response.status;
        switch (status) {
          case 400:
            message = 'Invalid data provided';
            break;
          case 401:
            message = 'Authentication failed';
            break;
          case 403:
            message = 'Permission denied';
            break;
          case 404:
            message = 'Vendor profile not found';
            break;
          case 422:
            message = 'Validation error';
            break;
          case 500:
            message = 'Server error';
            break;
          default:
            message = `Error: ${status}`;
        }
      } else if (error?.request) {message = 'No response from server';}
      else if (error?.message) {message = error.message;}

      return rejectWithValue(message);
    }
  }
);

const vendorProfileSlice = createSlice({
  name: 'vendorProfile',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.success = false;
    },
    resetVendorProfileState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVendorProfile.fulfilled, (state, action: PayloadAction<VendorProfileData>) => {
        state.loading = false;
        state.error = null;
        state.profile = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchVendorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.profile = null;
      })
      .addCase(updateVendorProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateVendorProfile.fulfilled, (state, action: PayloadAction<VendorProfileData>) => {
        state.updating = false;
        state.success = true;
        state.error = null;
        state.lastUpdated = Date.now();
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateVendorProfile.rejected, (state, action) => {
        state.updating = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess, resetVendorProfileState } = vendorProfileSlice.actions;
export default vendorProfileSlice.reducer;
