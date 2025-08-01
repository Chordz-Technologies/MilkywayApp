import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../navigation/types';
import { getAllVendors, createRequest } from '../../apiServices/allApi';

type DistributorHomeNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'DistributorHome'
>;

type Vendor = {
  id: number;
  name: string;
  contact: string;
  address?: string;
};

const DistributorHomeScreen = () => {
  const navigation = useNavigation<DistributorHomeNavProp>();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [requestedVendors, setRequestedVendors] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submittingId, setSubmittingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const vendorsResponse = await getAllVendors();
      setVendors(vendorsResponse?.data?.data || []);
    } catch (err: any) {
      setError('Failed to load vendors. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleRequest = async (vendorId: number) => {
    try {
      const distributorId = await AsyncStorage.getItem('userID');
      if (!distributorId) throw new Error('Distributor ID not found.');

      const payload = {
        user_id: parseInt(distributorId, 10),
        user_type: 'milkman',
        vendor: vendorId,
      };

      setSubmittingId(vendorId);
      await createRequest(payload);
      Alert.alert('Success', 'Request sent to vendor!');
      setRequestedVendors(prev => [...prev, vendorId]);
    } catch (err) {
      Alert.alert('Error', 'Could not send request. Try again.');
    } finally {
      setSubmittingId(null);
    }
  };

  const renderVendor = ({ item }: { item: Vendor }) => {
    const hasRequested = requestedVendors.includes(item.id);
    const isSubmitting = submittingId === item.id;

    return (
      <View style={styles.card}>
        <View style={styles.infoBlock}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location}>📞 {item.contact}</Text>
          <Text style={styles.location}>📍 {item.address || 'Not Provided'}</Text>
        </View>
        <TouchableOpacity
          style={[styles.reqBtn, hasRequested && styles.reqBtnDisabled]}
          onPress={() => !hasRequested && !isSubmitting && handleRequest(item.id)}
          disabled={hasRequested || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.reqTxt}>
              {hasRequested ? 'Requested' : 'Request to Join'}
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
        <Text style={styles.headerTitle}>Available Vendors</Text>
        <View style={{ width: 24 }} />
      </View>

      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorTxt}>{error}</Text>
          <TouchableOpacity onPress={fetchData} style={styles.retry}>
            <Text style={styles.retryTxt}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={vendors}
        renderItem={renderVendor}
        keyExtractor={v => v.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : (
              <Text style={styles.emptyTxt}>No vendors available.</Text>
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
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff0f0',
    padding: 12,
    justifyContent: 'space-between',
  },
  errorTxt: { color: '#c00', fontSize: 14, flex: 1 },
  retry: {
    backgroundColor: '#007AFF',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  retryTxt: { color: '#fff', fontSize: 12 },
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
  infoBlock: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  location: { fontSize: 14, color: '#666', marginTop: 4 },
  reqBtn: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  reqBtnDisabled: { backgroundColor: '#C0C0C0' },
  reqTxt: { color: '#fff', fontWeight: '600' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTxt: { color: '#666', fontSize: 18, textAlign: 'center' },
});

export default DistributorHomeScreen;
