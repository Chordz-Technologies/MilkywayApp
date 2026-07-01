import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform, } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RazorpayCheckout from 'react-native-razorpay';
import { getCustomerBills, verifyConsumerPayment, createConsumerOrder } from '../../apiServices/allApi'; // ✅ import your APIs
import SafeAreaWrapper from '../../styles/SafeAreaWrapper';
import { useTranslation } from '../../i18n/LanguageProvider';

type RootStackParamList = {
    VendorSubscription: undefined;
    VendorHome: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VendorSubscription'>;

type Subscription = {
    id: number;
    name: string;
    price: number;
    duration: string;
    description: string;
    total_regular_cow: number;
    total_regular_buffalo: number;
    total_extra_cow: number;
    total_extra_buffalo: number;
    line_items: BillLineItem[];
};

type BillLineItem = {
    id: number;
    date: string;
    description: string;
    quantity: string;
    rate: string;
    amount: string;
    is_extra: boolean;
};

const ConsumerSubscriptionScreen = () => {
    const { t } = useTranslation();
    const navigation = useNavigation<NavigationProp>();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    // Fetch subscription bills
    const fetchSubscriptions = async () => {
        try {
            setIsLoading(true);
            const response = await getCustomerBills();
            const json = response.data;

            let billsArray: any[] = [];

            // Handle both array and single object
            if (json.status === 'success') {
                if (Array.isArray(json.bills)) {
                    billsArray = json.bills;
                } else if (json.bill) {
                    billsArray = [json.bill];
                }
            }

            if (billsArray.length > 0) {
                const formattedData: Subscription[] = billsArray.map((item: any) => ({
                    id: item.id || 0,
                    name: t('subscription.monthlyBill'),
                    price: parseFloat(item.total_amount) || 0,
                    duration: `${formatDate(item.start_date)} → ${formatDate(item.end_date)}`,
                    description: `${t('subscription.status')}: ${item.status}`,
                    total_regular_cow: item.total_regular_cow || 0,
                    total_regular_buffalo: item.total_regular_buffalo || 0,
                    total_extra_cow: item.total_extra_cow || 0,
                    total_extra_buffalo: item.total_extra_buffalo || 0,
                    line_items: item.line_items || [],
                }));
                setSubscriptions(formattedData);
            } else {
                Alert.alert(t('common.error'), t('subscription.noBills'));
                setSubscriptions([]);
            }
        } catch (error: any) {
            Alert.alert(t('common.error'), t('subscription.failedToLoad'));
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = () => {
        fetchSubscriptions();
    };

    // Handle Razorpay payment
    const handleSubscribe = async (pkg: Subscription) => {
        try {
            setProcessingId(pkg.id);

            // Step 1: Create order via your backend
            const orderRes = await createConsumerOrder({
                amount: pkg.price,        // using the bill amount
                payment_type: "bill", // your backend expects this
            });

            const data = orderRes.data?.data;

            if (!data || !data.order_id || !data.razorpay_key_id) {
                Alert.alert(t('common.error'), t('subscription.invalidOrder'));
                setProcessingId(null);
                return;
            }

            const razorpayOrderId = data.order_id;
            const razorpayKey = data.razorpay_key_id;
            const amount = data.amount

            // Step 2: Open Razorpay Checkout
            const options = {
                description: t('subscription.consumerPayment'),
                name: t('subscription.consumerPayment'),
                currency: data.currency || "INR",
                key: razorpayKey,
                amount: amount,
                order_id: razorpayOrderId,
                prefill: {
                    name: data.user_name || "Customer",
                    contact: data.user_contact_number || "",
                },
                theme: { color: "#007AFF" },
            };

            RazorpayCheckout.open(options)
                .then(async (paymentData) => {

                    // Step 3: Verify Payment
                    const verifyRes = await verifyConsumerPayment({
                        razorpay_order_id: paymentData.razorpay_order_id,
                        razorpay_payment_id: paymentData.razorpay_payment_id,
                        razorpay_signature: paymentData.razorpay_signature,
                    });

                    if (verifyRes.data?.status === "success") {
                        Alert.alert(t('common.success'), t('subscription.paymentVerified'));
                        fetchSubscriptions(); // refresh bills after successful payment
                    } else {
                        Alert.alert(t('common.error'), t('subscription.paymentVerificationFailed'));
                    }
                })
                .catch((error) => {
                    Alert.alert(t('common.error'), t('subscription.paymentFailed'));
                });
        } catch (error: any) {
            console.error("❌ Error during payment:", error);
        }
        finally {
            setProcessingId(null);
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';

        const [year, month, day] = dateStr.split('-');
        return `${day}-${month}-${year}`;
    };

    const getMilkDescription = (item: BillLineItem) => {
        const desc = item.description.toLowerCase();

        const isCow = desc.includes('cow');
        const isBuffalo = desc.includes('buffalo');

        if (item.is_extra) {
            if (isCow) return t('subscription.cowExtra');
            if (isBuffalo) return t('subscription.buffaloExtra');
            return t('subscription.extraMilk');
        }

        if (isCow) return t('subscription.cow');
        if (isBuffalo) return t('subscription.buffalo');

        return t('subscription.milk');
    };

    const renderLineItem = ({ item }: { item: BillLineItem }) => (
        <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1.3 }]}>
                {formatDate(item.date)}
            </Text>
            <Text style={[styles.tableCell, { flex: 1.4 }]}>
                {getMilkDescription(item)}
            </Text>
            <Text style={[styles.tableCell, { flex: 0.8 }]}>
                {item.quantity}
            </Text>
            <Text style={[styles.tableCell, { flex: 0.8 }]}>
                ₹{item.rate}
            </Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>
                ₹{item.amount}
            </Text>
        </View>
    );

    const renderSubscriptionCard = ({ item }: { item: Subscription }) => {
        const isProcessing = processingId === item.id;

        return (
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <View style={styles.avatarCircle}>
                        <Text style={styles.avatarText}>{item.name.substring(0, 2).toUpperCase()}</Text>
                    </View>
                    <View style={styles.cardHeaderText}>
                        <Text style={styles.packageName}>{item.name}</Text>
                        <Text style={styles.packageDuration}>{item.duration}</Text>
                    </View>
                    <View style={styles.priceTag}>
                        <Ionicons name="cash-outline" size={16} color="#fff" />
                        <Text style={styles.priceText}>₹{item.price}</Text>
                    </View>
                </View>

                {/* Display additional info: start date, end date, total */}
                <View style={styles.summaryGrid}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>{t('subscription.startDate')}</Text>
                        <Text style={styles.summaryValue}>
                            {item.duration.split("→")[0].trim()}
                        </Text>
                    </View>

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>{t('subscription.endDate')}</Text>
                        <Text style={styles.summaryValue}>
                            {item.duration.split("→")[1].trim()}
                        </Text>
                    </View>

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>{t('subscription.cowMilk')}</Text>
                        <Text style={styles.summaryValue}>{item.total_regular_cow} L</Text>
                    </View>

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>{t('subscription.buffaloMilk')}</Text>
                        <Text style={styles.summaryValue}>{item.total_regular_buffalo} L</Text>
                    </View>

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>{t('subscription.extraCowMilk')}</Text>
                        <Text style={styles.summaryValue}>{item.total_extra_cow} L</Text>
                    </View>

                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>{t('subscription.extraBuffaloMilk')}</Text>
                        <Text style={styles.summaryValue}>{item.total_extra_buffalo} L</Text>
                    </View>

                    <View style={styles.summaryItemFull}>
                        <Text style={styles.summaryLabel}>{t('subscription.totalAmount')}</Text>
                        <Text style={[styles.summaryValue, { fontSize: 16 }]}>
                            ₹{item.price}
                        </Text>
                    </View>
                </View>

                {/* Daily Milk Delivery Table */}
                <View style={styles.tableContainer}>
                    <Text style={styles.tableTitle}> {t('subscription.milkDeliveries')}</Text>

                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, { flex: 1.3 }]}>{t('subscription.date')}</Text>
                        <Text style={[styles.tableHeaderText, { flex: 1.4 }]}>{t('subscription.type')}</Text>
                        <Text style={[styles.tableHeaderText, { flex: 1.2 }]}>{t('subscription.quantity')}</Text>
                        <Text style={[styles.tableHeaderText, { flex: 0.8 }]}>{t('subscription.rate')}</Text>
                        <Text style={[styles.tableHeaderText, { flex: 1 }]}>{t('subscription.amount')}</Text>
                    </View>

                    {/* Scrollable Rows */}
                    <View style={{ height: 5 * 35 }}>
                        <FlashList
                            data={item.line_items}
                            keyExtractor={(row) => row.id.toString()}
                            renderItem={renderLineItem}
                            nestedScrollEnabled
                            showsVerticalScrollIndicator
                            scrollEnabled={item.line_items.length > 5}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.button, styles.subscribeButton]}
                    onPress={() => handleSubscribe(item)}
                    disabled={isProcessing}
                    activeOpacity={0.8}
                >
                    {isProcessing ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <>
                            <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
                            <Text style={styles.subscribeText}>{t('subscription.payNow')}</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>
        );
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FF9500" />
                <Text style={styles.loadingText}>{t('subscription.loadingBills')}</Text>
            </View>
        );
    }

    return (
        <SafeAreaWrapper>
            <View style={styles.container}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>{t('subscription.monthlyBills')}</Text>
                        <Text style={styles.headerSubtitle}>{t('subscription.payBills')}</Text>
                    </View>
                </View>

                {/* Subscription List */}
                {subscriptions.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="gift-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyTitle}>{t('subscription.noPackages')}</Text>
                        <Text style={styles.emptySubtitle}>{t('subscription.noPackagesSubtitle')}</Text>
                    </View>
                ) : (
                    <FlashList
                        data={subscriptions}
                        keyExtractor={(item) => `sub_${item.id}`}
                        renderItem={renderSubscriptionCard}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaWrapper>
    );
};

export default ConsumerSubscriptionScreen;

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
        color: '#666',
        marginTop: 2,
    },
    listContainer: {
        padding: 20,
    },
    card: {
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
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 12,
    },
    avatarCircle: {
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
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardHeaderText: {
        flex: 1,
        marginLeft: 10,
    },
    packageName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    packageDuration: {
        fontSize: 13,
        color: '#666',
    },
    priceTag: {
        flexDirection: 'row',
        backgroundColor: '#FF9500',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        alignItems: 'center',
        gap: 4,
    },
    priceText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: 'bold',
    },
    descriptionContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        gap: 8,
        marginBottom: 14,
    },
    descriptionText: {
        flex: 1,
        fontSize: 14,
        color: '#1a1a1a',
        lineHeight: 20,
    },
    summaryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 12,
    },

    summaryItem: {
        width: '50%',
        marginBottom: 10,
    },

    summaryItemFull: {
        width: '100%',
        marginTop: 6,
    },

    summaryLabel: {
        fontSize: 12,
        color: '#777',
    },

    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 6,
    },
    subscribeButton: {
        backgroundColor: '#007AFF',
    },
    subscribeText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        lineHeight: 20,
    },
    tableContainer: {
        marginBottom: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        padding: 10,
    },

    tableTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 8,
        color: '#1a1a1a',
    },

    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },

    tableHeaderText: {
        flex: 1,
        fontWeight: '600',
        fontSize: 13,
        color: '#444',
    },

    tableRow: {
        flexDirection: 'row',
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderBottomColor: '#e0e0e0',
    },

    tableCell: {
        flex: 1,
        fontSize: 13,
        color: '#333',
    },
});