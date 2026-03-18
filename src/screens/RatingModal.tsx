import React from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    Alert,
} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import InAppReview from 'react-native-in-app-review';
import { markDismissed, markRated } from '../utils/ratingManager';

interface RatingModalProps {
    visible: boolean;
    onClose: () => void;
}

interface RatingItem {
    value: number;
    emoji: string;
    label: string;
}

const ratings: RatingItem[] = [
    { value: 1, emoji: '😢', label: 'Bad' },
    { value: 2, emoji: '😕', label: 'Poor' },
    { value: 3, emoji: '😐', label: 'Okay' },
    { value: 4, emoji: '🙂', label: 'Good' },
    { value: 5, emoji: '😍', label: 'Excellent' },
];

const RatingModal: React.FC<RatingModalProps> = ({ visible, onClose }) => {

    const handleRating = async (value: number): Promise<void> => {
        try {
            await analytics().logEvent('rating_selected', { value });

            // LOW RATINGS → SUPPORT
            if (value <= 3) {
                await markDismissed();
                onClose();

                Alert.alert(
                    'How was your experience?',
                    'Please contact our support team.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'OK',
                            onPress: () =>
                                Linking.openURL(
                                    'https://wa.me/7517311326?text=Hello,%20I%20would%20like%20to%20share%20my%20experience!'
                                ),
                        },
                    ]
                );
            } else {
                await markRated();
                onClose();

                if (InAppReview.isAvailable()) {
                    InAppReview.RequestInAppReview();
                }
            }
        } catch (e) {
            crashlytics().recordError(e as Error);
        }
    };

    const handleCancel = async (): Promise<void> => {
        await analytics().logEvent('rating_dismissed');
        await markDismissed();
        onClose();
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.bottomSheet}>
                    <View style={styles.handle} />

                    <Text style={styles.title}>How was your experience?</Text>

                    <View style={styles.row}>
                        {ratings.map((r) => (
                            <TouchableOpacity
                                key={r.value}
                                onPress={() => handleRating(r.value)}
                                style={styles.emojiBox}
                            >
                                <Text style={styles.emoji}>{r.emoji}</Text>
                                <Text style={styles.label}>{r.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity onPress={handleCancel}>
                        <Text style={styles.cancel}>Maybe Later</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default RatingModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    bottomSheet: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 30,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    emojiBox: {
        alignItems: 'center',
        flex: 1,
    },
    emoji: {
        fontSize: 32,
    },
    label: {
        fontSize: 12,
        marginTop: 4,
    },
    cancel: {
        marginTop: 20,
        textAlign: 'center',
        color: '#888',
    },
});
