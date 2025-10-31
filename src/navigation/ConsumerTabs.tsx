
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import your screens
import ConsumerCalendarScreen from '../screens/Consumer/ConsumerCalendorScreen';
import CustomerHomeScreen from '../screens/Consumer/ConsumerHomeScreen';
import ConsumerProfileScreen from '../screens/Consumer/ConsumerProfileScreen';
import ConsumerSubscriptionScreen from '../screens/Consumer/ConsumerSubscriptionScreen';

export type ConsumerTabParamList = {
  Calendar: undefined;
  Vendors: undefined;
  Payment: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<ConsumerTabParamList>();

const getTabBarIcon = (routeName: keyof ConsumerTabParamList, focused: boolean, color: string, size: number) => {
  let iconName: string;

  switch (routeName) {
    case 'Calendar':
      iconName = focused ? 'calendar' : 'calendar-outline';
      break;
    case 'Vendors':
      iconName = focused ? 'storefront' : 'storefront-outline';
      break;
    case 'Payment':
      iconName = focused ? 'card' : 'card-outline';
      break;
    case 'Profile':
      iconName = focused ? 'person' : 'person-outline';
      break;
    default:
      iconName = 'calendar-outline';
  }

  return <Ionicons name={iconName} size={size} color={color} />;
};

export default function ConsumerTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Calendar"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          height: 60 + insets.bottom,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        //  Use the external function
        tabBarIcon: ({ color, size, focused }) =>
          getTabBarIcon(route.name, focused, color, size),
      })}
    >
      <Tab.Screen
        name="Calendar"
        component={ConsumerCalendarScreen}
        options={{ tabBarLabel: 'Calendar' }}
      />
      <Tab.Screen
        name="Vendors"
        component={CustomerHomeScreen}
        options={{ tabBarLabel: 'Vendors' }}
      />
      <Tab.Screen
        name="Payment"
        component={ConsumerSubscriptionScreen}
        options={{ tabBarLabel: 'Payment' }}
      />
      <Tab.Screen
        name="Profile"
        component={ConsumerProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}
