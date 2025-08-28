

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

// //       const vendorRes = await getAllVendors();
// //       const vendorList = vendorRes?.data?.data || vendorRes?.data || [];

// //       if (!Array.isArray(vendorList)) {
// //         setVendors([]);
// //       } else {
// //         setVendors(vendorList);
// //       }
// //     } catch (err: any) {
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

// //       if (!user?.userID) {throw new Error('Customer ID not found. Please log in again.');}

// //       const payload = {
// //         user_id: parseInt(user.userID.toString(), 10),
// //         user_type: 'customer',
// //         vendor: parseInt(vendorId, 10),
// //       };

// //       await createRequest(payload);
// //       Alert.alert('Success', 'Request sent to vendor!');
// //       setRequestedVendors(prev => [...prev, vendorId]);
// //     } catch (err: any) {
// //       const errorMessage =
// //         err.response?.data?.detail ||
// //         err.response?.data?.message ||
// //         err.message ||
// //         'Failed to send request.';
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

// //     // Simple approach - show only village with fallback
// //     const village = item.village || 'No village provided';

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

//   const fetchData = useCallback(async () => {
//     setError(null);
//     setIsLoading(true);
//     try {
//       if (!user?.userID) throw new Error('Customer ID not found. Please log in again.');

//       console.log('Fetching vendors...');
//       const vendorRes = await getAllVendors();
//       console.log('Vendors API response:', vendorRes);

//       const vendorList = vendorRes?.data?.data || vendorRes?.data || [];

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
//     }
//   }, [user?.userID]);

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchData();
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
//             <Text style={styles.address}>{village}</Text>
//           </View>
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
//         <Text style={styles.title}>Available Vendors</Text>
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
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     padding: 16,
//     paddingTop: 50,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   title: { fontSize: 20, fontWeight: 'bold', color: '#333', flex: 1 },
//   logoutButton: { padding: 4 },
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
  cow_milk_rate?: number;
  buffalo_milk_rate?: number;
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

  const fetchData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      if (!user?.userID) throw new Error('Customer ID not found. Please log in again.');

      console.log('Fetching vendors...');
      const vendorRes = await getAllVendors();
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
    }
  }, [user?.userID]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

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

    console.log('Rendering vendor:', item.id, item.name, 'Cow Milk Rate:', item.cow_milk_rate, 'Buffalo Milk Rate:', item.buffalo_milk_rate);

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
            <Text style={styles.address}>{village}</Text>
          </View>

          <Text style={styles.rateText}>
            Cow Milk Rate: {item.cow_milk_rate !== undefined && item.cow_milk_rate !== null ? `₹${item.cow_milk_rate}/L` : 'N/A'}
          </Text>
          <Text style={styles.rateText}>
            Buffalo Milk Rate: {item.buffalo_milk_rate !== undefined && item.buffalo_milk_rate !== null ? `₹${item.buffalo_milk_rate}/L` : 'N/A'}
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Available Vendors</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchData} style={styles.retry}>
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
                <Text style={styles.emptyText}>No vendors available.</Text>
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
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', flex: 1 },
  logoutButton: { padding: 4 },
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
});

export default CustomerHomeScreen;
