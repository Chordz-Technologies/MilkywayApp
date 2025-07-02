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
import { loginVendor } from '../apiServices/authApi';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [showPassword, setShowPassword] = useState(false);
  const [contact, setcontact] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!contact || !password) {
      Alert.alert('Error', 'Please enter contact number and password');
      return;
    }

    try {
      const response = await loginVendor({
        contact: contact.trim(),
        password: password.trim(),
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Login successful!');
        navigation.navigate('DummyHome');
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Login failed. Please try again';

      if (
        errorMessage.toLowerCase().includes('user not found') ||
        errorMessage.toLowerCase().includes('not registered')
      ) {
        Alert.alert('Not Registered', 'User not found. Do you want to register?', [
          {
            text: 'Register',
            onPress: () => navigation.navigate('VendorRegister'),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]);
      } else {
        Alert.alert('Login Error', errorMessage);
      }
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

      {/* contact Input */}
      <View style={styles.inputWrapper}>
        <Icon name="phone" size={20} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mobile Number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          autoCapitalize="none"
          value={contact}
          onChangeText={setcontact}
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

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.registerText}>Register as:</Text>
      <View style={styles.registerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('VendorRegister')}>
          <Text style={styles.link}>Vendor</Text>
        </TouchableOpacity>
        <Text style={styles.registerText}>/</Text>
        <TouchableOpacity onPress={() => navigation.navigate('VendorRegister')}>
          <Text style={styles.link}>Consumer</Text>
        </TouchableOpacity>
        <Text style={styles.registerText}>/</Text>
        <TouchableOpacity onPress={() => navigation.navigate('VendorRegister')}>
          <Text style={styles.link}>Distributor</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
