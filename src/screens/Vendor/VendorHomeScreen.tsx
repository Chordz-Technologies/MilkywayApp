
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../navigation/types';
import { allCustomers } from '../../apiServices/allApi';
import { styles } from '../../styles/vendorhomestyles';

// =====================================================================
// 1. Type Definitions
// =====================================================================

type VendorHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VendorHome'>;

type VendorData = {
  id: string;
  name: string;
  location: string;
  rating: number;
  phone: string;
  email?: string;
  address?: string;
  profileImage?: string;
  businessName?: string;
  totalCustomers: number;
  defaulters: number;
  paidCustomers: number;
  totalMilkmans: number;
};

type Customer = {
  id: string;
  name: string;
  address: string;
  status: 'Paid' | 'Pending';
  phone: string;
};

// =====================================================================
// 2. Component Definition
// =====================================================================

const VendorHomeScreen = () => {
  const navigation = useNavigation<VendorHomeNavigationProp>();

  // State variables
  const [search, setSearch] = useState('');
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle logout function
  const handleLogout = useCallback(async () => {
    try {
      console.log('Logging out user...');
      const keysToRemove = [
        'userID', 'vendorId', 'userToken', 'userRole', 'userContact',
        'vendorName', 'vendorData', 'loginTimestamp', 'userFullContact',
      ];
      await AsyncStorage.multiRemove(keysToRemove);
      console.log('User data cleared from AsyncStorage');

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [navigation]);

  // Get vendor session data from AsyncStorage
  const getVendorSession = useCallback(async () => {
    try {
      const [userID, vendorId, userToken, userRole, userContact, vendorName, vendorData] =
        await AsyncStorage.multiGet([
          'userID', 'vendorId', 'userToken', 'userRole',
          'userContact', 'vendorName', 'vendorData',
        ]);

      const sessionData = {
        userID: userID[1],
        vendorId: vendorId[1],
        userToken: userToken[1],
        userRole: userRole[1],
        userContact: userContact[1],
        vendorName: vendorName[1],
        vendorData: vendorData[1],
      };

      console.log('=== Session Data ===');
      console.log('userID:', sessionData.userID);
      console.log('vendorId:', sessionData.vendorId);
      console.log('userToken:', sessionData.userToken);
      console.log('userRole:', sessionData.userRole);
      console.log('userContact:', sessionData.userContact);
      console.log('vendorName:', sessionData.vendorName);
      console.log('vendorData:', sessionData.vendorData);
      console.log('===================');

      return sessionData;
    } catch (error) {
      console.error('Error getting session data:', error);
      return null;
    }
  }, []);

  // Debug function to check stored data
  const debugCurrentStorage = useCallback(async () => {
    try {
      console.log('🔍 === DEBUGGING CURRENT STORAGE ===');

      const vendorName = await AsyncStorage.getItem('vendorName');
      const vendorData = await AsyncStorage.getItem('vendorData');
      const userID = await AsyncStorage.getItem('userID');
      const vendorId = await AsyncStorage.getItem('vendorId');

      console.log('Stored vendorName:', vendorName);
      console.log('Stored userID:', userID);
      console.log('Stored vendorId:', vendorId);
      console.log('Raw vendorData:', vendorData);

      if (vendorData) {
        try {
          const parsed = JSON.parse(vendorData);
          console.log('Parsed vendorData:', parsed);
          console.log('Parsed vendorData.name:', parsed.name);
          console.log('Parsed vendorData.company_name:', parsed.company_name);
        } catch (parseError) {
          console.error('Error parsing vendorData:', parseError);
        }
      }

      console.log('=== END STORAGE DEBUG ===');
    } catch (error) {
      console.error('Debug storage error:', error);
    }
  }, []);

  // 🔥 FIXED FETCH VENDOR DATA FUNCTION
  const fetchVendorData = useCallback(async (isRefresh: boolean = false) => {
    console.log('🏁 Starting fetchVendorData...');

    // Debug current storage
    await debugCurrentStorage();

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      // Get session data
      const sessionData = await getVendorSession();

      if (!sessionData?.userToken) {
        Alert.alert('Session Expired', 'Please login again.', [
          { text: 'OK', onPress: handleLogout },
        ]);
        return;
      }

      // Get vendor ID (this will be the phone number)
      const vendorId = sessionData.userID || sessionData.vendorId;
      if (!vendorId) {
        Alert.alert('Session Error', 'No vendor ID found. Please login again.', [
          { text: 'OK', onPress: handleLogout },
        ]);
        return;
      }

      console.log('✅ Vendor ID (phone):', vendorId);

      // 🔥 PROPER VENDOR NAME RESOLUTION
      let actualVendorName = 'My Dairy Business'; // Default fallback

      // Method 1: Try to get name from direct vendorName storage
      if (sessionData.vendorName && sessionData.vendorName !== vendorId) {
        actualVendorName = sessionData.vendorName;
        console.log('✅ Found vendor name from vendorName field:', actualVendorName);
      }
      // Method 2: Try to parse vendorData and extract name
      else if (sessionData.vendorData) {
        try {
          const parsedVendorData = JSON.parse(sessionData.vendorData);
          console.log('📋 Parsed vendor data:', parsedVendorData);

          const extractedName =
            parsedVendorData.name ||
            parsedVendorData.vendor_name ||
            parsedVendorData.company_name ||
            parsedVendorData.business_name ||
            parsedVendorData.businessName;

          // Make sure the extracted name is not the phone number
          if (extractedName && extractedName !== vendorId && extractedName !== `+91${vendorId}`) {
            actualVendorName = extractedName;
            console.log('✅ Found vendor name from parsed data:', actualVendorName);
          }
        } catch (parseError) {
          console.error('Error parsing vendor data:', parseError);
        }
      }

      console.log('🎯 FINAL VENDOR NAME TO USE:', actualVendorName);

      // Create vendor info object with proper name
      let vendorInfo = {
        id: vendorId,
        name: actualVendorName,  // 🔥 USE ACTUAL NAME, NOT PHONE NUMBER
        contact: sessionData.userContact ? `+91${sessionData.userContact}` : `+91${vendorId}`,
        phone: sessionData.userContact ? `+91${sessionData.userContact}` : `+91${vendorId}`,
        email: '',
        address: 'Business Address, Pune',
        city: 'Pune',
        company_name: actualVendorName,  // 🔥 USE ACTUAL NAME
        business_name: actualVendorName, // 🔥 USE ACTUAL NAME
        rating: 4.5,
      };

      // If we have stored vendor data, merge it but keep our resolved name
      if (sessionData.vendorData) {
        try {
          const storedVendorData = JSON.parse(sessionData.vendorData);
          vendorInfo = {
            ...vendorInfo,
            ...storedVendorData,
            // 🔥 OVERRIDE WITH RESOLVED NAME (NOT PHONE NUMBER)
            name: actualVendorName,
            company_name: actualVendorName,
            business_name: actualVendorName,
            id: vendorId, // Keep phone as ID
          };
        } catch (parseError) {
          console.error('Error merging stored vendor data:', parseError);
        }
      }

      console.log('✅ Final vendor info object:', vendorInfo);

      // Fetch milkman data (optional)
      let milkmanCount = 0;

      // Fetch customer data (optional)
      let transformedCustomers: Customer[] = [];
      try {
        const customersResponse = await allCustomers({});
        console.log('✅ Customers API Response:', customersResponse.data);

        let customersData = [];
        if (customersResponse.data?.customers) {
          customersData = customersResponse.data.customers;
        } else if (Array.isArray(customersResponse.data)) {
          customersData = customersResponse.data;
        } else if (customersResponse.data?.data && Array.isArray(customersResponse.data.data)) {
          customersData = customersResponse.data.data;
        }

        // 🔥 ENHANCED CUSTOMER NAME EXTRACTION
        transformedCustomers = customersData.map((customer: any) => {
          const customerName =
            customer.name ||
            customer.customer_name ||
            customer.user_name ||
            customer.full_name ||
            customer.first_name ||
            `Customer ${customer.id || 'Unknown'}`;

          console.log('🔍 Customer data:', customer);
          console.log('🔍 Extracted customer name:', customerName);

          return {
            id: String(customer.id || customer.customer_id || customer._id || Math.random()),
            name: String(customerName),
            address: String(customer.address || customer.location || customer.city || 'No address provided'),
            status: (customer.payment_status === 'paid' || customer.status === 'paid') ? 'Paid' : 'Pending',
            phone: String(customer.phone || customer.mobile || customer.contact || 'No phone'),
          };
        });

        console.log('✅ Transformed customers:', transformedCustomers);
      } catch (customerError: any) {
        const errorMessage = customerError?.message || customerError?.toString() || 'Unknown error';
        console.warn('⚠️ Customer API failed:', errorMessage);
        transformedCustomers = [];
      }

      setCustomers(transformedCustomers);

      // Calculate stats
      const totalCustomers = transformedCustomers.length;
      const paidCustomers = transformedCustomers.filter(c => c.status === 'Paid').length;
      const defaulters = transformedCustomers.filter(c => c.status === 'Pending').length;

      // 🔥 CREATE FINAL VENDOR DATA WITH PROPER NAME
      const finalVendorData: VendorData = {
        id: String(vendorId), // Phone number as ID
        name: String(actualVendorName), // 🔥 ACTUAL NAME, NOT PHONE
        location: String(vendorInfo.address || vendorInfo.city || 'Pune, Maharashtra'),
        rating: Number(vendorInfo.rating) || 4.5,
        phone: String(vendorInfo.phone),
        email: String(vendorInfo.email || ''),
        address: String(vendorInfo.address || 'Business Address'),
        businessName: String(actualVendorName), // 🔥 ACTUAL NAME, NOT PHONE
        totalCustomers,
        defaulters,
        paidCustomers,
        totalMilkmans: milkmanCount,
      };

      console.log('🎉 FINAL VENDOR DATA FOR DISPLAY:', finalVendorData);
      console.log('🎯 NAME BEING DISPLAYED:', finalVendorData.name);
      console.log('🎯 BUSINESS NAME BEING DISPLAYED:', finalVendorData.businessName);

      setVendorData(finalVendorData);

    } catch (err: any) {
      console.error('❌ Error in fetchVendorData:', err);

      let errorMessage = 'Failed to load dashboard. Please try again.';

      if (err.response?.status === 401) {
        errorMessage = 'Session expired. Please login again.';
        setTimeout(() => handleLogout(), 1000);
        return;
      }

      setError(errorMessage);

      if (!isRefresh) {
        Alert.alert('Error', errorMessage, [
          { text: 'Retry', onPress: () => fetchVendorData() },
          { text: 'Logout', onPress: handleLogout },
        ]);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [getVendorSession, handleLogout, debugCurrentStorage]);

  // Pull to refresh
  const onRefresh = useCallback(() => {
    fetchVendorData(true);
  }, [fetchVendorData]);

  // Render customer item
  const renderCustomerItem = useCallback(({ item }: { item: Customer }) => (
    <TouchableOpacity
      style={styles.customerRow}
      onPress={() => {
        navigation.navigate('CustomerDetail', {
          customerId: item.id,
          customerName: item.name,
        });
      }}
    >
      <View style={styles.customerInfo}>
        <Text style={styles.customerName}>{item.name}</Text>
        <Text style={styles.customerAddress}>{item.address}</Text>
        <Text style={styles.customerPhone}>{item.phone}</Text>
      </View>
      <Text
        style={[
          styles.customerStatus,
          item.status === 'Paid' ? styles.statusPaid : styles.statusPending,
        ]}
      >
        {item.status}
      </Text>
      <Ionicons name="chevron-forward" size={24} color="#C0C0C0" />
    </TouchableOpacity>
  ), [navigation]);

  // Render header
  const renderHeader = useCallback(() => {
    if (!vendorData) {return null;}

    return (
      <>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Home</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
              <Ionicons name="refresh" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => console.log('Notifications pressed')}>
              <Ionicons name="notifications-outline" size={26} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Card - Shows Vendor's Actual Name */}
        <View style={styles.profileCard}>
          <Image
            source={
              vendorData.profileImage
                ? { uri: vendorData.profileImage }
                : { uri: 'https://randomuser.me/api/portraits/men/32.jpg' }
            }
            style={styles.avatarLarge}
          />
          <View style={styles.profileInfoWrapper}>
            <Text style={styles.profileName}>
              {vendorData.businessName || vendorData.name}
            </Text>
            <Text style={styles.profileLocation}>{vendorData.location}</Text>
            <View style={styles.profileRatingRow}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.profileRating}>{vendorData.rating.toFixed(1)}</Text>
            </View>
            <Text style={styles.profilePhone}>{vendorData.phone}</Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="create-outline" size={18} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={[styles.statsBox, styles.statsBoxShadow]}>
            <Ionicons name="people" size={24} color="#007AFF" style={styles.iconMarginBottom} />
            <Text style={styles.statsLabel}>Total Customers</Text>
            <Text style={styles.statsValue}>{vendorData.totalCustomers}</Text>
          </View>
          <View style={[styles.statsBox, styles.statsBoxShadow]}>
            <Ionicons name="alert-circle" size={24} color="#FF6B6B" style={styles.iconMarginBottom} />
            <Text style={styles.statsLabel}>Payment Defaulters</Text>
            <Text style={styles.statsValue}>{vendorData.defaulters}</Text>
          </View>
        </View>
        <View style={[styles.statsBoxWide, styles.statsBoxShadow]}>
          <Ionicons name="checkmark-done-circle" size={24} color="#4CD964" style={styles.iconMarginBottom} />
          <Text style={styles.statsLabel}>Customers Paid Bills</Text>
          <Text style={styles.statsValue}>{vendorData.paidCustomers}</Text>
        </View>
        <TouchableOpacity
          style={[styles.statsBoxWide, styles.statsBoxShadow]}
          onPress={() => navigation.navigate('MilkmanList')}
        >
          <Ionicons name="bus-outline" size={24} color="#FFA500" style={styles.iconMarginBottom} />
          <Text style={styles.statsLabel}>Enrolled Milkmans</Text>
          <Text style={styles.statsValue}>{vendorData.totalMilkmans}</Text>
        </TouchableOpacity>

        {/* Customer List Section */}
        <Text style={styles.sectionTitle}>Customer List ({customers.length})</Text>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#888" style={styles.iconMarginRight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers"
            placeholderTextColor="#bbb"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </>
    );
  }, [vendorData, customers.length, search, onRefresh, navigation]);

  // List empty component
  const listEmptyComponent = useCallback(() => (
    <View style={styles.customerListCard}>
      <Text style={styles.noCustomerText}>
        {search ? 'No customers found matching your search.' : 'No customers found.'}
      </Text>
    </View>
  ), [search]);

  // Focus effect hook
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Screen focused, fetching vendor data...');
      fetchVendorData();
    }, [fetchVendorData])
  );

  // Filter customers
  const filteredCustomers = customers.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  // Early returns after all hooks
  if (isLoading && !vendorData) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  if (error && !vendorData) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF6B6B" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchVendorData()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Main render
  return (
    <View style={styles.container}>
      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={listEmptyComponent}
        contentContainerStyle={styles.flatListContentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
      />
    </View>
  );
};

export default VendorHomeScreen;
