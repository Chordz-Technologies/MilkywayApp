// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { store } from '../store';
// import { logout, refreshToken } from '../store/authSlice';

// const BASE_URL = 'https://milkywayapi.beatsacademy.in';

// // ✅ PUBLIC API CLIENT (No authentication required)
// const publicApiClient = axios.create({
//   baseURL: BASE_URL,
//   timeout: 10000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // ✅ AUTHENTICATED API CLIENT (Requires authentication)
// const apiClient = axios.create({
//   baseURL: BASE_URL,
//   timeout: 10000,
// });

// // ✅ Request interceptor → attach JWT token ONLY for authenticated client
// apiClient.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = await AsyncStorage.getItem('access_token');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//         console.log('🔑 Token attached to request');
//       } else {
//         console.log('⚠️ No token found for authenticated request');
//       }
//     } catch (error) {
//       console.error('❌ Error getting token:', error);
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ Response interceptor → auto refresh token on 401
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         console.log('🔄 Attempting token refresh...');

//         // Dispatch refreshToken thunk from Redux
//         await store.dispatch(refreshToken());

//         // Get updated token from storage
//         const newToken = await AsyncStorage.getItem('access_token');
//         if (newToken) {
//           originalRequest.headers.Authorization = `Bearer ${newToken}`;
//           console.log('✅ Token refreshed, retrying request');
//           return apiClient(originalRequest); // Retry the request
//         }
//       } catch (refreshError) {
//         console.error('❌ Token refresh failed:', refreshError);
//         store.dispatch(logout());
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// /* ========= AUTHENTICATION APIS (Public - No auth required) ========= */

// // ✅ Role-based login endpoint - PUBLIC
// export const loginVendor = (payload: { contact: string; password: string }) =>
//   publicApiClient.post('/vendor-login/vendor_login/', payload);

// // ✅ Refresh token API - PUBLIC
// export const refreshTokenAPI = (data: { refresh: string }) =>
//   publicApiClient.post('/token/refresh/', data);

// // ✅ Backend logout API - AUTHENTICATED
// export const logoutUser = () =>
//   apiClient.post('/vendor-login/logout/');

// /* ========= REGISTRATION APIs (Public - No auth required) ========= */

// // ✅ FIXED - Using publicApiClient for registration
// export const registerVendorAPI = (payload: any) =>
//   publicApiClient.post('/vendor-login/register_vendor/', payload);

// export const addCustomerRegistration = (payload: any) =>
//   publicApiClient.post('/customer/customers/', payload);

// export const addDistributorRegistration = (payload: any) =>
//   publicApiClient.post('/milkman/milkmen/', payload);

// // ✅ OTP APIs - PUBLIC
// export const requestOtp = (phone_number: string) =>
//   publicApiClient.post('/vendor-login/request_otp/', { phone_number });

// export const verifyOtp = (payload: { mobile: string; otp: string }) =>
//   publicApiClient.post('/vendor-login/verify_otp/', payload);

// export const changePassword = (payload: { mobile: string; password: string }) =>
//   publicApiClient.post('/vendor-login/change_password/', payload);

// /* ========= PROFILE APIs (Authenticated) ========= */

// export const getVendorDetailsById = (id: string | number) =>
//   apiClient.get(`/registration/vendor-business-registration/${id}/`);

// export const getConsumerDetailsById = (id: string | number) =>
//   apiClient.get(`/customer/customers/${id}/`);

// export const getDistributorDetailsById = (id: string | number) =>
//   apiClient.get(`/milkman/milkmen/${id}/`);

// /* ========= JOIN REQUESTS APIs (Authenticated) ========= */

// // ✅ Create a join request (customer or distributor requests to join a vendor)
// export const createRequest = (payload: {
//   user_id: number;
//   user_type: string; // 'customer' or 'milkman'
//   vendor: number;
// }) => apiClient.post('/vendor/join-requests/', payload);

// // ✅ Get all pending join requests for a vendor
// export const getVendorPendingRequests = (vendorId: string | number) =>
//   apiClient.get('/vendor/join-requests/requests-for-vendor/', {
//     params: { vendor_id: vendorId },
//   });

// // ✅ Vendor approves a join request
// export const acceptRequest = (requestId: string | number) =>
//   apiClient.post(`/vendor/join-requests/${requestId}/accept/`);

// // ✅ Vendor rejects a join request
// export const rejectRequest = (requestId: string | number) =>
//   apiClient.post(`/vendor/join-requests/${requestId}/reject/`);

// // ✅ Get all vendor requests (no status filter)
// export const getAllVendorRequests = (vendorId: string | number) =>
//   apiClient.get('/vendor/join-requests/', {
//     params: { vendor_id: vendorId },
//   });

// // ✅ Get accepted customers for a vendor
// export const getAcceptedCustomers = (vendorId: string | number) =>
//   apiClient.get('/vendor/join-requests/accepted-customers/', {
//     params: { vendor_id: vendorId },
//   });

// // ✅ Get accepted milkmen (distributors) for a vendor
// export const getAcceptedMilkmen = (vendorId: string | number) =>
//   apiClient.get('/vendor/join-requests/accepted-milkmen/', {
//     params: { vendor_id: vendorId },
//   });

// // ✅ List join requests for vendor
// export const listJoinRequestsForVendor = (vendorId: string | number) =>
//   apiClient.get('/vendor/join-requests/requests-for-vendor/', {
//     params: { vendor_id: vendorId },
//   });

// /* ========= VENDOR LISTS (Authenticated) ========= */

// // ✅ Get list of all vendors (authenticated)
// export const getAllVendors = () =>
//   apiClient.get('/registration/vendor-business-registration/');

// // ✅ Export both clients for specific use cases
// export { publicApiClient, apiClient };
// export default apiClient;
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store';
import { logout, refreshToken } from '../store/authSlice';

const BASE_URL = 'https://milkywayapi.beatsacademy.in';

// ✅ PUBLIC API CLIENT (No authentication required)
const publicApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ AUTHENTICATED API CLIENT (Requires authentication)
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// ✅ Request interceptor → attach JWT token ONLY for authenticated client
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔑 Token attached to request');
      } else {
        console.log('⚠️ No token found for authenticated request');
      }
    } catch (error) {
      console.error('❌ Error getting token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor → auto refresh token on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('🔄 Attempting token refresh...');

        // Dispatch refreshToken thunk from Redux
        await store.dispatch(refreshToken());

        // Get updated token from storage
        const newToken = await AsyncStorage.getItem('access_token');
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          console.log('✅ Token refreshed, retrying request');
          return apiClient(originalRequest); // Retry the request
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/* ========= AUTHENTICATION APIS (Public - No auth required) ========= */

// ✅ Role-based login endpoint - PUBLIC
export const loginVendor = (payload: { contact: string; password: string }) =>
  publicApiClient.post('/vendor-login/vendor_login/', payload);

// ✅ Refresh token API - PUBLIC
export const refreshTokenAPI = (data: { refresh: string }) =>
  publicApiClient.post('/token/refresh/', data);

// ✅ Backend logout API - AUTHENTICATED
export const logoutUser = () =>
  apiClient.post('/vendor-login/logout/');

/* ========= REGISTRATION APIs (Public - No auth required) ========= */

// ✅ FIXED - Using publicApiClient for registration
export const registerVendorAPI = (payload: any) =>
  publicApiClient.post('/vendor-login/register_vendor/', payload);

export const addCustomerRegistration = (payload: any) =>
  publicApiClient.post('/customer/customers/', payload);

export const addDistributorRegistration = (payload: any) =>
  publicApiClient.post('/milkman/milkmen/', payload);

// ✅ OTP APIs - PUBLIC
export const requestOtp = (phone_number: string) =>
  publicApiClient.post('/vendor-login/request_otp/', { phone_number });

export const verifyOtp = (payload: { mobile: string; otp: string }) =>
  publicApiClient.post('/vendor-login/verify_otp/', payload);

export const changePassword = (payload: { mobile: string; password: string }) =>
  publicApiClient.post('/vendor-login/change_password/', payload);

/* ========= PROFILE APIs (Authenticated) ========= */

export const getVendorDetailsById = (id: string | number) =>
  apiClient.get(`/registration/vendor-business-registration/${id}/`);

export const getConsumerDetailsById = (id: string | number) =>
  apiClient.get(`/customer/customers/${id}/`);

export const getDistributorDetailsById = (id: string | number) =>
  apiClient.get(`/milkman/milkmen/${id}/`);

/* ========= JOIN REQUESTS APIs (Authenticated) ========= */

// ✅ Create a join request (customer or distributor requests to join a vendor)
export const createRequest = (payload: {
  user_id: number;
  user_type: string; // 'customer' or 'milkman'
  vendor: number;
}) => apiClient.post('/vendor/join-requests/', payload);

// ✅ Get all pending join requests for a vendor
export const getVendorPendingRequests = (vendorId: string | number) =>
  apiClient.get('/vendor/join-requests/requests-for-vendor/', {
    params: { vendor_id: vendorId },
  });

// ✅ Vendor approves a join request
export const acceptRequest = (requestId: string | number) =>
  apiClient.post(`/vendor/join-requests/${requestId}/accept/`);

// ✅ Vendor rejects a join request
export const rejectRequest = (requestId: string | number) =>
  apiClient.post(`/vendor/join-requests/${requestId}/reject/`);

// ✅ Get all vendor requests (no status filter)
export const getAllVendorRequests = (vendorId: string | number) =>
  apiClient.get('/vendor/join-requests/', {
    params: { vendor_id: vendorId },
  });

// ✅ Get accepted customers for a vendor
export const getAcceptedCustomers = (vendorId: string | number) =>
  apiClient.get('/vendor/join-requests/accepted-customers/', {
    params: { vendor_id: vendorId },
  });

// ✅ Get accepted milkmen (distributors) for a vendor
export const getAcceptedMilkmen = (vendorId: string | number) =>
  apiClient.get('/vendor/join-requests/accepted-milkmen/', {
    params: { vendor_id: vendorId },
  });

// ✅ List join requests for vendor
export const listJoinRequestsForVendor = (vendorId: string | number) =>
  apiClient.get('/vendor/join-requests/requests-for-vendor/', {
    params: { vendor_id: vendorId },
  });

/* ========= CONSUMER CALENDAR APIs (Authenticated) ========= */

// ✅ Get Consumer Delivery Calendar - GET
export const getConsumerCalendar = (payload: {
  customer_id: number;
  month: string;
}) =>
  apiClient.get(`/consumer-calendar/vendor-calendar/?customer_id=${payload.customer_id}&month=${payload.month}`);

// ✅ Mark Delivery Status - POST
export const markDeliveryStatus = (payload: {
  customer_id: number;
  date: string;
  status: 'delivered' | 'missed' | 'not_requested' | 'vendor_unavailable' | 'customer_paused';
  remarks?: string;
}) => apiClient.post('/consumer-calendar/vendor-calendar/', payload);

// ✅ Apply for Leave - POST
export const applyForLeave = (payload: {
  customer_id: number;
  date: string;
  remarks: string;
}) => apiClient.post('/consumer-calendar/vendor-calendar/apply-for-leave/', payload);


// ✅ Request Extra Milk - POST
export const requestExtraMilk = (payload: {
  customer_id: number;
  date: string;
  quantity: number;
  remarks?: string;
}) => apiClient.post('/consumer-calendar/vendor-calendar/extra-milk-request/', payload);


// ✅ Report Vendor/Milkman Unavailability - POST
export const reportVendorUnavailable = (payload: {
  customer_id: number;
  date: string;
  remarks: string;
}) => apiClient.post('/consumer-calendar/vendor-calendar/vendor-unavailable/', payload);


/* ========= VENDOR LISTS (Authenticated) ========= */

// ✅ Get list of all vendors (authenticated)
export const getAllVendors = () =>
  apiClient.get('/registration/vendor-business-registration/');

// ✅ Export both clients for specific use cases
export { publicApiClient, apiClient };
export default apiClient;
