import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    Alert,
    Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getAcceptedCustomers } from '../../apiServices/allApi';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SafeAreaWrapper from '../../styles/SafeAreaWrapper';

type RootStackParamList = {
    AllConsumersList: undefined;
    UserDetails: {
        userId: number;
        userType: 'consumer' | 'distributor';
        userName: string;
    };
    TemporaryDistributorAssignment: {
        consumerId: number;
        consumerName: string;
        currentDistributorId?: number;
        currentDistributorName?: string;
        isTemporary: boolean;
    };
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AllConsumersList'>;

type AcceptedItem = {
    id: number;
    user_id: number;
    status: string;
    customer?: {
        id: number;
        first_name: string;
        last_name: string;
    } | null;
    milkman?: {
        id: number;
        full_name: string;
    };
    name?: string | null;
    user_type: 'customer' | 'milkman';
    user_contact: string;
    vendor: number;
    assigned_customers_count?: number;
    assigned_distributor_id?: number;
    assigned_distributor_name?: string;
    has_temporary_distributor?: boolean;
};

const ConsumersListScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { user } = useSelector((state: RootState) => state.auth);
    const [acceptedConsumers, setAcceptedConsumers] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
                return '#4CD964';
            case 'pending':
                return '#FFA500';
            case 'rejected':
                return '#FF6B6B';
            default:
                return '#4CD964';
        }
    };

    const fetchConsumers = useCallback(async () => {
        try {
            const vendorId = user?.userID;
            if (!vendorId) {
                throw new Error('Vendor ID not found');
            }
            const consumerRes = await getAcceptedCustomers(vendorId);
            let consumersData = consumerRes?.data?.data || consumerRes?.data || [];
            if (!Array.isArray(consumersData)) consumersData = [];

            const mapped = consumersData.map((item: any, index: number) => ({
                id: item.join_request_id || item.customer_id || index + 1,
                user_id: item.customer_id || item.user_id || index + 1,
                status: item.status || 'accepted',
                customer: item.customer_name
                    ? {
                        id: item.customer_id || index + 1,
                        first_name: item.customer_name?.split(' ')[0] || 'Unknown',
                        last_name: item.customer_name?.split(' ').slice(1).join(' ') || '',
                    }
                    : null,
                name: item.customer_name || item.name || `Consumer ${index + 1}`,
                user_contact: item.customer_contact || item.contact || 'No contact',
                assigned_distributor_name:
                    item.assigned_distributor_name || item.permanent_distributor_name,
                has_temporary_distributor: item.has_temporary_distributor || false,
            }));

            setAcceptedConsumers(mapped);
        } catch (err) {
            console.error('Error fetching consumers:', err);
            setAcceptedConsumers([]);
        } finally {
            setRefreshing(false);
        }
    }, [user?.userID]);

    useFocusEffect(
        useCallback(() => {
            fetchConsumers();
        }, [fetchConsumers])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchConsumers();
    };

    const handleNavigateToUserDetails = (item: any) => {
        try {
            const userName = item.customer
                ? `${item.customer.first_name} ${item.customer.last_name}`.trim()
                : item.name || 'Unknown Consumer';

            navigation.navigate('UserDetails', {
                userId: item.user_id,
                userType: 'consumer',
                userName,
            });
        } catch (err) {
            Alert.alert('Error', 'Cannot navigate to details');
        }
    };

    const handleNavigateToTempAssignment = useCallback((item: AcceptedItem) => {
        try {
            navigation.navigate('TemporaryDistributorAssignment', {
                consumerId: item.user_id,
                consumerName: item.name || 'Unknown Consumer',
                currentDistributorId: item.assigned_distributor_id,
                currentDistributorName: item.assigned_distributor_name,
                isTemporary: item.has_temporary_distributor || false,
            });
        } catch (navError) {
            console.error('Navigation error:', navError);
            Alert.alert('Error', 'Cannot navigate to temporary assignment');
        }
    }, [navigation]);

    return (
        <SafeAreaWrapper>
            <View style={styles.container}>
                {/* HEADER BAR */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
                    </TouchableOpacity>

                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>All Consumers</Text>
                        <Text style={styles.headerSubtitle}>
                            View all accepted consumers here
                        </Text>
                    </View>
                </View>

                {/* LIST CONTAINER */}
                <View style={styles.listContainer}>
                    {acceptedConsumers.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="people-outline" size={48} color="#ccc" />
                            <Text style={styles.emptyText}>No accepted consumers found.</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={acceptedConsumers}
                            keyExtractor={(item, index) => `consumer_${item.id || index}`}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                            renderItem={({ item }) => (
                                <View style={styles.listItemContainer}>
                                    <TouchableOpacity
                                        style={styles.listItem}
                                        activeOpacity={0.8}
                                        onPress={() => handleNavigateToUserDetails(item)}
                                    >
                                        <View style={styles.left}>
                                            <View style={styles.avatar}>
                                                <Text style={styles.avatarText}>
                                                    {((item.customer?.first_name?.[0] || '') +
                                                        (item.customer?.last_name?.[0] || ''))
                                                        .toUpperCase() || item.name?.[0]?.toUpperCase() || 'U'}
                                                </Text>
                                            </View>
                                            <View style={styles.info}>
                                                <Text style={styles.name}>
                                                    {item.customer
                                                        ? `${item.customer.first_name} ${item.customer.last_name}`.trim()
                                                        : item.name}
                                                </Text>
                                                <Text style={styles.contact}>{item.user_contact}</Text>
                                                {item.assigned_distributor_name && (
                                                    <Text style={styles.assigned}>
                                                        Assigned: {item.assigned_distributor_name}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>

                                        <View style={styles.right}>
                                            <View
                                                style={[
                                                    styles.statusBadge,
                                                    { backgroundColor: getStatusColor(item.status) + '20' },
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.statusText,
                                                        { color: getStatusColor(item.status) },
                                                    ]}
                                                >
                                                    {item.status?.toUpperCase()}
                                                </Text>
                                            </View>
                                            <Ionicons name="chevron-forward" size={20} color="#ccc" />
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            styles.tempAssignButton,
                                            item.has_temporary_distributor && styles.tempAssignButtonActive,
                                        ]}
                                        onPress={() => handleNavigateToTempAssignment(item)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name={item.has_temporary_distributor ? 'close-circle' : 'swap-horizontal'}
                                            size={18}
                                            color={item.has_temporary_distributor ? '#FF3B30' : '#007AFF'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                        />
                    )}
                </View>
            </View>
        </SafeAreaWrapper>
    );
};

export default ConsumersListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
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
        padding: 8,
        marginRight: 12,
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    headerSubtitle: {
        fontSize: 13,
        color: "#666",
        marginTop: 2,
    },
    listContainer: {
        padding: 10,
    },
    listItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        width: '90%',
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        marginRight: 10,

    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: '600', color: '#1a1a1a' },
    contact: { fontSize: 13, color: '#666' },
    assigned: { fontSize: 11, color: '#007AFF', marginTop: 2 },
    right: { flexDirection: 'row', alignItems: 'center' },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    statusText: { fontSize: 11, fontWeight: 'bold' },
    emptyState: { alignItems: 'center', marginTop: 50 },
    emptyText: { fontSize: 16, color: '#999', marginTop: 10 },
    tempAssignButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F4FD',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.04,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
            },
            android: {
                elevation: 2,
            },
        }),
    },
    tempAssignButtonActive: {
        backgroundColor: '#FFE8E8',
    },
});