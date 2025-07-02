import axios from 'axios';

const BASE_URL = 'https://milkywayapi.beatsacademy.in';

// Milkman Login using mobile number & password
// export const loginMilkman = async (payload: { mobile: string; password: string }) => {
//   try {
//     const response = await axios.post(`${BASE_URL}/api/login/milkman-login/`, payload);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// Vendor Login using mobile number & password
export const loginVendor = async (payload: { contact: string; password: string }) => {
  try {
    const response = await axios.post(`${BASE_URL}/login/vendor-login/`, payload);
    return response;
  } catch (error) {
    throw error;
  }
};
