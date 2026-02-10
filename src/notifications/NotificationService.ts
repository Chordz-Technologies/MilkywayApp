import AsyncStorage from "@react-native-async-storage/async-storage";
import { EventEmitter } from "eventemitter3"; // use eventemitter3 for TS compatibility
import notifee from "@notifee/react-native";

export interface AppNotification {
    id: string;
    title: string;
    body: string;
    timestamp: string;
    read: boolean;
}

export const notificationEmitter = new EventEmitter();
const NOTIFICATION_KEY = "APP_NOTIFICATIONS";

export async function showLocalNotification(notification: Partial<AppNotification>): Promise<void> {
    try {
        await saveNotification(notification);
        notificationEmitter.emit("newNotification");

        await notifee.displayNotification({
            title: notification.title || "नवीन नोटिफिकेशन",
            body: notification.body || "मजकूर उपलब्ध नाही",
            android: { channelId: "default", smallIcon: "ic_launcher" },
        });
    } catch (e) {
        console.log("Error showing local notification:", e);
    }
}

// Save a notification
export async function saveNotification(notification: Partial<AppNotification>): Promise<void> {
    try {
        const existing = await AsyncStorage.getItem(NOTIFICATION_KEY);
        let notifications: AppNotification[] = existing ? JSON.parse(existing) : [];

        notifications.unshift({
            id: Date.now().toString(),
            title: notification.title || "नवीन नोटिफिकेशन",
            body: notification.body || "मजकूर उपलब्ध नाही",
            timestamp: new Date().toISOString(),
            read: false,
        });

        await AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));
    } catch (e) {
        console.log("Error saving notification:", e);
    }
}

// Get all notifications
export async function getNotifications(): Promise<AppNotification[]> {
    try {
        const existing = await AsyncStorage.getItem(NOTIFICATION_KEY);
        return existing ? JSON.parse(existing) : [];
    } catch (e) {
        console.log("Error fetching notifications:", e);
        return [];
    }
}

// Clear all notifications
export async function clearNotifications(): Promise<void> {
    try {
        await AsyncStorage.removeItem(NOTIFICATION_KEY);
    } catch (e) {
        console.log("Error clearing notifications:", e);
    }
}

// Get unread count
export async function getUnreadCount(): Promise<number> {
    try {
        const existing = await AsyncStorage.getItem(NOTIFICATION_KEY);
        const notifications: AppNotification[] = existing ? JSON.parse(existing) : [];
        return notifications.filter((n) => !n.read).length;
    } catch {
        return 0;
    }
}

// Mark all as read
export async function markAllAsRead(): Promise<AppNotification[]> {
    try {
        const stored = await AsyncStorage.getItem(NOTIFICATION_KEY);
        let notifications: AppNotification[] = stored ? JSON.parse(stored) : [];

        notifications = notifications.map((n) => ({ ...n, read: true }));

        await AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(notifications));

        return notifications;
    } catch (e) {
        console.log("Error marking notifications as read", e);
        return [];
    }
}
