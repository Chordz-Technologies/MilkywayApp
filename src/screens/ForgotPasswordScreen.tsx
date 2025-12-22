import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import auth from '@react-native-firebase/auth';
import { styles } from '../styles/Forgotstyles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import SafeAreaWrapper from '../styles/SafeAreaWrapper';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = () => {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  const handleContinue = async () => {
    const cleaned = mobile.replace(/\D/g, '');

    if (cleaned.length !== 10) {
      Alert.alert('Invalid', 'Enter a valid 10-digit mobile number');
      return;
    }

    const phoneNumber = `+91${cleaned}`;

    try {
      setLoading(true);

      // Firebase OTP
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);

      Alert.alert('OTP Sent', 'OTP sent successfully');

      navigation.navigate('VerifyOtp', {
        phoneNumber,
        confirmation, // pass confirmation object
      });
    } catch (error: any) {
      console.log('Firebase OTP Error:', error);
      Alert.alert('Error', error.message || 'Failed to send OTP');
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
            value={mobile}
            onChangeText={(text) => setMobile(text.replace(/\D/g, ''))}
          />
        </View>

        <TouchableOpacity style={styles.continueBtn} onPress={handleContinue} disabled={loading}>
          <Text style={styles.btnText}>{loading ? 'Sending...' : 'Reset Password'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.backToLogin}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
};

export default ForgotPasswordScreen;
