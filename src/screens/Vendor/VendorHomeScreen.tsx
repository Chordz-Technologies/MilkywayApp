
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';


// Import the specific API function you need
import { allCustomerList } from '../../apiServices/allApi'; // Adjust the path to your apiService.js file


// =====================================================================
// 1. Type Definitions
// =====================================================================


type VendorHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VendorHome'>;


type VendorData = {
  name: string;
  location: string;
  rating: number;
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
// 2. Dummy Data (Used because APIs are missing for this info)
// =====================================================================


const mockCustomerList: Customer[] = [
  { id: '1', name: 'User1', address: '123 Main St, Pune', status: 'Paid', phone: '9876543210' },
  { id: '2', name: 'User2', address: '456 Oak Ave, Mumbai', status: 'Pending', phone: '8765432109' },
  { id: '3', name: 'User3', address: '789 Pine Rd, Bangalore', status: 'Paid', phone: '7654321098' },
  { id: '4', name: 'User4', address: '101 Maple Ln, Delhi', status: 'Pending', phone: '6543210987' },
  { id: '5', name: 'User5', address: '202 Birch Ct, Chennai', status: 'Paid', phone: '5432109876' },
  { id: '6', name: 'User6', address: '303 Cedar Dr, Kolkata', status: 'Pending', phone: '4321098765' },
  { id: '7', name: 'User7', address: '404 Spruce St, Hyderabad', status: 'Paid', phone: '3210987654' },
];


const mockVendorData: Omit<VendorData, 'totalMilkmans'> = {
  name: 'Shankar Milk Vendor',
  location: 'Pune, Maharashtra',
  rating: 4.7,
  totalCustomers: mockCustomerList.length,
  defaulters: mockCustomerList.filter(c => c.status === 'Pending').length,
  paidCustomers: mockCustomerList.filter(c => c.status === 'Paid').length,
};


// =====================================================================
// 3. Component Definition
// =====================================================================


const VendorHomeScreen = () => {
  const navigation = useNavigation<VendorHomeNavigationProp>();
  const [search, setSearch] = useState('');


  // State variables for API data and hardcoded data
  const [vendorData, setVendorData] = useState<VendorData>({
    ...mockVendorData,
    totalMilkmans: 0, // Initial value
  });
  const [customers] = useState<Customer[]>(mockCustomerList); // Hardcoded
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // useEffect to fetch data when the component mounts
  useEffect(() => {
    const fetchMilkmanData = async () => {
      setIsLoading(true);
      try {
        const payload = {};
        const response = await allCustomerList(payload);


        // Add a log here to see the full response
        console.log('API Response for allCustomerList:', response.data);


        const customerCount = response.data?.total_milkmans || 0;


        // Add a log to see the extracted count
        console.log('Extracted Customer Count:', customerCount);
        setVendorData(prevData => ({
          ...prevData,
          totalMilkmans: customerCount,
        }));


        setError(null);
      } catch (err: any) {
        console.error('Axios Error:', err);
        if (err.response) {
          setError(`API Error: ${err.response.status} - ${err.response.data?.detail || 'Unknown error'}`);
        } else if (err.request) {
          setError('Network Error: Could not connect to the server.');
        } else {
          setError(`Request Error: ${err.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };


    fetchMilkmanData();


  }, []); // Empty dependency array ensures this runs only once


  const filteredCustomers = customers.filter(
    c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase())
  );


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


  const renderHeader = () => {
    return (
      <>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Home</Text>
          <TouchableOpacity onPress={() => console.log('Notifications pressed')}>
            <Ionicons name="notifications-outline" size={26} color="#007AFF" />
          </TouchableOpacity>
        </View>


        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
            style={styles.avatarLarge}
          />
          <View style={styles.profileInfoWrapper}>
            <Text style={styles.profileName}>{vendorData.name}</Text>
            <Text style={styles.profileLocation}>{vendorData.location}</Text>
            <View style={styles.profileRatingRow}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.profileRating}>{vendorData.rating}</Text>
            </View>
          </View>
          {/* Removed Edit Button - Vendor has view-only access */}
          {/* <Ionicons name="create-outline" size={18} color="#C0C0C0" /> */}
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
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFA500" style={{ marginTop: 4 }} />
          ) : error ? (
            <Text style={styles.errorTextSmall}>N/A</Text>
          ) : (
            <Text style={styles.statsValue}>{vendorData.totalMilkmans}</Text>
          )}
        </TouchableOpacity>


        {/* Customer List Section */}
        <Text style={styles.sectionTitle}>Customer List</Text>
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
  };


  return (
    <View style={styles.container}>
      <FlatList
        data={filteredCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() => (
          <View style={styles.customerListCard}>
            <Text style={styles.noCustomerText}>No customers found.</Text>
          </View>
        )}
        contentContainerStyle={styles.flatListContentContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};


// =====================================================================
// 4. Stylesheet
// =====================================================================


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatListContentContainer: {
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileCard: {
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileInfoWrapper: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  profileRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  profileRating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  editBtn: { // This style is now unused but kept for reference if needed in future
    padding: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statsBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
  },
  statsBoxShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsBoxWide: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  iconMarginBottom: {
    marginBottom: 8,
  },
  statsLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  errorTextSmall: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 16,
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  iconMarginRight: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  customerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  customerAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  customerPhone: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  customerStatus: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  statusPaid: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusPending: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  noCustomerText: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 16,
  },
  customerListCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default VendorHomeScreen;

