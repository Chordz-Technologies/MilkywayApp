import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
    APP_OPEN_COUNT: 'APP_OPEN_COUNT',
    LAST_DISMISSED: 'LAST_RATING_DISMISSED',
    RATED: 'USER_HAS_RATED',
} as const;

// 2 days wait
const TWO_DAYS: number = 2 * 24 * 60 * 60 * 1000;

// Call on every app open
export const incrementAppOpen = async (): Promise<number> => {
    const count = await AsyncStorage.getItem(KEYS.APP_OPEN_COUNT);

    const newCount: number = count ? parseInt(count, 10) + 1 : 1;

    await AsyncStorage.setItem(KEYS.APP_OPEN_COUNT, newCount.toString());

    return newCount;
};

// Decide whether to show rating modal
export const shouldShowRating = async (): Promise<boolean> => {
    // Never show if already rated
    const rated = await AsyncStorage.getItem(KEYS.RATED);
    if (rated === 'true') return false;

    // Wait until app opened 3 times
    const count = await AsyncStorage.getItem(KEYS.APP_OPEN_COUNT);
    if (!count || parseInt(count, 10) < 3) return false;

    // First time (never dismissed)
    const lastDismissed = await AsyncStorage.getItem(KEYS.LAST_DISMISSED);
    if (!lastDismissed) return true;

    // Show again after 2 days
    return Date.now() - parseInt(lastDismissed, 10) >= TWO_DAYS;
};

// User clicked "Maybe Later"
export const markDismissed = async (): Promise<void> => {
    await AsyncStorage.setItem(
        KEYS.LAST_DISMISSED,
        Date.now().toString()
    );
};

// User rated → STOP forever
export const markRated = async (): Promise<void> => {
    await AsyncStorage.setItem(KEYS.RATED, 'true');
};