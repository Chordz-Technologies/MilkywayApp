
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//     View,
//     Text,
//     Image,
//     TextInput,
//     TouchableOpacity,
//     FlatList,
//     StyleSheet,
//     ActivityIndicator,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../../navigation/types';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getVendorDetailsById } from '../../apiServices/allApi'; // Adjust if it's in a different file

// // Import the specific API function you need
// import { allCustomerList } from '../../apiServices/allApi'; // Adjust the path to your apiService.js file


// // =====================================================================
// // 1. Type Definitions
// // =====================================================================


// type VendorHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VendorHome'>;


// type VendorData = {
//     name: string;
//     location: string;
//     totalCustomers: number;
//     defaulters: number;
//     paidCustomers: number;
//     totalMilkmans: number;
// };


// type Customer = {
//     id: string;
//     name: string;
//     address: string;
//     status: 'Paid' | 'Pending';
//     phone: string;
// };


// // =====================================================================
// // 2. Dummy Data (Used because APIs are missing for this info)
// // =====================================================================


// const mockCustomerList: Customer[] = [
//     { id: '1', name: 'User1', address: '123 Main St, Pune', status: 'Paid', phone: '9876543210' },
//     { id: '2', name: 'User2', address: '456 Oak Ave, Mumbai', status: 'Pending', phone: '8765432109' },
//     { id: '3', name: 'User3', address: '789 Pine Rd, Bangalore', status: 'Paid', phone: '7654321098' },
//     { id: '4', name: 'User4', address: '101 Maple Ln, Delhi', status: 'Pending', phone: '6543210987' },
//     { id: '5', name: 'User5', address: '202 Birch Ct, Chennai', status: 'Paid', phone: '5432109876' },
//     { id: '6', name: 'User6', address: '303 Cedar Dr, Kolkata', status: 'Pending', phone: '4321098765' },
//     { id: '7', name: 'User7', address: '404 Spruce St, Hyderabad', status: 'Paid', phone: '3210987654' },
// ];

// const mockVendorData: Omit<VendorData, 'totalMilkmans'> = {
//     name: '',
//     location: '',
//     totalCustomers: mockCustomerList.length,
//     defaulters: mockCustomerList.filter(c => c.status === 'Pending').length,
//     paidCustomers: mockCustomerList.filter(c => c.status === 'Paid').length,
// };


// // =====================================================================
// // 3. Component Definition
// // =====================================================================


// const VendorHomeScreen = () => {
//     const navigation = useNavigation<VendorHomeNavigationProp>();
//     const [search, setSearch] = useState('');


//     // State variables for API data and hardcoded data
//     const [vendorData, setVendorData] = useState<VendorData>({
//         ...mockVendorData,
//         totalMilkmans: 0, // Initial value
//     });
//     const [customers] = useState<Customer[]>(mockCustomerList); // Hardcoded
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);


//     // useEffect to fetch data when the component mounts
//     useEffect(() => {
//         const fetchVendorAndMilkmanData = async () => {
//             setIsLoading(true);
//             try {
//                 // Get vendor ID from AsyncStorage
//                 const vendorId = await AsyncStorage.getItem('userID');
//                 if (!vendorId) {
//                     throw new Error('Vendor ID not found in AsyncStorage.');
//                 }

//                 // Fetch vendor business data
//                 const vendorRes = await getVendorDetailsById(vendorId);
//                 const vendor = vendorRes.data;

//                 // Fetch total milkman count
//                 const milkmanRes = await allCustomerList({});
//                 const totalMilkmans = milkmanRes.data?.total_milkmans || 0;

//                 // Update state with real vendor data and derived customer info from mock list
//                 setVendorData({
//                     name: vendor.name || 'Unnamed Vendor',
//                     location: vendor.address || 'Unknown Location',
//                     totalCustomers: mockCustomerList.length,
//                     defaulters: mockCustomerList.filter(c => c.status === 'Pending').length,
//                     paidCustomers: mockCustomerList.filter(c => c.status === 'Paid').length,
//                     totalMilkmans: totalMilkmans,
//                 });

//                 setError(null);
//             } catch (err: any) {
//                 console.error('Error fetching vendor or milkman data:', err);
//                 if (err.response) {
//                     setError(`API Error: ${err.response.status} - ${err.response.data?.detail || 'Unknown error'}`);
//                 } else if (err.request) {
//                     setError('Network Error: Could not connect to the server.');
//                 } else {
//                     setError(`Request Error: ${err.message}`);
//                 }
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchVendorAndMilkmanData();
//     }, []);


//     const filteredCustomers = customers.filter(
//         c =>
//             c.name.toLowerCase().includes(search.toLowerCase()) ||
//             c.address.toLowerCase().includes(search.toLowerCase())
//     );


//     const renderCustomerItem = useCallback(({ item }: { item: Customer }) => (
//         <TouchableOpacity
//             style={styles.customerRow}
//             onPress={() => {
//                 navigation.navigate('CustomerDetail', {
//                     customerId: item.id,
//                     customerName: item.name,
//                 });
//             }}
//         >
//             <View style={styles.customerInfo}>
//                 <Text style={styles.customerName}>{item.name}</Text>
//                 <Text style={styles.customerAddress}>{item.address}</Text>
//                 <Text style={styles.customerPhone}>{item.phone}</Text>
//             </View>
//             <Text
//                 style={[
//                     styles.customerStatus,
//                     item.status === 'Paid' ? styles.statusPaid : styles.statusPending,
//                 ]}
//             >
//                 {item.status}
//             </Text>
//             <Ionicons name="chevron-forward" size={24} color="#C0C0C0" />
//         </TouchableOpacity>
//     ), [navigation]);


//     const renderHeader = () => {
//         return (
//             <>
//                 {/* Header */}
//                 <View style={styles.headerRow}>
//                     <Text style={styles.headerTitle}>Home</Text>
//                     <TouchableOpacity onPress={() => console.log('Notifications pressed')}>
//                         <Ionicons name="notifications-outline" size={26} color="#007AFF" />
//                     </TouchableOpacity>
//                 </View>


//                 {/* Profile Card */}
//                 <View style={styles.profileCard}>
//                     <Image
//                         source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
//                         style={styles.avatarLarge}
//                     />
//                     <View style={styles.profileInfoWrapper}>
//                         <Text style={styles.profileName}>{vendorData.name}</Text>
//                         <Text style={styles.profileLocation}>{vendorData.location}</Text>

//                     </View>
//                     {/* Removed Edit Button - Vendor has view-only access */}
//                     {/* <Ionicons name="create-outline" size={18} color="#C0C0C0" /> */}
//                 </View>


//                 {/* Stats Cards */}
//                 <View style={styles.statsRow}>
//                     <View style={[styles.statsBox, styles.statsBoxShadow]}>
//                         <Ionicons name="people" size={24} color="#007AFF" style={styles.iconMarginBottom} />
//                         <Text style={styles.statsLabel}>Total Customers</Text>
//                         <Text style={styles.statsValue}>{vendorData.totalCustomers}</Text>
//                     </View>
//                     <View style={[styles.statsBox, styles.statsBoxShadow]}>
//                         <Ionicons name="alert-circle" size={24} color="#FF6B6B" style={styles.iconMarginBottom} />
//                         <Text style={styles.statsLabel}>Payment Defaulters</Text>
//                         <Text style={styles.statsValue}>{vendorData.defaulters}</Text>
//                     </View>
//                 </View>
//                 <View style={[styles.statsBoxWide, styles.statsBoxShadow]}>
//                     <Ionicons name="checkmark-done-circle" size={24} color="#4CD964" style={styles.iconMarginBottom} />
//                     <Text style={styles.statsLabel}>Customers Paid Bills</Text>
//                     <Text style={styles.statsValue}>{vendorData.paidCustomers}</Text>
//                 </View>
//                 <TouchableOpacity
//                     style={[styles.statsBoxWide, styles.statsBoxShadow]}
//                     onPress={() => navigation.navigate('MilkmanList')}
//                 >
//                     <Ionicons name="bus-outline" size={24} color="#FFA500" style={styles.iconMarginBottom} />
//                     <Text style={styles.statsLabel}>Enrolled Milkmans</Text>
//                     {isLoading ? (
//                         <ActivityIndicator size="small" color="#FFA500" style={{ marginTop: 4 }} />
//                     ) : error ? (
//                         <Text style={styles.errorTextSmall}>N/A</Text>
//                     ) : (
//                         <Text style={styles.statsValue}>{vendorData.totalMilkmans}</Text>
//                     )}
//                 </TouchableOpacity>


//                 {/* Customer List Section */}
//                 <Text style={styles.sectionTitle}>Customer List</Text>
//                 <View style={styles.searchBox}>
//                     <Ionicons name="search" size={18} color="#888" style={styles.iconMarginRight} />
//                     <TextInput
//                         style={styles.searchInput}
//                         placeholder="Search customers"
//                         placeholderTextColor="#bbb"
//                         value={search}
//                         onChangeText={setSearch}
//                     />
//                 </View>
//             </>
//         );
//     };


//     return (
//         <View style={styles.container}>
//             <FlatList
//                 data={filteredCustomers}
//                 renderItem={renderCustomerItem}
//                 keyExtractor={item => item.id}
//                 ListHeaderComponent={renderHeader}
//                 ListEmptyComponent={() => (
//                     <View style={styles.customerListCard}>
//                         <Text style={styles.noCustomerText}>No customers found.</Text>
//                     </View>
//                 )}
//                 contentContainerStyle={styles.flatListContentContainer}
//                 showsVerticalScrollIndicator={false}
//             />
//         </View>
//     );
// };


// // =====================================================================
// // 4. Stylesheet
// // =====================================================================


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#fff',
//     },
//     flatListContentContainer: {
//         paddingBottom: 24,
//     },
//     headerRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 16,
//         paddingTop: 50,
//     },
//     headerTitle: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     profileCard: {
//         marginBottom: 2,
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#f8f9fa',
//         borderRadius: 12,
//         padding: 16,
//         marginHorizontal: 16,
//         marginTop: 8,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//     },
//     avatarLarge: {
//         width: 80,
//         height: 80,
//         borderRadius: 40,
//         marginRight: 16,
//     },
//     profileInfoWrapper: {
//         flex: 1,
//     },
//     profileName: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     profileLocation: {
//         fontSize: 14,
//         color: '#666',
//         marginTop: 4,
//     },
//     profileRatingRow: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         marginTop: 4,
//     },
//     profileRating: {
//         fontSize: 14,
//         color: '#666',
//         marginLeft: 4,
//     },
//     editBtn: { // This style is now unused but kept for reference if needed in future
//         padding: 8,
//     },
//     statsRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         paddingHorizontal: 16,
//         marginBottom: 16,
//     },
//     statsBox: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         padding: 16,
//         width: '48%',
//         alignItems: 'center',
//     },
//     statsBoxShadow: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//     },
//     statsBoxWide: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         padding: 16,
//         marginHorizontal: 16,
//         marginBottom: 16,
//         alignItems: 'center',
//     },
//     iconMarginBottom: {
//         marginBottom: 8,
//     },
//     statsLabel: {
//         fontSize: 14,
//         color: '#666',
//         textAlign: 'center',
//     },
//     statsValue: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#333',
//         marginTop: 4,
//     },
//     errorTextSmall: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#FF6B6B',
//         marginTop: 4,
//     },
//     sectionTitle: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#333',
//         marginLeft: 16,
//         marginBottom: 12,
//     },
//     searchBox: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#f8f9fa',
//         borderRadius: 8,
//         paddingHorizontal: 16,
//         marginHorizontal: 16,
//         marginBottom: 16,
//     },
//     iconMarginRight: {
//         marginRight: 8,
//     },
//     searchInput: {
//         flex: 1,
//         height: 40,
//         color: '#333',
//     },
//     customerRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 12,
//         paddingHorizontal: 16,
//         backgroundColor: '#fff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#eee',
//     },
//     customerInfo: {
//         flex: 1,
//     },
//     customerName: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#333',
//     },
//     customerAddress: {
//         fontSize: 14,
//         color: '#666',
//         marginTop: 4,
//     },
//     customerPhone: {
//         fontSize: 13,
//         color: '#888',
//         marginTop: 2,
//     },
//     customerStatus: {
//         fontSize: 14,
//         fontWeight: '600',
//         paddingHorizontal: 8,
//         paddingVertical: 4,
//         borderRadius: 4,
//         marginRight: 8,
//     },
//     statusPaid: {
//         backgroundColor: '#d4edda',
//         color: '#155724',
//     },
//     statusPending: {
//         backgroundColor: '#f8d7da',
//         color: '#721c24',
//     },
//     noCustomerText: {
//         textAlign: 'center',
//         color: '#666',
//         paddingVertical: 16,
//     },
//     customerListCard: {
//         backgroundColor: '#fff',
//         borderRadius: 12,
//         padding: 16,
//         marginHorizontal: 16,
//         marginBottom: 24,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//     },
// });

// export default VendorHomeScreen;

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getVendorDetailsById,
  allCustomerList,
  getVendorPendingRequests,
  updateRequestStatus,
} from '../../apiServices/allApi';

type VendorHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'VendorHome'>;

type Customer = {
  id: string;
  name: string;
  address: string;
  status: 'Paid' | 'Pending';
  phone: string;
};

type VendorData = {
  name: string;
  location: string;
  totalCustomers: number;
  defaulters: number;
  paidCustomers: number;
  totalMilkmans: number;
};

type Request = {
  id: string;
  vendor_id: string;
  user_id: string;
  user_name?: string;
  user_role: 'customer' | 'milkman';
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
};

const VendorHomeScreen = () => {
  const navigation = useNavigation<VendorHomeNavigationProp>();
  const [search, setSearch] = useState('');
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRequests, setShowRequests] = useState(true);
  const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);

  // Ref for FlatList
  const flatListRef = useRef<FlatList>(null);
  // State for storing Y offset for Pending Requests section
  const [pendingRequestsOffsetY, setPendingRequestsOffsetY] = useState<number>(0);

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const vendorId = await AsyncStorage.getItem('userID');
      console.log('🔍 Vendor ID from AsyncStorage:', vendorId);

      if (!vendorId || vendorId === 'null' || vendorId === 'undefined') {
        throw new Error('Please log in again. Vendor ID not found.');
      }

      let vendor = null;
      let customerList: Customer[] = [];
      let totalMilkmans = 0;
      let requests: Request[] = [];

      try {
        console.log('📡 Calling getVendorDetailsById...');
        const vendorRes = await getVendorDetailsById(vendorId);
        console.log('✅ Vendor response:', vendorRes);
        vendor = vendorRes.data;
      } catch (vendorError: any) {
        console.error('❌ Vendor fetch error:', vendorError);
        if (vendorError.response?.status === 404) {
          throw new Error('Vendor account not found. Please contact support.');
        }
        throw new Error('Failed to load vendor profile.');
      }

      try {
        console.log('📡 Calling allCustomerList...');
        const customerRes = await allCustomerList({ vendorId });
        console.log('✅ Customer response:', customerRes);
        customerList = customerRes.data?.customers || [];
        totalMilkmans = customerRes.data?.total_milkmans || 0;
      } catch (customerError) {
        console.warn('⚠️ Could not fetch customers:', customerError);
      }

      try {
        console.log('📡 Calling getVendorPendingRequests...');
        const requestsRes = await getVendorPendingRequests(vendorId);
        console.log('✅ Requests response:', requestsRes);
        requests = requestsRes.data || [];
      } catch (requestError: any) {
        console.warn('⚠️ Could not fetch pending requests:', requestError);
        if (requestError.response?.data?.vendor) {
          console.warn('Vendor not found in requests system');
        }
        requests = [];
      }

      const totalCustomers = customerList.length;
      const defaulters = customerList.filter((c) => c.status === 'Pending').length;
      const paidCustomers = customerList.filter((c) => c.status === 'Paid').length;

      setVendorData({
        name: vendor?.name || 'Unnamed Vendor',
        location: vendor?.address || 'Unknown Location',
        totalCustomers,
        defaulters,
        paidCustomers,
        totalMilkmans,
      });
      setCustomers(customerList);
      setPendingRequests(requests);
    } catch (err: any) {
      console.error('❌ VendorHome fetch error:', err);
      console.error('❌ Error response:', err.response?.data);

      if (err.message.includes('Vendor ID not found')) {
        setError('Please log in again. Session expired.');
      } else if (err.message.includes('Vendor account not found')) {
        setError('Vendor account not found. Please contact support.');
      } else if (err.response?.data?.vendor) {
        setError('Vendor profile issue. Please contact support.');
      } else {
        setError(
          err.response
            ? `API Error: ${err.response.status}. Please try again.`
            : 'Network error. Please check your connection.'
        );
      }
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const handleRequestAction = async (
    requestId: string,
    action: 'accepted' | 'rejected',
    userRole: 'customer' | 'milkman'
  ) => {
    try {
      setProcessingRequestId(requestId);
      await updateRequestStatus(requestId, { status: action });

      const roleText = userRole === 'customer' ? 'Customer' : 'Distributor';
      Alert.alert('Success', `${roleText} request ${action === 'accepted' ? 'approved' : 'rejected'} successfully!`);

      await fetchData();
    } catch (err: any) {
      console.error('❌ Request action error:', err);
      Alert.alert('Error', `Failed to ${action === 'accepted' ? 'approve' : 'reject'} request. Please try again.`);
    } finally {
      setProcessingRequestId(null);
    }
  };

  // Logout Handler
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userID');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (e) {
              console.error('Failed to log out.', e);
              Alert.alert('Error', 'An error occurred while logging out.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Scroll to Pending Requests Section after expanding it
  const scrollToPendingRequests = () => {
    setShowRequests(true);
    // Delay for UI update after expanding section
    setTimeout(() => {
      if (flatListRef.current && pendingRequestsOffsetY !== 0) { 
        flatListRef.current.scrollToOffset({ offset: pendingRequestsOffsetY, animated: true });
      }
    }, 300);
  };

  // Render pending requests section (with onLayout to measure position)
  const renderPendingRequests = () => {
    if (pendingRequests.length === 0) {
      return null;
    }

    return (
      <View
        style={styles.requestsSection}
        onLayout={(event) => {
          const { y } = event.nativeEvent.layout;
          setPendingRequestsOffsetY(y);
        }}
      >
        <TouchableOpacity style={styles.requestsHeader} onPress={() => setShowRequests(!showRequests)}>
          <Text style={styles.requestsTitle}>Pending Requests ({pendingRequests.length})</Text>
          <Ionicons name={showRequests ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
        </TouchableOpacity>

        {showRequests && (
          <View style={styles.requestsList}>
            {pendingRequests.map((request) => (
              <View key={request.id} style={styles.requestItem}>
                <View style={styles.requestInfo}>
                  <Text style={styles.requestUserName}>
                    {request.user_name || `${request.user_role} ${request.user_id}`}
                  </Text>
                  <Text style={styles.requestRole}>
                    Role: {request.user_role === 'customer' ? 'Customer' : 'Distributor'}
                  </Text>
                  <Text style={styles.requestDate}>{new Date(request.created_at).toLocaleDateString()}</Text>
                </View>
                <View style={styles.requestActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleRequestAction(request.id, 'accepted', request.user_role)}
                    disabled={processingRequestId === request.id}
                  >
                    {processingRequestId === request.id ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.acceptButtonText}>Accept</Text>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleRequestAction(request.id, 'rejected', request.user_role)}
                    disabled={processingRequestId === request.id}
                  >
                    <Text style={styles.rejectButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  const filteredCustomers = customers.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.address.toLowerCase().includes(search.toLowerCase())
  );

  const renderCustomerItem = useCallback(
    ({ item }: { item: Customer }) => (
      <TouchableOpacity
        style={styles.customerRow}
        onPress={() => navigation.navigate('CustomerDetail', { customerId: item.id, customerName: item.name })}
      >
        <View style={styles.customerInfo}>
          <Text style={styles.customerName}>{item.name}</Text>
          <Text style={styles.customerAddress}>{item.address}</Text>
          <Text style={styles.customerPhone}>{item.phone}</Text>
        </View>
        <Text style={[styles.customerStatus, item.status === 'Paid' ? styles.statusPaid : styles.statusPending]}>
          {item.status}
        </Text>
        <Ionicons name="chevron-forward" size={24} color="#C0C0C0" />
      </TouchableOpacity>
    ),
    [navigation]
  );

  const renderHeader = () => {
    if (!vendorData) {
      return null;
    }

    return (
      <>
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Home</Text>
          <View style={styles.headerIcons}>
            {/* Notification Icon with count badge and scroll */}
            <TouchableOpacity onPress={scrollToPendingRequests}>
              <View>
                <Ionicons name="notifications-outline" size={26} color="#007AFF" />
                {pendingRequests.length > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>{pendingRequests.length}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            {/* Logout Icon */}
            <TouchableOpacity onPress={handleLogout} style={{ marginLeft: 16 }}>
              <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.profileCard}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }} style={styles.avatarLarge} />
          <View style={styles.profileInfoWrapper}>
            <Text style={styles.profileName}>{vendorData.name}</Text>
            <Text style={styles.profileLocation}>{vendorData.location}</Text>
          </View>
        </View>

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

        <TouchableOpacity style={[styles.statsBoxWide, styles.statsBoxShadow]} onPress={() => navigation.navigate('MilkmanList')}>
          <Ionicons name="bus-outline" size={24} color="#FFA500" style={styles.iconMarginBottom} />
          <Text style={styles.statsLabel}>Enrolled Milkmans</Text>
          <Text style={styles.statsValue}>{vendorData.totalMilkmans}</Text>
        </TouchableOpacity>

        {/* Pending Requests Section */}
        {renderPendingRequests()}

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
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        ref={flatListRef}
        data={filteredCustomers}
        renderItem={renderCustomerItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() => (
          <View style={styles.customerListCard}>
            {isLoading ? <ActivityIndicator size="large" color="#007AFF" /> : <Text style={styles.noCustomerText}>No customers found.</Text>}
          </View>
        )}
        contentContainerStyle={styles.flatListContentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  flatListContentContainer: { paddingBottom: 24 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
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
  avatarLarge: { width: 80, height: 80, borderRadius: 40, marginRight: 16 },
  profileInfoWrapper: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  profileLocation: { fontSize: 14, color: '#666', marginTop: 4 },
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
  iconMarginBottom: { marginBottom: 8 },
  statsLabel: { fontSize: 14, color: '#666', textAlign: 'center' },
  statsValue: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 4 },

  // Error Banner Styles
  errorBanner: {
    backgroundColor: '#fff0f0',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ffcccc',
  },
  errorText: {
    flex: 1,
    color: '#c00',
    fontSize: 14,
    fontWeight: '500',
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  retryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  // Notification Badge Styles
  notificationBadge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    paddingHorizontal: 2,
  },
  notificationBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Pending Requests Styles
  requestsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  requestsTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  requestsList: { padding: 16 },
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  requestInfo: { flex: 1 },
  requestUserName: { fontSize: 16, fontWeight: '600', color: '#333' },
  requestRole: { fontSize: 14, color: '#666', marginTop: 2 },
  requestDate: { fontSize: 12, color: '#999', marginTop: 2 },
  requestActions: { flexDirection: 'row', gap: 8 },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  acceptButton: { backgroundColor: '#4CD964' },
  rejectButton: { backgroundColor: '#FF6B6B' },
  acceptButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  rejectButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },

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
  iconMarginRight: { marginRight: 8 },
  searchInput: { flex: 1, height: 40, color: '#333' },
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
  customerInfo: { flex: 1 },
  customerName: { fontSize: 16, fontWeight: '600', color: '#333' },
  customerAddress: { fontSize: 14, color: '#666', marginTop: 4 },
  customerPhone: { fontSize: 13, color: '#888', marginTop: 2 },
  customerStatus: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  statusPaid: { backgroundColor: '#d4edda', color: '#155724' },
  statusPending: { backgroundColor: '#f8d7da', color: '#721c24' },
  noCustomerText: { textAlign: 'center', color: '#666', paddingVertical: 16 },
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
