
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  getAllVendors,
  getConsumerDetailsById,
  getJoinAssignmentStatus,
  createRequest,
} from '../../apiServices/allApi';

type Vendor = {
  id: string | number;
  name?: string;
  contact?: string;
  address?: {
    village?: string;
    tal?: string;
    dist?: string;
    pincode?: number;
  };
  village?: string;
  tal?: string;
  dist?: string;
  cr?: number | string;
  br?: number | string;
  cow_rate?: number | string;
  buffalo_rate?: number | string;
  gir_cow_rate?: number | string;
  jarshi_cow_rate?: number | string;
  deshi_cow_rate?: number | string;
  pincode?: number;
};

const ConsumerHomeScreen = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [joinedVendor, setJoinedVendor] = useState<Vendor | null>(null);
  const [joinStatus, setJoinStatus] = useState<string>('');
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!user?.userID) { return; }

    setLoading(true);
    try {
      // Get consumer profile to fetch pincode
      const profileRes = await getConsumerDetailsById(Number(user.userID));
      const pincode = profileRes?.data?.data?.pincode || profileRes?.data?.pincode || '';

      // Check if consumer is already joined to a vendor
      const assignRes = await getJoinAssignmentStatus(Number(user.userID), 'customer');

      if (assignRes?.data?.isJoined && assignRes?.data?.status === 'accepted') {
        const vendorDetails = assignRes.data.vendorDetails;
        setJoinedVendor(vendorDetails || null);
        setJoinStatus(assignRes.data.status || '');

        if (vendorDetails) {
          // Fetch full vendor list to get complete rate information
          try {
            const vendorRes = await getAllVendors(pincode || undefined);
            let vList: any = null;

            if (vendorRes?.data?.data) {
              vList = vendorRes.data.data;
            } else if (vendorRes?.data?.vendors) {
              vList = vendorRes.data.vendors;
            } else if (vendorRes?.data?.results) {
              vList = vendorRes.data.results;
            } else if (Array.isArray(vendorRes?.data)) {
              vList = vendorRes.data;
            } else if (Array.isArray(vendorRes)) {
              vList = vendorRes;
            }

            // Find the joined vendor in the full list to get complete data
            if (Array.isArray(vList) && vList.length > 0) {
              const fullVendorData = vList.find((v: any) => v.id === vendorDetails.id);
              if (fullVendorData) {
                // Merge assignment details with full vendor data
                setVendors([{ ...fullVendorData, ...vendorDetails }]);
              } else {
                setVendors([vendorDetails]);
              }
            } else {
              setVendors([vendorDetails]);
            }
          } catch (err) {
            console.log('Could not fetch full vendor list, using assignment details only');
            setVendors([vendorDetails]);
          }
        }
      } else {
        setJoinedVendor(null);
        setJoinStatus('');

        // Fetch all available vendors
        const vendorRes = await getAllVendors(pincode || undefined);

        // Parse vendor list from different possible response structures
        let vList: any = null;
        if (vendorRes?.data?.data) {
          vList = vendorRes.data.data;
        } else if (vendorRes?.data?.vendors) {
          vList = vendorRes.data.vendors;
        } else if (vendorRes?.data?.results) {
          vList = vendorRes.data.results;
        } else if (Array.isArray(vendorRes?.data)) {
          vList = vendorRes.data;
        } else if (Array.isArray(vendorRes)) {
          vList = vendorRes;
        }

        setVendors(Array.isArray(vList) && vList.length > 0 ? vList : []);
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
      setVendors([]);
      Alert.alert('Error', err?.message || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  }, [user?.userID]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sendJoinRequest = async (vendorId: string | number) => {
    if (!user?.userID) {
      Alert.alert('Error', 'User not logged in');
      return;
    }

    try {
      setSubmittingId(vendorId.toString());
      await createRequest({
        user_id: Number(user.userID),
        user_type: 'customer',
        vendor: Number(vendorId),
      });

      Alert.alert('Success', 'Join request sent successfully!');
      loadData();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send join request');
    } finally {
      setSubmittingId(null);
    }
  };

  const getVillage = (vendor: Vendor): string => {
    if (vendor.village) { return vendor.village; }
    if (vendor.tal) { return vendor.tal; }
    if (vendor.address?.village) { return vendor.address.village; }
    if (vendor.address?.tal) { return vendor.address.tal; }
    return 'N/A';
  };

  const getCowRate = (vendor: Vendor): string => {
    // First check standard field names from vendor list
    let rate = vendor.cr || vendor.cow_rate;

    // If not found, check individual cow rate types and use the first non-zero value
    if (!rate || (typeof rate === 'number' && rate === 0) || (typeof rate === 'string' && parseFloat(rate) === 0)) {
      const gir = vendor.gir_cow_rate;
      const jarshi = vendor.jarshi_cow_rate;
      const deshi = vendor.deshi_cow_rate;

      if (gir && parseFloat(gir.toString()) > 0) {
        rate = gir;
      } else if (jarshi && parseFloat(jarshi.toString()) > 0) {
        rate = jarshi;
      } else if (deshi && parseFloat(deshi.toString()) > 0) {
        rate = deshi;
      }
    }

    if (rate) {
      const numRate = typeof rate === 'string' ? parseFloat(rate) : rate;
      if (!isNaN(numRate) && numRate > 0) {
        return `₹${numRate}/L`;
      }
    }
    return 'N/A';
  };

  const getBuffaloRate = (vendor: Vendor): string => {
    // Check multiple possible field names for buffalo rate
    const rate = vendor.br || vendor.buffalo_rate;

    if (rate) {
      const numRate = typeof rate === 'string' ? parseFloat(rate) : rate;
      if (!isNaN(numRate) && numRate > 0) {
        return `₹${numRate}/L`;
      }
    }
    return 'N/A';
  };

  if (!isAuthenticated || !user?.userID) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>
            {joinedVendor ? 'Your Vendor' : 'Available Vendors'}
          </Text>
          <Text style={styles.subtitle}>
            {joinedVendor ? 'Connected vendor details' : 'Find and connect with vendors'}
          </Text>
        </View>
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={styles.loadingText}>Loading vendors...</Text>
        </View>
      ) : (
        <FlatList
          data={vendors}
          keyExtractor={(item, index) => item?.id?.toString() || `vendor-${index}`}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={[styles.card, joinedVendor && styles.joinedCard]}>
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.iconCircle}>
                  <Ionicons name="business" size={24} color="#1976D2" />
                </View>
                <View style={styles.cardTitleContainer}>
                  <Text style={styles.vendorName}>{item.name || 'Vendor'}</Text>
                  {joinedVendor && (
                    <View style={styles.statusBadge}>
                      <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                      <Text style={styles.statusText}>{joinStatus}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Vendor Info */}
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={18} color="#666" />
                  <Text style={styles.infoText}>{item.contact || 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={18} color="#666" />
                  <Text style={styles.infoText}>{getVillage(item)}</Text>
                </View>
              </View>

              {/* Milk Rates */}
              <View style={styles.ratesContainer}>
                <View style={styles.rateBox}>
                  <Text style={styles.rateLabel}>Cow Milk</Text>
                  <Text style={styles.rateValue}>{getCowRate(item)}</Text>
                </View>
                <View style={styles.rateDivider} />
                <View style={styles.rateBox}>
                  <Text style={styles.rateLabel}>Buffalo Milk</Text>
                  <Text style={styles.rateValue}>{getBuffaloRate(item)}</Text>
                </View>
              </View>

              {/* Join Button (only if not joined) */}
              {!joinedVendor && (
                <TouchableOpacity
                  style={[
                    styles.button,
                    submittingId === item.id.toString() && styles.buttonDisabled,
                  ]}
                  onPress={() => sendJoinRequest(item.id)}
                  disabled={submittingId === item.id.toString()}
                >
                  {submittingId === item.id.toString() ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Ionicons name="add-circle-outline" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Join Vendor</Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="storefront-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No vendors available</Text>
              <Text style={styles.emptySubtext}>
                Check your pincode or try again later
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  header: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#E3F2FD',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  joinedCard: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8F4',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  vendorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#424242',
    marginLeft: 8,
  },
  ratesContainer: {
    flexDirection: 'row',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  rateBox: {
    flex: 1,
    alignItems: 'center',
  },
  rateDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 16,
  },
  rateLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  button: {
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ConsumerHomeScreen;
