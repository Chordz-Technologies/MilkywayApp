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

type Request = {
  id: number;
  user_id: number;
  contact?: string;
  status: string;
  customer?: {
    id: number;
    first_name: string;
    last_name: string;
    contact: string;
  };
  milkman?: {
    id: number;
    full_name: string;
    phone_number: string;
  };
  name?: string | null;
  user_type: 'customer' | 'milkman';
  created_at: string;
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

    // Cleanup animation on unmount
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
}: {
  item: Request;
  onAccept: () => void;
  onReject: () => void;
  processing: boolean;
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const slideValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation
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

    // Cleanup animations on unmount
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

  const getContactInfo = useCallback(() => {
    if (item.user_type === 'customer' && item.customer) {
      return item.customer.contact || '';
    } else if (item.user_type === 'milkman' && item.milkman) {
      return item.milkman.phone_number || '';
    }
    return '';
  }, [item]);

  const displayName = getDisplayName();
  const contactInfo = getContactInfo();
  const roleText = item.user_type === 'customer' ? 'Customer' : 'Distributor';
  const formattedDate = new Date(item.created_at).toLocaleDateString();
  const isPending = ['pending', 'requested', 'waiting'].includes(item.status?.toLowerCase());

  const translateY = slideValue.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <Animated.View
      style={[
        styles.requestItem,
        {
          transform: [{ scale: scaleValue }, { translateY }],
          opacity: fadeValue,
        },
      ]}
    >
      <TouchableOpacity onPress={handlePress} style={styles.requestContent} activeOpacity={0.7}>
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <View style={[
            styles.avatar,
            { backgroundColor: item.user_type === 'customer' ? '#007AFF' : '#FF9500' },
          ]}>
            <Ionicons
              name={item.user_type === 'customer' ? 'person' : 'business'}
              size={24}
              color="#fff"
            />
          </View>
          <View style={[
            styles.statusDot,
            { backgroundColor: getStatusColor(item.status) },
          ]} />
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.name}>{displayName}</Text>

          <View style={styles.roleContainer}>
            <Ionicons name="shield-outline" size={14} color="#666" />
            <Text style={styles.role}>{roleText}</Text>
          </View>

          {contactInfo ? (
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={14} color="#666" />
              <Text style={styles.contact}>{contactInfo}</Text>
            </View>
          ) : null}

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.date}>{formattedDate}</Text>
          </View>

          <View style={styles.statusContainer}>
            <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
              {(item.status || 'pending').toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Action Buttons */}
      {isPending && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={onAccept}
            disabled={processing}
            activeOpacity={0.8}
          >
            {processing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={styles.buttonText}>Accept</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={onReject}
            disabled={processing}
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle" size={18} color="#fff" />
            <Text style={styles.buttonText}>Reject</Text>
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

  // Animation values
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Header animation
    Animated.timing(headerOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Cleanup animation on unmount
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

  const handleRequestAction = useCallback(async (
    requestId: number,
    action: 'accepted' | 'rejected'
  ) => {
    try {
      setProcessingRequestId(requestId);
      console.log(`${action === 'accepted' ? 'Accepting' : 'Rejecting'} request:`, requestId);

      if (action === 'accepted') {
        await acceptRequest(requestId.toString());
      } else {
        await rejectRequest(requestId.toString());
      }

      Alert.alert('Success', `Request successfully ${action === 'accepted' ? 'accepted' : 'rejected'}.`);

      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId
            ? { ...req, status: action }
            : req
        )
      );

      setTimeout(() => {
        fetchRequests();
      }, 1000);

    } catch (err: any) {
      console.error(`Error ${action === 'accepted' ? 'accepting' : 'rejecting'} request:`, err);
      const errorMessage = err.response?.data?.detail ||
                          err.response?.data?.message ||
                          err.message ||
                          `Failed to ${action === 'accepted' ? 'accept' : 'reject'} request.`;
      Alert.alert('Error', errorMessage);
    } finally {
      setProcessingRequestId(null);
    }
  }, [fetchRequests]);

  const renderRequestItem = useCallback(({ item }: { item: Request }) => (
    <AnimatedRequestItem
      item={item}
      onAccept={() => handleRequestAction(item.id, 'accepted')}
      onReject={() => handleRequestAction(item.id, 'rejected')}
      processing={processingRequestId === item.id}
    />
  ), [handleRequestAction, processingRequestId]);

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
        <Text style={styles.loadingText}>Loading user information...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Pending Requests</Text>
          <Text style={styles.headerSubtitle}>{requests.length} requests waiting</Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons name="notifications" size={24} color="#007AFF" />
          {requests.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{requests.length}</Text>
            </View>
          )}
        </View>
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
    backgroundColor: '#F2F2F7',
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
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

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
    paddingTop: 20,
    paddingBottom: 40,
  },

  // REQUEST ITEM STYLES
  requestItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  requestContent: {
    flexDirection: 'row',
    padding: 20,
  },

  // AVATAR STYLES
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#fff',
  },

  // CONTENT STYLES
  contentSection: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 6,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  role: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 6,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contact: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 6,
    fontWeight: '500',
  },
  date: {
    fontSize: 13,
    color: '#8E8E93',
    marginLeft: 6,
  },
  statusContainer: {
    marginTop: 8,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#F2F2F7',
    alignSelf: 'flex-start',
  },

  // ACTION BUTTONS
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 6,
  },
  acceptButton: {
    backgroundColor: '#34C759',
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
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
