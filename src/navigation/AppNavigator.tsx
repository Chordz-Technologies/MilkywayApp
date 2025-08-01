
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your screens
// import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import SlideScreen from '../screens/Slides';
import ConsumerRegistrationScreen from '../screens/Consumer/ConsumerRegistrationScreen';
import VendorRegistrationScreen from '../screens/Vendor/VendorRegistrationScreen';
import DistributorRegistrationScreen from '../screens/Distributor/DistributorRegistrationScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';

import ConsumerHomeScreen from '../screens/Consumer/ConsumerHomeScreen';
import VendorHomeScreen from '../screens/Vendor/VendorHomeScreen';
import DistributorHomeScreen from '../screens/Distributor/DistributorHomeScreen';

import VendorListScreen from '../screens/Vendor/VendorListScreen';
import BillDetailsScreen from '../screens/Consumer/BillDetailScreen';

// You will also need to define your RootStackParamList in a types file.
// For example: navigation/types.ts
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="DistributorHome"
          component={DistributorHomeScreen}
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
        {/* <Stack.Screen
          name="DistributorHome"
          component={DistributorHomeScreen}
          options={{ headerShown: false }}
        /> */}

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
