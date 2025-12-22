import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';
import { StackNavigationProp } from '@react-navigation/stack';
import SafeAreaWrapper from '../styles/SafeAreaWrapper';
import colors from '../theme/colors';

type RootStackParamList = {
    Login: undefined;
};

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const TermsConditionScreen: React.FC<Props> = ({ navigation }) => {
    const [accepted, setAccepted] = useState(false);

    const handleLogin = async () => {
        await AsyncStorage.setItem('hasSeenSlides', 'true');
        await AsyncStorage.setItem('termsAccepted', 'true');

        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <SafeAreaWrapper>
            <View style={styles.container}>
                <Text style={styles.header}>Terms & Conditions</Text>

                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.text}>
                        Welcome to our milk delivery service. By using this app, you agree
                        to the following terms and conditions:
                    </Text>

                    <Text style={styles.text}>
                        • Milk availability depends on vendor supply and local conditions.{"\n"}
                        • Delivery timings may vary due to weather, traffic, or operational issues.{"\n"}
                        • Users must ensure availability at the delivery address to receive orders.{"\n"}
                        • Payments should be made on time to avoid service interruption.{"\n"}
                        • Prices may change based on market conditions or vendor updates.{"\n"}
                        • Extra milk requests are subject to vendor approval and availability.{"\n"}
                        • Leave requests must be submitted in advance through the app.{"\n"}
                        • The company is not responsible for delays caused by unforeseen events.{"\n"}
                        • User data is securely stored and will not be shared without consent.
                    </Text>

                    {/* ✅ Checkbox appears immediately after last line */}
                    <View style={styles.checkboxRow}>
                        <CheckBox
                            value={accepted}
                            onValueChange={setAccepted}
                            tintColors={{ true: colors.primary, false: '#aaa' }}
                        />
                        <Text style={styles.checkboxText}>
                            I agree to the Terms & Conditions
                        </Text>
                    </View>


                    {/* ✅ Button does NOT push content */}
                    {accepted && (
                        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                            <Text style={styles.loginText}>Login</Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </View>
        </SafeAreaWrapper>
    );
};

export default TermsConditionScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        backgroundColor: colors.white,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 18,
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        color: '#444',
        lineHeight: 24,
        marginBottom: 12,
    },
    content: {
        flex: 1,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingBottom: 20, // gives breathing space instead of marginBottom 100
    },
    checkboxText: {
        fontSize: 15,
        color: '#333',
    },
    loginBtn: {
        backgroundColor: colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    loginText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
