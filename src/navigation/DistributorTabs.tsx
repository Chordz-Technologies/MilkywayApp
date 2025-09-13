// navigation/DistributorTabs.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import your distributor screens
import DistributorCalendarScreen from '../screens/Distributor/DistributorCalendorScreen';
import DistributorHomeScreen from '../screens/Distributor/DistributorHomeScreen'; // Distributor main screen
import DistributorProfileScreen from '../screens/Distributor/DistributorProfileScreen'; // Distributor profile screen
import ConsumersList from '../screens/Distributor/ConsumerList'; // Adjust path


export type DistributorTabParamList = {
  Calendar: undefined;
  Vendors: undefined;
  Profile: undefined;
  Consumers: undefined;

};

const Tab = createBottomTabNavigator<DistributorTabParamList>();

export default function DistributorTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Calendar" // Calendar as default (same as consumer)
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
            case 'Consumers':
          iconName = focused ? 'people' : 'people-outline';
          break;
            case 'Calendar':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Vendors':
              iconName = focused ? 'home' : 'home-outline';
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
       name="Consumers"
       component={ConsumersList}
       options={{ tabBarLabel: 'Consumers' }}

        />

      <Tab.Screen
        name="Calendar"
        component={DistributorCalendarScreen}
        options={{ tabBarLabel: 'Calendar' }}
      />
      <Tab.Screen
        name="Vendors"
        component={DistributorHomeScreen}
        options={{ tabBarLabel: 'Vendors' }}
      />
      <Tab.Screen
        name="Profile"
        component={DistributorProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
