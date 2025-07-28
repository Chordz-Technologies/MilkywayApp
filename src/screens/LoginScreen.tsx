
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../styles/LoginStyle';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { loginVendor } from '../apiServices/allApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');

  const handleContactChange = (text: string) => {

    const cleanedText = text.replace(/[^0-9]/g, '');

    if (cleanedText.length <= 10) {
      setContact(cleanedText);
    }
  };

  const handleLogin = async () => {
    const trimmedContact = contact.trim();
    const trimmedPassword = password.trim();

    if (!trimmedContact || !trimmedPassword) {
      Alert.alert('Error', 'Please enter contact number and password');
      return;
    }

    if (trimmedContact.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        contact: trimmedContact,
        password: trimmedPassword,
      };

      const response = await loginVendor(payload);

      if (response?.data?.message === 'Login successful') {
        const role = response?.data?.role?.toLowerCase();
        const userID = response?.data?.userID || response?.data?.id;

        if (userID) {
          await AsyncStorage.setItem('userID', userID.toString());
          console.log('UserID saved to AsyncStorage:', userID);
        }

        switch (role) {
          case 'vendor':
            navigation.navigate('VendorHome');
            break;
          case 'customer':
            navigation.navigate('ConsumerHome');
            break;
          case 'milkman':
            navigation.navigate('DistributorHome');
            break;
          default:
            Alert.alert('Error', 'Unknown user role.');
        }
      }
    } catch (error: any) {
      console.error('Login API Error:', error?.response?.data);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        Object.values(error.response?.data || {}).flat()[0] ||
        'Login failed. Please try again';
      Alert.alert('Login Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Image
        source={require('../assets/logo1.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.welcomeText}>Milkyway</Text>

      {/* Contact Input */}
      <View style={styles.inputWrapper}>
        <Icon name="phone" size={20} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          autoCapitalize="none"
          value={contact}
          onChangeText={handleContactChange}
          maxLength={10}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputWrapper}>
        <Icon name="lock" size={20} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon
            name={showPassword ? 'eye-slash' : 'eye'}
            size={18}
            color="#555"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.forgotWrapper}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
        <Text style={styles.loginText}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>Register as:</Text>
      <View style={styles.registerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('VendorRegistration')}>
          <Text style={styles.link}>Vendor</Text>
        </TouchableOpacity>
        <Text style={styles.registerText}>/</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ConsumerRegistration')}>
          <Text style={styles.link}>Consumer</Text>
        </TouchableOpacity>
        <Text style={styles.registerText}>/</Text>
        <TouchableOpacity onPress={() => navigation.navigate('DistributorRegistration')}>
          <Text style={styles.link}>Distributor</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
