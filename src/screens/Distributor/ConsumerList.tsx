import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, ActivityIndicator, Platform, TouchableOpacity, Alert, TextInput, Modal, ScrollView, } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/index';
import {
  fetchAssignedConsumers,
  markDelivery,
  refreshConsumers,
  setSelectedConsumer,
  clearError,
  selectConsumers,
  selectConsumersLoading,
  selectConsumersError,
  selectMarkingDelivery,
  selectConsumersRefreshing,
  selectConsumersStats,
  selectLastActiveDate,
  checkDailyReset,
  AssignedConsumer,
} from '../../store/consumersSlice';
import { getMilkmanExtraMilkRequests } from '../../apiServices/allApi';
import { useDailyDeliveryReset } from '../../hooks/useDailyDeliveryReset';
import { getUnreadCount, markAllAsRead, showLocalNotification, notificationEmitter } from "../../notifications/NotificationService";
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { Linking } from 'react-native';
import SafeAreaWrapper from '../../styles/SafeAreaWrapper';
import NetInfo from '@react-native-community/netinfo';

type NavigationProp = {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
};

const safeParseMilkQuantity = (value: number | string | null | undefined): number => {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === 'string') {
    if (value.trim() === '') {
      return 0;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  if (typeof value === 'number') {
    return isNaN(value) ? 0 : value;
  }

  return 0;
};

const ConsumerListScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  useDailyDeliveryReset();

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const consumers = useSelector(selectConsumers);
  const loading = useSelector(selectConsumersLoading);
  const error = useSelector(selectConsumersError);
  const markingDelivery = useSelector(selectMarkingDelivery);
  const refreshing = useSelector(selectConsumersRefreshing);
  const stats = useSelector(selectConsumersStats);
  const lastActiveDate = useSelector(selectLastActiveDate);
  const [isMarkingThisDelivery, setIsMarkingThisDelivery] = useState(false);
  const [isMarkingCancelDelivery, setIsMarkingCancelDelivery] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [extraRequests, setExtraRequests] = useState<any[]>([]);
  const [extraLoading, setExtraLoading] = useState(false);
  const [editedMilkMap, setEditedMilkMap] = useState<{ [customerId: number]: { cow_milk: string; buffalo_milk: string } }>({});
  const [isEditingMap, setIsEditingMap] = useState<{ [customerId: number]: boolean }>({});
  const [cancelReasonModal, setCancelReasonModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AssignedConsumer | any>(null);
  const [searchText, setSearchText] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  const filteredConsumers = consumers.filter(c =>
    c.customer_name?.toLowerCase().includes(searchText.toLowerCase()) ||
    c.customer_contact?.includes(searchText)
  );

  // Network detection
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleEdit = (customerId: number) => {
    setIsEditingMap(prev => ({ ...prev, [customerId]: !prev[customerId] }));
  };

  useEffect(() => {
    const initialMap: { [id: number]: { cow_milk: string; buffalo_milk: string } } = {};
    consumers.forEach((c) => {
      initialMap[c.customer_id] = {
        cow_milk: safeParseMilkQuantity(c.milk_requirement?.cow_milk_litre).toString(),
        buffalo_milk: safeParseMilkQuantity(c.milk_requirement?.buffalo_milk_litre).toString(),
      };
    });
    setEditedMilkMap(initialMap);
  }, [consumers]);

  const loadNotificationCount = async () => {
    try {
      const count = await getUnreadCount();
      setNotificationCount(count);
    } catch (error) {
      console.error('Error loading notification count:', error);
    }
  };

  useEffect(() => {
    loadNotificationCount();

    // Listen for updates via emitter
    const updateBadge = async () => {
      const count = await getUnreadCount();
      setNotificationCount(count);
    };
    notificationEmitter.on('newNotification', updateBadge);

    // Handle FCM foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
        console.log("Foreground message:", remoteMessage);
        const notificationRaw = remoteMessage.notification || {
          title: remoteMessage.data?.title,
          body: remoteMessage.data?.body,
        };
        const notification = {
          title: typeof notificationRaw.title === "string" ? notificationRaw.title : JSON.stringify(notificationRaw.title),
          body: typeof notificationRaw.body === "string" ? notificationRaw.body : JSON.stringify(notificationRaw.body),
        };
        await showLocalNotification(notification);
      }
    });

    return () => {
      unsubscribe();
      notificationEmitter.removeListener('newNotification', updateBadge);
    };
  }, []);

  const getMilkmanId = useCallback(() => {
    if (!user?.userID) { return 0; }
    return typeof user.userID === 'string' ? parseInt(user.userID, 10) : Number(user.userID);
  }, [user?.userID]);

  const getTodayString = useCallback(() => {
    return new Date().toISOString().split('T')[0];
  }, []);

  const fetchExtraMilkRequests = useCallback(async () => {
    const milkmanId = getMilkmanId();
    if (!milkmanId) return;

    setExtraLoading(true);
    try {
      const resp = await getMilkmanExtraMilkRequests(milkmanId, getTodayString());
      const data = resp?.data?.data || resp?.data || [];

      setExtraRequests(data);
    } catch (err) {
      console.error('Error fetching extra milk requests:', err);
      setExtraRequests([]);
    } finally {
      setExtraLoading(false);
    }
  }, [getMilkmanId, getTodayString]);

  const getTodayDeliveryStatus = useCallback((consumer: AssignedConsumer) => {
    const today = getTodayString();
    const todayDelivery = consumer.deliveryHistory?.find(d => d.date === today);

    if (todayDelivery) {
      const isDelivered = todayDelivery.status === 'delivered';
      const isCancelled = todayDelivery.status === 'cancelled';

      return {
        hasDelivery: true,
        status: todayDelivery.status,
        isDelivered,
        isCancelled,
        remarks: todayDelivery.remarks,
        isLocked: isDelivered || isCancelled,
        canDeliver: false,
        canCancel: false,
        nextAvailable: 'Tomorrow',
      };
    }

    return {
      hasDelivery: false,
      status: null,
      isDelivered: false,
      isCancelled: false,
      remarks: null,
      isLocked: false,
      canDeliver: true,
      canCancel: true,
      nextAvailable: 'Now',
    };
  }, [getTodayString]);

  const formatAddress = useCallback((address?: string) => {
    if (!address) { return ''; }
    return address;
  }, []);

  const getMilkRequirementText = useCallback(
    (
      requirement?: AssignedConsumer["milk_requirement"],
      editedMilk?: { cow_milk: string; buffalo_milk: string }
    ) => {
      if (!requirement) return "No requirement specified";

      // If edited values are provided, use those
      const cow = editedMilk?.cow_milk
        ? Number(editedMilk.cow_milk)
        : safeParseMilkQuantity(requirement.cow_milk_litre);

      const buffalo = editedMilk?.buffalo_milk
        ? Number(editedMilk.buffalo_milk)
        : safeParseMilkQuantity(requirement.buffalo_milk_litre);

      const total = cow + buffalo;

      if (total === 0) return "No milk required";

      return `Cow: ${cow}L\nBuffalo: ${buffalo}L\nTotal: ${total}L`;
    },
    []
  );

  useEffect(() => {
    if (isAuthenticated && user?.userID) {
      dispatch(checkDailyReset()).then(() => {
        dispatch(fetchAssignedConsumers(getMilkmanId()));
        // fetch extra milk requests (will fall back to local cache when offline)
        fetchExtraMilkRequests();
      });
    }
  }, [dispatch, isAuthenticated, user?.userID, getMilkmanId]);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated && user?.userID) {
        dispatch(checkDailyReset()).then(() => {
          dispatch(fetchAssignedConsumers(getMilkmanId()));
          fetchExtraMilkRequests(); // ALWAYS refresh
        });
      }
    }, [dispatch, isAuthenticated, user?.userID, getMilkmanId])
  );

  const handleRefresh = useCallback(() => {
    if (!user?.userID) { return; }

    const today = getTodayString();
    const isNewDay = lastActiveDate && lastActiveDate !== today;

    if (isNewDay) {
      Alert.alert(
        'New Day Detected',
        'New day started! All delivery buttons have been unlocked. You can now mark deliveries for today.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Refresh',
            onPress: () => {
              dispatch(checkDailyReset()).then(() => {
                dispatch(refreshConsumers(getMilkmanId()));
              });
            },
          },
        ]
      );
    } else {
      dispatch(checkDailyReset()).then(() => {
        dispatch(refreshConsumers(getMilkmanId()));
      });
    }
  }, [dispatch, user?.userID, getMilkmanId, getTodayString, lastActiveDate]);

  const handleMarkDelivery = useCallback(async (consumer: AssignedConsumer) => {
    const today = getTodayString();
    const milkmanId = getMilkmanId();
    const todayStatus = getTodayDeliveryStatus(consumer);

    if (todayStatus.isLocked) {
      Alert.alert(
        'Already Processed',
        `Delivery for ${consumer.customer_name} has already been processed today.\n\nStatus: ${todayStatus.isDelivered ? 'Delivered' : 'Cancelled'}\n\nNext delivery available: Tomorrow`,
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    Alert.alert(
      'Mark as Delivered',
      `Confirm delivery for:\n\n${consumer.customer_name}\nDate: ${today}\nAmount: ${getMilkRequirementText(consumer.milk_requirement, editedMilkMap[consumer.customer_id])}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark Delivered',
          style: 'default',
          onPress: async () => {
            try {
              setIsMarkingThisDelivery(true);

              const result = await dispatch(markDelivery({
                customer_id: consumer.customer_id,
                date: today,
                milkman_id: milkmanId,
                status: 'delivered',
                cow_milk: Number(editedMilkMap[consumer.customer_id]?.cow_milk) || 0,
                buffalo_milk: Number(editedMilkMap[consumer.customer_id]?.buffalo_milk) || 0,
                reason: `Delivered as per requirement`,
                remarks: `Delivery completed successfully for ${consumer.customer_name}`,
                replaceExisting: true,
              })).unwrap();

              // Show appropriate message based on online/offline
              const message = result.isOffline
                ? `Delivery marked offline for ${consumer.customer_name}.\n\n⚠️ This will be synced to server when you go online.\n\nButtons are now disabled until tomorrow.`
                : `Delivery marked as completed for ${consumer.customer_name}.\n\nButtons are now disabled until tomorrow.`;

              Alert.alert(
                result.isOffline ? '📱 Offline Mode' : 'Success!',
                message,
                [{ text: 'OK' }]
              );
            } catch (error: any) {
              Alert.alert('Error', error || 'Failed to mark delivery. Please try again.');
            }
            finally {
              setIsMarkingThisDelivery(false);
            }
          },
        },
      ]
    );
  }, [dispatch, getMilkmanId, editedMilkMap, getMilkRequirementText, getTodayString, getTodayDeliveryStatus]);

  const handleMarkDeliveryCancelled = useCallback(async (consumer: AssignedConsumer, reason?: string) => {
    const today = getTodayString();
    const milkmanId = getMilkmanId();
    const todayStatus = getTodayDeliveryStatus(consumer);

    if (todayStatus.isLocked) {
      Alert.alert(
        'Already Processed',
        `Delivery for ${consumer.customer_name} has already been processed today.\n\nStatus: ${todayStatus.isDelivered ? 'Delivered' : 'Cancelled'}\n\nNext action available: Tomorrow`,
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsMarkingCancelDelivery(true);

      const result = await dispatch(markDelivery({
        customer_id: consumer.customer_id,
        date: today,
        milkman_id: milkmanId,
        status: 'cancelled',
        cow_milk: Number(editedMilkMap[consumer.customer_id]?.cow_milk) || 0,
        buffalo_milk: Number(editedMilkMap[consumer.customer_id]?.buffalo_milk) || 0,
        reason: reason || 'No reason provided',
        remarks: reason || `Delivery cancelled for ${consumer.customer_name}`,
        replaceExisting: true,
      })).unwrap();

      // Show appropriate message based on online/offline
      const message = result.isOffline
        ? `Delivery cancelled offline for ${consumer.customer_name}.\nReason: ${reason}\n\n⚠️ This will be synced to server when you go online.\n\nButtons are now disabled until tomorrow.`
        : `Delivery cancelled for ${consumer.customer_name}.\nReason: ${reason}\n\nButtons are now disabled until tomorrow.`;

      Alert.alert(
        result.isOffline ? '📱 Offline Mode' : 'Cancelled',
        message,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to cancel delivery. Please try again.');
    }
    finally {
      setIsMarkingCancelDelivery(false);
    }
  }, [dispatch, getMilkmanId, editedMilkMap, getTodayString, getTodayDeliveryStatus]);

  const handleViewCalendar = useCallback((consumer: AssignedConsumer) => {
    dispatch(setSelectedConsumer(consumer));

    navigation.navigate('DistributorConsumerCalendar', {
      viewerRole: 'distributor',
      targetConsumerId: consumer.customer_id,
      targetConsumerName: consumer.customer_name,
      showBackButton: true,
    });
  }, [dispatch, navigation]);

  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError());
      }
    };
  }, [dispatch, error]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';

    const [year, month, day] = dateStr.split('-');
    return `${day}-${month}-${year}`;
  };

  const renderConsumerItem = ({ item }: { item: AssignedConsumer }) => {
    const address = formatAddress(item.customer_address);

    const cowMilk = safeParseMilkQuantity(item.milk_requirement?.cow_milk_litre);
    const buffaloMilk = safeParseMilkQuantity(item.milk_requirement?.buffalo_milk_litre);

    const editedMilk = editedMilkMap[item.customer_id] || { cow_milk: '', buffalo_milk: '' };

    // Safe getter
    const safeNumber = (val: any) => val ? Number(val) : 0;

    const isEditingThis = isEditingMap[item.customer_id];

    const cowValue =
      isEditingThis
        ? editedMilkMap[item.customer_id]?.cow_milk
        : safeNumber(editedMilkMap[item.customer_id]?.cow_milk ?? cowMilk);

    const buffaloValue =
      isEditingThis
        ? editedMilkMap[item.customer_id]?.buffalo_milk
        : safeNumber(editedMilkMap[item.customer_id]?.buffalo_milk ?? buffaloMilk);

    // TOTAL (auto-updated)
    const totalMilk = safeNumber(cowValue) + safeNumber(buffaloValue);

    const hasCow = cowMilk > 0;
    const hasBuffalo = buffaloMilk > 0;
    const hasAnyMilk = hasCow || hasBuffalo;

    const todayStatus = getTodayDeliveryStatus(item);

    const deliveryButtonDisabled = isMarkingThisDelivery || !hasAnyMilk || todayStatus.isLocked;
    const cancelButtonDisabled = isMarkingCancelDelivery || !hasAnyMilk || todayStatus.isLocked;

    return (
      <View style={styles.modernCard}>
        <View style={styles.cardHeader}>
          <View style={styles.customerInfo}>
            <View style={styles.modernAvatar}>
              <Text style={styles.avatarText}>
                {item.customer_name?.[0]?.toUpperCase() || 'C'}
              </Text>
            </View>
            <View style={styles.customerDetails}>
              <Text style={styles.customerName} numberOfLines={1}>
                {item.customer_name || 'Unknown Customer'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  if (item.customer_contact) {
                    Linking.openURL(`tel:${item.customer_contact}`);
                  }
                }}
              >
                <View style={styles.contactContainer}>
                  <Ionicons name="call" size={12} color="#007AFF" />
                  <Text style={styles.contactText} numberOfLines={1}>
                    {item.customer_contact || 'Unknown Contact'}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statusContainer}>
            {todayStatus.hasDelivery ? (
              <View style={[
                styles.statusBadge,
                todayStatus.isDelivered ? styles.deliveredBadge : styles.cancelledBadge,
              ]}>
                <Ionicons
                  name={todayStatus.isDelivered ? 'checkmark-circle' : 'close-circle'}
                  size={12}
                  color="#fff"
                />
                <Text style={styles.statusText}>
                  {todayStatus.isDelivered ? 'Delivered' : 'Cancelled'}
                </Text>
              </View>
            ) : (
              <View style={[styles.statusBadge, styles.pendingBadge]}>
                <Ionicons name="time" size={12} color="#fff" />
                <Text style={styles.statusText}>Pending</Text>
              </View>
            )}
          </View>
        </View>

        {address && (
          <View style={styles.addressSection}>
            <Ionicons name="location" size={14} color="#FF9500" />
            <Text style={styles.addressText} numberOfLines={2}>
              {address}
            </Text>
          </View>
        )}

        <View style={styles.milkSection}>
          <View style={styles.milkHeader}>
            <Ionicons name="water" size={16} color="#007AFF" />
            <Text style={styles.milkHeaderText}>Daily Milk Requirement</Text>

            {/* TOTAL MILK BADGE */}
            <View style={styles.totalMilkBadge}>
              <Text style={styles.totalMilkBadgeText}>{totalMilk}L</Text>
            </View>
          </View>

          {/* MAIN ROW : LEFT = milk rows, RIGHT = edit button center-aligned */}
          <View style={{ flexDirection: 'row', marginTop: 10 }}>

            {/* LEFT SIDE (COW + BUFFALO ROWS) */}
            <View style={{ flex: 1 }}>

              {/* COW ROW */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <View style={styles.milkType}>
                  <View style={[styles.milkTypeDot, { backgroundColor: '#34C759' }]} />
                  <Text style={styles.milkTypeText}>Cow: </Text>
                </View>

                {isEditingThis ? (
                  <>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 4,
                        borderRadius: 5,
                        width: 55,
                        textAlign: 'center',
                      }}
                      keyboardType="numeric"
                      value={editedMilk?.cow_milk}
                      onChangeText={(text) =>
                        setEditedMilkMap(prev => ({
                          ...prev,
                          [item.customer_id]: {
                            ...prev[item.customer_id],
                            cow_milk: text,
                          }
                        }))
                      }
                    />
                    <Text style={{ marginLeft: 4 }}>L</Text>
                  </>
                ) : (
                  <Text style={styles.milkTypeText}>{safeNumber(cowValue)}L</Text>
                )}
              </View>

              {/* BUFFALO ROW */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.milkType}>
                  <View style={[styles.milkTypeDot, { backgroundColor: '#FF9500' }]} />
                  <Text style={styles.milkTypeText}>Buffalo: </Text>
                </View>

                {isEditingThis ? (
                  <>
                    <TextInput
                      style={{
                        borderWidth: 1,
                        borderColor: '#ccc',
                        padding: 4,
                        borderRadius: 5,
                        width: 55,
                        textAlign: 'center',
                      }}
                      keyboardType="numeric"
                      value={editedMilk?.buffalo_milk}
                      onChangeText={(text) =>
                        setEditedMilkMap(prev => ({
                          ...prev,
                          [item.customer_id]: {
                            ...prev[item.customer_id],
                            buffalo_milk: text,
                          }
                        }))
                      }
                    />
                    <Text style={{ marginLeft: 4 }}>L</Text>
                  </>
                ) : (
                  <Text style={styles.milkTypeText}>{safeNumber(buffaloValue)}L</Text>
                )}
              </View>
            </View>

            {/* RIGHT SIDE (EDIT / DONE BUTTON CENTERED) */}
            <View
              style={{
                justifyContent: 'center', // Vertically center button
                alignItems: 'center',
                paddingLeft: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => toggleEdit(item.customer_id)}
                style={{
                  backgroundColor: isEditingThis ? 'green' : '#007AFF',
                  paddingVertical: 7,
                  paddingHorizontal: 16,
                  borderRadius: 6,
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>
                  {isEditingThis ? 'Done' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {
          todayStatus.isLocked && (
            <View style={styles.lockIndicator}>
              <Ionicons name="shield-checkmark" size={16} color="#6B7280" />
              <Text style={styles.lockIndicatorText}>
                Processing completed - available again tomorrow
              </Text>
            </View>
          )
        }

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.calendarButton]}
            onPress={() => handleViewCalendar(item)}
            activeOpacity={0.8}
          >
            <Ionicons name="calendar" size={18} color="#007AFF" />
            <Text style={[styles.actionButtonText, { color: '#007AFF' }]}>
              Calendar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.deliverButton,
              deliveryButtonDisabled && styles.deliverButtonDisabled,
            ]}
            onPress={() => handleMarkDelivery(item)}
            activeOpacity={0.8}
            disabled={deliveryButtonDisabled}
          >
            {isMarkingThisDelivery ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color="#fff"
                />
                <Text style={[styles.actionButtonText, { color: '#fff' }]}>
                  {todayStatus.isDelivered ? 'Delivered' : 'Delivery'}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.cancelButton,
              cancelButtonDisabled && styles.cancelButtonDisabled,
            ]}
            onPress={() => {
              if (todayStatus.isLocked) {
                Alert.alert(
                  'Already Processed',
                  'This delivery has already been processed for today.',
                  [{ text: 'OK' }]
                );
                return;
              }

              // OPEN THE MODAL HERE (correct place)
              setSelectedItem(item);
              setCancelReasonModal(true);
            }}
            activeOpacity={0.8}
            disabled={cancelButtonDisabled}
          >
            {isMarkingCancelDelivery ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={cancelButtonDisabled ? '#999' : '#FF3B30'}
                />
                <Text style={[
                  styles.actionButtonText,
                  { color: cancelButtonDisabled ? '#999' : '#FF3B30' },
                ]}>
                  {todayStatus.isCancelled ? 'Cancelled' : 'Cancel'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSection}>
          {item.provider?.provider_name && (
            <View style={styles.vendorInfo}>
              <Ionicons name="business" size={12} color="#8E8E93" />
              <Text style={styles.vendorText}>
                Vendor: {item.provider.provider_name}
              </Text>
            </View>
          )}

          {item.milkman?.milkman_name && (
            <View style={styles.vendorInfo}>
              <Ionicons name="person" size={12} color="#8E8E93" />
              <Text style={styles.vendorText}>
                Distributor: {item.milkman.milkman_name}
              </Text>
            </View>
          )}

          {todayStatus.hasDelivery && todayStatus.remarks && (
            <View style={styles.remarksInfo}>
              <Ionicons name="chatbubble" size={12} color="#8E8E93" />
              <Text style={styles.remarksText} numberOfLines={2}>
                Today: {todayStatus.remarks}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (!isAuthenticated) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaWrapper>

      <View style={styles.container}>
        {/* Offline indicator banner */}
        {!isOnline && (
          <View style={styles.offlineIndicatorBanner}>
            <Ionicons name="wifi-outline" size={16} color="#fff" />
            <Text style={styles.offlineIndicatorText}>You're offline - using cached data</Text>
          </View>
        )}

        <View style={styles.modernHeader}>

          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Daily Deliveries</Text>
            <Text style={styles.headerSubtitle}>
              {formatDate(getTodayString())}
            </Text>
          </View>

          {/* Notification Icon - Placeholder for future implementation */}
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={async () => {
              await markAllAsRead();
              setNotificationCount(0);
              (navigation as any).navigate('Notifications');
            }}
          >
            <View>
              <Ionicons name="notifications-outline" size={24} color="#333" />
              {notificationCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    right: -6,
                    top: -3,
                    backgroundColor: 'red',
                    borderRadius: 10,
                    paddingHorizontal: 5,
                    paddingVertical: 1,
                    minWidth: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                    {notificationCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.modernStatsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#E8F4FD' }]}>
              <Ionicons name="people" size={20} color="#007AFF" />
            </View>
            <Text style={styles.statValue}>{stats.totalConsumers}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#F0FFF4' }]}>
              <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            </View>
            <Text style={styles.statValue}>
              {consumers.filter(c => getTodayDeliveryStatus(c).isDelivered).length}
            </Text>
            <Text style={styles.statLabel}>Delivered</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FFF5F5' }]}>
              <Ionicons name="close-circle" size={20} color="#FF3B30" />
            </View>
            <Text style={styles.statValue}>
              {consumers.filter(c => getTodayDeliveryStatus(c).isCancelled).length}
            </Text>
            <Text style={styles.statLabel}>Cancelled</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: '#FFF9F0' }]}>
              <Ionicons name="time" size={20} color="#FF9500" />
            </View>
            <Text style={styles.statValue}>
              {consumers.filter(c => !getTodayDeliveryStatus(c).hasDelivery).length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {extraRequests.length > 0 && (
          <TouchableOpacity
            style={styles.pendingCard}
            onPress={() =>
              navigation.navigate('ExtraMilkList', { milkmanId: getMilkmanId(), today: getTodayString() })
            }
            activeOpacity={0.8}
          >
            <View style={styles.pendingLeft}>
              <View style={[styles.pendingIconContainer, { backgroundColor: '#E8F4FD' }]}>
                <Ionicons name="water" size={24} color="#007AFF" />
              </View>
              <View>
                <Text style={styles.pendingTitle}>Approved Extra Milk Requests</Text>
              </View>
            </View>
            <View style={styles.pendingRight}>
              <Text style={[styles.pendingCount, { color: '#007AFF' }]}>
                {extraRequests.length}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#666" />
            </View>
          </TouchableOpacity>
        )}

        {/* Smart Error Handling: Show error only if NO data + (NO internet OR API error) */}
        {
          (() => {
            // If we have consumers, don't show error banner
            if (consumers.length > 0) {
              return null;
            }

            // If loading with no data, don't show error yet
            if (loading) {
              return null;
            }

            // If offline with no data, show offline message
            if (!isOnline && !error) {
              return (
                <View style={[styles.modernErrorBanner, { backgroundColor: '#FFF9E6', borderColor: '#FFE5B4' }]}>
                  <Ionicons name="wifi-outline" size={20} color="#FF9500" />
                  <Text style={[styles.errorText, { color: '#FF9500' }]}>No internet & no cached data available</Text>
                </View>
              );
            }

            // If API error and no data, show error
            if (error && consumers.length === 0) {
              return (
                <View style={styles.modernErrorBanner}>
                  <Ionicons name="alert-circle" size={20} color="#FF3B30" />
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(clearError());
                      handleRefresh();
                    }}
                    style={styles.errorRetryButton}
                  >
                    <Text style={styles.errorRetryText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              );
            }

            return null;
          })()
        }

        <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
          <TextInput
            placeholder="Search Consumer..."
            placeholderTextColor="#A0A0A0"
            value={searchText}
            onChangeText={setSearchText}
            style={{
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: '#ccc',
              marginBottom: 5,
            }}
          />
        </View>

        {
          loading && consumers.length === 0 ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Loading your assigned consumers...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredConsumers}
              keyExtractor={(item, index) => `consumer_${item.id || item.customer_id || index}`}
              renderItem={renderConsumerItem}
              contentContainerStyle={styles.modernListContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  colors={['#007AFF']}
                  tintColor="#007AFF"
                />
              }
              ListEmptyComponent={() => (
                <View style={styles.modernEmptyContainer}>
                  <View style={styles.emptyIconContainer}>
                    <Ionicons name="people-outline" size={60} color="#C7C7CC" />
                  </View>
                  <Text style={styles.emptyTitle}>No Consumers Assigned</Text>
                  <Text style={styles.emptyText}>
                    You don't have any consumers assigned yet. Contact your vendor to get started with deliveries.
                  </Text>
                  <TouchableOpacity onPress={handleRefresh} style={styles.modernRefreshButton}>
                    <Ionicons name="refresh" size={18} color="#fff" />
                    <Text style={styles.modernRefreshButtonText}>Refresh</Text>
                  </TouchableOpacity>
                </View>
              )}
              showsVerticalScrollIndicator={false}
            />
          )
        }

        {/* CANCEL REASON MODAL */}
        <Modal
          visible={cancelReasonModal}
          transparent
          animationType="slide"
          onRequestClose={() => setCancelReasonModal(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            padding: 20
          }}>
            <View style={{
              backgroundColor: 'white',
              borderRadius: 10,
              maxHeight: '70%',   // makes it scrollable
              padding: 20
            }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>
                Select reason for cancellation
              </Text>

              <ScrollView>
                {[
                  'Customer unavailable',
                  'Address issue',
                  'Product issue',
                  'Weather/Traffic delay',
                  'Other reason',
                  'Payment pending',
                  'Customer refused',
                  'Milk not required today',
                  'Door locked',
                  'Phone not reachable',
                  'Wrong address',
                  'Shifted house'
                ].map((reason, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => {
                      handleMarkDeliveryCancelled(selectedItem, reason);
                      setCancelReasonModal(false);
                    }}
                    style={{
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: '#ddd'
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{reason}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                onPress={() => setCancelReasonModal(false)}
                style={{
                  marginTop: 10,
                  alignSelf: 'flex-end',
                  padding: 10
                }}
              >
                <Text style={{ fontSize: 16, color: 'red' }}>Close</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      </View >
    </SafeAreaWrapper >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  modernHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E4E8',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  headerBackButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#F8F9FA',
  },
  headerContent: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
    fontWeight: '500',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    position: 'relative',
  },
  modernStatsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '500',
  },
  modernCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  modernAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  deliveredBadge: {
    backgroundColor: '#34C759',
  },
  cancelledBadge: {
    backgroundColor: '#FF3B30',
  },
  pendingBadge: {
    backgroundColor: '#FF9500',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  addressSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF9F0',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
  },
  addressText: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
    flex: 1,
  },
  milkSection: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  milkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  milkHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    flex: 1,
    marginLeft: 6,
  },
  totalMilkBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  totalMilkBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  milkDetails: {
    gap: 6,
  },
  milkType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  milkTypeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  milkTypeText: {
    fontSize: 13,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  noMilkContainer: {
    backgroundColor: '#FFF8E1',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  noMilkText: {
    fontSize: 13,
    color: '#FF9500',
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '600',
  },
  lockIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  lockIndicatorText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calendarButton: {
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  deliverButton: {
    backgroundColor: '#34C759',
  },
  deliverButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  cancelButton: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  cancelButtonDisabled: {
    backgroundColor: '#C7C7CC',
    borderColor: '#C7C7CC',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bottomSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F4',
    gap: 8,
  },
  vendorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  vendorText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  remarksInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  remarksText: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
    flex: 1,
    lineHeight: 16,
  },
  modernErrorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FFD6D6',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    gap: 12,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    flex: 1,
    fontWeight: '500',
  },
  errorRetryButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  errorRetryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '500',
  },
  modernListContainer: {
    paddingBottom: 40,
  },
  modernEmptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
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
  modernRefreshButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modernRefreshButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  pendingCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
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
  pendingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 24,
    backgroundColor: '#FFF4E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  pendingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  pendingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pendingCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF9500',
    marginRight: 8,
  },
  offlineIndicatorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9500',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  offlineIndicatorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
});

export default ConsumerListScreen;
