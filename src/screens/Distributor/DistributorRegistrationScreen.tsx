
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/RegisterStyles';
import { useDispatch, useSelector } from 'react-redux';
import { registerDistributor, clearError } from '../../store/authSlice';
import { RootState, AppDispatch } from '../../store';

interface DistributorPayload {
  full_name: string;
  phone_number?: string;
  flat_house: string;
  society_area: string;
  village: string;
  tal: string;
  dist: string;
  state: string;
  password: string;
  confirm_password: string;
}

interface FormState {
  name: string;
  phone: string;
  flat: string;
  society: string;
  village: string;
  tal: string;
  dist: string;
  state: string;
  password: string;
  confirmPassword: string;
}

export default function DistributorRegistrationScreen({ navigation }: { navigation: any }) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const scrollRef = useRef<ScrollView>(null);
  const [form, setForm] = useState<FormState>({
    name: '',
    phone: '',
    flat: '',
    society: '',
    village: '',
    tal: '',
    dist: '',
    state: '',
    password: '',
    confirmPassword: '',
  });

  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (error) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [error]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleInputChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (localError) {setLocalError('');}
    if (error) {dispatch(clearError());}
  };

  const validate = () => {
    setLocalError('');
    if (!form.name.trim()) {return 'Full name is required';}

    const phone = form.phone.trim();
    if (!phone) {return 'Phone number is required';}
    if (!/^[6-9]\d{9}$/.test(phone)) {return 'Phone number must be valid 10 digits starting with 6-9';}

    if (!form.flat.trim()) {return 'Flat/House is required';}
    if (!form.society.trim()) {return 'Society/Area is required';}
    if (!form.village.trim()) {return 'Village is required';}
    if (!form.tal.trim()) {return 'Tal is required';}
    if (!form.dist.trim()) {return 'District is required';}
    if (!form.state.trim()) {return 'State is required';}

    if (!form.password) {return 'Password is required';}
    if (form.password.length < 6) {return 'Password must be at least 6 characters';}
    if (form.password !== form.confirmPassword) {return 'Passwords do not match';}

    return '';
  };

  const showSuccessAlert = (message: string) => {
    Alert.alert(
      'Registration Successful',
      `${message}\nYou will be redirected to Login.`,
      [
        {
          text: 'OK',
          onPress: () => navigation.replace('Login'),
        },
      ],
    );
  };

  const handleSubmit = async () => {
    if (isLoading) {return;}

    const validationError = validate();
    if (validationError) {
      setLocalError(validationError);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    const payload: DistributorPayload = {
      full_name: form.name,
      phone_number: form.phone.trim() ? `+91${form.phone.trim()}` : undefined,
      flat_house: form.flat.trim(),
      society_area: form.society.trim(),
      village: form.village.trim(),
      tal: form.tal.trim(),
      dist: form.dist.trim(),
      state: form.state.trim(),
      password: form.password,
      confirm_password: form.confirmPassword,
    };

    try {
      const result = await dispatch(registerDistributor(payload));
      if (registerDistributor.fulfilled.match(result)) {
        showSuccessAlert('Distributor registration successful!');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
    }
  };

  const displayError = error || localError;

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.titleRow}>
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="arrow-left" size={32} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Distributor Registration</Text>
      </View>

      {displayError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{displayError}</Text>
        </View>
      ) : null}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name<Text style={styles.required}> *</Text></Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={text => handleInputChange('name', text)}
          placeholder="Enter full name"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number<Text style={styles.required}> *</Text></Text>
        <View style={styles.phoneInputContainer}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={styles.phoneInput}
            value={form.phone}
            onChangeText={text => {
              const cleaned = text.replace(/\D/g, '').slice(0, 10);
              handleInputChange('phone', cleaned);
            }}
            placeholder="Enter phone number"
            keyboardType="number-pad"
            maxLength={10}
            placeholderTextColor="#888"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Flat / House<Text style={styles.required}> *</Text></Text>
        <TextInput
          style={styles.input}
          value={form.flat}
          onChangeText={text => handleInputChange('flat', text)}
          placeholder="Enter flat or house"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Society / Area<Text style={styles.required}> *</Text></Text>
        <TextInput
          style={styles.input}
          value={form.society}
          onChangeText={text => handleInputChange('society', text)}
          placeholder="Enter society or area"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Village<Text style={styles.required}> *</Text></Text>
        <TextInput
          style={styles.input}
          value={form.village}
          onChangeText={text => handleInputChange('village', text)}
          placeholder="Enter village"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Taluka<Text style={styles.required}> *</Text></Text>
        <TextInput
          style={styles.input}
          value={form.tal}
          onChangeText={text => handleInputChange('tal', text)}
          placeholder="Enter Taluka"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>District<Text style={styles.required}> *</Text></Text>
        <TextInput
          style={styles.input}
          value={form.dist}
          onChangeText={text => handleInputChange('dist', text)}
          placeholder="Enter District"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>State<Text style={styles.required}> *</Text></Text>
        <TextInput
          style={styles.input}
          value={form.state}
          onChangeText={text => handleInputChange('state', text)}
          placeholder="Enter State"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Password<Text style={styles.required}> *</Text></Text>
        <View style={styles.inputBoxRelative}>
          <TextInput
            style={[styles.input, styles.inputWithIcon]}
            value={form.password}
            onChangeText={text => handleInputChange('password', text)}
            placeholder="Enter password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={styles.iconInside}
            onPress={() => setShowPassword(v => !v)}
          >
            <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Confirm Password<Text style={styles.required}> *</Text></Text>
        <View style={styles.inputBoxRelative}>
          <TextInput
            style={[styles.input, styles.inputWithIcon]}
            value={form.confirmPassword}
            onChangeText={text => handleInputChange('confirmPassword', text)}
            placeholder="Confirm password"
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={styles.iconInside}
            onPress={() => setShowConfirmPassword(v => !v)}
          >
            <Icon name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#444" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.terms}>
        By registering, you agree to our{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://example.com/terms/distributor')}
        >
          Distributor Terms
        </Text>.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
        <Text style={styles.buttonText}>
          {isLoading ? 'Registering...' : 'Register'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
