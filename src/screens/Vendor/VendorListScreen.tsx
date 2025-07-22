import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

// Assuming Vendor type is also correctly exported from '../../navigation/types'
import { RootStackParamList, Vendor } from '../../navigation/types';

type VendorListScreenProps = NativeStackScreenProps<RootStackParamList, 'VendorList'>;

const mockAvailableVendors: Vendor[] = [
  { id: 'v1', name: 'Shankar Milk Vendor', location: 'Pune', rating: 4.7 },
  { id: 'v2', name: 'Gopal Dairy', location: 'Mumbai', rating: 4.5 },
  { id: 'v3', name: 'Pure Milk Supplies', location: 'Bangalore', rating: 4.9 },
  { id: 'v4', name: 'Krishna Milk Mart', location: 'Delhi', rating: 4.2 },
];

const mockFetchAvailableVendors = async (): Promise<Vendor[]> => {
  console.log('Mock API: Fetching available vendors...');
  // The setTimeout fix is correctly applied here.
  await new Promise(resolve => setTimeout(() => resolve(undefined), 1500));
  return mockAvailableVendors;
};

const VendorListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<VendorListScreenProps['route']>();

  // Ensure onSelectVendor is correctly typed in RootStackParamList if it's optional
  // (which it is, by the `?` operator here)
  const onSelectVendor = route.params?.onSelectVendor;

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await mockFetchAvailableVendors();
        setVendors(data);
      } catch (err: any) { // Using 'any' for error, which is common in JS/TS for caught errors without explicit type.
        console.error('Failed to fetch vendors:', err);
        Alert.alert('Error', 'Could not load vendors. Please try again.');
        setError('Failed to load vendors.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchVendors();
  }, []); // Empty dependency array means this runs once on component mount

  const handleVendorPress = (vendor: Vendor) => {
    if (onSelectVendor) {
      onSelectVendor(vendor);
      navigation.goBack(); // Navigate back after selection
    } else {
      Alert.alert('Error', 'Selection handler not available. Please restart the app.');
    }
  };

  const renderVendorItem = ({ item }: { item: Vendor }) => (
    <TouchableOpacity style={styles.vendorItem} onPress={() => handleVendorPress(item)}>
      <View style={styles.vendorInfo}>
        <Text style={styles.vendorName}>{item.name}</Text>
        <Text style={styles.vendorLocation}>{item.location}</Text>
      </View>
      <View style={styles.vendorRating}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={styles.vendorRatingText}>{item.rating}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#C0C0C0" />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading vendors...</Text>
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select a Vendor</Text>
        <View style={{ width: 24 }} /> {/* Spacer to center title */}
      </View>
      <FlatList
        data={vendors}
        renderItem={renderVendorItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.centered}>
            <Text>No vendors available.</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#555' },
  errorText: { fontSize: 16, color: 'red' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 50, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' }, // Flex 1 might be needed here to truly center
  listContent: { paddingHorizontal: 16, paddingVertical: 10 },
  vendorItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  vendorInfo: { flex: 1 },
  vendorName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  vendorLocation: { fontSize: 13, color: '#666', marginTop: 2 },
  vendorRating: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
  vendorRatingText: { fontSize: 13, color: '#666', marginLeft: 4 },
});

export default VendorListScreen;
