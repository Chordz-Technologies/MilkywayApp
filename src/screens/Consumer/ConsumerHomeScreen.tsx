
// // // // // // import React, { useState, useCallback, useEffect } from 'react';
// // // // // // import {
// // // // // //   View,
// // // // // //   Text,
// // // // // //   TouchableOpacity,
// // // // // //   FlatList,
// // // // // //   StyleSheet,
// // // // // //   ActivityIndicator,
// // // // // //   Alert,
// // // // // //   RefreshControl,
// // // // // // } from 'react-native';
// // // // // // import Ionicons from 'react-native-vector-icons/Ionicons';
// // // // // // import { useNavigation } from '@react-navigation/native';
// // // // // // import { useSelector, useDispatch } from 'react-redux';
// // // // // // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // // import { RootState, AppDispatch } from '../../store';
// // // // // // import { logout } from '../../store/authSlice';
// // // // // // import { RootStackParamList } from '../../navigation/types';
// // // // // // import {
// // // // // //   getAllVendors,
// // // // // //   createRequest,
// // // // // // } from '../../apiServices/allApi';

// // // // // // type CustomerHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ConsumerHome'>;

// // // // // // type Vendor = {
// // // // // //   id: string;
// // // // // //   name: string;
// // // // // //   contact: string;
// // // // // //   address?: string;
// // // // // //   business_name?: string;
// // // // // //   location?: string;
// // // // // //   village?: string;
// // // // // //   cr?: number;
// // // // // //   br?: number;
// // // // // // };

// // // // // // const CustomerHomeScreen = () => {
// // // // // //   const navigation = useNavigation<CustomerHomeNavigationProp>();
// // // // // //   const dispatch = useDispatch<AppDispatch>();

// // // // // //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

// // // // // //   const [vendors, setVendors] = useState<Vendor[]>([]);
// // // // // //   const [requestedVendors, setRequestedVendors] = useState<string[]>([]);
// // // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // // //   const [refreshing, setRefreshing] = useState(false);
// // // // // //   const [submittingId, setSubmittingId] = useState<string | null>(null);
// // // // // //   const [error, setError] = useState<string | null>(null);

// // // // // //   const fetchData = useCallback(async () => {
// // // // // //     setError(null);
// // // // // //     setIsLoading(true);
// // // // // //     try {
// // // // // //       if (!user?.userID) {throw new Error('Customer ID not found. Please log in again.');}

// // // // // //       console.log('Fetching vendors...');
// // // // // //       const vendorRes = await getAllVendors();
// // // // // //       console.log('Vendors API raw response:', vendorRes);

// // // // // //       const vendorList = vendorRes?.data?.data || vendorRes?.data || [];

// // // // // //       console.log('Parsed vendor list:', vendorList);

// // // // // //       if (!Array.isArray(vendorList)) {
// // // // // //         setVendors([]);
// // // // // //       } else {
// // // // // //         setVendors(vendorList);
// // // // // //       }
// // // // // //     } catch (err: any) {
// // // // // //       console.log('Fetch vendors error:', err);
// // // // // //       setError(err.message || 'Failed to load vendors.');
// // // // // //     } finally {
// // // // // //       setIsLoading(false);
// // // // // //       setRefreshing(false);
// // // // // //     }
// // // // // //   }, [user?.userID]);

// // // // // //   const onRefresh = useCallback(() => {
// // // // // //     setRefreshing(true);
// // // // // //     fetchData();
// // // // // //   }, [fetchData]);

// // // // // //   const sendRequest = useCallback(async (vendorId: string) => {
// // // // // //     try {
// // // // // //       setSubmittingId(vendorId);

// // // // // //       if (!user?.userID) {
// // // // // //         const errorMsg = 'Customer ID not found. Please log in again.';
// // // // // //         console.log(errorMsg);
// // // // // //         throw new Error(errorMsg);
// // // // // //       }

// // // // // //       const payload = {
// // // // // //         user_id: parseInt(user.userID.toString(), 10),
// // // // // //         user_type: 'customer',
// // // // // //         vendor: parseInt(vendorId, 10),
// // // // // //       };

// // // // // //       console.log('Sending request with payload:', payload);

// // // // // //       const response = await createRequest(payload);

// // // // // //       console.log('Request creation response:', response);

// // // // // //       Alert.alert('Success', 'Request sent to vendor!');
// // // // // //       setRequestedVendors(prev => [...prev, vendorId]);
// // // // // //     } catch (err: any) {
// // // // // //       console.log('Error detail:', err);
// // // // // //       const errorMessage =
// // // // // //         err.response?.data?.detail ||
// // // // // //         err.response?.data?.message ||
// // // // // //         err.message ||
// // // // // //         'Failed to send request.';
// // // // // //       console.log('Final error message shown to user:', errorMessage);
// // // // // //       Alert.alert('Error', errorMessage);
// // // // // //     } finally {
// // // // // //       setSubmittingId(null);
// // // // // //     }
// // // // // //   }, [user?.userID]);

// // // // // //   const handleLogout = useCallback(() => {
// // // // // //     Alert.alert(
// // // // // //       'Logout',
// // // // // //       'Are you sure you want to log out?',
// // // // // //       [
// // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // //         {
// // // // // //           text: 'Logout',
// // // // // //           style: 'destructive',
// // // // // //           onPress: async () => {
// // // // // //             try {
// // // // // //               await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
// // // // // //               dispatch(logout());
// // // // // //               navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
// // // // // //             } catch (err) {
// // // // // //               console.error('Logout error:', err);
// // // // // //             }
// // // // // //           },
// // // // // //         },
// // // // // //       ],
// // // // // //       { cancelable: true }
// // // // // //     );
// // // // // //   }, [dispatch, navigation]);

// // // // // //   const renderVendor = useCallback(({ item }: { item: Vendor }) => {
// // // // // //     const isRequested = requestedVendors.includes(item.id);
// // // // // //     const isSubmitting = submittingId === item.id;

// // // // // //     const vendorName = item.name || item.business_name || 'Unnamed Vendor';

// // // // // //     const village = item.village || 'No village provided';

// // // // // //     console.log('Rendering vendor:', item.id, item.name, 'Cow Milk Rate:', item.cr, 'Buffalo Milk Rate:', item.br);

// // // // // //     return (
// // // // // //       <View style={styles.card}>
// // // // // //         <View style={styles.info}>
// // // // // //           <Text style={styles.name}>{vendorName}</Text>

// // // // // //           <View style={styles.contactRow}>
// // // // // //             <Ionicons name="call-outline" size={16} color="#666" />
// // // // // //             <Text style={styles.contact}>{item.contact}</Text>
// // // // // //           </View>

// // // // // //           <View style={styles.addressRow}>
// // // // // //             <Ionicons name="location-outline" size={16} color="#666" />
// // // // // //             <Text style={styles.address}>{village}</Text>
// // // // // //           </View>

// // // // // //           <Text style={styles.rateText}>
// // // // // //             Cow Milk Rate: {item.cr !== undefined && item.cr !== null ? `₹${item.cr}/L` : 'N/A'}
// // // // // //           </Text>
// // // // // //           <Text style={styles.rateText}>
// // // // // //             Buffalo Milk Rate: {item.br !== undefined && item.br !== null ? `₹${item.br}/L` : 'N/A'}
// // // // // //           </Text>
// // // // // //         </View>

// // // // // //         <TouchableOpacity
// // // // // //           style={[styles.button, (isRequested || isSubmitting) && styles.buttonDisabled]}
// // // // // //           onPress={() => !isRequested && !isSubmitting && sendRequest(item.id)}
// // // // // //           disabled={isRequested || isSubmitting}
// // // // // //         >
// // // // // //           {isSubmitting ? (
// // // // // //             <ActivityIndicator size="small" color="#fff" />
// // // // // //           ) : (
// // // // // //             <Text style={styles.buttonText}>
// // // // // //               {isRequested ? 'Requested' : 'Join Vendor'}
// // // // // //             </Text>
// // // // // //           )}
// // // // // //         </TouchableOpacity>
// // // // // //       </View>
// // // // // //     );
// // // // // //   }, [requestedVendors, submittingId, sendRequest]);

// // // // // //   useEffect(() => {
// // // // // //     fetchData();
// // // // // //   }, [fetchData]);

// // // // // //   if (!isAuthenticated || !user?.userID) {
// // // // // //     return (
// // // // // //       <View style={[styles.container, styles.centered]}>
// // // // // //         <ActivityIndicator size="large" color="#007AFF" />
// // // // // //         <Text style={{ marginTop: 10, color: '#666' }}>
// // // // // //           Loading user information...
// // // // // //         </Text>
// // // // // //       </View>
// // // // // //     );
// // // // // //   }

// // // // // //   return (
// // // // // //     <View style={styles.container}>
// // // // // //       <View style={styles.header}>
// // // // // //         <Text style={styles.title}>Available Vendors</Text>
// // // // // //         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
// // // // // //           <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
// // // // // //         </TouchableOpacity>
// // // // // //       </View>

// // // // // //       {error && (
// // // // // //         <View style={styles.errorBanner}>
// // // // // //           <Text style={styles.errorText}>{error}</Text>
// // // // // //           <TouchableOpacity onPress={fetchData} style={styles.retry}>
// // // // // //             <Text style={styles.retryText}>Retry</Text>
// // // // // //           </TouchableOpacity>
// // // // // //         </View>
// // // // // //       )}

// // // // // //       <FlatList
// // // // // //         data={vendors}
// // // // // //         renderItem={renderVendor}
// // // // // //         keyExtractor={(item) => item.id.toString()}
// // // // // //         contentContainerStyle={styles.listContent}
// // // // // //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// // // // // //         ListEmptyComponent={() => (
// // // // // //           <View style={styles.emptyContainer}>
// // // // // //             {isLoading ? (
// // // // // //               <>
// // // // // //                 <ActivityIndicator size="large" color="#007AFF" />
// // // // // //                 <Text style={{ marginTop: 10, color: '#666' }}>Loading vendors...</Text>
// // // // // //               </>
// // // // // //             ) : (
// // // // // //               <>
// // // // // //                 <Ionicons name="storefront-outline" size={64} color="#ccc" />
// // // // // //                 <Text style={styles.emptyText}>No vendors available.</Text>
// // // // // //               </>
// // // // // //             )}
// // // // // //           </View>
// // // // // //         )}
// // // // // //         showsVerticalScrollIndicator={false}
// // // // // //       />
// // // // // //     </View>
// // // // // //   );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: { flex: 1, backgroundColor: '#f8f9fa' },
// // // // // //   centered: { justifyContent: 'center', alignItems: 'center' },
// // // // // //   header: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'space-between',
// // // // // //     padding: 16,
// // // // // //     paddingTop: 50,
// // // // // //     backgroundColor: '#fff',
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#eee',
// // // // // //   },
// // // // // //   title: { fontSize: 20, fontWeight: 'bold', color: '#333', flex: 1 },
// // // // // //   logoutButton: { padding: 4 },
// // // // // //   errorBanner: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#fff0f0',
// // // // // //     padding: 12,
// // // // // //     justifyContent: 'space-between',
// // // // // //   },
// // // // // //   errorText: { color: '#c00', fontSize: 14, flex: 1 },
// // // // // //   retry: { backgroundColor: '#007AFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
// // // // // //   retryText: { color: '#fff', fontSize: 12 },
// // // // // //   listContent: { paddingBottom: 16 },
// // // // // //   card: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#fff',
// // // // // //     borderRadius: 12,
// // // // // //     padding: 16,
// // // // // //     marginHorizontal: 16,
// // // // // //     marginTop: 12,
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // //     shadowOpacity: 0.1,
// // // // // //     shadowRadius: 4,
// // // // // //     elevation: 3,
// // // // // //   },
// // // // // //   info: { flex: 1 },
// // // // // //   name: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
// // // // // //   contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
// // // // // //   contact: { fontSize: 14, color: '#666', marginLeft: 8 },
// // // // // //   addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
// // // // // //   address: { fontSize: 14, color: '#666', marginLeft: 8 },
// // // // // //   rateText: { fontSize: 14, color: '#704214', marginTop: 2 },
// // // // // //   button: {
// // // // // //     backgroundColor: '#007AFF',
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 8,
// // // // // //     borderRadius: 8,
// // // // // //     minWidth: 120,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   buttonDisabled: { backgroundColor: '#C0C0C0' },
// // // // // //   buttonText: { color: '#fff', fontWeight: '600' },
// // // // // //   emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
// // // // // //   emptyText: { color: '#666', fontSize: 18, textAlign: 'center', marginTop: 16 },
// // // // // // });

// // // // // // export default CustomerHomeScreen;
// // // // // import React, { useState, useCallback, useEffect } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   TouchableOpacity,
// // // // //   FlatList,
// // // // //   StyleSheet,
// // // // //   ActivityIndicator,
// // // // //   Alert,
// // // // //   RefreshControl,
// // // // //   TextInput,
// // // // // } from 'react-native';
// // // // // import Ionicons from 'react-native-vector-icons/Ionicons';
// // // // // import { useNavigation } from '@react-navigation/native';
// // // // // import { useSelector, useDispatch } from 'react-redux';
// // // // // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // import { RootState, AppDispatch } from '../../store';
// // // // // import { logout } from '../../store/authSlice';
// // // // // import { RootStackParamList } from '../../navigation/types';
// // // // // import {
// // // // //   getAllVendors,
// // // // //   createRequest,
// // // // // } from '../../apiServices/allApi';

// // // // // type CustomerHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ConsumerHome'>;

// // // // // type Vendor = {
// // // // //   id: string;
// // // // //   name: string;
// // // // //   contact: string;
// // // // //   address?: string;
// // // // //   business_name?: string;
// // // // //   location?: string;
// // // // //   village?: string;
// // // // //   pincode?: string;
// // // // //   cr?: number;
// // // // //   br?: number;
// // // // // };

// // // // // const CustomerHomeScreen = () => {
// // // // //   const navigation = useNavigation<CustomerHomeNavigationProp>();
// // // // //   const dispatch = useDispatch<AppDispatch>();

// // // // //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

// // // // //   const [vendors, setVendors] = useState<Vendor[]>([]);
// // // // //   const [requestedVendors, setRequestedVendors] = useState<string[]>([]);
// // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // //   const [refreshing, setRefreshing] = useState(false);
// // // // //   const [submittingId, setSubmittingId] = useState<string | null>(null);
// // // // //   const [error, setError] = useState<string | null>(null);

// // // // //   // Pincode filtering states
// // // // //   const [pincode, setPincode] = useState('');
// // // // //   const [showPincodeFilter, setShowPincodeFilter] = useState(false);
// // // // //   const [isFilterLoading, setIsFilterLoading] = useState(false);

// // // // //   const fetchData = useCallback(async (filterPincode?: string) => {
// // // // //     setError(null);
// // // // //     if (!filterPincode) {
// // // // //       setIsLoading(true);
// // // // //     } else {
// // // // //       setIsFilterLoading(true);
// // // // //     }

// // // // //     try {
// // // // //       if (!user?.userID) {
// // // // //         throw new Error('Customer ID not found. Please log in again.');
// // // // //       }

// // // // //       console.log('Fetching vendors with pincode:', filterPincode || 'all');
// // // // //       const vendorRes = await getAllVendors(filterPincode);
// // // // //       console.log('Vendors API raw response:', vendorRes);

// // // // //       const vendorList = vendorRes?.data?.data || vendorRes?.data || [];
// // // // //       console.log('Parsed vendor list:', vendorList);

// // // // //       if (!Array.isArray(vendorList)) {
// // // // //         setVendors([]);
// // // // //       } else {
// // // // //         setVendors(vendorList);
// // // // //       }
// // // // //     } catch (err: any) {
// // // // //       console.log('Fetch vendors error:', err);
// // // // //       setError(err.message || 'Failed to load vendors.');
// // // // //     } finally {
// // // // //       setIsLoading(false);
// // // // //       setRefreshing(false);
// // // // //       setIsFilterLoading(false);
// // // // //     }
// // // // //   }, [user?.userID]);

// // // // //   const onRefresh = useCallback(() => {
// // // // //     setRefreshing(true);
// // // // //     fetchData(pincode || undefined);
// // // // //   }, [fetchData, pincode]);

// // // // //   const handlePincodeFilter = useCallback(() => {
// // // // //     if (pincode.trim() && pincode.length === 6) {
// // // // //       fetchData(pincode.trim());
// // // // //     } else if (pincode.trim() === '') {
// // // // //       fetchData(); // Fetch all vendors
// // // // //     } else {
// // // // //       Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pincode');
// // // // //     }
// // // // //   }, [pincode, fetchData]);

// // // // //   const clearPincodeFilter = useCallback(() => {
// // // // //     setPincode('');
// // // // //     fetchData(); // Fetch all vendors
// // // // //   }, [fetchData]);

// // // // //   const sendRequest = useCallback(async (vendorId: string) => {
// // // // //     try {
// // // // //       setSubmittingId(vendorId);

// // // // //       if (!user?.userID) {
// // // // //         const errorMsg = 'Customer ID not found. Please log in again.';
// // // // //         console.log(errorMsg);
// // // // //         throw new Error(errorMsg);
// // // // //       }

// // // // //       const payload = {
// // // // //         user_id: parseInt(user.userID.toString(), 10),
// // // // //         user_type: 'customer',
// // // // //         vendor: parseInt(vendorId, 10),
// // // // //       };

// // // // //       console.log('Sending request with payload:', payload);
// // // // //       const response = await createRequest(payload);
// // // // //       console.log('Request creation response:', response);

// // // // //       Alert.alert('Success', 'Request sent to vendor!');
// // // // //       setRequestedVendors(prev => [...prev, vendorId]);
// // // // //     } catch (err: any) {
// // // // //       console.log('Error detail:', err);
// // // // //       const errorMessage =
// // // // //         err.response?.data?.detail ||
// // // // //         err.response?.data?.message ||
// // // // //         err.message ||
// // // // //         'Failed to send request.';
// // // // //       console.log('Final error message shown to user:', errorMessage);
// // // // //       Alert.alert('Error', errorMessage);
// // // // //     } finally {
// // // // //       setSubmittingId(null);
// // // // //     }
// // // // //   }, [user?.userID]);

// // // // //   const handleLogout = useCallback(() => {
// // // // //     Alert.alert(
// // // // //       'Logout',
// // // // //       'Are you sure you want to log out?',
// // // // //       [
// // // // //         { text: 'Cancel', style: 'cancel' },
// // // // //         {
// // // // //           text: 'Logout',
// // // // //           style: 'destructive',
// // // // //           onPress: async () => {
// // // // //             try {
// // // // //               await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
// // // // //               dispatch(logout());
// // // // //               navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
// // // // //             } catch (err) {
// // // // //               console.error('Logout error:', err);
// // // // //             }
// // // // //           },
// // // // //         },
// // // // //       ],
// // // // //       { cancelable: true }
// // // // //     );
// // // // //   }, [dispatch, navigation]);

// // // // //   const renderVendor = useCallback(({ item }: { item: Vendor }) => {
// // // // //     const isRequested = requestedVendors.includes(item.id);
// // // // //     const isSubmitting = submittingId === item.id;

// // // // //     const vendorName = item.name || item.business_name || 'Unnamed Vendor';
// // // // //     const village = item.village || 'No village provided';
// // // // //     const vendorPincode = item.pincode ? `- ${item.pincode}` : '';

// // // // //     console.log('Rendering vendor:', item.id, item.name, 'Cow Milk Rate:', item.cr, 'Buffalo Milk Rate:', item.br);

// // // // //     return (
// // // // //       <View style={styles.card}>
// // // // //         <View style={styles.info}>
// // // // //           <Text style={styles.name}>{vendorName}</Text>

// // // // //           <View style={styles.contactRow}>
// // // // //             <Ionicons name="call-outline" size={16} color="#666" />
// // // // //             <Text style={styles.contact}>{item.contact}</Text>
// // // // //           </View>

// // // // //           <View style={styles.addressRow}>
// // // // //             <Ionicons name="location-outline" size={16} color="#666" />
// // // // //             <Text style={styles.address}>{village} {vendorPincode}</Text>
// // // // //           </View>

// // // // //           <Text style={styles.rateText}>
// // // // //             Cow Milk Rate: {item.cr !== undefined && item.cr !== null ? `₹${item.cr}/L` : 'N/A'}
// // // // //           </Text>
// // // // //           <Text style={styles.rateText}>
// // // // //             Buffalo Milk Rate: {item.br !== undefined && item.br !== null ? `₹${item.br}/L` : 'N/A'}
// // // // //           </Text>
// // // // //         </View>

// // // // //         <TouchableOpacity
// // // // //           style={[styles.button, (isRequested || isSubmitting) && styles.buttonDisabled]}
// // // // //           onPress={() => !isRequested && !isSubmitting && sendRequest(item.id)}
// // // // //           disabled={isRequested || isSubmitting}
// // // // //         >
// // // // //           {isSubmitting ? (
// // // // //             <ActivityIndicator size="small" color="#fff" />
// // // // //           ) : (
// // // // //             <Text style={styles.buttonText}>
// // // // //               {isRequested ? 'Requested' : 'Join Vendor'}
// // // // //             </Text>
// // // // //           )}
// // // // //         </TouchableOpacity>
// // // // //       </View>
// // // // //     );
// // // // //   }, [requestedVendors, submittingId, sendRequest]);

// // // // //   useEffect(() => {
// // // // //     fetchData();
// // // // //   }, [fetchData]);

// // // // //   if (!isAuthenticated || !user?.userID) {
// // // // //     return (
// // // // //       <View style={[styles.container, styles.centered]}>
// // // // //         <ActivityIndicator size="large" color="#007AFF" />
// // // // //         <Text style={{ marginTop: 10, color: '#666' }}>
// // // // //           Loading user information...
// // // // //         </Text>
// // // // //       </View>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       <View style={styles.header}>
// // // // //         <View style={styles.headerLeft}>
// // // // //           <Text style={styles.title}>Available Vendors</Text>
// // // // //           <TouchableOpacity
// // // // //             onPress={() => setShowPincodeFilter(!showPincodeFilter)}
// // // // //             style={styles.filterToggle}
// // // // //           >
// // // // //             <Ionicons
// // // // //               name={showPincodeFilter ? "chevron-up-outline" : "filter-outline"}
// // // // //               size={24}
// // // // //               color="#007AFF"
// // // // //             />
// // // // //           </TouchableOpacity>
// // // // //         </View>
// // // // //         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
// // // // //           <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
// // // // //         </TouchableOpacity>
// // // // //       </View>

// // // // //       {/* Pincode Filter Section */}
// // // // //       {showPincodeFilter && (
// // // // //         <View style={styles.filterContainer}>
// // // // //           <View style={styles.pincodeInputContainer}>
// // // // //             <TextInput
// // // // //               style={styles.pincodeInput}
// // // // //               placeholder="Enter pincode (6 digits)"
// // // // //               value={pincode}
// // // // //               onChangeText={setPincode}
// // // // //               keyboardType="numeric"
// // // // //               maxLength={6}
// // // // //               placeholderTextColor="#999"
// // // // //             />
// // // // //             <TouchableOpacity
// // // // //               style={[styles.filterButton, isFilterLoading && styles.filterButtonDisabled]}
// // // // //               onPress={handlePincodeFilter}
// // // // //               disabled={isFilterLoading}
// // // // //             >
// // // // //               {isFilterLoading ? (
// // // // //                 <ActivityIndicator size="small" color="#fff" />
// // // // //               ) : (
// // // // //                 <Ionicons name="search-outline" size={20} color="#fff" />
// // // // //               )}
// // // // //             </TouchableOpacity>
// // // // //             {pincode.length > 0 && (
// // // // //               <TouchableOpacity style={styles.clearButton} onPress={clearPincodeFilter}>
// // // // //                 <Ionicons name="close-outline" size={20} color="#666" />
// // // // //               </TouchableOpacity>
// // // // //             )}
// // // // //           </View>
// // // // //           {pincode && (
// // // // //             <Text style={styles.filterStatus}>
// // // // //               {vendors.length > 0
// // // // //                 ? `Found ${vendors.length} vendor(s) in ${pincode}`
// // // // //                 : `No vendors found in ${pincode}`
// // // // //               }
// // // // //             </Text>
// // // // //           )}
// // // // //         </View>
// // // // //       )}

// // // // //       {error && (
// // // // //         <View style={styles.errorBanner}>
// // // // //           <Text style={styles.errorText}>{error}</Text>
// // // // //           <TouchableOpacity onPress={() => fetchData(pincode || undefined)} style={styles.retry}>
// // // // //             <Text style={styles.retryText}>Retry</Text>
// // // // //           </TouchableOpacity>
// // // // //         </View>
// // // // //       )}

// // // // //       <FlatList
// // // // //         data={vendors}
// // // // //         renderItem={renderVendor}
// // // // //         keyExtractor={(item) => item.id.toString()}
// // // // //         contentContainerStyle={styles.listContent}
// // // // //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// // // // //         ListEmptyComponent={() => (
// // // // //           <View style={styles.emptyContainer}>
// // // // //             {isLoading ? (
// // // // //               <>
// // // // //                 <ActivityIndicator size="large" color="#007AFF" />
// // // // //                 <Text style={{ marginTop: 10, color: '#666' }}>Loading vendors...</Text>
// // // // //               </>
// // // // //             ) : (
// // // // //               <>
// // // // //                 <Ionicons name="storefront-outline" size={64} color="#ccc" />
// // // // //                 <Text style={styles.emptyText}>
// // // // //                   {pincode
// // // // //                     ? `No vendors available in ${pincode}`
// // // // //                     : 'No vendors available'
// // // // //                   }
// // // // //                 </Text>
// // // // //                 {pincode && (
// // // // //                   <TouchableOpacity style={styles.showAllButton} onPress={clearPincodeFilter}>
// // // // //                     <Text style={styles.showAllText}>Show All Vendors</Text>
// // // // //                   </TouchableOpacity>
// // // // //                 )}
// // // // //               </>
// // // // //             )}
// // // // //           </View>
// // // // //         )}
// // // // //         showsVerticalScrollIndicator={false}
// // // // //       />
// // // // //     </View>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: { flex: 1, backgroundColor: '#f8f9fa' },
// // // // //   centered: { justifyContent: 'center', alignItems: 'center' },
// // // // //   header: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'space-between',
// // // // //     padding: 16,
// // // // //     paddingTop: 50,
// // // // //     backgroundColor: '#fff',
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#eee',
// // // // //   },
// // // // //   headerLeft: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     flex: 1,
// // // // //   },
// // // // //   title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginRight: 12 },
// // // // //   filterToggle: {
// // // // //     padding: 4,
// // // // //   },
// // // // //   logoutButton: { padding: 4 },

// // // // //   // Filter styles
// // // // //   filterContainer: {
// // // // //     backgroundColor: '#fff',
// // // // //     padding: 16,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#eee',
// // // // //   },
// // // // //   pincodeInputContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 8,
// // // // //   },
// // // // //   pincodeInput: {
// // // // //     flex: 1,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#ddd',
// // // // //     borderRadius: 8,
// // // // //     paddingHorizontal: 12,
// // // // //     paddingVertical: 10,
// // // // //     fontSize: 16,
// // // // //     backgroundColor: '#fafafa',
// // // // //   },
// // // // //   filterButton: {
// // // // //     backgroundColor: '#007AFF',
// // // // //     borderRadius: 8,
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 10,
// // // // //     marginLeft: 8,
// // // // //     minWidth: 50,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   filterButtonDisabled: {
// // // // //     backgroundColor: '#ccc',
// // // // //   },
// // // // //   clearButton: {
// // // // //     padding: 8,
// // // // //     marginLeft: 4,
// // // // //   },
// // // // //   filterStatus: {
// // // // //     fontSize: 14,
// // // // //     color: '#666',
// // // // //     fontStyle: 'italic',
// // // // //   },

// // // // //   errorBanner: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#fff0f0',
// // // // //     padding: 12,
// // // // //     justifyContent: 'space-between',
// // // // //   },
// // // // //   errorText: { color: '#c00', fontSize: 14, flex: 1 },
// // // // //   retry: { backgroundColor: '#007AFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
// // // // //   retryText: { color: '#fff', fontSize: 12 },
// // // // //   listContent: { paddingBottom: 16 },
// // // // //   card: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#fff',
// // // // //     borderRadius: 12,
// // // // //     padding: 16,
// // // // //     marginHorizontal: 16,
// // // // //     marginTop: 12,
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.1,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 3,
// // // // //   },
// // // // //   info: { flex: 1 },
// // // // //   name: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
// // // // //   contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
// // // // //   contact: { fontSize: 14, color: '#666', marginLeft: 8 },
// // // // //   addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
// // // // //   address: { fontSize: 14, color: '#666', marginLeft: 8 },
// // // // //   rateText: { fontSize: 14, color: '#704214', marginTop: 2 },
// // // // //   button: {
// // // // //     backgroundColor: '#007AFF',
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 8,
// // // // //     borderRadius: 8,
// // // // //     minWidth: 120,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   buttonDisabled: { backgroundColor: '#C0C0C0' },
// // // // //   buttonText: { color: '#fff', fontWeight: '600' },
// // // // //   emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
// // // // //   emptyText: { color: '#666', fontSize: 18, textAlign: 'center', marginTop: 16 },
// // // // //   showAllButton: {
// // // // //     marginTop: 16,
// // // // //     backgroundColor: '#007AFF',
// // // // //     paddingHorizontal: 20,
// // // // //     paddingVertical: 10,
// // // // //     borderRadius: 8,
// // // // //   },
// // // // //   showAllText: {
// // // // //     color: '#fff',
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // // });

// // // // // export default CustomerHomeScreen;
// // // // import React, { useState, useCallback, useEffect } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   TouchableOpacity,
// // // //   FlatList,
// // // //   StyleSheet,
// // // //   ActivityIndicator,
// // // //   Alert,
// // // //   RefreshControl,
// // // //   TextInput,
// // // // } from 'react-native';
// // // // import Ionicons from 'react-native-vector-icons/Ionicons';
// // // // import { useNavigation } from '@react-navigation/native';
// // // // import { useSelector, useDispatch } from 'react-redux';
// // // // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // import { RootState, AppDispatch } from '../../store';
// // // // import { logout } from '../../store/authSlice';
// // // // import { RootStackParamList } from '../../navigation/types';
// // // // import {
// // // //   getAllVendors,
// // // //   createRequest,
// // // //   getConsumerDetailsById,
// // // // } from '../../apiServices/allApi';

// // // // type CustomerHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ConsumerHome'>;

// // // // type Vendor = {
// // // //   id: string;
// // // //   name: string;
// // // //   contact: string;
// // // //   address?: string;
// // // //   business_name?: string;
// // // //   location?: string;
// // // //   village?: string;
// // // //   pincode?: string;
// // // //   cr?: number;
// // // //   br?: number;
// // // // };

// // // // const CustomerHomeScreen = () => {
// // // //   const navigation = useNavigation<CustomerHomeNavigationProp>();
// // // //   const dispatch = useDispatch<AppDispatch>();

// // // //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

// // // //   const [vendors, setVendors] = useState<Vendor[]>([]);
// // // //   const [requestedVendors, setRequestedVendors] = useState<string[]>([]);
// // // //   const [isLoading, setIsLoading] = useState(true);
// // // //   const [refreshing, setRefreshing] = useState(false);
// // // //   const [submittingId, setSubmittingId] = useState<string | null>(null);
// // // //   const [error, setError] = useState<string | null>(null);

// // // //   // User profile states
// // // //   const [userPincode, setUserPincode] = useState<string>('');
// // // //   const [showAllVendors, setShowAllVendors] = useState(false);

// // // //   // Manual filter states
// // // //   const [manualPincode, setManualPincode] = useState('');
// // // //   const [showManualFilter, setShowManualFilter] = useState(false);
// // // //   const [isFilterLoading, setIsFilterLoading] = useState(false);

// // // //   // Fetch user's profile to get their pincode
// // // //   const fetchUserProfile = useCallback(async () => {
// // // //     try {
// // // //       if (!user?.userID) return;

// // // //       const response = await getConsumerDetailsById(user.userID);
// // // //       const profileData = response?.data?.data || response?.data;

// // // //       if (profileData?.pincode) {
// // // //         setUserPincode(profileData.pincode);
// // // //         console.log('User pincode found:', profileData.pincode);
// // // //       } else {
// // // //         console.log('No pincode found in user profile');
// // // //         setShowAllVendors(true);
// // // //       }
// // // //     } catch (err) {
// // // //       console.log('Error fetching user profile:', err);
// // // //       setShowAllVendors(true);
// // // //     }
// // // //   }, [user?.userID]);

// // // //   // Memoized fetchData function
// // // //   const fetchData = useCallback(async (filterPincode?: string) => {
// // // //     setError(null);
// // // //     setIsLoading(true);

// // // //     try {
// // // //       if (!user?.userID) {
// // // //         throw new Error('Customer ID not found. Please log in again.');
// // // //       }

// // // //       // Determine which pincode to use for filtering
// // // //       let pincodeToFilter = filterPincode;
// // // //       if (!pincodeToFilter && !showAllVendors && userPincode) {
// // // //         pincodeToFilter = userPincode;
// // // //       }

// // // //       console.log('Fetching vendors with pincode:', pincodeToFilter || 'all');
// // // //       const vendorRes = await getAllVendors(pincodeToFilter);
// // // //       console.log('Vendors API raw response:', vendorRes);

// // // //       const vendorList = vendorRes?.data?.data || vendorRes?.data || [];
// // // //       console.log('Parsed vendor list:', vendorList);

// // // //       if (!Array.isArray(vendorList)) {
// // // //         setVendors([]);
// // // //       } else {
// // // //         setVendors(vendorList);
// // // //       }
// // // //     } catch (err: any) {
// // // //       console.log('Fetch vendors error:', err);
// // // //       setError(err.message || 'Failed to load vendors.');
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //       setRefreshing(false);
// // // //       setIsFilterLoading(false);
// // // //     }
// // // //   }, [user?.userID, userPincode, showAllVendors]);

// // // //   const onRefresh = useCallback(() => {
// // // //     setRefreshing(true);
// // // //     const currentFilter = manualPincode || (showAllVendors ? undefined : userPincode);
// // // //     fetchData(currentFilter);
// // // //   }, [fetchData, manualPincode, showAllVendors, userPincode]);

// // // //   const handleManualFilter = useCallback(() => {
// // // //     if (manualPincode.trim() && manualPincode.length === 6) {
// // // //       setIsFilterLoading(true);
// // // //       fetchData(manualPincode.trim());
// // // //     } else if (manualPincode.trim() === '') {
// // // //       setIsFilterLoading(true);
// // // //       fetchData(showAllVendors ? undefined : userPincode);
// // // //     } else {
// // // //       Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pincode');
// // // //     }
// // // //   }, [manualPincode, fetchData, showAllVendors, userPincode]);

// // // //   const showAllVendorsHandler = useCallback(() => {
// // // //     setShowAllVendors(true);
// // // //     setManualPincode('');
// // // //     fetchData();
// // // //   }, [fetchData]);

// // // //   const showMyAreaVendors = useCallback(() => {
// // // //     if (userPincode) {
// // // //       setShowAllVendors(false);
// // // //       setManualPincode('');
// // // //       fetchData(userPincode);
// // // //     } else {
// // // //       Alert.alert('No Pincode', 'Please update your profile with your pincode first');
// // // //     }
// // // //   }, [fetchData, userPincode]);

// // // //   const clearManualFilter = useCallback(() => {
// // // //     setManualPincode('');
// // // //     setIsFilterLoading(true);
// // // //     fetchData(showAllVendors ? undefined : userPincode);
// // // //   }, [fetchData, showAllVendors, userPincode]);

// // // //   const sendRequest = useCallback(async (vendorId: string) => {
// // // //     try {
// // // //       setSubmittingId(vendorId);

// // // //       if (!user?.userID) {
// // // //         const errorMsg = 'Customer ID not found. Please log in again.';
// // // //         console.log(errorMsg);
// // // //         throw new Error(errorMsg);
// // // //       }

// // // //       const payload = {
// // // //         user_id: parseInt(user.userID.toString(), 10),
// // // //         user_type: 'customer',
// // // //         vendor: parseInt(vendorId, 10),
// // // //       };

// // // //       console.log('Sending request with payload:', payload);
// // // //       const response = await createRequest(payload);
// // // //       console.log('Request creation response:', response);

// // // //       Alert.alert('Success', 'Request sent to vendor!');
// // // //       setRequestedVendors(prev => [...prev, vendorId]);
// // // //     } catch (err: any) {
// // // //       console.log('Error detail:', err);
// // // //       const errorMessage =
// // // //         err.response?.data?.detail ||
// // // //         err.response?.data?.message ||
// // // //         err.message ||
// // // //         'Failed to send request.';
// // // //       console.log('Final error message shown to user:', errorMessage);
// // // //       Alert.alert('Error', errorMessage);
// // // //     } finally {
// // // //       setSubmittingId(null);
// // // //     }
// // // //   }, [user?.userID]);

// // // //   const handleLogout = useCallback(() => {
// // // //     Alert.alert(
// // // //       'Logout',
// // // //       'Are you sure you want to log out?',
// // // //       [
// // // //         { text: 'Cancel', style: 'cancel' },
// // // //         {
// // // //           text: 'Logout',
// // // //           style: 'destructive',
// // // //           onPress: async () => {
// // // //             try {
// // // //               await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
// // // //               dispatch(logout());
// // // //               navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
// // // //             } catch (err) {
// // // //               console.error('Logout error:', err);
// // // //             }
// // // //           },
// // // //         },
// // // //       ],
// // // //       { cancelable: true }
// // // //     );
// // // //   }, [dispatch, navigation]);

// // // //   const renderVendor = useCallback(({ item }: { item: Vendor }) => {
// // // //     const isRequested = requestedVendors.includes(item.id);
// // // //     const isSubmitting = submittingId === item.id;

// // // //     const vendorName = item.name || item.business_name || 'Unnamed Vendor';
// // // //     const village = item.village || 'No village provided';
// // // //     const vendorPincode = item.pincode ? `- ${item.pincode}` : '';

// // // //     return (
// // // //       <View style={styles.card}>
// // // //         <View style={styles.info}>
// // // //           <Text style={styles.name}>{vendorName}</Text>

// // // //           <View style={styles.contactRow}>
// // // //             <Ionicons name="call-outline" size={16} color="#666" />
// // // //             <Text style={styles.contact}>{item.contact}</Text>
// // // //           </View>

// // // //           <View style={styles.addressRow}>
// // // //             <Ionicons name="location-outline" size={16} color="#666" />
// // // //             <Text style={styles.address}>{village} {vendorPincode}</Text>
// // // //           </View>

// // // //           <Text style={styles.rateText}>
// // // //             Cow Milk Rate: {item.cr !== undefined && item.cr !== null ? `₹${item.cr}/L` : 'N/A'}
// // // //           </Text>
// // // //           <Text style={styles.rateText}>
// // // //             Buffalo Milk Rate: {item.br !== undefined && item.br !== null ? `₹${item.br}/L` : 'N/A'}
// // // //           </Text>
// // // //         </View>

// // // //         <TouchableOpacity
// // // //           style={[styles.button, (isRequested || isSubmitting) && styles.buttonDisabled]}
// // // //           onPress={() => !isRequested && !isSubmitting && sendRequest(item.id)}
// // // //           disabled={isRequested || isSubmitting}
// // // //         >
// // // //           {isSubmitting ? (
// // // //             <ActivityIndicator size="small" color="#fff" />
// // // //           ) : (
// // // //             <Text style={styles.buttonText}>
// // // //               {isRequested ? 'Requested' : 'Join Vendor'}
// // // //             </Text>
// // // //           )}
// // // //         </TouchableOpacity>
// // // //       </View>
// // // //     );
// // // //   }, [requestedVendors, submittingId, sendRequest]);

// // // //   // Initialize: fetch user profile then vendors
// // // //   useEffect(() => {
// // // //     fetchUserProfile();
// // // //   }, [fetchUserProfile]);

// // // //   // Fetch vendors after getting user pincode
// // // //   useEffect(() => {
// // // //     if (userPincode || showAllVendors) {
// // // //       fetchData();
// // // //     }
// // // //   }, [userPincode, showAllVendors, fetchData]);

// // // //   if (!isAuthenticated || !user?.userID) {
// // // //     return (
// // // //       <View style={[styles.container, styles.centered]}>
// // // //         <ActivityIndicator size="large" color="#007AFF" />
// // // //         <Text style={{ marginTop: 10, color: '#666' }}>
// // // //           Loading user information...
// // // //         </Text>
// // // //       </View>
// // // //     );
// // // //   }

// // // //   const currentFilterText = manualPincode
// // // //     ? `Filtered by: ${manualPincode}`
// // // //     : showAllVendors
// // // //       ? 'Showing all vendors'
// // // //       : userPincode
// // // //         ? `Your area: ${userPincode}`
// // // //         : 'No filter applied';

// // // //   return (
// // // //     <View style={styles.container}>
// // // //       <View style={styles.header}>
// // // //         <View style={styles.headerLeft}>
// // // //           <Text style={styles.title}>Available Vendors</Text>
// // // //           <TouchableOpacity
// // // //             onPress={() => setShowManualFilter(!showManualFilter)}
// // // //             style={styles.filterToggle}
// // // //           >
// // // //             <Ionicons
// // // //               name={showManualFilter ? "chevron-up-outline" : "filter-outline"}
// // // //               size={24}
// // // //               color="#007AFF"
// // // //             />
// // // //           </TouchableOpacity>
// // // //         </View>
// // // //         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
// // // //           <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
// // // //         </TouchableOpacity>
// // // //       </View>

// // // //       {/* Filter Status */}
// // // //       <View style={styles.statusContainer}>
// // // //         <Text style={styles.statusText}>{currentFilterText}</Text>
// // // //         <View style={styles.filterActions}>
// // // //           {!showAllVendors && userPincode && (
// // // //             <TouchableOpacity style={styles.actionButton} onPress={showAllVendorsHandler}>
// // // //               <Text style={styles.actionText}>Show All</Text>
// // // //             </TouchableOpacity>
// // // //           )}
// // // //           {showAllVendors && userPincode && (
// // // //             <TouchableOpacity style={styles.actionButton} onPress={showMyAreaVendors}>
// // // //               <Text style={styles.actionText}>My Area</Text>
// // // //             </TouchableOpacity>
// // // //           )}
// // // //         </View>
// // // //       </View>

// // // //       {/* Manual Filter Section */}
// // // //       {showManualFilter && (
// // // //         <View style={styles.filterContainer}>
// // // //           <View style={styles.pincodeInputContainer}>
// // // //             <TextInput
// // // //               style={styles.pincodeInput}
// // // //               placeholder="Enter pincode (6 digits)"
// // // //               value={manualPincode}
// // // //               onChangeText={setManualPincode}
// // // //               keyboardType="numeric"
// // // //               maxLength={6}
// // // //               placeholderTextColor="#999"
// // // //             />
// // // //             <TouchableOpacity
// // // //               style={[styles.filterButton, isFilterLoading && styles.filterButtonDisabled]}
// // // //               onPress={handleManualFilter}
// // // //               disabled={isFilterLoading}
// // // //             >
// // // //               {isFilterLoading ? (
// // // //                 <ActivityIndicator size="small" color="#fff" />
// // // //               ) : (
// // // //                 <Ionicons name="search-outline" size={20} color="#fff" />
// // // //               )}
// // // //             </TouchableOpacity>
// // // //             {manualPincode.length > 0 && (
// // // //               <TouchableOpacity style={styles.clearButton} onPress={clearManualFilter}>
// // // //                 <Ionicons name="close-outline" size={20} color="#666" />
// // // //               </TouchableOpacity>
// // // //             )}
// // // //           </View>
// // // //         </View>
// // // //       )}

// // // //       {error && (
// // // //         <View style={styles.errorBanner}>
// // // //           <Text style={styles.errorText}>{error}</Text>
// // // //           <TouchableOpacity onPress={onRefresh} style={styles.retry}>
// // // //             <Text style={styles.retryText}>Retry</Text>
// // // //           </TouchableOpacity>
// // // //         </View>
// // // //       )}

// // // //       <FlatList
// // // //         data={vendors}
// // // //         renderItem={renderVendor}
// // // //         keyExtractor={(item) => item.id.toString()}
// // // //         contentContainerStyle={styles.listContent}
// // // //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// // // //         ListEmptyComponent={() => (
// // // //           <View style={styles.emptyContainer}>
// // // //             {isLoading ? (
// // // //               <>
// // // //                 <ActivityIndicator size="large" color="#007AFF" />
// // // //                 <Text style={{ marginTop: 10, color: '#666' }}>Loading vendors...</Text>
// // // //               </>
// // // //             ) : (
// // // //               <>
// // // //                 <Ionicons name="storefront-outline" size={64} color="#ccc" />
// // // //                 <Text style={styles.emptyText}>
// // // //                   {manualPincode
// // // //                     ? `No vendors available in ${manualPincode}`
// // // //                     : !showAllVendors && userPincode
// // // //                       ? `No vendors available in your area (${userPincode})`
// // // //                       : 'No vendors available'
// // // //                   }
// // // //                 </Text>
// // // //                 {!showAllVendors && userPincode && (
// // // //                   <TouchableOpacity style={styles.showAllButton} onPress={showAllVendorsHandler}>
// // // //                     <Text style={styles.showAllText}>Show All Vendors</Text>
// // // //                   </TouchableOpacity>
// // // //                 )}
// // // //               </>
// // // //             )}
// // // //           </View>
// // // //         )}
// // // //         showsVerticalScrollIndicator={false}
// // // //       />
// // // //     </View>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: { flex: 1, backgroundColor: '#f8f9fa' },
// // // //   centered: { justifyContent: 'center', alignItems: 'center' },
// // // //   header: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //     padding: 16,
// // // //     paddingTop: 50,
// // // //     backgroundColor: '#fff',
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#eee',
// // // //   },
// // // //   headerLeft: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     flex: 1,
// // // //   },
// // // //   title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginRight: 12 },
// // // //   filterToggle: {
// // // //     padding: 4,
// // // //   },
// // // //   logoutButton: { padding: 4 },

// // // //   // Status styles
// // // //   statusContainer: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#e3f2fd',
// // // //     padding: 12,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#eee',
// // // //   },
// // // //   statusText: {
// // // //     fontSize: 14,
// // // //     color: '#1976d2',
// // // //     fontWeight: '500',
// // // //     flex: 1,
// // // //   },
// // // //   filterActions: {
// // // //     flexDirection: 'row',
// // // //   },
// // // //   actionButton: {
// // // //     backgroundColor: '#1976d2',
// // // //     paddingHorizontal: 12,
// // // //     paddingVertical: 6,
// // // //     borderRadius: 6,
// // // //     marginLeft: 8,
// // // //   },
// // // //   actionText: {
// // // //     color: '#fff',
// // // //     fontSize: 12,
// // // //     fontWeight: '600',
// // // //   },

// // // //   // Filter styles
// // // //   filterContainer: {
// // // //     backgroundColor: '#fff',
// // // //     padding: 16,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#eee',
// // // //   },
// // // //   pincodeInputContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //   },
// // // //   pincodeInput: {
// // // //     flex: 1,
// // // //     borderWidth: 1,
// // // //     borderColor: '#ddd',
// // // //     borderRadius: 8,
// // // //     paddingHorizontal: 12,
// // // //     paddingVertical: 10,
// // // //     fontSize: 16,
// // // //     backgroundColor: '#fafafa',
// // // //   },
// // // //   filterButton: {
// // // //     backgroundColor: '#007AFF',
// // // //     borderRadius: 8,
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 10,
// // // //     marginLeft: 8,
// // // //     minWidth: 50,
// // // //     alignItems: 'center',
// // // //   },
// // // //   filterButtonDisabled: {
// // // //     backgroundColor: '#ccc',
// // // //   },
// // // //   clearButton: {
// // // //     padding: 8,
// // // //     marginLeft: 4,
// // // //   },

// // // //   errorBanner: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#fff0f0',
// // // //     padding: 12,
// // // //     justifyContent: 'space-between',
// // // //   },
// // // //   errorText: { color: '#c00', fontSize: 14, flex: 1 },
// // // //   retry: { backgroundColor: '#007AFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
// // // //   retryText: { color: '#fff', fontSize: 12 },
// // // //   listContent: { paddingBottom: 16 },
// // // //   card: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#fff',
// // // //     borderRadius: 12,
// // // //     padding: 16,
// // // //     marginHorizontal: 16,
// // // //     marginTop: 12,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 4,
// // // //     elevation: 3,
// // // //   },
// // // //   info: { flex: 1 },
// // // //   name: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
// // // //   contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
// // // //   contact: { fontSize: 14, color: '#666', marginLeft: 8 },
// // // //   addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
// // // //   address: { fontSize: 14, color: '#666', marginLeft: 8 },
// // // //   rateText: { fontSize: 14, color: '#704214', marginTop: 2 },
// // // //   button: {
// // // //     backgroundColor: '#007AFF',
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 8,
// // // //     borderRadius: 8,
// // // //     minWidth: 120,
// // // //     alignItems: 'center',
// // // //   },
// // // //   buttonDisabled: { backgroundColor: '#C0C0C0' },
// // // //   buttonText: { color: '#fff', fontWeight: '600' },
// // // //   emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
// // // //   emptyText: { color: '#666', fontSize: 18, textAlign: 'center', marginTop: 16 },
// // // //   showAllButton: {
// // // //     marginTop: 16,
// // // //     backgroundColor: '#007AFF',
// // // //     paddingHorizontal: 20,
// // // //     paddingVertical: 10,
// // // //     borderRadius: 8,
// // // //   },
// // // //   showAllText: {
// // // //     color: '#fff',
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //   },
// // // // });

// // // // export default CustomerHomeScreen;
// // // import React, { useState, useCallback, useEffect } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   FlatList,
// // //   StyleSheet,
// // //   ActivityIndicator,
// // //   Alert,
// // //   RefreshControl,
// // //   TextInput,
// // // } from 'react-native';
// // // import Ionicons from 'react-native-vector-icons/Ionicons';
// // // import { useNavigation } from '@react-navigation/native';
// // // import { useSelector, useDispatch } from 'react-redux';
// // // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // import { RootState, AppDispatch } from '../../store';
// // // import { logout } from '../../store/authSlice';
// // // import { RootStackParamList } from '../../navigation/types';
// // // import {
// // //   getAllVendors,
// // //   createRequest,
// // //   getConsumerDetailsById,
// // //   getJoinAssignmentStatus,
// // // } from '../../apiServices/allApi';

// // // type CustomerHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ConsumerHome'>;

// // // type Vendor = {
// // //   id: string;
// // //   name: string;
// // //   contact: string;
// // //   address?: string;
// // //   business_name?: string;
// // //   location?: string;
// // //   village?: string;
// // //   pincode?: string;
// // //   cr?: number;
// // //   br?: number;
// // // };

// // // const CustomerHomeScreen = () => {
// // //   const navigation = useNavigation<CustomerHomeNavigationProp>();
// // //   const dispatch = useDispatch<AppDispatch>();

// // //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

// // //   const [vendors, setVendors] = useState<Vendor[]>([]);
// // //   const [requestedVendors, setRequestedVendors] = useState<string[]>([]);
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [submittingId, setSubmittingId] = useState<string | null>(null);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const [userPincode, setUserPincode] = useState<string>('');
// // //   const [showAllVendors, setShowAllVendors] = useState(false);

// // //   const [manualPincode, setManualPincode] = useState('');
// // //   const [showManualFilter, setShowManualFilter] = useState(false);
// // //   const [isFilterLoading, setIsFilterLoading] = useState(false);

// // //   const [joinStatus, setJoinStatus] = useState({
// // //     isJoined: false,
// // //     currentVendorId: null as string | null,
// // //     currentVendorName: '',
// // //     status: '',
// // //     joinedDate: '',
// // //   });

// // //   const fetchUserProfile = useCallback(async () => {
// // //     if (!user?.userID) return;
// // //     try {
// // //       const response = await getConsumerDetailsById(user.userID);
// // //       const profileData = response?.data?.data || response?.data;
// // //       if (profileData?.pincode) {
// // //         setUserPincode(profileData.pincode);
// // //       } else {
// // //         setShowAllVendors(true);
// // //       }
// // //     } catch {
// // //       setShowAllVendors(true);
// // //     }
// // //   }, [user?.userID]);

// // //   const checkAssignment = useCallback(async () => {
// // //     if (!user?.userID) return;
// // //     try {
// // //       const res = await getJoinAssignmentStatus(Number(user.userID), 'customer');
// // //       setJoinStatus({
// // //         isJoined: res.data.isJoined,
// // //         currentVendorId: res.data.currentVendorId?.toString() || null,
// // //         currentVendorName: res.data.currentVendorName || '',
// // //         status: res.data.status || '',
// // //         joinedDate: res.data.joinedDate || '',
// // //       });
// // //     } catch {
// // //       setJoinStatus({
// // //         isJoined: false,
// // //         currentVendorId: null,
// // //         currentVendorName: '',
// // //         status: '',
// // //         joinedDate: '',
// // //       });
// // //     }
// // //   }, [user?.userID]);

// // //   const fetchData = useCallback(
// // //     async (filterPincode?: string) => {
// // //       setError(null);
// // //       setIsLoading(true);
// // //       try {
// // //         if (!user?.userID) throw new Error('Customer ID not found. Please log in again.');

// // //         let pincodeToFilter = filterPincode;
// // //         if (!pincodeToFilter && !showAllVendors && userPincode) {
// // //           pincodeToFilter = userPincode;
// // //         }

// // //         const vendorRes = await getAllVendors(pincodeToFilter);
// // //         const vendorList = vendorRes?.data?.data || vendorRes?.data || [];

// // //         if (!Array.isArray(vendorList)) {
// // //           setVendors([]);
// // //           setIsLoading(false);
// // //           return;
// // //         }

// // //         if (joinStatus.isJoined && joinStatus.currentVendorId) {
// // //           // Show ONLY the joined vendor
// // //           const currentVendor = vendorList.find(
// // //             (v) => v.id.toString() === joinStatus.currentVendorId,
// // //           );
// // //           if (currentVendor) {
// // //             setVendors([currentVendor]);
// // //           } else {
// // //             setVendors([]);
// // //           }
// // //         } else {
// // //           setVendors(vendorList);
// // //         }
// // //       } catch (err: any) {
// // //         setError(err.message || 'Failed to load vendors.');
// // //         setVendors([]);
// // //       } finally {
// // //         setIsLoading(false);
// // //         setRefreshing(false);
// // //         setIsFilterLoading(false);
// // //       }
// // //     },
// // //     [user?.userID, userPincode, showAllVendors, joinStatus],
// // //   );

// // //   const onRefresh = useCallback(() => {
// // //     setRefreshing(true);
// // //     const currentFilter = manualPincode || (showAllVendors ? undefined : userPincode);
// // //     fetchData(currentFilter);
// // //     checkAssignment();
// // //   }, [fetchData, manualPincode, showAllVendors, userPincode, checkAssignment]);

// // //   const handleManualFilter = useCallback(() => {
// // //     if (joinStatus.isJoined) {
// // //       Alert.alert(
// // //         'Filter Disabled',
// // //         `You are currently joined with "${joinStatus.currentVendorName}". Only your current vendor is shown.`,
// // //         [{ text: 'OK' }],
// // //       );
// // //       return;
// // //     }
// // //     if (manualPincode.trim() && manualPincode.length === 6) {
// // //       setIsFilterLoading(true);
// // //       fetchData(manualPincode.trim());
// // //     } else if (manualPincode.trim() === '') {
// // //       setIsFilterLoading(true);
// // //       fetchData(showAllVendors ? undefined : userPincode);
// // //     } else {
// // //       Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pincode');
// // //     }
// // //   }, [manualPincode, fetchData, showAllVendors, userPincode, joinStatus]);

// // //   const showAllVendorsHandler = useCallback(() => {
// // //     if (joinStatus.isJoined) {
// // //       Alert.alert(
// // //         'Already Joined',
// // //         `You are currently joined with "${joinStatus.currentVendorName}".`,
// // //         [{ text: 'OK' }],
// // //       );
// // //       return;
// // //     }
// // //     setShowAllVendors(true);
// // //     setManualPincode('');
// // //     fetchData();
// // //   }, [fetchData, joinStatus]);

// // //   const showMyAreaVendors = useCallback(() => {
// // //     if (joinStatus.isJoined) {
// // //       Alert.alert(
// // //         'Already Joined',
// // //         `You are currently joined with "${joinStatus.currentVendorName}".`,
// // //         [{ text: 'OK' }],
// // //       );
// // //       return;
// // //     }
// // //     if (userPincode) {
// // //       setShowAllVendors(false);
// // //       setManualPincode('');
// // //       fetchData(userPincode);
// // //     } else {
// // //       Alert.alert('No Pincode', 'Please update your profile with your pincode first');
// // //     }
// // //   }, [fetchData, userPincode, joinStatus]);

// // //   const clearManualFilter = useCallback(() => {
// // //     if (joinStatus.isJoined) return;
// // //     setManualPincode('');
// // //     setIsFilterLoading(true);
// // //     fetchData(showAllVendors ? undefined : userPincode);
// // //   }, [fetchData, showAllVendors, userPincode, joinStatus]);

// // //   const sendRequest = useCallback(
// // //     async (vendorId: string) => {
// // //       try {
// // //         if (!user?.userID) {
// // //           Alert.alert('Error', 'Customer not authenticated. Please log in.');
// // //           return;
// // //         }

// // //         if (joinStatus.isJoined && vendorId !== joinStatus.currentVendorId) {
// // //           Alert.alert(
// // //             'Error',
// // //             `You are already joined with "${joinStatus.currentVendorName}". Please wait for approval or cancel your existing request.`,
// // //           );
// // //           return;
// // //         }

// // //         setSubmittingId(vendorId);

// // //         await createRequest({
// // //           user_id: Number(user.userID),
// // //           user_type: 'customer',
// // //           vendor: Number(vendorId),
// // //         });
// // //         Alert.alert('Success', 'Request sent to vendor!');
// // //         setRequestedVendors((prev) => [...prev, vendorId]);
// // //         checkAssignment();
// // //       } catch (err: any) {
// // //         Alert.alert('Error', err.message || 'Failed to send request.');
// // //       } finally {
// // //         setSubmittingId(null);
// // //       }
// // //     },
// // //     [user?.userID, joinStatus, checkAssignment],
// // //   );

// // //   const handleLogout = useCallback(() => {
// // //     Alert.alert(
// // //       'Logout',
// // //       'Are you sure you want to log out?',
// // //       [
// // //         { text: 'Cancel', style: 'cancel' },
// // //         {
// // //           text: 'Logout',
// // //           style: 'destructive',
// // //           onPress: async () => {
// // //             await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
// // //             dispatch(logout());
// // //             navigation.reset({
// // //               index: 0,
// // //               routes: [{ name: 'Login' }],
// // //             });
// // //           },
// // //         },
// // //       ],
// // //       { cancelable: true },
// // //     );
// // //   }, [dispatch, navigation]);

// // //   const renderVendor = useCallback(
// // //     ({ item }: { item: Vendor }) => {
// // //       const isRequested = requestedVendors.includes(item.id);
// // //       const isSubmitting = submittingId === item.id;

// // //       const vendorName = item.name || item.business_name || 'Unnamed Vendor';
// // //       const village = item.village || 'No village provided';
// // //       const vendorPincode = item.pincode ? `- ${item.pincode}` : '';

// // //       return (
// // //         <View style={styles.card}>
// // //           <View style={styles.info}>
// // //             <Text style={styles.name}>{vendorName}</Text>
// // //             <View style={styles.contactRow}>
// // //               <Ionicons name="call-outline" size={16} color="#666" />
// // //               <Text style={styles.contact}>{item.contact}</Text>
// // //             </View>
// // //             <View style={styles.addressRow}>
// // //               <Ionicons name="location-outline" size={16} color="#666" />
// // //               <Text style={styles.address}>
// // //                 {village} {vendorPincode}
// // //               </Text>
// // //             </View>
// // //             <Text style={styles.rateText}>
// // //               Cow Milk Rate: {item.cr != null ? `₹${item.cr}/L` : 'N/A'}
// // //             </Text>
// // //             <Text style={styles.rateText}>
// // //               Buffalo Milk Rate: {item.br != null ? `₹${item.br}/L` : 'N/A'}
// // //             </Text>
// // //           </View>

// // //           <TouchableOpacity
// // //             style={[styles.button, (isRequested || isSubmitting) && styles.buttonDisabled]}
// // //             onPress={() => !isRequested && !isSubmitting && sendRequest(item.id)}
// // //             disabled={isRequested || isSubmitting}
// // //           >
// // //             {isSubmitting ? (
// // //               <ActivityIndicator size="small" color="#fff" />
// // //             ) : (
// // //               <Text style={styles.buttonText}>{isRequested ? 'Requested' : 'Join Vendor'}</Text>
// // //             )}
// // //           </TouchableOpacity>
// // //         </View>
// // //       );
// // //     },
// // //     [requestedVendors, submittingId, sendRequest],
// // //   );

// // //   useEffect(() => {
// // //     fetchUserProfile();
// // //   }, [fetchUserProfile]);

// // //   useEffect(() => {
// // //     if (userPincode || showAllVendors) {
// // //       fetchData();
// // //     }
// // //   }, [userPincode, showAllVendors, fetchData]);

// // //   if (!isAuthenticated || !user?.userID) {
// // //     return (
// // //       <View style={[styles.container, styles.centered]}>
// // //         <ActivityIndicator size="large" color="#007AFF" />
// // //         <Text style={{ marginTop: 10, color: '#666' }}>Loading user information...</Text>
// // //       </View>
// // //     );
// // //   }

// // //   const currentFilterText = manualPincode
// // //     ? `Filtered by: ${manualPincode}`
// // //     : showAllVendors
// // //     ? 'Showing all vendors'
// // //     : userPincode
// // //     ? `Your area: ${userPincode}`
// // //     : 'No filter applied';

// // //   return (
// // //     <View style={styles.container}>
// // //       <View style={styles.header}>
// // //         <View style={styles.headerLeft}>
// // //           <Text style={styles.title}>Available Vendors</Text>
// // //           <TouchableOpacity
// // //             onPress={() => setShowManualFilter(!showManualFilter)}
// // //             style={styles.filterToggle}
// // //           >
// // //             <Ionicons
// // //               name={showManualFilter ? 'chevron-up-outline' : 'filter-outline'}
// // //               size={24}
// // //               color="#007AFF"
// // //             />
// // //           </TouchableOpacity>
// // //         </View>
// // //         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
// // //           <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
// // //         </TouchableOpacity>
// // //       </View>

// // //       <View style={styles.statusContainer}>
// // //         <Text style={styles.statusText}>{currentFilterText}</Text>
// // //         <View style={styles.filterActions}>
// // //           {!showAllVendors && userPincode && (
// // //             <TouchableOpacity style={styles.actionButton} onPress={showAllVendorsHandler}>
// // //               <Text style={styles.actionText}>Show All</Text>
// // //             </TouchableOpacity>
// // //           )}
// // //           {showAllVendors && userPincode && (
// // //             <TouchableOpacity style={styles.actionButton} onPress={showMyAreaVendors}>
// // //               <Text style={styles.actionText}>My Area</Text>
// // //             </TouchableOpacity>
// // //           )}
// // //         </View>
// // //       </View>

// // //       {showManualFilter && (
// // //         <View style={styles.filterContainer}>
// // //           <View style={styles.pincodeInputContainer}>
// // //             <TextInput
// // //               style={styles.pincodeInput}
// // //               placeholder="Enter pincode (6 digits)"
// // //               value={manualPincode}
// // //               onChangeText={setManualPincode}
// // //               keyboardType="numeric"
// // //               maxLength={6}
// // //               placeholderTextColor="#999"
// // //             />
// // //             <TouchableOpacity
// // //               style={[styles.filterButton, isFilterLoading && styles.filterButtonDisabled]}
// // //               onPress={handleManualFilter}
// // //               disabled={isFilterLoading}
// // //             >
// // //               {isFilterLoading ? (
// // //                 <ActivityIndicator size="small" color="#fff" />
// // //               ) : (
// // //                 <Ionicons name="search-outline" size={20} color="#fff" />
// // //               )}
// // //             </TouchableOpacity>
// // //             {manualPincode.length > 0 && (
// // //               <TouchableOpacity style={styles.clearButton} onPress={clearManualFilter}>
// // //                 <Ionicons name="close-outline" size={20} color="#666" />
// // //               </TouchableOpacity>
// // //             )}
// // //           </View>
// // //         </View>
// // //       )}

// // //       {error && (
// // //         <View style={styles.errorBanner}>
// // //           <Text style={styles.errorText}>{error}</Text>
// // //           <TouchableOpacity onPress={onRefresh} style={styles.retry}>
// // //             <Text style={styles.retryText}>Retry</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       )}

// // //       <FlatList
// // //         data={vendors}
// // //         renderItem={renderVendor}
// // //         keyExtractor={(item) => item.id.toString()}
// // //         contentContainerStyle={styles.listContent}
// // //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// // //         ListEmptyComponent={() => (
// // //           <View style={styles.emptyContainer}>
// // //             {isLoading ? (
// // //               <>
// // //                 <ActivityIndicator size="large" color="#007AFF" />
// // //                 <Text style={{ marginTop: 10, color: '#666' }}>Loading vendors...</Text>
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <Ionicons name="storefront-outline" size={64} color="#ccc" />
// // //                 <Text style={styles.emptyText}>
// // //                   {manualPincode
// // //                     ? `No vendors available in ${manualPincode}`
// // //                     : !showAllVendors && userPincode
// // //                     ? `No vendors available in your area (${userPincode})`
// // //                     : 'No vendors available'}
// // //                 </Text>
// // //                 {!showAllVendors && userPincode && (
// // //                   <TouchableOpacity style={styles.showAllButton} onPress={showAllVendorsHandler}>
// // //                     <Text style={styles.showAllText}>Show All Vendors</Text>
// // //                   </TouchableOpacity>
// // //                 )}
// // //               </>
// // //             )}
// // //           </View>
// // //         )}
// // //         showsVerticalScrollIndicator={false}
// // //       />
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: { flex: 1, backgroundColor: '#f8f9fa' },
// // //   centered: { justifyContent: 'center', alignItems: 'center' },
// // //   header: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     padding: 16,
// // //     paddingTop: 50,
// // //     backgroundColor: '#fff',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#eee',
// // //   },
// // //   headerLeft: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flex: 1,
// // //   },
// // //   title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginRight: 12 },
// // //   filterToggle: {
// // //     padding: 4,
// // //   },
// // //   logoutButton: { padding: 4 },

// // //   statusContainer: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     backgroundColor: '#e3f2fd',
// // //     padding: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#eee',
// // //   },
// // //   statusText: {
// // //     fontSize: 14,
// // //     color: '#1976d2',
// // //     fontWeight: '500',
// // //     flex: 1,
// // //   },
// // //   filterActions: {
// // //     flexDirection: 'row',
// // //   },
// // //   actionButton: {
// // //     backgroundColor: '#1976d2',
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 6,
// // //     borderRadius: 6,
// // //     marginLeft: 8,
// // //   },
// // //   actionText: {
// // //     color: '#fff',
// // //     fontSize: 12,
// // //     fontWeight: '600',
// // //   },

// // //   filterContainer: {
// // //     backgroundColor: '#fff',
// // //     padding: 16,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#eee',
// // //   },
// // //   pincodeInputContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   pincodeInput: {
// // //     flex: 1,
// // //     borderWidth: 1,
// // //     borderColor: '#ddd',
// // //     borderRadius: 8,
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 10,
// // //     fontSize: 16,
// // //     backgroundColor: '#fafafa',
// // //   },
// // //   filterButton: {
// // //     backgroundColor: '#007AFF',
// // //     borderRadius: 8,
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 10,
// // //     marginLeft: 8,
// // //     minWidth: 50,
// // //     alignItems: 'center',
// // //   },
// // //   filterButtonDisabled: {
// // //     backgroundColor: '#ccc',
// // //   },
// // //   clearButton: {
// // //     padding: 8,
// // //     marginLeft: 4,
// // //   },

// // //   errorBanner: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#fff0f0',
// // //     padding: 12,
// // //     justifyContent: 'space-between',
// // //   },
// // //   errorText: { color: '#c00', fontSize: 14, flex: 1 },
// // //   retry: { backgroundColor: '#007AFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
// // //   retryText: { color: '#fff', fontSize: 12 },
// // //   listContent: { paddingBottom: 16 },
// // //   card: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#fff',
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     marginHorizontal: 16,
// // //     marginTop: 12,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 3,
// // //   },
// // //   info: { flex: 1 },
// // //   name: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
// // //   contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
// // //   contact: { fontSize: 14, color: '#666', marginLeft: 8 },
// // //   addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
// // //   address: { fontSize: 14, color: '#666', marginLeft: 8 },
// // //   rateText: { fontSize: 14, color: '#704214', marginTop: 2 },
// // //   button: {
// // //     backgroundColor: '#007AFF',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 8,
// // //     borderRadius: 8,
// // //     minWidth: 120,
// // //     alignItems: 'center',
// // //   },
// // //   buttonDisabled: { backgroundColor: '#C0C0C0' },
// // //   buttonText: { color: '#fff', fontWeight: '600' },
// // //   emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
// // //   emptyText: { color: '#666', fontSize: 18, textAlign: 'center', marginTop: 16 },
// // //   showAllButton: {
// // //     marginTop: 16,
// // //     backgroundColor: '#007AFF',
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 10,
// // //     borderRadius: 8,
// // //   },
// // //   showAllText: {
// // //     color: '#fff',
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //   },
// // // });

// // // export default CustomerHomeScreen;
// // import React, { useState, useCallback, useEffect } from 'react';
// // import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import { useSelector, useDispatch } from 'react-redux';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { RootState, AppDispatch } from '../../store';
// // import { logout } from '../../store/authSlice';
// // import {
// //   getAllVendors,
// //   getConsumerDetailsById,
// //   getJoinAssignmentStatus,
// //   createRequest,
// // } from '../../apiServices/allApi';

// // type Vendor = {
// //   id: string | number;
// //   name?: string;
// //   contact?: string;
// //   village?: string;
// //   cr?: number;
// //   br?: number;
// // };

// // const ConsumerHomeScreen = () => {
// //   const dispatch = useDispatch<AppDispatch>();
// //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

// //   const [vendors, setVendors] = useState<Vendor[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [joinedVendor, setJoinedVendor] = useState<Vendor | null>(null);
// //   const [joinStatus, setJoinStatus] = useState<string>('');
// //   const [submittingId, setSubmittingId] = useState<string | null>(null);

// //   const loadData = useCallback(async () => {
// //     if (!user?.userID) return;
// //     setLoading(true);
// //     try {
// //       const profileRes = await getConsumerDetailsById(Number(user.userID));
// //       const pincode = profileRes?.data?.data?.pincode || profileRes?.data?.pincode || '';

// //       const assignRes = await getJoinAssignmentStatus(Number(user.userID), 'customer');

// //       if (assignRes.data.isJoined && assignRes.data.status === 'accepted') {
// //         setJoinedVendor(assignRes.data.vendorDetails || null);
// //         setJoinStatus(assignRes.data.status || '');
// //         if (assignRes.data.vendorDetails) {
// //           setVendors([assignRes.data.vendorDetails]);
// //         }
// //       } else {
// //         setJoinedVendor(null);
// //         setJoinStatus('');
// //         const vendorRes = await getAllVendors(pincode || undefined);
// //         const vList = vendorRes?.data?.data || vendorRes?.data || [];
// //         setVendors(Array.isArray(vList) ? vList : []);
// //       }
// //     } catch (err) {
// //       setVendors([]);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [user?.userID]);

// //   useEffect(() => {
// //     loadData();
// //   }, [loadData]);

// //   const sendJoinRequest = async (vendorId: string | number) => {
// //     if (!user?.userID) {
// //       Alert.alert('Error', 'User not logged in');
// //       return;
// //     }
// //     try {
// //       setSubmittingId(vendorId.toString());
// //       await createRequest({
// //         user_id: Number(user.userID),
// //         user_type: 'customer',
// //         vendor: Number(vendorId),
// //       });
// //       Alert.alert('Success', 'Join request sent successfully!');
// //       loadData();
// //     } catch (err: any) {
// //       Alert.alert('Error', err.message || 'Failed to send join request');
// //     } finally {
// //       setSubmittingId(null);
// //     }
// //   };

// //   const handleLogout = async () => {
// //     await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
// //     dispatch(logout());
// //   };

// //   if (!isAuthenticated || !user?.userID) {
// //     return (
// //       <View style={styles.centered}>
// //         <ActivityIndicator size="large" color="#1976D2" />
// //         <Text style={styles.loadingText}>Loading...</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.header}>
// //         <View>
// //           <Text style={styles.title}>{joinedVendor ? 'Your Vendor' : 'Available Vendors'}</Text>
// //           <Text style={styles.subtitle}>
// //             {joinedVendor ? 'Connected vendor details' : 'Find and connect with vendors'}
// //           </Text>
// //         </View>
// //         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
// //           <Ionicons name="log-out-outline" size={24} color="#fff" />
// //         </TouchableOpacity>
// //       </View>

// //       {loading ? (
// //         <View style={styles.centered}>
// //           <ActivityIndicator size="large" color="#1976D2" />
// //         </View>
// //       ) : (
// //         <FlatList
// //           data={vendors}
// //           keyExtractor={(item) => item.id.toString()}
// //           contentContainerStyle={styles.listContent}
// //           renderItem={({ item }) => (
// //             <View style={[styles.card, joinedVendor && styles.joinedCard]}>
// //               <View style={styles.cardHeader}>
// //                 <View style={styles.iconCircle}>
// //                   <Ionicons name="business" size={24} color="#1976D2" />
// //                 </View>
// //                 <View style={styles.cardTitleContainer}>
// //                   <Text style={styles.vendorName}>{item.name || 'Vendor'}</Text>
// //                   {joinedVendor && (
// //                     <View style={styles.statusBadge}>
// //                       <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
// //                       <Text style={styles.statusText}>{joinStatus}</Text>
// //                     </View>
// //                   )}
// //                 </View>
// //               </View>

// //               <View style={styles.infoSection}>
// //                 <View style={styles.infoRow}>
// //                   <Ionicons name="call-outline" size={18} color="#666" />
// //                   <Text style={styles.infoText}>{item.contact || 'N/A'}</Text>
// //                 </View>
// //                 <View style={styles.infoRow}>
// //                   <Ionicons name="location-outline" size={18} color="#666" />
// //                   <Text style={styles.infoText}>{item.village || 'N/A'}</Text>
// //                 </View>
// //               </View>

// //               <View style={styles.ratesContainer}>
// //                 <View style={styles.rateBox}>
// //                   <Text style={styles.rateLabel}>Cow Milk</Text>
// //                   <Text style={styles.rateValue}>
// //                     {item.cr != null ? `₹${item.cr}/L` : 'N/A'}
// //                   </Text>
// //                 </View>
// //                 <View style={styles.rateDivider} />
// //                 <View style={styles.rateBox}>
// //                   <Text style={styles.rateLabel}>Buffalo Milk</Text>
// //                   <Text style={styles.rateValue}>
// //                     {item.br != null ? `₹${item.br}/L` : 'N/A'}
// //                   </Text>
// //                 </View>
// //               </View>

// //               {!joinedVendor && (
// //                 <TouchableOpacity
// //                   style={[styles.button, submittingId === item.id.toString() && styles.buttonDisabled]}
// //                   onPress={() => sendJoinRequest(item.id)}
// //                   disabled={submittingId === item.id.toString()}
// //                 >
// //                   {submittingId === item.id.toString() ? (
// //                     <ActivityIndicator size="small" color="#fff" />
// //                   ) : (
// //                     <>
// //                       <Ionicons name="add-circle-outline" size={20} color="#fff" />
// //                       <Text style={styles.buttonText}>Join Vendor</Text>
// //                     </>
// //                   )}
// //                 </TouchableOpacity>
// //               )}
// //             </View>
// //           )}
// //           ListEmptyComponent={
// //             <View style={styles.emptyContainer}>
// //               <Ionicons name="storefront-outline" size={64} color="#ccc" />
// //               <Text style={styles.emptyText}>No vendors available</Text>
// //             </View>
// //           }
// //         />
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#F5F7FA' },
// //   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
// //   loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
// //   header: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     backgroundColor: '#1976D2',
// //     paddingHorizontal: 20,
// //     paddingVertical: 20,
// //     paddingTop: 50,
// //     borderBottomLeftRadius: 20,
// //     borderBottomRightRadius: 20,
// //   },
// //   title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
// //   subtitle: { fontSize: 14, color: '#E3F2FD', marginTop: 4 },
// //   logoutButton: {
// //     backgroundColor: '#E53935',
// //     padding: 10,
// //     borderRadius: 8,
// //   },
// //   listContent: { padding: 16 },
// //   card: {
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: 20,
// //     marginBottom: 16,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 8,
// //     elevation: 4,
// //   },
// //   joinedCard: {
// //     borderWidth: 2,
// //     borderColor: '#4CAF50',
// //     backgroundColor: '#F1F8F4',
// //   },
// //   cardHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 16,
// //   },
// //   iconCircle: {
// //     width: 48,
// //     height: 48,
// //     borderRadius: 24,
// //     backgroundColor: '#E3F2FD',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   cardTitleContainer: { flex: 1 },
// //   vendorName: { fontSize: 20, fontWeight: 'bold', color: '#212121' },
// //   statusBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginTop: 4,
// //   },
// //   statusText: {
// //     fontSize: 14,
// //     color: '#4CAF50',
// //     fontWeight: '600',
// //     marginLeft: 4,
// //     textTransform: 'capitalize',
// //   },
// //   infoSection: { marginBottom: 16 },
// //   infoRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   infoText: { fontSize: 15, color: '#424242', marginLeft: 8 },
// //   ratesContainer: {
// //     flexDirection: 'row',
// //     backgroundColor: '#F5F7FA',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginBottom: 16,
// //   },
// //   rateBox: { flex: 1, alignItems: 'center' },
// //   rateDivider: { width: 1, backgroundColor: '#E0E0E0', marginHorizontal: 16 },
// //   rateLabel: { fontSize: 12, color: '#757575', marginBottom: 4 },
// //   rateValue: { fontSize: 18, fontWeight: 'bold', color: '#1976D2' },
// //   button: {
// //     backgroundColor: '#1976D2',
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingVertical: 14,
// //     borderRadius: 10,
// //     gap: 8,
// //   },
// //   buttonDisabled: { backgroundColor: '#B0BEC5' },
// //   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
// //   emptyContainer: {
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     paddingVertical: 60,
// //   },
// //   emptyText: {
// //     fontSize: 18,
// //     color: '#999',
// //     marginTop: 16,
// //   },
// // });

// // export default ConsumerHomeScreen;
// import React, { useState, useCallback, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useSelector, useDispatch } from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { RootState, AppDispatch } from '../../store';
// import { logout } from '../../store/authSlice';
// import {
//   getAllVendors,
//   getConsumerDetailsById,
//   getJoinAssignmentStatus,
//   createRequest,
// } from '../../apiServices/allApi';

// type Vendor = {
//   id: string | number;
//   name?: string;
//   contact?: string;
//   address?: {
//     village?: string;
//     tal?: string;
//     dist?: string;
//     pincode?: number;
//   };
//   cr?: number; // Only this is shown for cow milk
//   buffalo_rate?: number;
// };

// const ConsumerHomeScreen = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

//   const [vendors, setVendors] = useState<Vendor[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [joinedVendor, setJoinedVendor] = useState<Vendor | null>(null);
//   const [joinStatus, setJoinStatus] = useState<string>('');
//   const [submittingId, setSubmittingId] = useState<string | null>(null);

//   const loadData = useCallback(async () => {
//     if (!user?.userID) { return; }
//     setLoading(true);
//     try {
//       const profileRes = await getConsumerDetailsById(Number(user.userID));
//       const pincode = profileRes?.data?.data?.pincode || profileRes?.data?.pincode || '';
//       const assignRes = await getJoinAssignmentStatus(Number(user.userID), 'customer');

//       if (assignRes.data.isJoined && assignRes.data.status === 'accepted') {
//         const vendorDetails = assignRes.data.vendorDetails;
//         setJoinedVendor(vendorDetails || null);
//         setJoinStatus(assignRes.data.status || '');
//         if (vendorDetails) {
//           setVendors([vendorDetails]);
//         }
//       } else {
//         setJoinedVendor(null);
//         setJoinStatus('');
//         const vendorRes = await getAllVendors(pincode || undefined);
//         const vList = vendorRes?.data?.data || vendorRes?.data || [];
//         setVendors(Array.isArray(vList) ? vList : []);
//       }
//     } catch (err) {
//       setVendors([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [user?.userID]);

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   const sendJoinRequest = async (vendorId: string | number) => {
//     if (!user?.userID) {
//       Alert.alert('Error', 'User not logged in');
//       return;
//     }
//     try {
//       setSubmittingId(vendorId.toString());
//       await createRequest({
//         user_id: Number(user.userID),
//         user_type: 'customer',
//         vendor: Number(vendorId),
//       });
//       Alert.alert('Success', 'Join request sent successfully!');
//       loadData();
//     } catch (err: any) {
//       Alert.alert('Error', err.message || 'Failed to send join request');
//     } finally {
//       setSubmittingId(null);
//     }
//   };

//   const handleLogout = async () => {
//     await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
//     dispatch(logout());
//   };

//   const getVillage = (vendor: Vendor): string => {
//     if (vendor.address?.village) { return vendor.address.village; }
//     if (vendor.address?.tal) { return vendor.address.tal; }
//     return 'N/A';
//   };

//   const getCowRate = (vendor: Vendor): string => {
//     if (vendor.cr && vendor.cr > 0) {
//       return `₹${vendor.cr}/L`;
//     }
//     return 'N/A';
//   };

//   const getBuffaloRate = (vendor: Vendor): string => {
//     if (vendor.buffalo_rate && vendor.buffalo_rate > 0) {
//       return `₹${vendor.buffalo_rate}/L`;
//     }
//     return 'N/A';
//   };

//   if (!isAuthenticated || !user?.userID) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#1976D2" />
//         <Text style={styles.loadingText}>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.title}>{joinedVendor ? 'Your Vendor' : 'Available Vendors'}</Text>
//           <Text style={styles.subtitle}>
//             {joinedVendor ? 'Connected vendor details' : 'Find and connect with vendors'}
//           </Text>
//         </View>
//         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//           <Ionicons name="log-out-outline" size={24} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {loading ? (
//         <View style={styles.centered}>
//           <ActivityIndicator size="large" color="#1976D2" />
//         </View>
//       ) : (
//         <FlatList
//           data={vendors}
//           keyExtractor={(item) => item.id.toString()}
//           contentContainerStyle={styles.listContent}
//           renderItem={({ item }) => (
//             <View style={[styles.card, joinedVendor && styles.joinedCard]}>
//               <View style={styles.cardHeader}>
//                 <View style={styles.iconCircle}>
//                   <Ionicons name="business" size={24} color="#1976D2" />
//                 </View>
//                 <View style={styles.cardTitleContainer}>
//                   <Text style={styles.vendorName}>{item.name || 'Vendor'}</Text>
//                   {joinedVendor && (
//                     <View style={styles.statusBadge}>
//                       <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
//                       <Text style={styles.statusText}>{joinStatus}</Text>
//                     </View>
//                   )}
//                 </View>
//               </View>

//               <View style={styles.infoSection}>
//                 <View style={styles.infoRow}>
//                   <Ionicons name="call-outline" size={18} color="#666" />
//                   <Text style={styles.infoText}>{item.contact || 'N/A'}</Text>
//                 </View>
//                 <View style={styles.infoRow}>
//                   <Ionicons name="location-outline" size={18} color="#666" />
//                   <Text style={styles.infoText}>{getVillage(item)}</Text>
//                 </View>
//               </View>

//               <View style={styles.ratesContainer}>
//                 <View style={styles.rateBox}>
//                   <Text style={styles.rateLabel}>Cow Milk</Text>
//                   <Text style={styles.rateValue}>{getCowRate(item)}</Text>
//                 </View>
//                 <View style={styles.rateDivider} />
//                 <View style={styles.rateBox}>
//                   <Text style={styles.rateLabel}>Buffalo Milk</Text>
//                   <Text style={styles.rateValue}>{getBuffaloRate(item)}</Text>
//                 </View>
//               </View>

//               {!joinedVendor && (
//                 <TouchableOpacity
//                   style={[styles.button, submittingId === item.id.toString() && styles.buttonDisabled]}
//                   onPress={() => sendJoinRequest(item.id)}
//                   disabled={submittingId === item.id.toString()}
//                 >
//                   {submittingId === item.id.toString() ? (
//                     <ActivityIndicator size="small" color="#fff" />
//                   ) : (
//                     <>
//                       <Ionicons name="add-circle-outline" size={20} color="#fff" />
//                       <Text style={styles.buttonText}>Join Vendor</Text>
//                     </>
//                   )}
//                 </TouchableOpacity>
//               )}
//             </View>
//           )}
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Ionicons name="storefront-outline" size={64} color="#ccc" />
//               <Text style={styles.emptyText}>No vendors available</Text>
//             </View>
//           }
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F5F7FA' },
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     backgroundColor: '#1976D2',
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//     paddingTop: 50,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//   },
//   title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
//   subtitle: { fontSize: 14, color: '#E3F2FD', marginTop: 4 },
//   logoutButton: { backgroundColor: '#E53935', padding: 10, borderRadius: 8 },
//   listContent: { padding: 16 },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   joinedCard: { borderWidth: 2, borderColor: '#4CAF50', backgroundColor: '#F1F8F4' },
//   cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
//   iconCircle: {
//     width: 48, height: 48, borderRadius: 24, backgroundColor: '#E3F2FD',
//     justifyContent: 'center', alignItems: 'center', marginRight: 12,
//   },
//   cardTitleContainer: { flex: 1 },
//   vendorName: { fontSize: 20, fontWeight: 'bold', color: '#212121' },
//   statusBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
//   statusText: { fontSize: 14, color: '#4CAF50', fontWeight: '600', marginLeft: 4, textTransform: 'capitalize' },
//   infoSection: { marginBottom: 16 },
//   infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
//   infoText: { fontSize: 15, color: '#424242', marginLeft: 8 },
//   ratesContainer: {
//     flexDirection: 'row', backgroundColor: '#F5F7FA', borderRadius: 12, padding: 16, marginBottom: 16,
//   },
//   rateBox: { flex: 1, alignItems: 'center' },
//   rateDivider: { width: 1, backgroundColor: '#E0E0E0', marginHorizontal: 16 },
//   rateLabel: { fontSize: 12, color: '#757575', marginBottom: 4 },
//   rateValue: { fontSize: 18, fontWeight: 'bold', color: '#1976D2' },
//   button: {
//     backgroundColor: '#1976D2', flexDirection: 'row', justifyContent: 'center',
//     alignItems: 'center', paddingVertical: 14, borderRadius: 10, gap: 8,
//   },
//   buttonDisabled: { backgroundColor: '#B0BEC5' },
//   buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//   emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
//   emptyText: { fontSize: 18, color: '#999', marginTop: 16 },
// });

// export default ConsumerHomeScreen;
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  getAllVendors,
  getConsumerDetailsById,
  getJoinAssignmentStatus,
  createRequest,
} from '../../apiServices/allApi';

type Vendor = {
  id: string | number;
  name?: string;
  contact?: string;
  address?: {
    village?: string;
    tal?: string;
    dist?: string;
    pincode?: number;
  };
  village?: string;
  tal?: string;
  dist?: string;
  cr?: number | string;
  br?: number | string;
  cow_rate?: number | string;
  buffalo_rate?: number | string;
  gir_cow_rate?: number | string;
  jarshi_cow_rate?: number | string;
  deshi_cow_rate?: number | string;
  pincode?: number;
};

const ConsumerHomeScreen = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedVendor, setJoinedVendor] = useState<Vendor | null>(null);
  const [joinStatus, setJoinStatus] = useState<string>('');
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user?.userID) { return; }
    
    setLoading(true);
    try {
      // Get consumer profile to fetch pincode
      const profileRes = await getConsumerDetailsById(Number(user.userID));
      const pincode = profileRes?.data?.data?.pincode || profileRes?.data?.pincode || '';
      
      // Check if consumer is already joined to a vendor
      const assignRes = await getJoinAssignmentStatus(Number(user.userID), 'customer');
      
      if (assignRes?.data?.isJoined && assignRes?.data?.status === 'accepted') {
        const vendorDetails = assignRes.data.vendorDetails;
        setJoinedVendor(vendorDetails || null);
        setJoinStatus(assignRes.data.status || '');
        
        if (vendorDetails) {
          // Fetch full vendor list to get complete rate information
          try {
            const vendorRes = await getAllVendors(pincode || undefined);
            let vList: any = null;
            
            if (vendorRes?.data?.data) {
              vList = vendorRes.data.data;
            } else if (vendorRes?.data?.vendors) {
              vList = vendorRes.data.vendors;
            } else if (vendorRes?.data?.results) {
              vList = vendorRes.data.results;
            } else if (Array.isArray(vendorRes?.data)) {
              vList = vendorRes.data;
            } else if (Array.isArray(vendorRes)) {
              vList = vendorRes;
            }
            
            // Find the joined vendor in the full list to get complete data
            if (Array.isArray(vList) && vList.length > 0) {
              const fullVendorData = vList.find((v: any) => v.id === vendorDetails.id);
              if (fullVendorData) {
                // Merge assignment details with full vendor data
                setVendors([{ ...fullVendorData, ...vendorDetails }]);
              } else {
                setVendors([vendorDetails]);
              }
            } else {
              setVendors([vendorDetails]);
            }
          } catch (err) {
            console.log('Could not fetch full vendor list, using assignment details only');
            setVendors([vendorDetails]);
          }
        }
      } else {
        setJoinedVendor(null);
        setJoinStatus('');
        
        // Fetch all available vendors
        const vendorRes = await getAllVendors(pincode || undefined);
        
        // Parse vendor list from different possible response structures
        let vList: any = null;
        if (vendorRes?.data?.data) {
          vList = vendorRes.data.data;
        } else if (vendorRes?.data?.vendors) {
          vList = vendorRes.data.vendors;
        } else if (vendorRes?.data?.results) {
          vList = vendorRes.data.results;
        } else if (Array.isArray(vendorRes?.data)) {
          vList = vendorRes.data;
        } else if (Array.isArray(vendorRes)) {
          vList = vendorRes;
        }
        
        setVendors(Array.isArray(vList) && vList.length > 0 ? vList : []);
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
      setVendors([]);
      Alert.alert('Error', err?.message || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  }, [user?.userID]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sendJoinRequest = async (vendorId: string | number) => {
    if (!user?.userID) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    try {
      setSubmittingId(vendorId.toString());
      await createRequest({
        user_id: Number(user.userID),
        user_type: 'customer',
        vendor: Number(vendorId),
      });
      
      Alert.alert('Success', 'Join request sent successfully!');
      loadData();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send join request');
    } finally {
      setSubmittingId(null);
    }
  };

  const getVillage = (vendor: Vendor): string => {
    if (vendor.village) { return vendor.village; }
    if (vendor.tal) { return vendor.tal; }
    if (vendor.address?.village) { return vendor.address.village; }
    if (vendor.address?.tal) { return vendor.address.tal; }
    return 'N/A';
  };

  const getCowRate = (vendor: Vendor): string => {
    // First check standard field names from vendor list
    let rate = vendor.cr || vendor.cow_rate;
    
    // If not found, check individual cow rate types and use the first non-zero value
    if (!rate || (typeof rate === 'number' && rate === 0) || (typeof rate === 'string' && parseFloat(rate) === 0)) {
      const gir = vendor.gir_cow_rate;
      const jarshi = vendor.jarshi_cow_rate;
      const deshi = vendor.deshi_cow_rate;
      
      if (gir && parseFloat(gir.toString()) > 0) {
        rate = gir;
      } else if (jarshi && parseFloat(jarshi.toString()) > 0) {
        rate = jarshi;
      } else if (deshi && parseFloat(deshi.toString()) > 0) {
        rate = deshi;
      }
    }
    
    if (rate) {
      const numRate = typeof rate === 'string' ? parseFloat(rate) : rate;
      if (!isNaN(numRate) && numRate > 0) {
        return `₹${numRate}/L`;
      }
    }
    return 'N/A';
  };

  const getBuffaloRate = (vendor: Vendor): string => {
    // Check multiple possible field names for buffalo rate
    const rate = vendor.br || vendor.buffalo_rate;
    
    if (rate) {
      const numRate = typeof rate === 'string' ? parseFloat(rate) : rate;
      if (!isNaN(numRate) && numRate > 0) {
        return `₹${numRate}/L`;
      }
    }
    return 'N/A';
  };

  if (!isAuthenticated || !user?.userID) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            {joinedVendor ? 'Your Vendor' : 'Available Vendors'}
          </Text>
          <Text style={styles.subtitle}>
            {joinedVendor ? 'Connected vendor details' : 'Find and connect with vendors'}
          </Text>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={styles.loadingText}>Loading vendors...</Text>
        </View>
      ) : (
        <FlatList
          data={vendors}
          keyExtractor={(item, index) => item?.id?.toString() || `vendor-${index}`}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[styles.card, joinedVendor && styles.joinedCard]}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  <Ionicons name="business" size={24} color="#1976D2" />
                </View>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.vendorName}>{item.name || 'Vendor'}</Text>
                  {joinedVendor && (
                    <View style={styles.statusBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                      <Text style={styles.statusText}>{joinStatus}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Vendor Info */}
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={18} color="#666" />
                  <Text style={styles.infoText}>{item.contact || 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={18} color="#666" />
                  <Text style={styles.infoText}>{getVillage(item)}</Text>
                </View>
              </View>

              {/* Milk Rates */}
              <View style={styles.ratesContainer}>
                <View style={styles.rateBox}>
                  <Text style={styles.rateLabel}>Cow Milk</Text>
                  <Text style={styles.rateValue}>{getCowRate(item)}</Text>
                </View>
                <View style={styles.rateDivider} />
                <View style={styles.rateBox}>
                  <Text style={styles.rateLabel}>Buffalo Milk</Text>
                  <Text style={styles.rateValue}>{getBuffaloRate(item)}</Text>
                </View>
              </View>

              {/* Join Button (only if not joined) */}
              {!joinedVendor && (
                <TouchableOpacity
                  style={[
                    styles.button,
                    submittingId === item.id.toString() && styles.buttonDisabled,
                  ]}
                  onPress={() => sendJoinRequest(item.id)}
                  disabled={submittingId === item.id.toString()}
                >
                  {submittingId === item.id.toString() ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="add-circle-outline" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Join Vendor</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="storefront-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No vendors available</Text>
              <Text style={styles.emptySubtext}>
                Check your pincode or try again later
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#E3F2FD',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  joinedCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8F4',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  vendorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#424242',
    marginLeft: 8,
  },
  ratesContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  rateBox: {
    flex: 1,
    alignItems: 'center',
  },
  rateDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  rateLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  button: {
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ConsumerHomeScreen;
