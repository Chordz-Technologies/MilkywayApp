import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { checkStoredAuth } from '../store/authSlice';
import { AppDispatch } from '../store';
import SplashScreen from '../screens/SplashScreen';
import SlideScreen from '../screens/Slides';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ConsumerRegistrationScreen from '../screens/Consumer/ConsumerRegistrationScreen';
import VendorRegistrationScreen from '../screens/Vendor/VendorRegistrationScreen';
import DistributorRegistrationScreen from '../screens/Distributor/DistributorRegistrationScreen';
import VendorHomeScreen from '../screens/Vendor/VendorHomeScreen';
import VendorProfileScreen from '../screens/Vendor/VendorProfileScreen';
import ConsumerTabs from '../navigation/ConsumerTabs';
import DistributorTabs from './DistributorTabs';
import AssignDistributorScreen from '../screens/Distributor/DistributorAssignmentScreen';
import PendingRequestsScreen from '../screens/PendingRequests';
import ConsumerCalendarScreen from '../screens/Consumer/ConsumerCalendorScreen';
import DistributorCalendar from '../screens/Distributor/DistributorCalendorScreen';
import UserDetailsScreen from '../screens/Vendor/UserDetailsScreen';
import TemporaryDistributorAssignmentScreen from '../screens/Vendor/TemporaryDistributorAssignmentScreen';
import NotificationsScreen from '../notifications/NotificationsScreen';
import VendorConsumerRequestsScreen from '../screens/Vendor/VendorConsumerRequestsScreen'; // <-- ADD THIS
import VendorDistributorLeaveScreen from '../screens/Vendor/VendorDistributorLeaveScreen'; // <-- ADD THIS
import VendorSubscriptionScreen from '../screens/Vendor/VendorSubscriptionScreen';
import { RootStackParamList } from './types';
import ConsumerListScreen from '../screens/Vendor/ConsumersListScreen';
import DistributorsListScreen from '../screens/Vendor/DistributorsListScreen';
import MilkRequestDistributorAssignScreen from '../screens/Vendor/MilkRequestDistributorAssignScreen';
import ExtraMilkListScreen from '../screens/Distributor/ExtraMilkListScreen';
import TermsConditionScreen from '../screens/TermsConditionScreen';
import VerifyOtpScreen from '../screens/VerifyOtpScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
        <Stack.Screen name="TermsConditions" component={TermsConditionScreen} />

        {/* Auth screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="ConsumerRegistration" component={ConsumerRegistrationScreen} />
        <Stack.Screen name="VendorRegistration" component={VendorRegistrationScreen} />
        <Stack.Screen name="DistributorRegistration" component={DistributorRegistrationScreen} />

        {/* Protected screens - user homes */}
        <Stack.Screen name="VendorHome" component={VendorHomeScreen} />
        <Stack.Screen name="ConsumerHome" component={ConsumerTabs} />
        <Stack.Screen name="DistributorHome" component={DistributorTabs} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />

        {/* Vendor Profile Screen */}
        <Stack.Screen
          name="VendorProfile"
          component={VendorProfileScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}
        />

        {/* Other screens */}
        <Stack.Screen name="PendingRequests" component={PendingRequestsScreen} />
        <Stack.Screen name="AssignDistributor" component={AssignDistributorScreen} />
        <Stack.Screen
          name="AllConsumersList"
          component={ConsumerListScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="DistributorsList"
          component={DistributorsListScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}
        />

        {/* NEW: Vendor Consumer Requests Screen - Extra milk when distributor on leave */}
        <Stack.Screen
          name="VendorConsumerRequests"
          component={VendorConsumerRequestsScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}
        />

        {/* NEW: Vendor Distributor Leave Screen - Manage distributor leave requests */}
        <Stack.Screen
          name="VendorDistributorLeave"
          component={VendorDistributorLeaveScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="VendorSubscription"
          component={VendorSubscriptionScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="ConsumerCalendar"
          component={ConsumerCalendarScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="DistributorConsumerCalendar"
          component={ConsumerCalendarScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}
        />

        <Stack.Screen
          name="VendorDistributorCalendar"
          component={DistributorCalendar}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
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

        {/* Temporary Distributor Assignment screen */}
        <Stack.Screen
          name="TemporaryDistributorAssignment"
          component={TemporaryDistributorAssignmentScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}
        />

        {/* Assign distributor for extra milk request screen */}
        <Stack.Screen
          name="MilkRequestDistributorAssign"
          component={MilkRequestDistributorAssignScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}
        />

        {/* Extra Milk List for Distributor */}
        <Stack.Screen
          name="ExtraMilkList"
          component={ExtraMilkListScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer >
  );
};

export default AppNavigator;