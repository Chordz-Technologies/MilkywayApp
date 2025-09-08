// navigation/ConsumerTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import your screens
import ConsumerCalendarScreen from '../screens/Consumer/ConsumerCalendorScreen';
import CustomerHomeScreen from '../screens/Consumer/ConsumerHomeScreen'; // Your vendor screen
import ConsumerProfileScreen from '../screens/Consumer/ConsumerProfile'; // New profile screen

export type ConsumerTabParamList = {
  Calendar: undefined;
  Vendors: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<ConsumerTabParamList>();

export default function ConsumerTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Calendar" // Calendar as default
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: string;

          switch (route.name) {
            case 'Calendar':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Vendors':
              iconName = focused ? 'storefront' : 'storefront-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'calendar-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Calendar"
        component={ConsumerCalendarScreen}
        options={{ tabBarLabel: 'Calendar' }}
      />
      <Tab.Screen
        name="Vendors"
        component={CustomerHomeScreen} // Your existing vendor screen
        options={{ tabBarLabel: 'Vendors' }}
      />
      <Tab.Screen
        name="Profile"
        component={ConsumerProfileScreen} // New profile screen
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
