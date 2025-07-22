import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, Vendor } from '../../navigation/types'; // VERIFY THIS PATH

type ConsumerSubscription = {
  milkQuantity: number;
  deliveryFrequency: 'daily' | 'alternate' | 'custom';
  otherItems: string[];
  startDate: string;
  status: 'active' | 'paused' | 'pending_approval';
};

type BillSummary = {
  currentMonth: string;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  lastPaymentDate: string;
};

const mockVendors: Vendor[] = [
  { id: 'v1', name: 'Shankar Milk Vendor', location: 'Pune', rating: 4.7 },
  { id: 'v2', name: 'Gopal Dairy', location: 'Mumbai', rating: 4.5 },
  { id: 'v3', name: 'Pure Milk Supplies', location: 'Bangalore', rating: 4.9 },
];
const mockCurrentVendor: Vendor | null = mockVendors[0];
const mockConsumerSubscription: ConsumerSubscription | null = {
  milkQuantity: 1.5,
  deliveryFrequency: 'daily',
  otherItems: ['curd'],
  startDate: '2025-07-01',
  status: 'active',
};
const mockBillSummary: BillSummary = {
  currentMonth: 'July 2025',
  totalAmount: 750,
  amountPaid: 500,
  amountDue: 250,
  lastPaymentDate: '2025-07-10',
};

const mockFetchConsumerData = async (userId: string) => {
  console.log(`Mock API: Fetching consumer data for user: ${userId}`);
  // CORRECTED: Wrap resolve in an arrow function - This is already correct.
  await new Promise(resolve => setTimeout(() => resolve(undefined), 1500));
  return {
    currentVendor: mockCurrentVendor,
    subscription: mockConsumerSubscription,
    billSummary: mockBillSummary,
    availableVendors: mockVendors,
  };
};
const mockSendVendorRequest = async (vendorId: string, userId: string): Promise<boolean> => {
  console.log(`Mock API: Sending request from user ${userId} to vendor ${vendorId}`);
  // CORRECTED: Wrap resolve in an arrow function - This is already correct.
  await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
  return true;
};
const mockUpdateSubscription = async (userId: string, subscription: ConsumerSubscription): Promise<boolean> => {
  console.log(`Mock API: Updating subscription for user ${userId}:`, subscription);
  // CORRECTED: Wrap resolve in an arrow function - This is already correct.
  await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
  return true;
};
const mockMarkHoliday = async (userId: string, dates: string[]): Promise<boolean> => {
  console.log(`Mock API: Marking holidays for user ${userId} on dates:`, dates);
  // CORRECTED: Wrap resolve in an arrow function - This is already correct.
  await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
  return true;
};
const mockPayBill = async (userId: string, amount: number): Promise<boolean> => {
  console.log(`Mock API: Processing payment for user ${userId}, amount: ${amount}`);
  // CORRECTED: Wrap resolve in an arrow function - This is already correct.
  await new Promise(resolve => setTimeout(() => resolve(undefined), 1500));
  return true;
};
const mockRequestAdHocMilk = async (userId: string, date: string, quantity: number): Promise<boolean> => {
  console.log(`Mock API: Requesting ad-hoc milk for user ${userId} on ${date}, quantity ${quantity}`);
  // CORRECTED: Wrap resolve in an arrow function - This is already correct.
  await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));
  return true;
};

const ConsumerHomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'ConsumerHome'>>();
  const userId = 'user123';

  const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);
  const [subscription, setSubscription] = useState<ConsumerSubscription | null>(null);
  const [billSummary, setBillSummary] = useState<BillSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isUpdatingSubscription, setIsUpdatingSubscription] = useState(false);
  const [isMarkingHoliday, setIsMarkingHoliday] = useState(false);
  const [isPayingBill, setIsPayingBill] = useState(false);
  const [isRequestingAdHoc, setIsRequestingAdHoc] = useState(false);

  const [holidayDate, setHolidayDate] = useState('');
  const [showHolidayModal, setShowHolidayModal] = useState(false);

  const [adHocQuantity, setAdHocQuantity] = useState('1');
  const [adHocDate, setAdHocDate] = useState('');
  const [showAdHocModal, setShowAdHocModal] = useState(false);


  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await mockFetchConsumerData(userId);
      setCurrentVendor(data.currentVendor);
      setSubscription(data.subscription);
      setBillSummary(data.billSummary);
    } catch (error) {
      console.error('Failed to fetch consumer data:', error);
      Alert.alert('Error', 'Could not load your data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleSelectVendor = useCallback(async (vendor: Vendor) => {
    if (isSendingRequest) { return; }
    setIsSendingRequest(true);
    try {
      const success = await mockSendVendorRequest(vendor.id, userId);
      if (success) {
        setCurrentVendor(vendor);
        Alert.alert('Success', `Request sent to ${vendor.name}. Awaiting acceptance.`);
        setSubscription(prev => prev ? { ...prev, status: 'pending_approval' } : null);
      } else {
        Alert.alert('Error', 'Failed to send request to vendor.');
      }
    } catch (error) {
      console.error('Error sending vendor request:', error);
      Alert.alert('Error', 'An error occurred while sending the request.');
    } finally {
      setIsSendingRequest(false);
    }
  }, [userId, isSendingRequest]);

  const handleUpdateSubscription = async () => {
    if (!subscription || isUpdatingSubscription) { return; }
    Alert.alert(
      'Confirm Update',
      `Are you sure you want to update your subscription to ${subscription.milkQuantity}L ${subscription.deliveryFrequency}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Update',
          onPress: async () => {
            setIsUpdatingSubscription(true);
            try {
              const success = await mockUpdateSubscription(userId, subscription);
              if (success) {
                Alert.alert('Success', 'Subscription updated successfully!');
              } else {
                Alert.alert('Error', 'Failed to update subscription.');
              }
            } catch (error) {
              console.error('Error updating subscription:', error);
              Alert.alert('Error', 'An error occurred while updating subscription.');
            } finally {
              setIsUpdatingSubscription(false);
            }
          },
        },
      ]
    );
  };

  const handleMarkHoliday = async () => {
    if (!holidayDate || isMarkingHoliday) {
      Alert.alert('Invalid Date', 'Please enter a valid date for holiday.');
      return;
    }
    Alert.alert(
      'Confirm Holiday',
      `Mark ${holidayDate} as a holiday (no delivery)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setIsMarkingHoliday(true);
            try {
              const success = await mockMarkHoliday(userId, [holidayDate]);
              if (success) {
                Alert.alert('Success', `Holiday marked for ${holidayDate}.`);
                setHolidayDate('');
                setShowHolidayModal(false);
              } else {
                Alert.alert('Error', 'Failed to mark holiday.');
              }
            } catch (error) {
              console.error('Error marking holiday:', error);
              Alert.alert('Error', 'An error occurred while marking holiday.');
            } finally {
              setIsMarkingHoliday(false);
            }
          },
        },
      ]
    );
  };

  const handlePayBill = async () => {
    if (!billSummary || billSummary.amountDue <= 0 || isPayingBill) {
      Alert.alert('No Due', 'You have no outstanding amount to pay.');
      return;
    }
    Alert.alert(
      'Confirm Payment',
      `Are you sure you want to pay ₹${billSummary.amountDue.toFixed(2)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: async () => {
            setIsPayingBill(true);
            try {
              const success = await mockPayBill(userId, billSummary.amountDue);
              if (success) {
                Alert.alert('Success', 'Bill paid successfully!');
                fetchData();
              } else {
                Alert.alert('Error', 'Failed to process payment.');
              }
            } catch (error) {
              console.error('Error paying bill:', error);
              Alert.alert('Error', 'An error occurred during payment.');
            } finally {
              setIsPayingBill(false);
            }
          },
        },
      ]
    );
  };

  const handleRequestAdHocMilk = async () => {
    const quantity = parseFloat(adHocQuantity);
    if (!adHocDate || isNaN(quantity) || quantity <= 0 || isRequestingAdHoc) {
      Alert.alert('Invalid Input', 'Please enter a valid date and quantity.');
      return;
    }
    Alert.alert(
      'Confirm Ad-hoc Request',
      `Request ${quantity}L milk on ${adHocDate}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request',
          onPress: async () => {
            setIsRequestingAdHoc(true);
            try {
              const success = await mockRequestAdHocMilk(userId, adHocDate, quantity);
              if (success) {
                Alert.alert('Success', 'Ad-hoc milk request sent!');
                setAdHocDate('');
                setAdHocQuantity('1');
                setShowAdHocModal(false);
              } else {
                Alert.alert('Error', 'Failed to send ad-hoc request.');
              }
            } catch (error) {
              console.error('Error requesting ad-hoc milk:', error);
              Alert.alert('Error', 'An error occurred while sending the request.');
            } finally {
              setIsRequestingAdHoc(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Milk Delivery</Text>
        <TouchableOpacity onPress={() => console.log('Settings pressed')}>
          <Ionicons name="settings-outline" size={26} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>My Vendor</Text>
          {currentVendor ? (
            <View style={styles.vendorInfoRow}>
              <View style={styles.vendorDetails}>
                <Text style={styles.vendorName}>{currentVendor.name}</Text>
                <Text style={styles.vendorLocation}>{currentVendor.location}</Text>
                <View style={styles.vendorRating}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.vendorRatingText}>{currentVendor.rating}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.changeVendorButton}
                onPress={() => navigation.navigate('VendorList', { onSelectVendor: handleSelectVendor })}
              >
                <Text style={styles.changeVendorButtonText}>Change Vendor</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noVendorContainer}>
              <Text style={styles.noVendorText}>No vendor selected yet.</Text>
              <TouchableOpacity
                style={styles.selectVendorButton}
                onPress={() => navigation.navigate('VendorList', { onSelectVendor: handleSelectVendor })}
              >
                <Text style={styles.selectVendorButtonText}>Select a Vendor</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>My Subscription</Text>
          {subscription ? (
            <View>
              <View style={styles.subscriptionRow}>
                <Text style={styles.subscriptionLabel}>Milk Quantity:</Text>
                <TextInput
                  style={styles.subscriptionValueInput}
                  keyboardType="numeric"
                  value={String(subscription.milkQuantity)}
                  onChangeText={(text) => setSubscription(prev => prev ? { ...prev, milkQuantity: parseFloat(text) || 0 } : null)}
                />
                <Text style={styles.subscriptionUnit}> Liters</Text>
              </View>
              <View style={styles.subscriptionRow}>
                <Text style={styles.subscriptionLabel}>Frequency:</Text>
                <View style={styles.frequencyOptions}>
                  {['daily', 'alternate'].map((freq) => (
                    <TouchableOpacity
                      key={freq}
                      style={[
                        styles.frequencyButton,
                        subscription.deliveryFrequency === freq && styles.frequencyButtonActive,
                      ]}
                      onPress={() => setSubscription(prev => prev ? { ...prev, deliveryFrequency: freq as 'daily' | 'alternate' } : null)}
                    >
                      <Text style={[
                        styles.frequencyButtonText,
                        subscription.deliveryFrequency === freq && styles.frequencyButtonTextActive,
                      ]}>
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.subscriptionRow}>
                <Text style={styles.subscriptionLabel}>Status:</Text>
                <Text style={styles.subscriptionStatus}>{subscription.status.replace(/_/g, ' ')}</Text>
              </View>
              <TouchableOpacity
                style={styles.updateSubscriptionButton}
                onPress={handleUpdateSubscription}
                disabled={isUpdatingSubscription}
              >
                {isUpdatingSubscription ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.updateSubscriptionButtonText}>Update Subscription</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noSubscriptionContainer}>
              <Text style={styles.noSubscriptionText}>No active subscription.</Text>
              <TouchableOpacity
                style={styles.selectVendorButton}
                onPress={() => Alert.alert('Setup Subscription', 'Navigate to a screen to set up a new subscription.')}
              >
                <Text style={styles.selectVendorButtonText}>Set Up Subscription</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Manage Deliveries</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowHolidayModal(true)}
          >
            <Ionicons name="calendar-outline" size={20} color="#007AFF" style={styles.actionButtonIcon} />
            <Text style={styles.actionButtonText}>Mark Holiday / Pause Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowAdHocModal(true)}
          >
            <Ionicons name="add-circle-outline" size={20} color="#007AFF" style={styles.actionButtonIcon} />
            <Text style={styles.actionButtonText}>Request Ad-hoc Milk</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>My Bill</Text>
          {billSummary ? (
            <View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Month:</Text>
                <Text style={styles.billValue}>{billSummary.currentMonth}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Total Amount:</Text>
                <Text style={styles.billValue}>₹ {billSummary.totalAmount.toFixed(2)}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Amount Paid:</Text>
                <Text style={styles.billValuePaid}>₹ {billSummary.amountPaid.toFixed(2)}</Text>
              </View>
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Amount Due:</Text>
                <Text style={styles.billValueDue}>₹ {billSummary.amountDue.toFixed(2)}</Text>
              </View>
              <Text style={styles.lastPaymentText}>Last Payment: {billSummary.lastPaymentDate}</Text>
              <TouchableOpacity
                style={styles.payBillButton}
                onPress={handlePayBill}
                disabled={isPayingBill || billSummary.amountDue <= 0}
              >
                {isPayingBill ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.payBillButtonText}>Pay Now</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.viewBillDetailsButton}
                onPress={() => navigation.navigate('BillDetails', { billId: 'currentMonthBill' })}
              >
                <Text style={styles.viewBillDetailsButtonText}>View Bill Details</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.noRecordsText}>No bill summary available.</Text>
          )}
        </View>
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Vendor Management</Text>
          <TouchableOpacity
            style={styles.leaveVendorButton}
            onPress={() => Alert.alert('Leave Vendor', 'Are you sure you want to leave your current vendor? You will need to select a new one.')}
          >
            <Ionicons name="person-remove-outline" size={20} color="#fff" style={styles.actionButtonIcon} />
            <Text style={styles.leaveVendorButtonText}>Leave Current Vendor</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showHolidayModal}
        onRequestClose={() => setShowHolidayModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mark Holiday</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="YYYY-MM-DD (e.g., 2025-07-20)"
              value={holidayDate}
              onChangeText={setHolidayDate}
              keyboardType="default"
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setShowHolidayModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={handleMarkHoliday}
                disabled={isMarkingHoliday}
              >
                {isMarkingHoliday ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Mark Holiday</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showAdHocModal}
        onRequestClose={() => setShowAdHocModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request Ad-hoc Milk</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="YYYY-MM-DD (e.g., 2025-07-20)"
              value={adHocDate}
              onChangeText={setAdHocDate}
              keyboardType="default"
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Quantity in Liters (e.g., 1.5)"
              keyboardType="numeric"
              value={adHocQuantity}
              onChangeText={setAdHocQuantity}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setShowAdHocModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonConfirm}
                onPress={handleRequestAdHocMilk}
                disabled={isRequestingAdHoc}
              >
                {isRequestingAdHoc ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Request Milk</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, paddingTop: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  scrollViewContent: { paddingBottom: 20 },
  sectionCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginHorizontal: 16, marginTop: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
  vendorInfoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  vendorDetails: { flex: 1 },
  vendorName: { fontSize: 16, fontWeight: '600', color: '#333' },
  vendorLocation: { fontSize: 14, color: '#666', marginTop: 2 },
  vendorRating: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  vendorRatingText: { fontSize: 14, color: '#666', marginLeft: 4 },
  changeVendorButton: { backgroundColor: '#e0f7fa', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8 },
  changeVendorButtonText: { color: '#007AFF', fontWeight: 'bold', fontSize: 13 },
  noVendorContainer: { alignItems: 'center', paddingVertical: 20 },
  noVendorText: { fontSize: 16, color: '#666', marginBottom: 15 },
  selectVendorButton: { backgroundColor: '#007AFF', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8 },
  selectVendorButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  subscriptionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  subscriptionLabel: { fontSize: 15, color: '#555', width: 100 },
  subscriptionValueInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 15, color: '#333' },
  subscriptionUnit: { fontSize: 15, color: '#555', marginLeft: 5 },
  frequencyOptions: { flexDirection: 'row', flex: 1, justifyContent: 'space-around' },
  frequencyButton: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 8, borderWidth: 1, borderColor: '#007AFF', backgroundColor: '#fff' },
  frequencyButtonActive: { backgroundColor: '#007AFF' },
  frequencyButtonText: { color: '#007AFF', fontWeight: '600' },
  frequencyButtonTextActive: { color: '#fff' },
  subscriptionStatus: { fontSize: 15, fontWeight: '600', color: '#4CAF50' },
  updateSubscriptionButton: { backgroundColor: '#28a745', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  updateSubscriptionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  noSubscriptionContainer: { alignItems: 'center', paddingVertical: 20 },
  noSubscriptionText: { fontSize: 16, color: '#666', marginBottom: 15 },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0f7fa', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8, marginBottom: 10 },
  actionButtonIcon: { marginRight: 10 },
  actionButtonText: { color: '#007AFF', fontWeight: 'bold', fontSize: 15 },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  billLabel: { fontSize: 15, color: '#555' },
  billValue: { fontSize: 15, fontWeight: '600', color: '#333' },
  billValuePaid: { fontSize: 15, fontWeight: '600', color: '#28a745' },
  billValueDue: { fontSize: 16, fontWeight: 'bold', color: '#dc3545' },
  lastPaymentText: { fontSize: 13, color: '#888', marginTop: 5, textAlign: 'right' },
  payBillButton: { backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 15 },
  payBillButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  viewBillDetailsButton: { backgroundColor: '#f0f0f0', paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 10, borderWidth: 1, borderColor: '#ddd' },
  viewBillDetailsButtonText: { color: '#555', fontWeight: 'bold', fontSize: 14 },
  noRecordsText: { textAlign: 'center', color: '#666', paddingVertical: 10 },
  leaveVendorButton: { backgroundColor: '#dc3545', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 8, marginTop: 15 },
  leaveVendorButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 5 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 20, width: '80%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  modalInput: { width: '100%', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 15, fontSize: 16, color: '#333' },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  modalButtonCancel: { backgroundColor: '#6c757d', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, flex: 1, marginRight: 10, alignItems: 'center' },
  modalButtonConfirm: { backgroundColor: '#007AFF', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, flex: 1, marginLeft: 10, alignItems: 'center' },
  modalButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
});

export default ConsumerHomeScreen;
