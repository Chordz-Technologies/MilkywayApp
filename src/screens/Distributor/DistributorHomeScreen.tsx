
// // // // // // // // import React, { useState, useCallback, useEffect } from 'react';
// // // // // // // // import {
// // // // // // // //   View,
// // // // // // // //   Text,
// // // // // // // //   TouchableOpacity,
// // // // // // // //   FlatList,
// // // // // // // //   StyleSheet,
// // // // // // // //   ActivityIndicator,
// // // // // // // //   Alert,
// // // // // // // //   RefreshControl,
// // // // // // // // } from 'react-native';
// // // // // // // // import Ionicons from 'react-native-vector-icons/Ionicons';
// // // // // // // // import { useNavigation } from '@react-navigation/native';
// // // // // // // // import { useSelector, useDispatch } from 'react-redux';
// // // // // // // // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // // // // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // // // // import { RootState, AppDispatch } from '../../store';
// // // // // // // // import { logout } from '../../store/authSlice';
// // // // // // // // import { RootStackParamList } from '../../navigation/types';
// // // // // // // // import {
// // // // // // // //   getAllVendors,
// // // // // // // //   createRequest,
// // // // // // // // } from '../../apiServices/allApi';

// // // // // // // // type DistributorHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DistributorHome'>;

// // // // // // // // type Vendor = {
// // // // // // // //   id: number;
// // // // // // // //   name: string;
// // // // // // // //   contact: string;
// // // // // // // //   address?: string;
// // // // // // // //   business_name?: string;
// // // // // // // //   location?: string;
// // // // // // // //   village?: string;
// // // // // // // // };

// // // // // // // // const DistributorHomeScreen = () => {
// // // // // // // //   const navigation = useNavigation<DistributorHomeNavigationProp>();
// // // // // // // //   const dispatch = useDispatch<AppDispatch>();

// // // // // // // //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

// // // // // // // //   const [vendors, setVendors] = useState<Vendor[]>([]);
// // // // // // // //   const [requestedVendors, setRequestedVendors] = useState<number[]>([]);
// // // // // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // // // // //   const [refreshing, setRefreshing] = useState(false);
// // // // // // // //   const [submittingId, setSubmittingId] = useState<number | null>(null);
// // // // // // // //   const [error, setError] = useState<string | null>(null);

// // // // // // // //   const fetchData = useCallback(async () => {
// // // // // // // //     setError(null);
// // // // // // // //     setIsLoading(true);
// // // // // // // //     try {
// // // // // // // //       const distributorId = user?.userID;

// // // // // // // //       if (!distributorId) {
// // // // // // // //         throw new Error('Distributor ID not found. Please log in again.');
// // // // // // // //       }

// // // // // // // //       console.log('Fetching vendors for distributor ID:', distributorId);

// // // // // // // //       const vendorRes = await getAllVendors();
// // // // // // // //       console.log('Vendors response:', vendorRes.data);

// // // // // // // //       const vendorList = vendorRes?.data?.data || vendorRes?.data || [];

// // // // // // // //       if (!Array.isArray(vendorList)) {
// // // // // // // //         console.warn('Vendor list is not an array:', vendorList);
// // // // // // // //         setVendors([]);
// // // // // // // //       } else {
// // // // // // // //         setVendors(vendorList);
// // // // // // // //       }
// // // // // // // //     } catch (err: any) {
// // // // // // // //       console.error('Fetch vendors error:', err);
// // // // // // // //       setError(err.message || 'Failed to load vendors.');
// // // // // // // //     } finally {
// // // // // // // //       setIsLoading(false);
// // // // // // // //       setRefreshing(false);
// // // // // // // //     }
// // // // // // // //   }, [user?.userID]);

// // // // // // // //   const onRefresh = useCallback(() => {
// // // // // // // //     setRefreshing(true);
// // // // // // // //     fetchData();
// // // // // // // //   }, [fetchData]);

// // // // // // // //   const sendRequest = useCallback(async (vendorId: number) => {
// // // // // // // //     try {
// // // // // // // //       setSubmittingId(vendorId);

// // // // // // // //       const distributorId = user?.userID;

// // // // // // // //       if (!distributorId) {
// // // // // // // //         throw new Error('Distributor ID not found. Please log in again.');
// // // // // // // //       }

// // // // // // // //       const payload = {
// // // // // // // //         user_id: parseInt(distributorId.toString(), 10),
// // // // // // // //         user_type: 'milkman',
// // // // // // // //         vendor: vendorId,
// // // // // // // //       };

// // // // // // // //       console.log('Sending request payload:', payload);

// // // // // // // //       await createRequest(payload);
// // // // // // // //       Alert.alert('Success', 'Request sent to vendor!');
// // // // // // // //       setRequestedVendors(prev => [...prev, vendorId]);
// // // // // // // //     } catch (err: any) {
// // // // // // // //       // console.error('Send request error:', err);
// // // // // // // //       const errorMessage = err.response?.data?.detail ||
// // // // // // // //                            err.response?.data?.message ||
// // // // // // // //                            err.message ||
// // // // // // // //                            'Failed to send request.';
// // // // // // // //       Alert.alert('Error', errorMessage);
// // // // // // // //     } finally {
// // // // // // // //       setSubmittingId(null);
// // // // // // // //     }
// // // // // // // //   }, [user?.userID]);

// // // // // // // //   const handleLogout = useCallback(() => {
// // // // // // // //     Alert.alert(
// // // // // // // //       'Logout',
// // // // // // // //       'Are you sure you want to log out?',
// // // // // // // //       [
// // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // //         {
// // // // // // // //           text: 'Logout',
// // // // // // // //           style: 'destructive',
// // // // // // // //           onPress: async () => {
// // // // // // // //             try {
// // // // // // // //               await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
// // // // // // // //               dispatch(logout());
// // // // // // // //               navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
// // // // // // // //             } catch (err) {
// // // // // // // //               console.error('Logout error:', err);
// // // // // // // //             }
// // // // // // // //           },
// // // // // // // //         },
// // // // // // // //       ],
// // // // // // // //       { cancelable: true }
// // // // // // // //     );
// // // // // // // //   }, [dispatch, navigation]);

// // // // // // // //   const renderVendor = useCallback(({ item }: { item: Vendor }) => {
// // // // // // // //     const isRequested = requestedVendors.includes(item.id);
// // // // // // // //     const isSubmitting = submittingId === item.id;

// // // // // // // //     const vendorName = item.name || item.business_name || 'Unnamed Vendor';
// // // // // // // //     const village = item.village || 'No village provided';

// // // // // // // //     return (
// // // // // // // //       <View style={styles.card}>
// // // // // // // //         <View style={styles.info}>
// // // // // // // //           <Text style={styles.name}>{vendorName}</Text>

// // // // // // // //           {/* Contact with phone icon */}
// // // // // // // //           <View style={styles.contactRow}>
// // // // // // // //             <Ionicons name="call-outline" size={16} color="#666" />
// // // // // // // //             <Text style={styles.contact}>{item.contact}</Text>
// // // // // // // //           </View>

// // // // // // // //           {/* Village with location icon */}
// // // // // // // //           <View style={styles.addressRow}>
// // // // // // // //             <Ionicons name="location-outline" size={16} color="#666" />
// // // // // // // //             <Text style={styles.address}>{village}</Text>
// // // // // // // //           </View>
// // // // // // // //         </View>

// // // // // // // //         <TouchableOpacity
// // // // // // // //           style={[styles.button, (isRequested || isSubmitting) && styles.buttonDisabled]}
// // // // // // // //           onPress={() => !isRequested && !isSubmitting && sendRequest(item.id)}
// // // // // // // //           disabled={isRequested || isSubmitting}
// // // // // // // //         >
// // // // // // // //           {isSubmitting ? (
// // // // // // // //             <ActivityIndicator size="small" color="#fff" />
// // // // // // // //           ) : (
// // // // // // // //             <Text style={styles.buttonText}>
// // // // // // // //               {isRequested ? 'Requested' : 'Join Vendor'}
// // // // // // // //             </Text>
// // // // // // // //           )}
// // // // // // // //         </TouchableOpacity>
// // // // // // // //       </View>
// // // // // // // //     );
// // // // // // // //   }, [requestedVendors, submittingId, sendRequest]);

// // // // // // // //   useEffect(() => {
// // // // // // // //     fetchData();
// // // // // // // //   }, [fetchData]);

// // // // // // // //   if (!isAuthenticated || !user?.userID) {
// // // // // // // //     return (
// // // // // // // //       <View style={[styles.container, styles.centered]}>
// // // // // // // //         <ActivityIndicator size="large" color="#007AFF" />
// // // // // // // //         <Text style={{ marginTop: 10, color: '#666' }}>
// // // // // // // //           Loading user information...
// // // // // // // //         </Text>
// // // // // // // //       </View>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   return (
// // // // // // // //     <View style={styles.container}>
// // // // // // // //       {/* Header */}
// // // // // // // //       <View style={styles.header}>
// // // // // // // //         <Text style={styles.title}>Available Vendors</Text>
// // // // // // // //         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
// // // // // // // //           <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
// // // // // // // //         </TouchableOpacity>
// // // // // // // //       </View>

// // // // // // // //       {/* Error Banner */}
// // // // // // // //       {error && (
// // // // // // // //         <View style={styles.errorBanner}>
// // // // // // // //           <Text style={styles.errorText}>{error}</Text>
// // // // // // // //           <TouchableOpacity onPress={fetchData} style={styles.retry}>
// // // // // // // //             <Text style={styles.retryText}>Retry</Text>
// // // // // // // //           </TouchableOpacity>
// // // // // // // //         </View>
// // // // // // // //       )}

// // // // // // // //       {/* Vendors List */}
// // // // // // // //       <FlatList
// // // // // // // //         data={vendors}
// // // // // // // //         renderItem={renderVendor}
// // // // // // // //         keyExtractor={(item) => item.id.toString()}
// // // // // // // //         contentContainerStyle={styles.listContent}
// // // // // // // //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// // // // // // // //         ListEmptyComponent={() => (
// // // // // // // //           <View style={styles.emptyContainer}>
// // // // // // // //             {isLoading ? (
// // // // // // // //               <>
// // // // // // // //                 <ActivityIndicator size="large" color="#007AFF" />
// // // // // // // //                 <Text style={{ marginTop: 10, color: '#666' }}>Loading vendors...</Text>
// // // // // // // //               </>
// // // // // // // //             ) : (
// // // // // // // //               <>
// // // // // // // //                 <Ionicons name="storefront-outline" size={64} color="#ccc" />
// // // // // // // //                 <Text style={styles.emptyText}>No vendors available.</Text>
// // // // // // // //               </>
// // // // // // // //             )}
// // // // // // // //           </View>
// // // // // // // //         )}
// // // // // // // //         showsVerticalScrollIndicator={false}
// // // // // // // //       />
// // // // // // // //     </View>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   container: {
// // // // // // // //     flex: 1,
// // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // //   },
// // // // // // // //   centered: {
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },
// // // // // // // //   header: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     padding: 16,
// // // // // // // //     paddingTop: 50,
// // // // // // // //     backgroundColor: '#fff',
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: '#eee',
// // // // // // // //   },
// // // // // // // //   title: {
// // // // // // // //     fontSize: 20,
// // // // // // // //     fontWeight: 'bold',
// // // // // // // //     color: '#333',
// // // // // // // //     flex: 1,
// // // // // // // //   },
// // // // // // // //   logoutButton: {
// // // // // // // //     padding: 4,
// // // // // // // //   },
// // // // // // // //   errorBanner: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     backgroundColor: '#fff0f0',
// // // // // // // //     padding: 12,
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //   },
// // // // // // // //   errorText: {
// // // // // // // //     color: '#c00',
// // // // // // // //     fontSize: 14,
// // // // // // // //     flex: 1,
// // // // // // // //   },
// // // // // // // //   retry: {
// // // // // // // //     backgroundColor: '#007AFF',
// // // // // // // //     paddingHorizontal: 10,
// // // // // // // //     paddingVertical: 4,
// // // // // // // //     borderRadius: 4,
// // // // // // // //   },
// // // // // // // //   retryText: {
// // // // // // // //     color: '#fff',
// // // // // // // //     fontSize: 12,
// // // // // // // //   },
// // // // // // // //   listContent: {
// // // // // // // //     paddingBottom: 16,
// // // // // // // //   },
// // // // // // // //   card: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     backgroundColor: '#fff',
// // // // // // // //     borderRadius: 12,
// // // // // // // //     padding: 16,
// // // // // // // //     marginHorizontal: 16,
// // // // // // // //     marginTop: 12,
// // // // // // // //     shadowColor: '#000',
// // // // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // // // //     shadowOpacity: 0.1,
// // // // // // // //     shadowRadius: 4,
// // // // // // // //     elevation: 3,
// // // // // // // //   },
// // // // // // // //   info: {
// // // // // // // //     flex: 1,
// // // // // // // //   },
// // // // // // // //   name: {
// // // // // // // //     fontSize: 18,
// // // // // // // //     fontWeight: 'bold',
// // // // // // // //     color: '#333',
// // // // // // // //     marginBottom: 8,
// // // // // // // //   },
// // // // // // // //   contactRow: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginBottom: 4,
// // // // // // // //   },
// // // // // // // //   contact: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#666',
// // // // // // // //     marginLeft: 8,
// // // // // // // //   },
// // // // // // // //   addressRow: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginBottom: 4,
// // // // // // // //   },
// // // // // // // //   address: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: '#666',
// // // // // // // //     marginLeft: 8,
// // // // // // // //   },
// // // // // // // //   button: {
// // // // // // // //     backgroundColor: '#007AFF',
// // // // // // // //     paddingHorizontal: 16,
// // // // // // // //     paddingVertical: 8,
// // // // // // // //     borderRadius: 8,
// // // // // // // //     minWidth: 120,
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },
// // // // // // // //   buttonDisabled: {
// // // // // // // //     backgroundColor: '#C0C0C0',
// // // // // // // //   },
// // // // // // // //   buttonText: {
// // // // // // // //     color: '#fff',
// // // // // // // //     fontWeight: '600',
// // // // // // // //   },
// // // // // // // //   emptyContainer: {
// // // // // // // //     flex: 1,
// // // // // // // //     alignItems: 'center',
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     padding: 40,
// // // // // // // //   },
// // // // // // // //   emptyText: {
// // // // // // // //     color: '#666',
// // // // // // // //     fontSize: 18,
// // // // // // // //     textAlign: 'center',
// // // // // // // //     marginTop: 16,
// // // // // // // //   },
// // // // // // // // });

// // // // // // // // export default DistributorHomeScreen;
// // // // // // // import React, { useState, useCallback, useEffect } from 'react';
// // // // // // // import {
// // // // // // //   View,
// // // // // // //   Text,
// // // // // // //   TouchableOpacity,
// // // // // // //   FlatList,
// // // // // // //   StyleSheet,
// // // // // // //   ActivityIndicator,
// // // // // // //   Alert,
// // // // // // //   RefreshControl,
// // // // // // //   TextInput,
// // // // // // // } from 'react-native';
// // // // // // // import Ionicons from 'react-native-vector-icons/Ionicons';
// // // // // // // import { useNavigation } from '@react-navigation/native';
// // // // // // // import { useSelector, useDispatch } from 'react-redux';
// // // // // // // import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// // // // // // // import AsyncStorage from '@react-native-async-storage/async-storage';
// // // // // // // import { RootState, AppDispatch } from '../../store';
// // // // // // // import { logout } from '../../store/authSlice';
// // // // // // // import { RootStackParamList } from '../../navigation/types';
// // // // // // // import {
// // // // // // //   getAllVendors,
// // // // // // //   createRequest,
// // // // // // //   getDistributorDetailsById,
// // // // // // // } from '../../apiServices/allApi';

// // // // // // // type DistributorHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DistributorHome'>;

// // // // // // // type Vendor = {
// // // // // // //   id: string;
// // // // // // //   name: string;
// // // // // // //   contact: string;
// // // // // // //   address?: string;
// // // // // // //   business_name?: string;
// // // // // // //   location?: string;
// // // // // // //   village?: string;
// // // // // // //   pincode?: string;
// // // // // // //   cr?: number;
// // // // // // //   br?: number;
// // // // // // // };

// // // // // // // const DistributorHomeScreen = () => {
// // // // // // //   const navigation = useNavigation<DistributorHomeNavigationProp>();
// // // // // // //   const dispatch = useDispatch<AppDispatch>();

// // // // // // //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

// // // // // // //   const [vendors, setVendors] = useState<Vendor[]>([]);
// // // // // // //   const [requestedVendors, setRequestedVendors] = useState<string[]>([]);
// // // // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // // // //   const [refreshing, setRefreshing] = useState(false);
// // // // // // //   const [submittingId, setSubmittingId] = useState<string | null>(null);
// // // // // // //   const [error, setError] = useState<string | null>(null);
  
// // // // // // //   // User profile states
// // // // // // //   const [userPincode, setUserPincode] = useState<string>('');
// // // // // // //   const [showAllVendors, setShowAllVendors] = useState(false);
  
// // // // // // //   // Manual filter states
// // // // // // //   const [manualPincode, setManualPincode] = useState('');
// // // // // // //   const [showManualFilter, setShowManualFilter] = useState(false);
// // // // // // //   const [isFilterLoading, setIsFilterLoading] = useState(false);

// // // // // // //   // Enhanced network error handling
// // // // // // //   const handleNetworkError = useCallback((err: any) => {
// // // // // // //     console.log('🌐 Network error details:', err);

// // // // // // //     if (err.message?.includes('Network Error') || err.code === 'NETWORK_ERROR') {
// // // // // // //       return 'Network connection failed. Please check your internet connection and try again.';
// // // // // // //     } else if (err.response?.status === 401) {
// // // // // // //       return 'Authentication failed. Please login again.';
// // // // // // //     } else if (err.response?.status === 500) {
// // // // // // //       return 'Server error. Please try again later.';
// // // // // // //     } else if (err.response?.status === 404) {
// // // // // // //       return 'Service not found. Please check your connection.';
// // // // // // //     }
    
// // // // // // //     return err.response?.data?.message || err.message || 'Something went wrong. Please try again.';
// // // // // // //   }, []);

// // // // // // //   // Fetch distributor's profile to get their pincode
// // // // // // //   const fetchUserProfile = useCallback(async () => {
// // // // // // //     try {
// // // // // // //       if (!user?.userID) {
// // // // // // //         console.log('❌ No userID found');
// // // // // // //         return;
// // // // // // //       }
      
// // // // // // //       console.log('🔍 Fetching distributor profile for ID:', user.userID);
// // // // // // //       const response = await getDistributorDetailsById(user.userID);
// // // // // // //       console.log('👤 Distributor profile response received');
      
// // // // // // //       const profileData = response?.data?.data || response?.data;
      
// // // // // // //       if (profileData?.pincode) {
// // // // // // //         setUserPincode(profileData.pincode);
// // // // // // //         console.log('✅ Distributor pincode found:', profileData.pincode);
// // // // // // //       } else {
// // // // // // //         console.log('⚠️ No pincode found, showing all vendors');
// // // // // // //         setShowAllVendors(true);
// // // // // // //       }
// // // // // // //     } catch (err: any) {
// // // // // // //       console.log('❌ Error fetching distributor profile:', err.message);
// // // // // // //       setShowAllVendors(true);
// // // // // // //     }
// // // // // // //   }, [user?.userID]);

// // // // // // //   // ✅ FIXED: Django REST Framework pagination support for distributors
// // // // // // //   const fetchData = useCallback(async (filterPincode?: string) => {
// // // // // // //     setError(null);
// // // // // // //     setIsLoading(true);
    
// // // // // // //     try {
// // // // // // //       if (!user?.userID) {
// // // // // // //         throw new Error('Distributor ID not found. Please log in again.');
// // // // // // //       }

// // // // // // //       // Determine pincode filter
// // // // // // //       let pincodeToFilter = filterPincode;
// // // // // // //       if (!pincodeToFilter && !showAllVendors && userPincode) {
// // // // // // //         pincodeToFilter = userPincode;
// // // // // // //       }

// // // // // // //       console.log('🏪 Fetching vendors for distributor ID:', user.userID);
// // // // // // //       console.log('📍 Using pincode filter:', pincodeToFilter || 'all vendors');

// // // // // // //       const vendorRes = await getAllVendors(pincodeToFilter);
// // // // // // //       console.log('📡 Vendors response received');
// // // // // // //       console.log('📊 Response structure:', {
// // // // // // //         hasData: !!vendorRes.data,
// // // // // // //         keys: vendorRes.data ? Object.keys(vendorRes.data) : 'No data'
// // // // // // //       });

// // // // // // //       // ✅ MAIN FIX: Handle Django REST Framework pagination
// // // // // // //       let vendorList: Vendor[] = [];
      
// // // // // // //       if (vendorRes?.data?.results && Array.isArray(vendorRes.data.results)) {
// // // // // // //         // Django REST Framework pagination format
// // // // // // //         vendorList = vendorRes.data.results;
// // // // // // //         console.log('✅ Found vendors in data.results:', vendorList.length);
// // // // // // //         console.log('📋 Pagination details:', {
// // // // // // //           total: vendorRes.data.count,
// // // // // // //           hasNext: !!vendorRes.data.next,
// // // // // // //           hasPrevious: !!vendorRes.data.previous
// // // // // // //         });
// // // // // // //       } else if (vendorRes?.data?.data && Array.isArray(vendorRes.data.data)) {
// // // // // // //         // Nested data format
// // // // // // //         vendorList = vendorRes.data.data;
// // // // // // //         console.log('✅ Found vendors in data.data:', vendorList.length);
// // // // // // //       } else if (vendorRes?.data && Array.isArray(vendorRes.data)) {
// // // // // // //         // Direct array in data
// // // // // // //         vendorList = vendorRes.data;
// // // // // // //         console.log('✅ Found vendors in data:', vendorList.length);
// // // // // // //       } else {
// // // // // // //         console.log('❌ No vendor array found in response');
// // // // // // //         console.log('🔍 Raw response data:', vendorRes?.data);
// // // // // // //         vendorList = [];
// // // // // // //       }

// // // // // // //       // Log first vendor for debugging
// // // // // // //       if (vendorList.length > 0) {
// // // // // // //         console.log('🏪 Sample vendor for distributor:', {
// // // // // // //           id: vendorList[0].id,
// // // // // // //           name: vendorList[0].name || vendorList[0].business_name,
// // // // // // //           hasContact: !!vendorList[0].contact
// // // // // // //         });
// // // // // // //       }

// // // // // // //       setVendors(vendorList);

// // // // // // //       if (vendorList.length > 0) {
// // // // // // //         console.log(`✅ Distributor successfully loaded ${vendorList.length} vendors`);
// // // // // // //       } else {
// // // // // // //         console.log('⚠️ No vendors found for distributor with current filter');
// // // // // // //       }

// // // // // // //     } catch (err: any) {
// // // // // // //       console.log('❌ Distributor vendor fetch error:', err.message);
// // // // // // //       const errorMessage = handleNetworkError(err);
// // // // // // //       setError(errorMessage);
// // // // // // //       setVendors([]);
// // // // // // //     } finally {
// // // // // // //       setIsLoading(false);
// // // // // // //       setRefreshing(false);
// // // // // // //       setIsFilterLoading(false);
// // // // // // //     }
// // // // // // //   }, [user?.userID, userPincode, showAllVendors, handleNetworkError]);

// // // // // // //   const onRefresh = useCallback(() => {
// // // // // // //     setRefreshing(true);
// // // // // // //     const currentFilter = manualPincode || (showAllVendors ? undefined : userPincode);
// // // // // // //     fetchData(currentFilter);
// // // // // // //   }, [fetchData, manualPincode, showAllVendors, userPincode]);

// // // // // // //   const handleManualFilter = useCallback(() => {
// // // // // // //     if (manualPincode.trim() && manualPincode.length === 6) {
// // // // // // //       setIsFilterLoading(true);
// // // // // // //       fetchData(manualPincode.trim());
// // // // // // //     } else if (manualPincode.trim() === '') {
// // // // // // //       setIsFilterLoading(true);
// // // // // // //       fetchData(showAllVendors ? undefined : userPincode);
// // // // // // //     } else {
// // // // // // //       Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pincode');
// // // // // // //     }
// // // // // // //   }, [manualPincode, fetchData, showAllVendors, userPincode]);

// // // // // // //   const showAllVendorsHandler = useCallback(() => {
// // // // // // //     console.log('🌐 Distributor showing all vendors');
// // // // // // //     setShowAllVendors(true);
// // // // // // //     setManualPincode('');
// // // // // // //     fetchData();
// // // // // // //   }, [fetchData]);

// // // // // // //   const showMyAreaVendors = useCallback(() => {
// // // // // // //     if (userPincode) {
// // // // // // //       console.log('📍 Distributor showing vendors for area:', userPincode);
// // // // // // //       setShowAllVendors(false);
// // // // // // //       setManualPincode('');
// // // // // // //       fetchData(userPincode);
// // // // // // //     } else {
// // // // // // //       Alert.alert('No Pincode', 'Please update your profile with your pincode first');
// // // // // // //     }
// // // // // // //   }, [fetchData, userPincode]);

// // // // // // //   const clearManualFilter = useCallback(() => {
// // // // // // //     setManualPincode('');
// // // // // // //     setIsFilterLoading(true);
// // // // // // //     fetchData(showAllVendors ? undefined : userPincode);
// // // // // // //   }, [fetchData, showAllVendors, userPincode]);

// // // // // // //   // ✅ FIXED: Use the response variable to avoid TypeScript error
// // // // // // //   const sendRequest = useCallback(async (vendorId: string) => {
// // // // // // //     try {
// // // // // // //       setSubmittingId(vendorId);

// // // // // // //       if (!user?.userID) {
// // // // // // //         throw new Error('Distributor ID not found. Please log in again.');
// // // // // // //       }

// // // // // // //       const payload = {
// // // // // // //         user_id: parseInt(user.userID.toString(), 10),
// // // // // // //         user_type: 'distributor',
// // // // // // //         vendor: parseInt(vendorId, 10),
// // // // // // //       };

// // // // // // //       console.log('📤 Distributor sending join request for vendor:', vendorId);
// // // // // // //       const response = await createRequest(payload);
      
// // // // // // //       // ✅ FIX: Actually use the response variable
// // // // // // //       console.log('✅ Distributor request sent successfully:', response?.data?.message || 'Request completed');

// // // // // // //       Alert.alert('Success', 'Request sent to vendor successfully!');
// // // // // // //       setRequestedVendors(prev => [...prev, vendorId]);
// // // // // // //     } catch (err: any) {
// // // // // // //       console.log('❌ Distributor request error:', err.message);
// // // // // // //       const errorMessage = handleNetworkError(err);
// // // // // // //       Alert.alert('Error', errorMessage);
// // // // // // //     } finally {
// // // // // // //       setSubmittingId(null);
// // // // // // //     }
// // // // // // //   }, [user?.userID, handleNetworkError]);

// // // // // // //   const handleLogout = useCallback(() => {
// // // // // // //     Alert.alert(
// // // // // // //       'Logout',
// // // // // // //       'Are you sure you want to log out?',
// // // // // // //       [
// // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // //         {
// // // // // // //           text: 'Logout',
// // // // // // //           style: 'destructive',
// // // // // // //           onPress: async () => {
// // // // // // //             try {
// // // // // // //               await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
// // // // // // //               dispatch(logout());
// // // // // // //               navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
// // // // // // //             } catch (err) {
// // // // // // //               console.error('Logout error:', err);
// // // // // // //             }
// // // // // // //           },
// // // // // // //         },
// // // // // // //       ],
// // // // // // //       { cancelable: true }
// // // // // // //     );
// // // // // // //   }, [dispatch, navigation]);

// // // // // // //   const renderVendor = useCallback(({ item }: { item: Vendor }) => {
// // // // // // //     const isRequested = requestedVendors.includes(item.id);
// // // // // // //     const isSubmitting = submittingId === item.id;

// // // // // // //     const vendorName = item.name || item.business_name || 'Unnamed Vendor';
// // // // // // //     const village = item.village || item.location || item.address || 'No location';
// // // // // // //     const vendorPincode = item.pincode ? ` - ${item.pincode}` : '';
// // // // // // //     const contact = item.contact || 'No contact';

// // // // // // //     return (
// // // // // // //       <View style={styles.card}>
// // // // // // //         <View style={styles.info}>
// // // // // // //           <Text style={styles.name}>{vendorName}</Text>

// // // // // // //           <View style={styles.contactRow}>
// // // // // // //             <Ionicons name="call-outline" size={16} color="#666" />
// // // // // // //             <Text style={styles.contact}>{contact}</Text>
// // // // // // //           </View>

// // // // // // //           <View style={styles.addressRow}>
// // // // // // //             <Ionicons name="location-outline" size={16} color="#666" />
// // // // // // //             <Text style={styles.address}>{village}{vendorPincode}</Text>
// // // // // // //           </View>

// // // // // // //           <Text style={styles.rateText}>
// // // // // // //             Cow Milk: {item.cr != null ? `₹${item.cr}/L` : 'Rate not set'}
// // // // // // //           </Text>
// // // // // // //           <Text style={styles.rateText}>
// // // // // // //             Buffalo Milk: {item.br != null ? `₹${item.br}/L` : 'Rate not set'}
// // // // // // //           </Text>
// // // // // // //         </View>

// // // // // // //         <TouchableOpacity
// // // // // // //           style={[styles.button, (isRequested || isSubmitting) && styles.buttonDisabled]}
// // // // // // //           onPress={() => !isRequested && !isSubmitting && sendRequest(item.id)}
// // // // // // //           disabled={isRequested || isSubmitting}
// // // // // // //         >
// // // // // // //           {isSubmitting ? (
// // // // // // //             <ActivityIndicator size="small" color="#fff" />
// // // // // // //           ) : (
// // // // // // //             <Text style={styles.buttonText}>
// // // // // // //               {isRequested ? 'Requested' : 'Join Vendor'}
// // // // // // //             </Text>
// // // // // // //           )}
// // // // // // //         </TouchableOpacity>
// // // // // // //       </View>
// // // // // // //     );
// // // // // // //   }, [requestedVendors, submittingId, sendRequest]);

// // // // // // //   // Initialize
// // // // // // //   useEffect(() => {
// // // // // // //     console.log('🚀 Initializing DistributorHomeScreen');
// // // // // // //     fetchUserProfile();
// // // // // // //   }, [fetchUserProfile]);

// // // // // // //   // Fetch vendors when conditions are met
// // // // // // //   useEffect(() => {
// // // // // // //     if (userPincode || showAllVendors) {
// // // // // // //       console.log('✅ Distributor fetching vendors - conditions met');
// // // // // // //       fetchData();
// // // // // // //     }
// // // // // // //   }, [userPincode, showAllVendors, fetchData]);

// // // // // // //   if (!isAuthenticated || !user?.userID) {
// // // // // // //     return (
// // // // // // //       <View style={[styles.container, styles.centered]}>
// // // // // // //         <ActivityIndicator size="large" color="#007AFF" />
// // // // // // //         <Text style={styles.loadingText}>Loading distributor information...</Text>
// // // // // // //       </View>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   const currentFilterText = manualPincode 
// // // // // // //     ? `Filtered by: ${manualPincode}` 
// // // // // // //     : showAllVendors 
// // // // // // //       ? 'Showing all vendors' 
// // // // // // //       : userPincode 
// // // // // // //         ? `Your area: ${userPincode}` 
// // // // // // //         : 'No filter applied';

// // // // // // //   return (
// // // // // // //     <View style={styles.container}>
// // // // // // //       {/* Header */}
// // // // // // //       <View style={styles.header}>
// // // // // // //         <View style={styles.headerLeft}>
// // // // // // //           <Text style={styles.title}>Available Vendors</Text>
// // // // // // //           <TouchableOpacity 
// // // // // // //             onPress={() => setShowManualFilter(!showManualFilter)}
// // // // // // //             style={styles.filterToggle}
// // // // // // //           >
// // // // // // //             <Ionicons 
// // // // // // //               name={showManualFilter ? "chevron-up-outline" : "filter-outline"} 
// // // // // // //               size={24} 
// // // // // // //               color="#007AFF" 
// // // // // // //             />
// // // // // // //           </TouchableOpacity>
// // // // // // //         </View>
// // // // // // //         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
// // // // // // //           <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
// // // // // // //         </TouchableOpacity>
// // // // // // //       </View>

// // // // // // //       {/* Status Bar */}
// // // // // // //       <View style={styles.statusContainer}>
// // // // // // //         <Text style={styles.statusText}>{currentFilterText}</Text>
// // // // // // //         <Text style={styles.debugText}>Found: {vendors.length}</Text>
// // // // // // //         <View style={styles.filterActions}>
// // // // // // //           {!showAllVendors && userPincode && (
// // // // // // //             <TouchableOpacity style={styles.actionButton} onPress={showAllVendorsHandler}>
// // // // // // //               <Text style={styles.actionText}>Show All</Text>
// // // // // // //             </TouchableOpacity>
// // // // // // //           )}
// // // // // // //           {showAllVendors && userPincode && (
// // // // // // //             <TouchableOpacity style={styles.actionButton} onPress={showMyAreaVendors}>
// // // // // // //               <Text style={styles.actionText}>My Area</Text>
// // // // // // //             </TouchableOpacity>
// // // // // // //           )}
// // // // // // //         </View>
// // // // // // //       </View>

// // // // // // //       {/* Manual Filter */}
// // // // // // //       {showManualFilter && (
// // // // // // //         <View style={styles.filterContainer}>
// // // // // // //           <View style={styles.pincodeInputContainer}>
// // // // // // //             <TextInput
// // // // // // //               style={styles.pincodeInput}
// // // // // // //               placeholder="Enter 6-digit pincode"
// // // // // // //               value={manualPincode}
// // // // // // //               onChangeText={setManualPincode}
// // // // // // //               keyboardType="numeric"
// // // // // // //               maxLength={6}
// // // // // // //               placeholderTextColor="#999"
// // // // // // //             />
// // // // // // //             <TouchableOpacity 
// // // // // // //               style={[styles.filterButton, isFilterLoading && styles.filterButtonDisabled]}
// // // // // // //               onPress={handleManualFilter}
// // // // // // //               disabled={isFilterLoading}
// // // // // // //             >
// // // // // // //               {isFilterLoading ? (
// // // // // // //                 <ActivityIndicator size="small" color="#fff" />
// // // // // // //               ) : (
// // // // // // //                 <Ionicons name="search-outline" size={20} color="#fff" />
// // // // // // //               )}
// // // // // // //             </TouchableOpacity>
// // // // // // //             {manualPincode.length > 0 && (
// // // // // // //               <TouchableOpacity style={styles.clearButton} onPress={clearManualFilter}>
// // // // // // //                 <Ionicons name="close-outline" size={20} color="#666" />
// // // // // // //               </TouchableOpacity>
// // // // // // //             )}
// // // // // // //           </View>
// // // // // // //         </View>
// // // // // // //       )}

// // // // // // //       {/* Error Banner */}
// // // // // // //       {error && (
// // // // // // //         <View style={styles.errorBanner}>
// // // // // // //           <View style={styles.errorContent}>
// // // // // // //             <Ionicons name="warning-outline" size={20} color="#c00" />
// // // // // // //             <Text style={styles.errorText}>{error}</Text>
// // // // // // //           </View>
// // // // // // //           <TouchableOpacity onPress={onRefresh} style={styles.retry}>
// // // // // // //             <Text style={styles.retryText}>Retry</Text>
// // // // // // //           </TouchableOpacity>
// // // // // // //         </View>
// // // // // // //       )}

// // // // // // //       {/* Vendor List */}
// // // // // // //       <FlatList
// // // // // // //         data={vendors}
// // // // // // //         renderItem={renderVendor}
// // // // // // //         keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // // // // // //         contentContainerStyle={styles.listContent}
// // // // // // //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// // // // // // //         ListEmptyComponent={() => (
// // // // // // //           <View style={styles.emptyContainer}>
// // // // // // //             {isLoading ? (
// // // // // // //               <>
// // // // // // //                 <ActivityIndicator size="large" color="#007AFF" />
// // // // // // //                 <Text style={styles.loadingText}>Loading vendors...</Text>
// // // // // // //               </>
// // // // // // //             ) : (
// // // // // // //               <>
// // // // // // //                 <Ionicons name="storefront-outline" size={64} color="#ccc" />
// // // // // // //                 <Text style={styles.emptyText}>
// // // // // // //                   {error 
// // // // // // //                     ? 'Unable to load vendors' 
// // // // // // //                     : manualPincode 
// // // // // // //                       ? `No vendors found in ${manualPincode}` 
// // // // // // //                       : !showAllVendors && userPincode
// // // // // // //                         ? `No vendors in your area (${userPincode})`
// // // // // // //                         : 'No vendors available'
// // // // // // //                   }
// // // // // // //                 </Text>
// // // // // // //                 {!showAllVendors && userPincode && !error && (
// // // // // // //                   <TouchableOpacity style={styles.showAllButton} onPress={showAllVendorsHandler}>
// // // // // // //                     <Text style={styles.showAllText}>Show All Vendors</Text>
// // // // // // //                   </TouchableOpacity>
// // // // // // //                 )}
// // // // // // //               </>
// // // // // // //             )}
// // // // // // //           </View>
// // // // // // //         )}
// // // // // // //         showsVerticalScrollIndicator={false}
// // // // // // //       />
// // // // // // //     </View>
// // // // // // //   );
// // // // // // // };

// // // // // // // const styles = StyleSheet.create({
// // // // // // //   container: { 
// // // // // // //     flex: 1, 
// // // // // // //     backgroundColor: '#f8f9fa' 
// // // // // // //   },
// // // // // // //   centered: { 
// // // // // // //     justifyContent: 'center', 
// // // // // // //     alignItems: 'center' 
// // // // // // //   },
// // // // // // //   loadingText: { 
// // // // // // //     marginTop: 16, 
// // // // // // //     color: '#666', 
// // // // // // //     fontSize: 16 
// // // // // // //   },
  
// // // // // // //   header: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     padding: 16,
// // // // // // //     paddingTop: 50,
// // // // // // //     backgroundColor: '#fff',
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: '#eee',
// // // // // // //   },
// // // // // // //   headerLeft: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     flex: 1,
// // // // // // //   },
// // // // // // //   title: { 
// // // // // // //     fontSize: 20, 
// // // // // // //     fontWeight: 'bold', 
// // // // // // //     color: '#333', 
// // // // // // //     marginRight: 12 
// // // // // // //   },
// // // // // // //   filterToggle: {
// // // // // // //     padding: 4,
// // // // // // //   },
// // // // // // //   logoutButton: { 
// // // // // // //     padding: 4 
// // // // // // //   },
  
// // // // // // //   statusContainer: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     alignItems: 'center',
// // // // // // //     backgroundColor: '#e3f2fd',
// // // // // // //     padding: 12,
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: '#eee',
// // // // // // //   },
// // // // // // //   statusText: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#1976d2',
// // // // // // //     fontWeight: '500',
// // // // // // //     flex: 1,
// // // // // // //   },
// // // // // // //   debugText: {
// // // // // // //     fontSize: 12,
// // // // // // //     color: '#666',
// // // // // // //     fontWeight: '600',
// // // // // // //     marginRight: 8,
// // // // // // //   },
// // // // // // //   filterActions: {
// // // // // // //     flexDirection: 'row',
// // // // // // //   },
// // // // // // //   actionButton: {
// // // // // // //     backgroundColor: '#1976d2',
// // // // // // //     paddingHorizontal: 12,
// // // // // // //     paddingVertical: 6,
// // // // // // //     borderRadius: 6,
// // // // // // //     marginLeft: 8,
// // // // // // //   },
// // // // // // //   actionText: {
// // // // // // //     color: '#fff',
// // // // // // //     fontSize: 12,
// // // // // // //     fontWeight: '600',
// // // // // // //   },
  
// // // // // // //   filterContainer: {
// // // // // // //     backgroundColor: '#fff',
// // // // // // //     padding: 16,
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: '#eee',
// // // // // // //   },
// // // // // // //   pincodeInputContainer: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //   },
// // // // // // //   pincodeInput: {
// // // // // // //     flex: 1,
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: '#ddd',
// // // // // // //     borderRadius: 8,
// // // // // // //     paddingHorizontal: 12,
// // // // // // //     paddingVertical: 10,
// // // // // // //     fontSize: 16,
// // // // // // //     backgroundColor: '#fafafa',
// // // // // // //   },
// // // // // // //   filterButton: {
// // // // // // //     backgroundColor: '#007AFF',
// // // // // // //     borderRadius: 8,
// // // // // // //     paddingHorizontal: 16,
// // // // // // //     paddingVertical: 10,
// // // // // // //     marginLeft: 8,
// // // // // // //     minWidth: 50,
// // // // // // //     alignItems: 'center',
// // // // // // //   },
// // // // // // //   filterButtonDisabled: {
// // // // // // //     backgroundColor: '#ccc',
// // // // // // //   },
// // // // // // //   clearButton: {
// // // // // // //     padding: 8,
// // // // // // //     marginLeft: 4,
// // // // // // //   },

// // // // // // //   errorBanner: {
// // // // // // //     backgroundColor: '#fff0f0',
// // // // // // //     padding: 16,
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: '#ffcdd2',
// // // // // // //   },
// // // // // // //   errorContent: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'flex-start',
// // // // // // //     marginBottom: 8,
// // // // // // //   },
// // // // // // //   errorText: { 
// // // // // // //     color: '#c00', 
// // // // // // //     fontSize: 14, 
// // // // // // //     flex: 1, 
// // // // // // //     marginLeft: 8, 
// // // // // // //     lineHeight: 20 
// // // // // // //   },
// // // // // // //   retry: {
// // // // // // //     backgroundColor: '#007AFF',
// // // // // // //     paddingHorizontal: 16,
// // // // // // //     paddingVertical: 8,
// // // // // // //     borderRadius: 8,
// // // // // // //     alignSelf: 'flex-start',
// // // // // // //   },
// // // // // // //   retryText: { 
// // // // // // //     color: '#fff', 
// // // // // // //     fontSize: 14, 
// // // // // // //     fontWeight: '600' 
// // // // // // //   },
  
// // // // // // //   listContent: { 
// // // // // // //     paddingBottom: 16 
// // // // // // //   },
// // // // // // //   card: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     backgroundColor: '#fff',
// // // // // // //     borderRadius: 12,
// // // // // // //     padding: 16,
// // // // // // //     marginHorizontal: 16,
// // // // // // //     marginTop: 12,
// // // // // // //     shadowColor: '#000',
// // // // // // //     shadowOffset: { width: 0, height: 2 },
// // // // // // //     shadowOpacity: 0.1,
// // // // // // //     shadowRadius: 4,
// // // // // // //     elevation: 3,
// // // // // // //   },
// // // // // // //   info: { 
// // // // // // //     flex: 1 
// // // // // // //   },
// // // // // // //   name: { 
// // // // // // //     fontSize: 18, 
// // // // // // //     fontWeight: 'bold', 
// // // // // // //     color: '#333', 
// // // // // // //     marginBottom: 8 
// // // // // // //   },
// // // // // // //   contactRow: { 
// // // // // // //     flexDirection: 'row', 
// // // // // // //     alignItems: 'center', 
// // // // // // //     marginBottom: 4 
// // // // // // //   },
// // // // // // //   contact: { 
// // // // // // //     fontSize: 14, 
// // // // // // //     color: '#666', 
// // // // // // //     marginLeft: 8 
// // // // // // //   },
// // // // // // //   addressRow: { 
// // // // // // //     flexDirection: 'row', 
// // // // // // //     alignItems: 'center', 
// // // // // // //     marginBottom: 4 
// // // // // // //   },
// // // // // // //   address: { 
// // // // // // //     fontSize: 14, 
// // // // // // //     color: '#666', 
// // // // // // //     marginLeft: 8 
// // // // // // //   },
// // // // // // //   rateText: { 
// // // // // // //     fontSize: 14, 
// // // // // // //     color: '#704214', 
// // // // // // //     marginTop: 2 
// // // // // // //   },
// // // // // // //   button: {
// // // // // // //     backgroundColor: '#007AFF',
// // // // // // //     paddingHorizontal: 16,
// // // // // // //     paddingVertical: 8,
// // // // // // //     borderRadius: 8,
// // // // // // //     minWidth: 120,
// // // // // // //     alignItems: 'center',
// // // // // // //   },
// // // // // // //   buttonDisabled: { 
// // // // // // //     backgroundColor: '#C0C0C0' 
// // // // // // //   },
// // // // // // //   buttonText: { 
// // // // // // //     color: '#fff', 
// // // // // // //     fontWeight: '600' 
// // // // // // //   },
  
// // // // // // //   emptyContainer: { 
// // // // // // //     flex: 1, 
// // // // // // //     alignItems: 'center', 
// // // // // // //     justifyContent: 'center', 
// // // // // // //     padding: 40 
// // // // // // //   },
// // // // // // //   emptyText: { 
// // // // // // //     color: '#666', 
// // // // // // //     fontSize: 18, 
// // // // // // //     textAlign: 'center', 
// // // // // // //     marginTop: 16 
// // // // // // //   },
// // // // // // //   showAllButton: {
// // // // // // //     marginTop: 16,
// // // // // // //     backgroundColor: '#007AFF',
// // // // // // //     paddingHorizontal: 20,
// // // // // // //     paddingVertical: 10,
// // // // // // //     borderRadius: 8,
// // // // // // //   },
// // // // // // //   showAllText: {
// // // // // // //     color: '#fff',
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //   },
// // // // // // // });

// // // // // // // export default DistributorHomeScreen;
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
// // // // // //   TextInput,
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
// // // // // //   getDistributorDetailsById,
// // // // // //   getDistributorVendorStatus,
// // // // // // } from '../../apiServices/allApi';

// // // // // // type DistributorHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DistributorHome'>;

// // // // // // type Vendor = {
// // // // // //   id: string;
// // // // // //   name: string;
// // // // // //   contact: string;
// // // // // //   address?: string;
// // // // // //   business_name?: string;
// // // // // //   location?: string;
// // // // // //   village?: string;
// // // // // //   pincode?: string;
// // // // // //   cr?: number;
// // // // // //   br?: number;
// // // // // // };

// // // // // // interface DistributorVendorStatus {
// // // // // //   isJoined: boolean;
// // // // // //   currentVendorId?: string;
// // // // // //   currentVendorName?: string;
// // // // // //   joinedDate?: string;
// // // // // //   status?: 'approved' | 'pending' | 'rejected';
// // // // // // }

// // // // // // const DistributorHomeScreen = () => {
// // // // // //   const navigation = useNavigation<DistributorHomeNavigationProp>();
// // // // // //   const dispatch = useDispatch<AppDispatch>();

// // // // // //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

// // // // // //   const [vendors, setVendors] = useState<Vendor[]>([]);
// // // // // //   const [requestedVendors, setRequestedVendors] = useState<string[]>([]);
// // // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // // //   const [refreshing, setRefreshing] = useState(false);
// // // // // //   const [submittingId, setSubmittingId] = useState<string | null>(null);
// // // // // //   const [error, setError] = useState<string | null>(null);
  
// // // // // //   // Distributor vendor status state
// // // // // //   const [distributorStatus, setDistributorStatus] = useState<DistributorVendorStatus>({
// // // // // //     isJoined: false,
// // // // // //   });
// // // // // //   const [statusLoading, setStatusLoading] = useState(true);
  
// // // // // //   // User profile states
// // // // // //   const [userPincode, setUserPincode] = useState<string>('');
// // // // // //   const [showAllVendors, setShowAllVendors] = useState(false);
  
// // // // // //   // Manual filter states
// // // // // //   const [manualPincode, setManualPincode] = useState('');
// // // // // //   const [showManualFilter, setShowManualFilter] = useState(false);
// // // // // //   const [isFilterLoading, setIsFilterLoading] = useState(false);

// // // // // //   // Enhanced network error handling
// // // // // //   const handleNetworkError = useCallback((err: any) => {
// // // // // //     console.log('🌐 Network error details:', err);

// // // // // //     if (err.message?.includes('Network Error') || err.code === 'NETWORK_ERROR') {
// // // // // //       return 'Network connection failed. Please check your internet connection and try again.';
// // // // // //     } else if (err.response?.status === 401) {
// // // // // //       return 'Authentication failed. Please login again.';
// // // // // //     } else if (err.response?.status === 500) {
// // // // // //       return 'Server error. Please try again later.';
// // // // // //     } else if (err.response?.status === 404) {
// // // // // //       return 'Service not found. Please check your connection.';
// // // // // //     }
    
// // // // // //     return err.response?.data?.message || err.message || 'Something went wrong. Please try again.';
// // // // // //   }, []);

// // // // // //   // Check distributor's current vendor status
// // // // // //   const fetchDistributorStatus = useCallback(async () => {
// // // // // //     try {
// // // // // //       if (!user?.userID) {
// // // // // //         console.log('❌ No distributor ID found');
// // // // // //         return;
// // // // // //       }

// // // // // //       setStatusLoading(true);
// // // // // //       console.log('🔍 Checking distributor vendor status for ID:', user.userID);

// // // // // //       const statusRes = await getDistributorVendorStatus(user.userID);
// // // // // //       console.log('📊 Distributor status response:', statusRes);

// // // // // //       const statusData = statusRes?.data?.data || statusRes?.data;
      
// // // // // //       if (statusData) {
// // // // // //         const status: DistributorVendorStatus = {
// // // // // //           isJoined: statusData.isJoined || false,
// // // // // //           currentVendorId: statusData.currentVendorId?.toString(),
// // // // // //           currentVendorName: statusData.currentVendorName,
// // // // // //           joinedDate: statusData.joinedDate,
// // // // // //           status: statusData.status || 'pending',
// // // // // //         };
        
// // // // // //         setDistributorStatus(status);
        
// // // // // //         if (status.isJoined) {
// // // // // //           console.log('✅ Distributor already joined vendor:', status.currentVendorName);
// // // // // //         } else {
// // // // // //           console.log('⚠️ Distributor not joined to any vendor yet');
// // // // // //         }
// // // // // //       }
// // // // // //     } catch (err: any) {
// // // // // //       console.log('❌ Error fetching distributor status:', err.message);
// // // // // //       // Don't show error for status check, just assume not joined
// // // // // //       setDistributorStatus({ isJoined: false });
// // // // // //     } finally {
// // // // // //       setStatusLoading(false);
// // // // // //     }
// // // // // //   }, [user?.userID]);

// // // // // //   // Fetch distributor's profile to get their pincode
// // // // // //   const fetchUserProfile = useCallback(async () => {
// // // // // //     try {
// // // // // //       if (!user?.userID) {
// // // // // //         console.log('❌ No userID found');
// // // // // //         return;
// // // // // //       }
      
// // // // // //       console.log('🔍 Fetching distributor profile for ID:', user.userID);
// // // // // //       const response = await getDistributorDetailsById(user.userID);
// // // // // //       console.log('👤 Distributor profile response received');
      
// // // // // //       const profileData = response?.data?.data || response?.data;
      
// // // // // //       if (profileData?.pincode) {
// // // // // //         setUserPincode(profileData.pincode);
// // // // // //         console.log('✅ Distributor pincode found:', profileData.pincode);
// // // // // //       } else {
// // // // // //         console.log('⚠️ No pincode found, showing all vendors');
// // // // // //         setShowAllVendors(true);
// // // // // //       }
// // // // // //     } catch (err: any) {
// // // // // //       console.log('❌ Error fetching distributor profile:', err.message);
// // // // // //       setShowAllVendors(true);
// // // // // //     }
// // // // // //   }, [user?.userID]);

// // // // // //   // Django REST Framework pagination support for distributors
// // // // // //   const fetchData = useCallback(async (filterPincode?: string) => {
// // // // // //     setError(null);
// // // // // //     setIsLoading(true);
    
// // // // // //     try {
// // // // // //       if (!user?.userID) {
// // // // // //         throw new Error('Distributor ID not found. Please log in again.');
// // // // // //       }

// // // // // //       // Determine pincode filter
// // // // // //       let pincodeToFilter = filterPincode;
// // // // // //       if (!pincodeToFilter && !showAllVendors && userPincode) {
// // // // // //         pincodeToFilter = userPincode;
// // // // // //       }

// // // // // //       console.log('🏪 Fetching vendors for distributor ID:', user.userID);
// // // // // //       console.log('📍 Using pincode filter:', pincodeToFilter || 'all vendors');

// // // // // //       const vendorRes = await getAllVendors(pincodeToFilter);
// // // // // //       console.log('📡 Vendors response received');

// // // // // //       // Handle Django REST Framework pagination
// // // // // //       let vendorList: Vendor[] = [];
      
// // // // // //       if (vendorRes?.data?.results && Array.isArray(vendorRes.data.results)) {
// // // // // //         vendorList = vendorRes.data.results;
// // // // // //         console.log('✅ Found vendors in data.results:', vendorList.length);
// // // // // //       } else if (vendorRes?.data?.data && Array.isArray(vendorRes.data.data)) {
// // // // // //         vendorList = vendorRes.data.data;
// // // // // //         console.log('✅ Found vendors in data.data:', vendorList.length);
// // // // // //       } else if (vendorRes?.data && Array.isArray(vendorRes.data)) {
// // // // // //         vendorList = vendorRes.data;
// // // // // //         console.log('✅ Found vendors in data:', vendorList.length);
// // // // // //       } else {
// // // // // //         console.log('❌ No vendor array found in response');
// // // // // //         vendorList = [];
// // // // // //       }

// // // // // //       setVendors(vendorList);

// // // // // //       if (vendorList.length > 0) {
// // // // // //         console.log(`✅ Distributor successfully loaded ${vendorList.length} vendors`);
// // // // // //       } else {
// // // // // //         console.log('⚠️ No vendors found for distributor with current filter');
// // // // // //       }

// // // // // //     } catch (err: any) {
// // // // // //       console.log('❌ Distributor vendor fetch error:', err.message);
// // // // // //       const errorMessage = handleNetworkError(err);
// // // // // //       setError(errorMessage);
// // // // // //       setVendors([]);
// // // // // //     } finally {
// // // // // //       setIsLoading(false);
// // // // // //       setRefreshing(false);
// // // // // //       setIsFilterLoading(false);
// // // // // //     }
// // // // // //   }, [user?.userID, userPincode, showAllVendors, handleNetworkError]);

// // // // // //   const onRefresh = useCallback(() => {
// // // // // //     setRefreshing(true);
// // // // // //     const currentFilter = manualPincode || (showAllVendors ? undefined : userPincode);
// // // // // //     // Also refresh distributor status
// // // // // //     fetchDistributorStatus();
// // // // // //     fetchData(currentFilter);
// // // // // //   }, [fetchData, fetchDistributorStatus, manualPincode, showAllVendors, userPincode]);

// // // // // //   const handleManualFilter = useCallback(() => {
// // // // // //     if (manualPincode.trim() && manualPincode.length === 6) {
// // // // // //       setIsFilterLoading(true);
// // // // // //       fetchData(manualPincode.trim());
// // // // // //     } else if (manualPincode.trim() === '') {
// // // // // //       setIsFilterLoading(true);
// // // // // //       fetchData(showAllVendors ? undefined : userPincode);
// // // // // //     } else {
// // // // // //       Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pincode');
// // // // // //     }
// // // // // //   }, [manualPincode, fetchData, showAllVendors, userPincode]);

// // // // // //   const showAllVendorsHandler = useCallback(() => {
// // // // // //     console.log('🌐 Distributor showing all vendors');
// // // // // //     setShowAllVendors(true);
// // // // // //     setManualPincode('');
// // // // // //     fetchData();
// // // // // //   }, [fetchData]);

// // // // // //   const showMyAreaVendors = useCallback(() => {
// // // // // //     if (userPincode) {
// // // // // //       console.log('📍 Distributor showing vendors for area:', userPincode);
// // // // // //       setShowAllVendors(false);
// // // // // //       setManualPincode('');
// // // // // //       fetchData(userPincode);
// // // // // //     } else {
// // // // // //       Alert.alert('No Pincode', 'Please update your profile with your pincode first');
// // // // // //     }
// // // // // //   }, [fetchData, userPincode]);

// // // // // //   const clearManualFilter = useCallback(() => {
// // // // // //     setManualPincode('');
// // // // // //     setIsFilterLoading(true);
// // // // // //     fetchData(showAllVendors ? undefined : userPincode);
// // // // // //   }, [fetchData, showAllVendors, userPincode]);

// // // // // //   // ✅ FIXED: Changed user_type from 'distributor' to 'milkman'
// // // // // //   const sendRequest = useCallback(async (vendorId: string) => {
// // // // // //     try {
// // // // // //       // Check if distributor already joined a vendor
// // // // // //       if (distributorStatus.isJoined) {
// // // // // //         Alert.alert(
// // // // // //           'Already Joined',
// // // // // //           `You are already working with ${distributorStatus.currentVendorName || 'a vendor'}. You can only work with one vendor at a time.`,
// // // // // //           [
// // // // // //             { text: 'OK', style: 'default' },
// // // // // //             {
// // // // // //               text: 'View Current Vendor',
// // // // // //               onPress: () => {
// // // // // //                 Alert.alert(
// // // // // //                   'Current Vendor',
// // // // // //                   `Vendor: ${distributorStatus.currentVendorName || 'Unknown'}\nStatus: ${distributorStatus.status || 'Pending'}\nJoined: ${distributorStatus.joinedDate || 'N/A'}`,
// // // // // //                   [{ text: 'OK' }]
// // // // // //                 );
// // // // // //               }
// // // // // //             }
// // // // // //           ]
// // // // // //         );
// // // // // //         return;
// // // // // //       }

// // // // // //       setSubmittingId(vendorId);

// // // // // //       if (!user?.userID) {
// // // // // //         throw new Error('Distributor ID not found. Please log in again.');
// // // // // //       }

// // // // // //       // ✅ MAIN FIX: Use 'milkman' instead of 'distributor' to match backend validation
// // // // // //       const payload = {
// // // // // //         user_id: parseInt(user.userID.toString(), 10),
// // // // // //         user_type: 'milkman', // ← Changed from 'distributor' to 'milkman'
// // // // // //         vendor: parseInt(vendorId, 10),
// // // // // //       };

// // // // // //       console.log('📤 Distributor sending join request with payload:', payload);
// // // // // //       const response = await createRequest(payload);
      
// // // // // //       console.log('✅ Distributor request sent successfully:', response?.data?.message || 'Request completed');

// // // // // //       Alert.alert(
// // // // // //         'Success', 
// // // // // //         'Request sent to vendor successfully! You can only work with one vendor at a time. Please wait for approval.',
// // // // // //         [{ text: 'OK' }]
// // // // // //       );
      
// // // // // //       setRequestedVendors(prev => [...prev, vendorId]);
      
// // // // // //       // Refresh distributor status after successful request
// // // // // //       fetchDistributorStatus();
      
// // // // // //     } catch (err: any) {
// // // // // //       console.log('❌ Distributor request error:', err.message);
// // // // // //       console.log('❌ Full error object:', err);
// // // // // //       const errorMessage = handleNetworkError(err);
// // // // // //       Alert.alert('Error', errorMessage);
// // // // // //     } finally {
// // // // // //       setSubmittingId(null);
// // // // // //     }
// // // // // //   }, [user?.userID, handleNetworkError, distributorStatus.isJoined, distributorStatus.currentVendorName, distributorStatus.status, distributorStatus.joinedDate, fetchDistributorStatus]);

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

// // // // // //   // Render vendor with join restriction logic
// // // // // //   const renderVendor = useCallback(({ item }: { item: Vendor }) => {
// // // // // //     const isRequested = requestedVendors.includes(item.id);
// // // // // //     const isSubmitting = submittingId === item.id;
    
// // // // // //     // Check if this is the current joined vendor
// // // // // //     const isCurrentVendor = distributorStatus.isJoined && 
// // // // // //                             distributorStatus.currentVendorId === item.id;
    
// // // // // //     // Disable all vendors if already joined to another
// // // // // //     const isDisabledDueToJoined = distributorStatus.isJoined && !isCurrentVendor;

// // // // // //     const vendorName = item.name || item.business_name || 'Unnamed Vendor';
// // // // // //     const village = item.village || item.location || item.address || 'No location';
// // // // // //     const vendorPincode = item.pincode ? ` - ${item.pincode}` : '';
// // // // // //     const contact = item.contact || 'No contact';

// // // // // //     return (
// // // // // //       <View style={[
// // // // // //         styles.card, 
// // // // // //         isCurrentVendor && styles.currentVendorCard,
// // // // // //         isDisabledDueToJoined && styles.disabledCard
// // // // // //       ]}>
// // // // // //         {/* Current vendor badge */}
// // // // // //         {isCurrentVendor && (
// // // // // //           <View style={styles.currentVendorBadge}>
// // // // // //             <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
// // // // // //             <Text style={styles.currentVendorBadgeText}>Current Vendor</Text>
// // // // // //           </View>
// // // // // //         )}
        
// // // // // //         <View style={styles.info}>
// // // // // //           <Text style={[
// // // // // //             styles.name,
// // // // // //             isDisabledDueToJoined && styles.disabledText
// // // // // //           ]}>
// // // // // //             {vendorName}
// // // // // //           </Text>

// // // // // //           <View style={styles.contactRow}>
// // // // // //             <Ionicons name="call-outline" size={16} color={isDisabledDueToJoined ? "#ccc" : "#666"} />
// // // // // //             <Text style={[
// // // // // //               styles.contact,
// // // // // //               isDisabledDueToJoined && styles.disabledText
// // // // // //             ]}>
// // // // // //               {contact}
// // // // // //             </Text>
// // // // // //           </View>

// // // // // //           <View style={styles.addressRow}>
// // // // // //             <Ionicons name="location-outline" size={16} color={isDisabledDueToJoined ? "#ccc" : "#666"} />
// // // // // //             <Text style={[
// // // // // //               styles.address,
// // // // // //               isDisabledDueToJoined && styles.disabledText
// // // // // //             ]}>
// // // // // //               {village}{vendorPincode}
// // // // // //             </Text>
// // // // // //           </View>

// // // // // //           <Text style={[
// // // // // //             styles.rateText,
// // // // // //             isDisabledDueToJoined && styles.disabledText
// // // // // //           ]}>
// // // // // //             Cow Milk: {item.cr != null ? `₹${item.cr}/L` : 'Rate not set'}
// // // // // //           </Text>
// // // // // //           <Text style={[
// // // // // //             styles.rateText,
// // // // // //             isDisabledDueToJoined && styles.disabledText
// // // // // //           ]}>
// // // // // //             Buffalo Milk: {item.br != null ? `₹${item.br}/L` : 'Rate not set'}
// // // // // //           </Text>
// // // // // //         </View>

// // // // // //         <TouchableOpacity
// // // // // //           style={[
// // // // // //             styles.button,
// // // // // //             (isRequested || isSubmitting || isDisabledDueToJoined) && styles.buttonDisabled,
// // // // // //             isCurrentVendor && styles.currentVendorButton
// // // // // //           ]}
// // // // // //           onPress={() => !isRequested && !isSubmitting && !isDisabledDueToJoined && sendRequest(item.id)}
// // // // // //           disabled={isRequested || isSubmitting || isDisabledDueToJoined}
// // // // // //         >
// // // // // //           {isSubmitting ? (
// // // // // //             <ActivityIndicator size="small" color="#fff" />
// // // // // //           ) : (
// // // // // //             <Text style={[
// // // // // //               styles.buttonText,
// // // // // //               isCurrentVendor && styles.currentVendorButtonText
// // // // // //             ]}>
// // // // // //               {isCurrentVendor 
// // // // // //                 ? `Joined (${distributorStatus.status || 'Pending'})`
// // // // // //                 : isRequested 
// // // // // //                   ? 'Requested'
// // // // // //                   : isDisabledDueToJoined
// // // // // //                     ? 'Already Joined Other'
// // // // // //                     : 'Join Vendor'
// // // // // //               }
// // // // // //             </Text>
// // // // // //           )}
// // // // // //         </TouchableOpacity>
// // // // // //       </View>
// // // // // //     );
// // // // // //   }, [requestedVendors, submittingId, sendRequest, distributorStatus]);

// // // // // //   // Initialize
// // // // // //   useEffect(() => {
// // // // // //     console.log('🚀 Initializing DistributorHomeScreen');
// // // // // //     fetchUserProfile();
// // // // // //     fetchDistributorStatus();
// // // // // //   }, [fetchUserProfile, fetchDistributorStatus]);

// // // // // //   // Fetch vendors when conditions are met
// // // // // //   useEffect(() => {
// // // // // //     if (userPincode || showAllVendors) {
// // // // // //       console.log('✅ Distributor fetching vendors - conditions met');
// // // // // //       fetchData();
// // // // // //     }
// // // // // //   }, [userPincode, showAllVendors, fetchData]);

// // // // // //   if (!isAuthenticated || !user?.userID) {
// // // // // //     return (
// // // // // //       <View style={[styles.container, styles.centered]}>
// // // // // //         <ActivityIndicator size="large" color="#007AFF" />
// // // // // //         <Text style={styles.loadingText}>Loading distributor information...</Text>
// // // // // //       </View>
// // // // // //     );
// // // // // //   }

// // // // // //   const currentFilterText = manualPincode 
// // // // // //     ? `Filtered by: ${manualPincode}` 
// // // // // //     : showAllVendors 
// // // // // //       ? 'Showing all vendors' 
// // // // // //       : userPincode 
// // // // // //         ? `Your area: ${userPincode}` 
// // // // // //         : 'No filter applied';

// // // // // //   return (
// // // // // //     <View style={styles.container}>
// // // // // //       {/* Header */}
// // // // // //       <View style={styles.header}>
// // // // // //         <View style={styles.headerLeft}>
// // // // // //           <Text style={styles.title}>Available Vendors</Text>
// // // // // //           <TouchableOpacity 
// // // // // //             onPress={() => setShowManualFilter(!showManualFilter)}
// // // // // //             style={styles.filterToggle}
// // // // // //           >
// // // // // //             <Ionicons 
// // // // // //               name={showManualFilter ? "chevron-up-outline" : "filter-outline"} 
// // // // // //               size={24} 
// // // // // //               color="#007AFF" 
// // // // // //             />
// // // // // //           </TouchableOpacity>
// // // // // //         </View>
// // // // // //         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
// // // // // //           <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
// // // // // //         </TouchableOpacity>
// // // // // //       </View>

// // // // // //       {/* Distributor Status Banner */}
// // // // // //       {statusLoading ? (
// // // // // //         <View style={styles.statusBanner}>
// // // // // //           <ActivityIndicator size="small" color="#666" />
// // // // // //           <Text style={styles.statusText}>Checking vendor status...</Text>
// // // // // //         </View>
// // // // // //       ) : distributorStatus.isJoined ? (
// // // // // //         <View style={styles.joinedStatusBanner}>
// // // // // //           <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
// // // // // //           <View style={styles.statusTextContainer}>
// // // // // //             <Text style={styles.joinedStatusText}>
// // // // // //               Currently working with: {distributorStatus.currentVendorName || 'Unknown Vendor'}
// // // // // //             </Text>
// // // // // //             <Text style={styles.joinedStatusSubtext}>
// // // // // //               Status: {distributorStatus.status || 'Pending'} • Joined: {distributorStatus.joinedDate || 'N/A'}
// // // // // //             </Text>
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       ) : (
// // // // // //         <View style={styles.availableStatusBanner}>
// // // // // //           <Ionicons name="storefront-outline" size={20} color="#FF9500" />
// // // // // //           <Text style={styles.availableStatusText}>
// // // // // //             You can join one vendor. Choose wisely!
// // // // // //           </Text>
// // // // // //         </View>
// // // // // //       )}

// // // // // //       {/* Status Bar */}
// // // // // //       <View style={styles.statusContainer}>
// // // // // //         <Text style={styles.statusText}>{currentFilterText}</Text>
// // // // // //         <Text style={styles.debugText}>Found: {vendors.length}</Text>
// // // // // //         <View style={styles.filterActions}>
// // // // // //           {!showAllVendors && userPincode && (
// // // // // //             <TouchableOpacity style={styles.actionButton} onPress={showAllVendorsHandler}>
// // // // // //               <Text style={styles.actionText}>Show All</Text>
// // // // // //             </TouchableOpacity>
// // // // // //           )}
// // // // // //           {showAllVendors && userPincode && (
// // // // // //             <TouchableOpacity style={styles.actionButton} onPress={showMyAreaVendors}>
// // // // // //               <Text style={styles.actionText}>My Area</Text>
// // // // // //             </TouchableOpacity>
// // // // // //           )}
// // // // // //         </View>
// // // // // //       </View>

// // // // // //       {/* Manual Filter */}
// // // // // //       {showManualFilter && (
// // // // // //         <View style={styles.filterContainer}>
// // // // // //           <View style={styles.pincodeInputContainer}>
// // // // // //             <TextInput
// // // // // //               style={styles.pincodeInput}
// // // // // //               placeholder="Enter 6-digit pincode"
// // // // // //               value={manualPincode}
// // // // // //               onChangeText={setManualPincode}
// // // // // //               keyboardType="numeric"
// // // // // //               maxLength={6}
// // // // // //               placeholderTextColor="#999"
// // // // // //             />
// // // // // //             <TouchableOpacity 
// // // // // //               style={[styles.filterButton, isFilterLoading && styles.filterButtonDisabled]}
// // // // // //               onPress={handleManualFilter}
// // // // // //               disabled={isFilterLoading}
// // // // // //             >
// // // // // //               {isFilterLoading ? (
// // // // // //                 <ActivityIndicator size="small" color="#fff" />
// // // // // //               ) : (
// // // // // //                 <Ionicons name="search-outline" size={20} color="#fff" />
// // // // // //               )}
// // // // // //             </TouchableOpacity>
// // // // // //             {manualPincode.length > 0 && (
// // // // // //               <TouchableOpacity style={styles.clearButton} onPress={clearManualFilter}>
// // // // // //                 <Ionicons name="close-outline" size={20} color="#666" />
// // // // // //               </TouchableOpacity>
// // // // // //             )}
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       )}

// // // // // //       {/* Error Banner */}
// // // // // //       {error && (
// // // // // //         <View style={styles.errorBanner}>
// // // // // //           <View style={styles.errorContent}>
// // // // // //             <Ionicons name="warning-outline" size={20} color="#c00" />
// // // // // //             <Text style={styles.errorText}>{error}</Text>
// // // // // //           </View>
// // // // // //           <TouchableOpacity onPress={onRefresh} style={styles.retry}>
// // // // // //             <Text style={styles.retryText}>Retry</Text>
// // // // // //           </TouchableOpacity>
// // // // // //         </View>
// // // // // //       )}

// // // // // //       {/* Vendor List */}
// // // // // //       <FlatList
// // // // // //         data={vendors}
// // // // // //         renderItem={renderVendor}
// // // // // //         keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // // // // //         contentContainerStyle={styles.listContent}
// // // // // //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// // // // // //         ListEmptyComponent={() => (
// // // // // //           <View style={styles.emptyContainer}>
// // // // // //             {isLoading ? (
// // // // // //               <>
// // // // // //                 <ActivityIndicator size="large" color="#007AFF" />
// // // // // //                 <Text style={styles.loadingText}>Loading vendors...</Text>
// // // // // //               </>
// // // // // //             ) : (
// // // // // //               <>
// // // // // //                 <Ionicons name="storefront-outline" size={64} color="#ccc" />
// // // // // //                 <Text style={styles.emptyText}>
// // // // // //                   {error 
// // // // // //                     ? 'Unable to load vendors' 
// // // // // //                     : manualPincode 
// // // // // //                       ? `No vendors found in ${manualPincode}` 
// // // // // //                       : !showAllVendors && userPincode
// // // // // //                         ? `No vendors in your area (${userPincode})`
// // // // // //                         : 'No vendors available'
// // // // // //                   }
// // // // // //                 </Text>
// // // // // //                 {!showAllVendors && userPincode && !error && (
// // // // // //                   <TouchableOpacity style={styles.showAllButton} onPress={showAllVendorsHandler}>
// // // // // //                     <Text style={styles.showAllText}>Show All Vendors</Text>
// // // // // //                   </TouchableOpacity>
// // // // // //                 )}
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
// // // // // //   container: { 
// // // // // //     flex: 1, 
// // // // // //     backgroundColor: '#f8f9fa' 
// // // // // //   },
// // // // // //   centered: { 
// // // // // //     justifyContent: 'center', 
// // // // // //     alignItems: 'center' 
// // // // // //   },
// // // // // //   loadingText: { 
// // // // // //     marginTop: 16, 
// // // // // //     color: '#666', 
// // // // // //     fontSize: 16 
// // // // // //   },
  
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
// // // // // //   headerLeft: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   title: { 
// // // // // //     fontSize: 20, 
// // // // // //     fontWeight: 'bold', 
// // // // // //     color: '#333', 
// // // // // //     marginRight: 12 
// // // // // //   },
// // // // // //   filterToggle: {
// // // // // //     padding: 4,
// // // // // //   },
// // // // // //   logoutButton: { 
// // // // // //     padding: 4 
// // // // // //   },
  
// // // // // //   // Status banner styles
// // // // // //   statusBanner: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#f0f8ff',
// // // // // //     padding: 12,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#e3f2fd',
// // // // // //   },
// // // // // //   joinedStatusBanner: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#e8f5e8',
// // // // // //     padding: 12,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#c8e6c9',
// // // // // //   },
// // // // // //   availableStatusBanner: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#fff8e1',
// // // // // //     padding: 12,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#ffcc02',
// // // // // //   },
// // // // // //   statusTextContainer: {
// // // // // //     flex: 1,
// // // // // //     marginLeft: 8,
// // // // // //   },
// // // // // //   joinedStatusText: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '600',
// // // // // //     color: '#2e7d32',
// // // // // //   },
// // // // // //   joinedStatusSubtext: {
// // // // // //     fontSize: 12,
// // // // // //     color: '#4caf50',
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   availableStatusText: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '500',
// // // // // //     color: '#f57c00',
// // // // // //     marginLeft: 8,
// // // // // //   },
  
// // // // // //   statusContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#e3f2fd',
// // // // // //     padding: 12,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#eee',
// // // // // //   },
// // // // // //   statusText: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#1976d2',
// // // // // //     fontWeight: '500',
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   debugText: {
// // // // // //     fontSize: 12,
// // // // // //     color: '#666',
// // // // // //     fontWeight: '600',
// // // // // //     marginRight: 8,
// // // // // //   },
// // // // // //   filterActions: {
// // // // // //     flexDirection: 'row',
// // // // // //   },
// // // // // //   actionButton: {
// // // // // //     backgroundColor: '#1976d2',
// // // // // //     paddingHorizontal: 12,
// // // // // //     paddingVertical: 6,
// // // // // //     borderRadius: 6,
// // // // // //     marginLeft: 8,
// // // // // //   },
// // // // // //   actionText: {
// // // // // //     color: '#fff',
// // // // // //     fontSize: 12,
// // // // // //     fontWeight: '600',
// // // // // //   },
  
// // // // // //   filterContainer: {
// // // // // //     backgroundColor: '#fff',
// // // // // //     padding: 16,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#eee',
// // // // // //   },
// // // // // //   pincodeInputContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   pincodeInput: {
// // // // // //     flex: 1,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#ddd',
// // // // // //     borderRadius: 8,
// // // // // //     paddingHorizontal: 12,
// // // // // //     paddingVertical: 10,
// // // // // //     fontSize: 16,
// // // // // //     backgroundColor: '#fafafa',
// // // // // //   },
// // // // // //   filterButton: {
// // // // // //     backgroundColor: '#007AFF',
// // // // // //     borderRadius: 8,
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 10,
// // // // // //     marginLeft: 8,
// // // // // //     minWidth: 50,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   filterButtonDisabled: {
// // // // // //     backgroundColor: '#ccc',
// // // // // //   },
// // // // // //   clearButton: {
// // // // // //     padding: 8,
// // // // // //     marginLeft: 4,
// // // // // //   },

// // // // // //   errorBanner: {
// // // // // //     backgroundColor: '#fff0f0',
// // // // // //     padding: 16,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: '#ffcdd2',
// // // // // //   },
// // // // // //   errorContent: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'flex-start',
// // // // // //     marginBottom: 8,
// // // // // //   },
// // // // // //   errorText: { 
// // // // // //     color: '#c00', 
// // // // // //     fontSize: 14, 
// // // // // //     flex: 1, 
// // // // // //     marginLeft: 8, 
// // // // // //     lineHeight: 20 
// // // // // //   },
// // // // // //   retry: {
// // // // // //     backgroundColor: '#007AFF',
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 8,
// // // // // //     borderRadius: 8,
// // // // // //     alignSelf: 'flex-start',
// // // // // //   },
// // // // // //   retryText: { 
// // // // // //     color: '#fff', 
// // // // // //     fontSize: 14, 
// // // // // //     fontWeight: '600' 
// // // // // //   },
  
// // // // // //   listContent: { 
// // // // // //     paddingBottom: 16 
// // // // // //   },
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
// // // // // //   // Current vendor card styles
// // // // // //   currentVendorCard: {
// // // // // //     borderWidth: 2,
// // // // // //     borderColor: '#4CAF50',
// // // // // //     backgroundColor: '#f1f8e9',
// // // // // //   },
// // // // // //   disabledCard: {
// // // // // //     opacity: 0.5,
// // // // // //     backgroundColor: '#fafafa',
// // // // // //   },
// // // // // //   currentVendorBadge: {
// // // // // //     position: 'absolute',
// // // // // //     top: 8,
// // // // // //     right: 8,
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#4CAF50',
// // // // // //     paddingHorizontal: 8,
// // // // // //     paddingVertical: 4,
// // // // // //     borderRadius: 12,
// // // // // //   },
// // // // // //   currentVendorBadgeText: {
// // // // // //     color: '#fff',
// // // // // //     fontSize: 10,
// // // // // //     fontWeight: '600',
// // // // // //     marginLeft: 4,
// // // // // //   },
// // // // // //   info: { 
// // // // // //     flex: 1 
// // // // // //   },
// // // // // //   name: { 
// // // // // //     fontSize: 18, 
// // // // // //     fontWeight: 'bold', 
// // // // // //     color: '#333', 
// // // // // //     marginBottom: 8 
// // // // // //   },
// // // // // //   disabledText: {
// // // // // //     color: '#999',
// // // // // //   },
// // // // // //   contactRow: { 
// // // // // //     flexDirection: 'row', 
// // // // // //     alignItems: 'center', 
// // // // // //     marginBottom: 4 
// // // // // //   },
// // // // // //   contact: { 
// // // // // //     fontSize: 14, 
// // // // // //     color: '#666', 
// // // // // //     marginLeft: 8 
// // // // // //   },
// // // // // //   addressRow: { 
// // // // // //     flexDirection: 'row', 
// // // // // //     alignItems: 'center', 
// // // // // //     marginBottom: 4 
// // // // // //   },
// // // // // //   address: { 
// // // // // //     fontSize: 14, 
// // // // // //     color: '#666', 
// // // // // //     marginLeft: 8 
// // // // // //   },
// // // // // //   rateText: { 
// // // // // //     fontSize: 14, 
// // // // // //     color: '#704214', 
// // // // // //     marginTop: 2 
// // // // // //   },
// // // // // //   button: {
// // // // // //     backgroundColor: '#007AFF',
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingVertical: 8,
// // // // // //     borderRadius: 8,
// // // // // //     minWidth: 120,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   buttonDisabled: { 
// // // // // //     backgroundColor: '#C0C0C0' 
// // // // // //   },
// // // // // //   // Current vendor button styles
// // // // // //   currentVendorButton: {
// // // // // //     backgroundColor: '#4CAF50',
// // // // // //   },
// // // // // //   buttonText: { 
// // // // // //     color: '#fff', 
// // // // // //     fontWeight: '600' 
// // // // // //   },
// // // // // //   currentVendorButtonText: {
// // // // // //     fontSize: 12,
// // // // // //   },
  
// // // // // //   emptyContainer: { 
// // // // // //     flex: 1, 
// // // // // //     alignItems: 'center', 
// // // // // //     justifyContent: 'center', 
// // // // // //     padding: 40 
// // // // // //   },
// // // // // //   emptyText: { 
// // // // // //     color: '#666', 
// // // // // //     fontSize: 18, 
// // // // // //     textAlign: 'center', 
// // // // // //     marginTop: 16 
// // // // // //   },
// // // // // //   showAllButton: {
// // // // // //     marginTop: 16,
// // // // // //     backgroundColor: '#007AFF',
// // // // // //     paddingHorizontal: 20,
// // // // // //     paddingVertical: 10,
// // // // // //     borderRadius: 8,
// // // // // //   },
// // // // // //   showAllText: {
// // // // // //     color: '#fff',
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // // });

// // // // // // export default DistributorHomeScreen;
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
// // // // //   getDistributorDetailsById,
// // // // //   getDistributorVendorStatus,
// // // // // } from '../../apiServices/allApi';

// // // // // type DistributorHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DistributorHome'>;

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

// // // // // interface DistributorVendorStatus {
// // // // //   isJoined: boolean;
// // // // //   currentVendorId?: string;
// // // // //   currentVendorName?: string;
// // // // //   joinedDate?: string;
// // // // //   status?: 'approved' | 'pending' | 'rejected';
// // // // // }

// // // // // const DistributorHomeScreen = () => {
// // // // //   const navigation = useNavigation<DistributorHomeNavigationProp>();
// // // // //   const dispatch = useDispatch<AppDispatch>();

// // // // //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

// // // // //   const [vendors, setVendors] = useState<Vendor[]>([]);
// // // // //   const [requestedVendors, setRequestedVendors] = useState<string[]>([]);
// // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // //   const [refreshing, setRefreshing] = useState(false);
// // // // //   const [submittingId, setSubmittingId] = useState<string | null>(null);
// // // // //   const [error, setError] = useState<string | null>(null);
  
// // // // //   // Distributor vendor status state
// // // // //   const [distributorStatus, setDistributorStatus] = useState<DistributorVendorStatus>({
// // // // //     isJoined: false,
// // // // //   });
// // // // //   const [statusLoading, setStatusLoading] = useState(true);
  
// // // // //   // User profile states
// // // // //   const [userPincode, setUserPincode] = useState<string>('');
// // // // //   const [showAllVendors, setShowAllVendors] = useState(false);
  
// // // // //   // Manual filter states
// // // // //   const [manualPincode, setManualPincode] = useState('');
// // // // //   const [showManualFilter, setShowManualFilter] = useState(false);
// // // // //   const [isFilterLoading, setIsFilterLoading] = useState(false);

// // // // //   // Enhanced network error handling
// // // // //   const handleNetworkError = useCallback((err: any) => {
// // // // //     console.log('🌐 Network error details:', err);

// // // // //     if (err.message?.includes('Network Error') || err.code === 'NETWORK_ERROR') {
// // // // //       return 'Network connection failed. Please check your internet connection and try again.';
// // // // //     } else if (err.response?.status === 401) {
// // // // //       return 'Authentication failed. Please login again.';
// // // // //     } else if (err.response?.status === 500) {
// // // // //       return 'Server error. Please try again later.';
// // // // //     } else if (err.response?.status === 404) {
// // // // //       return 'Service not found. Please check your connection.';
// // // // //     }
    
// // // // //     return err.response?.data?.message || err.message || 'Something went wrong. Please try again.';
// // // // //   }, []);

// // // // //   // ✅ Check distributor's current vendor assignment status
// // // // //   const fetchDistributorStatus = useCallback(async () => {
// // // // //     try {
// // // // //       if (!user?.userID) {
// // // // //         console.log('❌ No distributor ID found');
// // // // //         return;
// // // // //       }

// // // // //       setStatusLoading(true);
// // // // //       console.log('🔍 Checking distributor vendor assignment for ID:', user.userID);

// // // // //       const statusRes = await getDistributorVendorStatus(user.userID.toString());
// // // // //       console.log('📊 Distributor assignment response:', statusRes);

// // // // //       const statusData = statusRes?.data;
      
// // // // //       if (statusData) {
// // // // //         const status: DistributorVendorStatus = {
// // // // //           isJoined: statusData.isJoined || false,
// // // // //           currentVendorId: statusData.currentVendorId?.toString(),
// // // // //           currentVendorName: statusData.currentVendorName,
// // // // //           joinedDate: statusData.joinedDate,
// // // // //           status: statusData.status || 'pending',
// // // // //         };
        
// // // // //         setDistributorStatus(status);
        
// // // // //         if (status.isJoined) {
// // // // //           console.log('✅ Distributor already assigned to vendor:', status.currentVendorName);
// // // // //         } else {
// // // // //           console.log('⚠️ Distributor not assigned to any vendor yet');
// // // // //         }
// // // // //       } else {
// // // // //         // No data means not joined
// // // // //         setDistributorStatus({ isJoined: false });
// // // // //       }
// // // // //     } catch (err: any) {
// // // // //       console.log('❌ Error fetching distributor assignment status:', err.message);
// // // // //       // Don't show error for status check, just assume not joined
// // // // //       setDistributorStatus({ isJoined: false });
// // // // //     } finally {
// // // // //       setStatusLoading(false);
// // // // //     }
// // // // //   }, [user?.userID]);

// // // // //   // Fetch distributor's profile to get their pincode
// // // // //   const fetchUserProfile = useCallback(async () => {
// // // // //     try {
// // // // //       if (!user?.userID) {
// // // // //         console.log('❌ No userID found');
// // // // //         return;
// // // // //       }
      
// // // // //       console.log('🔍 Fetching distributor profile for ID:', user.userID);
// // // // //       const response = await getDistributorDetailsById(user.userID);
// // // // //       console.log('👤 Distributor profile response received');
      
// // // // //       const profileData = response?.data?.data || response?.data;
      
// // // // //       if (profileData?.pincode) {
// // // // //         setUserPincode(profileData.pincode);
// // // // //         console.log('✅ Distributor pincode found:', profileData.pincode);
// // // // //       } else {
// // // // //         console.log('⚠️ No pincode found, showing all vendors');
// // // // //         setShowAllVendors(true);
// // // // //       }
// // // // //     } catch (err: any) {
// // // // //       console.log('❌ Error fetching distributor profile:', err.message);
// // // // //       setShowAllVendors(true);
// // // // //     }
// // // // //   }, [user?.userID]);

// // // // //   // Django REST Framework pagination support for distributors
// // // // //   const fetchData = useCallback(async (filterPincode?: string) => {
// // // // //     setError(null);
// // // // //     setIsLoading(true);
    
// // // // //     try {
// // // // //       if (!user?.userID) {
// // // // //         throw new Error('Distributor ID not found. Please log in again.');
// // // // //       }

// // // // //       // Determine pincode filter
// // // // //       let pincodeToFilter = filterPincode;
// // // // //       if (!pincodeToFilter && !showAllVendors && userPincode) {
// // // // //         pincodeToFilter = userPincode;
// // // // //       }

// // // // //       console.log('🏪 Fetching vendors for distributor ID:', user.userID);
// // // // //       console.log('📍 Using pincode filter:', pincodeToFilter || 'all vendors');

// // // // //       const vendorRes = await getAllVendors(pincodeToFilter);
// // // // //       console.log('📡 Vendors response received');

// // // // //       // Handle Django REST Framework pagination
// // // // //       let vendorList: Vendor[] = [];
      
// // // // //       if (vendorRes?.data?.results && Array.isArray(vendorRes.data.results)) {
// // // // //         vendorList = vendorRes.data.results;
// // // // //         console.log('✅ Found vendors in data.results:', vendorList.length);
// // // // //       } else if (vendorRes?.data?.data && Array.isArray(vendorRes.data.data)) {
// // // // //         vendorList = vendorRes.data.data;
// // // // //         console.log('✅ Found vendors in data.data:', vendorList.length);
// // // // //       } else if (vendorRes?.data && Array.isArray(vendorRes.data)) {
// // // // //         vendorList = vendorRes.data;
// // // // //         console.log('✅ Found vendors in data:', vendorList.length);
// // // // //       } else {
// // // // //         console.log('❌ No vendor array found in response');
// // // // //         vendorList = [];
// // // // //       }

// // // // //       setVendors(vendorList);

// // // // //       if (vendorList.length > 0) {
// // // // //         console.log(`✅ Distributor successfully loaded ${vendorList.length} vendors`);
// // // // //       } else {
// // // // //         console.log('⚠️ No vendors found for distributor with current filter');
// // // // //       }

// // // // //     } catch (err: any) {
// // // // //       console.log('❌ Distributor vendor fetch error:', err.message);
// // // // //       const errorMessage = handleNetworkError(err);
// // // // //       setError(errorMessage);
// // // // //       setVendors([]);
// // // // //     } finally {
// // // // //       setIsLoading(false);
// // // // //       setRefreshing(false);
// // // // //       setIsFilterLoading(false);
// // // // //     }
// // // // //   }, [user?.userID, userPincode, showAllVendors, handleNetworkError]);

// // // // //   const onRefresh = useCallback(() => {
// // // // //     setRefreshing(true);
// // // // //     const currentFilter = manualPincode || (showAllVendors ? undefined : userPincode);
// // // // //     // Also refresh distributor status
// // // // //     fetchDistributorStatus();
// // // // //     fetchData(currentFilter);
// // // // //   }, [fetchData, fetchDistributorStatus, manualPincode, showAllVendors, userPincode]);

// // // // //   const handleManualFilter = useCallback(() => {
// // // // //     if (manualPincode.trim() && manualPincode.length === 6) {
// // // // //       setIsFilterLoading(true);
// // // // //       fetchData(manualPincode.trim());
// // // // //     } else if (manualPincode.trim() === '') {
// // // // //       setIsFilterLoading(true);
// // // // //       fetchData(showAllVendors ? undefined : userPincode);
// // // // //     } else {
// // // // //       Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pincode');
// // // // //     }
// // // // //   }, [manualPincode, fetchData, showAllVendors, userPincode]);

// // // // //   const showAllVendorsHandler = useCallback(() => {
// // // // //     console.log('🌐 Distributor showing all vendors');
// // // // //     setShowAllVendors(true);
// // // // //     setManualPincode('');
// // // // //     fetchData();
// // // // //   }, [fetchData]);

// // // // //   const showMyAreaVendors = useCallback(() => {
// // // // //     if (userPincode) {
// // // // //       console.log('📍 Distributor showing vendors for area:', userPincode);
// // // // //       setShowAllVendors(false);
// // // // //       setManualPincode('');
// // // // //       fetchData(userPincode);
// // // // //     } else {
// // // // //       Alert.alert('No Pincode', 'Please update your profile with your pincode first');
// // // // //     }
// // // // //   }, [fetchData, userPincode]);

// // // // //   const clearManualFilter = useCallback(() => {
// // // // //     setManualPincode('');
// // // // //     setIsFilterLoading(true);
// // // // //     fetchData(showAllVendors ? undefined : userPincode);
// // // // //   }, [fetchData, showAllVendors, userPincode]);

// // // // //   // ✅ Show current vendor details
// // // // //   const showCurrentVendorInfo = useCallback(() => {
// // // // //     Alert.alert(
// // // // //       'Current Vendor Details',
// // // // //       `Vendor: ${distributorStatus.currentVendorName || 'Unknown'}\nStatus: ${distributorStatus.status || 'Pending'}\nJoined: ${distributorStatus.joinedDate || 'N/A'}\n\nYou can only work with one vendor at a time.`,
// // // // //       [{ text: 'OK' }]
// // // // //     );
// // // // //   }, [distributorStatus]);

// // // // //   // ✅ Handle join vendor with full restriction logic
// // // // //   const sendRequest = useCallback(async (vendorId: string) => {
// // // // //     try {
// // // // //       // ✅ MAIN RESTRICTION: Check if distributor already joined a vendor
// // // // //       if (distributorStatus.isJoined) {
// // // // //         const isCurrentVendor = distributorStatus.currentVendorId === vendorId;
        
// // // // //         if (isCurrentVendor) {
// // // // //           // Clicking on current vendor - show info
// // // // //           showCurrentVendorInfo();
// // // // //           return;
// // // // //         } else {
// // // // //           // Trying to join different vendor - block with detailed alert
// // // // //           Alert.alert(
// // // // //             'Already Joined Another Vendor',
// // // // //             `You are currently working with "${distributorStatus.currentVendorName}". 

// // // // // You can only work with one vendor at a time to ensure:
// // // // // • Quality service delivery
// // // // // • No conflicts of interest  
// // // // // • Clear responsibility

// // // // // Status: ${distributorStatus.status || 'Pending'}
// // // // // Joined: ${distributorStatus.joinedDate || 'N/A'}`,
// // // // //             [
// // // // //               { text: 'OK', style: 'default' },
// // // // //               {
// // // // //                 text: 'View Current Vendor',
// // // // //                 onPress: showCurrentVendorInfo
// // // // //               }
// // // // //             ]
// // // // //           );
// // // // //           return;
// // // // //         }
// // // // //       }

// // // // //       setSubmittingId(vendorId);

// // // // //       if (!user?.userID) {
// // // // //         throw new Error('Distributor ID not found. Please log in again.');
// // // // //       }

// // // // //       // Send join request
// // // // //       const payload = {
// // // // //         user_id: parseInt(user.userID.toString(), 10),
// // // // //         user_type: 'milkman', // Backend expects 'milkman' for distributors
// // // // //         vendor: parseInt(vendorId, 10),
// // // // //       };

// // // // //       console.log('📤 Distributor sending join request with payload:', payload);
// // // // //       const response = await createRequest(payload);
      
// // // // //       console.log('✅ Distributor request sent successfully:', response?.data?.message || 'Request completed');

// // // // //       Alert.alert(
// // // // //         'Request Sent Successfully!', 
// // // // //         'Your request has been sent to the vendor. You can only work with one vendor at a time. Please wait for approval.\n\nYou will be notified once the vendor responds to your request.',
// // // // //         [{ text: 'OK' }]
// // // // //       );
      
// // // // //       setRequestedVendors(prev => [...prev, vendorId]);
      
// // // // //       // Refresh distributor status after successful request
// // // // //       fetchDistributorStatus();
      
// // // // //     } catch (err: any) {
// // // // //       console.log('❌ Distributor request error:', err.message);
// // // // //       console.log('❌ Full error object:', err);
// // // // //       const errorMessage = handleNetworkError(err);
// // // // //       Alert.alert('Error', errorMessage);
// // // // //     } finally {
// // // // //       setSubmittingId(null);
// // // // //     }
// // // // //   }, [user?.userID, handleNetworkError, distributorStatus, showCurrentVendorInfo, fetchDistributorStatus]);

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

// // // // //   // ✅ Enhanced vendor rendering with full visual indicators
// // // // //   const renderVendor = useCallback(({ item }: { item: Vendor }) => {
// // // // //     const isRequested = requestedVendors.includes(item.id);
// // // // //     const isSubmitting = submittingId === item.id;
    
// // // // //     // Check if this is the current joined vendor
// // // // //     const isCurrentVendor = distributorStatus.isJoined && 
// // // // //                             distributorStatus.currentVendorId === item.id;
    
// // // // //     // Disable all other vendors if already joined to one
// // // // //     const isDisabledDueToJoined = distributorStatus.isJoined && !isCurrentVendor;

// // // // //     const vendorName = item.name || item.business_name || 'Unnamed Vendor';
// // // // //     const village = item.village || item.location || item.address || 'No location';
// // // // //     const vendorPincode = item.pincode ? ` - ${item.pincode}` : '';
// // // // //     const contact = item.contact || 'No contact';

// // // // //     return (
// // // // //       <View style={[
// // // // //         styles.card, 
// // // // //         isCurrentVendor && styles.currentVendorCard,
// // // // //         isDisabledDueToJoined && styles.disabledCard
// // // // //       ]}>
// // // // //         {/* ✅ Current vendor badge */}
// // // // //         {isCurrentVendor && (
// // // // //           <View style={styles.currentVendorBadge}>
// // // // //             <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
// // // // //             <Text style={styles.currentVendorBadgeText}>Current Vendor</Text>
// // // // //           </View>
// // // // //         )}
        
// // // // //         <View style={styles.info}>
// // // // //           <Text style={[
// // // // //             styles.name,
// // // // //             isDisabledDueToJoined && styles.disabledText
// // // // //           ]}>
// // // // //             {vendorName}
// // // // //           </Text>

// // // // //           <View style={styles.contactRow}>
// // // // //             <Ionicons name="call-outline" size={16} color={isDisabledDueToJoined ? "#ccc" : "#666"} />
// // // // //             <Text style={[
// // // // //               styles.contact,
// // // // //               isDisabledDueToJoined && styles.disabledText
// // // // //             ]}>
// // // // //               {contact}
// // // // //             </Text>
// // // // //           </View>

// // // // //           <View style={styles.addressRow}>
// // // // //             <Ionicons name="location-outline" size={16} color={isDisabledDueToJoined ? "#ccc" : "#666"} />
// // // // //             <Text style={[
// // // // //               styles.address,
// // // // //               isDisabledDueToJoined && styles.disabledText
// // // // //             ]}>
// // // // //               {village}{vendorPincode}
// // // // //             </Text>
// // // // //           </View>

// // // // //           <Text style={[
// // // // //             styles.rateText,
// // // // //             isDisabledDueToJoined && styles.disabledText
// // // // //           ]}>
// // // // //             Cow Milk: {item.cr != null ? `₹${item.cr}/L` : 'Rate not set'}
// // // // //           </Text>
// // // // //           <Text style={[
// // // // //             styles.rateText,
// // // // //             isDisabledDueToJoined && styles.disabledText
// // // // //           ]}>
// // // // //             Buffalo Milk: {item.br != null ? `₹${item.br}/L` : 'Rate not set'}
// // // // //           </Text>
// // // // //         </View>

// // // // //         <TouchableOpacity
// // // // //           style={[
// // // // //             styles.button,
// // // // //             (isRequested || isSubmitting) && styles.buttonDisabled,
// // // // //             isCurrentVendor && styles.currentVendorButton,
// // // // //             isDisabledDueToJoined && styles.buttonDisabled
// // // // //           ]}
// // // // //           onPress={() => !isSubmitting && sendRequest(item.id)}
// // // // //           disabled={isSubmitting}
// // // // //         >
// // // // //           {isSubmitting ? (
// // // // //             <ActivityIndicator size="small" color="#fff" />
// // // // //           ) : (
// // // // //             <Text style={[
// // // // //               styles.buttonText,
// // // // //               isCurrentVendor && styles.currentVendorButtonText
// // // // //             ]}>
// // // // //               {isCurrentVendor 
// // // // //                 ? `Joined (${distributorStatus.status || 'Pending'})`
// // // // //                 : isRequested 
// // // // //                   ? 'Requested'
// // // // //                   : isDisabledDueToJoined
// // // // //                     ? 'Already Joined Other'
// // // // //                     : 'Join Vendor'
// // // // //               }
// // // // //             </Text>
// // // // //           )}
// // // // //         </TouchableOpacity>
// // // // //       </View>
// // // // //     );
// // // // //   }, [requestedVendors, submittingId, sendRequest, distributorStatus]);

// // // // //   // Initialize
// // // // //   useEffect(() => {
// // // // //     console.log('🚀 Initializing DistributorHomeScreen');
// // // // //     fetchUserProfile();
// // // // //     fetchDistributorStatus();
// // // // //   }, [fetchUserProfile, fetchDistributorStatus]);

// // // // //   // Fetch vendors when conditions are met
// // // // //   useEffect(() => {
// // // // //     if (userPincode || showAllVendors) {
// // // // //       console.log('✅ Distributor fetching vendors - conditions met');
// // // // //       fetchData();
// // // // //     }
// // // // //   }, [userPincode, showAllVendors, fetchData]);

// // // // //   if (!isAuthenticated || !user?.userID) {
// // // // //     return (
// // // // //       <View style={[styles.container, styles.centered]}>
// // // // //         <ActivityIndicator size="large" color="#007AFF" />
// // // // //         <Text style={styles.loadingText}>Loading distributor information...</Text>
// // // // //       </View>
// // // // //     );
// // // // //   }

// // // // //   const currentFilterText = manualPincode 
// // // // //     ? `Filtered by: ${manualPincode}` 
// // // // //     : showAllVendors 
// // // // //       ? 'Showing all vendors' 
// // // // //       : userPincode 
// // // // //         ? `Your area: ${userPincode}` 
// // // // //         : 'No filter applied';

// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       {/* Header */}
// // // // //       <View style={styles.header}>
// // // // //         <View style={styles.headerLeft}>
// // // // //           <Text style={styles.title}>Available Vendors</Text>
// // // // //           <TouchableOpacity 
// // // // //             onPress={() => setShowManualFilter(!showManualFilter)}
// // // // //             style={styles.filterToggle}
// // // // //           >
// // // // //             <Ionicons 
// // // // //               name={showManualFilter ? "chevron-up-outline" : "filter-outline"} 
// // // // //               size={24} 
// // // // //               color="#007AFF" 
// // // // //             />
// // // // //           </TouchableOpacity>
// // // // //         </View>
// // // // //         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
// // // // //           <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
// // // // //         </TouchableOpacity>
// // // // //       </View>

// // // // //       {/* ✅ DISTRIBUTOR STATUS BANNER */}
// // // // //       {statusLoading ? (
// // // // //         <View style={styles.statusBanner}>
// // // // //           <ActivityIndicator size="small" color="#666" />
// // // // //           <Text style={styles.statusText}>Checking vendor assignment...</Text>
// // // // //         </View>
// // // // //       ) : distributorStatus.isJoined ? (
// // // // //         <View style={styles.joinedStatusBanner}>
// // // // //           <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
// // // // //           <View style={styles.statusTextContainer}>
// // // // //             <Text style={styles.joinedStatusText}>
// // // // //               Currently working with: {distributorStatus.currentVendorName || 'Unknown Vendor'}
// // // // //             </Text>
// // // // //             <Text style={styles.joinedStatusSubtext}>
// // // // //               Status: {distributorStatus.status || 'Pending'} • Joined: {distributorStatus.joinedDate || 'N/A'}
// // // // //             </Text>
// // // // //           </View>
// // // // //           <TouchableOpacity onPress={showCurrentVendorInfo} style={styles.infoButton}>
// // // // //             <Ionicons name="information-circle-outline" size={18} color="#4CAF50" />
// // // // //           </TouchableOpacity>
// // // // //         </View>
// // // // //       ) : (
// // // // //         <View style={styles.availableStatusBanner}>
// // // // //           <Ionicons name="storefront-outline" size={20} color="#FF9500" />
// // // // //           <Text style={styles.availableStatusText}>
// // // // //             You can join one vendor. Choose wisely!
// // // // //           </Text>
// // // // //         </View>
// // // // //       )}

// // // // //       {/* Status Bar */}
// // // // //       <View style={styles.statusContainer}>
// // // // //         <Text style={styles.statusText}>{currentFilterText}</Text>
// // // // //         <Text style={styles.debugText}>Found: {vendors.length}</Text>
// // // // //         <View style={styles.filterActions}>
// // // // //           {!showAllVendors && userPincode && (
// // // // //             <TouchableOpacity style={styles.actionButton} onPress={showAllVendorsHandler}>
// // // // //               <Text style={styles.actionText}>Show All</Text>
// // // // //             </TouchableOpacity>
// // // // //           )}
// // // // //           {showAllVendors && userPincode && (
// // // // //             <TouchableOpacity style={styles.actionButton} onPress={showMyAreaVendors}>
// // // // //               <Text style={styles.actionText}>My Area</Text>
// // // // //             </TouchableOpacity>
// // // // //           )}
// // // // //         </View>
// // // // //       </View>

// // // // //       {/* Manual Filter */}
// // // // //       {showManualFilter && (
// // // // //         <View style={styles.filterContainer}>
// // // // //           <View style={styles.pincodeInputContainer}>
// // // // //             <TextInput
// // // // //               style={styles.pincodeInput}
// // // // //               placeholder="Enter 6-digit pincode"
// // // // //               value={manualPincode}
// // // // //               onChangeText={setManualPincode}
// // // // //               keyboardType="numeric"
// // // // //               maxLength={6}
// // // // //               placeholderTextColor="#999"
// // // // //             />
// // // // //             <TouchableOpacity 
// // // // //               style={[styles.filterButton, isFilterLoading && styles.filterButtonDisabled]}
// // // // //               onPress={handleManualFilter}
// // // // //               disabled={isFilterLoading}
// // // // //             >
// // // // //               {isFilterLoading ? (
// // // // //                 <ActivityIndicator size="small" color="#fff" />
// // // // //               ) : (
// // // // //                 <Ionicons name="search-outline" size={20} color="#fff" />
// // // // //               )}
// // // // //             </TouchableOpacity>
// // // // //             {manualPincode.length > 0 && (
// // // // //               <TouchableOpacity style={styles.clearButton} onPress={clearManualFilter}>
// // // // //                 <Ionicons name="close-outline" size={20} color="#666" />
// // // // //               </TouchableOpacity>
// // // // //             )}
// // // // //           </View>
// // // // //         </View>
// // // // //       )}

// // // // //       {/* Error Banner */}
// // // // //       {error && (
// // // // //         <View style={styles.errorBanner}>
// // // // //           <View style={styles.errorContent}>
// // // // //             <Ionicons name="warning-outline" size={20} color="#c00" />
// // // // //             <Text style={styles.errorText}>{error}</Text>
// // // // //           </View>
// // // // //           <TouchableOpacity onPress={onRefresh} style={styles.retry}>
// // // // //             <Text style={styles.retryText}>Retry</Text>
// // // // //           </TouchableOpacity>
// // // // //         </View>
// // // // //       )}

// // // // //       {/* Vendor List */}
// // // // //       <FlatList
// // // // //         data={vendors}
// // // // //         renderItem={renderVendor}
// // // // //         keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // // // //         contentContainerStyle={styles.listContent}
// // // // //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// // // // //         ListEmptyComponent={() => (
// // // // //           <View style={styles.emptyContainer}>
// // // // //             {isLoading ? (
// // // // //               <>
// // // // //                 <ActivityIndicator size="large" color="#007AFF" />
// // // // //                 <Text style={styles.loadingText}>Loading vendors...</Text>
// // // // //               </>
// // // // //             ) : (
// // // // //               <>
// // // // //                 <Ionicons name="storefront-outline" size={64} color="#ccc" />
// // // // //                 <Text style={styles.emptyText}>
// // // // //                   {error 
// // // // //                     ? 'Unable to load vendors' 
// // // // //                     : manualPincode 
// // // // //                       ? `No vendors found in ${manualPincode}` 
// // // // //                       : !showAllVendors && userPincode
// // // // //                         ? `No vendors in your area (${userPincode})`
// // // // //                         : 'No vendors available'
// // // // //                   }
// // // // //                 </Text>
// // // // //                 {!showAllVendors && userPincode && !error && (
// // // // //                   <TouchableOpacity style={styles.showAllButton} onPress={showAllVendorsHandler}>
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
// // // // //   container: { 
// // // // //     flex: 1, 
// // // // //     backgroundColor: '#f8f9fa' 
// // // // //   },
// // // // //   centered: { 
// // // // //     justifyContent: 'center', 
// // // // //     alignItems: 'center' 
// // // // //   },
// // // // //   loadingText: { 
// // // // //     marginTop: 16, 
// // // // //     color: '#666', 
// // // // //     fontSize: 16 
// // // // //   },
  
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
// // // // //   title: { 
// // // // //     fontSize: 20, 
// // // // //     fontWeight: 'bold', 
// // // // //     color: '#333', 
// // // // //     marginRight: 12 
// // // // //   },
// // // // //   filterToggle: {
// // // // //     padding: 4,
// // // // //   },
// // // // //   logoutButton: { 
// // // // //     padding: 4 
// // // // //   },
  
// // // // //   // ✅ Enhanced status banner styles
// // // // //   statusBanner: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#f0f8ff',
// // // // //     padding: 12,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#e3f2fd',
// // // // //   },
// // // // //   joinedStatusBanner: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#e8f5e8',
// // // // //     padding: 12,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#c8e6c9',
// // // // //   },
// // // // //   availableStatusBanner: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#fff8e1',
// // // // //     padding: 12,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#ffcc02',
// // // // //   },
// // // // //   statusTextContainer: {
// // // // //     flex: 1,
// // // // //     marginLeft: 8,
// // // // //   },
// // // // //   joinedStatusText: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '600',
// // // // //     color: '#2e7d32',
// // // // //   },
// // // // //   joinedStatusSubtext: {
// // // // //     fontSize: 12,
// // // // //     color: '#4caf50',
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   availableStatusText: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //     color: '#f57c00',
// // // // //     marginLeft: 8,
// // // // //   },
// // // // //   infoButton: {
// // // // //     padding: 8,
// // // // //   },
  
// // // // //   statusContainer: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#e3f2fd',
// // // // //     padding: 12,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#eee',
// // // // //   },
// // // // //   statusText: {
// // // // //     fontSize: 14,
// // // // //     color: '#1976d2',
// // // // //     fontWeight: '500',
// // // // //     flex: 1,
// // // // //   },
// // // // //   debugText: {
// // // // //     fontSize: 12,
// // // // //     color: '#666',
// // // // //     fontWeight: '600',
// // // // //     marginRight: 8,
// // // // //   },
// // // // //   filterActions: {
// // // // //     flexDirection: 'row',
// // // // //   },
// // // // //   actionButton: {
// // // // //     backgroundColor: '#1976d2',
// // // // //     paddingHorizontal: 12,
// // // // //     paddingVertical: 6,
// // // // //     borderRadius: 6,
// // // // //     marginLeft: 8,
// // // // //   },
// // // // //   actionText: {
// // // // //     color: '#fff',
// // // // //     fontSize: 12,
// // // // //     fontWeight: '600',
// // // // //   },
  
// // // // //   filterContainer: {
// // // // //     backgroundColor: '#fff',
// // // // //     padding: 16,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#eee',
// // // // //   },
// // // // //   pincodeInputContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
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

// // // // //   errorBanner: {
// // // // //     backgroundColor: '#fff0f0',
// // // // //     padding: 16,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#ffcdd2',
// // // // //   },
// // // // //   errorContent: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'flex-start',
// // // // //     marginBottom: 8,
// // // // //   },
// // // // //   errorText: { 
// // // // //     color: '#c00', 
// // // // //     fontSize: 14, 
// // // // //     flex: 1, 
// // // // //     marginLeft: 8, 
// // // // //     lineHeight: 20 
// // // // //   },
// // // // //   retry: {
// // // // //     backgroundColor: '#007AFF',
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 8,
// // // // //     borderRadius: 8,
// // // // //     alignSelf: 'flex-start',
// // // // //   },
// // // // //   retryText: { 
// // // // //     color: '#fff', 
// // // // //     fontSize: 14, 
// // // // //     fontWeight: '600' 
// // // // //   },
  
// // // // //   listContent: { 
// // // // //     paddingBottom: 16 
// // // // //   },
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
// // // // //   // ✅ Enhanced current vendor card styles
// // // // //   currentVendorCard: {
// // // // //     borderWidth: 2,
// // // // //     borderColor: '#4CAF50',
// // // // //     backgroundColor: '#f1f8e9',
// // // // //   },
// // // // //   disabledCard: {
// // // // //     opacity: 0.5,
// // // // //     backgroundColor: '#fafafa',
// // // // //   },
// // // // //   currentVendorBadge: {
// // // // //     position: 'absolute',
// // // // //     top: 8,
// // // // //     right: 8,
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#4CAF50',
// // // // //     paddingHorizontal: 8,
// // // // //     paddingVertical: 4,
// // // // //     borderRadius: 12,
// // // // //     zIndex: 1,
// // // // //   },
// // // // //   currentVendorBadgeText: {
// // // // //     color: '#fff',
// // // // //     fontSize: 10,
// // // // //     fontWeight: '600',
// // // // //     marginLeft: 4,
// // // // //   },
// // // // //   info: { 
// // // // //     flex: 1,
// // // // //     paddingRight: 8,
// // // // //   },
// // // // //   name: { 
// // // // //     fontSize: 18, 
// // // // //     fontWeight: 'bold', 
// // // // //     color: '#333', 
// // // // //     marginBottom: 8 
// // // // //   },
// // // // //   disabledText: {
// // // // //     color: '#999',
// // // // //   },
// // // // //   contactRow: { 
// // // // //     flexDirection: 'row', 
// // // // //     alignItems: 'center', 
// // // // //     marginBottom: 4 
// // // // //   },
// // // // //   contact: { 
// // // // //     fontSize: 14, 
// // // // //     color: '#666', 
// // // // //     marginLeft: 8 
// // // // //   },
// // // // //   addressRow: { 
// // // // //     flexDirection: 'row', 
// // // // //     alignItems: 'center', 
// // // // //     marginBottom: 4 
// // // // //   },
// // // // //   address: { 
// // // // //     fontSize: 14, 
// // // // //     color: '#666', 
// // // // //     marginLeft: 8 
// // // // //   },
// // // // //   rateText: { 
// // // // //     fontSize: 14, 
// // // // //     color: '#704214', 
// // // // //     marginTop: 2 
// // // // //   },
// // // // //   button: {
// // // // //     backgroundColor: '#007AFF',
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 8,
// // // // //     borderRadius: 8,
// // // // //     minWidth: 120,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   buttonDisabled: { 
// // // // //     backgroundColor: '#C0C0C0' 
// // // // //   },
// // // // //   // ✅ Enhanced current vendor button styles
// // // // //   currentVendorButton: {
// // // // //     backgroundColor: '#4CAF50',
// // // // //   },
// // // // //   buttonText: { 
// // // // //     color: '#fff', 
// // // // //     fontWeight: '600' 
// // // // //   },
// // // // //   currentVendorButtonText: {
// // // // //     fontSize: 12,
// // // // //   },
  
// // // // //   emptyContainer: { 
// // // // //     flex: 1, 
// // // // //     alignItems: 'center', 
// // // // //     justifyContent: 'center', 
// // // // //     padding: 40 
// // // // //   },
// // // // //   emptyText: { 
// // // // //     color: '#666', 
// // // // //     fontSize: 18, 
// // // // //     textAlign: 'center', 
// // // // //     marginTop: 16 
// // // // //   },
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

// // // // // export default DistributorHomeScreen;
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
// // // //   getDistributorDetailsById,
// // // //   getDistributorVendorStatus,
// // // // } from '../../apiServices/allApi';

// // // // type DistributorHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DistributorHome'>;

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

// // // // interface DistributorVendorStatus {
// // // //   isJoined: boolean;
// // // //   currentVendorId?: string;
// // // //   currentVendorName?: string;
// // // //   joinedDate?: string;
// // // //   status?: 'approved' | 'pending' | 'rejected';
// // // // }

// // // // const DistributorHomeScreen = () => {
// // // //   const navigation = useNavigation<DistributorHomeNavigationProp>();
// // // //   const dispatch = useDispatch<AppDispatch>();

// // // //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

// // // //   const [vendors, setVendors] = useState<Vendor[]>([]);
// // // //   const [requestedVendors, setRequestedVendors] = useState<string[]>([]);
// // // //   const [isLoading, setIsLoading] = useState(true);
// // // //   const [refreshing, setRefreshing] = useState(false);
// // // //   const [submittingId, setSubmittingId] = useState<string | null>(null);
// // // //   const [error, setError] = useState<string | null>(null);
  
// // // //   // Distributor vendor status state
// // // //   const [distributorStatus, setDistributorStatus] = useState<DistributorVendorStatus>({
// // // //     isJoined: false,
// // // //   });
// // // //   const [statusLoading, setStatusLoading] = useState(true);
  
// // // //   // User profile states
// // // //   const [userPincode, setUserPincode] = useState<string>('');
// // // //   const [showAllVendors, setShowAllVendors] = useState(false);
  
// // // //   // Manual filter states
// // // //   const [manualPincode, setManualPincode] = useState('');
// // // //   const [showManualFilter, setShowManualFilter] = useState(false);
// // // //   const [isFilterLoading, setIsFilterLoading] = useState(false);

// // // //   // Enhanced network error handling
// // // //   const handleNetworkError = useCallback((err: any) => {
// // // //     console.log('🌐 Network error details:', err);

// // // //     if (err.message?.includes('Network Error') || err.code === 'NETWORK_ERROR') {
// // // //       return 'Network connection failed. Please check your internet connection and try again.';
// // // //     } else if (err.response?.status === 401) {
// // // //       return 'Authentication failed. Please login again.';
// // // //     } else if (err.response?.status === 500) {
// // // //       return 'Server error. Please try again later.';
// // // //     } else if (err.response?.status === 404) {
// // // //       return 'Service not found. Please check your connection.';
// // // //     }
    
// // // //     return err.response?.data?.message || err.message || 'Something went wrong. Please try again.';
// // // //   }, []);

// // // //   // Check distributor's current vendor assignment status
// // // //   const fetchDistributorStatus = useCallback(async () => {
// // // //     try {
// // // //       if (!user?.userID) {
// // // //         console.log('❌ No distributor ID found');
// // // //         return;
// // // //       }

// // // //       setStatusLoading(true);
// // // //       console.log('🔍 Checking distributor vendor assignment for ID:', user.userID);

// // // //       const statusRes = await getDistributorVendorStatus(user.userID.toString());
// // // //       console.log('📊 Distributor assignment response:', statusRes);

// // // //       const statusData = statusRes?.data;
      
// // // //       if (statusData) {
// // // //         const status: DistributorVendorStatus = {
// // // //           isJoined: statusData.isJoined || false,
// // // //           currentVendorId: statusData.currentVendorId?.toString(),
// // // //           currentVendorName: statusData.currentVendorName,
// // // //           joinedDate: statusData.joinedDate,
// // // //           status: statusData.status || 'pending',
// // // //         };
        
// // // //         setDistributorStatus(status);
        
// // // //         if (status.isJoined) {
// // // //           console.log('✅ Distributor already assigned to vendor:', status.currentVendorName);
// // // //         } else {
// // // //           console.log('⚠️ Distributor not assigned to any vendor yet');
// // // //         }
// // // //       } else {
// // // //         setDistributorStatus({ isJoined: false });
// // // //       }
// // // //     } catch (err: any) {
// // // //       console.log('❌ Error fetching distributor assignment status:', err.message);
// // // //       setDistributorStatus({ isJoined: false });
// // // //     } finally {
// // // //       setStatusLoading(false);
// // // //     }
// // // //   }, [user?.userID]);

// // // //   // Fetch distributor's profile to get their pincode
// // // //   const fetchUserProfile = useCallback(async () => {
// // // //     try {
// // // //       if (!user?.userID) {
// // // //         console.log('❌ No userID found');
// // // //         return;
// // // //       }
      
// // // //       console.log('🔍 Fetching distributor profile for ID:', user.userID);
// // // //       const response = await getDistributorDetailsById(user.userID);
// // // //       console.log('👤 Distributor profile response received');
      
// // // //       const profileData = response?.data?.data || response?.data;
      
// // // //       if (profileData?.pincode) {
// // // //         setUserPincode(profileData.pincode);
// // // //         console.log('✅ Distributor pincode found:', profileData.pincode);
// // // //       } else {
// // // //         console.log('⚠️ No pincode found, showing all vendors');
// // // //         setShowAllVendors(true);
// // // //       }
// // // //     } catch (err: any) {
// // // //       console.log('❌ Error fetching distributor profile:', err.message);
// // // //       setShowAllVendors(true);
// // // //     }
// // // //   }, [user?.userID]);

// // // //   // ✅ MODIFIED: Filter vendors based on join status
// // // //   const fetchData = useCallback(async (filterPincode?: string) => {
// // // //     setError(null);
// // // //     setIsLoading(true);
    
// // // //     try {
// // // //       if (!user?.userID) {
// // // //         throw new Error('Distributor ID not found. Please log in again.');
// // // //       }

// // // //       // Determine pincode filter
// // // //       let pincodeToFilter = filterPincode;
// // // //       if (!pincodeToFilter && !showAllVendors && userPincode) {
// // // //         pincodeToFilter = userPincode;
// // // //       }

// // // //       console.log('🏪 Fetching vendors for distributor ID:', user.userID);
// // // //       console.log('📍 Using pincode filter:', pincodeToFilter || 'all vendors');

// // // //       const vendorRes = await getAllVendors(pincodeToFilter);
// // // //       console.log('📡 Vendors response received');

// // // //       // Handle Django REST Framework pagination
// // // //       let vendorList: Vendor[] = [];
      
// // // //       if (vendorRes?.data?.results && Array.isArray(vendorRes.data.results)) {
// // // //         vendorList = vendorRes.data.results;
// // // //         console.log('✅ Found vendors in data.results:', vendorList.length);
// // // //       } else if (vendorRes?.data?.data && Array.isArray(vendorRes.data.data)) {
// // // //         vendorList = vendorRes.data.data;
// // // //         console.log('✅ Found vendors in data.data:', vendorList.length);
// // // //       } else if (vendorRes?.data && Array.isArray(vendorRes.data)) {
// // // //         vendorList = vendorRes.data;
// // // //         console.log('✅ Found vendors in data:', vendorList.length);
// // // //       } else {
// // // //         console.log('❌ No vendor array found in response');
// // // //         vendorList = [];
// // // //       }

// // // //       // ✅ MAIN FEATURE: Filter vendors based on distributor status
// // // //       let filteredVendors = vendorList;
      
// // // //       if (distributorStatus.isJoined && distributorStatus.currentVendorId) {
// // // //         // ✅ Show ONLY the current vendor if already joined
// // // //         filteredVendors = vendorList.filter(vendor => 
// // // //           vendor.id.toString() === distributorStatus.currentVendorId
// // // //         );
// // // //         console.log('🎯 Distributor already joined - showing only current vendor:', filteredVendors.length);
// // // //       } else {
// // // //         // ✅ Show all vendors if not joined yet
// // // //         console.log('🌐 Distributor not joined - showing all vendors:', filteredVendors.length);
// // // //       }

// // // //       setVendors(filteredVendors);

// // // //       if (filteredVendors.length > 0) {
// // // //         console.log(`✅ Distributor successfully loaded ${filteredVendors.length} vendors`);
// // // //       } else {
// // // //         console.log('⚠️ No vendors found for distributor with current filter');
// // // //       }

// // // //     } catch (err: any) {
// // // //       console.log('❌ Distributor vendor fetch error:', err.message);
// // // //       const errorMessage = handleNetworkError(err);
// // // //       setError(errorMessage);
// // // //       setVendors([]);
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //       setRefreshing(false);
// // // //       setIsFilterLoading(false);
// // // //     }
// // // //   }, [user?.userID, userPincode, showAllVendors, handleNetworkError, distributorStatus]);

// // // //   // ✅ MODIFIED: Disable filters when already joined
// // // //   const onRefresh = useCallback(() => {
// // // //     setRefreshing(true);
// // // //     fetchDistributorStatus().then(() => {
// // // //       const currentFilter = manualPincode || (showAllVendors ? undefined : userPincode);
// // // //       fetchData(currentFilter);
// // // //     });
// // // //   }, [fetchData, fetchDistributorStatus, manualPincode, showAllVendors, userPincode]);

// // // //   const handleManualFilter = useCallback(() => {
// // // //     // ✅ Disable manual filter when already joined
// // // //     if (distributorStatus.isJoined) {
// // // //       Alert.alert(
// // // //         'Filter Disabled',
// // // //         `You are currently working with ${distributorStatus.currentVendorName}. Only your current vendor is shown.`,
// // // //         [{ text: 'OK' }]
// // // //       );
// // // //       return;
// // // //     }

// // // //     if (manualPincode.trim() && manualPincode.length === 6) {
// // // //       setIsFilterLoading(true);
// // // //       fetchData(manualPincode.trim());
// // // //     } else if (manualPincode.trim() === '') {
// // // //       setIsFilterLoading(true);
// // // //       fetchData(showAllVendors ? undefined : userPincode);
// // // //     } else {
// // // //       Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pincode');
// // // //     }
// // // //   }, [manualPincode, fetchData, showAllVendors, userPincode, distributorStatus]);

// // // //   const showAllVendorsHandler = useCallback(() => {
// // // //     // ✅ Disable show all when already joined
// // // //     if (distributorStatus.isJoined) {
// // // //       Alert.alert(
// // // //         'Already Joined',
// // // //         `You are currently working with ${distributorStatus.currentVendorName}. Only your current vendor is shown.`,
// // // //         [{ text: 'OK' }]
// // // //       );
// // // //       return;
// // // //     }
    
// // // //     console.log('🌐 Distributor showing all vendors');
// // // //     setShowAllVendors(true);
// // // //     setManualPincode('');
// // // //     fetchData();
// // // //   }, [fetchData, distributorStatus]);

// // // //   const showMyAreaVendors = useCallback(() => {
// // // //     // ✅ Disable area filter when already joined
// // // //     if (distributorStatus.isJoined) {
// // // //       Alert.alert(
// // // //         'Already Joined',
// // // //         `You are currently working with ${distributorStatus.currentVendorName}. Only your current vendor is shown.`,
// // // //         [{ text: 'OK' }]
// // // //       );
// // // //       return;
// // // //     }

// // // //     if (userPincode) {
// // // //       console.log('📍 Distributor showing vendors for area:', userPincode);
// // // //       setShowAllVendors(false);
// // // //       setManualPincode('');
// // // //       fetchData(userPincode);
// // // //     } else {
// // // //       Alert.alert('No Pincode', 'Please update your profile with your pincode first');
// // // //     }
// // // //   }, [fetchData, userPincode, distributorStatus]);

// // // //   const clearManualFilter = useCallback(() => {
// // // //     if (distributorStatus.isJoined) {
// // // //       return; // Don't allow clearing when joined
// // // //     }
// // // //     setManualPincode('');
// // // //     setIsFilterLoading(true);
// // // //     fetchData(showAllVendors ? undefined : userPincode);
// // // //   }, [fetchData, showAllVendors, userPincode, distributorStatus]);

// // // //   // Show current vendor details
// // // //   const showCurrentVendorInfo = useCallback(() => {
// // // //     Alert.alert(
// // // //       'Current Vendor Details',
// // // //       `Vendor: ${distributorStatus.currentVendorName || 'Unknown'}\nStatus: ${distributorStatus.status || 'Pending'}\nJoined: ${distributorStatus.joinedDate || 'N/A'}\n\nYou can only work with one vendor at a time.`,
// // // //       [{ text: 'OK' }]
// // // //     );
// // // //   }, [distributorStatus]);

// // // //   // Handle join vendor with restriction logic
// // // //   const sendRequest = useCallback(async (vendorId: string) => {
// // // //     try {
// // // //       // If already joined and clicking current vendor, show info
// // // //       if (distributorStatus.isJoined) {
// // // //         showCurrentVendorInfo();
// // // //         return;
// // // //       }

// // // //       setSubmittingId(vendorId);

// // // //       if (!user?.userID) {
// // // //         throw new Error('Distributor ID not found. Please log in again.');
// // // //       }

// // // //       const payload = {
// // // //         user_id: parseInt(user.userID.toString(), 10),
// // // //         user_type: 'milkman',
// // // //         vendor: parseInt(vendorId, 10),
// // // //       };

// // // //       console.log('📤 Distributor sending join request with payload:', payload);
// // // //       const response = await createRequest(payload);
      
// // // //       console.log('✅ Distributor request sent successfully:', response?.data?.message || 'Request completed');

// // // //       Alert.alert(
// // // //         'Request Sent Successfully!', 
// // // //         'Your request has been sent to the vendor. You can only work with one vendor at a time. Please wait for approval.',
// // // //         [{ text: 'OK' }]
// // // //       );
      
// // // //       setRequestedVendors(prev => [...prev, vendorId]);
      
// // // //       // Refresh status and data after successful request
// // // //       fetchDistributorStatus();
      
// // // //     } catch (err: any) {
// // // //       console.log('❌ Distributor request error:', err.message);
// // // //       const errorMessage = handleNetworkError(err);
// // // //       Alert.alert('Error', errorMessage);
// // // //     } finally {
// // // //       setSubmittingId(null);
// // // //     }
// // // //   }, [user?.userID, handleNetworkError, distributorStatus, showCurrentVendorInfo, fetchDistributorStatus]);

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

// // // //   // ✅ SIMPLIFIED: Vendor rendering (only current vendor or all vendors)
// // // //   const renderVendor = useCallback(({ item }: { item: Vendor }) => {
// // // //     const isRequested = requestedVendors.includes(item.id);
// // // //     const isSubmitting = submittingId === item.id;
    
// // // //     // Check if this is the current joined vendor
// // // //     const isCurrentVendor = distributorStatus.isJoined && 
// // // //                             distributorStatus.currentVendorId === item.id;

// // // //     const vendorName = item.name || item.business_name || 'Unnamed Vendor';
// // // //     const village = item.village || item.location || item.address || 'No location';
// // // //     const vendorPincode = item.pincode ? ` - ${item.pincode}` : '';
// // // //     const contact = item.contact || 'No contact';

// // // //     return (
// // // //       <View style={[
// // // //         styles.card, 
// // // //         isCurrentVendor && styles.currentVendorCard,
// // // //       ]}>
// // // //         {/* Current vendor badge */}
// // // //         {isCurrentVendor && (
// // // //           <View style={styles.currentVendorBadge}>
// // // //             <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
// // // //             <Text style={styles.currentVendorBadgeText}>Your Vendor</Text>
// // // //           </View>
// // // //         )}
        
// // // //         <View style={styles.info}>
// // // //           <Text style={styles.name}>{vendorName}</Text>

// // // //           <View style={styles.contactRow}>
// // // //             <Ionicons name="call-outline" size={16} color="#666" />
// // // //             <Text style={styles.contact}>{contact}</Text>
// // // //           </View>

// // // //           <View style={styles.addressRow}>
// // // //             <Ionicons name="location-outline" size={16} color="#666" />
// // // //             <Text style={styles.address}>{village}{vendorPincode}</Text>
// // // //           </View>

// // // //           <Text style={styles.rateText}>
// // // //             Cow Milk: {item.cr != null ? `₹${item.cr}/L` : 'Rate not set'}
// // // //           </Text>
// // // //           <Text style={styles.rateText}>
// // // //             Buffalo Milk: {item.br != null ? `₹${item.br}/L` : 'Rate not set'}
// // // //           </Text>
// // // //         </View>

// // // //         <TouchableOpacity
// // // //           style={[
// // // //             styles.button,
// // // //             (isRequested || isSubmitting) && styles.buttonDisabled,
// // // //             isCurrentVendor && styles.currentVendorButton,
// // // //           ]}
// // // //           onPress={() => !isSubmitting && sendRequest(item.id)}
// // // //           disabled={isSubmitting}
// // // //         >
// // // //           {isSubmitting ? (
// // // //             <ActivityIndicator size="small" color="#fff" />
// // // //           ) : (
// // // //             <Text style={[
// // // //               styles.buttonText,
// // // //               isCurrentVendor && styles.currentVendorButtonText
// // // //             ]}>
// // // //               {isCurrentVendor 
// // // //                 ? `Joined (${distributorStatus.status || 'Pending'})`
// // // //                 : isRequested 
// // // //                   ? 'Requested'
// // // //                   : 'Join Vendor'
// // // //               }
// // // //             </Text>
// // // //           )}
// // // //         </TouchableOpacity>
// // // //       </View>
// // // //     );
// // // //   }, [requestedVendors, submittingId, sendRequest, distributorStatus]);

// // // //   // Initialize
// // // //   useEffect(() => {
// // // //     console.log('🚀 Initializing DistributorHomeScreen');
// // // //     fetchUserProfile();
// // // //     fetchDistributorStatus();
// // // //   }, [fetchUserProfile, fetchDistributorStatus]);

// // // //   // ✅ MODIFIED: Fetch data after status is loaded
// // // //   useEffect(() => {
// // // //     if (!statusLoading && (userPincode || showAllVendors)) {
// // // //       console.log('✅ Status loaded, fetching vendors');
// // // //       fetchData();
// // // //     }
// // // //   }, [statusLoading, userPincode, showAllVendors, fetchData]);

// // // //   if (!isAuthenticated || !user?.userID) {
// // // //     return (
// // // //       <View style={[styles.container, styles.centered]}>
// // // //         <ActivityIndicator size="large" color="#007AFF" />
// // // //         <Text style={styles.loadingText}>Loading distributor information...</Text>
// // // //       </View>
// // // //     );
// // // //   }

// // // //   // ✅ MODIFIED: Dynamic filter text based on status
// // // //   const currentFilterText = distributorStatus.isJoined 
// // // //     ? `Showing your vendor: ${distributorStatus.currentVendorName}`
// // // //     : manualPincode 
// // // //       ? `Filtered by: ${manualPincode}` 
// // // //       : showAllVendors 
// // // //         ? 'Showing all vendors' 
// // // //         : userPincode 
// // // //           ? `Your area: ${userPincode}` 
// // // //           : 'No filter applied';

// // // //   return (
// // // //     <View style={styles.container}>
// // // //       {/* Header */}
// // // //       <View style={styles.header}>
// // // //         <View style={styles.headerLeft}>
// // // //           <Text style={styles.title}>
// // // //             {distributorStatus.isJoined ? 'Your Vendor' : 'Available Vendors'}
// // // //           </Text>
// // // //           {/* ✅ Hide filter toggle when joined */}
// // // //           {!distributorStatus.isJoined && (
// // // //             <TouchableOpacity 
// // // //               onPress={() => setShowManualFilter(!showManualFilter)}
// // // //               style={styles.filterToggle}
// // // //             >
// // // //               <Ionicons 
// // // //                 name={showManualFilter ? "chevron-up-outline" : "filter-outline"} 
// // // //                 size={24} 
// // // //                 color="#007AFF" 
// // // //               />
// // // //             </TouchableOpacity>
// // // //           )}
// // // //         </View>
// // // //         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
// // // //           <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
// // // //         </TouchableOpacity>
// // // //       </View>

// // // //       {/* Status Banner */}
// // // //       {statusLoading ? (
// // // //         <View style={styles.statusBanner}>
// // // //           <ActivityIndicator size="small" color="#666" />
// // // //           <Text style={styles.statusText}>Checking vendor assignment...</Text>
// // // //         </View>
// // // //       ) : distributorStatus.isJoined ? (
// // // //         <View style={styles.joinedStatusBanner}>
// // // //           <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
// // // //           <View style={styles.statusTextContainer}>
// // // //             <Text style={styles.joinedStatusText}>
// // // //               Currently working with: {distributorStatus.currentVendorName || 'Unknown Vendor'}
// // // //             </Text>
// // // //             <Text style={styles.joinedStatusSubtext}>
// // // //               Status: {distributorStatus.status || 'Pending'} • Joined: {distributorStatus.joinedDate || 'N/A'}
// // // //             </Text>
// // // //           </View>
// // // //           <TouchableOpacity onPress={showCurrentVendorInfo} style={styles.infoButton}>
// // // //             <Ionicons name="information-circle-outline" size={18} color="#4CAF50" />
// // // //           </TouchableOpacity>
// // // //         </View>
// // // //       ) : (
// // // //         <View style={styles.availableStatusBanner}>
// // // //           <Ionicons name="storefront-outline" size={20} color="#FF9500" />
// // // //           <Text style={styles.availableStatusText}>
// // // //             You can join one vendor. Choose wisely!
// // // //           </Text>
// // // //         </View>
// // // //       )}

// // // //       {/* Status Bar */}
// // // //       <View style={styles.statusContainer}>
// // // //         <Text style={styles.statusText}>{currentFilterText}</Text>
// // // //         <Text style={styles.debugText}>Found: {vendors.length}</Text>
// // // //         {/* ✅ Hide filter actions when joined */}
// // // //         {!distributorStatus.isJoined && (
// // // //           <View style={styles.filterActions}>
// // // //             {!showAllVendors && userPincode && (
// // // //               <TouchableOpacity style={styles.actionButton} onPress={showAllVendorsHandler}>
// // // //                 <Text style={styles.actionText}>Show All</Text>
// // // //               </TouchableOpacity>
// // // //             )}
// // // //             {showAllVendors && userPincode && (
// // // //               <TouchableOpacity style={styles.actionButton} onPress={showMyAreaVendors}>
// // // //                 <Text style={styles.actionText}>My Area</Text>
// // // //               </TouchableOpacity>
// // // //             )}
// // // //           </View>
// // // //         )}
// // // //       </View>

// // // //       {/* ✅ Hide manual filter when joined */}
// // // //       {showManualFilter && !distributorStatus.isJoined && (
// // // //         <View style={styles.filterContainer}>
// // // //           <View style={styles.pincodeInputContainer}>
// // // //             <TextInput
// // // //               style={styles.pincodeInput}
// // // //               placeholder="Enter 6-digit pincode"
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

// // // //       {/* Error Banner */}
// // // //       {error && (
// // // //         <View style={styles.errorBanner}>
// // // //           <View style={styles.errorContent}>
// // // //             <Ionicons name="warning-outline" size={20} color="#c00" />
// // // //             <Text style={styles.errorText}>{error}</Text>
// // // //           </View>
// // // //           <TouchableOpacity onPress={onRefresh} style={styles.retry}>
// // // //             <Text style={styles.retryText}>Retry</Text>
// // // //           </TouchableOpacity>
// // // //         </View>
// // // //       )}

// // // //       {/* Vendor List */}
// // // //       <FlatList
// // // //         data={vendors}
// // // //         renderItem={renderVendor}
// // // //         keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
// // // //         contentContainerStyle={styles.listContent}
// // // //         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
// // // //         ListEmptyComponent={() => (
// // // //           <View style={styles.emptyContainer}>
// // // //             {isLoading ? (
// // // //               <>
// // // //                 <ActivityIndicator size="large" color="#007AFF" />
// // // //                 <Text style={styles.loadingText}>Loading vendors...</Text>
// // // //               </>
// // // //             ) : (
// // // //               <>
// // // //                 <Ionicons name="storefront-outline" size={64} color="#ccc" />
// // // //                 <Text style={styles.emptyText}>
// // // //                   {distributorStatus.isJoined 
// // // //                     ? 'Your current vendor is not available'
// // // //                     : error 
// // // //                       ? 'Unable to load vendors' 
// // // //                       : manualPincode 
// // // //                         ? `No vendors found in ${manualPincode}` 
// // // //                         : !showAllVendors && userPincode
// // // //                           ? `No vendors in your area (${userPincode})`
// // // //                           : 'No vendors available'
// // // //                   }
// // // //                 </Text>
// // // //                 {!showAllVendors && userPincode && !error && !distributorStatus.isJoined && (
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
// // // //   container: { 
// // // //     flex: 1, 
// // // //     backgroundColor: '#f8f9fa' 
// // // //   },
// // // //   centered: { 
// // // //     justifyContent: 'center', 
// // // //     alignItems: 'center' 
// // // //   },
// // // //   loadingText: { 
// // // //     marginTop: 16, 
// // // //     color: '#666', 
// // // //     fontSize: 16 
// // // //   },
  
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
// // // //   title: { 
// // // //     fontSize: 20, 
// // // //     fontWeight: 'bold', 
// // // //     color: '#333', 
// // // //     marginRight: 12 
// // // //   },
// // // //   filterToggle: {
// // // //     padding: 4,
// // // //   },
// // // //   logoutButton: { 
// // // //     padding: 4 
// // // //   },
  
// // // //   statusBanner: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#f0f8ff',
// // // //     padding: 12,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#e3f2fd',
// // // //   },
// // // //   joinedStatusBanner: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#e8f5e8',
// // // //     padding: 12,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#c8e6c9',
// // // //   },
// // // //   availableStatusBanner: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#fff8e1',
// // // //     padding: 12,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#ffcc02',
// // // //   },
// // // //   statusTextContainer: {
// // // //     flex: 1,
// // // //     marginLeft: 8,
// // // //   },
// // // //   joinedStatusText: {
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //     color: '#2e7d32',
// // // //   },
// // // //   joinedStatusSubtext: {
// // // //     fontSize: 12,
// // // //     color: '#4caf50',
// // // //     marginTop: 2,
// // // //   },
// // // //   availableStatusText: {
// // // //     fontSize: 14,
// // // //     fontWeight: '500',
// // // //     color: '#f57c00',
// // // //     marginLeft: 8,
// // // //   },
// // // //   infoButton: {
// // // //     padding: 8,
// // // //   },
  
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
// // // //   debugText: {
// // // //     fontSize: 12,
// // // //     color: '#666',
// // // //     fontWeight: '600',
// // // //     marginRight: 8,
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
// // // //     backgroundColor: '#fff0f0',
// // // //     padding: 16,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#ffcdd2',
// // // //   },
// // // //   errorContent: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'flex-start',
// // // //     marginBottom: 8,
// // // //   },
// // // //   errorText: { 
// // // //     color: '#c00', 
// // // //     fontSize: 14, 
// // // //     flex: 1, 
// // // //     marginLeft: 8, 
// // // //     lineHeight: 20 
// // // //   },
// // // //   retry: {
// // // //     backgroundColor: '#007AFF',
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 8,
// // // //     borderRadius: 8,
// // // //     alignSelf: 'flex-start',
// // // //   },
// // // //   retryText: { 
// // // //     color: '#fff', 
// // // //     fontSize: 14, 
// // // //     fontWeight: '600' 
// // // //   },
  
// // // //   listContent: { 
// // // //     paddingBottom: 16 
// // // //   },
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
// // // //   currentVendorCard: {
// // // //     borderWidth: 2,
// // // //     borderColor: '#4CAF50',
// // // //     backgroundColor: '#f1f8e9',
// // // //   },
// // // //   currentVendorBadge: {
// // // //     position: 'absolute',
// // // //     top: 8,
// // // //     right: 8,
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#4CAF50',
// // // //     paddingHorizontal: 8,
// // // //     paddingVertical: 4,
// // // //     borderRadius: 12,
// // // //     zIndex: 1,
// // // //   },
// // // //   currentVendorBadgeText: {
// // // //     color: '#fff',
// // // //     fontSize: 10,
// // // //     fontWeight: '600',
// // // //     marginLeft: 4,
// // // //   },
// // // //   info: { 
// // // //     flex: 1,
// // // //     paddingRight: 8,
// // // //   },
// // // //   name: { 
// // // //     fontSize: 18, 
// // // //     fontWeight: 'bold', 
// // // //     color: '#333', 
// // // //     marginBottom: 8 
// // // //   },
// // // //   contactRow: { 
// // // //     flexDirection: 'row', 
// // // //     alignItems: 'center', 
// // // //     marginBottom: 4 
// // // //   },
// // // //   contact: { 
// // // //     fontSize: 14, 
// // // //     color: '#666', 
// // // //     marginLeft: 8 
// // // //   },
// // // //   addressRow: { 
// // // //     flexDirection: 'row', 
// // // //     alignItems: 'center', 
// // // //     marginBottom: 4 
// // // //   },
// // // //   address: { 
// // // //     fontSize: 14, 
// // // //     color: '#666', 
// // // //     marginLeft: 8 
// // // //   },
// // // //   rateText: { 
// // // //     fontSize: 14, 
// // // //     color: '#704214', 
// // // //     marginTop: 2 
// // // //   },
// // // //   button: {
// // // //     backgroundColor: '#007AFF',
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 8,
// // // //     borderRadius: 8,
// // // //     minWidth: 120,
// // // //     alignItems: 'center',
// // // //   },
// // // //   buttonDisabled: { 
// // // //     backgroundColor: '#C0C0C0' 
// // // //   },
// // // //   currentVendorButton: {
// // // //     backgroundColor: '#4CAF50',
// // // //   },
// // // //   buttonText: { 
// // // //     color: '#fff', 
// // // //     fontWeight: '600' 
// // // //   },
// // // //   currentVendorButtonText: {
// // // //     fontSize: 12,
// // // //   },
  
// // // //   emptyContainer: { 
// // // //     flex: 1, 
// // // //     alignItems: 'center', 
// // // //     justifyContent: 'center', 
// // // //     padding: 40 
// // // //   },
// // // //   emptyText: { 
// // // //     color: '#666', 
// // // //     fontSize: 18, 
// // // //     textAlign: 'center', 
// // // //     marginTop: 16 
// // // //   },
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

// // // // export default DistributorHomeScreen;
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
// // //   getDistributorDetailsById,
// // //   getDistributorVendorStatus,
// // // } from '../../apiServices/allApi';

// // // type DistributorHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DistributorHome'>;

// // // interface Vendor {
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
// // // }

// // // interface DistributorVendorStatus {
// // //   isJoined: boolean;
// // //   currentVendorId?: string;
// // //   currentVendorName?: string;
// // //   joinedDate?: string;
// // //   status?: 'approved' | 'pending' | 'rejected';
// // // }

// // // interface ApiError {
// // //   message?: string;
// // //   response?: {
// // //     status?: number;
// // //     data?: {
// // //       message?: string;
// // //       detail?: string;
// // //     };
// // //   };
// // //   code?: string;
// // // }

// // // const DistributorHomeScreen: React.FC = () => {
// // //   const navigation = useNavigation<DistributorHomeNavigationProp>();
// // //   const dispatch = useDispatch<AppDispatch>();

// // //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

// // //   // Core states
// // //   const [vendors, setVendors] = useState<Vendor[]>([]);
// // //   const [requestedVendors, setRequestedVendors] = useState<Set<string>>(new Set());
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [refreshing, setRefreshing] = useState(false);
// // //   const [submittingId, setSubmittingId] = useState<string | null>(null);
// // //   const [error, setError] = useState<string | null>(null);
  
// // //   // Distributor vendor status
// // //   const [distributorStatus, setDistributorStatus] = useState<DistributorVendorStatus>({
// // //     isJoined: false,
// // //   });
// // //   const [statusLoading, setStatusLoading] = useState(true);
  
// // //   // Profile states
// // //   const [userPincode, setUserPincode] = useState<string>('');
// // //   const [showAllVendors, setShowAllVendors] = useState(false);
  
// // //   // Filter states
// // //   const [manualPincode, setManualPincode] = useState('');
// // //   const [showManualFilter, setShowManualFilter] = useState(false);
// // //   const [isFilterLoading, setIsFilterLoading] = useState(false);

// // //   // Enhanced network error handler
// // //   const handleNetworkError = useCallback((err: ApiError): string => {
// // //     console.log('🌐 Network error details:', {
// // //       message: err?.message,
// // //       code: err?.code,
// // //       status: err?.response?.status,
// // //       responseData: err?.response?.data
// // //     });

// // //     if (err?.message?.includes('Network Error') || err?.code === 'NETWORK_ERROR') {
// // //       return 'Network connection failed. Please check your internet connection and try again.';
// // //     }

// // //     switch (err?.response?.status) {
// // //       case 401:
// // //         return 'Authentication failed. Please login again.';
// // //       case 403:
// // //         return 'Access denied. Please check your permissions.';
// // //       case 404:
// // //         return 'Service not found. Please check your connection.';
// // //       case 500:
// // //         return 'Server error. Please try again later.';
// // //       case 503:
// // //         return 'Service temporarily unavailable. Please try again later.';
// // //       default:
// // //         return err?.response?.data?.detail || 
// // //                err?.response?.data?.message || 
// // //                err?.message || 
// // //                'Something went wrong. Please try again.';
// // //     }
// // //   }, []);

// // //   // Check distributor's vendor assignment status
// // //   const fetchDistributorStatus = useCallback(async (): Promise<void> => {
// // //     if (!user?.userID) {
// // //       console.log('❌ No distributor ID found');
// // //       setDistributorStatus({ isJoined: false });
// // //       setStatusLoading(false);
// // //       return;
// // //     }

// // //     try {
// // //       setStatusLoading(true);
// // //       console.log('🔍 Checking distributor vendor assignment for ID:', user.userID);

// // //       const statusRes = await getDistributorVendorStatus(user.userID.toString());
// // //       console.log('📊 Distributor assignment response:', statusRes?.data);

// // //       const statusData = statusRes?.data;
      
// // //       if (statusData) {
// // //         const status: DistributorVendorStatus = {
// // //           isJoined: Boolean(statusData.isJoined),
// // //           currentVendorId: statusData.currentVendorId?.toString(),
// // //           currentVendorName: statusData.currentVendorName || undefined,
// // //           joinedDate: statusData.joinedDate || undefined,
// // //           status: statusData.status || 'pending',
// // //         };
        
// // //         setDistributorStatus(status);
        
// // //         if (status.isJoined) {
// // //           console.log('✅ Distributor already assigned to vendor:', status.currentVendorName);
// // //         } else {
// // //           console.log('⚠️ Distributor not assigned to any vendor yet');
// // //         }
// // //       } else {
// // //         setDistributorStatus({ isJoined: false });
// // //       }
// // //     } catch (err) {
// // //       console.log('❌ Error fetching distributor assignment status:', err);
// // //       // Don't show error for status check, just assume not joined
// // //       setDistributorStatus({ isJoined: false });
// // //     } finally {
// // //       setStatusLoading(false);
// // //     }
// // //   }, [user?.userID]);

// // //   // Fetch distributor profile for pincode
// // //   const fetchUserProfile = useCallback(async (): Promise<void> => {
// // //     if (!user?.userID) {
// // //       console.log('❌ No userID found');
// // //       setShowAllVendors(true);
// // //       return;
// // //     }
    
// // //     try {
// // //       console.log('🔍 Fetching distributor profile for ID:', user.userID);
// // //       const response = await getDistributorDetailsById(user.userID);
// // //       console.log('👤 Distributor profile response received');
      
// // //       const profileData = response?.data?.data || response?.data;
      
// // //       if (profileData?.pincode) {
// // //         setUserPincode(profileData.pincode);
// // //         console.log('✅ Distributor pincode found:', profileData.pincode);
// // //       } else {
// // //         console.log('⚠️ No pincode found, showing all vendors');
// // //         setShowAllVendors(true);
// // //       }
// // //     } catch (err) {
// // //       console.log('❌ Error fetching distributor profile:', err);
// // //       setShowAllVendors(true);
// // //     }
// // //   }, [user?.userID]);

// // //   // Fetch and filter vendors based on status
// // //   const fetchData = useCallback(async (filterPincode?: string): Promise<void> => {
// // //     if (!user?.userID) {
// // //       throw new Error('Distributor ID not found. Please log in again.');
// // //     }

// // //     setError(null);
// // //     setIsLoading(true);
    
// // //     try {
// // //       // Determine pincode filter (only when not joined)
// // //       let pincodeToFilter = filterPincode;
// // //       if (!distributorStatus.isJoined && !pincodeToFilter && !showAllVendors && userPincode) {
// // //         pincodeToFilter = userPincode;
// // //       }

// // //       console.log('🏪 Fetching vendors for distributor:', {
// // //         distributorId: user.userID,
// // //         isJoined: distributorStatus.isJoined,
// // //         currentVendorId: distributorStatus.currentVendorId,
// // //         pincode: pincodeToFilter || 'all'
// // //       });

// // //       const vendorRes = await getAllVendors(pincodeToFilter);
// // //       console.log('📡 Vendors API response received');

// // //       // Parse API response with multiple strategies
// // //       let vendorList: Vendor[] = [];
      
// // //       if (vendorRes?.data?.results && Array.isArray(vendorRes.data.results)) {
// // //         vendorList = vendorRes.data.results;
// // //         console.log('✅ Found vendors in data.results:', vendorList.length);
// // //       } else if (vendorRes?.data?.data && Array.isArray(vendorRes.data.data)) {
// // //         vendorList = vendorRes.data.data;
// // //         console.log('✅ Found vendors in data.data:', vendorList.length);
// // //       } else if (vendorRes?.data && Array.isArray(vendorRes.data)) {
// // //         vendorList = vendorRes.data;
// // //         console.log('✅ Found vendors in data:', vendorList.length);
// // //       } else {
// // //         console.log('❌ No vendor array found in response structure');
// // //         vendorList = [];
// // //       }

// // //       // 🎯 MAIN FILTERING LOGIC: Show only current vendor if joined
// // //       let filteredVendors: Vendor[] = vendorList;
      
// // //       if (distributorStatus.isJoined && distributorStatus.currentVendorId) {
// // //         // ✅ JOINED: Show ONLY current vendor
// // //         filteredVendors = vendorList.filter(vendor => 
// // //           vendor.id?.toString() === distributorStatus.currentVendorId
// // //         );
// // //         console.log('🎯 Distributor joined - showing only current vendor:', {
// // //           currentVendorId: distributorStatus.currentVendorId,
// // //           foundCurrentVendor: filteredVendors.length > 0,
// // //           vendorName: filteredVendors[0]?.name || filteredVendors[0]?.business_name
// // //         });
// // //       } else {
// // //         // ✅ NOT JOINED: Show all vendors with filters
// // //         console.log('🌐 Distributor not joined - showing all available vendors:', vendorList.length);
// // //       }

// // //       setVendors(filteredVendors);

// // //     } catch (err) {
// // //       console.log('❌ Vendor fetch error:', err);
// // //       const errorMessage = handleNetworkError(err as ApiError);
// // //       setError(errorMessage);
// // //       setVendors([]);
// // //     } finally {
// // //       setIsLoading(false);
// // //       setRefreshing(false);
// // //       setIsFilterLoading(false);
// // //     }
// // //   }, [user?.userID, userPincode, showAllVendors, handleNetworkError, distributorStatus]);

// // //   // Refresh data
// // //   const onRefresh = useCallback(async (): Promise<void> => {
// // //     setRefreshing(true);
// // //     try {
// // //       // Refresh status first, then vendors
// // //       await fetchDistributorStatus();
// // //       const currentFilter = !distributorStatus.isJoined ? 
// // //         (manualPincode || (showAllVendors ? undefined : userPincode)) : undefined;
// // //       await fetchData(currentFilter);
// // //     } catch (err) {
// // //       console.log('❌ Refresh error:', err);
// // //     }
// // //   }, [fetchData, fetchDistributorStatus, manualPincode, showAllVendors, userPincode, distributorStatus.isJoined]);

// // //   // Handle manual pincode filter (disabled when joined)
// // //   const handleManualFilter = useCallback((): void => {
// // //     if (distributorStatus.isJoined) {
// // //       Alert.alert(
// // //         'Filter Disabled',
// // //         `You are currently working with ${distributorStatus.currentVendorName}. Only your current vendor is shown.`,
// // //         [{ text: 'OK' }]
// // //       );
// // //       return;
// // //     }

// // //     if (manualPincode.trim().length === 6) {
// // //       setIsFilterLoading(true);
// // //       fetchData(manualPincode.trim());
// // //     } else if (manualPincode.trim() === '') {
// // //       setIsFilterLoading(true);
// // //       fetchData(showAllVendors ? undefined : userPincode);
// // //     } else {
// // //       Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pincode');
// // //     }
// // //   }, [manualPincode, fetchData, showAllVendors, userPincode, distributorStatus]);

// // //   // Show all vendors (disabled when joined)
// // //   const showAllVendorsHandler = useCallback((): void => {
// // //     if (distributorStatus.isJoined) {
// // //       Alert.alert(
// // //         'Already Joined',
// // //         `You are currently working with ${distributorStatus.currentVendorName}. Only your current vendor is shown.`,
// // //         [{ text: 'OK' }]
// // //       );
// // //       return;
// // //     }
    
// // //     console.log('🌐 Showing all vendors');
// // //     setShowAllVendors(true);
// // //     setManualPincode('');
// // //     fetchData();
// // //   }, [fetchData, distributorStatus]);

// // //   // Show area vendors (disabled when joined)
// // //   const showMyAreaVendors = useCallback((): void => {
// // //     if (distributorStatus.isJoined) {
// // //       Alert.alert(
// // //         'Already Joined',
// // //         `You are currently working with ${distributorStatus.currentVendorName}. Only your current vendor is shown.`,
// // //         [{ text: 'OK' }]
// // //       );
// // //       return;
// // //     }

// // //     if (userPincode) {
// // //       console.log('📍 Showing vendors for area:', userPincode);
// // //       setShowAllVendors(false);
// // //       setManualPincode('');
// // //       fetchData(userPincode);
// // //     } else {
// // //       Alert.alert('No Pincode', 'Please update your profile with your pincode first');
// // //     }
// // //   }, [fetchData, userPincode, distributorStatus]);

// // //   // Clear manual filter (disabled when joined)
// // //   const clearManualFilter = useCallback((): void => {
// // //     if (distributorStatus.isJoined) return;
    
// // //     setManualPincode('');
// // //     setIsFilterLoading(true);
// // //     fetchData(showAllVendors ? undefined : userPincode);
// // //   }, [fetchData, showAllVendors, userPincode, distributorStatus.isJoined]);

// // //   // Show current vendor details
// // //   const showCurrentVendorInfo = useCallback((): void => {
// // //     Alert.alert(
// // //       'Current Vendor Details',
// // //       `Vendor: ${distributorStatus.currentVendorName || 'Unknown'}\nStatus: ${distributorStatus.status || 'Pending'}\nJoined: ${distributorStatus.joinedDate || 'N/A'}\n\nYou can only work with one vendor at a time.`,
// // //       [{ text: 'OK' }]
// // //     );
// // //   }, [distributorStatus]);

// // //   // Handle join vendor request
// // //   const sendRequest = useCallback(async (vendorId: string): Promise<void> => {
// // //     if (submittingId) return; // Prevent double submission

// // //     try {
// // //       // If already joined, show vendor info
// // //       if (distributorStatus.isJoined) {
// // //         showCurrentVendorInfo();
// // //         return;
// // //       }

// // //       setSubmittingId(vendorId);

// // //       if (!user?.userID) {
// // //         throw new Error('Distributor ID not found. Please log in again.');
// // //       }

// // //       const payload = {
// // //         user_id: parseInt(user.userID.toString(), 10),
// // //         user_type: 'milkman', // Backend expects 'milkman' for distributors
// // //         vendor: parseInt(vendorId, 10),
// // //       };

// // //       console.log('📤 Sending join request:', payload);
// // //       const response = await createRequest(payload);
      
// // //       console.log('✅ Join request successful:', response?.data?.message || 'Request completed');

// // //       Alert.alert(
// // //         'Request Sent Successfully!', 
// // //         'Your request has been sent to the vendor. You can only work with one vendor at a time. Please wait for approval.\n\nYou will be notified once the vendor responds.',
// // //         [{ text: 'OK' }]
// // //       );
      
// // //       // Add to requested vendors
// // //       setRequestedVendors(prev => new Set([...prev, vendorId]));
      
// // //       // Refresh status after successful request
// // //       await fetchDistributorStatus();
      
// // //     } catch (err) {
// // //       console.log('❌ Join request error:', err);
// // //       const errorMessage = handleNetworkError(err as ApiError);
// // //       Alert.alert('Error', errorMessage);
// // //     } finally {
// // //       setSubmittingId(null);
// // //     }
// // //   }, [user?.userID, handleNetworkError, distributorStatus, showCurrentVendorInfo, fetchDistributorStatus, submittingId]);

// // //   // Handle logout
// // //   const handleLogout = useCallback((): void => {
// // //     Alert.alert(
// // //       'Logout',
// // //       'Are you sure you want to log out?',
// // //       [
// // //         { text: 'Cancel', style: 'cancel' },
// // //         {
// // //           text: 'Logout',
// // //           style: 'destructive',
// // //           onPress: async (): Promise<void> => {
// // //             try {
// // //               await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
// // //               dispatch(logout());
// // //               navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
// // //             } catch (err) {
// // //               console.error('Logout error:', err);
// // //             }
// // //           },
// // //         },
// // //       ],
// // //       { cancelable: true }
// // //     );
// // //   }, [dispatch, navigation]);

// // //   // Render vendor item
// // //   const renderVendor = useCallback(({ item }: { item: Vendor }) => {
// // //     const isRequested = requestedVendors.has(item.id);
// // //     const isSubmitting = submittingId === item.id;
    
// // //     // Check if this is the current vendor
// // //     const isCurrentVendor = distributorStatus.isJoined && 
// // //                             distributorStatus.currentVendorId === item.id;

// // //     const vendorName = item.name || item.business_name || 'Unnamed Vendor';
// // //     const village = item.village || item.location || item.address || 'No location provided';
// // //     const vendorPincode = item.pincode ? ` - ${item.pincode}` : '';
// // //     const contact = item.contact || 'No contact available';

// // //     return (
// // //       <View style={[
// // //         styles.card, 
// // //         isCurrentVendor && styles.currentVendorCard,
// // //       ]}>
// // //         {/* Current vendor badge */}
// // //         {isCurrentVendor && (
// // //           <View style={styles.currentVendorBadge}>
// // //             <Ionicons name="checkmark-circle" size={16} color="#fff" />
// // //             <Text style={styles.currentVendorBadgeText}>Your Vendor</Text>
// // //           </View>
// // //         )}
        
// // //         <View style={styles.info}>
// // //           <Text style={styles.name}>{vendorName}</Text>

// // //           <View style={styles.contactRow}>
// // //             <Ionicons name="call-outline" size={16} color="#666" />
// // //             <Text style={styles.contact}>{contact}</Text>
// // //           </View>

// // //           <View style={styles.addressRow}>
// // //             <Ionicons name="location-outline" size={16} color="#666" />
// // //             <Text style={styles.address}>{village}{vendorPincode}</Text>
// // //           </View>

// // //           <View style={styles.ratesContainer}>
// // //             <Text style={styles.rateText}>
// // //               Cow Milk: {item.cr != null ? `₹${item.cr}/L` : 'Rate not set'}
// // //             </Text>
// // //             <Text style={styles.rateText}>
// // //               Buffalo Milk: {item.br != null ? `₹${item.br}/L` : 'Rate not set'}
// // //             </Text>
// // //           </View>
// // //         </View>

// // //         <TouchableOpacity
// // //           style={[
// // //             styles.button,
// // //             (isRequested || isSubmitting) && styles.buttonDisabled,
// // //             isCurrentVendor && styles.currentVendorButton,
// // //           ]}
// // //           onPress={() => sendRequest(item.id)}
// // //           disabled={isSubmitting}
// // //           activeOpacity={0.7}
// // //         >
// // //           {isSubmitting ? (
// // //             <ActivityIndicator size="small" color="#fff" />
// // //           ) : (
// // //             <Text style={[
// // //               styles.buttonText,
// // //               isCurrentVendor && styles.currentVendorButtonText
// // //             ]}>
// // //               {isCurrentVendor 
// // //                 ? `Joined (${distributorStatus.status || 'Pending'})`
// // //                 : isRequested 
// // //                   ? 'Requested'
// // //                   : 'Join Vendor'
// // //               }
// // //             </Text>
// // //           )}
// // //         </TouchableOpacity>
// // //       </View>
// // //     );
// // //   }, [requestedVendors, submittingId, sendRequest, distributorStatus]);

// // //   // Initialize component
// // //   useEffect(() => {
// // //     console.log('🚀 Initializing DistributorHomeScreen');
    
// // //     const initialize = async (): Promise<void> => {
// // //       try {
// // //         await Promise.all([
// // //           fetchUserProfile(),
// // //           fetchDistributorStatus(),
// // //         ]);
// // //       } catch (err) {
// // //         console.log('❌ Initialization error:', err);
// // //       }
// // //     };

// // //     initialize();
// // //   }, [fetchUserProfile, fetchDistributorStatus]);

// // //   // Fetch vendors after status and profile are loaded
// // //   useEffect(() => {
// // //     if (!statusLoading && (userPincode || showAllVendors)) {
// // //       console.log('✅ Dependencies ready, fetching vendors');
// // //       fetchData();
// // //     }
// // //   }, [statusLoading, userPincode, showAllVendors, fetchData]);

// // //   // Loading state
// // //   if (!isAuthenticated || !user?.userID) {
// // //     return (
// // //       <View style={[styles.container, styles.centered]}>
// // //         <ActivityIndicator size="large" color="#007AFF" />
// // //         <Text style={styles.loadingText}>Loading distributor information...</Text>
// // //       </View>
// // //     );
// // //   }

// // //   // Dynamic filter text based on status
// // //   const currentFilterText = distributorStatus.isJoined 
// // //     ? `Showing your vendor: ${distributorStatus.currentVendorName || 'Current Vendor'}`
// // //     : manualPincode 
// // //       ? `Filtered by: ${manualPincode}` 
// // //       : showAllVendors 
// // //         ? 'Showing all vendors' 
// // //         : userPincode 
// // //           ? `Your area: ${userPincode}` 
// // //           : 'No filter applied';

// // //   return (
// // //     <View style={styles.container}>
// // //       {/* Header */}
// // //       <View style={styles.header}>
// // //         <View style={styles.headerLeft}>
// // //           <Text style={styles.title}>
// // //             {distributorStatus.isJoined ? 'Your Vendor' : 'Available Vendors'}
// // //           </Text>
// // //           {/* Hide filter toggle when joined */}
// // //           {!distributorStatus.isJoined && (
// // //             <TouchableOpacity 
// // //               onPress={() => setShowManualFilter(!showManualFilter)}
// // //               style={styles.filterToggle}
// // //               activeOpacity={0.7}
// // //             >
// // //               <Ionicons 
// // //                 name={showManualFilter ? "chevron-up-outline" : "filter-outline"} 
// // //                 size={24} 
// // //                 color="#007AFF" 
// // //               />
// // //             </TouchableOpacity>
// // //           )}
// // //         </View>
// // //         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} activeOpacity={0.7}>
// // //           <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
// // //         </TouchableOpacity>
// // //       </View>

// // //       {/* Status Banner */}
// // //       {statusLoading ? (
// // //         <View style={styles.statusBanner}>
// // //           <ActivityIndicator size="small" color="#666" />
// // //           <Text style={styles.statusBannerText}>Checking vendor assignment...</Text>
// // //         </View>
// // //       ) : distributorStatus.isJoined ? (
// // //         <View style={styles.joinedStatusBanner}>
// // //           <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
// // //           <View style={styles.statusTextContainer}>
// // //             <Text style={styles.joinedStatusText}>
// // //               Currently working with: {distributorStatus.currentVendorName || 'Unknown Vendor'}
// // //             </Text>
// // //             <Text style={styles.joinedStatusSubtext}>
// // //               Status: {distributorStatus.status || 'Pending'} • Joined: {distributorStatus.joinedDate || 'N/A'}
// // //             </Text>
// // //           </View>
// // //           <TouchableOpacity onPress={showCurrentVendorInfo} style={styles.infoButton} activeOpacity={0.7}>
// // //             <Ionicons name="information-circle-outline" size={18} color="#4CAF50" />
// // //           </TouchableOpacity>
// // //         </View>
// // //       ) : (
// // //         <View style={styles.availableStatusBanner}>
// // //           <Ionicons name="storefront-outline" size={20} color="#FF9500" />
// // //           <Text style={styles.availableStatusText}>
// // //             You can join one vendor. Choose wisely!
// // //           </Text>
// // //         </View>
// // //       )}

// // //       {/* Filter Status */}
// // //       <View style={styles.statusContainer}>
// // //         <Text style={styles.statusText}>{currentFilterText}</Text>
// // //         <Text style={styles.debugText}>Found: {vendors.length}</Text>
        
// // //         {/* Hide filter actions when joined */}
// // //         {!distributorStatus.isJoined && (
// // //           <View style={styles.filterActions}>
// // //             {!showAllVendors && userPincode && (
// // //               <TouchableOpacity 
// // //                 style={styles.actionButton} 
// // //                 onPress={showAllVendorsHandler}
// // //                 activeOpacity={0.7}
// // //               >
// // //                 <Text style={styles.actionText}>Show All</Text>
// // //               </TouchableOpacity>
// // //             )}
// // //             {showAllVendors && userPincode && (
// // //               <TouchableOpacity 
// // //                 style={styles.actionButton} 
// // //                 onPress={showMyAreaVendors}
// // //                 activeOpacity={0.7}
// // //               >
// // //                 <Text style={styles.actionText}>My Area</Text>
// // //               </TouchableOpacity>
// // //             )}
// // //           </View>
// // //         )}
// // //       </View>

// // //       {/* Manual Filter - Hide when joined */}
// // //       {showManualFilter && !distributorStatus.isJoined && (
// // //         <View style={styles.filterContainer}>
// // //           <View style={styles.pincodeInputContainer}>
// // //             <TextInput
// // //               style={styles.pincodeInput}
// // //               placeholder="Enter 6-digit pincode"
// // //               value={manualPincode}
// // //               onChangeText={setManualPincode}
// // //               keyboardType="numeric"
// // //               maxLength={6}
// // //               placeholderTextColor="#999"
// // //               returnKeyType="search"
// // //               onSubmitEditing={handleManualFilter}
// // //             />
// // //             <TouchableOpacity 
// // //               style={[styles.filterButton, isFilterLoading && styles.filterButtonDisabled]}
// // //               onPress={handleManualFilter}
// // //               disabled={isFilterLoading}
// // //               activeOpacity={0.7}
// // //             >
// // //               {isFilterLoading ? (
// // //                 <ActivityIndicator size="small" color="#fff" />
// // //               ) : (
// // //                 <Ionicons name="search-outline" size={20} color="#fff" />
// // //               )}
// // //             </TouchableOpacity>
// // //             {manualPincode.length > 0 && (
// // //               <TouchableOpacity 
// // //                 style={styles.clearButton} 
// // //                 onPress={clearManualFilter}
// // //                 activeOpacity={0.7}
// // //               >
// // //                 <Ionicons name="close-outline" size={20} color="#666" />
// // //               </TouchableOpacity>
// // //             )}
// // //           </View>
// // //         </View>
// // //       )}

// // //       {/* Error Banner */}
// // //       {error && (
// // //         <View style={styles.errorBanner}>
// // //           <View style={styles.errorContent}>
// // //             <Ionicons name="warning-outline" size={20} color="#c00" />
// // //             <Text style={styles.errorText}>{error}</Text>
// // //           </View>
// // //           <TouchableOpacity onPress={onRefresh} style={styles.retry} activeOpacity={0.7}>
// // //             <Text style={styles.retryText}>Retry</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       )}

// // //       {/* Vendor List */}
// // //       <FlatList
// // //         data={vendors}
// // //         renderItem={renderVendor}
// // //         keyExtractor={(item, index) => item.id?.toString() || `vendor-${index}`}
// // //         contentContainerStyle={[
// // //           styles.listContent,
// // //           vendors.length === 0 && styles.emptyListContent
// // //         ]}
// // //         refreshControl={
// // //           <RefreshControl 
// // //             refreshing={refreshing} 
// // //             onRefresh={onRefresh}
// // //             colors={['#007AFF']}
// // //             tintColor="#007AFF"
// // //           />
// // //         }
// // //         ListEmptyComponent={() => (
// // //           <View style={styles.emptyContainer}>
// // //             {isLoading ? (
// // //               <>
// // //                 <ActivityIndicator size="large" color="#007AFF" />
// // //                 <Text style={styles.loadingText}>Loading vendors...</Text>
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <Ionicons 
// // //                   name={distributorStatus.isJoined ? "checkmark-circle-outline" : "storefront-outline"} 
// // //                   size={64} 
// // //                   color="#ccc" 
// // //                 />
// // //                 <Text style={styles.emptyText}>
// // //                   {distributorStatus.isJoined 
// // //                     ? 'Your current vendor information is not available'
// // //                     : error 
// // //                       ? 'Unable to load vendors' 
// // //                       : manualPincode 
// // //                         ? `No vendors found in ${manualPincode}` 
// // //                         : !showAllVendors && userPincode
// // //                           ? `No vendors in your area (${userPincode})`
// // //                           : 'No vendors available'
// // //                   }
// // //                 </Text>
// // //                 {!showAllVendors && userPincode && !error && !distributorStatus.isJoined && (
// // //                   <TouchableOpacity 
// // //                     style={styles.showAllButton} 
// // //                     onPress={showAllVendorsHandler}
// // //                     activeOpacity={0.7}
// // //                   >
// // //                     <Text style={styles.showAllText}>Show All Vendors</Text>
// // //                   </TouchableOpacity>
// // //                 )}
// // //               </>
// // //             )}
// // //           </View>
// // //         )}
// // //         showsVerticalScrollIndicator={false}
// // //         removeClippedSubviews={true}
// // //         maxToRenderPerBatch={10}
// // //         windowSize={10}
// // //         initialNumToRender={5}
// // //         getItemLayout={(data, index) => ({
// // //           length: 180, // Approximate item height
// // //           offset: 180 * index,
// // //           index,
// // //         })}
// // //       />
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: { 
// // //     flex: 1, 
// // //     backgroundColor: '#f8f9fa' 
// // //   },
// // //   centered: { 
// // //     justifyContent: 'center', 
// // //     alignItems: 'center' 
// // //   },
// // //   loadingText: { 
// // //     marginTop: 16, 
// // //     color: '#666', 
// // //     fontSize: 16,
// // //     textAlign: 'center'
// // //   },
  
// // //   // Header styles
// // //   header: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     padding: 16,
// // //     paddingTop: 50,
// // //     backgroundColor: '#fff',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#eee',
// // //     elevation: 2,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 2,
// // //   },
// // //   headerLeft: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flex: 1,
// // //   },
// // //   title: { 
// // //     fontSize: 20, 
// // //     fontWeight: 'bold', 
// // //     color: '#333', 
// // //     marginRight: 12 
// // //   },
// // //   filterToggle: {
// // //     padding: 8,
// // //     borderRadius: 8,
// // //   },
// // //   logoutButton: { 
// // //     padding: 8,
// // //     borderRadius: 8,
// // //   },
  
// // //   // Status banner styles
// // //   statusBanner: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#f0f8ff',
// // //     padding: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#e3f2fd',
// // //   },
// // //   statusBannerText: {
// // //     fontSize: 14,
// // //     color: '#666',
// // //     marginLeft: 8,
// // //   },
// // //   joinedStatusBanner: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#e8f5e8',
// // //     padding: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#c8e6c9',
// // //   },
// // //   availableStatusBanner: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#fff8e1',
// // //     padding: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#ffcc02',
// // //   },
// // //   statusTextContainer: {
// // //     flex: 1,
// // //     marginLeft: 8,
// // //   },
// // //   joinedStatusText: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: '#2e7d32',
// // //     lineHeight: 18,
// // //   },
// // //   joinedStatusSubtext: {
// // //     fontSize: 12,
// // //     color: '#4caf50',
// // //     marginTop: 2,
// // //     lineHeight: 16,
// // //   },
// // //   availableStatusText: {
// // //     fontSize: 14,
// // //     fontWeight: '500',
// // //     color: '#f57c00',
// // //     marginLeft: 8,
// // //     lineHeight: 18,
// // //   },
// // //   infoButton: {
// // //     padding: 8,
// // //     borderRadius: 8,
// // //   },
  
// // //   // Filter status styles
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
// // //     lineHeight: 18,
// // //   },
// // //   debugText: {
// // //     fontSize: 12,
// // //     color: '#666',
// // //     fontWeight: '600',
// // //     marginRight: 8,
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
  
// // //   // Filter input styles
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
// // //     paddingVertical: 12,
// // //     fontSize: 16,
// // //     backgroundColor: '#fafafa',
// // //     color: '#333',
// // //   },
// // //   filterButton: {
// // //     backgroundColor: '#007AFF',
// // //     borderRadius: 8,
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 12,
// // //     marginLeft: 8,
// // //     minWidth: 50,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //   },
// // //   filterButtonDisabled: {
// // //     backgroundColor: '#ccc',
// // //   },
// // //   clearButton: {
// // //     padding: 8,
// // //     marginLeft: 4,
// // //     borderRadius: 8,
// // //   },

// // //   // Error banner styles
// // //   errorBanner: {
// // //     backgroundColor: '#fff0f0',
// // //     padding: 16,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#ffcdd2',
// // //   },
// // //   errorContent: {
// // //     flexDirection: 'row',
// // //     alignItems: 'flex-start',
// // //     marginBottom: 8,
// // //   },
// // //   errorText: { 
// // //     color: '#c00', 
// // //     fontSize: 14, 
// // //     flex: 1, 
// // //     marginLeft: 8, 
// // //     lineHeight: 20 
// // //   },
// // //   retry: {
// // //     backgroundColor: '#007AFF',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 8,
// // //     borderRadius: 8,
// // //     alignSelf: 'flex-start',
// // //   },
// // //   retryText: { 
// // //     color: '#fff', 
// // //     fontSize: 14, 
// // //     fontWeight: '600' 
// // //   },
  
// // //   // List styles
// // //   listContent: { 
// // //     paddingBottom: 20 
// // //   },
// // //   emptyListContent: {
// // //     flexGrow: 1,
// // //   },
  
// // //   // Vendor card styles
// // //   card: {
// // //     flexDirection: 'row',
// // //     alignItems: 'flex-start',
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
// // //     minHeight: 160,
// // //   },
// // //   currentVendorCard: {
// // //     borderWidth: 2,
// // //     borderColor: '#4CAF50',
// // //     backgroundColor: '#f1f8e9',
// // //   },
// // //   currentVendorBadge: {
// // //     position: 'absolute',
// // //     top: 8,
// // //     right: 8,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#4CAF50',
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 4,
// // //     borderRadius: 12,
// // //     zIndex: 1,
// // //   },
// // //   currentVendorBadgeText: {
// // //     color: '#fff',
// // //     fontSize: 10,
// // //     fontWeight: '600',
// // //     marginLeft: 4,
// // //   },
// // //   info: { 
// // //     flex: 1,
// // //     paddingRight: 12,
// // //   },
// // //   name: { 
// // //     fontSize: 18, 
// // //     fontWeight: 'bold', 
// // //     color: '#333', 
// // //     marginBottom: 8,
// // //     lineHeight: 22,
// // //   },
// // //   contactRow: { 
// // //     flexDirection: 'row', 
// // //     alignItems: 'center', 
// // //     marginBottom: 6 
// // //   },
// // //   contact: { 
// // //     fontSize: 14, 
// // //     color: '#666', 
// // //     marginLeft: 8,
// // //     lineHeight: 18,
// // //   },
// // //   addressRow: { 
// // //     flexDirection: 'row', 
// // //     alignItems: 'flex-start', 
// // //     marginBottom: 8 
// // //   },
// // //   address: { 
// // //     fontSize: 14, 
// // //     color: '#666', 
// // //     marginLeft: 8,
// // //     lineHeight: 18,
// // //     flex: 1,
// // //   },
// // //   ratesContainer: {
// // //     marginTop: 4,
// // //   },
// // //   rateText: { 
// // //     fontSize: 13, 
// // //     color: '#704214', 
// // //     marginBottom: 2,
// // //     fontWeight: '500',
// // //   },
  
// // //   // Button styles
// // //   button: {
// // //     backgroundColor: '#007AFF',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 10,
// // //     borderRadius: 8,
// // //     minWidth: 120,
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     alignSelf: 'flex-start',
// // //   },
// // //   buttonDisabled: { 
// // //     backgroundColor: '#C0C0C0' 
// // //   },
// // //   currentVendorButton: {
// // //     backgroundColor: '#4CAF50',
// // //   },
// // //   buttonText: { 
// // //     color: '#fff', 
// // //     fontWeight: '600',
// // //     fontSize: 14,
// // //     textAlign: 'center',
// // //   },
// // //   currentVendorButtonText: {
// // //     fontSize: 12,
// // //   },
  
// // //   // Empty state styles
// // //   emptyContainer: { 
// // //     flex: 1, 
// // //     alignItems: 'center', 
// // //     justifyContent: 'center', 
// // //     padding: 40,
// // //     paddingTop: 80,
// // //   },
// // //   emptyText: { 
// // //     color: '#666', 
// // //     fontSize: 16, 
// // //     textAlign: 'center', 
// // //     marginTop: 16,
// // //     lineHeight: 22,
// // //     maxWidth: 280,
// // //   },
// // //   showAllButton: {
// // //     marginTop: 20,
// // //     backgroundColor: '#007AFF',
// // //     paddingHorizontal: 24,
// // //     paddingVertical: 12,
// // //     borderRadius: 8,
// // //   },
// // //   showAllText: {
// // //     color: '#fff',
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //   },
// // // });

// // // export default DistributorHomeScreen;
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
// //   TextInput,
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
// //   getDistributorDetailsById,
// //   getDistributorVendorStatus,
// // } from '../../apiServices/allApi';

// // type DistributorHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DistributorHome'>;

// // interface Vendor {
// //   id: string;
// //   name: string;
// //   contact: string;
// //   address?: string;
// //   business_name?: string;
// //   location?: string;
// //   village?: string;
// //   pincode?: string;
// //   cr?: number;
// //   br?: number;
// // }

// // interface DistributorVendorStatus {
// //   isJoined: boolean;
// //   currentVendorId?: string;
// //   currentVendorName?: string;
// //   joinedDate?: string;
// //   status?: 'approved' | 'pending' | 'rejected';
// // }

// // interface ApiError {
// //   message?: string;
// //   response?: {
// //     status?: number;
// //     data?: {
// //       message?: string;
// //       detail?: string;
// //     };
// //   };
// //   code?: string;
// // }

// // const DistributorHomeScreen: React.FC = () => {
// //   const navigation = useNavigation<DistributorHomeNavigationProp>();
// //   const dispatch = useDispatch<AppDispatch>();

// //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

// //   // Core states
// //   const [vendors, setVendors] = useState<Vendor[]>([]);
// //   const [requestedVendors, setRequestedVendors] = useState<Set<string>>(new Set());
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [submittingId, setSubmittingId] = useState<string | null>(null);
// //   const [error, setError] = useState<string | null>(null);
  
// //   // Distributor vendor status
// //   const [distributorStatus, setDistributorStatus] = useState<DistributorVendorStatus>({
// //     isJoined: false,
// //   });
// //   const [statusLoading, setStatusLoading] = useState(true);
  
// //   // Profile states
// //   const [userPincode, setUserPincode] = useState<string>('');
// //   const [showAllVendors, setShowAllVendors] = useState(false);
  
// //   // Filter states
// //   const [manualPincode, setManualPincode] = useState('');
// //   const [showManualFilter, setShowManualFilter] = useState(false);
// //   const [isFilterLoading, setIsFilterLoading] = useState(false);

// //   // Debug state
// //   const [debugMode, setDebugMode] = useState(false);

// //   // Enhanced network error handler
// //   const handleNetworkError = useCallback((err: ApiError): string => {
// //     console.log('🌐 Network error details:', {
// //       message: err?.message,
// //       code: err?.code,
// //       status: err?.response?.status,
// //       responseData: err?.response?.data
// //     });

// //     if (err?.message?.includes('Network Error') || err?.code === 'NETWORK_ERROR') {
// //       return 'Network connection failed. Please check your internet connection and try again.';
// //     }

// //     switch (err?.response?.status) {
// //       case 401:
// //         return 'Authentication failed. Please login again.';
// //       case 403:
// //         return 'Access denied. Please check your permissions.';
// //       case 404:
// //         return 'Service not found. Please check your connection.';
// //       case 500:
// //         return 'Server error. Please try again later.';
// //       case 503:
// //         return 'Service temporarily unavailable. Please try again later.';
// //       default:
// //         return err?.response?.data?.detail || 
// //                err?.response?.data?.message || 
// //                err?.message || 
// //                'Something went wrong. Please try again.';
// //     }
// //   }, []);

// //   // ✅ ENHANCED: Check distributor's vendor assignment status with comprehensive debugging
// //   const fetchDistributorStatus = useCallback(async (): Promise<void> => {
// //     if (!user?.userID) {
// //       console.log('❌ No distributor ID found in user object');
// //       console.log('🔍 User object:', user);
// //       setDistributorStatus({ isJoined: false });
// //       setStatusLoading(false);
// //       return;
// //     }

// //     try {
// //       setStatusLoading(true);
// //       console.log('🔍 Checking distributor vendor assignment...');
// //       console.log('📋 Distributor ID:', user.userID);
// //       console.log('📋 User ID Type:', typeof user.userID);

// //       const statusRes = await getDistributorVendorStatus(user.userID.toString());
      
// //       // ✅ COMPREHENSIVE DEBUG LOGGING
// //       console.log('📊 === API RESPONSE DEBUG ===');
// //       console.log('📊 Full Response Object:', statusRes);
// //       console.log('📊 Response Status:', statusRes?.status);
// //       console.log('📊 Response Headers:', statusRes?.headers);
// //       console.log('📊 Response Data:', statusRes?.data);
// //       console.log('📊 Response Data Type:', typeof statusRes?.data);
// //       console.log('📊 Response Data Keys:', statusRes?.data ? Object.keys(statusRes.data) : 'No data');
// //       console.log('📊 === END DEBUG ===');

// //       // ✅ HANDLE MULTIPLE RESPONSE STRUCTURES
// //       let statusData = null;
      
// //       // Try different response structures
// //       if (statusRes?.data?.data) {
// //         statusData = statusRes.data.data;
// //         console.log('✅ Using nested data structure (data.data)');
// //       } else if (statusRes?.data) {
// //         statusData = statusRes.data;
// //         console.log('✅ Using direct data structure (data)');
// //       } else if (statusRes) {
// //         statusData = statusRes;
// //         console.log('✅ Using response as data');
// //       }

// //       console.log('📋 Extracted Status Data:', statusData);
      
// //       if (statusData) {
// //         // ✅ HANDLE DIFFERENT DATA TYPES AND FIELD NAMES
// //         const rawIsJoined = statusData.isJoined || statusData.is_joined || statusData.assigned;
// //         const vendorId = statusData.currentVendorId || statusData.current_vendor_id || statusData.vendor_id || statusData.vendorId;
// //         const vendorName = statusData.currentVendorName || statusData.current_vendor_name || statusData.vendor_name || statusData.vendorName;
        
// //         // ✅ MULTIPLE WAYS TO DETERMINE IF JOINED
// //         const isActuallyJoined = Boolean(
// //           rawIsJoined === true || 
// //           rawIsJoined === 'true' || 
// //           rawIsJoined === 1 ||
// //           rawIsJoined === '1' ||
// //           vendorId // If has vendor ID, assume joined
// //         );

// //         console.log('📋 Processing Status Fields:');
// //         console.log('  - rawIsJoined:', rawIsJoined);
// //         console.log('  - vendorId:', vendorId);
// //         console.log('  - vendorName:', vendorName);
// //         console.log('  - isActuallyJoined:', isActuallyJoined);

// //         const status: DistributorVendorStatus = {
// //           isJoined: isActuallyJoined,
// //           currentVendorId: vendorId?.toString(),
// //           currentVendorName: vendorName || undefined,
// //           joinedDate: statusData.joinedDate || statusData.joined_date || statusData.created_at || undefined,
// //           status: statusData.status || 'pending',
// //         };
        
// //         console.log('📋 Final Processed Status:', status);
// //         setDistributorStatus(status);
        
// //         if (status.isJoined) {
// //           console.log('✅ DISTRIBUTOR IS JOINED to vendor:', status.currentVendorName || status.currentVendorId);
// //         } else {
// //           console.log('⚠️ DISTRIBUTOR NOT JOINED to any vendor yet');
// //         }
// //       } else {
// //         console.log('❌ No status data found in API response');
// //         setDistributorStatus({ isJoined: false });
// //       }
// //     } catch (err: any) {
// //       console.log('❌ Error fetching distributor assignment status:', err);
// //       console.log('❌ Error Type:', typeof err);
// //       console.log('❌ Error Message:', err?.message);
// //       console.log('❌ Error Response:', err?.response);
// //       console.log('❌ Error Response Data:', err?.response?.data);
// //       console.log('❌ Error Response Status:', err?.response?.status);
      
// //       // If 404, might mean not joined yet
// //       if (err?.response?.status === 404) {
// //         console.log('⚠️ 404 Error - Assuming not joined');
// //         setDistributorStatus({ isJoined: false });
// //       } else {
// //         console.log('❌ Other error - Assuming not joined');
// //         setDistributorStatus({ isJoined: false });
// //       }
// //     } finally {
// //       setStatusLoading(false);
// //     }
// //   }, [user?.userID]);

// //   // ✅ DEBUG: Test status API manually
// //   const testStatusAPI = useCallback(async () => {
// //     try {
// //       setDebugMode(true);
// //       console.log('🧪 MANUAL TESTING STATUS API...');
      
// //       const result = await getDistributorVendorStatus(user?.userID?.toString() || '');
      
// //       Alert.alert(
// //         'Debug: API Response',
// //         `Status: ${result?.status}\n\nData: ${JSON.stringify(result?.data, null, 2)}`,
// //         [
// //           { text: 'Copy to Clipboard', onPress: () => console.log('API Response:', result) },
// //           { text: 'OK' }
// //         ]
// //       );
      
// //     } catch (err: any) {
// //       Alert.alert(
// //         'Debug: API Error', 
// //         `Error: ${err?.message}\n\nStatus: ${err?.response?.status}\n\nData: ${JSON.stringify(err?.response?.data, null, 2)}`,
// //         [{ text: 'OK' }]
// //       );
// //     } finally {
// //       setDebugMode(false);
// //     }
// //   }, [user?.userID]);

// //   // Fetch distributor profile for pincode
// //   const fetchUserProfile = useCallback(async (): Promise<void> => {
// //     if (!user?.userID) {
// //       console.log('❌ No userID found');
// //       setShowAllVendors(true);
// //       return;
// //     }
    
// //     try {
// //       console.log('🔍 Fetching distributor profile for ID:', user.userID);
// //       const response = await getDistributorDetailsById(user.userID);
// //       console.log('👤 Distributor profile response received');
      
// //       const profileData = response?.data?.data || response?.data;
      
// //       if (profileData?.pincode) {
// //         setUserPincode(profileData.pincode);
// //         console.log('✅ Distributor pincode found:', profileData.pincode);
// //       } else {
// //         console.log('⚠️ No pincode found, showing all vendors');
// //         setShowAllVendors(true);
// //       }
// //     } catch (err) {
// //       console.log('❌ Error fetching distributor profile:', err);
// //       setShowAllVendors(true);
// //     }
// //   }, [user?.userID]);

// //   // Fetch and filter vendors based on status
// //   const fetchData = useCallback(async (filterPincode?: string): Promise<void> => {
// //     if (!user?.userID) {
// //       throw new Error('Distributor ID not found. Please log in again.');
// //     }

// //     setError(null);
// //     setIsLoading(true);
    
// //     try {
// //       // Determine pincode filter (only when not joined)
// //       let pincodeToFilter = filterPincode;
// //       if (!distributorStatus.isJoined && !pincodeToFilter && !showAllVendors && userPincode) {
// //         pincodeToFilter = userPincode;
// //       }

// //       console.log('🏪 Fetching vendors for distributor:', {
// //         distributorId: user.userID,
// //         isJoined: distributorStatus.isJoined,
// //         currentVendorId: distributorStatus.currentVendorId,
// //         pincode: pincodeToFilter || 'all'
// //       });

// //       const vendorRes = await getAllVendors(pincodeToFilter);
// //       console.log('📡 Vendors API response received');

// //       // Parse API response with multiple strategies
// //       let vendorList: Vendor[] = [];
      
// //       if (vendorRes?.data?.results && Array.isArray(vendorRes.data.results)) {
// //         vendorList = vendorRes.data.results;
// //         console.log('✅ Found vendors in data.results:', vendorList.length);
// //       } else if (vendorRes?.data?.data && Array.isArray(vendorRes.data.data)) {
// //         vendorList = vendorRes.data.data;
// //         console.log('✅ Found vendors in data.data:', vendorList.length);
// //       } else if (vendorRes?.data && Array.isArray(vendorRes.data)) {
// //         vendorList = vendorRes.data;
// //         console.log('✅ Found vendors in data:', vendorList.length);
// //       } else {
// //         console.log('❌ No vendor array found in response structure');
// //         vendorList = [];
// //       }

// //       // 🎯 MAIN FILTERING LOGIC: Show only current vendor if joined
// //       let filteredVendors: Vendor[] = vendorList;
      
// //       if (distributorStatus.isJoined && distributorStatus.currentVendorId) {
// //         // ✅ JOINED: Show ONLY current vendor
// //         filteredVendors = vendorList.filter(vendor => 
// //           vendor.id?.toString() === distributorStatus.currentVendorId?.toString()
// //         );
// //         console.log('🎯 Distributor joined - filtering to current vendor only:', {
// //           currentVendorId: distributorStatus.currentVendorId,
// //           totalVendors: vendorList.length,
// //           filteredVendors: filteredVendors.length,
// //           foundCurrentVendor: filteredVendors.length > 0,
// //           vendorName: filteredVendors[0]?.name || filteredVendors[0]?.business_name
// //         });
// //       } else {
// //         // ✅ NOT JOINED: Show all vendors with filters
// //         console.log('🌐 Distributor not joined - showing all available vendors:', vendorList.length);
// //       }

// //       setVendors(filteredVendors);

// //     } catch (err) {
// //       console.log('❌ Vendor fetch error:', err);
// //       const errorMessage = handleNetworkError(err as ApiError);
// //       setError(errorMessage);
// //       setVendors([]);
// //     } finally {
// //       setIsLoading(false);
// //       setRefreshing(false);
// //       setIsFilterLoading(false);
// //     }
// //   }, [user?.userID, userPincode, showAllVendors, handleNetworkError, distributorStatus]);

// //   // Refresh data
// //   const onRefresh = useCallback(async (): Promise<void> => {
// //     setRefreshing(true);
// //     try {
// //       // Refresh status first, then vendors
// //       await fetchDistributorStatus();
// //       const currentFilter = !distributorStatus.isJoined ? 
// //         (manualPincode || (showAllVendors ? undefined : userPincode)) : undefined;
// //       await fetchData(currentFilter);
// //     } catch (err) {
// //       console.log('❌ Refresh error:', err);
// //     }
// //   }, [fetchData, fetchDistributorStatus, manualPincode, showAllVendors, userPincode, distributorStatus.isJoined]);

// //   // Handle manual pincode filter (disabled when joined)
// //   const handleManualFilter = useCallback((): void => {
// //     if (distributorStatus.isJoined) {
// //       Alert.alert(
// //         'Filter Disabled',
// //         `You are currently working with ${distributorStatus.currentVendorName}. Only your current vendor is shown.`,
// //         [{ text: 'OK' }]
// //       );
// //       return;
// //     }

// //     if (manualPincode.trim().length === 6) {
// //       setIsFilterLoading(true);
// //       fetchData(manualPincode.trim());
// //     } else if (manualPincode.trim() === '') {
// //       setIsFilterLoading(true);
// //       fetchData(showAllVendors ? undefined : userPincode);
// //     } else {
// //       Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit pincode');
// //     }
// //   }, [manualPincode, fetchData, showAllVendors, userPincode, distributorStatus]);

// //   // Show all vendors (disabled when joined)
// //   const showAllVendorsHandler = useCallback((): void => {
// //     if (distributorStatus.isJoined) {
// //       Alert.alert(
// //         'Already Joined',
// //         `You are currently working with ${distributorStatus.currentVendorName}. Only your current vendor is shown.`,
// //         [{ text: 'OK' }]
// //       );
// //       return;
// //     }
    
// //     console.log('🌐 Showing all vendors');
// //     setShowAllVendors(true);
// //     setManualPincode('');
// //     fetchData();
// //   }, [fetchData, distributorStatus]);

// //   // Show area vendors (disabled when joined)
// //   const showMyAreaVendors = useCallback((): void => {
// //     if (distributorStatus.isJoined) {
// //       Alert.alert(
// //         'Already Joined',
// //         `You are currently working with ${distributorStatus.currentVendorName}. Only your current vendor is shown.`,
// //         [{ text: 'OK' }]
// //       );
// //       return;
// //     }

// //     if (userPincode) {
// //       console.log('📍 Showing vendors for area:', userPincode);
// //       setShowAllVendors(false);
// //       setManualPincode('');
// //       fetchData(userPincode);
// //     } else {
// //       Alert.alert('No Pincode', 'Please update your profile with your pincode first');
// //     }
// //   }, [fetchData, userPincode, distributorStatus]);

// //   // Clear manual filter (disabled when joined)
// //   const clearManualFilter = useCallback((): void => {
// //     if (distributorStatus.isJoined) return;
    
// //     setManualPincode('');
// //     setIsFilterLoading(true);
// //     fetchData(showAllVendors ? undefined : userPincode);
// //   }, [fetchData, showAllVendors, userPincode, distributorStatus.isJoined]);

// //   // Show current vendor details
// //   const showCurrentVendorInfo = useCallback((): void => {
// //     Alert.alert(
// //       'Current Vendor Details',
// //       `Vendor: ${distributorStatus.currentVendorName || 'Unknown'}\nStatus: ${distributorStatus.status || 'Pending'}\nJoined: ${distributorStatus.joinedDate || 'N/A'}\n\nYou can only work with one vendor at a time.`,
// //       [{ text: 'OK' }]
// //     );
// //   }, [distributorStatus]);

// //   // Handle join vendor request
// //   const sendRequest = useCallback(async (vendorId: string): Promise<void> => {
// //     if (submittingId) return; // Prevent double submission

// //     try {
// //       // If already joined, show vendor info
// //       if (distributorStatus.isJoined) {
// //         showCurrentVendorInfo();
// //         return;
// //       }

// //       setSubmittingId(vendorId);

// //       if (!user?.userID) {
// //         throw new Error('Distributor ID not found. Please log in again.');
// //       }

// //       const payload = {
// //         user_id: parseInt(user.userID.toString(), 10),
// //         user_type: 'milkman', // Backend expects 'milkman' for distributors
// //         vendor: parseInt(vendorId, 10),
// //       };

// //       console.log('📤 Sending join request:', payload);
// //       const response = await createRequest(payload);
      
// //       console.log('✅ Join request successful:', response?.data?.message || 'Request completed');

// //       Alert.alert(
// //         'Request Sent Successfully!', 
// //         'Your request has been sent to the vendor. You can only work with one vendor at a time. Please wait for approval.\n\nYou will be notified once the vendor responds.',
// //         [{ text: 'OK' }]
// //       );
      
// //       // Add to requested vendors
// //       setRequestedVendors(prev => new Set([...prev, vendorId]));
      
// //       // Refresh status after successful request
// //       await fetchDistributorStatus();
      
// //     } catch (err) {
// //       console.log('❌ Join request error:', err);
// //       const errorMessage = handleNetworkError(err as ApiError);
// //       Alert.alert('Error', errorMessage);
// //     } finally {
// //       setSubmittingId(null);
// //     }
// //   }, [user?.userID, handleNetworkError, distributorStatus, showCurrentVendorInfo, fetchDistributorStatus, submittingId]);

// //   // Handle logout
// //   const handleLogout = useCallback((): void => {
// //     Alert.alert(
// //       'Logout',
// //       'Are you sure you want to log out?',
// //       [
// //         { text: 'Cancel', style: 'cancel' },
// //         {
// //           text: 'Logout',
// //           style: 'destructive',
// //           onPress: async (): Promise<void> => {
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

// //   // Render vendor item
// //   const renderVendor = useCallback(({ item }: { item: Vendor }) => {
// //     const isRequested = requestedVendors.has(item.id);
// //     const isSubmitting = submittingId === item.id;
    
// //     // Check if this is the current vendor
// //     const isCurrentVendor = distributorStatus.isJoined && 
// //                             distributorStatus.currentVendorId?.toString() === item.id?.toString();

// //     const vendorName = item.name || item.business_name || 'Unnamed Vendor';
// //     const village = item.village || item.location || item.address || 'No location provided';
// //     const vendorPincode = item.pincode ? ` - ${item.pincode}` : '';
// //     const contact = item.contact || 'No contact available';

// //     return (
// //       <View style={[
// //         styles.card, 
// //         isCurrentVendor && styles.currentVendorCard,
// //       ]}>
// //         {/* Current vendor badge */}
// //         {isCurrentVendor && (
// //           <View style={styles.currentVendorBadge}>
// //             <Ionicons name="checkmark-circle" size={16} color="#fff" />
// //             <Text style={styles.currentVendorBadgeText}>Your Vendor</Text>
// //           </View>
// //         )}
        
// //         <View style={styles.info}>
// //           <Text style={styles.name}>{vendorName}</Text>

// //           <View style={styles.contactRow}>
// //             <Ionicons name="call-outline" size={16} color="#666" />
// //             <Text style={styles.contact}>{contact}</Text>
// //           </View>

// //           <View style={styles.addressRow}>
// //             <Ionicons name="location-outline" size={16} color="#666" />
// //             <Text style={styles.address}>{village}{vendorPincode}</Text>
// //           </View>

// //           <View style={styles.ratesContainer}>
// //             <Text style={styles.rateText}>
// //               Cow Milk: {item.cr != null ? `₹${item.cr}/L` : 'Rate not set'}
// //             </Text>
// //             <Text style={styles.rateText}>
// //               Buffalo Milk: {item.br != null ? `₹${item.br}/L` : 'Rate not set'}
// //             </Text>
// //           </View>
// //         </View>

// //         <TouchableOpacity
// //           style={[
// //             styles.button,
// //             (isRequested || isSubmitting) && styles.buttonDisabled,
// //             isCurrentVendor && styles.currentVendorButton,
// //           ]}
// //           onPress={() => sendRequest(item.id)}
// //           disabled={isSubmitting}
// //           activeOpacity={0.7}
// //         >
// //           {isSubmitting ? (
// //             <ActivityIndicator size="small" color="#fff" />
// //           ) : (
// //             <Text style={[
// //               styles.buttonText,
// //               isCurrentVendor && styles.currentVendorButtonText
// //             ]}>
// //               {isCurrentVendor 
// //                 ? `Joined (${distributorStatus.status || 'Pending'})`
// //                 : isRequested 
// //                   ? 'Requested'
// //                   : 'Join Vendor'
// //               }
// //             </Text>
// //           )}
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   }, [requestedVendors, submittingId, sendRequest, distributorStatus]);

// //   // Initialize component
// //   useEffect(() => {
// //     console.log('🚀 Initializing DistributorHomeScreen');
    
// //     const initialize = async (): Promise<void> => {
// //       try {
// //         await Promise.all([
// //           fetchUserProfile(),
// //           fetchDistributorStatus(),
// //         ]);
// //       } catch (err) {
// //         console.log('❌ Initialization error:', err);
// //       }
// //     };

// //     initialize();
// //   }, [fetchUserProfile, fetchDistributorStatus]);

// //   // Fetch vendors after status and profile are loaded
// //   useEffect(() => {
// //     if (!statusLoading && (userPincode || showAllVendors)) {
// //       console.log('✅ Dependencies ready, fetching vendors');
// //       fetchData();
// //     }
// //   }, [statusLoading, userPincode, showAllVendors, fetchData]);

// //   // Loading state
// //   if (!isAuthenticated || !user?.userID) {
// //     return (
// //       <View style={[styles.container, styles.centered]}>
// //         <ActivityIndicator size="large" color="#007AFF" />
// //         <Text style={styles.loadingText}>Loading distributor information...</Text>
// //       </View>
// //     );
// //   }

// //   // Dynamic filter text based on status
// //   const currentFilterText = distributorStatus.isJoined 
// //     ? `Showing your vendor: ${distributorStatus.currentVendorName || 'Current Vendor'}`
// //     : manualPincode 
// //       ? `Filtered by: ${manualPincode}` 
// //       : showAllVendors 
// //         ? 'Showing all vendors' 
// //         : userPincode 
// //           ? `Your area: ${userPincode}` 
// //           : 'No filter applied';

// //   return (
// //     <View style={styles.container}>
// //       {/* Header */}
// //       <View style={styles.header}>
// //         <View style={styles.headerLeft}>
// //           <Text style={styles.title}>
// //             {distributorStatus.isJoined ? 'Your Vendor' : 'Available Vendors'}
// //           </Text>
// //           {/* Hide filter toggle when joined */}
// //           {!distributorStatus.isJoined && (
// //             <TouchableOpacity 
// //               onPress={() => setShowManualFilter(!showManualFilter)}
// //               style={styles.filterToggle}
// //               activeOpacity={0.7}
// //             >
// //               <Ionicons 
// //                 name={showManualFilter ? "chevron-up-outline" : "filter-outline"} 
// //                 size={24} 
// //                 color="#007AFF" 
// //               />
// //             </TouchableOpacity>
// //           )}
// //         </View>
        
// //         <View style={styles.headerRight}>
// //           {/* ✅ DEBUG BUTTON - Remove in production */}
// //           {__DEV__ && (
// //             <TouchableOpacity 
// //               onPress={testStatusAPI} 
// //               style={styles.debugButton}
// //               disabled={debugMode}
// //             >
// //               {debugMode ? (
// //                 <ActivityIndicator size="small" color="#FF3B30" />
// //               ) : (
// //                 <Text style={styles.debugText}>DEBUG</Text>
// //               )}
// //             </TouchableOpacity>
// //           )}
          
// //           <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} activeOpacity={0.7}>
// //             <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
// //           </TouchableOpacity>
// //         </View>
// //       </View>

// //       {/* Status Banner */}
// //       {statusLoading ? (
// //         <View style={styles.statusBanner}>
// //           <ActivityIndicator size="small" color="#666" />
// //           <Text style={styles.statusBannerText}>Checking vendor assignment...</Text>
// //         </View>
// //       ) : distributorStatus.isJoined ? (
// //         <View style={styles.joinedStatusBanner}>
// //           <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
// //           <View style={styles.statusTextContainer}>
// //             <Text style={styles.joinedStatusText}>
// //               Currently working with: {distributorStatus.currentVendorName || 'Unknown Vendor'}
// //             </Text>
// //             <Text style={styles.joinedStatusSubtext}>
// //               Status: {distributorStatus.status || 'Pending'} • Joined: {distributorStatus.joinedDate || 'N/A'}
// //             </Text>
// //           </View>
// //           <TouchableOpacity onPress={showCurrentVendorInfo} style={styles.infoButton} activeOpacity={0.7}>
// //             <Ionicons name="information-circle-outline" size={18} color="#4CAF50" />
// //           </TouchableOpacity>
// //         </View>
// //       ) : (
// //         <View style={styles.availableStatusBanner}>
// //           <Ionicons name="storefront-outline" size={20} color="#FF9500" />
// //           <Text style={styles.availableStatusText}>
// //             You can join one vendor. Choose wisely!
// //           </Text>
// //         </View>
// //       )}

// //       {/* Filter Status */}
// //       <View style={styles.statusContainer}>
// //         <Text style={styles.statusText}>{currentFilterText}</Text>
// //         <Text style={styles.debugText}>Found: {vendors.length}</Text>
        
// //         {/* Hide filter actions when joined */}
// //         {!distributorStatus.isJoined && (
// //           <View style={styles.filterActions}>
// //             {!showAllVendors && userPincode && (
// //               <TouchableOpacity 
// //                 style={styles.actionButton} 
// //                 onPress={showAllVendorsHandler}
// //                 activeOpacity={0.7}
// //               >
// //                 <Text style={styles.actionText}>Show All</Text>
// //               </TouchableOpacity>
// //             )}
// //             {showAllVendors && userPincode && (
// //               <TouchableOpacity 
// //                 style={styles.actionButton} 
// //                 onPress={showMyAreaVendors}
// //                 activeOpacity={0.7}
// //               >
// //                 <Text style={styles.actionText}>My Area</Text>
// //               </TouchableOpacity>
// //             )}
// //           </View>
// //         )}
// //       </View>

// //       {/* Manual Filter - Hide when joined */}
// //       {showManualFilter && !distributorStatus.isJoined && (
// //         <View style={styles.filterContainer}>
// //           <View style={styles.pincodeInputContainer}>
// //             <TextInput
// //               style={styles.pincodeInput}
// //               placeholder="Enter 6-digit pincode"
// //               value={manualPincode}
// //               onChangeText={setManualPincode}
// //               keyboardType="numeric"
// //               maxLength={6}
// //               placeholderTextColor="#999"
// //               returnKeyType="search"
// //               onSubmitEditing={handleManualFilter}
// //             />
// //             <TouchableOpacity 
// //               style={[styles.filterButton, isFilterLoading && styles.filterButtonDisabled]}
// //               onPress={handleManualFilter}
// //               disabled={isFilterLoading}
// //               activeOpacity={0.7}
// //             >
// //               {isFilterLoading ? (
// //                 <ActivityIndicator size="small" color="#fff" />
// //               ) : (
// //                 <Ionicons name="search-outline" size={20} color="#fff" />
// //               )}
// //             </TouchableOpacity>
// //             {manualPincode.length > 0 && (
// //               <TouchableOpacity 
// //                 style={styles.clearButton} 
// //                 onPress={clearManualFilter}
// //                 activeOpacity={0.7}
// //               >
// //                 <Ionicons name="close-outline" size={20} color="#666" />
// //               </TouchableOpacity>
// //             )}
// //           </View>
// //         </View>
// //       )}

// //       {/* Error Banner */}
// //       {error && (
// //         <View style={styles.errorBanner}>
// //           <View style={styles.errorContent}>
// //             <Ionicons name="warning-outline" size={20} color="#c00" />
// //             <Text style={styles.errorText}>{error}</Text>
// //           </View>
// //           <TouchableOpacity onPress={onRefresh} style={styles.retry} activeOpacity={0.7}>
// //             <Text style={styles.retryText}>Retry</Text>
// //           </TouchableOpacity>
// //         </View>
// //       )}

// //       {/* Vendor List */}
// //       <FlatList
// //         data={vendors}
// //         renderItem={renderVendor}
// //         keyExtractor={(item, index) => item.id?.toString() || `vendor-${index}`}
// //         contentContainerStyle={[
// //           styles.listContent,
// //           vendors.length === 0 && styles.emptyListContent
// //         ]}
// //         refreshControl={
// //           <RefreshControl 
// //             refreshing={refreshing} 
// //             onRefresh={onRefresh}
// //             colors={['#007AFF']}
// //             tintColor="#007AFF"
// //           />
// //         }
// //         ListEmptyComponent={() => (
// //           <View style={styles.emptyContainer}>
// //             {isLoading ? (
// //               <>
// //                 <ActivityIndicator size="large" color="#007AFF" />
// //                 <Text style={styles.loadingText}>Loading vendors...</Text>
// //               </>
// //             ) : (
// //               <>
// //                 <Ionicons 
// //                   name={distributorStatus.isJoined ? "checkmark-circle-outline" : "storefront-outline"} 
// //                   size={64} 
// //                   color="#ccc" 
// //                 />
// //                 <Text style={styles.emptyText}>
// //                   {distributorStatus.isJoined 
// //                     ? 'Your current vendor information is not available'
// //                     : error 
// //                       ? 'Unable to load vendors' 
// //                       : manualPincode 
// //                         ? `No vendors found in ${manualPincode}` 
// //                         : !showAllVendors && userPincode
// //                           ? `No vendors in your area (${userPincode})`
// //                           : 'No vendors available'
// //                   }
// //                 </Text>
// //                 {!showAllVendors && userPincode && !error && !distributorStatus.isJoined && (
// //                   <TouchableOpacity 
// //                     style={styles.showAllButton} 
// //                     onPress={showAllVendorsHandler}
// //                     activeOpacity={0.7}
// //                   >
// //                     <Text style={styles.showAllText}>Show All Vendors</Text>
// //                   </TouchableOpacity>
// //                 )}
// //               </>
// //             )}
// //           </View>
// //         )}
// //         showsVerticalScrollIndicator={false}
// //         removeClippedSubviews={true}
// //         maxToRenderPerBatch={10}
// //         windowSize={10}
// //         initialNumToRender={5}
// //       />
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { 
// //     flex: 1, 
// //     backgroundColor: '#f8f9fa' 
// //   },
// //   centered: { 
// //     justifyContent: 'center', 
// //     alignItems: 'center' 
// //   },
// //   loadingText: { 
// //     marginTop: 16, 
// //     color: '#666', 
// //     fontSize: 16,
// //     textAlign: 'center'
// //   },
  
// //   // Header styles
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     padding: 16,
// //     paddingTop: 50,
// //     backgroundColor: '#fff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#eee',
// //     elevation: 2,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 2,
// //   },
// //   headerLeft: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //   },
// //   headerRight: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   title: { 
// //     fontSize: 20, 
// //     fontWeight: 'bold', 
// //     color: '#333', 
// //     marginRight: 12 
// //   },
// //   filterToggle: {
// //     padding: 8,
// //     borderRadius: 8,
// //   },
// //   debugButton: {
// //     padding: 8,
// //     marginRight: 8,
// //     borderRadius: 6,
// //     backgroundColor: '#fff0f0',
// //     minWidth: 50,
// //     alignItems: 'center',
// //   },
// //   debugText: {
// //     color: '#FF3B30',
// //     fontSize: 10,
// //     fontWeight: 'bold',
// //   },
// //   logoutButton: { 
// //     padding: 8,
// //     borderRadius: 8,
// //   },
  
// //   // Status banner styles
// //   statusBanner: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#f0f8ff',
// //     padding: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#e3f2fd',
// //   },
// //   statusBannerText: {
// //     fontSize: 14,
// //     color: '#666',
// //     marginLeft: 8,
// //   },
// //   joinedStatusBanner: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#e8f5e8',
// //     padding: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#c8e6c9',
// //   },
// //   availableStatusBanner: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#fff8e1',
// //     padding: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#ffcc02',
// //   },
// //   statusTextContainer: {
// //     flex: 1,
// //     marginLeft: 8,
// //   },
// //   joinedStatusText: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#2e7d32',
// //     lineHeight: 18,
// //   },
// //   joinedStatusSubtext: {
// //     fontSize: 12,
// //     color: '#4caf50',
// //     marginTop: 2,
// //     lineHeight: 16,
// //   },
// //   availableStatusText: {
// //     fontSize: 14,
// //     fontWeight: '500',
// //     color: '#f57c00',
// //     marginLeft: 8,
// //     lineHeight: 18,
// //   },
// //   infoButton: {
// //     padding: 8,
// //     borderRadius: 8,
// //   },
  
// //   // Filter status styles
// //   statusContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     backgroundColor: '#e3f2fd',
// //     padding: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#eee',
// //   },
// //   statusText: {
// //     fontSize: 14,
// //     color: '#1976d2',
// //     fontWeight: '500',
// //     flex: 1,
// //     lineHeight: 18,
// //   },
// //   debugText: {
// //     fontSize: 12,
// //     color: '#666',
// //     fontWeight: '600',
// //     marginRight: 8,
// //   },
// //   filterActions: {
// //     flexDirection: 'row',
// //   },
// //   actionButton: {
// //     backgroundColor: '#1976d2',
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 6,
// //     marginLeft: 8,
// //   },
// //   actionText: {
// //     color: '#fff',
// //     fontSize: 12,
// //     fontWeight: '600',
// //   },
  
// //   // Filter input styles
// //   filterContainer: {
// //     backgroundColor: '#fff',
// //     padding: 16,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#eee',
// //   },
// //   pincodeInputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   pincodeInput: {
// //     flex: 1,
// //     borderWidth: 1,
// //     borderColor: '#ddd',
// //     borderRadius: 8,
// //     paddingHorizontal: 12,
// //     paddingVertical: 12,
// //     fontSize: 16,
// //     backgroundColor: '#fafafa',
// //     color: '#333',
// //   },
// //   filterButton: {
// //     backgroundColor: '#007AFF',
// //     borderRadius: 8,
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     marginLeft: 8,
// //     minWidth: 50,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   filterButtonDisabled: {
// //     backgroundColor: '#ccc',
// //   },
// //   clearButton: {
// //     padding: 8,
// //     marginLeft: 4,
// //     borderRadius: 8,
// //   },

// //   // Error banner styles
// //   errorBanner: {
// //     backgroundColor: '#fff0f0',
// //     padding: 16,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#ffcdd2',
// //   },
// //   errorContent: {
// //     flexDirection: 'row',
// //     alignItems: 'flex-start',
// //     marginBottom: 8,
// //   },
// //   errorText: { 
// //     color: '#c00', 
// //     fontSize: 14, 
// //     flex: 1, 
// //     marginLeft: 8, 
// //     lineHeight: 20 
// //   },
// //   retry: {
// //     backgroundColor: '#007AFF',
// //     paddingHorizontal: 16,
// //     paddingVertical: 8,
// //     borderRadius: 8,
// //     alignSelf: 'flex-start',
// //   },
// //   retryText: { 
// //     color: '#fff', 
// //     fontSize: 14, 
// //     fontWeight: '600' 
// //   },
  
// //   // List styles
// //   listContent: { 
// //     paddingBottom: 20 
// //   },
// //   emptyListContent: {
// //     flexGrow: 1,
// //   },
  
// //   // Vendor card styles
// //   card: {
// //     flexDirection: 'row',
// //     alignItems: 'flex-start',
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
// //     minHeight: 160,
// //   },
// //   currentVendorCard: {
// //     borderWidth: 2,
// //     borderColor: '#4CAF50',
// //     backgroundColor: '#f1f8e9',
// //   },
// //   currentVendorBadge: {
// //     position: 'absolute',
// //     top: 8,
// //     right: 8,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#4CAF50',
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //     zIndex: 1,
// //   },
// //   currentVendorBadgeText: {
// //     color: '#fff',
// //     fontSize: 10,
// //     fontWeight: '600',
// //     marginLeft: 4,
// //   },
// //   info: { 
// //     flex: 1,
// //     paddingRight: 12,
// //   },
// //   name: { 
// //     fontSize: 18, 
// //     fontWeight: 'bold', 
// //     color: '#333', 
// //     marginBottom: 8,
// //     lineHeight: 22,
// //   },
// //   contactRow: { 
// //     flexDirection: 'row', 
// //     alignItems: 'center', 
// //     marginBottom: 6 
// //   },
// //   contact: { 
// //     fontSize: 14, 
// //     color: '#666', 
// //     marginLeft: 8,
// //     lineHeight: 18,
// //   },
// //   addressRow: { 
// //     flexDirection: 'row', 
// //     alignItems: 'flex-start', 
// //     marginBottom: 8 
// //   },
// //   address: { 
// //     fontSize: 14, 
// //     color: '#666', 
// //     marginLeft: 8,
// //     lineHeight: 18,
// //     flex: 1,
// //   },
// //   ratesContainer: {
// //     marginTop: 4,
// //   },
// //   rateText: { 
// //     fontSize: 13, 
// //     color: '#704214', 
// //     marginBottom: 2,
// //     fontWeight: '500',
// //   },
  
// //   // Button styles
// //   button: {
// //     backgroundColor: '#007AFF',
// //     paddingHorizontal: 16,
// //     paddingVertical: 10,
// //     borderRadius: 8,
// //     minWidth: 120,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     alignSelf: 'flex-start',
// //   },
// //   buttonDisabled: { 
// //     backgroundColor: '#C0C0C0' 
// //   },
// //   currentVendorButton: {
// //     backgroundColor: '#4CAF50',
// //   },
// //   buttonText: { 
// //     color: '#fff', 
// //     fontWeight: '600',
// //     fontSize: 14,
// //     textAlign: 'center',
// //   },
// //   currentVendorButtonText: {
// //     fontSize: 12,
// //   },
  
// //   // Empty state styles
// //   emptyContainer: { 
// //     flex: 1, 
// //     alignItems: 'center', 
// //     justifyContent: 'center', 
// //     padding: 40,
// //     paddingTop: 80,
// //   },
// //   emptyText: { 
// //     color: '#666', 
// //     fontSize: 16, 
// //     textAlign: 'center', 
// //     marginTop: 16,
// //     lineHeight: 22,
// //     maxWidth: 280,
// //   },
// //   showAllButton: {
// //     marginTop: 20,
// //     backgroundColor: '#007AFF',
// //     paddingHorizontal: 24,
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //   },
// //   showAllText: {
// //     color: '#fff',
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },
// // });

// // export default DistributorHomeScreen;
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
//   getJoinAssignmentStatus,
//   getDistributorDetailsById,
// } from '../../apiServices/allApi';

// type DistributorHomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'DistributorHome'>;

// type Vendor = {
//   id: number;
//   name?: string;
//   contact?: string;
//   address?: {
//     village?: string;
//     tal?: string;
//     dist?: string;
//     pincode?: number;
//   };
//   business_name?: string;
//   location?: string;
//   village?: string;
//   gir_cow_rate?: number;
//   jarshi_cow_rate?: number;
//   deshi_cow_rate?: number;
//   buffalo_rate?: number;
// };

// const DistributorHomeScreen = () => {
//   const navigation = useNavigation<DistributorHomeNavigationProp>();
//   const dispatch = useDispatch<AppDispatch>();

//   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

//   const [vendors, setVendors] = useState<Vendor[]>([]);
//   const [requestedVendors, setRequestedVendors] = useState<number[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [submittingId, setSubmittingId] = useState<number | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [joinedVendor, setJoinedVendor] = useState<Vendor | null>(null);
//   const [joinStatus, setJoinStatus] = useState<string>('');

//   const fetchData = useCallback(async () => {
//     setError(null);
//     setIsLoading(true);
//     try {
//       const distributorId = user?.userID;

//       if (!distributorId) {
//         throw new Error('Distributor ID not found. Please log in again.');
//       }

//       console.log('🔵 DISTRIBUTOR ID:', distributorId);
//       console.log('🔵 USER TYPE: milkman');

//       // Check assignment status
//       const assignRes = await getJoinAssignmentStatus(Number(distributorId), 'milkman');
//       console.log('🔵 DISTRIBUTOR Assignment Response:', JSON.stringify(assignRes.data, null, 2));

//       if (assignRes.data.isJoined && assignRes.data.status === 'accepted') {
//         const vendorDetails = assignRes.data.vendorDetails;
//         console.log('✅ Distributor Joined Vendor:', vendorDetails?.name);
//         setJoinedVendor(vendorDetails || null);
//         setJoinStatus(assignRes.data.status || '');
//         if (vendorDetails) {
//           setVendors([vendorDetails]);
//         }
//       } else {
//         console.log('❌ Distributor NOT joined or not accepted');
//         setJoinedVendor(null);
//         setJoinStatus('');
        
//         // Fetch user pincode for vendor filtering
//         const profileRes = await getDistributorDetailsById(Number(distributorId));
//         const pincode = profileRes?.data?.data?.pincode || profileRes?.data?.pincode || '';
//         console.log('📍 Distributor Pincode:', pincode);

//         const vendorRes = await getAllVendors(pincode || undefined);
//         console.log('📋 Vendors response:', vendorRes.data);

//         const vendorList = vendorRes?.data?.data || vendorRes?.data || [];

//         if (!Array.isArray(vendorList)) {
//           console.warn('Vendor list is not an array:', vendorList);
//           setVendors([]);
//         } else {
//           console.log('✅ Total vendors found:', vendorList.length);
//           setVendors(vendorList);
//         }
//       }
//     } catch (err: any) {
//       console.error('❌ Fetch data error:', err);
//       setError(err.message || 'Failed to load data.');
//     } finally {
//       setIsLoading(false);
//       setRefreshing(false);
//     }
//   }, [user?.userID]);

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchData();
//   }, [fetchData]);

//   const sendRequest = useCallback(async (vendorId: number) => {
//     try {
//       setSubmittingId(vendorId);

//       const distributorId = user?.userID;

//       if (!distributorId) {
//         throw new Error('Distributor ID not found. Please log in again.');
//       }

//       const payload = {
//         user_id: parseInt(distributorId.toString(), 10),
//         user_type: 'milkman',
//         vendor: vendorId,
//       };

//       console.log('Sending request payload:', payload);

//       await createRequest(payload);
//       Alert.alert('Success', 'Request sent to vendor!');
//       setRequestedVendors(prev => [...prev, vendorId]);
//       fetchData();
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.detail ||
//                            err.response?.data?.message ||
//                            err.message ||
//                            'Failed to send request.';
//       Alert.alert('Error', errorMessage);
//     } finally {
//       setSubmittingId(null);
//     }
//   }, [user?.userID, fetchData]);

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

//   const getVillage = (vendor: Vendor): string => {
//     if (vendor.address?.village) return vendor.address.village;
//     if (vendor.address?.tal) return vendor.address.tal;
//     if (vendor.village) return vendor.village;
//     return 'No village provided';
//   };

//   const getCowRate = (vendor: Vendor): string => {
//     const rates: number[] = [];
//     if (vendor.gir_cow_rate && vendor.gir_cow_rate > 0) rates.push(vendor.gir_cow_rate);
//     if (vendor.jarshi_cow_rate && vendor.jarshi_cow_rate > 0) rates.push(vendor.jarshi_cow_rate);
//     if (vendor.deshi_cow_rate && vendor.deshi_cow_rate > 0) rates.push(vendor.deshi_cow_rate);
//     if (rates.length === 0) return 'N/A';
//     if (rates.length === 1) return `₹${rates[0]}/L`;
//     const minRate = Math.min(...rates);
//     const maxRate = Math.max(...rates);
//     return `₹${minRate}-${maxRate}/L`;
//   };

//   const getBuffaloRate = (vendor: Vendor): string => {
//     if (vendor.buffalo_rate && vendor.buffalo_rate > 0) {
//       return `₹${vendor.buffalo_rate}/L`;
//     }
//     return 'N/A';
//   };

//   const renderVendor = useCallback(({ item }: { item: Vendor }) => {
//     const isRequested = requestedVendors.includes(item.id);
//     const isSubmitting = submittingId === item.id;

//     const vendorName = item.name || item.business_name || 'Unnamed Vendor';

//     return (
//       <View style={[styles.card, joinedVendor && styles.joinedCard]}>
//         <View style={styles.info}>
//           <Text style={styles.name}>{vendorName}</Text>
//           {joinedVendor && (
//             <View style={styles.statusBadge}>
//               <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
//               <Text style={styles.statusText}>{joinStatus}</Text>
//             </View>
//           )}

//           <View style={styles.contactRow}>
//             <Ionicons name="call-outline" size={16} color="#666" />
//             <Text style={styles.contact}>{item.contact}</Text>
//           </View>

//           <View style={styles.addressRow}>
//             <Ionicons name="location-outline" size={16} color="#666" />
//             <Text style={styles.address}>{getVillage(item)}</Text>
//           </View>

//           <Text style={styles.rateText}>Cow Milk Rate: {getCowRate(item)}</Text>
//           <Text style={styles.rateText}>Buffalo Milk Rate: {getBuffaloRate(item)}</Text>
//         </View>

//         {!joinedVendor && (
//           <TouchableOpacity
//             style={[styles.button, (isRequested || isSubmitting) && styles.buttonDisabled]}
//             onPress={() => !isRequested && !isSubmitting && sendRequest(item.id)}
//             disabled={isRequested || isSubmitting}
//           >
//             {isSubmitting ? (
//               <ActivityIndicator size="small" color="#fff" />
//             ) : (
//               <Text style={styles.buttonText}>
//                 {isRequested ? 'Requested' : 'Join Vendor'}
//               </Text>
//             )}
//           </TouchableOpacity>
//         )}
//       </View>
//     );
//   }, [requestedVendors, submittingId, sendRequest, joinedVendor, joinStatus]);

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
//         <Text style={styles.title}>{joinedVendor ? 'Your Vendor' : 'Available Vendors'}</Text>
//         <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//           <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
//         </TouchableOpacity>
//       </View>

//       {error && (
//         <View style={styles.errorBanner}>
//           <Text style={styles.errorText}>{error}</Text>
//           <TouchableOpacity onPress={fetchData} style={styles.retry}>
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
//                 <Text style={styles.emptyText}>No vendors available.</Text>
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
//     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
//     padding: 16, paddingTop: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee',
//   },
//   title: { fontSize: 20, fontWeight: 'bold', color: '#333', flex: 1 },
//   logoutButton: { padding: 4 },
//   errorBanner: {
//     flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff0f0',
//     padding: 12, justifyContent: 'space-between',
//   },
//   errorText: { color: '#c00', fontSize: 14, flex: 1 },
//   retry: { backgroundColor: '#007AFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
//   retryText: { color: '#fff', fontSize: 12 },
//   listContent: { paddingBottom: 16 },
//   card: {
//     flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12,
//     padding: 16, marginHorizontal: 16, marginTop: 12, shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
//   },
//   joinedCard: { borderWidth: 2, borderColor: '#4CAF50', backgroundColor: '#F1F8F4' },
//   info: { flex: 1 },
//   name: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
//   statusBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
//   statusText: { fontSize: 14, color: '#4CAF50', fontWeight: '600', marginLeft: 4, textTransform: 'capitalize' },
//   contactRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
//   contact: { fontSize: 14, color: '#666', marginLeft: 8 },
//   addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
//   address: { fontSize: 14, color: '#666', marginLeft: 8 },
//   rateText: { fontSize: 14, color: '#704214', marginTop: 2 },
//   button: {
//     backgroundColor: '#007AFF', paddingHorizontal: 16, paddingVertical: 8,
//     borderRadius: 8, minWidth: 120, alignItems: 'center',
//   },
//   buttonDisabled: { backgroundColor: '#C0C0C0' },
//   buttonText: { color: '#fff', fontWeight: '600' },
//   emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
//   emptyText: { color: '#666', fontSize: 18, textAlign: 'center', marginTop: 16 },
// });

// export default DistributorHomeScreen;
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
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/authSlice';
import {
  getAllVendors,
  getDistributorDetailsById,
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
  cr?: number; // Only this cow rate is shown!
  buffalo_rate?: number;
};

const DistributorHomeScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
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
      const profileRes = await getDistributorDetailsById(Number(user.userID));
      const pincode = profileRes?.data?.data?.pincode || profileRes?.data?.pincode || '';
      const assignRes = await getJoinAssignmentStatus(Number(user.userID), 'milkman');
      if (assignRes.data.isJoined && assignRes.data.status === 'accepted') {
        const vendorDetails = assignRes.data.vendorDetails;
        setJoinedVendor(vendorDetails || null);
        setJoinStatus(assignRes.data.status || '');
        if (vendorDetails) {
          setVendors([vendorDetails]);
        }
      } else {
        setJoinedVendor(null);
        setJoinStatus('');
        const vendorRes = await getAllVendors(pincode || undefined);
        const vList = vendorRes?.data?.data || vendorRes?.data || [];
        setVendors(Array.isArray(vList) ? vList : []);
      }
    } catch (err) {
      setVendors([]);
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
        user_type: 'milkman',
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

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
    dispatch(logout());
  };

  const getVillage = (vendor: Vendor): string => {
    if (vendor.address?.village) { return vendor.address.village; }
    if (vendor.address?.tal) { return vendor.address.tal; }
    return 'N/A';
  };

  const getCowRate = (vendor: Vendor): string => {
    if (vendor.cr && vendor.cr > 0) {
      return `₹${vendor.cr}/L`;
    }
    return 'N/A';
  };

  const getBuffaloRate = (vendor: Vendor): string => {
    if (vendor.buffalo_rate && vendor.buffalo_rate > 0) {
      return `₹${vendor.buffalo_rate}/L`;
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
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{joinedVendor ? 'Your Vendor' : 'Available Vendors'}</Text>
          <Text style={styles.subtitle}>
            {joinedVendor ? 'Connected vendor details' : 'Find and connect with vendors'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1976D2" />
        </View>
      ) : (
        <FlatList
          data={vendors}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[styles.card, joinedVendor && styles.joinedCard]}>
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

              {!joinedVendor && (
                <TouchableOpacity
                  style={[styles.button, submittingId === item.id.toString() && styles.buttonDisabled]}
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
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, color: '#666' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1976D2',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#E3F2FD', marginTop: 4 },
  logoutButton: { backgroundColor: '#E53935', padding: 10, borderRadius: 8 },
  listContent: { padding: 16 },
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
  joinedCard: { borderWidth: 2, borderColor: '#4CAF50', backgroundColor: '#F1F8F4' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  iconCircle: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#E3F2FD',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  cardTitleContainer: { flex: 1 },
  vendorName: { fontSize: 20, fontWeight: 'bold', color: '#212121' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  statusText: { fontSize: 14, color: '#4CAF50', fontWeight: '600', marginLeft: 4, textTransform: 'capitalize' },
  infoSection: { marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  infoText: { fontSize: 15, color: '#424242', marginLeft: 8 },
  ratesContainer: {
    flexDirection: 'row', backgroundColor: '#F5F7FA', borderRadius: 12, padding: 16, marginBottom: 16,
  },
  rateBox: { flex: 1, alignItems: 'center' },
  rateDivider: { width: 1, backgroundColor: '#E0E0E0', marginHorizontal: 16 },
  rateLabel: { fontSize: 12, color: '#757575', marginBottom: 4 },
  rateValue: { fontSize: 18, fontWeight: 'bold', color: '#1976D2' },
  button: {
    backgroundColor: '#1976D2', flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', paddingVertical: 14, borderRadius: 10, gap: 8,
  },
  buttonDisabled: { backgroundColor: '#B0BEC5' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 18, color: '#999', marginTop: 16 },
});

export default DistributorHomeScreen;
