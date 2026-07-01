import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl, Platform, Alert, } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { RootState } from "../../store";
import { getAcceptedMilkmen } from "../../apiServices/allApi";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import SafeAreaWrapper from '../../styles/SafeAreaWrapper';
import { useTranslation } from '../../i18n/LanguageProvider';

type RootStackParamList = {
    DistributorsList: undefined;
    UserDetails: {
        userId: number;
        userType: "consumer" | "distributor";
        userName: string;
    };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "DistributorsList">;

const DistributorsListScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { user } = useSelector((state: RootState) => state.auth);
    const [distributors, setDistributors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { t } = useTranslation();

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case "accepted":
                return "#4CD964";
            case "pending":
                return "#FFA500";
            case "rejected":
                return "#FF6B6B";
            default:
                return "#4CD964";
        }
    };

    const fetchDistributors = useCallback(async () => {
        try {
            const vendorId = user?.userID;
            if (!vendorId) return;

            const res = await getAcceptedMilkmen(vendorId);
            let data = res?.data?.data || res?.data || [];
            if (!Array.isArray(data)) data = [];

            const mapped = data.map((item: any, index: number) => ({
                id: item.join_request_id || item.milkman_id || index + 1,
                user_id: item.milkman_id || item.user_id || index + 1,
                status: item.status || "accepted",
                name: item.milkman_name || item.name || `${t('distributorsList.distributor')} ${index + 1}`,
                user_contact: item.milkman_contact || t('distributorsList.noContact'),
                assigned_customers_count: item.assigned_customers_count || 0,
            }));

            setDistributors(mapped);
        } catch (err) {
            console.log("Distributor fetch error:", err);
            setDistributors([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.userID]);

    useEffect(() => {
        fetchDistributors();
    }, [fetchDistributors]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchDistributors();
    };

    const getInitials = (name: string) => {
        if (!name) { return 'V'; }
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleNavigateToUserDetails = (item: any) => {
        try {
            const userName =
                item.name || item.milkman_name || t('distributorsList.unknownDistributor');

            navigation.navigate("UserDetails", {
                userId: item.user_id,
                userType: "distributor",
                userName,
            });
        } catch (err) {
            Alert.alert(t('common.error'), t('distributorsList.navigationError'));
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text>{t('distributorsList.loadingDistributors')}</Text>
            </View>
        );
    }

    return (
        <SafeAreaWrapper>
            <View style={styles.container}>
                {/* HEADER BAR */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
                    </TouchableOpacity>

                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>{t('distributorsList.allDistributors')}</Text>
                        <Text style={styles.headerSubtitle}>
                            {t('distributorsList.allDistributorsSubtitle')}
                        </Text>
                    </View>
                </View>

                {/* LIST CONTAINER */}
                <View style={styles.listContainer}>
                    {distributors.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="business-outline" size={48} color="#ccc" />
                            <Text style={styles.emptyText}>{t('distributorsList.noAcceptedDistributors')}</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={distributors}
                            keyExtractor={(item, index) => `distributor_${item.id || index}`}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.listItem}
                                    activeOpacity={0.8}
                                    onPress={() => handleNavigateToUserDetails(item)}
                                >
                                    <View style={styles.avatarSmall}>
                                        <Text style={styles.avatarText}>
                                            {getInitials(item.milkman?.full_name || item.name || 'U')}
                                        </Text>
                                    </View>

                                    <View style={styles.info}>
                                        <Text style={styles.name}>{item.name}</Text>
                                        <Text style={styles.contact}>{item.user_contact}</Text>
                                        {item.assigned_customers_count > 0 && (
                                            <Text style={styles.assigned}>
                                                {item.assigned_customers_count}{' '}{t('distributorsList.customersAssigned')}
                                            </Text>
                                        )}
                                    </View>

                                    <View
                                        style={[
                                            styles.statusBadge,
                                            { backgroundColor: getStatusColor(item.status) + "20" },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.statusText,
                                                { color: getStatusColor(item.status) },
                                            ]}
                                        >
                                            {item.status.toUpperCase()}
                                        </Text>
                                    </View>

                                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                                </TouchableOpacity>
                            )}
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                            }
                        />
                    )}
                </View>
            </View>
        </SafeAreaWrapper>
    );
};

export default DistributorsListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    header: {
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "ios" ? 60 : 40,
        paddingBottom: 16,
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
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
        fontWeight: "bold",
        color: "#1a1a1a",
    },
    headerSubtitle: {
        fontSize: 13,
        color: "#666",
        marginTop: 2,
    },
    listContainer: {
        padding: 20,
    },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.06,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 3 },
            },
            android: {
                elevation: 3,
            },
        }),
    },
    avatarSmall: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#007AFF",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    avatarText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: "600", color: "#1a1a1a" },
    contact: { fontSize: 13, color: "#666", marginTop: 2 },
    assigned: { fontSize: 11, color: "#FF9500", marginTop: 2 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
    statusText: { fontSize: 11, fontWeight: "bold" },
    emptyState: { alignItems: "center", paddingVertical: 40 },
    emptyText: { fontSize: 16, color: "#888", marginTop: 12 },
});
