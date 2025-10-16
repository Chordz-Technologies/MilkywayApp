import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, persistor } from "./../MilkywayApp/src/store";
import AppNavigator from "../MilkywayApp/src/navigation/AppNavigator";
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging";

import {
  requestUserPermission,
  sendFCMTokenToServer,
  setupNotificationListeners,
  clearAllNotifications,
  showLocalNotification,
} from "../MilkywayApp/src/notifications/FCM";

export default function App() {
  useEffect(() => {
    const initFCM = async () => {
      // 1. Request permission
      await requestUserPermission();

      // 2. Send token to backend
      await sendFCMTokenToServer();

      // 3. Subscribe ALL users to a topic (optional)
      try {
        await messaging().subscribeToTopic("global");
        console.log("✅ Subscribed to global topic");
      } catch (err) {
        console.log("❌ Topic subscribe error:", err);
      }

      // 4. Setup listeners (foreground notifications)
      const unsubscribe = setupNotificationListeners();

      // 5. Background notification handling
      const unsubscribeOpened = messaging().onNotificationOpenedApp(
        async (remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
          console.log("📩 Opened from background:", remoteMessage);

          const notificationRaw = remoteMessage.notification ?? {
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

      // 6. Quit state notification handling
      const initialMessage = await messaging().getInitialNotification();
      if (initialMessage) {
        const notificationRaw = initialMessage.notification ?? {
          title: initialMessage.data?.title,
          body: initialMessage.data?.body,
        };
        const notification = {
          title: typeof notificationRaw.title === "string" ? notificationRaw.title : JSON.stringify(notificationRaw.title),
          body: typeof notificationRaw.body === "string" ? notificationRaw.body : JSON.stringify(notificationRaw.body),
        };

        await showLocalNotification(notification);
      }

      // Cleanup when component unmounts
      return () => {
        unsubscribe();
        unsubscribeOpened();
        clearAllNotifications();
      };
    };

    initFCM();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
