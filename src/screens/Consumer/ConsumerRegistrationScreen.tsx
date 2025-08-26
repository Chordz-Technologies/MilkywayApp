
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Linking,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/RegisterStyles';
import { useDispatch, useSelector } from 'react-redux';
import { registerCustomer, clearError } from '../../store/authSlice';
import { RootState, AppDispatch } from '../../store';

interface UserPayload {
  first_name: string;
  last_name: string;
  email?: string;
  flat_no: string;
  society_name: string;
  village: string;
  tal: string;
  dist: string;
  state: string;
  contact?: string;
  password: string;
  confirm_password?: string;
  cow_milk_litre?: number;
  buffalo_milk_litre?: number;
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  flat: string;
  society: string;
  village: string;
  tal: string;
  dist: string;
  state: string;
}

export default function ConsumerRegistrationScreen({ navigation }: { navigation: any }) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [cowCapacity, setCowCapacity] = useState<string>('');
  const [buffaloCapacity, setBuffaloCapacity] = useState<string>('');
  const [hasCow, setHasCow] = useState(false);
  const [hasBuffalo, setHasBuffalo] = useState(false);

  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    flat: '',
    society: '',
    village: '',
    tal: '',
    dist: '',
    state: '',
  });

  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

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
    if (!form.firstName.trim()) {return 'First Name is required';}
    if (!form.lastName.trim()) {return 'Last Name is required';}
    if (!form.password) {return 'Password is required';}
    if (form.password.length < 6) {return 'Password should be at least 6 characters';}
    if (form.password !== form.confirmPassword) {return 'Password and Confirm Password do not match';}
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {return 'Please enter a valid email address';}

    const phone = form.phone.trim();
    if (!phone) {return 'Phone number is required';}
    if (!/^[6-9]\d{9}$/.test(phone)) {return 'Phone number must be valid 10 digits starting with 6-9';}

    // Validate address parts separately
    if (!form.flat.trim()) {return 'Flat/House is required';}
    if (!form.society.trim()) {return 'Society/Area is required';}
    if (!form.village.trim()) {return 'Village is required';}
    if (!form.tal.trim()) {return 'Tal is required';}
    if (!form.dist.trim()) {return 'District is required';}
    if (!form.state.trim()) {return 'State is required';}

    if (!hasCow && !hasBuffalo) {return 'Select at least one milk type (Cow or Buffalo)';}

    if (hasCow) {
      const capacity = Number(cowCapacity);
      if (isNaN(capacity) || capacity <= 0) {return 'Please enter a valid capacity for Cow milk';}
    }
    if (hasBuffalo) {
      const capacity = Number(buffaloCapacity);
      if (isNaN(capacity) || capacity <= 0) {return 'Please enter a valid capacity for Buffalo milk';}
    }
    return '';
  };

  const handleSubmit = async () => {
    if (isLoading) {return;}

    const validationError = validate();
    if (validationError) {
      setLocalError(validationError);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    try {
      const userPayload: UserPayload = {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email.trim() || undefined,
        flat_no: form.flat.trim(),
        society_name: form.society.trim(),
        village: form.village.trim(),
        tal: form.tal.trim(),
        dist: form.dist.trim(),
        state: form.state.trim(),
        contact: form.phone.trim() ? `+91${form.phone.trim()}` : undefined,
        password: form.password,
        confirm_password: form.confirmPassword,
      };

      if (hasCow) {
        userPayload.cow_milk_litre = Number(cowCapacity);
      }
      if (hasBuffalo) {
        userPayload.buffalo_milk_litre = Number(buffaloCapacity);
      }

      const result = await dispatch(registerCustomer(userPayload));

      if (registerCustomer.fulfilled.match(result)) {
        Alert.alert('Registration Successful', 'Consumer registration successful!\nYou will be redirected to Login.', [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login'),
          },
        ]);
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
        <Text style={styles.title}>Consumer Registration</Text>
      </View>

      {displayError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{displayError}</Text>
        </View>
      ) : null}

      {/* First Name */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          First Name<Text style={styles.required}> *</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={form.firstName}
          onChangeText={(text) => handleInputChange('firstName', text)}
          placeholder="Enter your first name"
          placeholderTextColor="#888"
        />
      </View>

      {/* Last Name */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Last Name<Text style={styles.required}> *</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={form.lastName}
          onChangeText={(text) => handleInputChange('lastName', text)}
          placeholder="Enter your last name"
          placeholderTextColor="#888"
        />
      </View>

      {/* Email */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(text) => handleInputChange('email', text)}
          placeholder="Enter your email address"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
      </View>

      {/* Phone Number */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Phone Number<Text style={styles.required}> *</Text>
        </Text>
        <View style={styles.phoneInputContainer}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            style={styles.phoneInput}
            value={form.phone}
            onChangeText={(text) => {
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

      {/* Password */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Password<Text style={styles.required}> *</Text>
        </Text>
        <View style={styles.inputBoxRelative}>
          <TextInput
            style={[styles.input, styles.inputWithIcon]}
            value={form.password}
            onChangeText={(text) => handleInputChange('password', text)}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={styles.iconInside}
            onPress={() => setShowPassword((v) => !v)}
            activeOpacity={0.7}
          >
            <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirm Password */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Confirm Password<Text style={styles.required}> *</Text>
        </Text>
        <View style={styles.inputBoxRelative}>
          <TextInput
            style={[styles.input, styles.inputWithIcon]}
            value={form.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
            placeholder="Re-enter your password"
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={styles.iconInside}
            onPress={() => setShowConfirmPassword((v) => !v)}
            activeOpacity={0.7}
          >
            <Icon name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* New Structured Address Fields */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Flat / House<Text style={styles.required}> *</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={form.flat}
          onChangeText={(text) => handleInputChange('flat', text)}
          placeholder="Enter flat or house"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Society / Area<Text style={styles.required}> *</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={form.society}
          onChangeText={(text) => handleInputChange('society', text)}
          placeholder="Enter society or area"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Village<Text style={styles.required}> *</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={form.village}
          onChangeText={(text) => handleInputChange('village', text)}
          placeholder="Enter village"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          Taluka<Text style={styles.required}> *</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={form.tal}
          onChangeText={(text) => handleInputChange('tal', text)}
          placeholder="Enter Taluka"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          District<Text style={styles.required}> *</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={form.dist}
          onChangeText={(text) => handleInputChange('dist', text)}
          placeholder="Enter District"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>
          State<Text style={styles.required}> *</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={form.state}
          onChangeText={(text) => handleInputChange('state', text)}
          placeholder="Enter State"
          placeholderTextColor="#888"
        />
      </View>

      {/* Milk Types */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Milk Types:</Text>
        <View style={styles.milkTypeRow}>
          <TouchableOpacity
            style={[styles.milkTypeButton, hasCow && styles.milkTypeSelected]}
            onPress={() => setHasCow((v) => !v)}
          >
            <Text style={[styles.milkTypeText, hasCow && styles.milkTypeTextSelected]}>Cow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.milkTypeButton, hasBuffalo && styles.milkTypeSelected]}
            onPress={() => setHasBuffalo((v) => !v)}
          >
            <Text style={[styles.milkTypeText, hasBuffalo && styles.milkTypeTextSelected]}>Buffalo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {hasCow && (
        <View style={styles.milkDetailsSection}>
          <Text style={styles.sectionTitle}>Cow Milk for daily requirement</Text>
          <View style={styles.milkTypeInputRow}>
            <TextInput
              style={styles.compactInputBox}
              value={cowCapacity}
              keyboardType="numeric"
              onChangeText={setCowCapacity}
              placeholder="Enter capacity"
            />
            <Text style={styles.cowTypeLabel}>ltrs</Text>
          </View>
        </View>
      )}

      {hasBuffalo && (
        <View style={styles.milkDetailsSection}>
          <Text style={styles.sectionTitle}>Buffalo Milk for daily requirement</Text>
          <View style={styles.milkTypeInputRow}>
            <TextInput
              style={styles.compactInputBox}
              value={buffaloCapacity}
              keyboardType="numeric"
              onChangeText={setBuffaloCapacity}
              placeholder="Enter capacity"
            />
            <Text style={styles.cowTypeLabel}>ltrs</Text>
          </View>
        </View>
      )}

      <Text style={styles.terms}>
        By registering, you agree to our{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://example.com/terms/user')}>
          Consumer Terms
        </Text>
        .
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
