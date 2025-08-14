// import React, { useEffect } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { useDispatch, useSelector } from 'react-redux';
// import { checkStoredAuth } from '../store/authSlice';
// import { RootState, AppDispatch } from '../store';

// // Import your screens
// import LoginScreen from '../screens/LoginScreen';
// import SlideScreen from '../screens/Slides';
// import ConsumerRegistrationScreen from '../screens/Consumer/ConsumerRegistrationScreen';
// import VendorRegistrationScreen from '../screens/Vendor/VendorRegistrationScreen';
// import DistributorRegistrationScreen from '../screens/Distributor/DistributorRegistrationScreen';
// import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

// import ConsumerHomeScreen from '../screens/Consumer/ConsumerHomeScreen';
// import VendorHomeScreen from '../screens/Vendor/VendorHomeScreen';
// import DistributorHomeScreen from '../screens/Distributor/DistributorHomeScreen';

// import VendorListScreen from '../screens/Vendor/VendorListScreen';
// import BillDetailsScreen from '../screens/Consumer/BillDetailScreen';
// import PendingRequestsScreen from '../screens/PendingRequests';

// import useExitAppConfirmation from '../components/ExitApp';
// import SplashScreen from '../screens/SplashScreen';

// // Types
// import { RootStackParamList } from './types';

// const Stack = createNativeStackNavigator<RootStackParamList>();

// const AppNavigator = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

//   useExitAppConfirmation();

//   // Check stored authentication tokens on app launch
//   useEffect(() => {
//     dispatch(checkStoredAuth());
//   }, [dispatch]);

//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
//         {!isAuthenticated ? (
//           // Unauthenticated flow
//           <>
//             <Stack.Screen name="Splash" component={SplashScreen} />
//             <Stack.Screen name="Slide" component={SlideScreen} />
//             <Stack.Screen name="Login" component={LoginScreen} />
//             <Stack.Screen name="ConsumerRegistration" component={ConsumerRegistrationScreen} />
//             <Stack.Screen name="VendorRegistration" component={VendorRegistrationScreen} />
//             <Stack.Screen name="DistributorRegistration" component={DistributorRegistrationScreen} />
//             <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
//           </>
//         ) : (
//           // Authenticated flow with role-based home screens
//           <>
//             <Stack.Screen name="VendorList" component={VendorListScreen} />
//             <Stack.Screen name="BillDetails" component={BillDetailsScreen} />
//             <Stack.Screen name="PendingRequests" component={PendingRequestsScreen} />

//             {user?.role === 'vendor' && (
//               <Stack.Screen name="VendorHome" component={VendorHomeScreen} />
//             )}
//             {user?.role === 'customer' && (
//               <Stack.Screen name="ConsumerHome" component={ConsumerHomeScreen} />
//             )}
//             {user?.role === 'milkman' && (
//               <Stack.Screen name="DistributorHome" component={DistributorHomeScreen} />
//             )}

//             {/* Allow logout by navigating to Login */}
//             <Stack.Screen name="Login" component={LoginScreen} />
//           </>
//         )}
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
import ConsumerHomeScreen from '../screens/Consumer/ConsumerHomeScreen';
import DistributorHomeScreen from '../screens/Distributor/DistributorHomeScreen';
import VendorListScreen from '../screens/Vendor/VendorListScreen';
import BillDetailsScreen from '../screens/Consumer/BillDetailScreen';
import PendingRequestsScreen from '../screens/PendingRequests';

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

        {/* Protected screens */}
        <Stack.Screen name="VendorHome" component={VendorHomeScreen} />
        <Stack.Screen name="ConsumerHome" component={ConsumerHomeScreen} />
        <Stack.Screen name="DistributorHome" component={DistributorHomeScreen} />
        <Stack.Screen name="VendorList" component={VendorListScreen} />
        <Stack.Screen name="BillDetails" component={BillDetailsScreen} />
        <Stack.Screen name="PendingRequests" component={PendingRequestsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
