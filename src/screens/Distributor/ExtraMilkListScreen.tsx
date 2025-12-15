import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
    FlatList,
    Platform,
    TextInput
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { getMilkmanExtraMilkRequests, markExtraMilkDelivery } from '../../apiServices/allApi';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
    ExtraMilkList: { milkmanId: number; today: string };
};

type ExtraMilkListScreenNavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    'ExtraMilkList'
>;

type ExtraMilkListScreenRouteProp = RouteProp<RootStackParamList, 'ExtraMilkList'>;

type Props = {
    navigation: ExtraMilkListScreenNavigationProp;
    route: ExtraMilkListScreenRouteProp;
};

const ExtraMilkListScreen: React.FC<Props> = ({ navigation, route }) => {
    const { milkmanId, today } = route.params;
    const dispatch = useDispatch();

    const [extraRequests, setExtraRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredRequests, setFilteredRequests] = useState<any[]>([]);

    useEffect(() => {
        if (searchText.trim() === '') {
            setFilteredRequests(extraRequests);
        } else {
            const lowerText = searchText.toLowerCase();
            const filtered = extraRequests.filter(r =>
                (r.customer_name || '').toLowerCase().includes(lowerText)
            );
            setFilteredRequests(filtered);
        }
    }, [searchText, extraRequests]);

    const fetchExtraMilkRequests = useCallback(async () => {
        setLoading(true);
        try {
            const resp = await getMilkmanExtraMilkRequests(milkmanId, today);
            const data = resp?.data?.data || resp?.data || [];
            const normalized = Array.isArray(data)
                ? data.map((r: any) => ({
                    id: r.id || r.request_id,
                    request_id: r.request_id || r.id,
                    customer_id: r.customer_id || r.customer?.id || r.consumer_id,
                    customer_name: r.customer_name || r.customer?.first_name + ' ' + r.customer?.last_name || r.consumer?.name,
                    customer_address: r.customer_address || r.customer?.address || r.consumer?.address,
                    date: r.date || r.request_date || today,
                    cow_milk_extra: r.cow_milk_extra ?? r.cow_milk_extra_litres ?? 0,
                    buffalo_milk_extra: r.buffalo_milk_extra ?? r.buffalo_milk_extra_litres ?? 0,
                    total_extra_milk: (r.cow_milk_extra ?? r.cow_milk_extra_litres ?? 0) + (r.buffalo_milk_extra ?? r.buffalo_milk_extra_litres ?? 0),
                }))
                : [];
            setExtraRequests(normalized);
        } catch (err) {
            console.error('Error fetching extra milk requests:', err);
            Alert.alert('Error', 'Failed to fetch extra milk requests.');
        } finally {
            setLoading(false);
        }
    }, [milkmanId, today]);

    const handleMarkExtraDelivered = useCallback(async (request: any) => {
        Alert.alert(
            'Mark Extra Milk Delivered',
            `Mark extra milk request for ${request.customer_name} as delivered?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Mark Delivered',
                    onPress: async () => {
                        try {
                            await markExtraMilkDelivery({
                                request_id: request.id || request.request_id,
                                status: 'delivered',
                            });
                            setExtraRequests(prev => prev.filter(r => (r.id || r.request_id) !== (request.id || request.request_id)));
                            Alert.alert('Success', 'Extra milk request marked as delivered');
                            navigation.goBack();
                        } catch (err: any) {
                            console.error(err);
                            Alert.alert('Error', 'Failed to mark extra milk delivered');
                        }
                    },
                },
            ]
        );
    }, [dispatch, milkmanId]);

    useEffect(() => {
        fetchExtraMilkRequests();
    }, [fetchExtraMilkRequests]);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';

        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };

    const ListHeader = () => (
        <View style={styles.modernHeader}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.headerBackButton}
            >
                <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
            </TouchableOpacity>

            <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Extra Milk Requests</Text>
                <Text style={styles.headerSubtitle}>
                    {formatDate(today)}
                </Text>
            </View>
        </View>
    );

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.modernCard}>
            {/* Header */}
            <View style={styles.cardHeader}>
                <View style={styles.customerInfo}>
                    <View style={styles.modernAvatar}>
                        <Text style={styles.avatarText}>
                            {item.customer_name?.[0]?.toUpperCase() || 'C'}
                        </Text>
                    </View>

                    <View style={styles.customerDetails}>
                        <Text style={styles.customerName} numberOfLines={1}>
                            {item.customer_name}
                        </Text>

                        <View style={styles.contactContainer}>
                            <Ionicons name="calendar" size={12} color="#007AFF" />
                            <Text style={styles.contactText}>
                                {formatDate(item.date)}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.statusBadge, { backgroundColor: '#FFF9F0' }]}>
                    <Text style={[styles.statusText, { color: '#FF9500' }]}>
                        EXTRA
                    </Text>
                </View>
            </View>

            {/* Address */}
            <View style={styles.addressSection}>
                <Ionicons name="location" size={14} color="#FF9500" />
                <Text style={styles.addressText} numberOfLines={2}>
                    {item.customer_address || 'No address'}
                </Text>
            </View>

            {/* Milk */}
            <View style={styles.milkSection}>
                <View style={styles.milkHeader}>
                    <Ionicons name="water" size={16} color="#007AFF" />
                    <Text style={styles.milkHeaderText}>Extra Milk Requirement</Text>

                    <View style={styles.totalMilkBadge}>
                        <Text style={styles.totalMilkBadgeText}>
                            {(() => {
                                const cow = parseFloat(item.cow_milk_extra) || 0;
                                const buff = parseFloat(item.buffalo_milk_extra) || 0;

                                if (cow > 0 && buff > 0) return `${cow + buff}L`;
                                if (cow > 0) return `${cow}L`;
                                if (buff > 0) return `${buff}L`;
                                return '0L';
                            })()}
                        </Text>
                    </View>
                </View>

                <View style={styles.milkDetails}>
                    <Text style={styles.milkTypeText}>
                        Cow: {item.cow_milk_extra}L
                    </Text>
                    <Text style={styles.milkTypeText}>
                        Buffalo: {item.buffalo_milk_extra}L
                    </Text>
                </View>
            </View>

            {/* Action */}
            <TouchableOpacity
                style={[styles.actionButton, styles.deliverButton]}
                onPress={() => handleMarkExtraDelivered(item)}
                activeOpacity={0.8}
            >
                <Ionicons name="checkmark-circle" size={18} color="#fff" />
                <Text style={[styles.actionButtonText, { color: '#fff' }]}>
                    Delivered Extra Milk
                </Text>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text>Loading Extra Milk Requests...</Text>
            </View>
        );
    }

    if (!extraRequests.length) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No Extra Milk Requests for today.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
            <ListHeader />

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
                        marginTop: 10,
                    }}
                />
            </View>

            <FlatList
                data={filteredRequests}
                keyExtractor={(item) => (item.id || item.request_id).toString()}
                renderItem={renderItem}
                contentContainerStyle={[styles.modernListContainer, { paddingTop: 16 }]}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default ExtraMilkListScreen;

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
    modernListContainer: {
        paddingBottom: 40,
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
    deliverButton: {
        backgroundColor: '#34C759',
    },
    actionButtonText: {
        fontSize: 13,
        fontWeight: '600',
    },
});
