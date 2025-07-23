// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { styles } from '../styles/LoginStyle';
// import { useNavigation } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../navigation/types';
// import { loginVendor } from '../apiServices/allApi';

// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

// const LoginScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const [isLoading, setIsLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [contact, setcontact] = useState('');
//   const [password, setPassword] = useState('');

//   const handleLogin = async () => {
//     const trimmedContact = contact.trim();
//     const trimmedPassword = password.trim();

//     if (!trimmedContact || !trimmedPassword) {
//       Alert.alert('Error', 'Please enter contact number and password');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       const payload = {
//         contact: `+91${String(contact).trim()}`,
//         password: String(password).trim()
//       };

//       const response = await loginVendor(payload);

//       if (response?.data?.message === 'Login successful') {
//         const role = response?.data?.role?.toLowerCase();

//         switch (role) {
//           case 'vendor':
//             navigation.navigate('VendorHome');
//             break;
//           case 'consumer':
//             navigation.navigate('ConsumerHome');
//             break;
//           case 'distributor':
//             navigation.navigate('DistributorHome');
//             break;
//           default:
//             Alert.alert('Error', 'Unknown user role.');
//         }
//       }
//     } catch (error: any) {
//       console.error('Login API Error:', error?.response?.data);

//       const errorMessage =
//         error.response?.data?.message ||
//         error.response?.data?.detail ||
//         Object.values(error.response?.data || {}).flat()[0] || // Get first field error message
//         'Login failed. Please try again';

//       Alert.alert('Login Error', errorMessage);
//     }
//     finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <Image
//         source={require('../assets/logo1.png')}
//         style={styles.logo}
//         resizeMode="contain"
//       />

//       <Text style={styles.welcomeText}>Milkyway</Text>

//       {/* contact Input */}
//       <View style={styles.inputWrapper}>
//         <Icon name="phone" size={20} color="#555" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Mobile Number"
//           placeholderTextColor="#888"
//           keyboardType="phone-pad"
//           autoCapitalize="none"
//           value={contact}
//           onChangeText={setcontact}
//         />
//       </View>

//       {/* Password Input */}
//       <View style={styles.inputWrapper}>
//         <Icon name="lock" size={20} color="#555" style={styles.icon} />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           placeholderTextColor="#888"
//           secureTextEntry={!showPassword}
//           value={password}
//           onChangeText={setPassword}
//         />
//         <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//           <Icon
//             name={showPassword ? 'eye-slash' : 'eye'}
//             size={18}
//             color="#555"
//             style={styles.icon}
//           />
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity
//         style={styles.forgotWrapper}
//         onPress={() => navigation.navigate('ForgotPassword')}
//       >
//         <Text style={styles.forgotText}>Forgot Password?</Text>
//       </TouchableOpacity>

//       <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
//         <Text style={styles.loginText}>
//           {isLoading ? 'Logging in...' : 'Login'}
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={styles.forgotWrapper}
//         onPress={() => navigation.navigate('ConsumerHome')}
//       >
//         <Text style={styles.forgotText}>Go to Consumer screen</Text>
//       </TouchableOpacity>

//       <Text style={styles.registerText}>Register as:</Text>
//       <View style={styles.registerContainer}>
//         <TouchableOpacity onPress={() => navigation.navigate('VendorRegistration')}>
//           <Text style={styles.link}>Vendor</Text>
//         </TouchableOpacity>
//         <Text style={styles.registerText}>/</Text>
//         <TouchableOpacity onPress={() => navigation.navigate('ConsumerRegistration')}>
//           <Text style={styles.link}>Consumer</Text>
//         </TouchableOpacity>
//         <Text style={styles.registerText}>/</Text>
//         <TouchableOpacity onPress={() => navigation.navigate('DistributorRegistration')}>
//           <Text style={styles.link}>Distributor</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default LoginScreen;





import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { styles } from '../styles/LoginStyle';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { loginVendor } from '../apiServices/allApi';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <-- NEW

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [contact, setcontact] = useState('');
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
        contact: `+91${String(contact).trim()}`,
        password: String(password).trim()
      };

      const response = await loginVendor(payload);

      if (response?.data?.message === 'Login successful') {
        const role = response?.data?.role?.toLowerCase();
        const userID = response?.data?.userID || response?.data?.id; // use your API's correct field

        // ✅ Store userID in AsyncStorage
        if (userID) {
          await AsyncStorage.setItem('userID', userID.toString());
          console.log('UserID saved to AsyncStorage:', userID);
        }

        // ✅ Navigate based on role
        switch (role) {
          case 'vendor':
            navigation.navigate('VendorHome');
            break;
          case 'consumer':
            navigation.navigate('ConsumerHome');
            break;
          case 'distributor':
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

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
        <Text style={styles.loginText}>
          {isLoading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotWrapper}
        onPress={() => navigation.navigate('ConsumerHome')}
      >
        <Text style={styles.forgotText}>Go to Consumer screen</Text>
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
