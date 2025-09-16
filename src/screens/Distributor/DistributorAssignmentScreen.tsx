// // // import React, { useEffect, useState, useCallback } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   FlatList,
// // //   TouchableOpacity,
// // //   ActivityIndicator,
// // //   StyleSheet,
// // //   Alert,
// // //   RefreshControl,
// // //   BackHandler,
// // //   Platform,
// // //   TextInput,
// // // } from 'react-native';
// // // import Ionicons from 'react-native-vector-icons/Ionicons';
// // // import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// // // import { useSelector } from 'react-redux';
// // // import { RootState } from '../../store/index';
// // // import {
// // //   getAcceptedMilkmen,
// // //   assignConsumerToDistributor,
// // // } from '../../apiServices/allApi';

// // // type Distributor = {
// // //   id: number;
// // //   full_name: string;
// // //   phone_number: string;
// // //   email?: string;
// // //   status: string;
// // //   assigned_customers_count?: number;
// // // };

// // // type Consumer = {
// // //   id: number;
// // //   user_id: number;
// // //   status: string;
// // //   customer?: {
// // //     id: number;
// // //     first_name: string;
// // //     last_name: string;
// // //   };
// // //   name?: string | null;
// // //   user_contact: string;
// // //   user_type: 'customer' | 'milkman';
// // //   vendor: number;
// // // };

// // // // Remove the callback from route params
// // // type RouteParams = {
// // //   AssignDistributor: {
// // //     consumer: Consumer;
// // //     // Remove onAssignmentComplete
// // //   };
// // // };

// // // type AssignDistributorRouteProp = RouteProp<RouteParams, 'AssignDistributor'>;

// // // const AssignDistributorScreen = () => {
// // //   const navigation = useNavigation();
// // //   const route = useRoute<AssignDistributorRouteProp>();
// // //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

// // //   // Remove onAssignmentComplete from destructuring
// // //   const { consumer } = route.params;

// // //   const [distributors, setDistributors] = useState<Distributor[]>([]);
// // //   const [filteredDistributors, setFilteredDistributors] = useState<Distributor[]>([]);
// // //   const [loading, setLoading] = useState<boolean>(true);
// // //   const [processing, setProcessing] = useState<boolean>(false);
// // //   const [selectedDistributorId, setSelectedDistributorId] = useState<number | null>(null);
// // //   const [refreshing, setRefreshing] = useState<boolean>(false);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [searchQuery, setSearchQuery] = useState<string>('');

// // //   const handleGoBack = useCallback(() => {
// // //     if (navigation.canGoBack()) {
// // //       navigation.goBack();
// // //     } else {
// // //       navigation.navigate('PendingRequests' as never);
// // //     }
// // //   }, [navigation]);

// // //   useEffect(() => {
// // //     const backAction = () => {
// // //       handleGoBack();
// // //       return true;
// // //     };

// // //     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
// // //     return () => backHandler.remove();
// // //   }, [handleGoBack]);

// // //   const getConsumerName = useCallback(() => {
// // //     if (consumer.customer) {
// // //       const firstName = consumer.customer.first_name || '';
// // //       const lastName = consumer.customer.last_name || '';
// // //       return `${firstName} ${lastName}`.trim();
// // //     }
// // //     return consumer.name || 'Unknown Consumer';
// // //   }, [consumer]);

// // //   const fetchDistributors = useCallback(async () => {
// // //     setError(null);
// // //     setLoading(true);

// // //     try {
// // //       const vendorId = user?.userID;

// // //       if (!vendorId) {
// // //         throw new Error('Vendor ID not found. Please log in again.');
// // //       }

// // //       console.log('Fetching distributors for vendor ID:', vendorId);

// // //       const response = await getAcceptedMilkmen(vendorId);
// // //       console.log('✅ Distributors API success:', response.data);

// // //       const data = response.data?.data || response.data || [];

// // //       if (Array.isArray(data)) {
// // //         const activeDistributors = data
// // //           .filter((milkman: any) => milkman.status?.toLowerCase() === 'active')
// // //           .map((milkman: any) => ({
// // //             id: milkman.id || milkman.milkman?.id,
// // //             full_name: milkman.full_name || milkman.milkman?.full_name || 'Unknown',
// // //             phone_number: milkman.phone_number || milkman.milkman?.phone_number || 'N/A',
// // //             email: milkman.email || milkman.milkman?.email,
// // //             status: milkman.status || 'active',
// // //             assigned_customers_count: milkman.assigned_customers_count || 0,
// // //           }));
        
// // //         setDistributors(activeDistributors);
// // //         setFilteredDistributors(activeDistributors);
// // //         console.log('Total active distributors found:', activeDistributors.length);
// // //       } else {
// // //         console.warn('API response is not an array:', data);
// // //         setDistributors([]);
// // //         setFilteredDistributors([]);
// // //       }

// // //     } catch (err: any) {
// // //       console.error('❌ Error fetching distributors:', err);
      
// // //       let errorMessage = 'Failed to load distributors.';
      
// // //       if (err.response?.status === 500) {
// // //         errorMessage = 'Server error. Please try again later.';
// // //       } else if (err.response?.status === 401) {
// // //         errorMessage = 'Authentication failed. Please log in again.';
// // //       } else if (err.response?.status === 404) {
// // //         errorMessage = 'No distributors found for this vendor.';
// // //       } else if (err.message) {
// // //         errorMessage = err.message;
// // //       }

// // //       setError(errorMessage);
// // //       setDistributors([]);
// // //       setFilteredDistributors([]);
// // //     }

// // //     setLoading(false);
// // //     setRefreshing(false);
// // //   }, [user?.userID]);

// // //   useEffect(() => {
// // //     fetchDistributors();
// // //   }, [fetchDistributors]);

// // //   const onRefresh = useCallback(() => {
// // //     setRefreshing(true);
// // //     fetchDistributors();
// // //   }, [fetchDistributors]);

// // //   useEffect(() => {
// // //     if (searchQuery.trim() === '') {
// // //       setFilteredDistributors(distributors);
// // //     } else {
// // //       const filtered = distributors.filter(distributor =>
// // //         distributor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// // //         distributor.phone_number.includes(searchQuery) ||
// // //         distributor.email?.toLowerCase().includes(searchQuery.toLowerCase())
// // //       );
// // //       setFilteredDistributors(filtered);
// // //     }
// // //   }, [searchQuery, distributors]);

// // //   const handleAssignDistributor = useCallback(async (distributorId: number) => {
// // //     if (processing) return;
    
// // //     setSelectedDistributorId(distributorId);
// // //     setProcessing(true);

// // //     try {
// // //       console.log('Assigning consumer to distributor:', {
// // //         customer_id: consumer.user_id,
// // //         milkman_id: distributorId,
// // //       });

// // //       const response = await assignConsumerToDistributor({
// // //         customer_id: consumer.user_id,
// // //         milkman_id: distributorId,
// // //       });

// // //       console.log('✅ Assignment API success:', response.data);

// // //       const selectedDistributor = distributors.find(d => d.id === distributorId);
      
// // //       Alert.alert(
// // //         'Assignment Successful',
// // //         `Consumer ${getConsumerName()} has been successfully assigned to ${selectedDistributor?.full_name || 'the distributor'}.`,
// // //         [
// // //           {
// // //             text: 'OK',
// // //             onPress: () => {
// // //               // Navigate back to PendingRequests
// // //               // The screen will automatically refresh when it gets focus
// // //               navigation.navigate('PendingRequests' as never);
// // //             },
// // //           },
// // //         ]
// // //       );

// // //     } catch (err: any) {
// // //       console.error('❌ Error assigning consumer to distributor:', err);
      
// // //       let errorMessage = 'Failed to assign consumer to distributor.';
      
// // //       if (err.response?.status === 400) {
// // //         errorMessage = err.response?.data?.detail || 
// // //                       err.response?.data?.message || 
// // //                       'Invalid assignment data. Please try again.';
// // //       } else if (err.response?.status === 409) {
// // //         errorMessage = 'Consumer is already assigned to a distributor.';
// // //       } else if (err.response?.status === 404) {
// // //         errorMessage = 'Consumer or distributor not found.';
// // //       } else if (err.response?.status === 500) {
// // //         errorMessage = 'Server error. Please try again later.';
// // //       } else if (err.response?.data?.detail) {
// // //         errorMessage = err.response.data.detail;
// // //       } else if (err.message) {
// // //         errorMessage = err.message;
// // //       }
      
// // //       Alert.alert('Assignment Failed', errorMessage);
// // //       setSelectedDistributorId(null);
// // //     } finally {
// // //       setProcessing(false);
// // //     }
// // //   }, [processing, consumer, distributors, navigation, getConsumerName]);

// // //   const renderDistributorItem = ({ item }: { item: Distributor }) => {
// // //     const isSelected = selectedDistributorId === item.id;
// // //     const isProcessing = processing && selectedDistributorId === item.id;
    
// // //     return (
// // //       <TouchableOpacity
// // //         style={[styles.distributorItem, isSelected && styles.selectedItem]}
// // //         onPress={() => handleAssignDistributor(item.id)}
// // //         disabled={processing}
// // //       >
// // //         <View style={styles.distributorContent}>
// // //           <View style={styles.avatarContainer}>
// // //             <View style={styles.avatar}>
// // //               <Ionicons name="business" size={24} color="#fff" />
// // //             </View>
// // //           </View>

// // //           <View style={styles.contentSection}>
// // //             <Text style={styles.name}>{item.full_name}</Text>
// // //             <Text style={styles.contact}>{item.phone_number}</Text>
// // //             {item.email && <Text style={styles.email}>{item.email}</Text>}
// // //             <Text style={styles.status}>{item.status?.toUpperCase()}</Text>
// // //             {item.assigned_customers_count !== undefined && (
// // //               <Text style={styles.customerCount}>
// // //                 {item.assigned_customers_count} customers assigned
// // //               </Text>
// // //             )}
// // //           </View>

// // //           <View style={styles.actionContainer}>
// // //             {isProcessing ? (
// // //               <ActivityIndicator color="#007AFF" size="small" />
// // //             ) : (
// // //               <Ionicons 
// // //                 name={isSelected ? "checkmark-circle" : "add-circle-outline"} 
// // //                 size={24} 
// // //                 color={isSelected ? "#34C759" : "#007AFF"} 
// // //               />
// // //             )}
// // //           </View>
// // //         </View>
// // //       </TouchableOpacity>
// // //     );
// // //   };

// // //   if (!isAuthenticated || !user?.userID) {
// // //     return (
// // //       <View style={styles.centerContainer}>
// // //         <ActivityIndicator size="large" color="#007AFF" />
// // //         <Text style={styles.loadingText}>Loading assignment screen...</Text>
// // //       </View>
// // //     );
// // //   }

// // //   return (
// // //     <View style={styles.container}>
// // //       {/* Header */}
// // //       <View style={styles.header}>
// // //         <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
// // //           <Ionicons name="arrow-back" size={24} color="#007AFF" />
// // //         </TouchableOpacity>
// // //         <View style={styles.headerContent}>
// // //           <Text style={styles.headerTitle}>Assign Distributor</Text>
// // //           <Text style={styles.headerSubtitle}>For: {getConsumerName()}</Text>
// // //         </View>
// // //       </View>

// // //       {/* Consumer Info */}
// // //       <View style={styles.consumerCard}>
// // //         <Text style={styles.consumerName}>{getConsumerName()}</Text>
// // //         <Text style={styles.consumerContact}>{consumer.user_contact}</Text>
// // //         <Text style={styles.assignmentNote}>Select a distributor to assign this consumer</Text>
// // //       </View>

// // //       {/* Search Bar */}
// // //       <View style={styles.searchContainer}>
// // //         <TextInput
// // //           style={styles.searchInput}
// // //           placeholder="Search distributors..."
// // //           value={searchQuery}
// // //           onChangeText={setSearchQuery}
// // //           placeholderTextColor="#8E8E93"
// // //         />
// // //       </View>

// // //       {/* Error Banner */}
// // //       {error && (
// // //         <View style={styles.errorBanner}>
// // //           <Text style={styles.errorText}>{error}</Text>
// // //           <TouchableOpacity onPress={fetchDistributors} style={styles.retryButton}>
// // //             <Text style={styles.retryButtonText}>Retry</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       )}

// // //       {/* Content */}
// // //       {loading ? (
// // //         <View style={styles.centerContainer}>
// // //           <ActivityIndicator size="large" color="#007AFF" />
// // //           <Text>Loading distributors...</Text>
// // //         </View>
// // //       ) : (
// // //         <FlatList
// // //           data={filteredDistributors}
// // //           keyExtractor={(item, index) => `distributor_${item.id || index}`}
// // //           renderItem={renderDistributorItem}
// // //           contentContainerStyle={styles.listContainer}
// // //           refreshControl={
// // //             <RefreshControl
// // //               refreshing={refreshing}
// // //               onRefresh={onRefresh}
// // //               colors={['#007AFF']}
// // //               tintColor="#007AFF"
// // //             />
// // //           }
// // //           ListEmptyComponent={() => (
// // //             <View style={styles.emptyContainer}>
// // //               <Text style={styles.emptyTitle}>No Distributors Found</Text>
// // //               <Text style={styles.emptyText}>
// // //                 {searchQuery 
// // //                   ? `No distributors match "${searchQuery}".`
// // //                   : 'No active distributors available for assignment.'
// // //                 }
// // //               </Text>
// // //             </View>
// // //           )}
// // //         />
// // //       )}
// // //     </View>
// // //   );
// // // };

// // // // Keep all your existing styles...
// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#F2F2F7',
// // //   },

// // //   // Header
// // //   header: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingVertical: 16,
// // //     paddingHorizontal: 20,
// // //     paddingTop: Platform.OS === 'ios' ? 50 : 20,
// // //     backgroundColor: '#fff',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#E5E5EA',
// // //   },
// // //   backButton: {
// // //     width: 40,
// // //     height: 40,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 16,
// // //   },
// // //   headerContent: {
// // //     flex: 1,
// // //   },
// // //   headerTitle: {
// // //     fontSize: 22,
// // //     fontWeight: 'bold',
// // //     color: '#1C1C1E',
// // //   },
// // //   headerSubtitle: {
// // //     fontSize: 14,
// // //     color: '#8E8E93',
// // //     marginTop: 2,
// // //   },

// // //   // Consumer Info
// // //   consumerCard: {
// // //     backgroundColor: '#fff',
// // //     marginHorizontal: 20,
// // //     marginTop: 20,
// // //     borderRadius: 16,
// // //     padding: 16,
// // //   },
// // //   consumerName: {
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //     color: '#1C1C1E',
// // //   },
// // //   consumerContact: {
// // //     fontSize: 14,
// // //     color: '#007AFF',
// // //     marginTop: 4,
// // //   },
// // //   assignmentNote: {
// // //     fontSize: 14,
// // //     color: '#8E8E93',
// // //     fontStyle: 'italic',
// // //     marginTop: 8,
// // //   },

// // //   // Search
// // //   searchContainer: {
// // //     paddingHorizontal: 20,
// // //     paddingVertical: 16,
// // //   },
// // //   searchInput: {
// // //     backgroundColor: '#fff',
// // //     borderRadius: 12,
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 12,
// // //     fontSize: 16,
// // //     color: '#1C1C1E',
// // //     borderWidth: 1,
// // //     borderColor: '#E5E5EA',
// // //   },

// // //   // Error
// // //   errorBanner: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#FFEBEB',
// // //     padding: 16,
// // //     marginHorizontal: 20,
// // //     marginBottom: 16,
// // //     borderRadius: 12,
// // //     justifyContent: 'space-between',
// // //   },
// // //   errorText: {
// // //     color: '#FF3B30',
// // //     fontSize: 14,
// // //     flex: 1,
// // //     fontWeight: '500',
// // //   },
// // //   retryButton: {
// // //     backgroundColor: '#FF3B30',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 8,
// // //     borderRadius: 8,
// // //   },
// // //   retryButtonText: {
// // //     color: '#fff',
// // //     fontSize: 12,
// // //     fontWeight: 'bold',
// // //   },

// // //   // Loading
// // //   centerContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 20,
// // //   },
// // //   loadingText: {
// // //     marginTop: 12,
// // //     color: '#8E8E93',
// // //     fontSize: 16,
// // //   },

// // //   // List
// // //   listContainer: {
// // //     paddingBottom: 40,
// // //   },

// // //   // Distributor Item
// // //   distributorItem: {
// // //     backgroundColor: '#fff',
// // //     borderRadius: 16,
// // //     marginHorizontal: 20,
// // //     marginBottom: 12,
// // //     borderWidth: 2,
// // //     borderColor: 'transparent',
// // //   },
// // //   selectedItem: {
// // //     borderColor: '#34C759',
// // //     backgroundColor: '#F0FFF4',
// // //   },
// // //   distributorContent: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     padding: 20,
// // //   },

// // //   // Avatar
// // //   avatarContainer: {
// // //     marginRight: 16,
// // //   },
// // //   avatar: {
// // //     width: 50,
// // //     height: 50,
// // //     borderRadius: 25,
// // //     backgroundColor: '#FF9500',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },

// // //   // Content
// // //   contentSection: {
// // //     flex: 1,
// // //   },
// // //   name: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     color: '#1C1C1E',
// // //     marginBottom: 4,
// // //   },
// // //   contact: {
// // //     fontSize: 14,
// // //     color: '#007AFF',
// // //     marginBottom: 2,
// // //   },
// // //   email: {
// // //     fontSize: 14,
// // //     color: '#8E8E93',
// // //     marginBottom: 2,
// // //   },
// // //   status: {
// // //     fontSize: 12,
// // //     fontWeight: 'bold',
// // //     color: '#34C759',
// // //     marginTop: 4,
// // //   },
// // //   customerCount: {
// // //     fontSize: 12,
// // //     color: '#8E8E93',
// // //     marginTop: 2,
// // //   },

// // //   // Action
// // //   actionContainer: {
// // //     marginLeft: 16,
// // //     alignItems: 'center',
// // //   },

// // //   // Empty State
// // //   emptyContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 40,
// // //     paddingTop: 100,
// // //   },
// // //   emptyTitle: {
// // //     fontSize: 24,
// // //     fontWeight: 'bold',
// // //     color: '#1C1C1E',
// // //     marginBottom: 12,
// // //     textAlign: 'center',
// // //   },
// // //   emptyText: {
// // //     fontSize: 16,
// // //     color: '#8E8E93',
// // //     textAlign: 'center',
// // //     lineHeight: 22,
// // //   },
// // // });

// // // export default AssignDistributorScreen;
// // import React, { useEffect, useState, useCallback } from 'react';
// // import {
// //   View,
// //   Text,
// //   FlatList,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   StyleSheet,
// //   Alert,
// //   RefreshControl,
// //   BackHandler,
// //   Platform,
// //   TextInput,
// // } from 'react-native';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// // import { useSelector } from 'react-redux';
// // import { RootState } from '../../store/index';
// // import {
// //   getAcceptedMilkmen,
// //   assignConsumerToDistributor,
// // } from '../../apiServices/allApi';

// // type Distributor = {
// //   id: number;
// //   full_name: string;
// //   phone_number: string;
// //   email?: string;
// //   status: string;
// //   assigned_customers_count?: number;
// // };

// // type Consumer = {
// //   id: number;
// //   user_id: number;
// //   status: string;
// //   customer?: {
// //     id: number;
// //     first_name: string;
// //     last_name: string;
// //   };
// //   name?: string | null;
// //   user_contact: string;
// //   user_type: 'customer' | 'milkman';
// //   vendor: number;
// // };

// // type RouteParams = {
// //   AssignDistributor: {
// //     consumer: Consumer;
// //   };
// // };

// // type AssignDistributorRouteProp = RouteProp<RouteParams, 'AssignDistributor'>;

// // const AssignDistributorScreen = () => {
// //   const navigation = useNavigation();
// //   const route = useRoute<AssignDistributorRouteProp>();
// //   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

// //   const { consumer } = route.params;

// //   const [distributors, setDistributors] = useState<Distributor[]>([]);
// //   const [filteredDistributors, setFilteredDistributors] = useState<Distributor[]>([]);
// //   const [loading, setLoading] = useState<boolean>(true);
// //   const [processing, setProcessing] = useState<boolean>(false);
// //   const [selectedDistributorId, setSelectedDistributorId] = useState<number | null>(null);
// //   const [refreshing, setRefreshing] = useState<boolean>(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [searchQuery, setSearchQuery] = useState<string>('');

// //   const handleGoBack = useCallback(() => {
// //     if (navigation.canGoBack()) {
// //       navigation.goBack();
// //     } else {
// //       navigation.navigate('PendingRequests' as never);
// //     }
// //   }, [navigation]);

// //   useEffect(() => {
// //     const backAction = () => {
// //       handleGoBack();
// //       return true;
// //     };

// //     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
// //     return () => backHandler.remove();
// //   }, [handleGoBack]);

// //   const getConsumerName = useCallback(() => {
// //     if (consumer.customer) {
// //       const firstName = consumer.customer.first_name || '';
// //       const lastName = consumer.customer.last_name || '';
// //       return `${firstName} ${lastName}`.trim();
// //     }
// //     return consumer.name || 'Unknown Consumer';
// //   }, [consumer]);

// //   const fetchDistributors = useCallback(async () => {
// //     setError(null);
// //     setLoading(true);

// //     try {
// //       const vendorId = user?.userID;

// //       if (!vendorId) {
// //         throw new Error('Vendor ID not found. Please log in again.');
// //       }

// //       console.log('🔍 Fetching distributors for vendor ID:', vendorId);

// //       const response = await getAcceptedMilkmen(vendorId);
// //       console.log('📦 Full API Response:', JSON.stringify(response.data, null, 2));

// //       // Try multiple data extraction paths
// //       let distributorData = [];
      
// //       // Check various possible response structures
// //       if (response.data?.data && Array.isArray(response.data.data)) {
// //         distributorData = response.data.data;
// //         console.log('✅ Found data in response.data.data');
// //       } else if (Array.isArray(response.data)) {
// //         distributorData = response.data;
// //         console.log('✅ Found data in response.data');
// //       } else if (response.data?.results && Array.isArray(response.data.results)) {
// //         distributorData = response.data.results;
// //         console.log('✅ Found data in response.data.results');
// //       } else if (response.data?.milkmen && Array.isArray(response.data.milkmen)) {
// //         distributorData = response.data.milkmen;
// //         console.log('✅ Found data in response.data.milkmen');
// //       } else {
// //         console.log('❌ No array found in response. Response structure:', typeof response.data, Object.keys(response.data || {}));
// //         distributorData = [];
// //       }

// //       console.log('📋 Raw distributor count:', distributorData.length);
      
// //       if (distributorData.length > 0) {
// //         console.log('🔍 First distributor item:', JSON.stringify(distributorData[0], null, 2));
        
// //         // Enhanced transformation to handle different API structures
// //         const transformedDistributors = distributorData
// //           .map((item: any, index: number) => {
// //             console.log(`🔄 Processing item ${index}:`, JSON.stringify(item, null, 2));
            
// //             // Handle nested milkman object or direct properties
// //             const milkmanData = item.milkman || item;
// //             const userData = item.user || {};
            
// //             const distributor = {
// //               id: item.id || milkmanData.id || userData.id || index + 1,
// //               full_name: milkmanData.full_name || 
// //                         userData.full_name || 
// //                         item.name ||
// //                         `${userData.first_name || ''} ${userData.last_name || ''}`.trim() ||
// //                         `Distributor ${index + 1}`,
// //               phone_number: milkmanData.phone_number || 
// //                           userData.phone_number || 
// //                           item.contact ||
// //                           userData.contact ||
// //                           'N/A',
// //               email: milkmanData.email || userData.email || item.email || '',
// //               status: item.status || milkmanData.status || 'active',
// //               assigned_customers_count: item.assigned_customers_count || milkmanData.customers_count || 0,
// //             };
            
// //             console.log(`✅ Transformed distributor ${index}:`, distributor);
// //             return distributor;
// //           })
// //           .filter((distributor: Distributor) => {
// //             // Show all distributors, don't filter by status for now
// //             const isValid = distributor.full_name && distributor.full_name !== 'Distributor undefined';
// //             console.log(`🔍 Distributor ${distributor.full_name} - Valid: ${isValid}`);
// //             return isValid;
// //           });
        
// //         setDistributors(transformedDistributors);
// //         setFilteredDistributors(transformedDistributors);
// //         console.log('✅ Final distributors set:', transformedDistributors.length, transformedDistributors);
// //       } else {
// //         console.log('❌ No distributor data found in response');
// //         setDistributors([]);
// //         setFilteredDistributors([]);
// //       }

// //     } catch (err: any) {
// //       console.error('❌ Error fetching distributors:', err);
// //       console.error('❌ Error response:', err.response?.data);
      
// //       let errorMessage = 'Failed to load distributors.';
      
// //       if (err.response?.status === 500) {
// //         errorMessage = 'Server error. Please try again later.';
// //       } else if (err.response?.status === 401) {
// //         errorMessage = 'Authentication failed. Please log in again.';
// //       } else if (err.response?.status === 404) {
// //         errorMessage = 'No distributors found for this vendor.';
// //       } else if (err.message) {
// //         errorMessage = err.message;
// //       }

// //       setError(errorMessage);
// //       setDistributors([]);
// //       setFilteredDistributors([]);
// //     }

// //     setLoading(false);
// //     setRefreshing(false);
// //   }, [user?.userID]);

// //   useEffect(() => {
// //     fetchDistributors();
// //   }, [fetchDistributors]);

// //   const onRefresh = useCallback(() => {
// //     setRefreshing(true);
// //     fetchDistributors();
// //   }, [fetchDistributors]);

// //   // Search functionality
// //   useEffect(() => {
// //     if (searchQuery.trim() === '') {
// //       setFilteredDistributors(distributors);
// //     } else {
// //       const filtered = distributors.filter(distributor =>
// //         distributor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //         distributor.phone_number.includes(searchQuery) ||
// //         distributor.email?.toLowerCase().includes(searchQuery.toLowerCase())
// //       );
// //       setFilteredDistributors(filtered);
// //     }
// //   }, [searchQuery, distributors]);

// //   const handleAssignDistributor = useCallback(async (distributorId: number) => {
// //     if (processing) return;
    
// //     setSelectedDistributorId(distributorId);
// //     setProcessing(true);

// //     try {
// //       console.log('🔄 Assigning consumer to distributor:', {
// //         customer_id: consumer.user_id,
// //         milkman_id: distributorId,
// //       });

// //       const response = await assignConsumerToDistributor({
// //         customer_id: consumer.user_id,
// //         milkman_id: distributorId,
// //       });

// //       console.log('✅ Assignment API success:', response.data);

// //       const selectedDistributor = distributors.find(d => d.id === distributorId);
      
// //       Alert.alert(
// //         'Assignment Successful',
// //         `Consumer ${getConsumerName()} has been successfully assigned to ${selectedDistributor?.full_name || 'the distributor'}.`,
// //         [
// //           {
// //             text: 'OK',
// //             onPress: () => {
// //               navigation.navigate('PendingRequests' as never);
// //             },
// //           },
// //         ]
// //       );

// //     } catch (err: any) {
// //       console.error('❌ Error assigning consumer to distributor:', err);
// //       console.error('❌ Assignment error response:', err.response?.data);
      
// //       let errorMessage = 'Failed to assign consumer to distributor.';
      
// //       if (err.response?.status === 400) {
// //         errorMessage = err.response?.data?.detail || 
// //                       err.response?.data?.message || 
// //                       'Invalid assignment data. Please try again.';
// //       } else if (err.response?.status === 409) {
// //         errorMessage = 'Consumer is already assigned to a distributor.';
// //       } else if (err.response?.status === 404) {
// //         errorMessage = 'Consumer or distributor not found.';
// //       } else if (err.response?.status === 500) {
// //         errorMessage = 'Server error. Please try again later.';
// //       } else if (err.response?.data?.detail) {
// //         errorMessage = err.response.data.detail;
// //       } else if (err.message) {
// //         errorMessage = err.message;
// //       }
      
// //       Alert.alert('Assignment Failed', errorMessage);
// //       setSelectedDistributorId(null);
// //     } finally {
// //       setProcessing(false);
// //     }
// //   }, [processing, consumer, distributors, navigation, getConsumerName]);

// //   const renderDistributorItem = ({ item }: { item: Distributor }) => {
// //     const isSelected = selectedDistributorId === item.id;
// //     const isProcessing = processing && selectedDistributorId === item.id;
    
// //     return (
// //       <TouchableOpacity
// //         style={[styles.distributorItem, isSelected && styles.selectedItem]}
// //         onPress={() => handleAssignDistributor(item.id)}
// //         disabled={processing}
// //       >
// //         <View style={styles.distributorContent}>
// //           <View style={styles.avatarContainer}>
// //             <View style={styles.avatar}>
// //               <Ionicons name="business" size={24} color="#fff" />
// //             </View>
// //           </View>

// //           <View style={styles.contentSection}>
// //             <Text style={styles.name}>{item.full_name}</Text>
// //             <Text style={styles.contact}>{item.phone_number}</Text>
// //             {item.email && <Text style={styles.email}>{item.email}</Text>}
// //             <Text style={styles.status}>{item.status?.toUpperCase()}</Text>
// //             {item.assigned_customers_count !== undefined && item.assigned_customers_count > 0 && (
// //               <Text style={styles.customerCount}>
// //                 {item.assigned_customers_count} customers assigned
// //               </Text>
// //             )}
// //           </View>

// //           <View style={styles.actionContainer}>
// //             {isProcessing ? (
// //               <ActivityIndicator color="#007AFF" size="small" />
// //             ) : (
// //               <Ionicons 
// //                 name={isSelected ? "checkmark-circle" : "add-circle-outline"} 
// //                 size={24} 
// //                 color={isSelected ? "#34C759" : "#007AFF"} 
// //               />
// //             )}
// //           </View>
// //         </View>
// //       </TouchableOpacity>
// //     );
// //   };

// //   if (!isAuthenticated || !user?.userID) {
// //     return (
// //       <View style={styles.centerContainer}>
// //         <ActivityIndicator size="large" color="#007AFF" />
// //         <Text style={styles.loadingText}>Loading assignment screen...</Text>
// //       </View>
// //     );
// //   }

// //   return (
// //     <View style={styles.container}>
// //       {/* Header */}
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
// //           <Ionicons name="arrow-back" size={24} color="#007AFF" />
// //         </TouchableOpacity>
// //         <View style={styles.headerContent}>
// //           <Text style={styles.headerTitle}>Assign Distributor</Text>
// //           <Text style={styles.headerSubtitle}>For: {getConsumerName()}</Text>
// //         </View>
// //       </View>

// //       {/* Consumer Info */}
// //       <View style={styles.consumerCard}>
// //         <Text style={styles.consumerName}>{getConsumerName()}</Text>
// //         <Text style={styles.consumerContact}>{consumer.user_contact}</Text>
// //         <Text style={styles.assignmentNote}>Select a distributor to assign this consumer</Text>
// //       </View>

// //       {/* Search Bar */}
// //       <View style={styles.searchContainer}>
// //         <TextInput
// //           style={styles.searchInput}
// //           placeholder="Search distributors..."
// //           value={searchQuery}
// //           onChangeText={setSearchQuery}
// //           placeholderTextColor="#8E8E93"
// //         />
// //       </View>

// //       {/* Error Banner */}
// //       {error && (
// //         <View style={styles.errorBanner}>
// //           <Text style={styles.errorText}>{error}</Text>
// //           <TouchableOpacity onPress={fetchDistributors} style={styles.retryButton}>
// //             <Text style={styles.retryButtonText}>Retry</Text>
// //           </TouchableOpacity>
// //         </View>
// //       )}

// //       {/* Debug Info */}
// //       {__DEV__ && (
// //         <View style={styles.debugInfo}>
// //           <Text style={styles.debugText}>
// //             Debug: {distributors.length} distributors found
// //           </Text>
// //         </View>
// //       )}

// //       {/* Content */}
// //       {loading ? (
// //         <View style={styles.centerContainer}>
// //           <ActivityIndicator size="large" color="#007AFF" />
// //           <Text>Loading distributors...</Text>
// //         </View>
// //       ) : (
// //         <FlatList
// //           data={filteredDistributors}
// //           keyExtractor={(item, index) => `distributor_${item.id || index}`}
// //           renderItem={renderDistributorItem}
// //           contentContainerStyle={styles.listContainer}
// //           refreshControl={
// //             <RefreshControl
// //               refreshing={refreshing}
// //               onRefresh={onRefresh}
// //               colors={['#007AFF']}
// //               tintColor="#007AFF"
// //             />
// //           }
// //           ListEmptyComponent={() => (
// //             <View style={styles.emptyContainer}>
// //               <Ionicons name="business-outline" size={80} color="#E5E5EA" />
// //               <Text style={styles.emptyTitle}>No Distributors Found</Text>
// //               <Text style={styles.emptyText}>
// //                 {searchQuery 
// //                   ? `No distributors match "${searchQuery}".`
// //                   : 'No active distributors available for assignment. Please ensure you have accepted distributors in your system.'
// //                 }
// //               </Text>
// //               <TouchableOpacity onPress={fetchDistributors} style={styles.refreshButton}>
// //                 <Ionicons name="refresh-outline" size={20} color="#fff" />
// //                 <Text style={styles.refreshButtonText}>Refresh</Text>
// //               </TouchableOpacity>
// //             </View>
// //           )}
// //         />
// //       )}
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#F2F2F7',
// //   },

// //   // Header
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingVertical: 16,
// //     paddingHorizontal: 20,
// //     paddingTop: Platform.OS === 'ios' ? 50 : 20,
// //     backgroundColor: '#fff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#E5E5EA',
// //     elevation: 2,
// //   },
// //   backButton: {
// //     width: 40,
// //     height: 40,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 16,
// //   },
// //   headerContent: {
// //     flex: 1,
// //   },
// //   headerTitle: {
// //     fontSize: 22,
// //     fontWeight: 'bold',
// //     color: '#1C1C1E',
// //   },
// //   headerSubtitle: {
// //     fontSize: 14,
// //     color: '#8E8E93',
// //     marginTop: 2,
// //   },

// //   // Consumer Info
// //   consumerCard: {
// //     backgroundColor: '#fff',
// //     marginHorizontal: 20,
// //     marginTop: 20,
// //     borderRadius: 16,
// //     padding: 16,
// //     elevation: 1,
// //   },
// //   consumerName: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     color: '#1C1C1E',
// //   },
// //   consumerContact: {
// //     fontSize: 14,
// //     color: '#007AFF',
// //     marginTop: 4,
// //   },
// //   assignmentNote: {
// //     fontSize: 14,
// //     color: '#8E8E93',
// //     fontStyle: 'italic',
// //     marginTop: 8,
// //   },

// //   // Search
// //   searchContainer: {
// //     paddingHorizontal: 20,
// //     paddingVertical: 16,
// //   },
// //   searchInput: {
// //     backgroundColor: '#fff',
// //     borderRadius: 12,
// //     paddingHorizontal: 16,
// //     paddingVertical: 12,
// //     fontSize: 16,
// //     color: '#1C1C1E',
// //     borderWidth: 1,
// //     borderColor: '#E5E5EA',
// //     elevation: 1,
// //   },

// //   // Error
// //   errorBanner: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#FFEBEB',
// //     padding: 16,
// //     marginHorizontal: 20,
// //     marginBottom: 16,
// //     borderRadius: 12,
// //     justifyContent: 'space-between',
// //   },
// //   errorText: {
// //     color: '#FF3B30',
// //     fontSize: 14,
// //     flex: 1,
// //     fontWeight: '500',
// //   },
// //   retryButton: {
// //     backgroundColor: '#FF3B30',
// //     paddingHorizontal: 16,
// //     paddingVertical: 8,
// //     borderRadius: 8,
// //   },
// //   retryButtonText: {
// //     color: '#fff',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //   },

// //   // Debug Info
// //   debugInfo: {
// //     backgroundColor: '#FFF3CD',
// //     padding: 8,
// //     marginHorizontal: 20,
// //     marginBottom: 10,
// //     borderRadius: 8,
// //   },
// //   debugText: {
// //     fontSize: 12,
// //     color: '#856404',
// //     textAlign: 'center',
// //   },

// //   // Loading
// //   centerContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingHorizontal: 20,
// //   },
// //   loadingText: {
// //     marginTop: 12,
// //     color: '#8E8E93',
// //     fontSize: 16,
// //   },

// //   // List
// //   listContainer: {
// //     paddingBottom: 40,
// //   },

// //   // Distributor Item
// //   distributorItem: {
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     marginHorizontal: 20,
// //     marginBottom: 12,
// //     borderWidth: 2,
// //     borderColor: 'transparent',
// //     elevation: 2,
// //   },
// //   selectedItem: {
// //     borderColor: '#34C759',
// //     backgroundColor: '#F0FFF4',
// //   },
// //   distributorContent: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 20,
// //   },

// //   // Avatar
// //   avatarContainer: {
// //     marginRight: 16,
// //   },
// //   avatar: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     backgroundColor: '#FF9500',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },

// //   // Content
// //   contentSection: {
// //     flex: 1,
// //   },
// //   name: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#1C1C1E',
// //     marginBottom: 4,
// //   },
// //   contact: {
// //     fontSize: 14,
// //     color: '#007AFF',
// //     marginBottom: 2,
// //   },
// //   email: {
// //     fontSize: 14,
// //     color: '#8E8E93',
// //     marginBottom: 2,
// //   },
// //   status: {
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //     color: '#34C759',
// //     marginTop: 4,
// //   },
// //   customerCount: {
// //     fontSize: 12,
// //     color: '#8E8E93',
// //     marginTop: 2,
// //   },

// //   // Action
// //   actionContainer: {
// //     marginLeft: 16,
// //     alignItems: 'center',
// //   },

// //   // Empty State
// //   emptyContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingHorizontal: 40,
// //     paddingTop: 100,
// //   },
// //   emptyTitle: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: '#1C1C1E',
// //     marginBottom: 12,
// //     textAlign: 'center',
// //     marginTop: 20,
// //   },
// //   emptyText: {
// //     fontSize: 16,
// //     color: '#8E8E93',
// //     textAlign: 'center',
// //     lineHeight: 22,
// //     marginBottom: 32,
// //   },
// //   refreshButton: {
// //     backgroundColor: '#007AFF',
// //     borderRadius: 12,
// //     paddingHorizontal: 24,
// //     paddingVertical: 12,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //   },
// //   refreshButtonText: {
// //     color: '#fff',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// // });

// // export default AssignDistributorScreen;
// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   Alert,
//   RefreshControl,
//   BackHandler,
//   Platform,
//   TextInput,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { useSelector } from 'react-redux';
// import { RootState } from '../../store/index';
// import {
//   getAcceptedMilkmen,
//   assignConsumerToDistributor,
// } from '../../apiServices/allApi';

// type Distributor = {
//   id: number;
//   full_name: string;
//   phone_number: string;
//   email?: string;
//   status: string;
//   assigned_customers_count?: number;
// };

// type Consumer = {
//   id: number;
//   user_id: number;
//   status: string;
//   customer?: {
//     id: number;
//     first_name: string;
//     last_name: string;
//   };
//   name?: string | null;
//   user_contact: string;
//   user_type: 'customer' | 'milkman';
//   vendor: number;
// };

// type RouteParams = {
//   AssignDistributor: {
//     consumer: Consumer;
//   };
// };

// type AssignDistributorRouteProp = RouteProp<RouteParams, 'AssignDistributor'>;

// const AssignDistributorScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute<AssignDistributorRouteProp>();
//   const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

//   const { consumer } = route.params;

//   const [distributors, setDistributors] = useState<Distributor[]>([]);
//   const [filteredDistributors, setFilteredDistributors] = useState<Distributor[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [processing, setProcessing] = useState<boolean>(false);
//   const [selectedDistributorId, setSelectedDistributorId] = useState<number | null>(null);
//   const [refreshing, setRefreshing] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState<string>('');

//   const handleGoBack = useCallback(() => {
//     if (navigation.canGoBack()) {
//       navigation.goBack();
//     } else {
//       navigation.navigate('PendingRequests' as never);
//     }
//   }, [navigation]);

//   useEffect(() => {
//     const backAction = () => {
//       handleGoBack();
//       return true;
//     };

//     const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
//     return () => backHandler.remove();
//   }, [handleGoBack]);

//   // Debug consumer object on load
//   useEffect(() => {
//     console.log('🔍 Consumer object on screen load:', JSON.stringify(consumer, null, 2));
//     console.log('🔍 Available consumer fields:', Object.keys(consumer));
//     console.log('🔍 consumer.id:', consumer.id);
//     console.log('🔍 consumer.user_id:', consumer.user_id);
//     console.log('🔍 consumer.customer:', consumer.customer);
//     console.log('🔍 consumer.customer?.id:', consumer.customer?.id);
//   }, [consumer]);

//   const getConsumerName = useCallback(() => {
//     if (consumer.customer) {
//       const firstName = consumer.customer.first_name || '';
//       const lastName = consumer.customer.last_name || '';
//       return `${firstName} ${lastName}`.trim();
//     }
//     return consumer.name || 'Unknown Consumer';
//   }, [consumer]);

//   const fetchDistributors = useCallback(async () => {
//     setError(null);
//     setLoading(true);

//     try {
//       const vendorId = user?.userID;

//       if (!vendorId) {
//         throw new Error('Vendor ID not found. Please log in again.');
//       }

//       console.log('🔍 Fetching distributors for vendor ID:', vendorId);

//       const response = await getAcceptedMilkmen(vendorId);
//       console.log('📦 Full API Response:', JSON.stringify(response.data, null, 2));

//       // Try multiple data extraction paths
//       let distributorData = [];
      
//       // Check various possible response structures
//       if (response.data?.data && Array.isArray(response.data.data)) {
//         distributorData = response.data.data;
//         console.log('✅ Found data in response.data.data');
//       } else if (Array.isArray(response.data)) {
//         distributorData = response.data;
//         console.log('✅ Found data in response.data');
//       } else if (response.data?.results && Array.isArray(response.data.results)) {
//         distributorData = response.data.results;
//         console.log('✅ Found data in response.data.results');
//       } else if (response.data?.milkmen && Array.isArray(response.data.milkmen)) {
//         distributorData = response.data.milkmen;
//         console.log('✅ Found data in response.data.milkmen');
//       } else {
//         console.log('❌ No array found in response. Response structure:', typeof response.data, Object.keys(response.data || {}));
//         distributorData = [];
//       }

//       console.log('📋 Raw distributor count:', distributorData.length);
      
//       if (distributorData.length > 0) {
//         console.log('🔍 First distributor item:', JSON.stringify(distributorData[0], null, 2));
        
//         // Enhanced transformation to handle different API structures
//         const transformedDistributors = distributorData
//           .map((item: any, index: number) => {
//             console.log(`🔄 Processing item ${index}:`, JSON.stringify(item, null, 2));
            
//             // Handle nested milkman object or direct properties
//             const milkmanData = item.milkman || item;
//             const userData = item.user || {};
            
//             const distributor = {
//               id: item.id || milkmanData.id || userData.id || index + 1,
//               full_name: milkmanData.full_name || 
//                         userData.full_name || 
//                         item.name ||
//                         `${userData.first_name || ''} ${userData.last_name || ''}`.trim() ||
//                         `Distributor ${index + 1}`,
//               phone_number: milkmanData.phone_number || 
//                           userData.phone_number || 
//                           item.contact ||
//                           userData.contact ||
//                           'N/A',
//               email: milkmanData.email || userData.email || item.email || '',
//               status: item.status || milkmanData.status || 'active',
//               assigned_customers_count: item.assigned_customers_count || milkmanData.customers_count || 0,
//             };
            
//             console.log(`✅ Transformed distributor ${index}:`, distributor);
//             return distributor;
//           })
//           .filter((distributor: Distributor) => {
//             // Show all distributors, don't filter by status for now
//             const isValid = distributor.full_name && distributor.full_name !== 'Distributor undefined';
//             console.log(`🔍 Distributor ${distributor.full_name} - Valid: ${isValid}`);
//             return isValid;
//           });
        
//         setDistributors(transformedDistributors);
//         setFilteredDistributors(transformedDistributors);
//         console.log('✅ Final distributors set:', transformedDistributors.length, transformedDistributors);
//       } else {
//         console.log('❌ No distributor data found in response');
//         setDistributors([]);
//         setFilteredDistributors([]);
//       }

//     } catch (err: any) {
//       console.error('❌ Error fetching distributors:', err);
//       console.error('❌ Error response:', err.response?.data);
      
//       let errorMessage = 'Failed to load distributors.';
      
//       if (err.response?.status === 500) {
//         errorMessage = 'Server error. Please try again later.';
//       } else if (err.response?.status === 401) {
//         errorMessage = 'Authentication failed. Please log in again.';
//       } else if (err.response?.status === 404) {
//         errorMessage = 'No distributors found for this vendor.';
//       } else if (err.message) {
//         errorMessage = err.message;
//       }

//       setError(errorMessage);
//       setDistributors([]);
//       setFilteredDistributors([]);
//     }

//     setLoading(false);
//     setRefreshing(false);
//   }, [user?.userID]);

//   useEffect(() => {
//     fetchDistributors();
//   }, [fetchDistributors]);

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     fetchDistributors();
//   }, [fetchDistributors]);

//   // Search functionality
//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredDistributors(distributors);
//     } else {
//       const filtered = distributors.filter(distributor =>
//         distributor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         distributor.phone_number.includes(searchQuery) ||
//         distributor.email?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredDistributors(filtered);
//     }
//   }, [searchQuery, distributors]);

//   const handleAssignDistributor = useCallback(async (distributorId: number) => {
//     if (processing) return;
    
//     setSelectedDistributorId(distributorId);
//     setProcessing(true);

//     try {
//       // Debug the consumer object first
//       console.log('🔍 Full consumer object:', JSON.stringify(consumer, null, 2));
      
//       // Try multiple ways to get the customer ID
//       let customerId;
      
//       if (consumer.customer?.id) {
//         customerId = consumer.customer.id;
//         console.log('✅ Using consumer.customer.id:', customerId);
//       } else if (consumer.user_id) {
//         customerId = consumer.user_id;
//         console.log('✅ Using consumer.user_id:', customerId);
//       } else if (consumer.id) {
//         customerId = consumer.id;
//         console.log('✅ Using consumer.id:', customerId);
//       } else {
//         console.log('❌ No valid customer ID found in consumer object');
//         Alert.alert('Error', 'Customer ID not found. Please try again.');
//         setSelectedDistributorId(null);
//         setProcessing(false);
//         return;
//       }

//       console.log('🔄 Assigning consumer to distributor:', {
//         customer_id: customerId,
//         milkman_id: distributorId,
//       });

//       const response = await assignConsumerToDistributor({
//         customer_id: customerId,
//         milkman_id: distributorId,
//       });

//       console.log('✅ Assignment API success:', response.data);

//       const selectedDistributor = distributors.find(d => d.id === distributorId);
      
//       Alert.alert(
//         'Assignment Successful',
//         `Consumer ${getConsumerName()} has been successfully assigned to ${selectedDistributor?.full_name || 'the distributor'}.`,
//         [
//           {
//             text: 'OK',
//             onPress: () => {
//               navigation.navigate('PendingRequests' as never);
//             },
//           },
//         ]
//       );

//     } catch (err: any) {
//       console.error('❌ Error assigning consumer to distributor:', err);
//       console.error('❌ Assignment error response:', err.response?.data);
      
//       let errorMessage = 'Failed to assign consumer to distributor.';
      
//       if (err.response?.data?.message === 'Customer not found.') {
//         errorMessage = 'Customer not found. The customer may have been deleted or the ID is incorrect.';
//       } else if (err.response?.status === 400) {
//         errorMessage = err.response?.data?.detail || 
//                       err.response?.data?.message || 
//                       'Invalid assignment data. Please try again.';
//       } else if (err.response?.status === 409) {
//         errorMessage = 'Consumer is already assigned to a distributor.';
//       } else if (err.response?.status === 404) {
//         errorMessage = err.response?.data?.message || 'Consumer or distributor not found.';
//       } else if (err.response?.status === 500) {
//         errorMessage = 'Server error. Please try again later.';
//       } else if (err.response?.data?.detail) {
//         errorMessage = err.response.data.detail;
//       } else if (err.message) {
//         errorMessage = err.message;
//       }
      
//       Alert.alert('Assignment Failed', errorMessage);
//       setSelectedDistributorId(null);
//     } finally {
//       setProcessing(false);
//     }
//   }, [processing, consumer, distributors, navigation, getConsumerName]);

//   const renderDistributorItem = ({ item }: { item: Distributor }) => {
//     const isSelected = selectedDistributorId === item.id;
//     const isProcessing = processing && selectedDistributorId === item.id;
    
//     return (
//       <TouchableOpacity
//         style={[styles.distributorItem, isSelected && styles.selectedItem]}
//         onPress={() => handleAssignDistributor(item.id)}
//         disabled={processing}
//       >
//         <View style={styles.distributorContent}>
//           <View style={styles.avatarContainer}>
//             <View style={styles.avatar}>
//               <Ionicons name="business" size={24} color="#fff" />
//             </View>
//           </View>

//           <View style={styles.contentSection}>
//             <Text style={styles.name}>{item.full_name}</Text>
//             <Text style={styles.contact}>{item.phone_number}</Text>
//             {item.email && <Text style={styles.email}>{item.email}</Text>}
//             <Text style={styles.status}>{item.status?.toUpperCase()}</Text>
//             {item.assigned_customers_count !== undefined && item.assigned_customers_count > 0 && (
//               <Text style={styles.customerCount}>
//                 {item.assigned_customers_count} customers assigned
//               </Text>
//             )}
//           </View>

//           <View style={styles.actionContainer}>
//             {isProcessing ? (
//               <ActivityIndicator color="#007AFF" size="small" />
//             ) : (
//               <Ionicons 
//                 name={isSelected ? "checkmark-circle" : "add-circle-outline"} 
//                 size={24} 
//                 color={isSelected ? "#34C759" : "#007AFF"} 
//               />
//             )}
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   if (!isAuthenticated || !user?.userID) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#007AFF" />
//         <Text style={styles.loadingText}>Loading assignment screen...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={24} color="#007AFF" />
//         </TouchableOpacity>
//         <View style={styles.headerContent}>
//           <Text style={styles.headerTitle}>Assign Distributor</Text>
//           <Text style={styles.headerSubtitle}>For: {getConsumerName()}</Text>
//         </View>
//       </View>

//       {/* Consumer Info */}
//       <View style={styles.consumerCard}>
//         <Text style={styles.consumerName}>{getConsumerName()}</Text>
//         <Text style={styles.consumerContact}>{consumer.user_contact}</Text>
//         <Text style={styles.assignmentNote}>Select a distributor to assign this consumer</Text>
//       </View>

//       {/* Search Bar */}
//       <View style={styles.searchContainer}>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search distributors..."
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//           placeholderTextColor="#8E8E93"
//         />
//       </View>

//       {/* Error Banner */}
//       {error && (
//         <View style={styles.errorBanner}>
//           <Text style={styles.errorText}>{error}</Text>
//           <TouchableOpacity onPress={fetchDistributors} style={styles.retryButton}>
//             <Text style={styles.retryButtonText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* Debug Info */}
//       {__DEV__ && (
//         <View style={styles.debugInfo}>
//           <Text style={styles.debugText}>
//             Debug: {distributors.length} distributors | Customer ID: {consumer.customer?.id || consumer.user_id || consumer.id || 'NOT FOUND'}
//           </Text>
//         </View>
//       )}

//       {/* Content */}
//       {loading ? (
//         <View style={styles.centerContainer}>
//           <ActivityIndicator size="large" color="#007AFF" />
//           <Text>Loading distributors...</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredDistributors}
//           keyExtractor={(item, index) => `distributor_${item.id || index}`}
//           renderItem={renderDistributorItem}
//           contentContainerStyle={styles.listContainer}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               colors={['#007AFF']}
//               tintColor="#007AFF"
//             />
//           }
//           ListEmptyComponent={() => (
//             <View style={styles.emptyContainer}>
//               <Ionicons name="business-outline" size={80} color="#E5E5EA" />
//               <Text style={styles.emptyTitle}>No Distributors Found</Text>
//               <Text style={styles.emptyText}>
//                 {searchQuery 
//                   ? `No distributors match "${searchQuery}".`
//                   : 'No active distributors available for assignment. Please ensure you have accepted distributors in your system.'
//                 }
//               </Text>
//               <TouchableOpacity onPress={fetchDistributors} style={styles.refreshButton}>
//                 <Ionicons name="refresh-outline" size={20} color="#fff" />
//                 <Text style={styles.refreshButtonText}>Refresh</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F2F2F7',
//   },

//   // Header
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 20,
//     paddingTop: Platform.OS === 'ios' ? 50 : 20,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E5EA',
//     elevation: 2,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   headerContent: {
//     flex: 1,
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#1C1C1E',
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     color: '#8E8E93',
//     marginTop: 2,
//   },

//   // Consumer Info
//   consumerCard: {
//     backgroundColor: '#fff',
//     marginHorizontal: 20,
//     marginTop: 20,
//     borderRadius: 16,
//     padding: 16,
//     elevation: 1,
//   },
//   consumerName: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1C1C1E',
//   },
//   consumerContact: {
//     fontSize: 14,
//     color: '#007AFF',
//     marginTop: 4,
//   },
//   assignmentNote: {
//     fontSize: 14,
//     color: '#8E8E93',
//     fontStyle: 'italic',
//     marginTop: 8,
//   },

//   // Search
//   searchContainer: {
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//   },
//   searchInput: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: '#1C1C1E',
//     borderWidth: 1,
//     borderColor: '#E5E5EA',
//     elevation: 1,
//   },

//   // Error
//   errorBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFEBEB',
//     padding: 16,
//     marginHorizontal: 20,
//     marginBottom: 16,
//     borderRadius: 12,
//     justifyContent: 'space-between',
//   },
//   errorText: {
//     color: '#FF3B30',
//     fontSize: 14,
//     flex: 1,
//     fontWeight: '500',
//   },
//   retryButton: {
//     backgroundColor: '#FF3B30',
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },

//   // Debug Info
//   debugInfo: {
//     backgroundColor: '#FFF3CD',
//     padding: 8,
//     marginHorizontal: 20,
//     marginBottom: 10,
//     borderRadius: 8,
//   },
//   debugText: {
//     fontSize: 12,
//     color: '#856404',
//     textAlign: 'center',
//   },

//   // Loading
//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   loadingText: {
//     marginTop: 12,
//     color: '#8E8E93',
//     fontSize: 16,
//   },

//   // List
//   listContainer: {
//     paddingBottom: 40,
//   },

//   // Distributor Item
//   distributorItem: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     marginHorizontal: 20,
//     marginBottom: 12,
//     borderWidth: 2,
//     borderColor: 'transparent',
//     elevation: 2,
//   },
//   selectedItem: {
//     borderColor: '#34C759',
//     backgroundColor: '#F0FFF4',
//   },
//   distributorContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 20,
//   },

//   // Avatar
//   avatarContainer: {
//     marginRight: 16,
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#FF9500',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   // Content
//   contentSection: {
//     flex: 1,
//   },
//   name: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1C1C1E',
//     marginBottom: 4,
//   },
//   contact: {
//     fontSize: 14,
//     color: '#007AFF',
//     marginBottom: 2,
//   },
//   email: {
//     fontSize: 14,
//     color: '#8E8E93',
//     marginBottom: 2,
//   },
//   status: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#34C759',
//     marginTop: 4,
//   },
//   customerCount: {
//     fontSize: 12,
//     color: '#8E8E93',
//     marginTop: 2,
//   },

//   // Action
//   actionContainer: {
//     marginLeft: 16,
//     alignItems: 'center',
//   },

//   // Empty State
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 40,
//     paddingTop: 100,
//   },
//   emptyTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1C1C1E',
//     marginBottom: 12,
//     textAlign: 'center',
//     marginTop: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#8E8E93',
//     textAlign: 'center',
//     lineHeight: 22,
//     marginBottom: 32,
//   },
//   refreshButton: {
//     backgroundColor: '#007AFF',
//     borderRadius: 12,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   refreshButtonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default AssignDistributorScreen;

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  RefreshControl,
  BackHandler,
  Platform,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index';
import {
  getAcceptedMilkmen,
  assignConsumerToDistributor,
} from '../../apiServices/allApi';

type Distributor = {
  id: number;
  full_name: string;
  phone_number: string;
  email?: string;
  status: string;
  assigned_customers_count?: number;
};

type Consumer = {
  id: number;
  name: string;
  vendor: number;
  status: string;
  user_type: 'customer' | 'milkman';
  user_contact: string;
  vendor_name: string;
  milk_requirement: {
    cow_milk_litre: number | null;
    buffalo_milk_litre: number | null;
  };
  object_id: number;
};

type RouteParams = {
  AssignDistributor: {
    consumer: Consumer;
  };
};

type AssignDistributorRouteProp = RouteProp<RouteParams, 'AssignDistributor'>;

const AssignDistributorScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<AssignDistributorRouteProp>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const { consumer } = route.params;

  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [filteredDistributors, setFilteredDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [selectedDistributorId, setSelectedDistributorId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('PendingRequests' as never);
    }
  }, [navigation]);

  useEffect(() => {
    const backAction = () => {
      handleGoBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [handleGoBack]);

  const getConsumerName = useCallback(() => {
    return consumer.name || 'Unknown Consumer';
  }, [consumer]);

  const fetchDistributors = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      const vendorId = user?.userID;

      if (!vendorId) {
        throw new Error('Vendor ID not found. Please log in again.');
      }

      const response = await getAcceptedMilkmen(vendorId);
      const data = response.data?.data || response.data || [];

      if (Array.isArray(data) && data.length > 0) {
        const transformedDistributors = data.map((item: any, index: number) => {
          const milkmanData = item.milkman || item;
          return {
            id: milkmanData.id || item.id || index + 1,
            full_name: milkmanData.full_name || item.full_name || `Distributor ${index + 1}`,
            phone_number: milkmanData.phone_number || item.phone_number || 'N/A',
            email: milkmanData.email || item.email || '',
            status: item.status || 'active',
            assigned_customers_count: 0,
          };
        });
        
        setDistributors(transformedDistributors);
        setFilteredDistributors(transformedDistributors);
      } else {
        setDistributors([]);
        setFilteredDistributors([]);
      }

    } catch (err: any) {
      console.error('Error fetching distributors:', err);
      setError('Failed to load distributors.');
      setDistributors([]);
      setFilteredDistributors([]);
    }

    setLoading(false);
    setRefreshing(false);
  }, [user?.userID]);

  useEffect(() => {
    fetchDistributors();
  }, [fetchDistributors]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDistributors();
  }, [fetchDistributors]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDistributors(distributors);
    } else {
      const filtered = distributors.filter(distributor =>
        distributor.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        distributor.phone_number.includes(searchQuery)
      );
      setFilteredDistributors(filtered);
    }
  }, [searchQuery, distributors]);

  const handleAssignDistributor = useCallback(async (distributorId: number) => {
    if (processing) return;
    
    setSelectedDistributorId(distributorId);
    setProcessing(true);

    try {
      // Use object_id as customer_id and distributorId as milkman_id
      const assignmentData = {
        customer_id: consumer.object_id, // This is the actual customer record ID
        milkman_id: distributorId,       // This is the distributor/milkman ID
      };

      console.log('Assigning:', assignmentData);

      const response = await assignConsumerToDistributor(assignmentData);
      
      console.log('Assignment success:', response.data);

      const selectedDistributor = distributors.find(d => d.id === distributorId);
      
      Alert.alert(
        'Success!',
        `${getConsumerName()} has been assigned to ${selectedDistributor?.full_name || 'the distributor'}.`,
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('PendingRequests' as never);
            },
          },
        ]
      );

    } catch (err: any) {
      console.error('Assignment error:', err);
      
      let errorMessage = 'Failed to assign consumer.';
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      Alert.alert('Error', errorMessage);
      setSelectedDistributorId(null);
    } finally {
      setProcessing(false);
    }
  }, [processing, consumer, distributors, navigation, getConsumerName]);

  const renderDistributorItem = ({ item }: { item: Distributor }) => {
    const isSelected = selectedDistributorId === item.id;
    const isProcessing = processing && selectedDistributorId === item.id;
    
    return (
      <TouchableOpacity
        style={[styles.distributorItem, isSelected && styles.selectedItem]}
        onPress={() => handleAssignDistributor(item.id)}
        disabled={processing}
      >
        <View style={styles.distributorContent}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="business" size={24} color="#fff" />
            </View>
          </View>

          <View style={styles.contentSection}>
            <Text style={styles.name}>{item.full_name}</Text>
            <Text style={styles.contact}>{item.phone_number}</Text>
            {item.email && <Text style={styles.email}>{item.email}</Text>}
            <Text style={styles.status}>{item.status?.toUpperCase()}</Text>
          </View>

          <View style={styles.actionContainer}>
            {isProcessing ? (
              <ActivityIndicator color="#007AFF" size="small" />
            ) : (
              <Ionicons 
                name={isSelected ? "checkmark-circle" : "add-circle-outline"} 
                size={24} 
                color={isSelected ? "#34C759" : "#007AFF"} 
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!isAuthenticated || !user?.userID) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Assign Distributor</Text>
          <Text style={styles.headerSubtitle}>For: {getConsumerName()}</Text>
        </View>
      </View>

      {/* Consumer Info */}
      <View style={styles.consumerCard}>
        <Text style={styles.consumerName}>{getConsumerName()}</Text>
        <Text style={styles.consumerContact}>{consumer.user_contact}</Text>
        <Text style={styles.assignmentNote}>Select a distributor to assign this consumer</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search distributors..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#8E8E93"
        />
      </View>

      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={fetchDistributors} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text>Loading distributors...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDistributors}
          keyExtractor={(item, index) => `distributor_${item.id || index}`}
          renderItem={renderDistributorItem}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
              tintColor="#007AFF"
            />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="business-outline" size={80} color="#E5E5EA" />
              <Text style={styles.emptyTitle}>No Distributors Found</Text>
              <Text style={styles.emptyText}>
                {searchQuery 
                  ? `No distributors match "${searchQuery}".`
                  : 'No distributors available for assignment.'
                }
              </Text>
              <TouchableOpacity onPress={fetchDistributors} style={styles.refreshButton}>
                <Ionicons name="refresh-outline" size={20} color="#fff" />
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  consumerCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
  },
  consumerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  consumerContact: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 4,
  },
  assignmentNote: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
    marginTop: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEB',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#8E8E93',
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 40,
  },
  distributorItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedItem: {
    borderColor: '#34C759',
    backgroundColor: '#F0FFF4',
  },
  distributorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentSection: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  contact: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#34C759',
    marginTop: 4,
  },
  actionContainer: {
    marginLeft: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  refreshButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AssignDistributorScreen;
