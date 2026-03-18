import { useEffect, useState } from 'react';
import VersionCheck from 'react-native-version-check';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UPDATE_CONFIG } from './updateConfig';

const STORAGE_KEY = 'LAST_UPDATE_CHECK';

export const useAppUpdate = () => {
    const [showUpdate, setShowUpdate] = useState(false);
    const [forceUpdate, setForceUpdate] = useState(false);

    const checkUpdate = async () => {
        try {
            const lastCheck = await AsyncStorage.getItem(STORAGE_KEY);
            const now = Date.now();

            // ⏱️ check once every 24 hrs
            if (lastCheck && now - parseInt(lastCheck, 10) < UPDATE_CONFIG.CHECK_INTERVAL) {
                return;
            }

            const latestVersion = await VersionCheck.getLatestVersion();
            const currentVersion = VersionCheck.getCurrentVersion();

            // Save check time
            await AsyncStorage.setItem(STORAGE_KEY, now.toString());

            if (latestVersion !== currentVersion) {
                setShowUpdate(true);

                // 🔴 Force update logic
                if (latestVersion >= UPDATE_CONFIG.FORCE_UPDATE_VERSION) {
                    setForceUpdate(true);
                }
            }

        } catch (e) {
            console.log('Update error', e);
        }
    };

    useEffect(() => {
        checkUpdate();
    }, []);

    return { showUpdate, forceUpdate, setShowUpdate };
};
