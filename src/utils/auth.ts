import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

export const getStoredToken = async () => {
  return await AsyncStorage.getItem('access_token');
};

export const getStoredUser = async () => {
  const userInfo = await AsyncStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo) : null;
};

export const clearAuthStorage = async () => {
  await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
};

interface JwtPayload {
  exp: number;
  iat?: number;
  sub?: string;
  [key: string]: any;
}

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);

    // Check if token is expired
    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    // If any error occurs during decoding, consider token as expired
    return true;
  }
};

// Bonus: Get token payload
export const getTokenPayload = (token: string): JwtPayload | null => {
  try {
    return jwtDecode<JwtPayload>(token);
  } catch (error) {
    return null;
  }
};
