// import axios from 'axios';

// const BASE_URL = 'https://milkywayapi.beatsacademy.in';

// // Vendor Login using mobile number & password
// export const loginVendor = (payload: { contact: string; password: string }) =>
//   axios.post(`${BASE_URL}/vendor-login/login/vendor_login/`, payload);

// // Request OTP for Forgot Password
// export const requestOtp = (phone_number: string) =>
//   axios.post(`${BASE_URL}/vendor-login/login/request_otp/`, { phone_number });

// // Verify OTP
// export const verifyOtp = (payload: { mobile: string; otp: string }) =>
//   axios.post(`${BASE_URL}/vendor-login/login/verify_otp/`, payload);

// // Change Password
// export const changePassword = (payload: { mobile: string; password: string }) =>
//   axios.post(`${BASE_URL}/vendor-login/login/change_password/`, payload);

// // Vendor API
// export const addVendorRegistration = (payload: any) =>
//   axios.post(`${BASE_URL}/registration/vendor-business-registration/`, payload);

// export const getVendorDetailsById = (id: any) =>
//   axios.get(`${BASE_URL}/registration/vendor-business-registration/${id}/`);

// // Consumer API
// export const addCustomerRegistration = (payload: any) =>
//   axios.post(`${BASE_URL}/customer/customers/`, payload);

// export const getConsumerDetailsById = (id: any) =>
//   axios.get(`${BASE_URL}/customer/customers/${id}/`);

// // Distributor API
// export const addDistributorRegistration = (payload: any) =>
//   axios.post(`${BASE_URL}/milkman/milkmen/`, payload);

// //AllMilkmansList
// export const allCustomerList = (payload: any) =>
//   axios.get(`${BASE_URL}/vendor/join-requests/accepted-customers/`, payload);

// // export const allCustomers = (payload: any) =>
// //   axios.get(`${BASE_URL}/customer/allcustomers/`, payload);

// // export const allMikmans = (payload: any) =>
// //   axios.get(`${BASE_URL}/milkman/allmilkmans/`, payload);

// //newly added

// // export const fetchVendorProfile = (vendorId: string, token: string) =>
// //   axios.get(`${BASE_URL}/vendor/vendordetails/${vendorId}/`, {
// //     headers: { Authorization: `Bearer ${token}` },
// //   });


// // GET: Get all vendors
// export const getAllVendors = () =>
//   axios.get(`${BASE_URL}/registration/vendor-business-registration/`);


// /* ---------- Join-request workflow ---------- */

// // Customer / distributor → vendor  (POST)
// export const createRequest = (payload: {
//   user_id: number;
//   user_type: string;
//   vendor: number;
// }) =>
//   axios.post(`${BASE_URL}/vendor/join-requests/`, {
//     user_id: payload.user_id,
//     user_type: payload.user_type,
//     vendor: payload.vendor,
//   });

// // Requests sent by a **customer**
// // export const getCustomerRequests = (userId: string) =>
// //   axios.get(`${BASE_URL}/vendor/join-requests/`, {
// //     params: {
// //       user_id: userId,
// //       user_type: 'customer',
// //     },
// //   });

// // Requests sent by a **distributor**
// // export const getDistributorRequests = (userId: string) =>
// //   axios.get(`${BASE_URL}/vendor/join-requests/`, {
// //     params: {
// //       user_id: userId,
// //       user_type: 'milkman',
// //     },
// //   });

// // Requests a **vendor** must review (default filter = pending)
// export const getVendorPendingRequests = (vendorId: string, status = 'pending') =>
//   axios.get(`${BASE_URL}/vendor/join-requests/`, {
//     params: {
//       vendor_Id: vendorId,
//       status,
//     },
//   });

// // Vendor approves / rejects
// export const updateRequestStatus = (
//   requestId: string,
//   // payload: { status: 'accepted' | 'rejected' },
// ) =>
//   axios.post(`${BASE_URL}/vendor/join-requests/${requestId}/accept/`);



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

// Vendor Registration and Details
export const addVendorRegistration = (payload: any) =>
  axios.post(`${BASE_URL}/registration/vendor-business-registration/`, payload);

export const getVendorDetailsById = (id: string | number) =>
  axios.get(`${BASE_URL}/registration/vendor-business-registration/${id}/`);

// Consumer Registration and Details
export const addCustomerRegistration = (payload: any) =>
  axios.post(`${BASE_URL}/customer/customers/`, payload);

export const getConsumerDetailsById = (id: string | number) =>
  axios.get(`${BASE_URL}/customer/customers/${id}/`);

// Distributor Registration
export const addDistributorRegistration = (payload: any) =>
  axios.post(`${BASE_URL}/milkman/milkmen/`, payload);

// Create a join request (customer or distributor requests to join a vendor)
export const createRequest = (payload: {
  user_id: number;
  user_type: string; // 'customer' or 'milkman'
  vendor: number;
}) =>
  axios.post(`${BASE_URL}/vendor/join-requests/`, payload);

// Get all pending join requests for a vendor
export const getVendorPendingRequests = (vendorId: string | number) =>
  axios.get(`${BASE_URL}/vendor/join-requests/pending/`, {
    params: { vendor_id: vendorId },
  });

// // Get accepted customers for a vendor
// export const getAcceptedCustomers = (vendorId: string | number) =>
//   axios.get(`${BASE_URL}/vendor/join-requests/accepted-customers/`, {
//     params: { vendor_id: vendorId },
//   });

// // Get accepted milkmen (distributors) for a vendor
// export const getAcceptedMilkmen = (vendorId: string | number) =>
//   axios.get(`${BASE_URL}/vendor/join-requests/accepted-milkmen/`, {
//     params: { vendor_id: vendorId },
//   });

// Vendor approves a join request
export const acceptRequest = (requestId: string | number) =>
  axios.post(`${BASE_URL}/vendor/join-requests/${requestId}/accept/`);

// Vendor rejects a join request
export const rejectRequest = (requestId: string | number) =>
  axios.post(`${BASE_URL}/vendor/join-requests/${requestId}/reject/`);

// Get list of all vendors (optional)
export const getAllVendors = () =>
  axios.get(`${BASE_URL}/registration/vendor-business-registration/`);

export const getAllVendorRequests = (vendorId: string | number) =>
  axios.get(`${BASE_URL}/vendor/join-requests/`, {
    params: { vendor_id: vendorId }, // no status filter to get all statuses
  });


// Get accepted customers for a vendor (List Accepted Milkmen for Vendor)
export const getAcceptedCustomers = (vendorId: string | number) =>
  axios.get(`${BASE_URL}/vendor/join-requests/accepted-customers/`, {
    params: { vendor_id: vendorId },
  });

// Get accepted milkmen (distributors) for a vendor (List Accepted Milkmen for Vendor)
export const getAcceptedMilkmen = (vendorId: string | number) =>
  axios.get(`${BASE_URL}/vendor/join-requests/accepted-milkmen/`, {
    params: { vendor_id: vendorId },
  });

  export const listJoinRequestsForVendor = (vendorId: string | number) =>
  axios.get(`${BASE_URL}/vendor/join-requests/requests-for-vendor/`, {
    params: { vendor_id: vendorId },
  });
