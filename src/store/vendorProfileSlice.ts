import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getVendorDetailsById, updateVendorProfile } from '../apiServices/allApi';

interface VendorProfileData {
  name?: string;
  email?: string;
  contact?: string;
  flat_house?: string;
  society_area?: string;
  village?: string;
  tal?: string;
  dist?: string;
  state?: string;
  pincode?: number | undefined;
  buffalo_milk_litre?: number | undefined;
  gir_cow_milk_litre?: number | undefined;
  jarshi_cow_milk_litre?: number | undefined;
  deshi_milk_litre?: number | undefined;
  gir_cow_rate?: string;
  jarshi_cow_rate?: string;
  deshi_cow_rate?: string;
  cr?: string;
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
    if (!userID) {
      return rejectWithValue('User ID is required');
    }
    try {
      console.log('🔍 Fetching vendor profile for ID:', userID);
      const response = await getVendorDetailsById(userID);
      console.log('✅ Vendor profile fetched:', response.data);

      if (!response?.data) {
        throw new Error('No profile data received');
      }
      return response.data;
    } catch (error: any) {
      console.error('❌ Fetch vendor profile error:', error);
      if (error?.response?.status === 404) {
        return rejectWithValue('Vendor profile not found');
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

export const updateVendorProfileData = createAsyncThunk<
  VendorProfileData,
  { id: string | number; data: VendorProfileData },
  { rejectValue: string }
>(
  'vendorProfile/updateVendorProfile',
  async ({ id, data }, { rejectWithValue }) => {
    if (!id) {
      return rejectWithValue('User ID is required');
    }
    try {
      console.log('📤 Updating vendor profile:', { id, data });

      // For PUT, send all fields (use undefined instead of null for optional fields)
      const submitData: VendorProfileData = {
        name: data.name || '',
        email: data.email || '',
        contact: data.contact || '',
        flat_house: data.flat_house || '',
        society_area: data.society_area || '',
        village: data.village || '',
        tal: data.tal || '',
        dist: data.dist || '',
        state: data.state || '',
        pincode: data.pincode || undefined, // ✅ Changed from null to undefined
        buffalo_milk_litre: data.buffalo_milk_litre || undefined, // ✅ Changed
        br: data.br || '',
        gir_cow_milk_litre: data.gir_cow_milk_litre || undefined, // ✅ Changed
        gir_cow_rate: data.gir_cow_rate || '',
        jarshi_cow_milk_litre: data.jarshi_cow_milk_litre || undefined, // ✅ Changed
        jarshi_cow_rate: data.jarshi_cow_rate || '',
        deshi_milk_litre: data.deshi_milk_litre || undefined, // ✅ Changed
        deshi_cow_rate: data.deshi_cow_rate || '',
        cr: data.cr || '',
      };

      console.log('📦 Cleaned data for PUT:', submitData);

      const response = await updateVendorProfile(id, submitData);
      console.log('✅ Vendor profile updated:', response.data);

      if (!response?.data) {
        throw new Error('Update failed');
      }
      return response.data;
    } catch (error: any) {
      console.error('❌ Update vendor profile error:', error);
      let message = 'Failed to update profile';

      if (error?.response) {
        const status = error.response.status;
        const detail = error.response.data?.detail || error.response.data?.message;

        console.log('❌ Error response:', {
          status,
          detail,
          fullError: error.response.data,
        });

        switch (status) {
          case 400:
            message = detail || 'Invalid data provided';
            break;
          case 401:
            message = 'Authentication failed';
            break;
          case 403:
            message = 'Permission denied';
            break;
          case 404:
            message = 'Profile not found';
            break;
          case 422:
            message = detail || 'Validation error';
            break;
          case 500:
            message = 'Server error';
            break;
          default:
            message = detail || `Error: ${status}`;
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
    setProfile(state, action: PayloadAction<VendorProfileData>) {
      state.profile = action.payload;
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
      })
      .addCase(updateVendorProfileData.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateVendorProfileData.fulfilled, (state, action: PayloadAction<VendorProfileData>) => {
        state.updating = false;
        state.success = true;
        state.error = null;
        state.lastUpdated = Date.now();
        state.profile = { ...state.profile, ...action.payload };
      })
      .addCase(updateVendorProfileData.rejected, (state, action) => {
        state.updating = false;
        state.success = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearSuccess,
  resetVendorProfileState,
  setProfile,
} = vendorProfileSlice.actions;

export default vendorProfileSlice.reducer;
