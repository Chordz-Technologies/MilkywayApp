import axios from 'axios';

const BASE_URL = 'https://milkywayapi.beatsacademy.in';

// Vendor Login using mobile number & password
export const loginVendor = (payload: { contact: string; password: string }) =>
  axios.post(`${BASE_URL}/login/vendor-login/`, payload);

// Request OTP for Forgot Password
export const requestOtp = (phone_number: string) =>
  axios.post(`${BASE_URL}/login/auth/request-otp/`, { phone_number });

// Verify OTP
export const verifyOtp = (payload: { mobile: string; otp: string }) =>
  axios.post(`${BASE_URL}/login/auth/verify-otp/`, payload);

// Change Password
export const changePassword = (payload: { mobile: string; password: string }) =>
  axios.post(`${BASE_URL}/login/auth/change-password/`, payload);

// Vendor API
export const addVendorRegistration = (payload: any) =>
  axios.post(`${BASE_URL}/registration/addvendorbusinessregistration/`, payload);

// Consumer API
export const addCustomerRegistration = (payload: any) =>
  axios.post(`${BASE_URL}/customer/addcustomer/`, payload);

// Distributor API
export const addDistributorRegistration = (payload: any) =>
  axios.post(`${BASE_URL}/milkman/addmilkman/`, payload);

// // GET: Get all vendors
// export const getAllVendors = () =>
//   axios.get(`${BASE_URL}/registration/allvendorbusinessregistration/`);

// // PUT: Update a vendor by ID
// export const updateVendor = (id: string, payload: any) =>
//   axios.put(`${BASE_URL}/registration/updatevendorbusinessregistration/${id}/`, payload);

// // DELETE: Delete a vendor by ID
// export const deleteVendor = (id: string) =>
//   axios.delete(`${BASE_URL}/registration/deletevendorbusinessregistration/${id}/`);

