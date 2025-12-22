import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import notifee from "@notifee/react-native";
import { getNotifications, clearNotifications, markAllAsRead } from "../notifications/NotificationService";
import type { NativeStackScreenProps } from "@react-navigation/native-stack"; // ✅ correct import
import SafeAreaWrapper from '../styles/SafeAreaWrapper';

type RootStackParamList = {
    Notifications: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, "Notifications">;

interface NotificationItem {
    id: string | number;
    title: string;
    body: string;
    timestamp: number | string;
}

const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    const loadNotifications = async () => {
        const data: NotificationItem[] = await getNotifications();
        setNotifications(data);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", async () => {
            await notifee.cancelAllNotifications();
            await markAllAsRead();
            loadNotifications();
        });
        return unsubscribe;
    }, [navigation]);

    const formatDate = (timestamp: number | string): string => {
        const d = new Date(timestamp);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const seconds = String(d.getSeconds()).padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${day}/${month}/${year}  ${hours}:${minutes}:${seconds} ${ampm}`;
    };

    return (
        <SafeAreaWrapper>
            <View style={styles.notifications_container}>
                <View style={styles.header}>
                    {/* Back button */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Icon name="arrow-back" size={24} color="#1a1a1a" />
                    </TouchableOpacity>

                    {/* Title */}
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>Notifications</Text>
                        <Text style={styles.headerSubtitle}>Your recent updates</Text>
                    </View>

                    {/* Clear All */}
                    <TouchableOpacity
                        onPress={async () => {
                            await clearNotifications();
                            setNotifications([]);
                            await notifee.cancelAllNotifications();
                        }}
                        style={styles.clearButton}
                    >
                        <Text style={styles.clearBtn}>Clear All</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {notifications.length === 0 ? (
                        <Text style={styles.empty}>No notifications yet</Text>
                    ) : (
                        notifications.map((item) => (
                            <View key={item.id} style={styles.card}>
                                <Text style={styles.cardTitle}>{item.title}</Text>
                                <Text style={styles.cardBody}>{item.body}</Text>
                                <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
                            </View>
                        ))
                    )}
                </ScrollView>
            </View>
        </SafeAreaWrapper>
    );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
    notifications_container: {
        flex: 1,
        backgroundColor: "white",
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
    clearButton: {
        padding: 8,
        backgroundColor: '#fb4b4bff',
        borderRadius: 5
    },
    clearBtn: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffffff',
    },
    content: { padding: 10 },
    card: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
    cardTitle: { fontSize: 16, fontWeight: "bold" },
    cardBody: { fontSize: 14, marginTop: 4 },
    timestamp: { fontSize: 12, marginTop: 4, color: "gray" },
    empty: { textAlign: "center", marginTop: 100, fontSize: 16, color: "gray" },
});