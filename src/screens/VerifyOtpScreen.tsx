import React, { useRef, useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Alert, Image,
} from 'react-native';
import { styles } from '../styles/VerifyOtpStyle';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerifyOtp'>;

const VerifyOtpScreen = () => {
    const [otp, setOtp] = useState(Array(4).fill(''));
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const inputs = useRef<TextInput[]>([]);
    const navigation = useNavigation<NavigationProp>();
    const route = useRoute();
    const { mobile } = route.params as { mobile: string };
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);


    const handleChange = (text: string, index: number) => {
        if (text.length > 1) return;
        const updated = [...otp];
        updated[index] = text;
        setOtp(updated);
        if (text && index < 3) inputs.current[index + 1]?.focus();
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handleOtpSubmit = () => {
        const finalOtp = otp.join('');
        if (finalOtp.length !== 4) {
            Alert.alert('Error', 'Please enter 4-digit OTP');
        } else {
            navigation.navigate('ResetPassword');
        }
    };

    const handleResendOtp = () => {
        setOtp(Array(4).fill(''));
        setTimer(30);
        setCanResend(false);
        Alert.alert('OTP Resent', `OTP resent to ${mobile}`);

    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        } else {
            setCanResend(true);
        }
        return () => clearInterval(interval);
    }, [timer]);


    return (
        <View style={styles.container}>
            <Image source={require('../assets/otplogo.png')} style={styles.logo} />
            <Text style={styles.title}>Verify Your Mobile</Text>

            <Text style={styles.label}>We sent an OTP to +91-{mobile}</Text>


            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        style={[
                            styles.otpBox,
                            focusedIndex === index && styles.otpBoxFocused
                        ]}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={digit}
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setFocusedIndex(null)}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        ref={(ref) => {
                            if (ref) inputs.current[index] = ref;
                        }}
                    />

                ))}
            </View>

            <TouchableOpacity style={styles.continueBtn} onPress={handleOtpSubmit}>
                <Text style={styles.btnText}>Continue</Text>
            </TouchableOpacity>

            <Text style={styles.timerText}>
                {canResend ? (
                    <>Didn't receive the code?{' '}
                        <Text style={styles.resend} onPress={handleResendOtp}>Resend OTP</Text></>
                ) : (
                    <>Resend OTP in {timer}s</>

                )}
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.backToLogin}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
};

export default VerifyOtpScreen;