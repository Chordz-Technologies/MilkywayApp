import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store, persistor } from "./../MilkywayApp/src/store";
import AppNavigator from "../MilkywayApp/src/navigation/AppNavigator";
import messaging, { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import NetInfo from '@react-native-community/netinfo';
import analytics from "@react-native-firebase/analytics";
import crashlytics from "@react-native-firebase/crashlytics";

import {
  requestUserPermission,
  sendFCMTokenToServer,
  setupNotificationListeners,
  clearAllNotifications,
  showLocalNotification,
} from "../MilkywayApp/src/notifications/FCM";
import { syncOfflineData } from "./src/utils/syncOfflineData";
import UpdateModal from './src/screens/UpdateModal';
import { useAppUpdate } from './src/utils/useAppUpdate';

export default function App() {
  const { showUpdate, forceUpdate, setShowUpdate } = useAppUpdate();

  useEffect(() => {
    const initFCM = async () => {

      // Firebase Analytics 
      analytics().logAppOpen();
      analytics().logEvent("app_launched");

      // Firebase Crashlytics 
      crashlytics().log("Milkyway App Mounted");

      // Request notification permission
      await requestUserPermission();

      // Send token to backend
      await sendFCMTokenToServer();

      // Subscribe ALL users to a topic (optional)
      try {
        await messaging().subscribeToTopic("global");
        console.log("✅ Subscribed to global topic");
      } catch (err) {
        console.log("❌ Topic subscribe error:", err);
      }

      // SYNC OFFLINE DATA (initial)
      await syncOfflineData();

      // Listen for connectivity changes and sync when connection is regained
      const unsubscribeNet = NetInfo.addEventListener((state) => {
        if (state.isConnected) {
          syncOfflineData().catch(e => console.log('Sync on reconnect failed', e));
        }
      });

      // Setup listeners (foreground notifications)
      const unsubscribe = setupNotificationListeners();

      // Background notification handling
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

      // Quit state notification handling
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
        try { unsubscribeNet(); } catch (e) { /* ignore */ }
      };
    };

    initFCM();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AppNavigator />

          <UpdateModal
            visible={showUpdate}
            forceUpdate={forceUpdate}   // you are not using force update now
            onClose={() => setShowUpdate(false)}
          />

        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}