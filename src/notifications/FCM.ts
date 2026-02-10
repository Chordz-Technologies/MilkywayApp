import messaging, { AuthorizationStatus, FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import notifee, { EventType, Notification as NotifeeNotification } from "@notifee/react-native";
import { sendFCMToken } from "../apiServices/allApi";
import { saveNotification, notificationEmitter } from "../notifications/NotificationService";

// Request notification permission
export async function requestUserPermission(): Promise<boolean> {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

    console.log("Permission enabled:", enabled);

    if (enabled) {
        await notifee.requestPermission();
    }
    return enabled;
}

// Get FCM token
export async function getFCMToken(): Promise<string | null> {
    try {
        const token = await messaging().getToken();
        console.log("FCM Token:", token);
        return token;
    } catch (error) {
        console.log("Error getting FCM token:", error);
        return null;
    }
}

// Send token to backend
export async function sendFCMTokenToServer(): Promise<void> {
    const token = await getFCMToken();
    if (!token) return;

    const id = await AsyncStorage.getItem("id");
    if (!id) return;

    const payload = { id, token };
    const res = await sendFCMToken(payload);
    console.log("FCM token sent to backend:", payload, res);
}

// Show notification (foreground + background)
export async function showLocalNotification(notification: {
    title?: string;
    body?: string;
}): Promise<void> {
    // save notification
    await saveNotification(notification);

    // update system badge
    const currentCount = await notifee.getBadgeCount();
    await notifee.setBadgeCount(currentCount + 1);

    // Emit event for HomeScreen
    notificationEmitter.emit("newNotification");

    // display notification
    await notifee.displayNotification({
        title: notification.title || "New notification",
        body: notification.body || "No content available",
        android: { channelId: "default", smallIcon: "ic_launcher" },
    });
}

// Clear all notifications (when app closes OR user clears)
export async function clearAllNotifications(): Promise<void> {
    await notifee.cancelAllNotifications();
    await notifee.setBadgeCount(0);
    await AsyncStorage.removeItem("notifications"); // ✅ clear stored list
}

// Setup listeners
export function setupNotificationListeners(): () => void {
    // Foreground message
    const unsubscribeOnMessage = messaging().onMessage(
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
    );

    // Background & Quit message tap
    notifee.onForegroundEvent(({ type, detail }) => {
        if (type === EventType.PRESS) {
            console.log("Notification tapped:", detail.notification as NotifeeNotification);
            // Can navigate user to Notification screen here
        }
    });

    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
        console.log("Background message:", remoteMessage);
        const notificationRaw = remoteMessage.notification || {
            title: remoteMessage.data?.title,
            body: remoteMessage.data?.body,
        };
        const notification = {
            title: typeof notificationRaw.title === "string" ? notificationRaw.title : JSON.stringify(notificationRaw.title),
            body: typeof notificationRaw.body === "string" ? notificationRaw.body : JSON.stringify(notificationRaw.body),
        };
        await showLocalNotification(notification);
    });

    return () => {
        unsubscribeOnMessage();
    };
}
