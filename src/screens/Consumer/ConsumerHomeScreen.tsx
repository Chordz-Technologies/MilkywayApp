// import React, { useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   ActivityIndicator,
//   TextInput,
//   Alert,
//   Modal,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { useNavigation, useFocusEffect } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// import { RootStackParamList, Vendor } from '../../navigation/types'; // VERIFY THIS PATH

// type ConsumerSubscription = {
//   milkQuantity: number;
//   deliveryFrequency: 'daily' | 'alternate' | 'custom';
//   otherItems: string[];
//   startDate: string;
//   status: 'active' | 'paused' | 'pending_approval';
// };

// type BillSummary = {
//   currentMonth: string;
//   totalAmount: number;
//   amountPaid: number;
//   amountDue: number;
//   lastPaymentDate: string;
// };

// const mockVendors: Vendor[] = [
//   { id: 'v1', name: 'Shankar Milk Vendor', location: 'Pune', rating: 4.7 },
//   { id: 'v2', name: 'Gopal Dairy', location: 'Mumbai', rating: 4.5 },
//   { id: 'v3', name: 'Pure Milk Supplies', location: 'Bangalore', rating: 4.9 },
// ];
// const mockCurrentVendor: Vendor | null = mockVendors[0];
// const mockConsumerSubscription: ConsumerSubscription | null = {
//   milkQuantity: 1.5,
//   deliveryFrequency: 'daily',
//   otherItems: ['curd'],
//   startDate: '2025-07-01',
//   status: 'active',
// };
// const mockBillSummary: BillSummary = {
//   currentMonth: 'July 2025',
//   totalAmount: 750,
//   amountPaid: 500,
//   amountDue: 250,
//   lastPaymentDate: '2025-07-10',
// };

// const mockFetchConsumerData = async (userId: string) => {
//   console.log(`Mock API: Fetching consumer data for user: ${userId}`);
//   // CORRECTED: Wrap resolve in an arrow function - This is already correct.
//   await new Promise(resolve => setTimeout(() => resolve(undefined), 1500));
//   return {
//     currentVendor: mockCurrentVendor,
//     subscription: mockConsumerSubscription,
//     billSummary: mockBillSummary,
//     availableVendors: mockVendors,
//   };
// };
// const mockSendVendorRequest = async (vendorId: string, userId: string): Promise<boolean> => {
//   console.log(`Mock API: Sending request from user ${userId} to vendor ${vendorId}`);
//   // CORRECTED: Wrap resolve in an arrow function - This is already correct.
//   await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
//   return true;
// };
// const mockUpdateSubscription = async (userId: string, subscription: ConsumerSubscription): Promise<boolean> => {
//   console.log(`Mock API: Updating subscription for user ${userId}:`, subscription);
//   // CORRECTED: Wrap resolve in an arrow function - This is already correct.
//   await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
//   return true;
// };
// const mockMarkHoliday = async (userId: string, dates: string[]): Promise<boolean> => {
//   console.log(`Mock API: Marking holidays for user ${userId} on dates:`, dates);
//   // CORRECTED: Wrap resolve in an arrow function - This is already correct.
//   await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
//   return true;
// };
// const mockPayBill = async (userId: string, amount: number): Promise<boolean> => {
//   console.log(`Mock API: Processing payment for user ${userId}, amount: ${amount}`);
//   // CORRECTED: Wrap resolve in an arrow function - This is already correct.
//   await new Promise(resolve => setTimeout(() => resolve(undefined), 1500));
//   return true;
// };
// const mockRequestAdHocMilk = async (userId: string, date: string, quantity: number): Promise<boolean> => {
//   console.log(`Mock API: Requesting ad-hoc milk for user ${userId} on ${date}, quantity ${quantity}`);
//   // CORRECTED: Wrap resolve in an arrow function - This is already correct.
//   await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
//   return true;
// };

// const ConsumerHomeScreen = () => {
//   const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'ConsumerHome'>>();
//   const userId = 'user123';

//   const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);
//   const [subscription, setSubscription] = useState<ConsumerSubscription | null>(null);
//   const [billSummary, setBillSummary] = useState<BillSummary | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSendingRequest, setIsSendingRequest] = useState(false);
//   const [isUpdatingSubscription, setIsUpdatingSubscription] = useState(false);
//   const [isMarkingHoliday, setIsMarkingHoliday] = useState(false);
//   const [isPayingBill, setIsPayingBill] = useState(false);
//   const [isRequestingAdHoc, setIsRequestingAdHoc] = useState(false);

//   const [holidayDate, setHolidayDate] = useState('');
//   const [showHolidayModal, setShowHolidayModal] = useState(false);

//   const [adHocQuantity, setAdHocQuantity] = useState('1');
//   const [adHocDate, setAdHocDate] = useState('');
//   const [showAdHocModal, setShowAdHocModal] = useState(false);


//   const fetchData = useCallback(async () => {
//     setIsLoading(true);
//     try {
//       const data = await mockFetchConsumerData(userId);
//       setCurrentVendor(data.currentVendor);
//       setSubscription(data.subscription);
//       setBillSummary(data.billSummary);
//     } catch (error) {
//       console.error('Failed to fetch consumer data:', error);
//       Alert.alert('Error', 'Could not load your data. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [userId]);

//   useFocusEffect(
//     useCallback(() => {
//       fetchData();
//     }, [fetchData])
//   );

//   const handleSelectVendor = useCallback(async (vendor: Vendor) => {
//     if (isSendingRequest) { return; }
//     setIsSendingRequest(true);
//     try {
//       const success = await mockSendVendorRequest(vendor.id, userId);
//       if (success) {
//         setCurrentVendor(vendor);
//         Alert.alert('Success', `Request sent to ${vendor.name}. Awaiting acceptance.`);
//         setSubscription(prev => prev ? { ...prev, status: 'pending_approval' } : null);
//       } else {
//         Alert.alert('Error', 'Failed to send request to vendor.');
//       }
//     } catch (error) {
//       console.error('Error sending vendor request:', error);
//       Alert.alert('Error', 'An error occurred while sending the request.');
//     } finally {
//       setIsSendingRequest(false);
//     }
//   }, [userId, isSendingRequest]);

//   const handleUpdateSubscription = async () => {
//     if (!subscription || isUpdatingSubscription) { return; }
//     Alert.alert(
//       'Confirm Update',
//       `Are you sure you want to update your subscription to ${subscription.milkQuantity}L ${subscription.deliveryFrequency}?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Update',
//           onPress: async () => {
//             setIsUpdatingSubscription(true);
//             try {
//               const success = await mockUpdateSubscription(userId, subscription);
//               if (success) {
//                 Alert.alert('Success', 'Subscription updated successfully!');
//               } else {
//                 Alert.alert('Error', 'Failed to update subscription.');
//               }
//             } catch (error) {
//               console.error('Error updating subscription:', error);
//               Alert.alert('Error', 'An error occurred while updating subscription.');
//             } finally {
//               setIsUpdatingSubscription(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleMarkHoliday = async () => {
//     if (!holidayDate || isMarkingHoliday) {
//       Alert.alert('Invalid Date', 'Please enter a valid date for holiday.');
//       return;
//     }
//     Alert.alert(
//       'Confirm Holiday',
//       `Mark ${holidayDate} as a holiday (no delivery)?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Confirm',
//           onPress: async () => {
//             setIsMarkingHoliday(true);
//             try {
//               const success = await mockMarkHoliday(userId, [holidayDate]);
//               if (success) {
//                 Alert.alert('Success', `Holiday marked for ${holidayDate}.`);
//                 setHolidayDate('');
//                 setShowHolidayModal(false);
//               } else {
//                 Alert.alert('Error', 'Failed to mark holiday.');
//               }
//             } catch (error) {
//               console.error('Error marking holiday:', error);
//               Alert.alert('Error', 'An error occurred while marking holiday.');
//             } finally {
//               setIsMarkingHoliday(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handlePayBill = async () => {
//     if (!billSummary || billSummary.amountDue <= 0 || isPayingBill) {
//       Alert.alert('No Due', 'You have no outstanding amount to pay.');
//       return;
//     }
//     Alert.alert(
//       'Confirm Payment',
//       `Are you sure you want to pay ₹${billSummary.amountDue.toFixed(2)}?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Pay Now',
//           onPress: async () => {
//             setIsPayingBill(true);
//             try {
//               const success = await mockPayBill(userId, billSummary.amountDue);
//               if (success) {
//                 Alert.alert('Success', 'Bill paid successfully!');
//                 fetchData();
//               } else {
//                 Alert.alert('Error', 'Failed to process payment.');
//               }
//             } catch (error) {
//               console.error('Error paying bill:', error);
//               Alert.alert('Error', 'An error occurred during payment.');
//             } finally {
//               setIsPayingBill(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleRequestAdHocMilk = async () => {
//     const quantity = parseFloat(adHocQuantity);
//     if (!adHocDate || isNaN(quantity) || quantity <= 0 || isRequestingAdHoc) {
//       Alert.alert('Invalid Input', 'Please enter a valid date and quantity.');
//       return;
//     }
//     Alert.alert(
//       'Confirm Ad-hoc Request',
//       `Request ${quantity}L milk on ${adHocDate}?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Request',
//           onPress: async () => {
//             setIsRequestingAdHoc(true);
//             try {
//               const success = await mockRequestAdHocMilk(userId, adHocDate, quantity);
//               if (success) {
//                 Alert.alert('Success', 'Ad-hoc milk request sent!');
//                 setAdHocDate('');
//                 setAdHocQuantity('1');
//                 setShowAdHocModal(false);
//               } else {
//                 Alert.alert('Error', 'Failed to send ad-hoc request.');
//               }
//             } catch (error) {
//               console.error('Error requesting ad-hoc milk:', error);
//               Alert.alert('Error', 'An error occurred while sending the request.');
//             } finally {
//               setIsRequestingAdHoc(false);
//             }
//           },
//         },
//       ]
//     );
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#007AFF" />
//         <Text style={styles.loadingText}>Loading your dashboard...</Text>
//       </View>
//     );
//   }

//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>🎉 Welcome to Milkyway App!</Text>
//             <Text style={styles.subtitle}>This is a dummy home screen.</Text>

//             <TouchableOpacity
//                 style={styles.button}
//                 onPress={() => navigation.goBack()}
//             >
//                 <Text style={styles.buttonText}>⬅️ Logout / Go Back</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f8f9fa' },
//   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
//   headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
//   scrollViewContent: { paddingBottom: 20 },
//   sectionCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginHorizontal: 16, marginTop: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
//   sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
//   loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
//   vendorInfoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
//   vendorDetails: { flex: 1 },
//   vendorName: { fontSize: 16, fontWeight: '600', color: '#333' },
//   vendorLocation: { fontSize: 14, color: '#666', marginTop: 2 },
//   vendorRating: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
//   vendorRatingText: { fontSize: 14, color: '#666', marginLeft: 4 },
//   changeVendorButton: { backgroundColor: '#e0f7fa', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
//   changeVendorButtonText: { color: '#007AFF', fontWeight: 'bold', fontSize: 13 },
//   noVendorContainer: { alignItems: 'center', paddingVertical: 20 },
//   noVendorText: { fontSize: 16, color: '#666', marginBottom: 15 },
//   selectVendorButton: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
//   selectVendorButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//   subscriptionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
//   subscriptionLabel: { fontSize: 15, color: '#555', width: 100 },
//   subscriptionValueInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 15, color: '#333' },
//   subscriptionUnit: { fontSize: 15, color: '#555', marginLeft: 5 },
//   frequencyOptions: { flexDirection: 'row', flex: 1, justifyContent: 'space-around' },
//   frequencyButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8, borderWidth: 1, borderColor: '#007AFF', backgroundColor: '#fff' },
//   frequencyButtonActive: { backgroundColor: '#007AFF' },
//   frequencyButtonText: { color: '#007AFF', fontWeight: '600' },
//   frequencyButtonTextActive: { color: '#fff' },
//   subscriptionStatus: { fontSize: 15, fontWeight: '600', color: '#4CAF50' },
//   updateSubscriptionButton: { backgroundColor: '#28a745', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 15 },
//   updateSubscriptionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//   noSubscriptionContainer: { alignItems: 'center', paddingVertical: 20 },
//   noSubscriptionText: { fontSize: 16, color: '#666', marginBottom: 15 },
//   actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0f7fa', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8, marginBottom: 10 },
//   actionButtonIcon: { marginRight: 10 },
//   actionButtonText: { color: '#007AFF', fontWeight: 'bold', fontSize: 15 },
//   billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
//   billLabel: { fontSize: 15, color: '#555' },
//   billValue: { fontSize: 15, fontWeight: '600', color: '#333' },
//   billValuePaid: { fontSize: 15, fontWeight: '600', color: '#28a745' },
//   billValueDue: { fontSize: 16, fontWeight: 'bold', color: '#dc3545' },
//   lastPaymentText: { fontSize: 13, color: '#888', marginTop: 5, textAlign: 'right' },
//   payBillButton: { backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 15 },
//   payBillButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
//   viewBillDetailsButton: { backgroundColor: '#f0f0f0', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#ddd' },
//   viewBillDetailsButtonText: { color: '#555', fontWeight: 'bold', fontSize: 14 },
//   noRecordsText: { textAlign: 'center', color: '#666', paddingVertical: 10 },
//   leaveVendorButton: { backgroundColor: '#dc3545', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8, marginTop: 15 },
//   leaveVendorButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 5 },
//   modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
//   modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '80%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
//   modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
//   modalInput: { width: '100%', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 15, fontSize: 16, color: '#333' },
//   modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
//   modalButtonCancel: { backgroundColor: '#6c757d', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, flex: 1, marginRight: 10, alignItems: 'center' },
//   modalButtonConfirm: { backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, flex: 1, marginLeft: 10, alignItems: 'center' },
//   modalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
// });

// export default ConsumerHomeScreen;

import React, { useState, useEffect, useCallback } from 'react';
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
};

const CustomerHomeScreen = () => {
  const navigation = useNavigation<CustomerHomeNavigationProp>();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [requestedVendors, setRequestedVendors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const userId = await AsyncStorage.getItem('userID');
      if (!userId) throw new Error('Customer ID not found.');

      const vendorRes = await getAllVendors();
      const vendorList = vendorRes?.data?.data || [];
      setVendors(vendorList);
    } catch (err: any) {
      setError(err.message || 'Failed to load vendors.');
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

  const sendRequest = async (vendorId: string) => {
    try {
      setSubmittingId(vendorId);
      const userId = await AsyncStorage.getItem('userID');
      if (!userId) throw new Error('User ID not found.');

      const payload = {
        user_id: parseInt(userId, 10),
        user_type: 'customer',
        vendor: parseInt(vendorId, 10),
      };

      await createRequest(payload);
      Alert.alert('Success', 'Request sent to vendor!');
      setRequestedVendors(prev => [...prev, vendorId]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.detail || 'Failed to send request.');
    } finally {
      setSubmittingId(null);
    }
  };

  const renderVendor = ({ item }: { item: Vendor }) => {
    const isRequested = requestedVendors.includes(item.id);
    const isSubmitting = submittingId === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.contact}>📞 {item.contact}</Text>
          <Text style={styles.address}>📍 {item.address || 'Not Provided'}</Text>
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
              {isRequested ? 'Requested' : 'Request to Join'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Available Vendors</Text>
        <View style={{ width: 32 }} />
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
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <Text style={styles.emptyText}>No vendors available.</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  back: { padding: 4 },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff0f0',
    padding: 12,
    justifyContent: 'space-between',
  },
  errorText: { color: '#c00', fontSize: 14, flex: 1 },
  retry: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
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
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  contact: { fontSize: 14, color: '#666', marginTop: 4 },
  address: { fontSize: 14, color: '#666', marginTop: 4 },
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: { color: '#666', fontSize: 18, textAlign: 'center' },
});

export default CustomerHomeScreen;