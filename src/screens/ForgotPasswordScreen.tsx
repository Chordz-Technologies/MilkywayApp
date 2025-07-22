import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { styles } from '../styles/Forgotstyles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { requestOtp } from '../apiServices/allApi';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen = () => {
  const [mobile, setMobile] = useState('');
  const navigation = useNavigation<NavigationProp>();

  const handleContinue = async () => {
    const cleaned = mobile.replace(/\D/g, '');

    if (cleaned.length !== 10) {
      Alert.alert('Invalid', 'Enter a valid 10-digit mobile number');
      return;
    }

    try {
      const fullPhoneNumber = `+91${cleaned}`;
      console.log('no:', fullPhoneNumber);

      const res = await requestOtp(fullPhoneNumber);
      if (res?.data?.message === 'OTP sent successfully') {
        Alert.alert('OTP Sent', 'An OTP has been sent to your number.');
        navigation.navigate('VerifyOtp', { mobile: fullPhoneNumber });
      }
    } catch (error: any) {
      console.log('OTP API Error:', error.response?.data || error.message);
      Alert.alert(
        'Server Error',
        'There was an issue on the server. Please try again later.'
      );
    }
  };

  return (
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

      <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
        <Text style={styles.btnText}>Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backToLogin}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;
