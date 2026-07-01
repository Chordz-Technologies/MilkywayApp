import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { styles } from '../styles/Forgotstyles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import SafeAreaWrapper from '../styles/SafeAreaWrapper';
import { requestPasswordReset } from '../apiServices/allApi'; // <-- your service
import { useTranslation } from '../i18n/LanguageProvider';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = () => {
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NavigationProp>();
    const { t } = useTranslation();

    const sendOTP = async () => {
        if (mobile.length !== 10) {
            Alert.alert(t('forgotPassword.invalidNumber'), t('forgotPassword.enterValidMobile'));
            return;
        }

        setLoading(true);

        try {
            const payload = { phone_number: `+91${mobile}` }; // only phone number

            const response = await requestPasswordReset(payload);

            if (response.status === 200) {
                Alert.alert(t('common.success'), response.data.message || t('forgotPassword.otpSent'));
                navigation.navigate('VerifyOtp', { mobile }); // navigate without OTP
            } else {
                Alert.alert(t('common.error'), response.data.Error.error || t('forgotPassword.failedOtp'));
            }
        } catch (error: any) {
            Alert.alert(t('common.error'), error?.response?.data?.error || t('forgotPassword.somethingWrong'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaWrapper>
            <View style={styles.container}>
                <Image source={require('../assets/logopass1.png')} style={styles.logo} />
                <Text style={styles.title}>{t('forgotPassword.title')}</Text>
                <Text style={styles.label}>{t('forgotPassword.label')}</Text>

                <View style={styles.inputWrapper}>
                    <Text style={styles.countryCode}>+91</Text>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        keyboardType="number-pad"
                        maxLength={10}
                        placeholder={t('common.mobileNumber')}
                        placeholderTextColor="#888"
                        value={mobile}
                        onChangeText={(text) => setMobile(text.replace(/\D/g, ''))}
                    />
                </View>

                <TouchableOpacity
                    style={styles.sendOTPButton}
                    onPress={sendOTP}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.sendOTPText}>{t('forgotPassword.sendOtp')}</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.backToLogin}>{t('forgotPassword.backToLogin')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaWrapper>
    );
};

export default ForgotPasswordScreen;
