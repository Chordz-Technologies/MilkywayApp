import React, { useState, useEffect, useCallback } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, checkStoredAuth, clearError } from '../store/authSlice';
import { RootState, AppDispatch } from '../store';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const { isLoading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Local state
  const [showPassword, setShowPassword] = useState(false);
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');

  // Wrap navigateToHome with useCallback to fix exhaustive-deps warning
  const navigateToHome = useCallback((role: string) => {
    switch (role.toLowerCase()) {
      case 'vendor':
        navigation.reset({
          index: 0,
          routes: [{ name: 'VendorHome' }],
        });
        break;
      case 'customer':
        navigation.reset({
          index: 0,
          routes: [{ name: 'ConsumerHome' }],
        });
        break;
      case 'milkman':
        navigation.reset({
          index: 0,
          routes: [{ name: 'DistributorHome' }],
        });
        break;
      default:
        Alert.alert('Error', 'Unknown user role.');
    }
  }, [navigation]);

  // Auto-login effect - check for stored tokens
  useEffect(() => {
    dispatch(checkStoredAuth());
  }, [dispatch]);

  // Navigate based on authentication state
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      navigateToHome(user.role);
    }
  }, [isAuthenticated, user, navigateToHome]);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert('Login Error', error, [
        { text: 'OK', onPress: () => dispatch(clearError()) },
      ]);
    }
  }, [error, dispatch]);

  const handleContactChange = useCallback((text: string) => {
    const cleanedText = text.replace(/[^0-9]/g, '');
    if (cleanedText.length <= 10) {
      setContact(cleanedText);
    }
  }, []);

  const handleLogin = useCallback(async () => {
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

    const payload = {
      contact: `+91${trimmedContact}`,
      password: trimmedPassword,
    };

    // Dispatch Redux action
    dispatch(loginUser(payload));
  }, [contact, password, dispatch]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

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
        <TouchableOpacity onPress={togglePasswordVisibility}>
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

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={isLoading}
      >
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
