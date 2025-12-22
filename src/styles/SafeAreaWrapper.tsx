import React, { ReactNode } from 'react';
import {
    SafeAreaView,
    StatusBar,
    Platform,
    StyleSheet,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SafeAreaWrapperProps {
    children: ReactNode;
    backgroundColor?: string;
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
    children,
    backgroundColor = '#FFFFFF',
}) => {
    const insets = useSafeAreaInsets();

    const androidVersion =
        Platform.OS === 'android' ? Number(Platform.Version) : null;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <StatusBar
                barStyle={
                    androidVersion !== null && androidVersion >= 34
                        ? 'dark-content'
                        : 'light-content'
                }
                backgroundColor={backgroundColor}
            />

            <View
                style={[
                    styles.content,
                    {
                        paddingTop:
                            Platform.OS === 'android'
                                ? Math.max(insets.top, 10) // auto adjusts
                                : insets.top,
                    },
                ]}
            >
                {children}
            </View>
        </SafeAreaView>
    );
};

export default SafeAreaWrapper;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
});
