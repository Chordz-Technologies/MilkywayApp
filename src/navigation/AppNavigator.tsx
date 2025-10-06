

// export default AppNavigator;
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { checkStoredAuth } from '../store/authSlice';
import { AppDispatch } from '../store';

// Screens
import SplashScreen from '../screens/SplashScreen';
import SlideScreen from '../screens/Slides';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ConsumerRegistrationScreen from '../screens/Consumer/ConsumerRegistrationScreen';
import VendorRegistrationScreen from '../screens/Vendor/VendorRegistrationScreen';
import DistributorRegistrationScreen from '../screens/Distributor/DistributorRegistrationScreen';
import VendorHomeScreen from '../screens/Vendor/VendorHomeScreen';
import ConsumerTabs from '../navigation/ConsumerTabs';
import DistributorTabs from './DistributorTabs';
import AssignDistributorScreen from '../screens/Distributor/DistributorAssignmentScreen';
import PendingRequestsScreen from '../screens/PendingRequests';
import ConsumerCalendarScreen from '../screens/Consumer/ConsumerCalendorScreen';
import UserDetailsScreen from '../screens/Vendor/UserDetailsScreen'; // Add this import

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(checkStoredAuth());
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        {/* Splash & Slides */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Slide" component={SlideScreen} />

        {/* Auth screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ConsumerRegistration" component={ConsumerRegistrationScreen} />
        <Stack.Screen name="VendorRegistration" component={VendorRegistrationScreen} />
        <Stack.Screen name="DistributorRegistration" component={DistributorRegistrationScreen} />

        {/* Protected screens - user homes */}
        <Stack.Screen name="VendorHome" component={VendorHomeScreen} />
        <Stack.Screen name="ConsumerHome" component={ConsumerTabs} />
        <Stack.Screen name="DistributorHome" component={DistributorTabs} />

        {/* Other screens */}
        <Stack.Screen name="PendingRequests" component={PendingRequestsScreen} />
        <Stack.Screen name="AssignDistributor" component={AssignDistributorScreen} />

        {/* Calendar screen for distributors */}
        <Stack.Screen
          name="DistributorConsumerCalendar"
          component={ConsumerCalendarScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
          }}
        />

        {/* User Details screen */}
        <Stack.Screen
          name="UserDetails"
          component={UserDetailsScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
