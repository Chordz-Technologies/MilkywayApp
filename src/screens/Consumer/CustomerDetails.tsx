
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Calendar } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons';

// IMPORTANT: You will need to replace these with your actual API service imports
// For example:
// import { fetchCustomerMilkRecords } from '../../apiServices/customerApi';
// Make sure 'customerApi.ts' (or similar) contains functions that fetch
// records specifically for a customer. The update function is no longer needed here.

// =====================================================================
// 1. Type Definitions
// =====================================================================

type CustomerDetailRouteProp = RouteProp<RootStackParamList, 'CustomerDetail'>;
type CustomerDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CustomerDetail'>;

// Type for a single milk delivery record
type MilkRecord = {
  date: string; // YYYY-MM-DD format (e.g., '2025-07-14')
  quantity: number; // in liters
  paid: boolean;
};

// Interface for the markedDates object expected by react-native-calendars
interface CalendarMarkedDates {
  [date: string]: {
    selected: boolean;
    customStyles: {
      container: {
        backgroundColor: string;
      };
      text: {
        color: string;
        fontWeight: 'bold';
      };
    };
  };
}

// =====================================================================
// 2. Constants
// =====================================================================

const MILK_PRICE_PER_LITER = 50; // Example price per liter (e.g., INR)

// =====================================================================
// 3. Mock API Functions (<<< --- REPLACE THESE WITH YOUR ACTUAL API FUNCTIONS --- >>>)
// These are placeholders for the API calls you need to make to your backend.
// You should define these in your 'apiServices' folder.
// The mockUpdateMilkRecord is now removed as it's not needed for view-only.
// =====================================================================

// Mock API function to simulate fetching milk records for a specific customer
const mockFetchMilkRecords = async (customerId: string): Promise<MilkRecord[]> => {
  console.log(`Mock API: Fetching milk records for customer ID: ${customerId}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(() => resolve(undefined), 1000));

  // In a real app, this would be an axios.get call to your backend:
  // For example:
  // const response = await fetchCustomerMilkRecords(customerId);
  // return response.data;

  // Dummy data for demonstration. In real API, this would come from the backend.
  const dummyMilkRecords: MilkRecord[] = [
    { date: '2025-07-01', quantity: 1, paid: true },
    { date: '2025-07-02', quantity: 1.5, paid: false },
    { date: '2025-07-03', quantity: 1, paid: true },
    { date: '2025-07-04', quantity: 0, paid: false }, // No milk bought (Leave)
    { date: '2025-07-05', quantity: 1, paid: true },
    { date: '2025-07-06', quantity: 1.5, paid: false },
    { date: '2025-07-07', quantity: 1, paid: true },
    { date: '2025-07-08', quantity: 0, paid: false }, // No milk bought (Leave)
    { date: '2025-07-09', quantity: 1, paid: true },
    { date: '2025-07-10', quantity: 1, paid: false },
    { date: '2025-07-11', quantity: 1.5, paid: true },
    { date: '2025-07-12', quantity: 0, paid: false },
    { date: '2025-07-13', quantity: 1, paid: false },
    { date: '2025-07-14', quantity: 1.5, paid: true }, // Current date
    { date: '2025-07-15', quantity: 0, paid: false }, // Future date (initially no delivery)
    { date: '2025-07-16', quantity: 1, paid: false },
    { date: '2025-07-30', quantity: 1, paid: true}, // Future date (initially pending)
  ];
  return dummyMilkRecords;
};

// mockUpdateMilkRecord function is removed as editing is disabled.

// =====================================================================
// 4. CustomerDetailScreen Component
// =====================================================================

const CustomerDetailScreen = () => {
  const route = useRoute<CustomerDetailRouteProp>();
  const navigation = useNavigation<CustomerDetailNavigationProp>();

  const { customerId, customerName } = route.params;

  const [milkRecords, setMilkRecords] = useState<MilkRecord[]>([]);
  const [markedDates, setMarkedDates] = useState<CalendarMarkedDates>({});
  const [isLoading, setIsLoading] = useState(false); // Only for initial data load

  // Function to fetch milk records for the current customer
  const getMilkRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      // --- Use your actual API function here instead of mockFetchMilkRecords ---
      const data = await mockFetchMilkRecords(customerId);
      // ---------------------------------------------------------------------
      setMilkRecords(data);
    } catch (error) {
      console.error('Failed to fetch milk records:', error);
      Alert.alert('Error', 'Could not load milk records. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [customerId]); // Dependency on customerId ensures re-fetch if customer changes

  // Effect to fetch data when the component mounts or customerId changes
  useEffect(() => {
    getMilkRecords();
  }, [getMilkRecords]); // Dependency on getMilkRecords to trigger fetch

  // Effect to prepare `markedDates` for the calendar whenever `milkRecords` changes
  useEffect(() => {
    const dates: CalendarMarkedDates = {};
    milkRecords.forEach(record => {
      // Logic for coloring dates:
      // Green: Milk delivered (quantity > 0) AND paid
      // Red: Milk delivered (quantity > 0) but payment pending (paid: false)
      // Light Red: No milk delivered (quantity === 0), representing "Leave" or skipped delivery
      const backgroundColor =
        record.quantity > 0 && record.paid
          ? '#D4EDDA' // Green for delivered and paid
          : record.quantity > 0 && !record.paid
          ? '#F8D7DA' // Red for delivered but pending
          : '#FFC0CB'; // Light Red for no delivery/leave

      const textColor =
        record.quantity > 0 && record.paid
          ? '#155724'
          : record.quantity > 0 && !record.paid
          ? '#721C24'
          : '#B22222'; // Darker red for no delivery text

      dates[record.date] = {
        selected: true,
        customStyles: {
          container: {
            backgroundColor: backgroundColor,
          },
          text: {
            color: textColor,
            fontWeight: 'bold',
          },
        },
      };
    });
    setMarkedDates(dates);
  }, [milkRecords]); // Rerun this effect if milkRecords change

  // handleDayPress function is removed as editing is disabled.

  // Calculate summary statistics
  const totalMilkQuantity = milkRecords.reduce((sum, record) => sum + record.quantity, 0);
  const totalAmount = totalMilkQuantity * MILK_PRICE_PER_LITER;

  const totalPaid = milkRecords.reduce((sum, record) => {
    // Only count as paid if milk was delivered AND marked as paid
    if (record.paid && record.quantity > 0) {
      return sum + record.quantity * MILK_PRICE_PER_LITER;
    }
    return sum;
  }, 0);

  const totalRemaining = totalAmount - totalPaid;

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{customerName}'s Details</Text>
      </View>

      {/* Main Content ScrollView */}
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Milk Delivery Calendar Section */}
        <Text style={styles.sectionHeader}>Milk Delivery Calendar</Text>
        <View style={styles.calendarContainer}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#007AFF" style={{ paddingVertical: 50 }} />
          ) : (
            <Calendar
              markingType={'custom'}
              markedDates={markedDates}
              enableSwipeMonths={true}
              // onDayPress={handleDayPress} // <--- REMOVED: Disables editing functionality
              theme={{
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#b6c1cd',
                selectedDayBackgroundColor: '#00adf5',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#00adf5',
                // Added opacity to `dayTextColor` to visually indicate non-interactiveness
                dayTextColor: 'rgba(45, 65, 80, 0.8)',
                textDisabledColor: '#d9e1e8',
                dotColor: '#00adf5',
                selectedDotColor: '#ffffff',
                arrowColor: '#007AFF',
                monthTextColor: '#007AFF',
                textDayFontFamily: 'monospace',
                textMonthFontFamily: 'monospace',
                textDayHeaderFontFamily: 'monospace',
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 16,
              }}
            />
          )}
          {/* Removed isUpdating overlay as editing is disabled */}
        </View>

        {/* Summary Section */}
        <Text style={styles.sectionHeader}>Summary</Text>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Milk Purchased:</Text>
            <Text style={styles.summaryValue}>{totalMilkQuantity.toFixed(1)} Liters</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount Due:</Text>
            <Text style={styles.summaryValue}>₹ {totalAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Paid:</Text>
            <Text style={styles.summaryValuePaid}>₹ {totalPaid.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Remaining Payment:</Text>
            <Text style={styles.summaryValueRemaining}>₹ {totalRemaining.toFixed(2)}</Text>
          </View>
        </View>

        {/* Daily Records Section */}
        <Text style={styles.sectionHeader}>Daily Records</Text>
        <View style={styles.dailyRecordsCard}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : milkRecords.length === 0 ? (
            <Text style={styles.noRecordsText}>No milk records available for this customer.</Text>
          ) : (
            milkRecords.map((record, index) => (
              <View key={index} style={styles.recordRow}>
                <Text style={styles.recordDate}>{record.date}</Text>
                <Text style={styles.recordQuantity}>
                  {record.quantity > 0 ? `${record.quantity} L` : 'Leave'}
                </Text>
                <Text
                  style={[
                    styles.recordStatus,
                    record.paid ? styles.statusPaid : styles.statusPending,
                  ]}
                >
                  {record.quantity === 0 ? '-' : record.paid ? 'Paid' : 'Pending'}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// =====================================================================
// 5. Styles
// =====================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50, // Adjust for iOS notch/status bar
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'flex-start',
  },
  backButton: {
    marginRight: 10,
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  calendarContainer: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative', // For overlay loading (now removed)
  },
  // Removed overlayLoading and overlayText styles as they are no longer needed
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  summaryValuePaid: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CD964',
  },
  summaryValueRemaining: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  dailyRecordsCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recordDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1.5,
  },
  recordQuantity: {
    fontSize: 15,
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  recordStatus: {
    fontSize: 14,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    flex: 0.8,
    textAlign: 'center',
  },
  statusPaid: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusPending: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  noRecordsText: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 10,
  },
});

export default CustomerDetailScreen;