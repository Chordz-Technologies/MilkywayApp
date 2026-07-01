import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, } from 'react-native';
import { styles } from '../styles/VerifyOtpStyle';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import SafeAreaWrapper from '../styles/SafeAreaWrapper';
import { useTranslation } from '../i18n/LanguageProvider';

type VerifyOtpRouteProp = RouteProp<RootStackParamList, 'VerifyOtp'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerifyOtp'>;

const VerifyOtpScreen = () => {
    const route = useRoute<VerifyOtpRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { t } = useTranslation();

    const { mobile } = route.params;

    const [otpBoxes, setOtpBoxes] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    const inputs = useRef<TextInput[]>([]);

    // ⏱ Timer
    useEffect(() => {
        if (timer === 0) {
            setCanResend(true);
            return;
        }

        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (text: string, index: number) => {
        if (text.length > 1) return;

        const updated = [...otpBoxes];
        updated[index] = text;
        setOtpBoxes(updated);

        if (text && index < 5) {
            inputs.current[index + 1]?.focus();
        }
    };

    // NO VERIFICATION — JUST NAVIGATE
    const handleContinue = () => {
        const otp = otpBoxes.join('');

        if (otp.length !== 6) {
            Alert.alert(t('common.error'), t('verifyOtp.enterOtp'));
            return;
        }

        navigation.navigate('ResetPassword', {
            mobile: mobile,
            otp: otp,
        });
    };

    return (
        <SafeAreaWrapper>
            <View style={styles.container}>
                <Image source={require('../assets/otplogo.png')} style={styles.logo} />

                <Text style={styles.title}>{t('verifyOtp.title')}</Text>
                <Text style={styles.label}>{t('verifyOtp.sentTo', { mobile })}</Text>

                <View style={styles.otpContainer}>
                    {otpBoxes.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {
                                if (ref) {
                                    inputs.current[index] = ref;
                                }
                            }}
                            style={styles.otpBox}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={digit}
                            onChangeText={(text) => handleChange(text, index)}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.continueBtn}
                    onPress={handleContinue}
                >
                    <Text style={styles.btnText}>{t('verifyOtp.continue')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaWrapper>
    );
};

export default VerifyOtpScreen;
