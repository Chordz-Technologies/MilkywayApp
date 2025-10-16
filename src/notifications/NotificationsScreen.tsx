import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import notifee from "@notifee/react-native";
import { getNotifications, clearNotifications, markAllAsRead } from "../notifications/NotificationService";
import type { NativeStackScreenProps } from "@react-navigation/native-stack"; // ✅ correct import

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
        <View style={styles.notifications_container}>
            <View style={styles.notifications_header}>
                <View style={{ flex: 1 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={28} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 2, alignItems: "center" }}>
                    <Text style={styles.notification_title}>Notifications</Text>
                </View>

                <View style={{ flex: 1, alignItems: "flex-end" }}>
                    <TouchableOpacity
                        onPress={async () => {
                            await clearNotifications();
                            setNotifications([]);
                            await notifee.cancelAllNotifications();
                        }}
                    >
                        <Text style={styles.clearBtn}>Clear All</Text>
                    </TouchableOpacity>
                </View>
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
    );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
    notifications_container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 16,
        paddingVertical: 25,
    },
    notifications_header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    notification_title: {
        fontSize: 19,
        fontWeight: "bold",
        color: "blue",
    },
    clearBtn: {
        fontSize: 15,
        color: "red",
    },
    content: { paddingBottom: 20 },
    card: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
    cardTitle: { fontSize: 16, fontWeight: "bold" },
    cardBody: { fontSize: 14, marginTop: 4 },
    timestamp: { fontSize: 12, marginTop: 4, color: "gray" },
    empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "gray" },
});