import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types'; // VERIFY THIS PATH

type BillDetailsScreenProps = NativeStackScreenProps<RootStackParamList, 'BillDetails'>;

type BillItem = {
  date: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  status: 'Paid' | 'Pending';
};

type FullBillDetails = {
  billId: string;
  month: string;
  totalAmount: number;
  amountPaid: number;
  amountDue: number;
  items: BillItem[];
};

const mockBillDetails: FullBillDetails = {
  billId: 'currentMonthBill',
  month: 'July 2025',
  totalAmount: 750.00,
  amountPaid: 500.00,
  amountDue: 250.00,
  items: [
    { date: '2025-07-01', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Paid' },
    { date: '2025-07-02', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Paid' },
    { date: '2025-07-03', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Paid' },
    { date: '2025-07-04', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Paid' },
    { date: '2025-07-05', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Paid' },
    { date: '2025-07-06', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Paid' },
    { date: '2025-07-07', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Paid' },
    { date: '2025-07-08', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Paid' },
    { date: '2025-07-09', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Paid' },
    { date: '2025-07-10', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Paid' },
    { date: '2025-07-11', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Pending' },
    { date: '2025-07-12', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Pending' },
    { date: '2025-07-13', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Pending' },
    { date: '2025-07-14', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Pending' },
    { date: '2025-07-15', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Pending' },
    { date: '2025-07-16', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Pending' },
    { date: '2025-07-17', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Pending' },
    { date: '2025-07-18', description: 'Milk (Daily)', quantity: 1.5, unitPrice: 25, amount: 37.50, status: 'Pending' },
  ],
};

const mockFetchBillDetails = async (billId: string): Promise<FullBillDetails> => {
  console.log(`Mock API: Fetching bill details for bill ID: ${billId}`);
  // CORRECTED: Wrap resolve in an arrow function - This is already correct.
  await new Promise(resolve => setTimeout(() => resolve(undefined), 1500));
  return mockBillDetails;
};

const BillDetailsScreen = () => {
  const route = useRoute<BillDetailsScreenProps['route']>();
  const navigation = useNavigation();
  const { billId } = route.params;

  const [billDetails, setBillDetails] = useState<FullBillDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await mockFetchBillDetails(billId);
        setBillDetails(data);
      } catch (err: any) {
        console.error('Failed to fetch bill details:', err);
        Alert.alert('Error', 'Could not load bill details. Please try again.');
        setError('Failed to load bill details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [billId]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading bill details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!billDetails) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Bill details not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill Details ({billDetails.month})</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount:</Text>
            <Text style={styles.summaryValue}>₹ {billDetails.totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount Paid:</Text>
            <Text style={styles.summaryValuePaid}>₹ {billDetails.amountPaid.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Amount Due:</Text>
            <Text style={styles.summaryValueDue}>₹ {billDetails.amountDue.toFixed(2)}</Text>
          </View>
        </View>

        <Text style={styles.itemsHeader}>Daily Items</Text>
        <View style={styles.itemsList}>
          {billDetails.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemDateDesc}>
                <Text style={styles.itemDate}>{item.date}</Text>
                <Text style={styles.itemDescription}>{item.description} ({item.quantity}L)</Text>
              </View>
              <Text style={styles.itemAmount}>₹ {item.amount.toFixed(2)}</Text>
              <Text style={[styles.itemStatus, item.status === 'Paid' ? styles.statusPaid : styles.statusPending]}>
                {item.status}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
  errorText: { fontSize: 16, color: 'red', textAlign: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  backButton: { padding: 5 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: 'bold', color: '#333', textAlign: 'center', marginHorizontal: 10 },
  scrollViewContent: { paddingHorizontal: 16, paddingBottom: 20 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginTop: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  summaryLabel: { fontSize: 15, color: '#555' },
  summaryValue: { fontSize: 15, fontWeight: '600', color: '#333' },
  summaryValuePaid: { fontSize: 15, fontWeight: '600', color: '#28a745' },
  summaryValueDue: { fontSize: 16, fontWeight: 'bold', color: '#dc3545' },
  itemsHeader: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 10 },
  itemsList: { backgroundColor: '#fff', borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemDateDesc: { flex: 2 },
  itemDate: { fontSize: 13, color: '#888' },
  itemDescription: { fontSize: 15, fontWeight: '500', color: '#333', marginTop: 2 },
  itemAmount: { flex: 0.8, fontSize: 15, fontWeight: '600', color: '#333', textAlign: 'right' },
  itemStatus: { fontSize: 12, fontWeight: 'bold', paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4, marginLeft: 10 },
  statusPaid: { backgroundColor: '#d4edda', color: '#155724' },
  statusPending: { backgroundColor: '#f8d7da', color: '#721c24' },
});

export default BillDetailsScreen;
