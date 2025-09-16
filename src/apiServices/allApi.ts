
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

// /* ========= CONSUMER CALENDAR APIs (Authenticated) ========= */


// // ✅ Get Consumer Delivery Calendar - GET
// export const getConsumerCalendar = (payload: {
//   customer_id: number;
//   month: string;
// }) =>
//   apiClient.get(`/consumer-calendar/vendor-calendar/?customer_id=${payload.customer_id}&month=${payload.month}`);

// // ✅ Mark Delivery Status - POST
// export const markDeliveryStatus = (payload: {
//   customer_id: number;
//   date: string;
//   status: 'delivered' | 'missed' | 'not_requested' | 'vendor_unavailable' | 'customer_paused';
//   remarks?: string;
// }) => apiClient.post('/consumer-calendar/vendor-calendar/', payload);

// // ✅ Apply for Leave - POST
// export const applyForLeave = (payload: {
//   customer_id: number;
//   date: string;
//   remarks: string;
// }) => apiClient.post('/consumer-calendar/vendor-calendar/apply-for-leave/', payload);


// // ✅ Request Extra Milk - POST
// export const requestExtraMilk = (payload: {
//   customer_id: number;
//   date: string;
//   quantity: number;
//   remarks?: string;
// }) => apiClient.post('/consumer-calendar/vendor-calendar/extra-milk-request/', payload);


// // ✅ Report Vendor/Milkman Unavailability - POST
// export const reportVendorUnavailable = (payload: {
//   customer_id: number;
//   date: string;
//   remarks: string;
// }) => apiClient.post('/consumer-calendar/vendor-calendar/vendor-unavailable/', payload);


// /* ========= VENDOR LISTS (Authenticated) ========= */

// // ✅ Get list of all vendors (authenticated)
// export const getAllVendors = () =>
//   apiClient.get('/registration/vendor-business-registration/');


// //DistribnutorCalendar:
// export const getDistributorAssignedConsumers = () =>
//   apiClient.get('/consumer-calendar/distributor-calendar/list-customers/');

// // 2. Mark delivery as successful (POST)
// export const markConsumerDelivery = (customerId: number, date: string) =>
//   apiClient.post('/consumer-calendar/distributor-calendar/mark-delivery/', {
//     customer_id: customerId,
//     date,
//   });

// // 3. (Optional) Distributor leave requests (GET)
// export const getDistributorLeaveRequests = () =>
//   apiClient.get('/consumer-calendar/distributor-calendar/list-leave-requests/');

// // export const getDistributorLeaveRequests = async () => {
// //   try {
// //     // Make sure the endpoint is correct and matches your Django backend
// //     const response = await apiClient.get('/distributor/leave-requests/');
// //     return response.data;
// //   } catch (error) {
// //     console.error('Error fetching distributor leave requests:', error);
// //     throw error;
// //   }
// // };

// //Distriutor Leave req
// export const requestDistributorLeave = (payload: {
//   milkman_id?: number; // Optional - for requesting on behalf of another milkman
//   start_date: string;  // Required - Start date of leave (YYYY-MM-DD format)
//   end_date: string;    // Required - End date of leave (YYYY-MM-DD format)
//   remarks: string;     // Required - Reason for leave
// }) => apiClient.post('/consumer-calendar/distributor-calendar/request-leave/', payload);

// // ✅ Export both clients for specific use cases





// ///New apis:
// export const getDistributorCalendar = (payload: {
//   milkman_id?: number;
//   month: string;
// }) =>
//   apiClient.get(`/consumer-calendar/distributor-calendar/check-leave-allocation/?${payload.milkman_id ? `milkman_id=${payload.milkman_id}&` : ''}month=${payload.month}`);

// //apply for leave
// export const applyForDistributorLeave = (payload: {
//   milkman_id?: number;
//   date: string;
//   remarks: string;
// }) =>
//   apiClient.post('/consumer-calendar/distributor-calendar/request-leave/', payload);

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

// ✅ Vendor registration - PUBLIC
export const registerVendorAPI = (payload: any) =>
  publicApiClient.post('/vendor-login/register_vendor/', payload);

// ✅ Customer registration - PUBLIC
export const addCustomerRegistration = (payload: any) =>
  publicApiClient.post('/customer/customers/', payload);

// ✅ Distributor/Milkman registration - PUBLIC
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

// ✅ Get vendor details by ID - AUTHENTICATED
export const getVendorDetailsById = (id: string | number) =>
  apiClient.get(`/registration/vendor-business-registration/${id}/`);

// ✅ Get consumer details by ID - AUTHENTICATED
export const getConsumerDetailsById = (id: string | number) =>
  apiClient.get(`/customer/customers/${id}/`);

// ✅ Get distributor details by ID - AUTHENTICATED
export const getDistributorDetailsById = (id: string | number) =>
  apiClient.get(`/milkman/milkmen/${id}/`);

/* ========= JOIN REQUESTS APIs (Authenticated) ========= */

// ✅ Create a join request (customer or distributor requests to join a vendor) - AUTHENTICATED
export const createRequest = (payload: {
  user_id: number;
  user_type: string; // 'customer' or 'milkman'
  vendor: number;
}) => apiClient.post('/vendor/join-requests/', payload);

// ✅ Get all pending join requests for a vendor - AUTHENTICATED
export const getVendorPendingRequests = (vendorId: string | number) =>
  apiClient.get('/vendor/join-requests/requests-for-vendor/', {
    params: { vendor_id: vendorId },
  });

// ✅ Vendor approves a join request - AUTHENTICATED
export const acceptRequest = (requestId: string | number) =>
  apiClient.post(`/vendor/join-requests/${requestId}/accept/`);

// ✅ Vendor rejects a join request - AUTHENTICATED
export const rejectRequest = (requestId: string | number) =>
  apiClient.post(`/vendor/join-requests/${requestId}/reject/`);

// ✅ Get all vendor requests (no status filter) - AUTHENTICATED
export const getAllVendorRequests = (vendorId: string | number) =>
  apiClient.get('/vendor/join-requests/', {
    params: { vendor_id: vendorId },
  });

// ✅ Get accepted customers for a vendor - AUTHENTICATED
export const getAcceptedCustomers = (vendorId: string | number) =>
  apiClient.get('/vendor/join-requests/accepted-customers/', {
    params: { vendor_id: vendorId },
  });

// ✅ Get accepted milkmen (distributors) for a vendor - AUTHENTICATED
export const getAcceptedMilkmen = (vendorId: string | number) =>
  apiClient.get('/vendor/join-requests/accepted-milkmen/', {
    params: { vendor_id: vendorId },
  });

// ✅ List join requests for vendor - AUTHENTICATED
export const listJoinRequestsForVendor = (vendorId: string | number) =>
  apiClient.get('/vendor/join-requests/requests-for-vendor/', {
    params: { vendor_id: vendorId },
  });

/* ========= CONSUMER CALENDAR APIs (Authenticated) ========= */

// ✅ Get Consumer Delivery Calendar - AUTHENTICATED
// GET /consumer-calendar/vendor-calendar/?customer_id={id}&month={YYYY-MM}
export const getConsumerCalendar = (payload: {
  customer_id: number;
  month: string; // Format: YYYY-MM
}) =>
  apiClient.get(`/consumer-calendar/vendor-calendar/?customer_id=${payload.customer_id}&month=${payload.month}`);

// ✅ Mark Delivery Status by Vendor - AUTHENTICATED
// POST /consumer-calendar/vendor-calendar/
export const markDeliveryStatus = (payload: {
  customer_id: number;
  date: string; // Format: YYYY-MM-DD
  status: 'delivered' | 'missed' | 'not_requested' | 'vendor_unavailable' | 'customer_paused';
  remarks?: string;
}) => apiClient.post('/consumer-calendar/vendor-calendar/', payload);

// ✅ Consumer Apply for Leave - AUTHENTICATED
// POST /consumer-calendar/vendor-calendar/apply-for-leave/
export const applyForLeave = (payload: {
  customer_id: number;
  date: string; // Format: YYYY-MM-DD
  remarks: string;
}) => apiClient.post('/consumer-calendar/vendor-calendar/apply-for-leave/', payload);

// ✅ Consumer Request Extra Milk - AUTHENTICATED
// POST /consumer-calendar/vendor-calendar/extra-milk-request/
export const requestExtraMilk = (payload: {
  customer_id: number;
  date: string; // Format: YYYY-MM-DD
  quantity: number;
  remarks?: string;
}) => apiClient.post('/consumer-calendar/vendor-calendar/extra-milk-request/', payload);

// ✅ Report Vendor/Milkman Unavailability - AUTHENTICATED
// POST /consumer-calendar/vendor-calendar/vendor-unavailable/
export const reportVendorUnavailable = (payload: {
  customer_id: number;
  date: string; // Format: YYYY-MM-DD
  remarks: string;
}) => apiClient.post('/consumer-calendar/vendor-calendar/vendor-unavailable/', payload);

/* ========= DISTRIBUTOR CALENDAR APIs (Authenticated) ========= */

// ✅ Get Distributor Assigned Consumers - AUTHENTICATED
// GET /consumer-calendar/distributor-calendar/list-customers/
// export const getDistributorAssignedConsumers = () =>
//   apiClient.get('/consumer-calendar/distributor-calendar/list-customers/');

// ✅ Mark Consumer Delivery as Successful by Distributor - AUTHENTICATED
// POST /consumer-calendar/distributor-calendar/mark-delivery/
export const markConsumerDelivery = (customerId: number, date: string) =>
  apiClient.post('/consumer-calendar/distributor-calendar/mark-delivery/', {
    customer_id: customerId,
    date, // Format: YYYY-MM-DD
  });

// ✅ Get Distributor Leave Requests List - AUTHENTICATED
// GET /consumer-calendar/distributor-calendar/list-leave-requests/
export const getDistributorLeaveRequests = () =>
  apiClient.get('/consumer-calendar/distributor-calendar/list-leave-requests/');

// ✅ Get Distributor Calendar Data (Leave Allocation) - AUTHENTICATED

export const getDistributorCalendar = (payload: {
  milkman_id?: number; // Optional - for specific milkman
  month: string; // Required - Format: YYYY-MM
}) => {
  const params = new URLSearchParams();
  params.append('month', payload.month);

  if (payload.milkman_id) {
    params.append('milkman_id', payload.milkman_id.toString());
  }

  return apiClient.get(`/consumer-calendar/distributor-calendar/check-leave-allocation/?${params.toString()}`);
};


export const applyForDistributorLeave = (payload: {
  milkman_id?: number; // Optional - for requesting on behalf of another milkman
  date: string; // Required - Single date format: YYYY-MM-DD
  remarks: string; // Required - Reason for leave
}) => apiClient.post('/consumer-calendar/distributor-calendar/request-leave/', payload);

// ✅ Get Leave Request Details for Specific Date - AUTHENTICATED

export const getDistributorLeaveRequestDetails = (payload: {
  milkman_id: number; // Required
  date: string; // Required - Format: YYYY-MM-DD
}) =>
  apiClient.get(`/consumer-calendar/distributor-calendar/leave-request-date/?milkman_id=${payload.milkman_id}&date=${payload.date}`);

// ✅ DEPRECATED - Old multi-day leave request (keeping for backward compatibility)
export const requestDistributorLeave = (payload: {
  milkman_id?: number;
  start_date: string;
  end_date: string;
  remarks: string;
}) => apiClient.post('/consumer-calendar/distributor-calendar/request-leave/', payload);

/* ========= VENDOR LISTS (Authenticated) ========= */

// ✅ Get list of all vendors - AUTHENTICATED
export const getAllVendors = () =>
  apiClient.get('/registration/vendor-business-registration/');

/* ========= API CLIENT EXPORTS ========= */

// ✅ Export both clients for specific use cases
export { publicApiClient, apiClient };
export default apiClient;

// ✅ Assign Customer to Milkman - AUTHENTICATED
export const assignConsumerToDistributor = (data: {
  customer_id: number;
  milkman_id: number;
}) => apiClient.post('/consumer-calendar/distributor-calendar/assign-customer/', data);

// ✅ Get Distributor Assigned Consumers - AUTHENTICATED
export const getDistributorAssignedConsumers = (milkmanId?: number) => {
  const params = milkmanId ? `?milkman_id=${milkmanId}` : '';
  return apiClient.get(`/consumer-calendar/distributor-calendar/list-customers/${params}`);
};