import axios from 'axios';

const BASE_URL = 'https://milkywayapi.beatsacademy.in';

// Vendor Login using mobile number & password
export const loginVendor = (payload: { contact: string; password: string }) =>
  axios.post(`${BASE_URL}/vendor-login/login/vendor_login/`, payload);

// Request OTP for Forgot Password
export const requestOtp = (phone_number: string) =>
  axios.post(`${BASE_URL}/vendor-login/login/request_otp/`, { phone_number });

// Verify OTP
export const verifyOtp = (payload: { mobile: string; otp: string }) =>
  axios.post(`${BASE_URL}/vendor-login/login/verify_otp/`, payload);

// Change Password
export const changePassword = (payload: { mobile: string; password: string }) =>
  axios.post(`${BASE_URL}/vendor-login/login/change_password/`, payload);

// Vendor API
export const addVendorRegistration = (payload: any) =>
  axios.post(`${BASE_URL}/registration/vendor-business-registration/`, payload);

export const getVendorDetailsById = (id: any) =>
  axios.get(`${BASE_URL}/registration/vendor-business-registration/${id}/`);

// Consumer API
export const addCustomerRegistration = (payload: any) =>
  axios.post(`${BASE_URL}/customer/customers/`, payload);

export const getConsumerDetailsById = (id: any) =>
  axios.get(`${BASE_URL}/customer/customers/${id}/`);

// Distributor API
export const addDistributorRegistration = (payload: any) =>
  axios.post(`${BASE_URL}/milkman/milkmen/`, payload);

//AllMilkmansList
export const allCustomerList = (payload: any) =>
  axios.get(`${BASE_URL}/vendor/join-requests/accepted-customers/`, payload);

// export const allCustomers = (payload: any) =>
//   axios.get(`${BASE_URL}/customer/allcustomers/`, payload);

// export const allMikmans = (payload: any) =>
//   axios.get(`${BASE_URL}/milkman/allmilkmans/`, payload);

//newly added

// export const fetchVendorProfile = (vendorId: string, token: string) =>
//   axios.get(`${BASE_URL}/vendor/vendordetails/${vendorId}/`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });


// GET: Get all vendors
export const getAllVendors = () =>
  axios.get(`${BASE_URL}/registration/vendor-business-registration/`);


/* ---------- Join-request workflow ---------- */

// Customer / distributor → vendor  (POST)
export const createRequest = (payload: {
  user_id: number;
  user_type: string;
  vendor: number;
}) =>
  axios.post(`${BASE_URL}/vendor/join-requests/`, {
    user_id: payload.user_id,
    user_type: payload.user_type,
    vendor: payload.vendor,
  });

// Requests sent by a **customer**
// export const getCustomerRequests = (userId: string) =>
//   axios.get(`${BASE_URL}/vendor/join-requests/`, {
//     params: {
//       user_id: userId,
//       user_type: 'customer',
//     },
//   });

// Requests sent by a **distributor**
// export const getDistributorRequests = (userId: string) =>
//   axios.get(`${BASE_URL}/vendor/join-requests/`, {
//     params: {
//       user_id: userId,
//       user_type: 'milkman',
//     },
//   });

// Requests a **vendor** must review (default filter = pending)
export const getVendorPendingRequests = (vendorId: string, status = 'pending') =>
  axios.get(`${BASE_URL}/vendor/join-requests/`, {
    params: {
      vendor_id: vendorId,
      status,
    },
  });

// Vendor approves / rejects
export const updateRequestStatus = (
  requestId: string,
  // payload: { status: 'accepted' | 'rejected' },
) =>
  axios.post(`${BASE_URL}/vendor/join-requests/${requestId}/accept/`);

