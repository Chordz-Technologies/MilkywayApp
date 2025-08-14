// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   StyleSheet,
//   Alert,
//   RefreshControl,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import {
//   getVendorPendingRequests,
//   acceptRequest,
//   rejectRequest,
// } from '../apiServices/allApi';

// type Request = {
//   id: number;
//   user_id: number;
//   contact?: string;
//   status: string;
//   customer?: {
//     id: number;
//     first_name: string;
//     last_name: string;
//     contact: string;
//   };
//   milkman?: {
//     id: number;
//     full_name: string;
//     phone_number: string;
//   };
//   name?: string | null;
//   user_type: 'customer' | 'milkman';
//   created_at: string;
//   vendor: number;
// };

// type Props = {
//   navigation: any;
//   route?: any;
// };

// const PendingRequestsScreen = ({ navigation }: Props) => {
//   const [requests, setRequests] = useState<Request[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [processingRequestId, setProcessingRequestId] = useState<string | null>(null);
//   const [refreshing, setRefreshing] = useState<boolean>(false);

//   const fetchRequests = useCallback(async () => {
//     setLoading(true);
//     try {
//       const vendorId = await AsyncStorage.getItem('userID');
//       if (!vendorId) {
//         Alert.alert('Error', 'Vendor ID not found, please log in again.');
//         setRequests([]);
//         return;
//       }

//       console.log('Fetching requests for vendor ID:', vendorId);

//       const response = await getVendorPendingRequests(vendorId);
//       console.log('All requests API response:', JSON.stringify(response.data, null, 2));

//       const data = response.data?.data || response.data || [];
//       console.log('Parsed requests data:', data);

//       if (Array.isArray(data)) {
//         setRequests(data);
//         console.log('Total requests found:', data.length);
//       } else {
//         console.warn('API response is not an array:', data);
//         setRequests([]);
//       }
//     } catch (error) {
//       console.error('Failed to fetch requests:', error);
//       Alert.alert('Error', 'Failed to load requests. Please try again.');
//       setRequests([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchRequests();
//   }, [fetchRequests]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     fetchRequests();
//   };

//   const handleRequestAction = async (
//     requestId: string,
//     action: 'accepted' | 'rejected'
//   ) => {
//     try {
//       setProcessingRequestId(requestId);
//       console.log(`${action === 'accepted' ? 'Accepting' : 'Rejecting'} request:`, requestId);

//       if (action === 'accepted') {
//         await acceptRequest(requestId);
//       } else {
//         await rejectRequest(requestId);
//       }

//       Alert.alert('Success', `Request successfully ${action === 'accepted' ? 'accepted' : 'rejected'}.`);

//       // Update the status of the request in current list immediately
//       setRequests(prevRequests =>
//         prevRequests.map(req =>
//           req.id.toString() === requestId
//             ? { ...req, status: action }
//             : req
//         )
//       );

//     } catch (error) {
//       console.error(`Error ${action === 'accepted' ? 'accepting' : 'rejecting'} request:`, error);
//       Alert.alert('Error', `Failed to ${action === 'accepted' ? 'accept' : 'reject'} request. Please try again.`);
//     } finally {
//       setProcessingRequestId(null);
//     }
//   };

//   const getStatusColor = (status?: string) => {
//     switch (status) {
//       case 'pending':
//         return '#FFA500'; // Orange
//       case 'accepted':
//         return '#4CD964'; // Green
//       case 'rejected':
//         return '#FF6B6B'; // Red
//       default:
//         return '#666'; // Gray
//     }
//   };

//   const renderRequestItem = ({ item }: { item: Request }) => {
//     // Get display name based on API response structure
//     let displayName = item.name || 'Unknown';

//     if (item.user_type === 'customer' && item.customer) {
//       const firstName = item.customer.first_name || '';
//       const lastName = item.customer.last_name || '';
//       displayName = `${firstName} ${lastName}`.trim();
//     } else if (item.user_type === 'milkman' && item.milkman) {
//       displayName = item.milkman.full_name || 'Unknown Distributor';
//     }

//     const roleText = item.user_type === 'customer' ? 'Consumer' : 'Distributor';
//     const formattedDate = new Date(item.created_at).toLocaleDateString();

//     return (
//       <View style={styles.requestItem}>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.name}>{displayName}</Text>
//           <Text style={styles.role}>Role: {roleText}</Text>
//           <Text style={styles.date}>Date: {formattedDate}</Text>
//           <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
//             Status: {(item.status || 'pending').charAt(0).toUpperCase() + (item.status || 'pending').slice(1)}
//           </Text>
//         </View>

//         {/* Always show Accept/Reject buttons */}
//         <View style={styles.actions}>
//           <TouchableOpacity
//             style={[styles.button, styles.acceptButton]}
//             onPress={() => handleRequestAction(item.id.toString(), 'accepted')}
//             disabled={processingRequestId === item.id.toString()}
//           >
//             {processingRequestId === item.id.toString() ? (
//               <ActivityIndicator color="#fff" size="small" />
//             ) : (
//               <Text style={styles.buttonText}>Accept</Text>
//             )}
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.button, styles.rejectButton]}
//             onPress={() => handleRequestAction(item.id.toString(), 'rejected')}
//             disabled={processingRequestId === item.id.toString()}
//           >
//             <Text style={styles.buttonText}>Reject</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="arrow-back" size={28} color="#007AFF" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>All Requests</Text>
//       </View>

//       {loading && !refreshing ? (
//         <View style={styles.centerContainer}>
//           <ActivityIndicator size="large" color="#007AFF" />
//           <Text style={styles.loadingText}>Loading requests...</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={requests}
//           keyExtractor={(item, index) => `request_${item.id || index}`}
//           renderItem={renderRequestItem}
//           contentContainerStyle={
//             requests.length === 0 ? styles.emptyContainer : styles.listContainer
//           }
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Ionicons name="document-outline" size={64} color="#ccc" />
//               <Text style={styles.emptyText}>No requests found.</Text>
//               <TouchableOpacity onPress={fetchRequests} style={styles.retryButton}>
//                 <Text style={styles.retryButtonText}>Refresh</Text>
//               </TouchableOpacity>
//             </View>
//           }
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </View>
//   );
// };

// export default PendingRequestsScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },

//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//     backgroundColor: '#fff',
//   },

//   backButton: {
//     marginRight: 16,
//     padding: 4,
//   },

//   headerTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#222',
//     flex: 1,
//   },

//   centerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },

//   loadingText: {
//     marginTop: 10,
//     color: '#666',
//     fontSize: 16,
//   },

//   listContainer: {
//     flexGrow: 1,
//   },

//   requestItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderColor: '#f0f0f0',
//     backgroundColor: '#fff',
//   },

//   name: {
//     fontWeight: '600',
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 4,
//   },

//   role: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 2,
//   },

//   date: {
//     fontSize: 13,
//     color: '#999',
//     marginBottom: 2,
//   },

//   status: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginTop: 4,
//   },

//   actions: {
//     flexDirection: 'row',
//     marginLeft: 12,
//   },

//   button: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 6,
//     minWidth: 80,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 4,
//   },

//   acceptButton: {
//     backgroundColor: '#4CD964',
//   },

//   rejectButton: {
//     backgroundColor: '#FF6B6B',
//   },

//   buttonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 14,
//   },

//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 100,
//   },

//   emptyText: {
//     color: '#888',
//     fontSize: 16,
//     textAlign: 'center',
//     marginTop: 16,
//     marginBottom: 20,
//   },

//   retryButton: {
//     backgroundColor: '#007AFF',
//     borderRadius: 6,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//   },

//   retryButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//     fontSize: 16,
//   },
// });
import React, { useEffect, useState, useCallback } from 'react';
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

const PendingRequestsScreen = () => {
  // ✅ ALL HOOKS AT THE TOP LEVEL
  const navigationHook = useNavigation();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingRequestId, setProcessingRequestId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ FIXED - Safe back navigation function using CommonActions
  const handleGoBack = useCallback(() => {
    if (navigationHook.canGoBack()) {
      navigationHook.goBack();
    } else {
      // ✅ Use CommonActions to avoid type issues
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

  // ✅ Handle Android hardware back button
  useEffect(() => {
    const backAction = () => {
      handleGoBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [handleGoBack]);

  // ✅ Enhanced fetchRequests with proper user handling and retry logic
  const fetchRequests = useCallback(async () => {
    setError(null);
    setLoading(true);

    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        // ✅ Get vendor ID from Redux user object
        const vendorId = user?.userID;

        if (!vendorId) {
          throw new Error('Vendor ID not found. Please log in again.');
        }

        console.log(`Attempt ${retryCount + 1}: Fetching requests for vendor ID:`, vendorId);

        const response = await getVendorPendingRequests(vendorId);
        console.log('✅ Pending requests API success:', response.data);

        const data = response.data?.data || response.data || [];
        console.log('Parsed requests data:', data);

        if (Array.isArray(data)) {
          // Filter for actual pending requests
          const pendingRequests = data.filter(item => {
            const status = item.status?.toLowerCase();
            return status === 'pending' || status === 'requested' || status === 'waiting';
          });

          setRequests(pendingRequests);
          console.log('Total pending requests found:', pendingRequests.length);
        } else {
          console.warn('API response is not an array:', data);
          setRequests([]);
        }

        // Success - break out of retry loop
        break;

      } catch (err: any) {
        retryCount++;

        console.error(`❌ Attempt ${retryCount} failed:`, err);
        console.error('Error response:', err.response?.data);

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
          // ✅ FIXED setTimeout Promise
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

      // Update the status immediately in UI
      setRequests(prevRequests =>
        prevRequests.map(req =>
          req.id === requestId
            ? { ...req, status: action }
            : req
        )
      );

      // Refresh data after a short delay
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

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'requested':
      case 'waiting':
        return '#FFA500'; // Orange
      case 'accepted':
        return '#4CD964'; // Green
      case 'rejected':
        return '#FF6B6B'; // Red
      default:
        return '#666'; // Gray
    }
  };

  const renderRequestItem = ({ item }: { item: Request }) => {
    let displayName = item.name || 'Unknown';
    let contactInfo = '';

    if (item.user_type === 'customer' && item.customer) {
      const firstName = item.customer.first_name || '';
      const lastName = item.customer.last_name || '';
      displayName = `${firstName} ${lastName}`.trim();
      contactInfo = item.customer.contact || '';
    } else if (item.user_type === 'milkman' && item.milkman) {
      displayName = item.milkman.full_name || 'Unknown Distributor';
      contactInfo = item.milkman.phone_number || '';
    }

    const roleText = item.user_type === 'customer' ? 'Customer' : 'Distributor';
    const formattedDate = new Date(item.created_at).toLocaleDateString();
    const isPending = ['pending', 'requested', 'waiting'].includes(item.status?.toLowerCase());

    return (
      <View style={styles.requestItem}>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{displayName}</Text>

          <View style={styles.infoRow}>
            <Ionicons
              name={item.user_type === 'customer' ? 'person-outline' : 'business-outline'}
              size={16}
              color="#666"
            />
            <Text style={styles.role}>{roleText}</Text>
          </View>

          {contactInfo ? (
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={16} color="#666" />
              <Text style={styles.contact}>{contactInfo}</Text>
            </View>
          ) : null}

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.date}>{formattedDate}</Text>
          </View>

          <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
            Status: {(item.status || 'pending').charAt(0).toUpperCase() + (item.status || 'pending').slice(1)}
          </Text>
        </View>

        {/* Show action buttons only for pending requests */}
        {isPending && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.acceptButton]}
              onPress={() => handleRequestAction(item.id, 'accepted')}
              disabled={processingRequestId === item.id}
            >
              {processingRequestId === item.id ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={16} color="#fff" />
                  <Text style={styles.buttonText}>Accept</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={() => handleRequestAction(item.id, 'rejected')}
              disabled={processingRequestId === item.id}
            >
              <Ionicons name="close" size={16} color="#fff" />
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // ✅ Show loading if no user data yet
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pending Requests ({requests.length})</Text>
      </View>

      {/* Error Banner */}
      {error && (
        <View style={styles.errorBanner}>
          <View style={styles.errorContent}>
            <Ionicons name="warning-outline" size={20} color="#c00" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
          <TouchableOpacity onPress={fetchRequests} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading requests...</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item, index) => `request_${item.id || index}`}
          renderItem={renderRequestItem}
          contentContainerStyle={
            requests.length === 0 ? styles.emptyContainer : styles.listContainer
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="notifications-outline" size={64} color="#ccc" />
              <Text style={styles.emptyText}>No pending requests found.</Text>
              <TouchableOpacity onPress={fetchRequests} style={styles.refreshButton}>
                <Ionicons name="refresh-outline" size={20} color="#fff" />
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff0f0',
    padding: 12,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ffcccc',
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  errorText: {
    color: '#c00',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  contact: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  date: {
    fontSize: 13,
    color: '#999',
    marginLeft: 8,
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 12,
    gap: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 80,
    justifyContent: 'center',
    gap: 4,
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
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 100,
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
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
