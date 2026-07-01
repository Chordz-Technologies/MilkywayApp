import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from '../i18n/LanguageProvider';
import DistributorCalendarScreen from '../screens/Distributor/DistributorCalendorScreen';
import DistributorHomeScreen from '../screens/Distributor/DistributorHomeScreen';
import DistributorProfileScreen from '../screens/Distributor/DistributorProfileScreen';
import ConsumersList from '../screens/Distributor/ConsumerList';

export type DistributorTabParamList = {
  Calendar: undefined;
  Vendors: undefined;
  Profile: undefined;
  Consumers: undefined;
};

const Tab = createBottomTabNavigator<DistributorTabParamList>();

// Move icon logic OUTSIDE the component
const getTabBarIcon = (
  routeName: keyof DistributorTabParamList,
  focused: boolean,
  color: string,
  size: number
) => {
  let iconName: string;

  switch (routeName) {
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
};

export default function DistributorTabs() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const getTabLabel = (routeName: keyof DistributorTabParamList) => {
    switch (routeName) {
      case 'Consumers':
        return t('distributor.consumers');
      case 'Calendar':
        return t('distributor.calendar');
      case 'Vendors':
        return t('distributor.vendors');
      case 'Profile':
        return t('distributor.profile');
      default:
        return routeName;
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="Consumers"
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
        tabBarIcon: ({ color, size, focused }) =>
          getTabBarIcon(route.name, focused, color, size),
        tabBarLabel: getTabLabel(route.name),
      })}
    >
      <Tab.Screen
        name="Consumers"
        component={ConsumersList}
      />
      <Tab.Screen
        name="Calendar"
        component={DistributorCalendarScreen}
      />
      <Tab.Screen
        name="Vendors"
        component={DistributorHomeScreen}
      />
      <Tab.Screen
        name="Profile"
        component={DistributorProfileScreen}
      />
    </Tab.Navigator>
  );
}