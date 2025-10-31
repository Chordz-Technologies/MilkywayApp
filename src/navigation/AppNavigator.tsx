
// import React, { useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useDispatch } from 'react-redux';
// import { checkStoredAuth } from '../store/authSlice';
// import { AppDispatch } from '../store';

// // Screens
// import SplashScreen from '../screens/SplashScreen';
// import SlideScreen from '../screens/Slides';
// import LoginScreen from '../screens/LoginScreen';
// import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
// import ConsumerRegistrationScreen from '../screens/Consumer/ConsumerRegistrationScreen';
// import VendorRegistrationScreen from '../screens/Vendor/VendorRegistrationScreen';
// import DistributorRegistrationScreen from '../screens/Distributor/DistributorRegistrationScreen';
// import VendorHomeScreen from '../screens/Vendor/VendorHomeScreen';
// import VendorProfileScreen from '../screens/Vendor/VendorProfileScreen';
// import ConsumerTabs from '../navigation/ConsumerTabs';
// import DistributorTabs from './DistributorTabs';
// import AssignDistributorScreen from '../screens/Distributor/DistributorAssignmentScreen';
// import PendingRequestsScreen from '../screens/PendingRequests';
// import ConsumerCalendarScreen from '../screens/Consumer/ConsumerCalendorScreen';
// import DistributorCalendar from '../screens/Distributor/DistributorCalendorScreen';
// import UserDetailsScreen from '../screens/Vendor/UserDetailsScreen';
// import TemporaryDistributorAssignmentScreen from '../screens/Vendor/TemporaryDistributorAssignmentScreen';
// import NotificationsScreen from '../notifications/NotificationsScreen';
// import { RootStackParamList } from './types';
// // import NotificationsScreen from '../notifications/NotificationsScreen';

// const Stack = createNativeStackNavigator<RootStackParamList>();

// const AppNavigator = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   useEffect(() => {
//     dispatch(checkStoredAuth());
//   }, [dispatch]);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
//         {/* Splash & Slides */}
//         <Stack.Screen name="Splash" component={SplashScreen} />
//         <Stack.Screen name="Slide" component={SlideScreen} />

//         {/* Auth screens */}
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
//         <Stack.Screen name="ConsumerRegistration" component={ConsumerRegistrationScreen} />
//         <Stack.Screen name="VendorRegistration" component={VendorRegistrationScreen} />
//         <Stack.Screen name="DistributorRegistration" component={DistributorRegistrationScreen} />

//         {/* Protected screens - user homes */}
//         <Stack.Screen name="VendorHome" component={VendorHomeScreen} />
//         <Stack.Screen name="ConsumerHome" component={ConsumerTabs} />
//         <Stack.Screen name="DistributorHome" component={DistributorTabs} />

//         <Stack.Screen name="Notifications" component={NotificationsScreen} />

//         {/* Vendor Profile Screen */}
//         <Stack.Screen
//           name="VendorProfile"
//           component={VendorProfileScreen}
//           options={{
//             headerShown: false,
//             gestureEnabled: true,
//             animation: 'slide_from_right',
//           }}
//         />

//         {/* Other screens */}
//         <Stack.Screen name="PendingRequests" component={PendingRequestsScreen} />
//         <Stack.Screen name="AssignDistributor" component={AssignDistributorScreen} />

//         {/*
//           Consumer Calendar - Used for multiple purposes:
//           1. Vendors viewing consumer calendars (viewerRole: 'vendor')
//           2. Consumers viewing their own calendar (accessed via tabs)
//         */}
//         <Stack.Screen
//           name="ConsumerCalendar"
//           component={ConsumerCalendarScreen}
//           options={{
//             headerShown: false,
//             gestureEnabled: true,
//             animation: 'slide_from_right',
//           }}
//         />

//         {/*
//           Distributor Consumer Calendar - Distributors viewing assigned consumer calendars
//           Uses the same ConsumerCalendarScreen component with viewerRole: 'distributor'
//         */}
//         <Stack.Screen
//           name="DistributorConsumerCalendar"
//           component={ConsumerCalendarScreen}
//           options={{
//             headerShown: false,
//             gestureEnabled: true,
//             animation: 'slide_from_right',
//           }}
//         />

//         {/*
//           Distributor Calendar - Used for multiple purposes:
//           1. Vendors viewing distributor calendars (viewerRole: 'vendor')
//           2. Distributors viewing their own calendar (accessed via tabs)
//         */}
//         <Stack.Screen
//           name="VendorDistributorCalendar"
//           component={DistributorCalendar}
//           options={{
//             headerShown: false,
//             gestureEnabled: true,
//             animation: 'slide_from_right',
//           }}
//         />

//         {/* User Details screen */}
//         <Stack.Screen
//           name="UserDetails"
//           component={UserDetailsScreen}
//           options={{
//             headerShown: false,
//             gestureEnabled: true,
//             animation: 'slide_from_right',
//           }}
//         />

//         {/* Temporary Distributor Assignment screen */}
//         <Stack.Screen
//           name="TemporaryDistributorAssignment"
//           component={TemporaryDistributorAssignmentScreen}
//           options={{
//             headerShown: false,
//             gestureEnabled: true,
//             animation: 'slide_from_right',
//           }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

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

        {/*
          Consumer Calendar - Used for multiple purposes:
          1. Vendors viewing consumer calendars (viewerRole: 'vendor')
          2. Consumers viewing their own calendar (accessed via tabs)
        */}
        <Stack.Screen
          name="ConsumerCalendar"
          component={ConsumerCalendarScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}
        />

        {/*
          Distributor Consumer Calendar - Distributors viewing assigned consumer calendars
          Uses the same ConsumerCalendarScreen component with viewerRole: 'distributor'
        */}
        <Stack.Screen
          name="DistributorConsumerCalendar"
          component={ConsumerCalendarScreen}
          options={{
            headerShown: false,
            gestureEnabled: true,
            animation: 'slide_from_right',
          }}
        />

        {/*
          Distributor Calendar - Used for multiple purposes:
          1. Vendors viewing distributor calendars (viewerRole: 'vendor')
          2. Distributors viewing their own calendar (accessed via tabs)
        */}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
