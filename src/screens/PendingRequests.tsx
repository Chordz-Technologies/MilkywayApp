
import React, { useEffect, useState, useCallback, useRef } from 'react';
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
  Animated,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  getVendorPendingRequests,
  acceptRequest,
  rejectRequest,
} from '../apiServices/allApi';
import SafeAreaWrapper from '../styles/SafeAreaWrapper';

type Request = {
  id: number;
  user_id: number;
  status: string;
  customer?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  milkman?: {
    id: number;
    full_name: string;
  };
  name?: string | null;
  user_type: 'customer' | 'milkman';
  user_contact: string;
  vendor: number;
};

type NavigationProp = any;

// **SKELETON LOADER COMPONENT**
const SkeletonRequestItem = React.memo(() => {
  const shimmerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startShimmer = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    startShimmer();

    return () => {
      shimmerAnimation.stopAnimation();
    };
  }, [shimmerAnimation]);

  const shimmerOpacity = shimmerAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.skeletonItem}>
      <View style={styles.skeletonContent}>
        <Animated.View style={[styles.skeletonName, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.skeletonText, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.skeletonText, { opacity: shimmerOpacity, width: '60%' }]} />
        <Animated.View style={[styles.skeletonText, { opacity: shimmerOpacity, width: '40%' }]} />
      </View>
      <View style={styles.skeletonActions}>
        <Animated.View style={[styles.skeletonButton, { opacity: shimmerOpacity }]} />
        <Animated.View style={[styles.skeletonButton, { opacity: shimmerOpacity }]} />
      </View>
    </View>
  );
});

// **ANIMATED REQUEST ITEM COMPONENT**
const AnimatedRequestItem = React.memo(({
  item,
  onAccept,
  onReject,
  processing,
  processingRequestId,
  rejectingRequestId,
}: {
  item: Request;
  onAccept: () => void;
  onReject: () => void;
  processing: boolean;
  processingRequestId: number | null;
  rejectingRequestId: number | null;
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const slideValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    return () => {
      scaleValue.stopAnimation();
      slideValue.stopAnimation();
      fadeValue.stopAnimation();
    };
  }, [scaleValue, slideValue, fadeValue]);

  const handlePress = useCallback(() => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleValue]);

  const getDisplayName = useCallback(() => {
    let displayName = item.name || 'Unknown';

    if (item.user_type === 'customer' && item.customer) {
      const firstName = item.customer.first_name || '';
      const lastName = item.customer.last_name || '';
      displayName = `${firstName} ${lastName}`.trim();
    } else if (item.user_type === 'milkman' && item.milkman) {
      displayName = item.milkman.full_name || 'Unknown Distributor';
    }

    return displayName;
  }, [item]);

  const displayName = getDisplayName();
  const contactInfo = item.user_contact;
  const roleText = item.user_type === 'customer' ? 'Consumer' : 'Distributor';
  const isPending = ['pending', 'requested', 'waiting'].includes(item.status?.toLowerCase());

  const translateY = slideValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <Animated.View
      style={[
        styles.requestCard, // ✅ SAME CARD STYLE
        {
          transform: [{ scale: scaleValue }, { translateY }],
          opacity: fadeValue,
        },
      ]}
    >
      {/* HEADER */}
      <View style={styles.requestHeader}>
        <View style={styles.distributorInfo}>
          <View
            style={[
              styles.avatarCircle,
              { backgroundColor: item.user_type === 'customer' ? '#007AFF' : '#FF9500' },
            ]}
          >
            <Ionicons
              name={item.user_type === 'customer' ? 'person' : 'business'}
              size={22}
              color="#fff"
            />
          </View>

          <View style={styles.distributorDetails}>
            <Text style={styles.distributorName}>{displayName}</Text>

            {/* {contactInfo && (
              <Text style={styles.distributorContact}>{contactInfo}</Text>
            )} */}
          </View>
        </View>

        <View style={styles.statusBadge}>
          <Ionicons name="time-outline" size={14} color={getStatusColor(item.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {(item.status || 'pending').toUpperCase()}
          </Text>
        </View>
      </View>

      {/* BODY */}
      <TouchableOpacity activeOpacity={0.7} onPress={handlePress}>
        <View style={styles.requestBody}>
          <View style={styles.infoRow}>
            <Ionicons name="call" size={16} color="#666" />
            <Text style={styles.distributorContact}>{contactInfo}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{roleText}</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* ACTION BUTTONS */}
      {isPending && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={onAccept}
            disabled={processing}
            activeOpacity={0.7}
          >
            {processingRequestId === item.id ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                <Text style={styles.acceptButtonText}>Accept</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={onReject}
            disabled={processing}
            activeOpacity={0.7}
          >
            {rejectingRequestId === item.id ? (
              <ActivityIndicator size="small" color="#FF3B30" />
            ) : (
              <>
                <Ionicons name="close-circle-outline" size={20} color="#FF3B30" />
                <Text style={styles.rejectButtonText}>Reject</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
});

const getStatusColor = (status?: string): string => {
  switch (status?.toLowerCase()) {
    case 'pending':
    case 'requested':
    case 'waiting':
      return '#FF9500';
    case 'accepted':
      return '#34C759';
    case 'rejected':
      return '#FF3B30';
    default:
      return '#8E8E93';
  }
};

const PendingRequestsScreen = () => {
  const navigationHook = useNavigation<NavigationProp>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingRequestId, setProcessingRequestId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [rejectingRequestId, setRejectingRequestId] = useState<number | null>(null);

  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    return () => {
      headerOpacity.stopAnimation();
    };
  }, [headerOpacity]);

  const handleGoBack = useCallback(() => {
    if (navigationHook.canGoBack()) {
      navigationHook.goBack();
    } else {
      const getHomeScreen = (): string => {
        switch (user?.role) {
          case 'customer': return 'ConsumerHome';
          case 'milkman': return 'DistributorHome';
          case 'vendor': return 'VendorHome';
          default: return 'VendorHome';
        }
      };

      const resetAction = CommonActions.reset({
        index: 0,
        routes: [{ name: getHomeScreen() }],
      });

      navigationHook.dispatch(resetAction);
    }
  }, [navigationHook, user?.role]);

  useEffect(() => {
    const backAction = () => {
      handleGoBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [handleGoBack]);

  const fetchRequests = useCallback(async () => {
    setError(null);
    setLoading(true);

    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const vendorId = user?.userID;

        if (!vendorId) {
          throw new Error('Vendor ID not found. Please log in again.');
        }

        console.log(`Attempt ${retryCount + 1}: Fetching requests for vendor ID:`, vendorId);

        const response = await getVendorPendingRequests(vendorId);
        console.log('✅ Pending requests API success:', response.data);

        const data = response.data?.data || response.data || [];

        if (Array.isArray(data)) {
          const pendingRequests = data.filter((requestItem: Request) => {
            const status = requestItem.status?.toLowerCase();
            return status === 'pending' || status === 'requested' || status === 'waiting';
          });

          setRequests(pendingRequests);
          console.log('Total pending requests found:', pendingRequests.length);
        } else {
          console.warn('API response is not an array:', data);
          setRequests([]);
        }

        break;

      } catch (err: any) {
        retryCount++;
        console.error(`❌ Attempt ${retryCount} failed:`, err);

        if (retryCount >= maxRetries) {
          let errorMessage = 'Failed to load requests.';

          if (err.response?.status === 500) {
            errorMessage = 'Server error. Please try again later.';
          } else if (err.response?.status === 401) {
            errorMessage = 'Authentication failed. Please log in again.';
          } else if (err.message) {
            errorMessage = err.message;
          }

          setError(errorMessage);
          setRequests([]);
        } else {
          await new Promise<void>(resolve => setTimeout(() => resolve(), 1000 * retryCount));
        }
      }
    }

    setLoading(false);
    setRefreshing(false);
  }, [user?.userID]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRequests();
  }, [fetchRequests]);

  // Helper function to get display name
  const getRequestDisplayName = useCallback((item: Request) => {
    let displayName = item.name || 'Unknown';

    if (item.user_type === 'customer' && item.customer) {
      const firstName = item.customer.first_name || '';
      const lastName = item.customer.last_name || '';
      displayName = `${firstName} ${lastName}`.trim();
    } else if (item.user_type === 'milkman' && item.milkman) {
      displayName = item.milkman.full_name || 'Unknown Distributor';
    }

    return displayName;
  }, []);
  // In PendingRequestsScreen.tsx, update the navigation call:
  const handleRequestAction = useCallback(async (
    requestId: number,
    action: 'accepted' | 'rejected'
  ) => {
    if (action === 'accepted') {
      setProcessingRequestId(requestId);
      setRejectingRequestId(null);
    } else {
      setRejectingRequestId(requestId);
      setProcessingRequestId(null);
    }
    try {
      console.log(`${action === 'accepted' ? 'Accepting' : 'Rejecting'} request:`, requestId);

      if (action === 'accepted') {
        await acceptRequest(requestId.toString());

        const acceptedRequest = requests.find(req => req.id === requestId);

        if (acceptedRequest && acceptedRequest.user_type === 'customer') {
          Alert.alert(
            'Consumer Request Accepted',
            `Consumer ${getRequestDisplayName(acceptedRequest)} has been accepted. Please assign a distributor.`,
            [
              {
                text: 'Assign Distributor',
                onPress: () => {
                  // Remove the callback function from navigation params
                  navigationHook.navigate('AssignDistributor', {
                    consumer: acceptedRequest,
                    // Remove onAssignmentComplete from here
                  });
                },
              },
            ]
          );
        } else {
          Alert.alert('Success', 'Request successfully accepted.');
          setTimeout(() => fetchRequests(), 1000);
        }
      } else {
        await rejectRequest(requestId.toString());
        Alert.alert('Success', 'Request successfully rejected.');
        setTimeout(() => fetchRequests(), 1000);
      }

    } catch (err: any) {
      console.error(`Error ${action === 'accepted' ? 'accepting' : 'rejecting'} request:`, err);
      const errorMessage = err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message ||
        `Failed to ${action === 'accepted' ? 'accept' : 'reject'} request.`;
      Alert.alert('Error', errorMessage);
    } finally {
      setProcessingRequestId(null);
      setRejectingRequestId(null);
    }
  }, [requests, fetchRequests, navigationHook, getRequestDisplayName]);


  const renderRequestItem = useCallback(({ item }: { item: Request }) => (
    <AnimatedRequestItem
      item={item}
      onAccept={() => handleRequestAction(item.id, 'accepted')}
      onReject={() => handleRequestAction(item.id, 'rejected')}
      processing={processingRequestId === item.id}
      processingRequestId={processingRequestId}
      rejectingRequestId={rejectingRequestId}
    />
  ), [handleRequestAction, processingRequestId, rejectingRequestId]);

  const keyExtractor = useCallback((item: Request, index: number) => `request_${item.id || index}`, []);

  const ListEmptyComponent = useCallback(() => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="notifications-off-outline" size={80} color="#E5E5EA" />
      </View>
      <Text style={styles.emptyTitle}>No Pending Requests</Text>
      <Text style={styles.emptyText}>
        Great! You're all caught up. No requests are waiting for your approval.
      </Text>
      <TouchableOpacity onPress={fetchRequests} style={styles.refreshButton}>
        <Ionicons name="refresh-outline" size={20} color="#fff" />
        <Text style={styles.refreshButtonText}>Check Again</Text>
      </TouchableOpacity>
    </View>
  ), [fetchRequests]);

  if (!isAuthenticated || !user?.userID) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading vendor requests...</Text>
      </View>
    );
  }

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        {/* Animated Header */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Pending Requests</Text>
            <Text style={styles.headerSubtitle}>Requests from consumers and distributors</Text>
          </View>

          {/* <View style={styles.headerIcon}>
            <Ionicons name="notifications" size={24} color="#007AFF" />
            {requests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{requests.length}</Text>
              </View>
            )}
          </View> */}
        </Animated.View>

        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <View style={styles.errorContent}>
              <Ionicons name="warning" size={20} color="#FF3B30" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
            <TouchableOpacity onPress={fetchRequests} style={styles.retryButton}>
              <Ionicons name="refresh" size={16} color="#fff" />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Content */}
        {loading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <View style={styles.skeletonList}>
              {[1, 2, 3, 4, 5].map(item => (
                <SkeletonRequestItem key={item} />
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            data={requests}
            keyExtractor={keyExtractor}
            renderItem={renderRequestItem}
            contentContainerStyle={
              requests.length === 0 ? styles.emptyContainer : styles.listContainer
            }
            ListEmptyComponent={ListEmptyComponent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#007AFF']}
                tintColor="#007AFF"
              />
            }
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={100}
            windowSize={10}
          />
        )}
      </View>
    </SafeAreaWrapper>
  );
};

// Set display names for debugging
SkeletonRequestItem.displayName = 'SkeletonRequestItem';
AnimatedRequestItem.displayName = 'AnimatedRequestItem';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },

  // HEADER STYLES
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // backgroundColor: '#F2F2F7',
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
  headerIcon: {
    position: 'relative',
  },
  // badge: {
  //   position: 'absolute',
  //   top: -8,
  //   right: -8,
  //   backgroundColor: '#FF3B30',
  //   borderRadius: 10,
  //   minWidth: 20,
  //   height: 20,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // badgeText: {
  //   color: '#fff',
  //   fontSize: 12,
  //   fontWeight: 'bold',
  // },

  // ERROR BANNER
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEB',
    padding: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#FFD6D6',
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // LOADING STYLES
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
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    paddingTop: 20,
  },
  skeletonList: {
    paddingHorizontal: 20,
  },

  // SKELETON STYLES
  skeletonItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  skeletonContent: {
    flex: 1,
  },
  skeletonName: {
    height: 20,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginBottom: 8,
    width: '70%',
  },
  skeletonText: {
    height: 14,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    marginBottom: 6,
    width: '80%',
  },
  skeletonActions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 16,
  },
  skeletonButton: {
    width: 80,
    height: 36,
    backgroundColor: '#E5E5EA',
    borderRadius: 8,
  },

  // LIST STYLES
  listContainer: {
    padding: 20,
  },

  requestCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
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
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  distributorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  distributorDetails: {
    flex: 1,
  },
  distributorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  distributorContact: {
    fontSize: 13,
    color: '#666',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4E6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  requestBody: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  remarksContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  remarksText: {
    flex: 1,
    fontSize: 14,
    color: '#1a1a1a',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  rejectButton: {
    backgroundColor: '#FFE8E8',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  rejectButtonText: {
    color: '#FF3B30',
    fontSize: 15,
    fontWeight: '600',
  },
  acceptButton: {
    backgroundColor: '#34C759',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  // EMPTY STATE
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 12,
    textAlign: 'center',
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

export default PendingRequestsScreen;
