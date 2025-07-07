import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { styles } from '../styles/ResetPasswordStyles';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { changePassword } from '../apiServices/allApi'; // ✅ import API

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResetPassword'>;

const ResetPasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute();
  const { mobile } = route.params as { mobile: string }; // ✅ Get passed mobile

  const handleReset = async () => {
    if (!newPassword || !confirmNewPassword) {
      Alert.alert('Error', 'Please fill in all fields');
    } else if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'Passwords do not match');
    } else {
      try {
        const res = await changePassword({ mobile, password: newPassword });

        if (res.status === 200) {
          Alert.alert('Success', 'Password reset successful');
          navigation.navigate('Login');
        } else {
          Alert.alert('Error', 'Unexpected response');
        }
      } catch (error: any) {
        console.error('Password reset error:', error.response?.data);
        Alert.alert('Error', error.response?.data?.message || 'Reset failed');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/newpass.png')} style={styles.logo} />
      <Text style={styles.title}>Set New Password</Text>

      <Text style={styles.subLabel}>Enter your new password below</Text>

      <TextInput
        placeholder="New Password"
        secureTextEntry
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
      />

      <TextInput
        placeholder="Confirm New Password"
        secureTextEntry
        style={styles.input}
        value={confirmNewPassword}
        onChangeText={setConfirmNewPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.backToLogin}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;