
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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/LoginStyle';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { loginVendor } from '../apiServices/allApi';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const trimmedContact = contact.trim();
    const trimmedPassword = password.trim();

    if (!trimmedContact || !trimmedPassword) {
      Alert.alert('Error', 'Please enter contact number and password');
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        contact: `+91${trimmedContact}`,
        password: trimmedPassword,
      };

      console.log('Login payload:', payload);
      const response = await loginVendor(payload);
      // 🟢 Always log the actual data structure
      console.log('🔍 Login response:', JSON.stringify(response.data, null, 2));

      if (response.data?.message === 'Login successful') {
        const role = response.data?.role?.toLowerCase();
        const userData = response.data;

        const userID = String(trimmedContact);
        const fullPhoneNumber = `+91${trimmedContact}`;

        // 🟢 Save only what you need for the session
        await AsyncStorage.multiSet([
          ['userToken', String(userData.token || 'default_token')], // Adjust based on your API
          ['userRole', String(role)],
          ['userContact', userID],
          ['userFullContact', fullPhoneNumber],
          ['userID', userID], // May not actually be used, but consistent with your structure
          ['loginTimestamp', String(Date.now())],
          ['vendorId', String(userData.vendor_id)], // 🟠 Must be in your login API response!
        ]);

        // 🔴 Do not save profile data here. Fetch it in VendorHomeScreen using the token and vendorId.

        // 🟢 Navigate to the correct home screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'VendorHome' }], // Adjust for other roles if needed
        });

      } else {
        const message = response.data?.message || 'Login failed';
        Alert.alert('Login Failed', message);
      }
    } catch (error: any) {
      console.error('Login API Error:', error);
      let errorMessage = 'Login failed. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
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

      <View style={styles.inputWrapper}>
        <Icon name="phone" size={20} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          autoCapitalize="none"
          value={contact}
          onChangeText={setContact}
          maxLength={10}
          editable={!isLoading}
        />
        {contact.length > 0 && (
          <TouchableOpacity onPress={() => setContact('')}>
            <Icon name="times-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputWrapper}>
        <Icon name="lock" size={20} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
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
        disabled={isLoading}
      >
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.loginButton,
          isLoading && { opacity: 0.7, backgroundColor: '#ccc' },
        ]}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.loginText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.registerText}>Register as:</Text>
      <View style={styles.registerContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('VendorRegistration')}
          disabled={isLoading}
        >
          <Text style={[styles.link, isLoading && { opacity: 0.5 }]}>Vendor</Text>
        </TouchableOpacity>
        <Text style={styles.registerText}>/</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('ConsumerRegistration')}
          disabled={isLoading}
        >
          <Text style={[styles.link, isLoading && { opacity: 0.5 }]}>Consumer</Text>
        </TouchableOpacity>
        <Text style={styles.registerText}>/</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('DistributorRegistration')}
          disabled={isLoading}
        >
          <Text style={[styles.link, isLoading && { opacity: 0.5 }]}>Distributor</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
