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
import axios from 'axios';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedRole, setSelectedRole] = useState<'milkman' | 'vendor'>('milkman');

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter username and password');
      return;
    }

    try {
      const apiUrl =
        selectedRole === 'vendor'
          ? 'https://milkywayapi.beatsacademy.in/api/login/vendor-login/'
          : 'https://milkywayapi.beatsacademy.in/api/login/milkman-login/';

      const response = await axios.post(apiUrl, {
        username: username.trim(),
        password: password.trim(),
      });


      if (response.status === 200) {
        Alert.alert('Success', 'Login successful!');
        // You can store token here if needed
        navigation.navigate('DummyHome');
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        'Login failed. Please try again';

      // If user not registered
      if (
        errorMessage.toLowerCase().includes('user not found') ||
        errorMessage.toLowerCase().includes('not registered')
      ) {
        Alert.alert(
          'Not Registered',
          'User not found. Do you want to register?',
          [
            {
              text: 'Register',
              onPress: () => navigation.navigate('Register'),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
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

      <View style={styles.inputWrapper}>
        <Icon name="user" size={20} color="#555" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          keyboardType="default"
          autoCapitalize="none"
          value={username}
          onChangeText={setUsername}
        />
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
        <TouchableOpacity //onPress={() => navigation.navigate('Register')} 
        >
          <Text style={styles.link}>Vendor</Text>
        </TouchableOpacity>
        <Text style={styles.registerText}>/</Text>
        <TouchableOpacity //onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.link}>Consumer</Text>
        </TouchableOpacity>
        <Text style={styles.registerText}>/</Text>
        <TouchableOpacity //onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.link}>Distributor</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;