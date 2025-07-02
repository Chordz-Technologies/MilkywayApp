// src/screens/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { styles } from '../styles/Forgotstyles';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;
const ForgotPasswordScreen = () => {
  const [mobile, setMobile] = useState('');
  const navigation = useNavigation<NavigationProp>();

  const handleContinue = () => {
    const cleaned = mobile.replace(/\D/g, '');
    if (cleaned.length === 10) {
      navigation.navigate('VerifyOtp', { mobile: cleaned });
    } else {
      Alert.alert('Invalid', 'Enter a valid 10-digit mobile number');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logopass1.png')} style={styles.logo} />
      <Text style={styles.title}>Forgot Password?</Text>
      <Text style={styles.label}>Enter your mobile number to reset password</Text>

      <View style={styles.inputWrapper}>
        <Icon name="phone" size={20} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          keyboardType="number-pad"
          maxLength={10}
          value={mobile}
          onChangeText={(text) => setMobile(text.replace(/\D/g, ''))}
          placeholderTextColor="#888"
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
