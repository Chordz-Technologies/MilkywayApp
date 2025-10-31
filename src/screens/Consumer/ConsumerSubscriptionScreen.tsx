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
import { getCustomerBills, verifyConsumerPayment, createConsumerOrder } from '../../apiServices/allApi'; // ✅ import your APIs

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
    // ✅ Fetch subscription bills (instead of plans)
    const fetchSubscriptions = async () => {
        try {
            setIsLoading(true);
            const response = await getCustomerBills();
            const json = response.data;

            console.log("✅ API Response:", json);

            let billsArray: any[] = [];

            // ✅ Handle both array and single object
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
                    name: `Monthly Bill`,
                    price: parseFloat(item.total_amount) || 0,
                    duration: `${item.start_date} → ${item.end_date}`,
                    description: `Status: ${item.status}`,
                }));
                setSubscriptions(formattedData);
            } else {
                Alert.alert('Error', 'No bills found.');
                setSubscriptions([]);
            }
        } catch (error) {
            console.error('❌ Error fetching bills:', error);
            Alert.alert('Error', 'Failed to load bills.');
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
            const orderRes = await createConsumerOrder({
                amount: pkg.price,        // using the bill amount
                payment_type: "bill", // your backend expects this
            });

            console.log("✅ Create Order Response:", orderRes.data);

            const data = orderRes.data?.data;

            if (!data || !data.order_id || !data.razorpay_key_id) {
                Alert.alert("Error", "Invalid order response from server.");
                setProcessingId(null);
                return;
            }

            const razorpayOrderId = data.order_id;
            const razorpayKey = data.razorpay_key_id;
            const amount = data.amount

            // Step 2️⃣: Open Razorpay Checkout
            const options = {
                description: "Consumer Payment",
                currency: data.currency || "INR",
                key: razorpayKey,
                amount: amount,
                name: "Consumer Payment",
                order_id: razorpayOrderId,
                prefill: {
                    name: data.user_name || "Customer",
                    contact: data.user_contact_number || "",
                },
                theme: { color: "#007AFF" },
            };

            RazorpayCheckout.open(options)
                .then(async (paymentData) => {
                    console.log("✅ Razorpay Payment Success:", paymentData);

                    // Step 3️⃣: Verify Payment
                    const verifyRes = await verifyConsumerPayment({
                        razorpay_order_id: paymentData.razorpay_order_id,
                        razorpay_payment_id: paymentData.razorpay_payment_id,
                        razorpay_signature: paymentData.razorpay_signature,
                    });

                    console.log("✅ Verify Payment Response:", verifyRes.data);

                    if (verifyRes.data?.status === "success") {
                        Alert.alert("Success", "Payment verified successfully!");
                        fetchSubscriptions(); // 🔄 refresh bills after successful payment
                    } else {
                        Alert.alert("Error", "Payment verification failed. Please contact support.");
                    }
                })
                .catch((error) => {
                    Alert.alert("Payment Failed", "Payment was not completed. Please try again.");
                });
        } catch (error: any) {
            console.error("❌ Error during payment:", error);

            // 🧩 Step 1: Log the payload sent (for debugging)
            console.log("📦 Payload sent to createConsumerOrder:");
            console.log(
                JSON.stringify(
                    {
                        amount: pkg.price,
                        payment_type: "bill",
                    },
                    null,
                    2
                )
            );

            // 🧩 Step 2: Log request info if Axios error
            console.log("🌍 API Endpoint:", error.config?.url || "Unknown URL");
            console.log("📬 Method:", error.config?.method?.toUpperCase?.() || "Unknown");
            console.log(
                "📤 Request Headers:",
                JSON.stringify(error.config?.headers || {}, null, 2)
            );

            // 🧩 Step 3: Detailed error analysis
            if (error.response) {
                // ✅ Server responded with error
                console.log("🔴 API Response Error:");
                console.log("➡️ Status Code:", error.response.status);
                console.log("➡️ Status Text:", error.response.statusText);
                console.log(
                    "➡️ Response Data:",
                    JSON.stringify(error.response.data, null, 2)
                );
            } else if (error.request) {
                // ⚠️ No response received (network issue)
                console.log("🟠 Network Error: No response received from server.");
                console.log("➡️ Request:", error.request);
            } else if (error.message) {
                // ⚙️ Some other JS/native error
                console.log("🟣 JS/Native Error Message:", error.message);
            } else {
                // ❓ Unknown error
                console.log("⚫ Unknown Error Object:", error);
            }

            // 🧾 Step 4: Log complete object (Hermes-friendly)
            try {
                console.log(
                    "🧾 Full Error Object:",
                    JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
                );
            } catch (jsonErr) {
                console.log("⚠️ Could not stringify full error object:", jsonErr);
            }

            // 🧩 Step 5: User alert
            Alert.alert(
                "Error",
                "Something went wrong during payment.\n\nPlease check the console for detailed logs."
            );
        }
        finally {
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

                {/* ✅ Display additional info: start date, end date, total */}
                <View style={{ marginBottom: 15 }}>
                    <Text style={{ fontSize: 14, color: '#444', marginBottom: 10 }}>
                        🗓 Start Date: <Text style={{ fontWeight: '600' }}>{item.duration.split("→")[0].trim()}</Text>
                    </Text>
                    <Text style={{ fontSize: 14, color: '#444', marginBottom: 10 }}>
                        📅 End Date: <Text style={{ fontWeight: '600' }}>{item.duration.split("→")[1].trim()}</Text>
                    </Text>
                    <Text style={{ fontSize: 14, color: '#444', marginBottom: 10 }}>
                        💰 Total Amount: <Text style={{ fontWeight: '600' }}>₹{item.price}</Text>
                    </Text>
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
                            <Text style={styles.subscribeText}>Pay Now</Text>
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