import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Platform,
    RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RazorpayCheckout from 'react-native-razorpay';
import { getVendorSubscriptions, createOrder, verifyPayment } from '../../apiServices/allApi'; // ✅ import your APIs
import SafeAreaWrapper from '../../styles/SafeAreaWrapper';

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
};

const VendorSubscriptionScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [processingId, setProcessingId] = useState<number | null>(null);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    // ✅ Fetch subscription plans
    const fetchSubscriptions = async () => {
        try {
            setIsLoading(true);
            const response = await getVendorSubscriptions();
            const json = response.data;

            if (json.status === 'success' && Array.isArray(json.data)) {
                const formattedData: Subscription[] = json.data.map((item: any) => ({
                    id: item.id,
                    name: item.plan_name,
                    price: parseFloat(item.price),
                    duration: `${item.duration} Days`,
                    description: item.description,
                }));
                setSubscriptions(formattedData);
            } else {
                Alert.alert('Error', 'No subscription plans found.');
                setSubscriptions([]);
            }
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            Alert.alert('Error', 'Failed to load subscriptions.');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchSubscriptions();
    };

    // ✅ Handle Razorpay payment
    const handleSubscribe = async (pkg: Subscription) => {
        try {
            setProcessingId(pkg.id);

            // Step 1️⃣: Create order via your backend
            const orderRes = await createOrder({
                subscription_plan_id: pkg.id,
                // device_id: '12345ABC', // optional
            });

            console.log("✅ Create Order Response:", orderRes.data);

            const data = orderRes.data?.data;
            if (!data || !data.order_id || !data.razorpay_key) {
                Alert.alert("Error", "Invalid order response from server.");
                setProcessingId(null);
                return;
            }

            const razorpayOrderId = data.order_id;
            const razorpayKey = data.razorpay_key;
            const amount = parseFloat(data.amount) * 100; // amount in paise

            // Step 2️⃣: Open Razorpay Checkout
            const options = {
                description: data.subscription_details?.plan_name || pkg.name,
                currency: data.currency || 'INR',
                key: razorpayKey,
                amount: amount,
                name: "Milk Vendor Subscription",
                order_id: razorpayOrderId,
                prefill: {
                    // email: 'vendor@email.com',
                    contact: data.vendor_contact_number || '',
                    name: data.subscription_details?.vendor_name || 'Vendor',
                },
                theme: { color: '#007AFF' },
            };

            RazorpayCheckout.open(options)
                .then(async (paymentData) => {
                    console.log("✅ Razorpay Payment Success:", paymentData);

                    // Step 3️⃣: Verify Payment
                    const verifyRes = await verifyPayment({
                        razorpay_order_id: paymentData.razorpay_order_id,
                        razorpay_payment_id: paymentData.razorpay_payment_id,
                        razorpay_signature: paymentData.razorpay_signature,
                    });

                    console.log("✅ Verify Payment Response:", verifyRes.data);

                    if (verifyRes.data?.status === "success") {
                        Alert.alert("Success", "Payment verified successfully!");
                    } else {
                        Alert.alert("Error", "Payment verification failed. Please contact support.");
                    }
                })
                .catch((error) => {
                    Alert.alert("Payment Failed", "Payment was not completed. Please try again.");
                });
        } catch (error) {
            Alert.alert("Error", "Something went wrong during payment.");
        } finally {
            setProcessingId(null);
        }
    };

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

                <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>{item.description}</Text>
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
                            <Text style={styles.subscribeText}>Subscribe Now</Text>
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
                <Text style={styles.loadingText}>Loading subscriptions...</Text>
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
                        <Text style={styles.headerTitle}>Subscriptions</Text>
                        <Text style={styles.headerSubtitle}>Choose your preferred plan below</Text>
                    </View>
                </View>

                {/* Subscription List */}
                {subscriptions.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="gift-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyTitle}>No Packages Found</Text>
                        <Text style={styles.emptySubtitle}>Subscription plans will appear here.</Text>
                    </View>
                ) : (
                    <FlatList
                        data={subscriptions}
                        keyExtractor={(item) => `sub_${item.id}`}
                        renderItem={renderSubscriptionCard}
                        contentContainerStyle={styles.listContainer}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </SafeAreaWrapper>
    );
};

export default VendorSubscriptionScreen;

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
});
