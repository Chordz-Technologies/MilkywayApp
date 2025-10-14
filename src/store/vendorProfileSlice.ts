
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
  pincode?: number | null;
  buffalo_milk_litre?: number | null;
  br?: string;
  gir_cow_milk_litre?: number | null;
  gir_cow_rate?: string;
  jarshi_cow_milk_litre?: number | null;
  jarshi_cow_rate?: string;
  deshi_milk_litre?: number | null;
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
  async ({ id, data }, { rejectWithValue, getState }) => {
    if (!id) {
      return rejectWithValue('User ID is required');
    }
    try {
      console.log('📤 Updating vendor profile - RAW DATA:', { id, data });

      // Get current profile from state
      const state = getState() as { vendorProfile: VendorProfileState };
      const currentProfile = state.vendorProfile.profile;

      // Extract the actual data object (handle nested structure)
      const profileData = currentProfile?.data || currentProfile;

      console.log('📋 Current profile data:', profileData);

      // Format contact number
      let formattedContact = data.contact;
      if (data.contact) {
        let cleaned = data.contact.trim();

        console.log('🔍 RAW contact received:', cleaned);

        // Remove +91 prefix if exists
        if (cleaned.startsWith('+91')) {
          cleaned = cleaned.substring(3);
        }
        // Remove 91 prefix ONLY if it's at start AND total length is 12
        else if (cleaned.startsWith('91') && cleaned.length === 12) {
          cleaned = cleaned.substring(2);
        }

        // Remove any non-digit characters
        cleaned = cleaned.replace(/\D/g, '');

        console.log('🧹 Cleaned contact:', cleaned);
        console.log('📏 Contact length:', cleaned.length);

        if (cleaned.length === 10) {
          formattedContact = `+91${cleaned}`;
        } else if (cleaned.length > 0) {
          console.error('❌ Invalid contact length:', cleaned.length, 'Expected: 10');
          return rejectWithValue('Contact must be exactly 10 digits');
        }
      }

      console.log('📞 Final formatted contact:', formattedContact);

      // ✅ Build submit data - ONLY send fields that are being updated (PATCH behavior)
      const submitData: any = {};

      // Only include fields that are explicitly provided in the update
      if (data.name !== undefined) {submitData.name = data.name;}
      if (data.email !== undefined) {submitData.email = data.email;}
      if (formattedContact !== undefined) {submitData.contact = formattedContact;}
      if (data.flat_house !== undefined) {submitData.flat_house = data.flat_house;}
      if (data.society_area !== undefined) {submitData.society_area = data.society_area;}
      if (data.village !== undefined) {submitData.village = data.village;}
      if (data.tal !== undefined) {submitData.tal = data.tal;}
      if (data.dist !== undefined) {submitData.dist = data.dist;}
      if (data.state !== undefined) {submitData.state = data.state;}
      if (data.pincode !== undefined) {submitData.pincode = data.pincode;}
      if (data.buffalo_milk_litre !== undefined) {submitData.buffalo_milk_litre = data.buffalo_milk_litre;}
      if (data.br !== undefined) {submitData.br = data.br;}
      if (data.gir_cow_milk_litre !== undefined) {submitData.gir_cow_milk_litre = data.gir_cow_milk_litre;}
      if (data.gir_cow_rate !== undefined) {submitData.gir_cow_rate = data.gir_cow_rate;}
      if (data.jarshi_cow_milk_litre !== undefined) {submitData.jarshi_cow_milk_litre = data.jarshi_cow_milk_litre;}
      if (data.jarshi_cow_rate !== undefined) {submitData.jarshi_cow_rate = data.jarshi_cow_rate;}
      if (data.deshi_milk_litre !== undefined) {submitData.deshi_milk_litre = data.deshi_milk_litre;}
      if (data.deshi_cow_rate !== undefined) {submitData.deshi_cow_rate = data.deshi_cow_rate;}
      if (data.cr !== undefined) {submitData.cr = data.cr;}

      console.log('📦 PATCH data (only updated fields):', submitData);

      const response = await updateVendorProfile(id, submitData);
      console.log('✅ Vendor profile updated successfully:', response.data);

      if (!response?.data) {
        throw new Error('Update failed - no data returned');
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

        console.log('❌ Request payload that failed:', error.config?.data);

        switch (status) {
          case 400:
            message = detail || 'Invalid data provided. Please check all fields.';
            break;
          case 401:
            message = 'Authentication failed. Please login again.';
            break;
          case 403:
            message = 'Permission denied. You cannot update this profile.';
            break;
          case 404:
            message = 'Profile not found.';
            break;
          case 422:
            message = detail || 'Validation error. Please check your input.';
            break;
          case 500:
            message = 'Server error. Please try again later.';
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
        console.log('✅ Profile saved to Redux state:', action.payload);
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

        // ✅ Merge updated data with existing profile (PATCH behavior)
        state.profile = {
          ...state.profile,
          ...action.payload,
        };

        console.log('✅ Profile updated in Redux state:', state.profile);
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
