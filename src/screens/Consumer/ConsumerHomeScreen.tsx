
// // import React, { useState, useCallback, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   FlatList,
// //   StyleSheet,
// //   ActivityIndicator,
// //   Alert,
// //   RefreshControl,
// // } from 'react-native';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import { useNavigation } from '@react-navigation/native';
// // import { useSelector, useDispatch } from 'react-redux';
// // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { RootState, AppDispatch } from '../../store';
// // import { logout } from '../../store/authSlice';
// // import { RootStackParamList } from '../../navigation/types';
// // import {
// //   getAllVendors,
// //   createRequest,
// // } from '../../apiServices/allApi';

// // type CustomerHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ConsumerHome'>;

// // type Vendor = {
// //   id: string;
// //   name: string;
// //   contact: string;
// //   address?: string;
// //   business_name?: string;
// //   location?: string;
// //   village?: string;
// //   cr?: number;
// //   br?: number;
// // };

// // const CustomerHomeScreen = () => {
// //   const navigation = useNavigation<CustomerHomeNavigationProp>();
// //   const dispatch = useDispatch<AppDispatch>();

// //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

// //   const [vendors, setVendors] = useState<Vendor[]>([]);
// //   const [requestedVendors, setRequestedVendors] = useState<string[]>([]);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [submittingId, setSubmittingId] = useState<string | null>(null);
// //   const [error, setError] = useState<string | null>(null);

// //   const fetchData = useCallback(async () => {
// //     setError(null);
// //     setIsLoading(true);
// //     try {
// //       if (!user?.userID) {throw new Error('Customer ID not found. Please log in again.');}

// //       console.log('Fetching vendors...');
// //       const vendorRes = await getAllVendors();
// //       console.log('Vendors API raw response:', vendorRes);

// //       const vendorList = vendorRes?.data?.data || vendorRes?.data || [];

// //       console.log('Parsed vendor list:', vendorList);

// //       if (!Array.isArray(vendorList)) {
// //         setVendors([]);
// //       } else {
// //         setVendors(vendorList);
// //       }
// //     } catch (err: any) {
// //       console.log('Fetch vendors error:', err);
// //       setError(err.message || 'Failed to load vendors.');
// //     } finally {
// //       setIsLoading(false);
// //       setRefreshing(false);
// //     }
// //   }, [user?.userID]);

// //   const onRefresh = useCallback(() => {
// //     setRefreshing(true);
// //     fetchData();
// //   }, [fetchData]);

// //   const sendRequest = useCallback(async (vendorId: string) => {
// //     try {
// //       setSubmittingId(vendorId);

// //       if (!user?.userID) {
// //         const errorMsg = 'Customer ID not found. Please log in again.';
// //         console.log(errorMsg);
// //         throw new Error(errorMsg);
// //       }

// //       const payload = {
// //         user_id: parseInt(user.userID.toString(), 10),
// //         user_type: 'customer',
// //         vendor: parseInt(vendorId, 10),
// //       };

// //       console.log('Sending request with payload:', payload);

// //       const response = await createRequest(payload);

// //       console.log('Request creation response:', response);

// //       Alert.alert('Success', 'Request sent to vendor!');
// //       setRequestedVendors(prev => [...prev, vendorId]);
// //     } catch (err: any) {
// //       console.log('Error detail:', err);
// //       const errorMessage =
// //         err.response?.data?.detail ||
// //         err.response?.data?.message ||
// //         err.message ||
// //         'Failed to send request.';
// //       console.log('Final error message shown to user:', errorMessage);
// //       Alert.alert('Error', errorMessage);
// //     } finally {
// //       setSubmittingId(null);
// //     }
// //   }, [user?.userID]);

// //   const handleLogout = useCallback(() => {
// //     Alert.alert(
// //       'Logout',
// //       'Are you sure you want to log out?',
// //       [
// //         { text: 'Cancel', style: 'cancel' },
// //         {
// //           text: 'Logout',
// //           style: 'destructive',
// //           onPress: async () => {
// //             try {
// //               await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
// //               dispatch(logout());
// //               navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
// //             } catch (err) {
// //               console.error('Logout error:', err);
// //             }
// //           },
// //         },
// //       ],
// //       { cancelable: true }
// //     );
// //   }, [dispatch, navigation]);

// //   const renderVendor = useCallback(({ item }: { item: Vendor }) => {
// //     const isRequested = requestedVendors.includes(item.id);
// //     const isSubmitting = submittingId === item.id;

// //     const vendorName = item.name || item.business_name || 'Unnamed Vendor';

// //     const village = item.village || 'No village provided';

// //     console.log('Rendering vendor:', item.id, item.name, 'Cow Milk Rate:', item.cr, 'Buffalo Milk Rate:', item.br);

// //     return (
// //       <View style={styles.card}>
// //         <View style={styles.info}>
// //           <Text style={styles.name}>{vendorName}</Text>

// //           <View style={styles.contactRow}>
// //             <Ionicons name="call-outline" size={16} color="#666" />
// //             <Text style={styles.contact}>{item.contact}</Text>
// //           </View>

// //           <View style={styles.addressRow}>
// //             <Ionicons name="location-outline" size={16} color="#666" />
// //             <Text style={styles.address}>{village}</Text>
// //           </View>

// //           <Text style={styles.rateText}>
// //             Cow Milk Rate: {item.cr !== undefined && item.cr !== null ? `₹${item.cr}/L` : 'N/A'}
// //           </Text>
// //           <Text style={styles.rateText}>
// //             Buffalo Milk Rate: {item.br !== undefined && item.br !== null ? `₹${item.br}/L` : 'N/A'}
// //           </Text>
// //         </View>

// //         <TouchableOpacity
// //           style={[styles.button, (isRequested || isSubmitting) && styles.buttonDisabled]}
// //           onPress={() => !isRequested && !isSubmitting && sendRequest(item.id)}
// //           disabled={isRequested || isSubmitting}
// //         >
// //           {isSubmitting ? (
// //             <ActivityIndicator size="small" color="#fff" />
// //           ) : (
// //             <Text style={styles.buttonText}>
// //               {isRequested ? 'Requested' : 'Join Vendor'}
// //             </Text>
// //           )}
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   }, [requestedVendors, submittingId, sendRequest]);

// //   useEffect(() => {
// //     fetchData();
// //   }, [fetchData]);

// //   if (!isAuthenticated || !user?.userID) {
// //     return (
// //       <View style={[styles.container, styles.centered]}>
// //         <ActivityIndicator size="large" color="#007AFF" />
// //         <Text style={{ marginTop: 10, color: '#666' }}>
// //           Loading user information...
// //         </Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       <View style={styles.header}>
// //         <Text style={styles.title}>Available Vendors</Text>
// //         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
// //           <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
// //         </TouchableOpacity>
// //       </View>

// //       {error && (
// //         <View style={styles.errorBanner}>
// //           <Text style={styles.errorText}>{error}</Text>
// //           <TouchableOpacity onPress={fetchData} style={styles.retry}>
// //             <Text style={styles.retryText}>Retry</Text>
// //           </TouchableOpacity>
// //         </View>
// //       )}

// //       <FlatList
// //         data={vendors}
// //         renderItem={renderVendor}
// //         keyExtractor={(item) => item.id.toString()}
// //         contentContainerStyle={styles.listContent}
// //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// //         ListEmptyComponent={() => (
// //           <View style={styles.emptyContainer}>
// //             {isLoading ? (
// //               <>
// //                 <ActivityIndicator size="large" color="#007AFF" />
// //                 <Text style={{ marginTop: 10, color: '#666' }}>Loading vendors...</Text>
// //               </>
// //             ) : (
// //               <>
// //                 <Ionicons name="storefront-outline" size={64} color="#ccc" />
// //                 <Text style={styles.emptyText}>No vendors available.</Text>
// //               </>
// //             )}
// //           </View>
// //         )}
// //         showsVerticalScrollIndicator={false}
// //       />
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, backgroundColor: '#f8f9fa' },
// //   centered: { justifyContent: 'center', alignItems: 'center' },
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     padding: 16,
// //     paddingTop: 50,
// //     backgroundColor: '#fff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#eee',
// //   },
// //   title: { fontSize: 20, fontWeight: 'bold', color: '#333', flex: 1 },
// //   logoutButton: { padding: 4 },
// //   errorBanner: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#fff0f0',
// //     padding: 12,
// //     justifyContent: 'space-between',
// //   },
// //   errorText: { color: '#c00', fontSize: 14, flex: 1 },
// //   retry: { backgroundColor: '#007AFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
// //   retryText: { color: '#fff', fontSize: 12 },
// //   listContent: { paddingBottom: 16 },
// //   card: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#fff',
// //     borderRadius: 12,
// //     padding: 16,
// //     marginHorizontal: 16,
// //     marginTop: 12,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   info: { flex: 1 },
// //   name: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
// //   contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
// //   contact: { fontSize: 14, color: '#666', marginLeft: 8 },
// //   addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
// //   address: { fontSize: 14, color: '#666', marginLeft: 8 },
// //   rateText: { fontSize: 14, color: '#704214', marginTop: 2 },
// //   button: {
// //     backgroundColor: '#007AFF',
// //     paddingHorizontal: 16,
// //     paddingVertical: 8,
// //     borderRadius: 8,
// //     minWidth: 120,
// //     alignItems: 'center',
// //   },
// //   buttonDisabled: { backgroundColor: '#C0C0C0' },
// //   buttonText: { color: '#fff', fontWeight: '600' },
// //   emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
// //   emptyText: { color: '#666', fontSize: 18, textAlign: 'center', marginTop: 16 },
// // });

// // export default CustomerHomeScreen;
// import React, { useState, useCallback, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   Alert,
//   RefreshControl,
//   TextInput,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation } from '@react-navigation/native';
// import { useSelector, useDispatch } from 'react-redux';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { RootState, AppDispatch } from '../../store';
// import { logout } from '../../store/authSlice';
// import { RootStackParamList } from '../../navigation/types';
// import {
//   getAllVendors,
//   createRequest,
// } from '../../apiServices/allApi';

// type CustomerHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ConsumerHome'>;

// type Vendor = {
//   id: string;
//   name: string;
//   contact: string;
//   address?: string;
//   business_name?: string;
//   location?: string;
//   village?: string;
//   pincode?: string;
//   cr?: number;
//   br?: number;
// };

// const CustomerHomeScreen = () => {
//   const navigation = useNavigation<CustomerHomeNavigationProp>();
//   const dispatch = useDispatch<AppDispatch>();

//   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

//   const [vendors, setVendors] = useState<Vendor[]>([]);
//   const [requestedVendors, setRequestedVendors] = useState<string[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [submittingId, setSubmittingId] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
  
//   // Pincode filtering states
//   const [pincode, setPincode] = useState('');
//   const [showPincodeFilter, setShowPincodeFilter] = useState(false);
//   const [isFilterLoading, setIsFilterLoading] = useState(false);

//   const fetchData = useCallback(async (filterPincode?: string) => {
//     setError(null);
//     if (!filterPincode) {
//       setIsLoading(true);
//     } else {
//       setIsFilterLoading(true);
//     }
    
//     try {
//       if (!user?.userID) {
//         throw new Error('Customer ID not found. Please log in again.');
//       }

//       console.log('Fetching vendors with pincode:', filterPincode || 'all');
//       const vendorRes = await getAllVendors(filterPincode);
//       console.log('Vendors API raw response:', vendorRes);

//       const vendorList = vendorRes?.data?.data || vendorRes?.data || [];
//       console.log('Parsed vendor list:', vendorList);

//       if (!Array.isArray(vendorList)) {
//         setVendors([]);
//       } else {
//         setVendors(vendorList);
//       }
//     } catch (err: any) {
//       console.log('Fetch vendors error:', err);
//       setError(err.message || 'Failed to load vendors.');
//     } finally {
//       setIsLoading(false);
//       setRefreshing(false);
//       setIsFilterLoading(false);
//     }
//   }, [user?.userID]);

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchData(pincode || undefined);
//   }, [fetchData, pincode]);

//   const handlePincodeFilter = useCallback(() => {
//     if (pincode.trim() && pincode.length === 6) {
//       fetchData(pincode.trim());
//     } else if (pincode.trim() === '') {
//       fetchData(); // Fetch all vendors
//     } else {
//       Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pincode');
//     }
//   }, [pincode, fetchData]);

//   const clearPincodeFilter = useCallback(() => {
//     setPincode('');
//     fetchData(); // Fetch all vendors
//   }, [fetchData]);

//   const sendRequest = useCallback(async (vendorId: string) => {
//     try {
//       setSubmittingId(vendorId);

//       if (!user?.userID) {
//         const errorMsg = 'Customer ID not found. Please log in again.';
//         console.log(errorMsg);
//         throw new Error(errorMsg);
//       }

//       const payload = {
//         user_id: parseInt(user.userID.toString(), 10),
//         user_type: 'customer',
//         vendor: parseInt(vendorId, 10),
//       };

//       console.log('Sending request with payload:', payload);
//       const response = await createRequest(payload);
//       console.log('Request creation response:', response);

//       Alert.alert('Success', 'Request sent to vendor!');
//       setRequestedVendors(prev => [...prev, vendorId]);
//     } catch (err: any) {
//       console.log('Error detail:', err);
//       const errorMessage =
//         err.response?.data?.detail ||
//         err.response?.data?.message ||
//         err.message ||
//         'Failed to send request.';
//       console.log('Final error message shown to user:', errorMessage);
//       Alert.alert('Error', errorMessage);
//     } finally {
//       setSubmittingId(null);
//     }
//   }, [user?.userID]);

//   const handleLogout = useCallback(() => {
//     Alert.alert(
//       'Logout',
//       'Are you sure you want to log out?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Logout',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
//               dispatch(logout());
//               navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
//             } catch (err) {
//               console.error('Logout error:', err);
//             }
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   }, [dispatch, navigation]);

//   const renderVendor = useCallback(({ item }: { item: Vendor }) => {
//     const isRequested = requestedVendors.includes(item.id);
//     const isSubmitting = submittingId === item.id;

//     const vendorName = item.name || item.business_name || 'Unnamed Vendor';
//     const village = item.village || 'No village provided';
//     const vendorPincode = item.pincode ? `- ${item.pincode}` : '';

//     console.log('Rendering vendor:', item.id, item.name, 'Cow Milk Rate:', item.cr, 'Buffalo Milk Rate:', item.br);

//     return (
//       <View style={styles.card}>
//         <View style={styles.info}>
//           <Text style={styles.name}>{vendorName}</Text>

//           <View style={styles.contactRow}>
//             <Ionicons name="call-outline" size={16} color="#666" />
//             <Text style={styles.contact}>{item.contact}</Text>
//           </View>

//           <View style={styles.addressRow}>
//             <Ionicons name="location-outline" size={16} color="#666" />
//             <Text style={styles.address}>{village} {vendorPincode}</Text>
//           </View>

//           <Text style={styles.rateText}>
//             Cow Milk Rate: {item.cr !== undefined && item.cr !== null ? `₹${item.cr}/L` : 'N/A'}
//           </Text>
//           <Text style={styles.rateText}>
//             Buffalo Milk Rate: {item.br !== undefined && item.br !== null ? `₹${item.br}/L` : 'N/A'}
//           </Text>
//         </View>

//         <TouchableOpacity
//           style={[styles.button, (isRequested || isSubmitting) && styles.buttonDisabled]}
//           onPress={() => !isRequested && !isSubmitting && sendRequest(item.id)}
//           disabled={isRequested || isSubmitting}
//         >
//           {isSubmitting ? (
//             <ActivityIndicator size="small" color="#fff" />
//           ) : (
//             <Text style={styles.buttonText}>
//               {isRequested ? 'Requested' : 'Join Vendor'}
//             </Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     );
//   }, [requestedVendors, submittingId, sendRequest]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   if (!isAuthenticated || !user?.userID) {
//     return (
//       <View style={[styles.container, styles.centered]}>
//         <ActivityIndicator size="large" color="#007AFF" />
//         <Text style={{ marginTop: 10, color: '#666' }}>
//           Loading user information...
//         </Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <Text style={styles.title}>Available Vendors</Text>
//           <TouchableOpacity 
//             onPress={() => setShowPincodeFilter(!showPincodeFilter)}
//             style={styles.filterToggle}
//           >
//             <Ionicons 
//               name={showPincodeFilter ? "chevron-up-outline" : "filter-outline"} 
//               size={24} 
//               color="#007AFF" 
//             />
//           </TouchableOpacity>
//         </View>
//         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//           <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
//         </TouchableOpacity>
//       </View>

//       {/* Pincode Filter Section */}
//       {showPincodeFilter && (
//         <View style={styles.filterContainer}>
//           <View style={styles.pincodeInputContainer}>
//             <TextInput
//               style={styles.pincodeInput}
//               placeholder="Enter pincode (6 digits)"
//               value={pincode}
//               onChangeText={setPincode}
//               keyboardType="numeric"
//               maxLength={6}
//               placeholderTextColor="#999"
//             />
//             <TouchableOpacity 
//               style={[styles.filterButton, isFilterLoading && styles.filterButtonDisabled]}
//               onPress={handlePincodeFilter}
//               disabled={isFilterLoading}
//             >
//               {isFilterLoading ? (
//                 <ActivityIndicator size="small" color="#fff" />
//               ) : (
//                 <Ionicons name="search-outline" size={20} color="#fff" />
//               )}
//             </TouchableOpacity>
//             {pincode.length > 0 && (
//               <TouchableOpacity style={styles.clearButton} onPress={clearPincodeFilter}>
//                 <Ionicons name="close-outline" size={20} color="#666" />
//               </TouchableOpacity>
//             )}
//           </View>
//           {pincode && (
//             <Text style={styles.filterStatus}>
//               {vendors.length > 0 
//                 ? `Found ${vendors.length} vendor(s) in ${pincode}` 
//                 : `No vendors found in ${pincode}`
//               }
//             </Text>
//           )}
//         </View>
//       )}

//       {error && (
//         <View style={styles.errorBanner}>
//           <Text style={styles.errorText}>{error}</Text>
//           <TouchableOpacity onPress={() => fetchData(pincode || undefined)} style={styles.retry}>
//             <Text style={styles.retryText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       <FlatList
//         data={vendors}
//         renderItem={renderVendor}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.listContent}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         ListEmptyComponent={() => (
//           <View style={styles.emptyContainer}>
//             {isLoading ? (
//               <>
//                 <ActivityIndicator size="large" color="#007AFF" />
//                 <Text style={{ marginTop: 10, color: '#666' }}>Loading vendors...</Text>
//               </>
//             ) : (
//               <>
//                 <Ionicons name="storefront-outline" size={64} color="#ccc" />
//                 <Text style={styles.emptyText}>
//                   {pincode 
//                     ? `No vendors available in ${pincode}` 
//                     : 'No vendors available'
//                   }
//                 </Text>
//                 {pincode && (
//                   <TouchableOpacity style={styles.showAllButton} onPress={clearPincodeFilter}>
//                     <Text style={styles.showAllText}>Show All Vendors</Text>
//                   </TouchableOpacity>
//                 )}
//               </>
//             )}
//           </View>
//         )}
//         showsVerticalScrollIndicator={false}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f8f9fa' },
//   centered: { justifyContent: 'center', alignItems: 'center' },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     paddingTop: 50,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   headerLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginRight: 12 },
//   filterToggle: {
//     padding: 4,
//   },
//   logoutButton: { padding: 4 },
  
//   // Filter styles
//   filterContainer: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   pincodeInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   pincodeInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 16,
//     backgroundColor: '#fafafa',
//   },
//   filterButton: {
//     backgroundColor: '#007AFF',
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     marginLeft: 8,
//     minWidth: 50,
//     alignItems: 'center',
//   },
//   filterButtonDisabled: {
//     backgroundColor: '#ccc',
//   },
//   clearButton: {
//     padding: 8,
//     marginLeft: 4,
//   },
//   filterStatus: {
//     fontSize: 14,
//     color: '#666',
//     fontStyle: 'italic',
//   },

//   errorBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff0f0',
//     padding: 12,
//     justifyContent: 'space-between',
//   },
//   errorText: { color: '#c00', fontSize: 14, flex: 1 },
//   retry: { backgroundColor: '#007AFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
//   retryText: { color: '#fff', fontSize: 12 },
//   listContent: { paddingBottom: 16 },
//   card: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginHorizontal: 16,
//     marginTop: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   info: { flex: 1 },
//   name: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
//   contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
//   contact: { fontSize: 14, color: '#666', marginLeft: 8 },
//   addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
//   address: { fontSize: 14, color: '#666', marginLeft: 8 },
//   rateText: { fontSize: 14, color: '#704214', marginTop: 2 },
//   button: {
//     backgroundColor: '#007AFF',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//     minWidth: 120,
//     alignItems: 'center',
//   },
//   buttonDisabled: { backgroundColor: '#C0C0C0' },
//   buttonText: { color: '#fff', fontWeight: '600' },
//   emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
//   emptyText: { color: '#666', fontSize: 18, textAlign: 'center', marginTop: 16 },
//   showAllButton: {
//     marginTop: 16,
//     backgroundColor: '#007AFF',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   showAllText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });

// export default CustomerHomeScreen;
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/authSlice';
import { RootStackParamList } from '../../navigation/types';
import {
  getAllVendors,
  createRequest,
  getConsumerDetailsById,
} from '../../apiServices/allApi';

type CustomerHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ConsumerHome'>;

type Vendor = {
  id: string;
  name: string;
  contact: string;
  address?: string;
  business_name?: string;
  location?: string;
  village?: string;
  pincode?: string;
  cr?: number;
  br?: number;
};

const CustomerHomeScreen = () => {
  const navigation = useNavigation<CustomerHomeNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [requestedVendors, setRequestedVendors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // User profile states
  const [userPincode, setUserPincode] = useState<string>('');
  const [showAllVendors, setShowAllVendors] = useState(false);
  
  // Manual filter states
  const [manualPincode, setManualPincode] = useState('');
  const [showManualFilter, setShowManualFilter] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Fetch user's profile to get their pincode
  const fetchUserProfile = useCallback(async () => {
    try {
      if (!user?.userID) return;
      
      const response = await getConsumerDetailsById(user.userID);
      const profileData = response?.data?.data || response?.data;
      
      if (profileData?.pincode) {
        setUserPincode(profileData.pincode);
        console.log('User pincode found:', profileData.pincode);
      } else {
        console.log('No pincode found in user profile');
        setShowAllVendors(true);
      }
    } catch (err) {
      console.log('Error fetching user profile:', err);
      setShowAllVendors(true);
    }
  }, [user?.userID]);

  // Memoized fetchData function
  const fetchData = useCallback(async (filterPincode?: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      if (!user?.userID) {
        throw new Error('Customer ID not found. Please log in again.');
      }

      // Determine which pincode to use for filtering
      let pincodeToFilter = filterPincode;
      if (!pincodeToFilter && !showAllVendors && userPincode) {
        pincodeToFilter = userPincode;
      }

      console.log('Fetching vendors with pincode:', pincodeToFilter || 'all');
      const vendorRes = await getAllVendors(pincodeToFilter);
      console.log('Vendors API raw response:', vendorRes);

      const vendorList = vendorRes?.data?.data || vendorRes?.data || [];
      console.log('Parsed vendor list:', vendorList);

      if (!Array.isArray(vendorList)) {
        setVendors([]);
      } else {
        setVendors(vendorList);
      }
    } catch (err: any) {
      console.log('Fetch vendors error:', err);
      setError(err.message || 'Failed to load vendors.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
      setIsFilterLoading(false);
    }
  }, [user?.userID, userPincode, showAllVendors]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    const currentFilter = manualPincode || (showAllVendors ? undefined : userPincode);
    fetchData(currentFilter);
  }, [fetchData, manualPincode, showAllVendors, userPincode]);

  const handleManualFilter = useCallback(() => {
    if (manualPincode.trim() && manualPincode.length === 6) {
      setIsFilterLoading(true);
      fetchData(manualPincode.trim());
    } else if (manualPincode.trim() === '') {
      setIsFilterLoading(true);
      fetchData(showAllVendors ? undefined : userPincode);
    } else {
      Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pincode');
    }
  }, [manualPincode, fetchData, showAllVendors, userPincode]);

  const showAllVendorsHandler = useCallback(() => {
    setShowAllVendors(true);
    setManualPincode('');
    fetchData();
  }, [fetchData]);

  const showMyAreaVendors = useCallback(() => {
    if (userPincode) {
      setShowAllVendors(false);
      setManualPincode('');
      fetchData(userPincode);
    } else {
      Alert.alert('No Pincode', 'Please update your profile with your pincode first');
    }
  }, [fetchData, userPincode]);

  const clearManualFilter = useCallback(() => {
    setManualPincode('');
    setIsFilterLoading(true);
    fetchData(showAllVendors ? undefined : userPincode);
  }, [fetchData, showAllVendors, userPincode]);

  const sendRequest = useCallback(async (vendorId: string) => {
    try {
      setSubmittingId(vendorId);

      if (!user?.userID) {
        const errorMsg = 'Customer ID not found. Please log in again.';
        console.log(errorMsg);
        throw new Error(errorMsg);
      }

      const payload = {
        user_id: parseInt(user.userID.toString(), 10),
        user_type: 'customer',
        vendor: parseInt(vendorId, 10),
      };

      console.log('Sending request with payload:', payload);
      const response = await createRequest(payload);
      console.log('Request creation response:', response);

      Alert.alert('Success', 'Request sent to vendor!');
      setRequestedVendors(prev => [...prev, vendorId]);
    } catch (err: any) {
      console.log('Error detail:', err);
      const errorMessage =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        'Failed to send request.';
      console.log('Final error message shown to user:', errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmittingId(null);
    }
  }, [user?.userID]);

  const handleLogout = useCallback(() => {
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
              await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
              dispatch(logout());
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            } catch (err) {
              console.error('Logout error:', err);
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [dispatch, navigation]);

  const renderVendor = useCallback(({ item }: { item: Vendor }) => {
    const isRequested = requestedVendors.includes(item.id);
    const isSubmitting = submittingId === item.id;

    const vendorName = item.name || item.business_name || 'Unnamed Vendor';
    const village = item.village || 'No village provided';
    const vendorPincode = item.pincode ? `- ${item.pincode}` : '';

    return (
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.name}>{vendorName}</Text>

          <View style={styles.contactRow}>
            <Ionicons name="call-outline" size={16} color="#666" />
            <Text style={styles.contact}>{item.contact}</Text>
          </View>

          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={16} color="#666" />
            <Text style={styles.address}>{village} {vendorPincode}</Text>
          </View>

          <Text style={styles.rateText}>
            Cow Milk Rate: {item.cr !== undefined && item.cr !== null ? `₹${item.cr}/L` : 'N/A'}
          </Text>
          <Text style={styles.rateText}>
            Buffalo Milk Rate: {item.br !== undefined && item.br !== null ? `₹${item.br}/L` : 'N/A'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, (isRequested || isSubmitting) && styles.buttonDisabled]}
          onPress={() => !isRequested && !isSubmitting && sendRequest(item.id)}
          disabled={isRequested || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isRequested ? 'Requested' : 'Join Vendor'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }, [requestedVendors, submittingId, sendRequest]);

  // Initialize: fetch user profile then vendors
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Fetch vendors after getting user pincode
  useEffect(() => {
    if (userPincode || showAllVendors) {
      fetchData();
    }
  }, [userPincode, showAllVendors, fetchData]);

  if (!isAuthenticated || !user?.userID) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#666' }}>
          Loading user information...
        </Text>
      </View>
    );
  }

  const currentFilterText = manualPincode 
    ? `Filtered by: ${manualPincode}` 
    : showAllVendors 
      ? 'Showing all vendors' 
      : userPincode 
        ? `Your area: ${userPincode}` 
        : 'No filter applied';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Available Vendors</Text>
          <TouchableOpacity 
            onPress={() => setShowManualFilter(!showManualFilter)}
            style={styles.filterToggle}
          >
            <Ionicons 
              name={showManualFilter ? "chevron-up-outline" : "filter-outline"} 
              size={24} 
              color="#007AFF" 
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {/* Filter Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{currentFilterText}</Text>
        <View style={styles.filterActions}>
          {!showAllVendors && userPincode && (
            <TouchableOpacity style={styles.actionButton} onPress={showAllVendorsHandler}>
              <Text style={styles.actionText}>Show All</Text>
            </TouchableOpacity>
          )}
          {showAllVendors && userPincode && (
            <TouchableOpacity style={styles.actionButton} onPress={showMyAreaVendors}>
              <Text style={styles.actionText}>My Area</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Manual Filter Section */}
      {showManualFilter && (
        <View style={styles.filterContainer}>
          <View style={styles.pincodeInputContainer}>
            <TextInput
              style={styles.pincodeInput}
              placeholder="Enter pincode (6 digits)"
              value={manualPincode}
              onChangeText={setManualPincode}
              keyboardType="numeric"
              maxLength={6}
              placeholderTextColor="#999"
            />
            <TouchableOpacity 
              style={[styles.filterButton, isFilterLoading && styles.filterButtonDisabled]}
              onPress={handleManualFilter}
              disabled={isFilterLoading}
            >
              {isFilterLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="search-outline" size={20} color="#fff" />
              )}
            </TouchableOpacity>
            {manualPincode.length > 0 && (
              <TouchableOpacity style={styles.clearButton} onPress={clearManualFilter}>
                <Ionicons name="close-outline" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={onRefresh} style={styles.retry}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={vendors}
        renderItem={renderVendor}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {isLoading ? (
              <>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={{ marginTop: 10, color: '#666' }}>Loading vendors...</Text>
              </>
            ) : (
              <>
                <Ionicons name="storefront-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>
                  {manualPincode 
                    ? `No vendors available in ${manualPincode}` 
                    : !showAllVendors && userPincode
                      ? `No vendors available in your area (${userPincode})`
                      : 'No vendors available'
                  }
                </Text>
                {!showAllVendors && userPincode && (
                  <TouchableOpacity style={styles.showAllButton} onPress={showAllVendorsHandler}>
                    <Text style={styles.showAllText}>Show All Vendors</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginRight: 12 },
  filterToggle: {
    padding: 4,
  },
  logoutButton: { padding: 4 },
  
  // Status styles
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statusText: {
    fontSize: 14,
    color: '#1976d2',
    fontWeight: '500',
    flex: 1,
  },
  filterActions: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Filter styles
  filterContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pincodeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pincodeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  filterButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 8,
    minWidth: 50,
    alignItems: 'center',
  },
  filterButtonDisabled: {
    backgroundColor: '#ccc',
  },
  clearButton: {
    padding: 8,
    marginLeft: 4,
  },

  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff0f0',
    padding: 12,
    justifyContent: 'space-between',
  },
  errorText: { color: '#c00', fontSize: 14, flex: 1 },
  retry: { backgroundColor: '#007AFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  retryText: { color: '#fff', fontSize: 12 },
  listContent: { paddingBottom: 16 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  contact: { fontSize: 14, color: '#666', marginLeft: 8 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  address: { fontSize: 14, color: '#666', marginLeft: 8 },
  rateText: { fontSize: 14, color: '#704214', marginTop: 2 },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: '#C0C0C0' },
  buttonText: { color: '#fff', fontWeight: '600' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { color: '#666', fontSize: 18, textAlign: 'center', marginTop: 16 },
  showAllButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  showAllText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomerHomeScreen;
