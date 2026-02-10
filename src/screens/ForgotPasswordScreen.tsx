import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { styles } from '../styles/Forgotstyles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import SafeAreaWrapper from '../styles/SafeAreaWrapper';
import { requestPasswordReset } from '../apiServices/allApi'; // <-- your service

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = () => {
    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NavigationProp>();

    const sendOTP = async () => {
        if (mobile.length !== 10) {
            Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
            return;
        }

        setLoading(true);

        try {
            const payload = { phone_number: `+91${mobile}` }; // only phone number

            const response = await requestPasswordReset(payload);

            if (response.status === 200) {
                Alert.alert('Success', response.data.message || 'OTP sent successfully');
                navigation.navigate('VerifyOtp', { mobile }); // navigate without OTP
            } else {
                Alert.alert('Error', response.data.Error.error || 'Failed to send OTP');
            }
        } catch (error: any) {
            console.log('Error:', error);
            Alert.alert('Error', error?.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaWrapper>
            <View style={styles.container}>
                <Image source={require('../assets/logopass1.png')} style={styles.logo} />
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.label}>Enter your mobile number to reset password</Text>

                <View style={styles.inputWrapper}>
                    <Text style={styles.countryCode}>+91</Text>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        keyboardType="number-pad"
                        maxLength={10}
                        placeholder="Mobile Number"
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
                        <Text style={styles.sendOTPText}>Send OTP</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.backToLogin}>Back to Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaWrapper>
    );
};

export default ForgotPasswordScreen;