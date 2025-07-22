// // AppNavigator.tsx
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';

// // Import all your screen components
// // Adjust paths as necessary based on your folder structure
// import SplashScreen from '../screens/SplashScreen';
// import Slides from '../screens/Slides';
// import LoginScreen from '../screens/LoginScreen';
// import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
// import ResetPasswordScreen from '../screens/ResetPasswordScreen';
// import VerifyOtpScreen from '../screens/VerifyOtpScreen';

// import VendorRegistrationScreen from '../screens/Vendor/VendorRegistrationScreen';
// import VendorHomeScreen from '../screens/Vendor/VendorHomeScreen';
// import EditProfileScreen from '../screens/Vendor/EditProfileScreen';
// import CustomerDetailScreen from '../screens/Consumer/CustomerDetails';

// import ConsumerHomeScreen from '../screens/Consumer/ConsumerHomeScreen';
// import ConsumerRegistrationScreen from '../screens/Consumer/ConsumerRegistrationScreen';

// import DistributorHomeScreen from '../screens/Distributor/DistributorHomeScreen';
// import DistributorRegistrationScreen from '../screens/Distributor/DistributorRegistrationScreen';
// import MilkmanListScreen from '../screens/Distributor/MilkmanListScreen';

// // Import your RootStackParamList type
// import { RootStackParamList } from '../navigation/types';

// const Stack = createNativeStackNavigator<RootStackParamList>();

// const AppNavigator = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator
//         initialRouteName="Splash"
//         screenOptions={{
//           headerShown: false,
//           animation: 'slide_from_right',
//         }}
//       >
//         <Stack.Screen name="Splash" component={SplashScreen} />
//         <Stack.Screen name="Slide" component={Slides} />
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
//         <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
//         <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
//         <Stack.Screen name="VendorRegistration" component={VendorRegistrationScreen} />
//         <Stack.Screen name="ConsumerRegistration" component={ConsumerRegistrationScreen} />
//         <Stack.Screen name="DistributorRegistration" component={DistributorRegistrationScreen} />
//         <Stack.Screen name="VendorHome" component={VendorHomeScreen} />
//         <Stack.Screen name="MilkmanList" component={MilkmanListScreen} options={{ headerShown: false }} />
//         <Stack.Screen name="CustomerDetail" component={CustomerDetailScreen} />
//         <Stack.Screen
//           name="EditProfile"
//           component={EditProfileScreen}
//           options={{
//             headerShown: false,
//           }}
//         />
//         <Stack.Screen name="ConsumerHome" component={ConsumerHomeScreen} />
//         <Stack.Screen name="DistributorHome" component={DistributorHomeScreen} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SlideScreen from '../screens/Slides'; // Assuming you have a SlideScreen for intro slides
import ConsumerRegistrationScreen from '../screens/Consumer/ConsumerRegistrationScreen';
import VendorRegistrationScreen from '../screens/Vendor/VendorRegistrationScreen';
import DistributorRegistrationScreen from '../screens/Distributor/DistributorRegistrationScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

import ConsumerHomeScreen from '../screens/Consumer/ConsumerHomeScreen';
import VendorHomeScreen from '../screens/Vendor/VendorHomeScreen'; // Placeholder - ensure this file exists
import DistributorHomeScreen from '../screens/Distributor/DistributorHomeScreen'; // Placeholder - ensure this file exists

import VendorListScreen from '../screens/Vendor/VendorListScreen';
import BillDetailsScreen from '../screens/Consumer/BillDetailScreen';

// You will also need to define your RootStackParamList in a types file.
// For example: navigation/types.ts
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Slide"
          component={SlideScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ConsumerRegistration"
          component={ConsumerRegistrationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VendorRegistration"
          component={VendorRegistrationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DistributorRegistration"
          component={DistributorRegistrationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />

        {/* Home Screens for different roles */}
        <Stack.Screen
          name="ConsumerHome"
          component={ConsumerHomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VendorHome"
          component={VendorHomeScreen}
          // component={ConsumerHomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DistributorHome"
          component={DistributorHomeScreen}
          options={{ headerShown: false }}
        />

        {/* Other Screens */}
        <Stack.Screen
          name="VendorList"
          component={VendorListScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BillDetails"
          component={BillDetailsScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
