import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
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
import { getAllVendors, createRequest, getDistributorRequests } from '../../apiServices/allApi';

// Note: The MilkProductsList import has been removed.

type DistributorHomeNavProp = NativeStackNavigationProp<RootStackParamList, 'DistributorHome'>;

type Vendor = {
  id: string;
  name: string;
  location: string;
  rating?: number;
};

type Request = {
  id: string;
  vendor: string; // CORRECTED: from vendor_id to vendor
  user_id: string;
  user_role: 'customer' | 'milkman';
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
};

const DistributorHomeScreen = () => {
  const navigation = useNavigation<DistributorHomeNavProp>();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitId, setSubmitId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const distributorId = await AsyncStorage.getItem('userID');
      if (!distributorId || distributorId === 'null' || distributorId === 'undefined') {
        throw new Error('Please log in again. Distributor ID not found.');
      }

      // Fetch vendors and requests in parallel
      const [vendorRes, reqRes] = await Promise.all([
        getAllVendors(),
        getDistributorRequests(distributorId),
      ]);

      const vendorsData: Vendor[] = Array.isArray(vendorRes?.data) ? vendorRes.data : [];
      const requestsData: Request[] = Array.isArray(reqRes?.data) ? reqRes.data : [];

      setVendors(vendorsData);
      setRequests(requestsData);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError('Failed to load data. Please pull down to refresh.');
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

  const handleRequest = async (vendorId: string) => {
    try {
      const distributorId = await AsyncStorage.getItem('userID');
      if (!distributorId) {throw new Error('Distributor ID not found');}

      setSubmitId(vendorId);

      await createRequest({
        vendorId,
        userId: distributorId,
        userRole: 'milkman',
      });

      await fetchData();
      Alert.alert('Success', 'Request sent to vendor!');
    } catch (err: any) {
      console.error('Request error:', err);
      if (err.response) {
        console.error('API Error Response:', err.response.data);
        Alert.alert('Error', `Server rejected the request: ${JSON.stringify(err.response.data)}`);
      } else {
        Alert.alert('Error', 'Could not send request. Check your network and try again.');
      }
    } finally {
      setSubmitId(null);
    }
  };

  // Create a set of vendor IDs that have accepted the request
  const acceptedVendorIds = new Set(
    requests.filter(r => r.status === 'accepted').map(r => r.vendor)
  );

  // If a vendor has accepted, do not show any other vendors.
  const showVendorList = acceptedVendorIds.size === 0;

  // Filter out vendors if the list should be shown
  const availableVendors = showVendorList ? vendors : [];

  const statusForVendor = (vendorId: string) =>
    requests.find(r => r.vendor === vendorId)?.status ?? null;

  const isSubmitting = (vendorId: string) => submitId === vendorId;

  const renderVendor = ({ item }: { item: Vendor }) => {
    const status = statusForVendor(item.id);
    const disabled = !!status && status !== 'rejected';

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.infoBlock}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location}>{item.location}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingTxt}>{typeof item.rating === 'number' ? item.rating.toFixed(1) : 'N/A'}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.reqBtn,
            (disabled || isSubmitting(item.id)) && styles.reqBtnDisabled,
            status === 'accepted' && styles.reqBtnAccepted,
          ]}
          onPress={() => !disabled && !isSubmitting(item.id) && handleRequest(item.id)}
          disabled={disabled || isSubmitting(item.id)}
        >
          {isSubmitting(item.id) ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={[ styles.reqTxt, status === 'accepted' && styles.reqTxtAccepted ]}>
              {status === 'pending' ? 'Pending'
                : status === 'accepted' ? 'Joined'
                : status === 'rejected' ? 'Try Again'
                : 'Request'}
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
        data={availableVendors}
        renderItem={renderVendor}
        keyExtractor={v => v.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        // ListHeaderComponent has been removed
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            {loading ? (
              <ActivityIndicator size="large" color="#007AFF" />
            ) : showVendorList ? (
              <Text style={styles.emptyTxt}>No vendors available.</Text>
            ) : (
               <Text style={styles.emptyTxt}>You have already joined a vendor.</Text>
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
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  infoBlock: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  location: { fontSize: 14, color: '#666', marginTop: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  ratingTxt: { marginLeft: 4, color: '#666', fontSize: 14 },
  reqBtn: {
    backgroundColor: '#FF6B35',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 110,
    alignItems: 'center',
  },
  reqBtnDisabled: { backgroundColor: '#C0C0C0' },
  reqBtnAccepted: { backgroundColor: '#4CD964' },
  reqTxt: { color: '#fff', fontWeight: '600' },
  reqTxtAccepted: { color: '#fff' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTxt: { color: '#666', fontSize: 16, textAlign: 'center' },
});

export default DistributorHomeScreen;
