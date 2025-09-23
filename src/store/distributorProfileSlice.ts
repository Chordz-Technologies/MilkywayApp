// // // store/slices/profileSlice.ts
// // import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // import { getDistributorDetailsById } from '../apiServices/allApi'; // Your existing API

// // interface ProfileState {
// //   profile: any;
// //   loading: boolean;
// //   updating: boolean;
// //   error: string | null;
// //   success: boolean;
// // }

// // const initialState: ProfileState = {
// //   profile: null,
// //   loading: false,
// //   updating: false,
// //   error: null,
// //   success: false,
// // };

// // // Use your existing API function for fetching
// // export const fetchDistributorProfile = createAsyncThunk(
// //   'profile/fetchDistributorProfile',
// //   async (userID: string | number, { rejectWithValue }) => {
// //     try {
// //       const response = await getDistributorDetailsById(userID);
// //       console.log('Fetched distributor profile:', response.data);
// //       return response.data;
// //     } catch (error: any) {
// //       console.error('Error fetching distributor profile:', error);
// //       return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
// //     }
// //   }
// // );

// // // CREATE UPDATE FUNCTION USING SAME API CLIENT PATTERN
// // export const updateDistributorProfile = createAsyncThunk(
// //   'profile/updateDistributorProfile',
// //   async ({ id, data }: { id: string | number; data: any }, { rejectWithValue }) => {
// //     try {
// //       console.log('Updating distributor profile with data:', data);
// //       console.log('Update URL will be:', `/milkman/milkmen/${id}/`);

// //       // Import your existing API client - USE THE SAME PATTERN AS getDistributorDetailsById
// //       const { default: apiClient } = await import('../apiServices/allApi'); // Adjust path as needed

// //       // Use the same apiClient that works for fetching
// //       const response = await apiClient.put(`/milkman/milkmen/${id}/`, data);

// //       console.log('Updated distributor profile successfully:', response.data);
// //       return response.data;
// //     } catch (error: any) {
// //       console.error('Full error object:', error);
// //       console.error('Error message:', error.message);
// //       console.error('Error response:', error.response?.data);
// //       console.error('Error status:', error.response?.status);
// //       console.error('Error request:', error.request);

// //       // Better error handling for network issues
// //       if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
// //         return rejectWithValue('Network error: Please check your internet connection and try again');
// //       }

// //       if (!error.response) {
// //         return rejectWithValue('Network error: Unable to connect to server');
// //       }

// //       return rejectWithValue(
// //         error.response?.data?.message ||
// //         error.response?.data?.error ||
// //         error.message ||
// //         'Failed to update profile'
// //       );
// //     }
// //   }
// // );

// // const profileSlice = createSlice({
// //   name: 'profile',
// //   initialState,
// //   reducers: {
// //     clearError: (state) => {
// //       state.error = null;
// //     },
// //     clearSuccess: (state) => {
// //       state.success = false;
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       // Fetch profile cases
// //       .addCase(fetchDistributorProfile.pending, (state) => {
// //         state.loading = true;
// //         state.error = null;
// //       })
// //       .addCase(fetchDistributorProfile.fulfilled, (state, action) => {
// //         state.loading = false;
// //         state.profile = action.payload;
// //       })
// //       .addCase(fetchDistributorProfile.rejected, (state, action) => {
// //         state.loading = false;
// //         state.error = action.payload as string;
// //       })
// //       // Update profile cases
// //       .addCase(updateDistributorProfile.pending, (state) => {
// //         state.updating = true;
// //         state.error = null;
// //         state.success = false;
// //       })
// //       .addCase(updateDistributorProfile.fulfilled, (state, action) => {
// //         state.updating = false;
// //         state.success = true;
// //         // Update local profile data
// //         if (action.payload) {
// //           state.profile = action.payload;
// //         }
// //       })
// //       .addCase(updateDistributorProfile.rejected, (state, action) => {
// //         state.updating = false;
// //         state.error = action.payload as string;
// //       });
// //   },
// // });

// // export const { clearError, clearSuccess } = profileSlice.actions;
// // export default profileSlice.reducer;
// // store/slices/profileSlice.ts
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { getDistributorDetailsById } from '../apiServices/allApi';

// interface ProfileState {
//   profile: any;
//   loading: boolean;
//   updating: boolean;
//   error: string | null;
//   success: boolean;
//   lastUpdated: number | null;
// }

// const initialState: ProfileState = {
//   profile: null,
//   loading: false,
//   updating: false,
//   error: null,
//   success: false,
//   lastUpdated: null,
// };

// // Fetch distributor profile
// export const fetchDistributorProfile = createAsyncThunk(
//   'profile/fetchDistributorProfile',
//   async (userID: string | number, { rejectWithValue }) => {
//     try {
//       if (!userID) {
//         throw new Error('User ID is required');
//       }

//       const response = await getDistributorDetailsById(userID);

//       if (!response?.data) {
//         throw new Error('No profile data received');
//       }

//       return response.data;
//     } catch (error: any) {
//       const errorMessage = error?.response?.data?.message ||
//                           error?.message ||
//                           'Failed to fetch profile data';

//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// // Update distributor profile
// export const updateDistributorProfile = createAsyncThunk(
//   'profile/updateDistributorProfile',
//   async ({ id, data }: { id: string | number; data: any }, { rejectWithValue }) => {
//     try {
//       if (!id) {
//         throw new Error('User ID is required');
//       }

//       if (!data || Object.keys(data).length === 0) {
//         throw new Error('Profile data is required');
//       }

//       // Clean data - remove empty strings, null, and undefined values
//       const cleanData = Object.keys(data).reduce((acc: any, key) => {
//         const value = data[key];
//         if (value !== undefined && value !== null && value !== '') {
//           acc[key] = value;
//         }
//         return acc;
//       }, {});

//       // If no data to update after cleaning
//       if (Object.keys(cleanData).length === 0) {
//         throw new Error('No valid data to update');
//       }

//       // Import your existing API client
//       const { default: apiClient } = await import('../apiServices/allApi');

//       // Use the same apiClient that works for fetching
//       const response = await apiClient.put(`/milkman/milkmen/${id}/`, cleanData);

//       if (!response?.data) {
//         throw new Error('No response data received');
//       }

//       return response.data;
//     } catch (error: any) {
//       // Enhanced error handling
//       let errorMessage = 'Failed to update profile';

//       if (error?.code === 'NETWORK_ERROR' || error?.message === 'Network Error') {
//         errorMessage = 'Network error: Please check your internet connection';
//       } else if (error?.response) {
//         // Server responded with error status
//         const status = error.response.status;
//         const data = error.response.data;

//         switch (status) {
//           case 400:
//             errorMessage = data?.message || 'Invalid profile data provided';
//             break;
//           case 401:
//             errorMessage = 'Authentication failed. Please login again';
//             break;
//           case 403:
//             errorMessage = 'You do not have permission to update this profile';
//             break;
//           case 404:
//             errorMessage = 'Profile not found';
//             break;
//           case 422:
//             errorMessage = data?.message || 'Validation failed';
//             break;
//           case 500:
//             errorMessage = 'Server error. Please try again later';
//             break;
//           default:
//             errorMessage = data?.message || `Server error (${status})`;
//         }
//       } else if (error?.request) {
//         // Request was made but no response received
//         errorMessage = 'No response from server. Please check your connection';
//       } else if (error?.message) {
//         // Other error (validation, etc.)
//         errorMessage = error.message;
//       }

//       return rejectWithValue(errorMessage);
//     }
//   }
// );

// const profileSlice = createSlice({
//   name: 'profile',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//     clearSuccess: (state) => {
//       state.success = false;
//     },
//     resetProfileState: (state) => {
//       state.profile = null;
//       state.loading = false;
//       state.updating = false;
//       state.error = null;
//       state.success = false;
//       state.lastUpdated = null;
//     },
//     updateLocalProfile: (state, action) => {
//       if (state.profile) {
//         state.profile = { ...state.profile, ...action.payload };
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch profile cases
//       .addCase(fetchDistributorProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchDistributorProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.profile = action.payload;
//         state.error = null;
//         state.lastUpdated = Date.now();
//       })
//       .addCase(fetchDistributorProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//         state.profile = null;
//       })
//       // Update profile cases
//       .addCase(updateDistributorProfile.pending, (state) => {
//         state.updating = true;
//         state.error = null;
//         state.success = false;
//       })
//       .addCase(updateDistributorProfile.fulfilled, (state, action) => {
//         state.updating = false;
//         state.success = true;
//         state.error = null;
//         state.lastUpdated = Date.now();

//         // Update local profile with the response data
//         const updatedProfile = action.payload.data || action.payload;
//         if (updatedProfile && typeof updatedProfile === 'object') {
//           state.profile = { ...state.profile, ...updatedProfile };
//         }
//       })
//       .addCase(updateDistributorProfile.rejected, (state, action) => {
//         state.updating = false;
//         state.success = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// // Export actions
// export const {
//   clearError,
//   clearSuccess,
//   resetProfileState,
//   updateLocalProfile
// } = profileSlice.actions;

// // Selectors for easier state access
// export const selectProfile = (state: { profile: ProfileState }) => state.profile.profile;
// export const selectProfileLoading = (state: { profile: ProfileState }) => state.profile.loading;
// export const selectProfileUpdating = (state: { profile: ProfileState }) => state.profile.updating;
// export const selectProfileError = (state: { profile: ProfileState }) => state.profile.error;
// export const selectProfileSuccess = (state: { profile: ProfileState }) => state.profile.success;

// // Export reducer
// export default profileSlice.reducer;


import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getDistributorDetailsById } from '../apiServices/allApi';

interface ProfileData {
  full_name?: string;
  flat_house?: string;
  society_area?: string;
  village?: string;
  tal?: string;
  dist?: string;
  state?: string;
  society_name?: string;
  pincode?: string;
  [key: string]: any;
}

interface ProfileState {
  profile: ProfileData | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
  success: boolean;
  lastUpdated: number | null;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
  updating: false,
  error: null,
  success: false,
  lastUpdated: null,
};

export const fetchDistributorProfile = createAsyncThunk<
  ProfileData,
  string | number,
  { rejectValue: string }
>(
  'profile/fetchDistributorProfile',
  async (userID, { rejectWithValue }) => {
    if (!userID) {return rejectWithValue('User ID is required');}
    try {
      const response = await getDistributorDetailsById(userID);
      if (!response?.data) {throw new Error('No profile data received');}
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to fetch profile'
      );
    }
  }
);

export const updateDistributorProfile = createAsyncThunk<
  ProfileData,
  { id: string | number; data: ProfileData },
  { rejectValue: string }
>(
  'profile/updateDistributorProfile',
  async ({ id, data }, { rejectWithValue }) => {
    if (!id) {return rejectWithValue('User ID is required');}
    try {
      const cleanData: ProfileData = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanData[key] = value;
        }
      });
      if (Object.keys(cleanData).length === 0) {throw new Error('No valid data to update');}

      const { default: apiClient } = await import('../apiServices/allApi');
      const response = await apiClient.put(`/milkman/milkmen/${id}/`, cleanData);
      if (!response?.data) {throw new Error('No response data received');}
      return response.data;
    } catch (error: any) {
      let message = 'Failed to update profile';
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
            message = 'Profile not found';
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

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.success = false;
    },
    resetProfileState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDistributorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDistributorProfile.fulfilled, (state, action: PayloadAction<ProfileData>) => {
        state.loading = false;
        state.error = null;
        state.profile = action.payload;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchDistributorProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.profile = null;
      })
      .addCase(updateDistributorProfile.pending, (state) => {
        state.updating = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateDistributorProfile.fulfilled, (state, action: PayloadAction<ProfileData>) => {
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

export const { clearError, clearSuccess, resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
