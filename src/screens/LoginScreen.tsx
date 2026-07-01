import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert, Keyboard, TouchableWithoutFeedback, ScrollView, } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../styles/LoginStyle';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, checkStoredAuth, clearError } from '../store/authSlice';
import { RootState, AppDispatch } from '../store';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeAreaWrapper from '../styles/SafeAreaWrapper';
import { useTranslation } from '../i18n/LanguageProvider';
import LanguageSwitcher from '../components/LanguageSwitcher';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();

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
        Alert.alert(t('common.error'), t('login.unknownRole'));
    }
  }, [navigation, t]);

  // Auto-login effect - check for stored tokens
  useEffect(() => {
    dispatch(checkStoredAuth());
  }, [dispatch]);

  // Navigate based on authentication state
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      (async () => {
        try {
          // CLEAR logout flag after successful login
          await AsyncStorage.removeItem('isLoggedOut');
        } catch (err) {
          console.error('Failed to clear isLoggedOut flag', err);
        }
        navigateToHome(user.role);
      })();
    }
  }, [isAuthenticated, user?.role, navigateToHome]);

  // Show error alerts
  useEffect(() => {
    if (error) {
      Alert.alert(t('login.loginError'), error, [
        { onPress: () => dispatch(clearError()) },
      ]);
    }
  }, [error, dispatch, t]);

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
      Alert.alert(t('common.error'), t('login.enterContactAndPassword'));
      return;
    }

    if (trimmedContact.length !== 10) {
      Alert.alert(t('common.error'), t('login.enterValidPhone'));
      return;
    }

    const fcmToken = await messaging().getToken();

    const payload = {
      contact: `+91${trimmedContact}`,
      password: trimmedPassword,
      fcm_token: fcmToken
    };

    dispatch(loginUser(payload));
  }, [contact, password, dispatch, t]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(!showPassword);
  }, [showPassword]);

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}   // ✅ IMPORTANT
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
                paddingHorizontal: 20,
                paddingBottom: 100,
                backgroundColor: '#FFFFFF',
              }}
            >
              <View style={styles.container}>
                <View style={styles.languageRow}>
                  <LanguageSwitcher />
                </View>

                <Image
                  source={require('../assets/logo.jpeg')}
                  style={styles.logo}
                  resizeMode="contain"
                />

                <Text style={styles.welcomeText}>Milkyway</Text>

                {/* Contact Input */}
                <View style={styles.inputWrapper}>
                  <Icon name="phone" size={20} color="#555" style={styles.icon} />
                  <TextInput
                    style={styles.input}
                    placeholder={t('common.mobileNumber')}
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
                    placeholder={t('common.password')}
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
                  <Text style={styles.forgotText}>{t('login.forgotPassword')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                  disabled={isLoading}
                >
                  <Text style={styles.loginText}>
                    {isLoading ? t('login.loggingIn') : t('common.login')}
                  </Text>
                </TouchableOpacity>

                <Text style={styles.registerText}>{t('login.registerAs')}</Text>
                <View style={styles.registerContainer}>
                  <TouchableOpacity onPress={() => navigation.navigate('VendorRegistration')}>
                    <Text style={styles.link}>{t('login.vendor')}</Text>
                  </TouchableOpacity>
                  <Text style={styles.registerText}>/</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('ConsumerRegistration')}>
                    <Text style={styles.link}>{t('login.consumer')}</Text>
                  </TouchableOpacity>
                  <Text style={styles.registerText}>/</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('DistributorRegistration')}>
                    <Text style={styles.link}>{t('login.distributor')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

export default LoginScreen;
