

// // // export default UserDetailsScreen;
// // import React, { useState, useEffect, useCallback } from 'react';
// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   StyleSheet,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   Platform,
// // } from 'react-native';
// // import Ionicons from 'react-native-vector-icons/Ionicons';
// // import { useRoute, useNavigation } from '@react-navigation/native';
// // import {
// //   getConsumerDetailsById,
// //   getDistributorDetailsById,
// //   getDistributorAssignedConsumers,
// // } from '../../apiServices/allApi';

// // type UserDetailsParams = {
// //   userId: number;
// //   userType: 'consumer' | 'distributor';
// //   userName: string;
// // };

// // type AssignedConsumer = {
// //   id: number;
// //   customer_id: number;
// //   customer_name: string;
// //   customer_contact: string;
// //   status: string;
// // };

// // const UserDetailsScreen = () => {
// //   const route = useRoute();
// //   const navigation = useNavigation();
// //   const params = route.params as UserDetailsParams;

// //   const [userData, setUserData] = useState<any>(null);
// //   const [assignedConsumers, setAssignedConsumers] = useState<AssignedConsumer[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [loadingConsumers, setLoadingConsumers] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

// //   const fetchAssignedConsumers = useCallback(async () => {
// //     setLoadingConsumers(true);
// //     try {
// //       const response = await getDistributorAssignedConsumers(params.userId);
// //       console.log('Assigned consumers response:', JSON.stringify(response.data, null, 2));

// //       const consumers = response?.data?.data || response?.data || [];
// //       setAssignedConsumers(Array.isArray(consumers) ? consumers : []);
// //     } catch (err: any) {
// //       console.error('Error fetching assigned consumers:', err);
// //       setAssignedConsumers([]);
// //     } finally {
// //       setLoadingConsumers(false);
// //     }
// //   }, [params.userId]);

// //   const fetchUserDetails = useCallback(async () => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       let response;
// //       if (params.userType === 'consumer') {
// //         response = await getConsumerDetailsById(params.userId);
// //       } else {
// //         response = await getDistributorDetailsById(params.userId);
// //       }

// //       const data = response?.data?.data || response?.data;
// //       console.log('User details response:', JSON.stringify(data, null, 2));
// //       setUserData(data);

// //       // If distributor, fetch assigned consumers
// //       if (params.userType === 'distributor') {
// //         fetchAssignedConsumers();
// //       }
// //     } catch (err: any) {
// //       console.error('Error fetching user details:', err);
// //       setError(err?.message || 'Failed to load user details');
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, [params.userId, params.userType, fetchAssignedConsumers]);

// //   useEffect(() => {
// //     fetchUserDetails();
// //   }, [fetchUserDetails]);

// //   const getInitials = (name: string) => {
// //     if (!name) {return 'U';}
// //     const parts = name.split(' ');
// //     if (parts.length >= 2) {
// //       return (parts[0][0] + parts[1][0]).toUpperCase();
// //     }
// //     return name[0].toUpperCase();
// //   };

// //   const formatAddress = () => {
// //     if (!userData) {return 'No address provided';}

// //     const parts = [
// //       userData.flat_house,
// //       userData.society_name || userData.society_area,
// //       userData.village,
// //       userData.tal,
// //       userData.dist,
// //       userData.state,
// //       userData.pincode,
// //     ].filter(Boolean);

// //     return parts.join(', ') || 'No address provided';
// //   };

// //   if (loading) {
// //     return (
// //       <View style={styles.centered}>
// //         <ActivityIndicator size="large" color="#007AFF" />
// //         <Text style={styles.loadingText}>Loading details...</Text>
// //       </View>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <View style={styles.centered}>
// //         <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
// //         <Text style={styles.errorText}>{error}</Text>
// //         <TouchableOpacity onPress={fetchUserDetails} style={styles.retryButton}>
// //           <Text style={styles.retryButtonText}>Try Again</Text>
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   }

// //   const phoneNumber = userData?.phone_number ||
// //                      userData?.contact ||
// //                      userData?.phone ||
// //                      userData?.mobile ||
// //                      'Not provided';

// //   const email = userData?.email ||
// //                 userData?.email_address ||
// //                 userData?.user_email ||
// //                 'Not provided';

// //   const fullName = params.userName ||
// //                    userData?.full_name ||
// //                    userData?.name ||
// //                    (userData?.first_name && userData?.last_name
// //                      ? `${userData.first_name} ${userData.last_name}`
// //                      : 'Unknown User');

// //   const hasEmail = userData?.email || userData?.email_address || userData?.user_email;

// //   return (
// //     <View style={styles.container}>
// //       {/* Header */}
// //       <View style={styles.header}>
// //         <TouchableOpacity
// //           onPress={() => navigation.goBack()}
// //           style={styles.backButton}
// //         >
// //           <Ionicons name="arrow-back" size={24} color="#fff" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>
// //           {params.userType === 'consumer' ? 'Consumer Details' : 'Distributor Details'}
// //         </Text>
// //         <View style={styles.placeholder} />
// //       </View>

// //       <ScrollView showsVerticalScrollIndicator={false}>
// //         {/* Profile Section */}
// //         <View style={styles.profileSection}>
// //           <View style={styles.avatarContainer}>
// //             <View style={styles.avatarLarge}>
// //               <Text style={styles.avatarLargeText}>{getInitials(fullName)}</Text>
// //             </View>
// //           </View>
// //           <Text style={styles.userName}>{fullName}</Text>
// //           <View style={styles.userTypeBadge}>
// //             <Text style={styles.userTypeText}>
// //               {params.userType === 'consumer' ? 'Consumer' : 'Distributor'}
// //             </Text>
// //           </View>
// //         </View>

// //         {/* Contact Information */}
// //         <View style={styles.section}>
// //           <Text style={styles.sectionTitle}>Contact Information</Text>

// //           <View style={styles.infoCard}>
// //             <View style={styles.infoRow}>
// //               <View style={styles.infoIcon}>
// //                 <Ionicons name="call-outline" size={20} color="#007AFF" />
// //               </View>
// //               <View style={styles.infoContent}>
// //                 <Text style={styles.infoLabel}>Phone Number</Text>
// //                 <Text style={styles.infoValue}>{phoneNumber}</Text>
// //               </View>
// //             </View>

// //             {hasEmail && (
// //               <>
// //                 <View style={styles.divider} />
// //                 <View style={styles.infoRow}>
// //                   <View style={styles.infoIcon}>
// //                     <Ionicons name="mail-outline" size={20} color="#007AFF" />
// //                   </View>
// //                   <View style={styles.infoContent}>
// //                     <Text style={styles.infoLabel}>Email</Text>
// //                     <Text style={styles.infoValue}>{email}</Text>
// //                   </View>
// //                 </View>
// //               </>
// //             )}
// //           </View>
// //         </View>

// //         {/* Address Information */}
// //         <View style={styles.section}>
// //           <Text style={styles.sectionTitle}>Address</Text>

// //           <View style={styles.infoCard}>
// //             <View style={styles.infoRow}>
// //               <View style={styles.infoIcon}>
// //                 <Ionicons name="location-outline" size={20} color="#007AFF" />
// //               </View>
// //               <View style={styles.infoContent}>
// //                 <Text style={styles.infoLabel}>Full Address</Text>
// //                 <Text style={styles.infoValue}>{formatAddress()}</Text>
// //               </View>
// //             </View>
// //           </View>
// //         </View>

// //         {/* Work Details for Distributor */}
// //         {params.userType === 'distributor' && userData?.assigned_customers_count !== undefined && (
// //           <View style={styles.section}>
// //             <Text style={styles.sectionTitle}>Work Summary</Text>

// //             <View style={styles.infoCard}>
// //               <View style={styles.infoRow}>
// //                 <View style={styles.infoIcon}>
// //                   <Ionicons name="people-outline" size={20} color="#007AFF" />
// //                 </View>
// //                 <View style={styles.infoContent}>
// //                   <Text style={styles.infoLabel}>Total Assigned Consumers</Text>
// //                   <Text style={styles.infoValue}>
// //                     {userData.assigned_customers_count} consumers
// //                   </Text>
// //                 </View>
// //               </View>
// //             </View>
// //           </View>
// //         )}

// //         {/* Assigned Consumers List for Distributor */}
// //         {params.userType === 'distributor' && (
// //           <View style={styles.section}>
// //             <View style={styles.sectionHeader}>
// //               <Text style={styles.sectionTitle}>Assigned Consumers</Text>
// //               {loadingConsumers && (
// //                 <ActivityIndicator size="small" color="#007AFF" />
// //               )}
// //             </View>

// //             {loadingConsumers ? (
// //               <View style={styles.loadingConsumersContainer}>
// //                 <ActivityIndicator size="small" color="#007AFF" />
// //                 <Text style={styles.loadingConsumersText}>Loading consumers...</Text>
// //               </View>
// //             ) : assignedConsumers.length > 0 ? (
// //               <View style={styles.consumerListCard}>
// //                 {assignedConsumers.map((consumer, index) => (
// //                   <View key={consumer.id || consumer.customer_id || index}>
// //                     <View style={styles.consumerItem}>
// //                       <View style={styles.consumerAvatar}>
// //                         <Text style={styles.consumerAvatarText}>
// //                           {getInitials(consumer.customer_name || 'U')}
// //                         </Text>
// //                       </View>
// //                       <View style={styles.consumerInfo}>
// //                         <Text style={styles.consumerName}>
// //                           {consumer.customer_name || 'Unknown Consumer'}
// //                         </Text>
// //                         <Text style={styles.consumerContact}>
// //                           {consumer.customer_contact || 'No contact'}
// //                         </Text>
// //                       </View>
// //                       <View style={styles.consumerStatus}>
// //                         <View style={[
// //                           styles.statusDot,
// //                           { backgroundColor: consumer.status === 'active' ? '#34C759' : '#999' },
// //                         ]} />
// //                       </View>
// //                     </View>
// //                     {index < assignedConsumers.length - 1 && <View style={styles.divider} />}
// //                   </View>
// //                 ))}
// //               </View>
// //             ) : (
// //               <View style={styles.emptyConsumersCard}>
// //                 <Ionicons name="people-outline" size={48} color="#ccc" />
// //                 <Text style={styles.emptyConsumersText}>No consumers assigned yet</Text>
// //               </View>
// //             )}
// //           </View>
// //         )}

// //         {/* Account Information */}
// //         <View style={styles.section}>
// //           <Text style={styles.sectionTitle}>Account Information</Text>

// //           <View style={styles.infoCard}>
// //             <View style={styles.infoRow}>
// //               <View style={styles.infoIcon}>
// //                 <Ionicons name="person-outline" size={20} color="#007AFF" />
// //               </View>
// //               <View style={styles.infoContent}>
// //                 <Text style={styles.infoLabel}>User ID</Text>
// //                 <Text style={styles.infoValue}>{params.userId}</Text>
// //               </View>
// //             </View>

// //             {userData?.provider && (
// //               <>
// //                 <View style={styles.divider} />
// //                 <View style={styles.infoRow}>
// //                   <View style={styles.infoIcon}>
// //                     <Ionicons name="business-outline" size={20} color="#007AFF" />
// //                   </View>
// //                   <View style={styles.infoContent}>
// //                     <Text style={styles.infoLabel}>Provider ID</Text>
// //                     <Text style={styles.infoValue}>{userData.provider}</Text>
// //                   </View>
// //                 </View>
// //               </>
// //             )}

// //             <View style={styles.divider} />

// //             <View style={styles.infoRow}>
// //               <View style={styles.infoIcon}>
// //                 <Ionicons name="checkmark-circle-outline" size={20} color="#34C759" />
// //               </View>
// //               <View style={styles.infoContent}>
// //                 <Text style={styles.infoLabel}>Status</Text>
// //                 <Text style={[styles.infoValue, { color: '#34C759' }]}>Active</Text>
// //               </View>
// //             </View>
// //           </View>
// //         </View>

// //         {/* Bottom Spacing */}
// //         <View style={{ height: 40 }} />
// //       </ScrollView>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f8f9fa',
// //   },
// //   centered: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingHorizontal: 20,
// //   },
// //   loadingText: {
// //     marginTop: 12,
// //     fontSize: 16,
// //     color: '#666',
// //   },
// //   errorText: {
// //     color: '#FF3B30',
// //     fontSize: 16,
// //     fontWeight: '600',
// //     marginTop: 16,
// //     textAlign: 'center',
// //   },
// //   retryButton: {
// //     backgroundColor: '#007AFF',
// //     borderRadius: 8,
// //     paddingHorizontal: 24,
// //     paddingVertical: 12,
// //     marginTop: 16,
// //   },
// //   retryButtonText: {
// //     color: '#fff',
// //     fontWeight: '600',
// //     fontSize: 16,
// //   },
// //   header: {
// //     backgroundColor: '#007AFF',
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     paddingTop: Platform.OS === 'ios' ? 50 : 20,
// //     paddingBottom: 16,
// //     paddingHorizontal: 16,
// //   },
// //   backButton: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: 'rgba(255,255,255,0.2)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   headerTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#fff',
// //   },
// //   placeholder: {
// //     width: 40,
// //   },
// //   profileSection: {
// //     backgroundColor: '#fff',
// //     paddingVertical: 32,
// //     alignItems: 'center',
// //     borderBottomLeftRadius: 24,
// //     borderBottomRightRadius: 24,
// //     marginBottom: 16,
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOpacity: 0.08,
// //         shadowRadius: 8,
// //         shadowOffset: { width: 0, height: 4 },
// //       },
// //       android: {
// //         elevation: 4,
// //       },
// //     }),
// //   },
// //   avatarContainer: {
// //     marginBottom: 16,
// //   },
// //   avatarLarge: {
// //     width: 100,
// //     height: 100,
// //     borderRadius: 50,
// //     backgroundColor: '#007AFF',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     borderWidth: 4,
// //     borderColor: '#E8F4FD',
// //   },
// //   avatarLargeText: {
// //     fontSize: 36,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //   },
// //   userName: {
// //     fontSize: 24,
// //     fontWeight: 'bold',
// //     color: '#1a1a1a',
// //     marginBottom: 8,
// //   },
// //   userTypeBadge: {
// //     backgroundColor: '#E8F4FD',
// //     paddingHorizontal: 16,
// //     paddingVertical: 6,
// //     borderRadius: 16,
// //   },
// //   userTypeText: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#007AFF',
// //   },
// //   section: {
// //     paddingHorizontal: 16,
// //     marginBottom: 16,
// //   },
// //   sectionHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     marginBottom: 12,
// //   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#1a1a1a',
// //   },
// //   infoCard: {
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: 16,
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOpacity: 0.04,
// //         shadowRadius: 8,
// //         shadowOffset: { width: 0, height: 2 },
// //       },
// //       android: {
// //         elevation: 2,
// //       },
// //     }),
// //   },
// //   infoRow: {
// //     flexDirection: 'row',
// //     alignItems: 'flex-start',
// //   },
// //   infoIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 20,
// //     backgroundColor: '#F0F8FF',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   infoContent: {
// //     flex: 1,
// //   },
// //   infoLabel: {
// //     fontSize: 13,
// //     color: '#666',
// //     marginBottom: 4,
// //   },
// //   infoValue: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#1a1a1a',
// //   },
// //   divider: {
// //     height: 1,
// //     backgroundColor: '#f0f0f0',
// //     marginVertical: 16,
// //   },
// //   loadingConsumersContainer: {
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: 32,
// //     alignItems: 'center',
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOpacity: 0.04,
// //         shadowRadius: 8,
// //         shadowOffset: { width: 0, height: 2 },
// //       },
// //       android: {
// //         elevation: 2,
// //       },
// //     }),
// //   },
// //   loadingConsumersText: {
// //     marginTop: 12,
// //     fontSize: 14,
// //     color: '#666',
// //   },
// //   consumerListCard: {
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: 16,
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOpacity: 0.04,
// //         shadowRadius: 8,
// //         shadowOffset: { width: 0, height: 2 },
// //       },
// //       android: {
// //         elevation: 2,
// //       },
// //     }),
// //   },
// //   consumerItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   consumerAvatar: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: 22,
// //     backgroundColor: '#007AFF',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   consumerAvatarText: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //   },
// //   consumerInfo: {
// //     flex: 1,
// //   },
// //   consumerName: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#1a1a1a',
// //     marginBottom: 2,
// //   },
// //   consumerContact: {
// //     fontSize: 13,
// //     color: '#666',
// //   },
// //   consumerStatus: {
// //     marginLeft: 8,
// //   },
// //   statusDot: {
// //     width: 10,
// //     height: 10,
// //     borderRadius: 5,
// //   },
// //   emptyConsumersCard: {
// //     backgroundColor: '#fff',
// //     borderRadius: 16,
// //     padding: 32,
// //     alignItems: 'center',
// //     ...Platform.select({
// //       ios: {
// //         shadowColor: '#000',
// //         shadowOpacity: 0.04,
// //         shadowRadius: 8,
// //         shadowOffset: { width: 0, height: 2 },
// //       },
// //       android: {
// //         elevation: 2,
// //       },
// //     }),
// //   },
// //   emptyConsumersText: {
// //     fontSize: 15,
// //     color: '#999',
// //     marginTop: 12,
// //     textAlign: 'center',
// //   },
// // });

// // export default UserDetailsScreen;
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Platform,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import {
//   getConsumerDetailsById,
//   getDistributorDetailsById,
//   getDistributorAssignedConsumers,
// } from '../../apiServices/allApi';

// type UserDetailsParams = {
//   userId: number;
//   userType: 'consumer' | 'distributor';
//   userName: string;
// };

// type AssignedConsumer = {
//   id: number;
//   customer_id: number;
//   customer_name: string;
//   customer_contact: string;
//   status: string;
// };

// type NavigationProp = NativeStackNavigationProp<any>;

// const UserDetailsScreen = () => {
//   const route = useRoute();
//   const navigation = useNavigation<NavigationProp>();
//   const params = route.params as UserDetailsParams;

//   const [userData, setUserData] = useState<any>(null);
//   const [assignedConsumers, setAssignedConsumers] = useState<AssignedConsumer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [loadingConsumers, setLoadingConsumers] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchAssignedConsumers = useCallback(async () => {
//     setLoadingConsumers(true);
//     try {
//       const response = await getDistributorAssignedConsumers(params.userId);
//       console.log('Assigned consumers response:', JSON.stringify(response.data, null, 2));

//       const consumers = response?.data?.data || response?.data || [];
//       setAssignedConsumers(Array.isArray(consumers) ? consumers : []);
//     } catch (err: any) {
//       console.error('Error fetching assigned consumers:', err);
//       setAssignedConsumers([]);
//     } finally {
//       setLoadingConsumers(false);
//     }
//   }, [params.userId]);

//   const fetchUserDetails = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       let response;
//       if (params.userType === 'consumer') {
//         response = await getConsumerDetailsById(params.userId);
//       } else {
//         response = await getDistributorDetailsById(params.userId);
//       }

//       const data = response?.data?.data || response?.data;
//       console.log('User details response:', JSON.stringify(data, null, 2));
//       setUserData(data);

//       // If distributor, fetch assigned consumers
//       if (params.userType === 'distributor') {
//         fetchAssignedConsumers();
//       }
//     } catch (err: any) {
//       console.error('Error fetching user details:', err);
//       setError(err?.message || 'Failed to load user details');
//     } finally {
//       setLoading(false);
//     }
//   }, [params.userId, params.userType, fetchAssignedConsumers]);

//   useEffect(() => {
//     fetchUserDetails();
//   }, [fetchUserDetails]);

//   // Navigate to Calendar based on user type
//   const handleNavigateToCalendar = useCallback(() => {
//     try {
//       if (params.userType === 'consumer') {
//         console.log('📅 Navigating to Consumer Calendar');
//         navigation.navigate('ConsumerCalendar', {
//           viewerRole: 'vendor',
//           targetConsumerId: params.userId,
//           targetConsumerName: params.userName,
//           showBackButton: true,
//         });
//       } else {
//         console.log('📅 Navigating to Distributor Calendar');
//         navigation.navigate('VendorDistributorCalendar', {
//           viewerRole: 'vendor',
//           targetDistributorId: params.userId,
//           targetDistributorName: params.userName,
//           showBackButton: true,
//         });
//       }
//     } catch (navError) {
//       console.error('Navigation error:', navError);
//     }
//   }, [params.userType, params.userId, params.userName, navigation]);

//   const getInitials = (name: string) => {
//     if (!name) return 'U';
//     const parts = name.split(' ');
//     if (parts.length >= 2) {
//       return (parts[0][0] + parts[1][0]).toUpperCase();
//     }
//     return name[0].toUpperCase();
//   };

//   const formatAddress = () => {
//     if (!userData) return 'No address provided';

//     const parts = [
//       userData.flat_house,
//       userData.society_name || userData.society_area,
//       userData.village,
//       userData.tal,
//       userData.dist,
//       userData.state,
//       userData.pincode,
//     ].filter(Boolean);

//     return parts.join(', ') || 'No address provided';
//   };

//   if (loading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#007AFF" />
//         <Text style={styles.loadingText}>Loading details...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centered}>
//         <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity onPress={fetchUserDetails} style={styles.retryButton}>
//           <Text style={styles.retryButtonText}>Try Again</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   const phoneNumber = userData?.phone_number ||
//                      userData?.contact ||
//                      userData?.phone ||
//                      userData?.mobile ||
//                      'Not provided';

//   const email = userData?.email ||
//                 userData?.email_address ||
//                 userData?.user_email ||
//                 'Not provided';

//   const fullName = params.userName ||
//                    userData?.full_name ||
//                    userData?.name ||
//                    (userData?.first_name && userData?.last_name
//                      ? `${userData.first_name} ${userData.last_name}`
//                      : 'Unknown User');

//   const hasEmail = userData?.email || userData?.email_address || userData?.user_email;

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="arrow-back" size={24} color="#fff" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>
//           {params.userType === 'consumer' ? 'Consumer Details' : 'Distributor Details'}
//         </Text>
//         <View style={styles.placeholder} />
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Profile Section */}
//         <View style={styles.profileSection}>
//           <View style={styles.avatarContainer}>
//             <View style={styles.avatarLarge}>
//               <Text style={styles.avatarLargeText}>{getInitials(fullName)}</Text>
//             </View>
//           </View>
//           <Text style={styles.userName}>{fullName}</Text>
//           <View style={styles.userTypeBadge}>
//             <Text style={styles.userTypeText}>
//               {params.userType === 'consumer' ? 'Consumer' : 'Distributor'}
//             </Text>
//           </View>
//         </View>

//         {/* Calendar Action Card - NEW */}
//         <View style={styles.section}>
//           <TouchableOpacity 
//             style={styles.calendarActionCard}
//             onPress={handleNavigateToCalendar}
//             activeOpacity={0.7}
//           >
//             <View style={styles.calendarIconContainer}>
//               <Ionicons name="calendar" size={32} color="#007AFF" />
//             </View>
//             <View style={styles.calendarContent}>
//               <Text style={styles.calendarTitle}>View Calendar</Text>
//               <Text style={styles.calendarSubtitle}>
//                 {params.userType === 'consumer' 
//                   ? 'View delivery schedule and history' 
//                   : 'View distributor schedule and deliveries'}
//               </Text>
//             </View>
//             <Ionicons name="chevron-forward" size={24} color="#007AFF" />
//           </TouchableOpacity>
//         </View>

//         {/* Contact Information */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Contact Information</Text>

//           <View style={styles.infoCard}>
//             <View style={styles.infoRow}>
//               <View style={styles.infoIcon}>
//                 <Ionicons name="call-outline" size={20} color="#007AFF" />
//               </View>
//               <View style={styles.infoContent}>
//                 <Text style={styles.infoLabel}>Phone Number</Text>
//                 <Text style={styles.infoValue}>{phoneNumber}</Text>
//               </View>
//             </View>

//             {hasEmail && (
//               <>
//                 <View style={styles.divider} />
//                 <View style={styles.infoRow}>
//                   <View style={styles.infoIcon}>
//                     <Ionicons name="mail-outline" size={20} color="#007AFF" />
//                   </View>
//                   <View style={styles.infoContent}>
//                     <Text style={styles.infoLabel}>Email</Text>
//                     <Text style={styles.infoValue}>{email}</Text>
//                   </View>
//                 </View>
//               </>
//             )}
//           </View>
//         </View>

//         {/* Address Information */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Address</Text>

//           <View style={styles.infoCard}>
//             <View style={styles.infoRow}>
//               <View style={styles.infoIcon}>
//                 <Ionicons name="location-outline" size={20} color="#007AFF" />
//               </View>
//               <View style={styles.infoContent}>
//                 <Text style={styles.infoLabel}>Full Address</Text>
//                 <Text style={styles.infoValue}>{formatAddress()}</Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Work Details for Distributor */}
//         {params.userType === 'distributor' && userData?.assigned_customers_count !== undefined && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Work Summary</Text>

//             <View style={styles.infoCard}>
//               <View style={styles.infoRow}>
//                 <View style={styles.infoIcon}>
//                   <Ionicons name="people-outline" size={20} color="#007AFF" />
//                 </View>
//                 <View style={styles.infoContent}>
//                   <Text style={styles.infoLabel}>Total Assigned Consumers</Text>
//                   <Text style={styles.infoValue}>
//                     {userData.assigned_customers_count} consumers
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           </View>
//         )}

//         {/* Assigned Consumers List for Distributor */}
//         {params.userType === 'distributor' && (
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>Assigned Consumers</Text>
//               {loadingConsumers && (
//                 <ActivityIndicator size="small" color="#007AFF" />
//               )}
//             </View>

//             {loadingConsumers ? (
//               <View style={styles.loadingConsumersContainer}>
//                 <ActivityIndicator size="small" color="#007AFF" />
//                 <Text style={styles.loadingConsumersText}>Loading consumers...</Text>
//               </View>
//             ) : assignedConsumers.length > 0 ? (
//               <View style={styles.consumerListCard}>
//                 {assignedConsumers.map((consumer, index) => (
//                   <View key={consumer.id || consumer.customer_id || index}>
//                     <View style={styles.consumerItem}>
//                       <View style={styles.consumerAvatar}>
//                         <Text style={styles.consumerAvatarText}>
//                           {getInitials(consumer.customer_name || 'U')}
//                         </Text>
//                       </View>
//                       <View style={styles.consumerInfo}>
//                         <Text style={styles.consumerName}>
//                           {consumer.customer_name || 'Unknown Consumer'}
//                         </Text>
//                         <Text style={styles.consumerContact}>
//                           {consumer.customer_contact || 'No contact'}
//                         </Text>
//                       </View>
//                       <View style={styles.consumerStatus}>
//                         <View style={[
//                           styles.statusDot,
//                           { backgroundColor: consumer.status === 'active' ? '#34C759' : '#999' },
//                         ]} />
//                       </View>
//                     </View>
//                     {index < assignedConsumers.length - 1 && <View style={styles.divider} />}
//                   </View>
//                 ))}
//               </View>
//             ) : (
//               <View style={styles.emptyConsumersCard}>
//                 <Ionicons name="people-outline" size={48} color="#ccc" />
//                 <Text style={styles.emptyConsumersText}>No consumers assigned yet</Text>
//               </View>
//             )}
//           </View>
//         )}

//         {/* Account Information */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Account Information</Text>

//           <View style={styles.infoCard}>
//             <View style={styles.infoRow}>
//               <View style={styles.infoIcon}>
//                 <Ionicons name="person-outline" size={20} color="#007AFF" />
//               </View>
//               <View style={styles.infoContent}>
//                 <Text style={styles.infoLabel}>User ID</Text>
//                 <Text style={styles.infoValue}>{params.userId}</Text>
//               </View>
//             </View>

//             {userData?.provider && (
//               <>
//                 <View style={styles.divider} />
//                 <View style={styles.infoRow}>
//                   <View style={styles.infoIcon}>
//                     <Ionicons name="business-outline" size={20} color="#007AFF" />
//                   </View>
//                   <View style={styles.infoContent}>
//                     <Text style={styles.infoLabel}>Provider ID</Text>
//                     <Text style={styles.infoValue}>{userData.provider}</Text>
//                   </View>
//                 </View>
//               </>
//             )}

//             <View style={styles.divider} />

//             <View style={styles.infoRow}>
//               <View style={styles.infoIcon}>
//                 <Ionicons name="checkmark-circle-outline" size={20} color="#34C759" />
//               </View>
//               <View style={styles.infoContent}>
//                 <Text style={styles.infoLabel}>Status</Text>
//                 <Text style={[styles.infoValue, { color: '#34C759' }]}>Active</Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Bottom Spacing */}
//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   centered: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//   },
//   errorText: {
//     color: '#FF3B30',
//     fontSize: 16,
//     fontWeight: '600',
//     marginTop: 16,
//     textAlign: 'center',
//   },
//   retryButton: {
//     backgroundColor: '#007AFF',
//     borderRadius: 8,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     marginTop: 16,
//   },
//   retryButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
//   header: {
//     backgroundColor: '#007AFF',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingTop: Platform.OS === 'ios' ? 50 : 20,
//     paddingBottom: 16,
//     paddingHorizontal: 16,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#fff',
//   },
//   placeholder: {
//     width: 40,
//   },
//   profileSection: {
//     backgroundColor: '#fff',
//     paddingVertical: 32,
//     alignItems: 'center',
//     borderBottomLeftRadius: 24,
//     borderBottomRightRadius: 24,
//     marginBottom: 16,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.08,
//         shadowRadius: 8,
//         shadowOffset: { width: 0, height: 4 },
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   avatarContainer: {
//     marginBottom: 16,
//   },
//   avatarLarge: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 4,
//     borderColor: '#E8F4FD',
//   },
//   avatarLargeText: {
//     fontSize: 36,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   userName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginBottom: 8,
//   },
//   userTypeBadge: {
//     backgroundColor: '#E8F4FD',
//     paddingHorizontal: 16,
//     paddingVertical: 6,
//     borderRadius: 16,
//   },
//   userTypeText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#007AFF',
//   },
//   section: {
//     paddingHorizontal: 16,
//     marginBottom: 16,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#1a1a1a',
//     marginBottom: 12,
//   },
  
//   // Calendar Action Card - NEW STYLES
//   calendarActionCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#E8F4FD',
//     borderRadius: 16,
//     padding: 20,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#007AFF',
//         shadowOpacity: 0.15,
//         shadowRadius: 12,
//         shadowOffset: { width: 0, height: 4 },
//       },
//       android: {
//         elevation: 6,
//       },
//     }),
//   },
//   calendarIconContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#007AFF',
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//         shadowOffset: { width: 0, height: 2 },
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },
//   calendarContent: {
//     flex: 1,
//   },
//   calendarTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#007AFF',
//     marginBottom: 4,
//   },
//   calendarSubtitle: {
//     fontSize: 13,
//     color: '#0066CC',
//     lineHeight: 18,
//   },

//   infoCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.04,
//         shadowRadius: 8,
//         shadowOffset: { width: 0, height: 2 },
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
//   },
//   infoRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   infoIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#F0F8FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   infoContent: {
//     flex: 1,
//   },
//   infoLabel: {
//     fontSize: 13,
//     color: '#666',
//     marginBottom: 4,
//   },
//   infoValue: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1a1a1a',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#f0f0f0',
//     marginVertical: 16,
//   },
//   loadingConsumersContainer: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 32,
//     alignItems: 'center',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.04,
//         shadowRadius: 8,
//         shadowOffset: { width: 0, height: 2 },
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
//   },
//   loadingConsumersText: {
//     marginTop: 12,
//     fontSize: 14,
//     color: '#666',
//   },
//   consumerListCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 16,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.04,
//         shadowRadius: 8,
//         shadowOffset: { width: 0, height: 2 },
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
//   },
//   consumerItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   consumerAvatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#007AFF',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   consumerAvatarText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   consumerInfo: {
//     flex: 1,
//   },
//   consumerName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#1a1a1a',
//     marginBottom: 2,
//   },
//   consumerContact: {
//     fontSize: 13,
//     color: '#666',
//   },
//   consumerStatus: {
//     marginLeft: 8,
//   },
//   statusDot: {
//     width: 10,
//     height: 10,
//     borderRadius: 5,
//   },
//   emptyConsumersCard: {
//     backgroundColor: '#fff',
//     borderRadius: 16,
//     padding: 32,
//     alignItems: 'center',
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOpacity: 0.04,
//         shadowRadius: 8,
//         shadowOffset: { width: 0, height: 2 },
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
//   },
//   emptyConsumersText: {
//     fontSize: 15,
//     color: '#999',
//     marginTop: 12,
//     textAlign: 'center',
//   },
// });

// export default UserDetailsScreen;
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  getConsumerDetailsById,
  getDistributorDetailsById,
  getDistributorAssignedConsumers,
} from '../../apiServices/allApi';

type UserDetailsParams = {
  userId: number;
  userType: 'consumer' | 'distributor';
  userName: string;
};

type AssignedConsumer = {
  id: number;
  customer_id: number;
  customer_name: string;
  customer_contact: string;
  status: string;
};

type NavigationProp = NativeStackNavigationProp<any>;

const UserDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<NavigationProp>();
  const params = route.params as UserDetailsParams;

  const [userData, setUserData] = useState<any>(null);
  const [assignedConsumers, setAssignedConsumers] = useState<AssignedConsumer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingConsumers, setLoadingConsumers] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignedConsumers = useCallback(async () => {
    setLoadingConsumers(true);
    try {
      const response = await getDistributorAssignedConsumers(params.userId);
      console.log('Assigned consumers response:', JSON.stringify(response.data, null, 2));

      const consumers = response?.data?.data || response?.data || [];
      setAssignedConsumers(Array.isArray(consumers) ? consumers : []);
    } catch (err: any) {
      console.error('Error fetching assigned consumers:', err);
      setAssignedConsumers([]);
    } finally {
      setLoadingConsumers(false);
    }
  }, [params.userId]);

  const fetchUserDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (params.userType === 'consumer') {
        response = await getConsumerDetailsById(params.userId);
      } else {
        response = await getDistributorDetailsById(params.userId);
      }

      const data = response?.data?.data || response?.data;
      console.log('User details response:', JSON.stringify(data, null, 2));
      setUserData(data);

      // If distributor, fetch assigned consumers
      if (params.userType === 'distributor') {
        fetchAssignedConsumers();
      }
    } catch (err: any) {
      console.error('Error fetching user details:', err);
      setError(err?.message || 'Failed to load user details');
    } finally {
      setLoading(false);
    }
  }, [params.userId, params.userType, fetchAssignedConsumers]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  // Navigate to Calendar
  const handleNavigateToCalendar = useCallback(() => {
    try {
      if (params.userType === 'consumer') {
        console.log('📅 Navigating to Consumer Calendar');
        navigation.navigate('ConsumerCalendar', {
          viewerRole: 'vendor',
          targetConsumerId: params.userId,
          targetConsumerName: params.userName,
          showBackButton: true,
        });
      } else {
        console.log('📅 Navigating to Distributor Calendar');
        navigation.navigate('VendorDistributorCalendar', {
          viewerRole: 'vendor',
          targetDistributorId: params.userId,
          targetDistributorName: params.userName,
          showBackButton: true,
        });
      }
    } catch (navError) {
      console.error('Navigation error:', navError);
    }
  }, [params.userType, params.userId, params.userName, navigation]);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  const formatAddress = () => {
    if (!userData) return 'No address provided';

    const parts = [
      userData.flat_house,
      userData.society_name || userData.society_area,
      userData.village,
      userData.tal,
      userData.dist,
      userData.state,
      userData.pincode,
    ].filter(Boolean);

    return parts.join(', ') || 'No address provided';
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchUserDetails} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const phoneNumber = userData?.phone_number ||
                     userData?.contact ||
                     userData?.phone ||
                     userData?.mobile ||
                     'Not provided';

  const email = userData?.email ||
                userData?.email_address ||
                userData?.user_email ||
                'Not provided';

  const fullName = params.userName ||
                   userData?.full_name ||
                   userData?.name ||
                   (userData?.first_name && userData?.last_name
                     ? `${userData.first_name} ${userData.last_name}`
                     : 'Unknown User');

  const hasEmail = userData?.email || userData?.email_address || userData?.user_email;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {params.userType === 'consumer' ? 'Consumer Details' : 'Distributor Details'}
        </Text>
        
        {/* Calendar Icon in Header */}
        <TouchableOpacity
          onPress={handleNavigateToCalendar}
          style={styles.calendarButton}
        >
          <Ionicons name="calendar-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarLargeText}>{getInitials(fullName)}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{fullName}</Text>
          <View style={styles.userTypeBadge}>
            <Text style={styles.userTypeText}>
              {params.userType === 'consumer' ? 'Consumer' : 'Distributor'}
            </Text>
          </View>
        </View>

        {/* Calendar Action Card - Prominent */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.calendarActionCard}
            onPress={handleNavigateToCalendar}
            activeOpacity={0.7}
          >
            <View style={styles.calendarIconContainer}>
              <Ionicons name="calendar" size={32} color="#007AFF" />
            </View>
            <View style={styles.calendarContent}>
              <Text style={styles.calendarTitle}>View Calendar</Text>
              <Text style={styles.calendarSubtitle}>
                {params.userType === 'consumer' 
                  ? 'View delivery schedule and history' 
                  : 'View distributor schedule and deliveries'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="call-outline" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>{phoneNumber}</Text>
              </View>
            </View>

            {hasEmail && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="mail-outline" size={20} color="#007AFF" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{email}</Text>
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="location-outline" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Address</Text>
                <Text style={styles.infoValue}>{formatAddress()}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Work Details for Distributor */}
        {params.userType === 'distributor' && userData?.assigned_customers_count !== undefined && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Work Summary</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="people-outline" size={20} color="#007AFF" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Total Assigned Consumers</Text>
                  <Text style={styles.infoValue}>
                    {userData.assigned_customers_count} consumers
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Assigned Consumers List for Distributor */}
        {params.userType === 'distributor' && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Assigned Consumers</Text>
              {loadingConsumers && (
                <ActivityIndicator size="small" color="#007AFF" />
              )}
            </View>

            {loadingConsumers ? (
              <View style={styles.loadingConsumersContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
                <Text style={styles.loadingConsumersText}>Loading consumers...</Text>
              </View>
            ) : assignedConsumers.length > 0 ? (
              <View style={styles.consumerListCard}>
                {assignedConsumers.map((consumer, index) => (
                  <View key={consumer.id || consumer.customer_id || index}>
                    <View style={styles.consumerItem}>
                      <View style={styles.consumerAvatar}>
                        <Text style={styles.consumerAvatarText}>
                          {getInitials(consumer.customer_name || 'U')}
                        </Text>
                      </View>
                      <View style={styles.consumerInfo}>
                        <Text style={styles.consumerName}>
                          {consumer.customer_name || 'Unknown Consumer'}
                        </Text>
                        <Text style={styles.consumerContact}>
                          {consumer.customer_contact || 'No contact'}
                        </Text>
                      </View>
                      <View style={styles.consumerStatus}>
                        <View style={[
                          styles.statusDot,
                          { backgroundColor: consumer.status === 'active' ? '#34C759' : '#999' },
                        ]} />
                      </View>
                    </View>
                    {index < assignedConsumers.length - 1 && <View style={styles.divider} />}
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyConsumersCard}>
                <Ionicons name="people-outline" size={48} color="#ccc" />
                <Text style={styles.emptyConsumersText}>No consumers assigned yet</Text>
              </View>
            )}
          </View>
        )}

        {/* Account Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="person-outline" size={20} color="#007AFF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>User ID</Text>
                <Text style={styles.infoValue}>{params.userId}</Text>
              </View>
            </View>

            {userData?.provider && (
              <>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="business-outline" size={20} color="#007AFF" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Provider ID</Text>
                    <Text style={styles.infoValue}>{userData.provider}</Text>
                  </View>
                </View>
              </>
            )}

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#34C759" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Status</Text>
                <Text style={[styles.infoValue, { color: '#34C759' }]}>Active</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  header: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  profileSection: {
    backgroundColor: '#fff',
    paddingVertical: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#E8F4FD',
  },
  avatarLargeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  userTypeBadge: {
    backgroundColor: '#E8F4FD',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  userTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  
  // Calendar Action Card
  calendarActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FD',
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOpacity: 0.15,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 6,
      },
    }),
  },
  calendarIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  calendarContent: {
    flex: 1,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  calendarSubtitle: {
    fontSize: 13,
    color: '#0066CC',
    lineHeight: 18,
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 16,
  },
  loadingConsumersContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  loadingConsumersText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  consumerListCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  consumerItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  consumerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  consumerAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  consumerInfo: {
    flex: 1,
  },
  consumerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  consumerContact: {
    fontSize: 13,
    color: '#666',
  },
  consumerStatus: {
    marginLeft: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  emptyConsumersCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  emptyConsumersText: {
    fontSize: 15,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default UserDetailsScreen;
