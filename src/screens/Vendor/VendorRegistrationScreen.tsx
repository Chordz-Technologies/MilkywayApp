import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Linking, ScrollView, Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addVendorRegistration } from '../../apiServices/allApi';
import { styles } from '../../styles/RegisterStyles';
import { scrollContentStyles } from '../../styles/RegisterStyles';
interface CowMilkDetail {
  name: string;
  capacity: string;
}

interface VendorPayload {
  name: string;
  email?: string;
  address: string;
  contact?: string;
  password: string;
  confirm_password?: string;
  gir_milk_litre?: number;
  deshi_milk_litre?: number;
  jarshi_milk_litre?: number;
  buffalo_milk_litre?: number;
}

export default function VendorRegisterScreen({ navigation }: { navigation: any }) {
  const [cowMilk, setCowMilk] = useState<CowMilkDetail[]>([
    { name: 'Gir Cow', capacity: '' },
    { name: 'Deshi', capacity: '' },
    { name: 'Jarshi', capacity: '' },
  ]);
  const [buffaloCapacity, setBuffaloCapacity] = useState<string>('');
  const [hasCow, setHasCow] = useState(false);
  const [hasBuffalo, setHasBuffalo] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleCowMilkChange = (
    idx: number,
    field: 'name' | 'capacity',
    value: string
  ) => {
    setCowMilk(prev =>
      prev.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      )
    );
  };

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    setError('');
    if (!form.name.trim()) { return 'Name is required'; }
    if (!form.password) { return 'Password is required'; }
    if (form.password.length < 6) { return 'Password should be at least 6 characters'; }
    if (form.password !== form.confirmPassword) { return 'Password and Confirm Password do not match'; }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {return 'Please enter a valid email address';}
    if (!form.phone.trim()) { return 'Phone number is required'; }
    if (!/^\d{10}$/.test(form.phone.trim())) {return 'Phone number must be exactly 10 digits';}
    if (form.phone.trim() && !/^\d+$/.test(form.phone.trim())) {return 'Phone number should contain only digits';}
    if (!hasCow && !hasBuffalo) { return 'Select at least one milk type (Cow or Buffalo)'; }
    if (hasCow) {
      const anyValidCow = cowMilk.some(c => {
        const capacity = Number(c.capacity);
        return c.name.trim() && !isNaN(capacity) && capacity > 0;
      });
      if (!anyValidCow) {
        return 'Please enter valid name and capacity for at least one cow type';
      }
    }
    if (hasBuffalo) {
      const capacity = Number(buffaloCapacity);
      if (isNaN(capacity) || capacity <= 0) {
        return 'Please enter a valid capacity for Buffalo milk';
      }
    }
    return '';
  };

  const handleSubmit = async () => {
    if (isLoading) { return; }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    setIsLoading(true);

    try {
      const vendorPayload: VendorPayload = {
        name: form.name,
        email: form.email.trim() || undefined,
        address: form.address,
        contact: form.phone.trim() ? `+91${form.phone.trim()}` : undefined,
        password: form.password,
        confirm_password: form.confirmPassword,
      };

      if (hasCow) {
        vendorPayload.gir_milk_litre = cowMilk[0]?.capacity.trim() ? Number(cowMilk[0].capacity) : undefined;
        vendorPayload.deshi_milk_litre = cowMilk[1]?.capacity.trim() ? Number(cowMilk[1].capacity) : undefined;
        vendorPayload.jarshi_milk_litre = cowMilk[2]?.capacity.trim() ? Number(cowMilk[2].capacity) : undefined;
      }
      if (hasBuffalo) {
        vendorPayload.buffalo_milk_litre = Number(buffaloCapacity);
      }

      await addVendorRegistration(vendorPayload);
      showSuccessAlert('Vendor registration successful!');
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error ||
        err?.message ||
        'Vendor registration failed';
      setError(errorMessage);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } finally {
      setIsLoading(false);
    }
  };

  const showSuccessAlert = (message: string) => {
    Alert.alert(
      'Registration Successful',
      `${message}\nYou will be redirected to Login.`,
      [{
        text: 'OK',
        onPress: () => navigation.replace('Login'),
      }]
    );
  };

  return (
    <ScrollView
          ref={scrollRef}
          style={styles.container}
          contentContainerStyle={scrollContentStyles}
          keyboardShouldPersistTaps="handled"
        >
      <View style={styles.titleRow}>
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 0, right: 10 }}
        >
          <Icon name="arrow-left" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Vendor Registration</Text>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name<Text style={styles.required}> *</Text></Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={text => handleInputChange('name', text)}
          placeholder="Enter your full name"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={text => handleInputChange('email', text)}
          placeholder="Enter your email address"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#888"
        />
      </View>

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
      <View style={styles.formGroup}>
        <Text style={styles.label}>Password<Text style={styles.required}> *</Text></Text>
        <View style={styles.inputBoxRelative}>
          <TextInput
            style={[styles.input, styles.inputWithIcon, styles.inputText]}
            value={form.password}
            onChangeText={text => handleInputChange('password', text)}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={styles.iconInside}
            onPress={() => setShowPassword(v => !v)}
            activeOpacity={0.7}
          >
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#444"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Confirm Password<Text style={styles.required}> *</Text></Text>
        <View style={styles.inputBoxRelative}>
          <TextInput
            style={[styles.input, styles.inputWithIcon, styles.inputText]}
            value={form.confirmPassword}
            onChangeText={text => handleInputChange('confirmPassword', text)}
            placeholder="Re-enter your password"
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={styles.iconInside}
            onPress={() => setShowConfirmPassword(v => !v)}
            activeOpacity={0.7}
          >
            <Icon
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#444"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={form.address}
          onChangeText={text => handleInputChange('address', text)}
          placeholder="Enter your address"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Milk Types You Supply</Text>
        <View style={styles.milkTypeRow}>
          <TouchableOpacity
            style={[
              styles.milkTypeButton,
              hasCow && styles.milkTypeSelected,
            ]}
            onPress={() => setHasCow(!hasCow)}
          >
            <Text
              style={[
                styles.milkTypeText,
                hasCow && styles.milkTypeTextSelected,
              ]}
            >
              Cow
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.milkTypeButton,
              hasBuffalo && styles.milkTypeSelected,
            ]}
            onPress={() => setHasBuffalo(!hasBuffalo)}
          >
            <Text
              style={[
                styles.milkTypeText,
                hasBuffalo && styles.milkTypeTextSelected,
              ]}
            >
              Buffalo
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {hasCow && (
        <View style={styles.milkDetailsSection}>
          <Text style={styles.sectionTitle}>Cow Milk Types & Capacity (ltrs)</Text>
          {cowMilk.map((item, idx) => (
            <View style={styles.milkTypeInputRow} key={idx}>
              <TextInput
                style={[styles.cowTypeCapacityInput, styles.flexGrowInput]}
                value={item.name}
                onChangeText={val => handleCowMilkChange(idx, 'name', val)}
                placeholder="Cow Type Name"
                editable={idx > 2 ? true : false}
              />
              <TextInput
                style={styles.cowTypeCapacityInput}
                value={item.capacity}
                keyboardType="numeric"
                onChangeText={val => handleCowMilkChange(idx, 'capacity', val)}
                placeholder="Capacity"
                editable={true}
              />
              <Text style={styles.cowTypeLabel}>ltrs</Text>
            </View>
          ))}
        </View>
      )}

      {hasBuffalo && (
        <View style={styles.milkDetailsSection}>
          <Text style={styles.sectionTitle}>Buffalo Milk Capacity (ltrs)</Text>
          <View style={styles.milkTypeInputRow}>
            <TextInput
              style={[styles.cowTypeCapacityInput, styles.flexGrowInput]}
              value="Buffalo"
              editable={false}
            />
            <TextInput
              style={styles.cowTypeCapacityInput}
              value={buffaloCapacity}
              keyboardType="numeric"
              onChangeText={setBuffaloCapacity}
              placeholder="Capacity"
            />
            <Text style={styles.cowTypeLabel}>ltrs</Text>
          </View>
        </View>
      )}

      <Text style={styles.terms}>
        By registering, you agree to our{' '}
        <Text
          style={styles.link}
          onPress={() => Linking.openURL('https://example.com/terms/vendor')}
        >
          Vendor Terms
        </Text>
        .
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
        <Text style={styles.buttonText}>
          {isLoading ? 'Registering...' : 'Register'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
