import { useEffect } from 'react';
import { BackHandler, Alert, Platform } from 'react-native';

const useExitAppConfirmation = () => {
  useEffect(() => {
    // We only add the listener on Android devices
    if (Platform.OS !== 'android') return;

    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit the app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => BackHandler.exitApp(),
        },
      ]);
      return true; // prevent default behavior (exit app)
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);
};

export default useExitAppConfirmation;
