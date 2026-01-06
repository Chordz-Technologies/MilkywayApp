import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { styles } from '../styles/ResetPasswordStyles';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { resetPassword } from '../apiServices/allApi';
import SafeAreaWrapper from '../styles/SafeAreaWrapper';

type ResetPasswordRouteProp = RouteProp<RootStackParamList, 'ResetPassword'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResetPasswordRouteProp>();
  const { mobile, otp } = route.params; // ✅ get OTP also
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async () => {
    if (!newPassword || !confirmNewPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        phone_number: `+91${mobile}`,
        otp: otp,
        new_password: newPassword,
      };

      const response = await resetPassword(payload);

      if (response?.status === 200) {
        Alert.alert('Success', 'Password reset successfully', [
          {
            text: 'OK',
            onPress: () =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              }),
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to reset password');
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.error || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <Image source={require('../assets/newpass.png')} style={styles.logo} />

        <Text style={styles.title}>Set New Password</Text>
        <Text style={styles.subLabel}>Enter your new password below</Text>

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="New Password"
            secureTextEntry={!showNewPassword}
            style={styles.passwordInput}
            placeholderTextColor="#888"
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <TouchableOpacity
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Icon
              name={showNewPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirm New Password"
            secureTextEntry={!showConfirmPassword}
            style={styles.passwordInput}
            placeholderTextColor="#888"
            value={confirmNewPassword}
            onChangeText={setConfirmNewPassword}
          />

          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Icon
              name={showConfirmPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleReset}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaWrapper>
  );
};

export default ResetPasswordScreen;
