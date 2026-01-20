import InAppReview from 'react-native-in-app-review';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

/**
 * Triggers Google Play In-App Review flow
 */
export const requestInAppRating = async (): Promise<void> => {
    try {
        if (InAppReview.isAvailable()) {
            await analytics().logEvent('in_app_rating_requested');

            InAppReview.RequestInAppReview()
                .then((hasFlowFinishedSuccessfully: boolean) => {
                    analytics().logEvent('in_app_rating_shown', {
                        success: hasFlowFinishedSuccessfully,
                    });
                })
                .catch((error: unknown) => {
                    crashlytics().recordError(error as Error);
                });
        } else {
            await analytics().logEvent('in_app_rating_not_available');
        }
    } catch (error: unknown) {
        crashlytics().recordError(error as Error);
    }
};
