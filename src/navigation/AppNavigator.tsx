import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screens/SplashScreen';
import Slides from '../screens/Slides';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import VerifyOtpScreen from '../screens/VerifyOtpScreen';
import VendorRegistrationScreen from '../screens/Vendor/VendorRegistrationScreen';
import VendorHomeScreen from '../screens/Vendor/VendorHomeScreen';
import ConsumerHomeScreen from '../screens/Consumer/ConsumerHomeScreen';
import DistributorHomeScreen from '../screens/Distributor/DistributorHomeScreen';
import ConsumerRegistrationScreen from '../screens/Consumer/ConsumerRegistrationScreen';
import DistributorRegistrationScreen from '../screens/Distributor/DistributorRegistrationScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Slide" component={Slides} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
        <Stack.Screen name="VendorRegistration" component={VendorRegistrationScreen} />
        <Stack.Screen name="ConsumerRegistration" component={ConsumerRegistrationScreen} />
        <Stack.Screen name="DistributorRegistration" component={DistributorRegistrationScreen} />
        <Stack.Screen name="VendorHome" component={VendorHomeScreen} />
        <Stack.Screen name="ConsumerHome" component={ConsumerHomeScreen} />
        <Stack.Screen name="DistributorHome" component={DistributorHomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
