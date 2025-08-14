// import React, { useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   FlatList,
//   StyleSheet,
//   RefreshControl,
//   Image,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   ScrollView,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import {
//   getVendorDetailsById,
//   getAcceptedCustomers,
//   getAcceptedMilkmen,
//   getVendorPendingRequests,
// } from '../../apiServices/allApi';

// type AcceptedItem = {
//   id: number;
//   user_id: number;
//   contact?: string;
//   status: string;
//   customer?: {
//     id: number;
//     first_name: string;
//     last_name: string;
//     contact: string;
//   };
//   milkman?: {
//     id: number;
//     full_name: string;
//     phone_number: string;
//   };
//   name?: string | null;
//   user_type: 'customer' | 'milkman';
//   created_at: string;
//   vendor: number;
// };

// type NavigationProp = any;

// const VendorHomeScreen = () => {
//   const navigation = useNavigation<NavigationProp>();

//   const [vendorData, setVendorData] = useState<any>(null);
//   const [acceptedConsumers, setAcceptedConsumers] = useState<AcceptedItem[]>([]);
//   const [acceptedDistributors, setAcceptedDistributors] = useState<AcceptedItem[]>([]);
//   const [pendingRequests, setPendingRequests] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchData = useCallback(async () => {
//     setError(null);
//     setIsLoading(true);
//     try {
//       const vendorId = await AsyncStorage.getItem('userID');
//       if (!vendorId) { throw new Error('Vendor ID not found. Please log in again.'); }

//       console.log('Fetching data for vendor ID:', vendorId);

//       // Fetch Vendor Profile
//       try {
//         const vendorRes = await getVendorDetailsById(vendorId);
//         console.log('Vendor profile response:', vendorRes.data);
//         setVendorData(vendorRes.data?.data || vendorRes.data);
//       } catch (vendorError) {
//         console.error('Vendor profile fetch error:', vendorError);
//       }

//       // Fetch Accepted Consumers
//       try {
//         const acceptedConsumersRes = await getAcceptedCustomers(vendorId);
//         let consumersData = acceptedConsumersRes?.data?.data || [];
//         if (!Array.isArray(consumersData)) {
//           consumersData = [];
//         }
//         // Fix: Use .toLowerCase() for status
//         const filteredConsumers = consumersData.filter((item: AcceptedItem) => {
//           const isCustomer = item.user_type === 'customer';
//           const isAccepted = item.status?.toLowerCase() === 'accepted';
//           return isCustomer && isAccepted;
//         });
//         setAcceptedConsumers(filteredConsumers);
//       } catch (consumerError) {
//         setAcceptedConsumers([]);
//       }

//       // Fetch Accepted Distributors
//       try {
//         const acceptedDistributorsRes = await getAcceptedMilkmen(vendorId);
//         let distributorsData = acceptedDistributorsRes?.data?.data || [];
//         if (!Array.isArray(distributorsData)) {
//           distributorsData = [];
//         }
//         // Fix: Use .toLowerCase() for status
//         const filteredDistributors = distributorsData.filter((item: AcceptedItem) => {
//           const isMilkman = item.user_type === 'milkman';
//           const isAccepted = item.status?.toLowerCase() === 'accepted';
//           return isMilkman && isAccepted;
//         });
//         setAcceptedDistributors(filteredDistributors);
//       } catch (distributorError) {
//         setAcceptedDistributors([]);
//       }

//       // Fetch Pending Requests (for count badge)
//       try {
//         const pendingReqRes = await getVendorPendingRequests(vendorId);
//         const pendingData = pendingReqRes?.data?.data || [];
//         setPendingRequests(Array.isArray(pendingData) ? pendingData : []);
//       } catch (pendingError) {
//         console.error('Pending requests fetch error:', pendingError);
//         setPendingRequests([]);
//         // Optionally show an alert:
//         // Alert.alert('Error', 'Could not load pending requests.');
//       }

//     } catch (e: any) {
//       console.error('General fetch data error:', e);
//       setError(e.message || 'Failed to load data');
//     } finally {
//       setIsLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   // Debug function to test APIs
//   const testAPIs = async () => {
//     try {
//       const vendorId = await AsyncStorage.getItem('userID');
//       if (!vendorId) {
//         console.log('❌ No vendor ID found');
//         return;
//       }

//       console.log('Testing APIs for vendor:', vendorId);

//       // Test consumers API
//       try {
//         const consumersRes = await getAcceptedCustomers(vendorId);
//         console.log('✅ Accepted Customers API Success:', consumersRes.data);
//       } catch (err: any) {
//         console.log('❌ Accepted Customers API Error:', err.response?.data || err.message);
//       }

//       // Test distributors API
//       try {
//         const distributorsRes = await getAcceptedMilkmen(vendorId);
//         console.log('✅ Accepted Distributors API Success:', distributorsRes.data);
//       } catch (err: any) {
//         console.log('❌ Accepted Distributors API Error:', err.response?.data || err.message);
//       }
//     } catch (err) {
//       console.log('❌ Test APIs Error:', err);
//     }
//   };

//   // Auto-refresh when screen comes into focus
//   useFocusEffect(
//     React.useCallback(() => {
//       testAPIs(); // For debugging
//       fetchData();
//     }, [fetchData])
//   );

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchData();
//   };

//   const handleLogout = () => {
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
//               await AsyncStorage.removeItem('userID');
//               await AsyncStorage.removeItem('authToken');
//               navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
//             } catch (err) {
//               console.error('Logout error:', err);
//             }
//           },
//         },
//       ],
//       { cancelable: true }
//     );
//   };

//   const renderConsumerItem = ({ item }: { item: AcceptedItem }) => {
//     console.log('Rendering consumer item:', item);

//     let displayName = 'Unknown Consumer';

//     // Based on your API response structure
//     if (item.customer) {
//       // Use customer nested object
//       const firstName = item.customer.first_name || '';
//       const lastName = item.customer.last_name || '';
//       displayName = `${firstName} ${lastName}`.trim();
//     } else if (item.name) {
//       // Fallback to name field
//       displayName = item.name;
//     } else {
//       // Last resort fallback
//       displayName = `Consumer ${item.user_id || item.id}`;
//     }

//     return (
//       <View style={styles.listItem}>
//         <View style={styles.listItemContent}>
//           <Text style={styles.listItemText}>{displayName}</Text>
//           <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
//             {item.status?.toUpperCase() || 'ACCEPTED'}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   const renderDistributorItem = ({ item }: { item: AcceptedItem }) => {
//     console.log('Rendering distributor item:', item);

//     let displayName = 'Unknown Distributor';

//     // Based on your API response structure
//     if (item.milkman) {
//       // Use milkman nested object
//       displayName = item.milkman.full_name || 'Unnamed Distributor';
//     } else if (item.name) {
//       // Fallback to name field
//       displayName = item.name;
//     } else {
//       // Last resort fallback
//       displayName = `Distributor ${item.user_id || item.id}`;
//     }

//     return (
//       <View style={styles.listItem}>
//         <View style={styles.listItemContent}>
//           <Text style={styles.listItemText}>{displayName}</Text>
//           <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
//             {item.status?.toUpperCase() || 'ACCEPTED'}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   const getStatusColor = (status: string) => {
//     switch (status?.toLowerCase()) {
//       case 'accepted':
//         return '#4CD964';
//       case 'pending':
//         return '#FFA500';
//       case 'rejected':
//         return '#FF6B6B';
//       default:
//         return '#666';
//     }
//   };

//   if (isLoading) {
//     return (
//       <View style={[styles.container, styles.center]}>
//         <ActivityIndicator size="large" color="#007AFF" />
//         <Text style={{ marginTop: 10, color: '#666' }}>Loading vendor data...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={[styles.container, styles.center]}>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={{ flex: 1 }}
//       contentContainerStyle={{ flexGrow: 1 }}
//       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//     >
//       <View style={styles.container}>
//         {/* Header and Logout */}
//         <View style={styles.headerRow}>
//           <Text style={styles.headerTitle}>Vendor Home</Text>
//           <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
//             <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
//           </TouchableOpacity>
//         </View>

//         {/* Profile Card */}
//         <View style={styles.profileCard}>
//           <Image
//             style={styles.avatar}
//             source={{
//               uri: vendorData?.profile_image || 'https://randomuser.me/api/portraits/men/32.jpg',
//             }}
//             defaultSource={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
//           />
//           <View style={{ flex: 1, marginLeft: 12 }}>
//             <Text style={styles.profileName}>
//               {vendorData?.name || vendorData?.business_name || 'Vendor Name'}
//             </Text>
//             <Text style={styles.profileLocation}>
//               {vendorData?.location || vendorData?.address || 'Location unknown'}
//             </Text>
//           </View>
//         </View>

//         {/* Stats Row */}
//         <View style={styles.statsRow}>
//           <View style={[styles.statsBox, styles.shadowBox]}>
//             <Ionicons name="people-outline" size={24} color="#007AFF" />
//             <Text style={styles.statsLabel}>Accepted Consumers</Text>
//             <Text style={styles.statsValue}>{acceptedConsumers.length}</Text>
//           </View>
//           <View style={[styles.statsBox, styles.shadowBox]}>
//             <Ionicons name="business-outline" size={24} color="#FF9500" />
//             <Text style={styles.statsLabel}>Accepted Distributors</Text>
//             <Text style={styles.statsValue}>{acceptedDistributors.length}</Text>
//           </View>
//         </View>

//         {/* Pending Requests Card */}
//         <TouchableOpacity
//           style={[styles.pendingCard, styles.shadowBox]}
//           onPress={() => {
//             try {
//               navigation.navigate('PendingRequests');
//             } catch (navError) {
//               console.error('Navigation error:', navError);
//               Alert.alert('Error', 'Cannot navigate to Pending Requests screen');
//             }
//           }}
//         >
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             <Ionicons name="notifications-outline" size={24} color="#007AFF" />
//             <Text style={[styles.statsLabel, { marginLeft: 12, marginTop: 0 }]}>
//               Pending Requests
//             </Text>
//           </View>
//           <View style={styles.pendingCountContainer}>
//             <Text style={styles.pendingCountText}>{pendingRequests.length}</Text>
//           </View>
//         </TouchableOpacity>

//         {/* Accepted Consumers List */}
//         <View style={styles.listSection}>
//           <Text style={styles.sectionTitle}>Accepted Consumers ({acceptedConsumers.length})</Text>
//           {acceptedConsumers.length === 0 ? (
//             <Text style={styles.emptyText}>No accepted consumers found.</Text>
//           ) : (
//             <FlatList
//               data={acceptedConsumers}
//               keyExtractor={(item, index) => `consumer_${item.id || index}`}
//               renderItem={renderConsumerItem}
//               scrollEnabled={false}
//               showsVerticalScrollIndicator={false}
//             />
//           )}
//         </View>

//         {/* Accepted Distributors List */}
//         <View style={styles.listSection}>
//           <Text style={styles.sectionTitle}>Accepted Distributors ({acceptedDistributors.length})</Text>
//           {acceptedDistributors.length === 0 ? (
//             <Text style={styles.emptyText}>No accepted distributors found.</Text>
//           ) : (
//             <FlatList
//               data={acceptedDistributors}
//               keyExtractor={(item, index) => `distributor_${item.id || index}`}
//               renderItem={renderDistributorItem}
//               scrollEnabled={false}
//               showsVerticalScrollIndicator={false}
//             />
//           )}
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default VendorHomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     backgroundColor: '#fefefe',
//     paddingTop: 40,
//     paddingBottom: 40,
//     minHeight: '100%',
//   },
//   center: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flex: 1,
//     paddingHorizontal: 20,
//   },

//   headerRow: {
//     paddingHorizontal: 16,
//     paddingBottom: 16,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   logoutButton: {
//     padding: 4,
//   },

//   profileCard: {
//     backgroundColor: '#fff',
//     padding: 16,
//     marginHorizontal: 16,
//     borderRadius: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         shadowOffset: { width: 0, height: 2 },
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },
//   avatar: {
//     width: 72,
//     height: 72,
//     borderRadius: 36,
//     backgroundColor: '#ccc',
//   },
//   profileName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#222',
//   },
//   profileLocation: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 4,
//   },

//   statsRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginHorizontal: 16,
//     marginBottom: 24,
//   },
//   statsBox: {
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     borderRadius: 12,
//     width: '45%',
//     minHeight: 100,
//   },
//   statsLabel: {
//     fontSize: 14,
//     color: '#444',
//     marginTop: 8,
//     textAlign: 'center',
//   },
//   statsValue: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     color: '#007AFF',
//     marginTop: 4,
//   },
//   shadowBox: {
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         shadowOffset: { width: 0, height: 2 },
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },

//   pendingCard: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingVertical: 18,
//     backgroundColor: '#fff',
//     marginHorizontal: 16,
//     borderRadius: 12,
//     marginBottom: 24,
//     alignItems: 'center',
//     minHeight: 60,
//   },

//   pendingCountContainer: {
//     backgroundColor: '#FF3B30',
//     borderRadius: 14,
//     minWidth: 28,
//     height: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   pendingCountText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 14,
//     paddingHorizontal: 6,
//   },

//   listSection: {
//     marginHorizontal: 16,
//     marginBottom: 24,
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.05,
//         shadowRadius: 6,
//         shadowOffset: { width: 0, height: 3 },
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },

//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 12,
//     color: '#222',
//   },

//   listItem: {
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//   },

//   listItemContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   listItemText: {
//     fontSize: 16,
//     color: '#444',
//     flex: 1,
//   },

//   statusText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//     backgroundColor: '#f0f0f0',
//   },

//   emptyText: {
//     fontSize: 14,
//     color: '#888',
//     textAlign: 'center',
//     paddingVertical: 20,
//     fontStyle: 'italic',
//   },

//   errorText: {
//     color: 'red',
//     fontSize: 16,
//     marginBottom: 12,
//     textAlign: 'center',
//   },

//   retryButton: {
//     backgroundColor: '#007AFF',
//     borderRadius: 6,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  RefreshControl,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState, AppDispatch } from '../../store';
import { logout } from '../../store/authSlice';

import {
  getVendorDetailsById,
  getAcceptedCustomers,
  getAcceptedMilkmen,
  getVendorPendingRequests,
} from '../../apiServices/allApi';

type AcceptedItem = {
  id: number;
  user_id: number;
  contact?: string;
  status: string;
  customer?: {
    id: number;
    first_name: string;
    last_name: string;
    contact: string;
  };
  milkman?: {
    id: number;
    full_name: string;
    phone_number: string;
  };
  name?: string | null;
  user_type: 'customer' | 'milkman';
  created_at: string;
  vendor: number;
};

type NavigationProp = any;

const VendorHomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  // ✅ ALL HOOKS AT THE TOP - BEFORE ANY CONDITIONAL LOGIC
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [vendorData, setVendorData] = useState<any>(null);
  const [acceptedConsumers, setAcceptedConsumers] = useState<AcceptedItem[]>([]);
  const [acceptedDistributors, setAcceptedDistributors] = useState<AcceptedItem[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const vendorId = user?.userID;

      if (!vendorId) {
        throw new Error('Vendor ID not found. Please log in again.');
      }

      console.log('Fetching data for vendor ID:', vendorId);

      // Fetch Vendor Profile
      try {
        const vendorRes = await getVendorDetailsById(vendorId);
        console.log('Vendor profile response:', vendorRes.data);
        setVendorData(vendorRes.data?.data || vendorRes.data);
      } catch (vendorError) {
        console.error('Vendor profile fetch error:', vendorError);
      }

      // Fetch Accepted Consumers
      try {
        const acceptedConsumersRes = await getAcceptedCustomers(vendorId);
        let consumersData = acceptedConsumersRes?.data?.data || [];
        if (!Array.isArray(consumersData)) {
          consumersData = [];
        }
        const filteredConsumers = consumersData.filter((item: AcceptedItem) => {
          const isCustomer = item.user_type === 'customer';
          const isAccepted = item.status?.toLowerCase() === 'accepted';
          return isCustomer && isAccepted;
        });
        setAcceptedConsumers(filteredConsumers);
      } catch (consumerError) {
        setAcceptedConsumers([]);
      }

      // Fetch Accepted Distributors
      try {
        const acceptedDistributorsRes = await getAcceptedMilkmen(vendorId);
        let distributorsData = acceptedDistributorsRes?.data?.data || [];
        if (!Array.isArray(distributorsData)) {
          distributorsData = [];
        }
        const filteredDistributors = distributorsData.filter((item: AcceptedItem) => {
          const isMilkman = item.user_type === 'milkman';
          const isAccepted = item.status?.toLowerCase() === 'accepted';
          return isMilkman && isAccepted;
        });
        setAcceptedDistributors(filteredDistributors);
      } catch (distributorError) {
        setAcceptedDistributors([]);
      }

      // Fetch Pending Requests
      try {
        const pendingReqRes = await getVendorPendingRequests(vendorId);
        const pendingData = pendingReqRes?.data?.data || [];
        setPendingRequests(Array.isArray(pendingData) ? pendingData : []);
      } catch (pendingError) {
        console.error('Pending requests fetch error:', pendingError);
        setPendingRequests([]);
      }

    } catch (e: any) {
      console.error('General fetch data error:', e);
      setError(e.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [user?.userID]);

  const testAPIs = useCallback(async () => {
    try {
      const vendorId = user?.userID;
      if (!vendorId) {
        console.log('❌ No vendor ID found');
        return;
      }

      console.log('Testing APIs for vendor:', vendorId);

      try {
        const consumersRes = await getAcceptedCustomers(vendorId);
        console.log('✅ Accepted Customers API Success:', consumersRes.data);
      } catch (err: any) {
        console.log('❌ Accepted Customers API Error:', err.response?.data || err.message);
      }

      try {
        const distributorsRes = await getAcceptedMilkmen(vendorId);
        console.log('✅ Accepted Distributors API Success:', distributorsRes.data);
      } catch (err: any) {
        console.log('❌ Accepted Distributors API Error:', err.response?.data || err.message);
      }
    } catch (err) {
      console.log('❌ Test APIs Error:', err);
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
              await AsyncStorage.multiRemove([
                'access_token',
                'refresh_token',
                'userInfo',
              ]);

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

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  // ✅ useFocusEffect hook called unconditionally
  useFocusEffect(
    useCallback(() => {
      testAPIs();
      fetchData();
    }, [testAPIs, fetchData])
  );

  // ✅ CONDITIONAL RENDERING AFTER ALL HOOKS
  if (!isAuthenticated || !user?.userID) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#666' }}>
          Loading user information...
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading vendor data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderConsumerItem = ({ item }: { item: AcceptedItem }) => {
    let displayName = 'Unknown Consumer';

    if (item.customer) {
      const firstName = item.customer.first_name || '';
      const lastName = item.customer.last_name || '';
      displayName = `${firstName} ${lastName}`.trim();
    } else if (item.name) {
      displayName = item.name;
    } else {
      displayName = `Consumer ${item.user_id || item.id}`;
    }

    return (
      <View style={styles.listItem}>
        <View style={styles.listItemContent}>
          <Text style={styles.listItemText}>{displayName}</Text>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status?.toUpperCase() || 'ACCEPTED'}
          </Text>
        </View>
      </View>
    );
  };

  const renderDistributorItem = ({ item }: { item: AcceptedItem }) => {
    let displayName = 'Unknown Distributor';

    if (item.milkman) {
      displayName = item.milkman.full_name || 'Unnamed Distributor';
    } else if (item.name) {
      displayName = item.name;
    } else {
      displayName = `Distributor ${item.user_id || item.id}`;
    }

    return (
      <View style={styles.listItem}>
        <View style={styles.listItemContent}>
          <Text style={styles.listItemText}>{displayName}</Text>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status?.toUpperCase() || 'ACCEPTED'}
          </Text>
        </View>
      </View>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return '#4CD964';
      case 'pending':
        return '#FFA500';
      case 'rejected':
        return '#FF6B6B';
      default:
        return '#666';
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.container}>
        {/* Header and Logout */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Vendor Home</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={28} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            style={styles.avatar}
            source={{
              uri: vendorData?.profile_image || 'https://randomuser.me/api/portraits/men/32.jpg',
            }}
            defaultSource={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.profileName}>
              {vendorData?.name || vendorData?.business_name || 'Vendor Name'}
            </Text>
            <Text style={styles.profileLocation}>
              {vendorData?.location || vendorData?.address || 'Location unknown'}
            </Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={[styles.statsBox, styles.shadowBox]}>
            <Ionicons name="people-outline" size={24} color="#007AFF" />
            <Text style={styles.statsLabel}>Accepted Consumers</Text>
            <Text style={styles.statsValue}>{acceptedConsumers.length}</Text>
          </View>
          <View style={[styles.statsBox, styles.shadowBox]}>
            <Ionicons name="business-outline" size={24} color="#FF9500" />
            <Text style={styles.statsLabel}>Accepted Distributors</Text>
            <Text style={styles.statsValue}>{acceptedDistributors.length}</Text>
          </View>
        </View>

        {/* Pending Requests Card */}
        <TouchableOpacity
          style={[styles.pendingCard, styles.shadowBox]}
          onPress={() => {
            try {
              navigation.navigate('PendingRequests');
            } catch (navError) {
              console.error('Navigation error:', navError);
              Alert.alert('Error', 'Cannot navigate to Pending Requests screen');
            }
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="notifications-outline" size={24} color="#007AFF" />
            <Text style={[styles.statsLabel, { marginLeft: 12, marginTop: 0 }]}>
              Pending Requests
            </Text>
          </View>
          <View style={styles.pendingCountContainer}>
            <Text style={styles.pendingCountText}>{pendingRequests.length}</Text>
          </View>
        </TouchableOpacity>

        {/* Accepted Consumers List */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Accepted Consumers ({acceptedConsumers.length})</Text>
          {acceptedConsumers.length === 0 ? (
            <Text style={styles.emptyText}>No accepted consumers found.</Text>
          ) : (
            <FlatList
              data={acceptedConsumers}
              keyExtractor={(item, index) => `consumer_${item.id || index}`}
              renderItem={renderConsumerItem}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Accepted Distributors List */}
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>Accepted Distributors ({acceptedDistributors.length})</Text>
          {acceptedDistributors.length === 0 ? (
            <Text style={styles.emptyText}>No accepted distributors found.</Text>
          ) : (
            <FlatList
              data={acceptedDistributors}
              keyExtractor={(item, index) => `distributor_${item.id || index}`}
              renderItem={renderDistributorItem}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default VendorHomeScreen;

// ... styles remain the same


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fefefe',
    paddingTop: 40,
    paddingBottom: 40,
    minHeight: '100%',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },

  headerRow: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    padding: 4,
  },

  profileCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ccc',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  profileLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  statsBox: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '45%',
    minHeight: 100,
  },
  statsLabel: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
    textAlign: 'center',
  },
  statsValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 4,
  },
  shadowBox: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 3,
      },
    }),
  },

  pendingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
    minHeight: 60,
  },

  pendingCountContainer: {
    backgroundColor: '#FF3B30',
    borderRadius: 14,
    minWidth: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingCountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    paddingHorizontal: 6,
  },

  listSection: {
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 3,
      },
    }),
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#222',
  },

  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  listItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  listItemText: {
    fontSize: 16,
    color: '#444',
    flex: 1,
  },

  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
  },

  emptyText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },

  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

