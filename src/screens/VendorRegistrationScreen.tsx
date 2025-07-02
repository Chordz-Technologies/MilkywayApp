import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { addVendorRegistration } from '../apiServices/vendorApi';

type CowMilkDetail = { name: string; capacity: string };

export default function VendorRegistrationScreen({ navigation }: { navigation: any }) {
  const [cowMilk, setCowMilk] = useState<CowMilkDetail[]>([
    { name: 'Gir Cow', capacity: '' },
    { name: 'Deshi', capacity: '' },
    { name: 'Jarshi', capacity: '' },
  ]);
  const [buffaloCapacity, setBuffaloCapacity] = useState('');
  const [hasCow, setHasCow] = useState(false);
  const [hasBuffalo, setHasBuffalo] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gstNumber: '',
    address: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [newCowTypeName, setNewCowTypeName] = useState('');
  const [newCowTypeCapacity, setNewCowTypeCapacity] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleAddCowType = () => {
    if (!newCowTypeName.trim() || !newCowTypeCapacity.trim()) {
      setError('Please enter cow type name and capacity.');
      return;
    }
    setCowMilk(prev => [
      ...prev,
      { name: newCowTypeName.trim(), capacity: newCowTypeCapacity.trim() },
    ]);
    setNewCowTypeName('');
    setNewCowTypeCapacity('');
    setError('');
  };

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
    if (!form.name.trim()) return 'Name is required';
    if (!form.password) return 'Password is required';
    if (!form.confirmPassword) return 'Confirm Password is required';
    if (!form.address.trim()) return 'Address is required';

    if (!hasCow && !hasBuffalo) return 'Select at least one milk type (Cow or Buffalo)';
    if (hasCow) {
      const anyValidCow = cowMilk.some(
        c => c.name.trim() && c.capacity.trim() && !isNaN(Number(c.capacity)) && Number(c.capacity) > 0
      );
      if (!anyValidCow) return 'Please enter valid name and capacity for at least one cow type';
    }
    if (hasBuffalo) {
      if (
        !buffaloCapacity.trim() ||
        isNaN(Number(buffaloCapacity)) ||
        Number(buffaloCapacity) < 0
      )
        return 'Please enter a valid capacity for Buffalo milk';
    }

    return '';
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setError('');
    if (form.password !== form.confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'Password and Confirm Password do not match.',
        [{ text: 'OK' }]
      );
      return;
    }

    const filteredCowMilk = hasCow
      ? cowMilk.filter(
        c =>
          c.name.trim() &&
          c.capacity.trim() &&
          !isNaN(Number(c.capacity)) &&
          Number(c.capacity) > 0
      )
      : [];

    const milkData = {
      hasCow,
      cowMilk: filteredCowMilk,
      hasBuffalo,
      buffaloCapacity: hasBuffalo ? buffaloCapacity : undefined,
    };

    const vendorPayload = {
      name: form.name,
      email: form.email,
      gstNumber: form.gstNumber,
      address: form.address,
      phone: form.phone,
      password: form.password,
      milkData,
    };

    try {
      const res = await addVendorRegistration(vendorPayload);
      if (res.data && res.data.message) {
        Alert.alert(
          'Registration Successful',
          res.data.message + '\nYou will be redirected to Login.',
          [
            {
              text: 'OK',
              onPress: () => navigation.replace('Login'),
            },
          ]
        );
      }
    } catch (error: any) {
      console.log('Vendor registration error:', error.response?.data);
      setError(error.response?.data?.error || 'Vendor registration failed');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Vendor Registration</Text>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Name<Text style={styles.required}> *</Text></Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={text => handleInputChange('name', text)}
          placeholder="Enter your name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={text => handleInputChange('email', text)}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          value={form.phone}
          onChangeText={text => handleInputChange('phone', text)}
          placeholder="Enter your phone"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Password<Text style={styles.required}> *</Text></Text>
        <View style={styles.inputBoxRelative}>
          <TextInput
            style={[styles.input, styles.inputWithIcon, { color: '#222' }]}
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
            style={[styles.input, styles.inputWithIcon, { color: '#222' }]}
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
        <Text style={styles.label}>Address<Text style={styles.required}> *</Text></Text>
        <TextInput
          style={styles.input}
          value={form.address}
          onChangeText={text => handleInputChange('address', text)}
          placeholder="Enter your address"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>GST Number</Text>
        <TextInput
          style={styles.input}
          value={form.gstNumber}
          onChangeText={text => handleInputChange('gstNumber', text)}
          placeholder="Enter GST number"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Milk Types You Supply</Text>
        <View style={styles.milkTypeRow}>
          <TouchableOpacity
            style={[styles.milkTypeButton, hasCow && styles.milkTypeSelected]}
            onPress={() => setHasCow(!hasCow)}
          >
            <Text style={[styles.milkTypeText, hasCow && styles.milkTypeTextSelected]}>
              Cow
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.milkTypeButton, hasBuffalo && styles.milkTypeSelected]}
            onPress={() => setHasBuffalo(!hasBuffalo)}
          >
            <Text style={[styles.milkTypeText, hasBuffalo && styles.milkTypeTextSelected]}>
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
              />
              <TextInput
                style={styles.cowTypeCapacityInput}
                value={item.capacity}
                keyboardType="numeric"
                onChangeText={val => handleCowMilkChange(idx, 'capacity', val)}
                placeholder="Capacity"
              />
              <Text style={styles.cowTypeLabel}>ltrs</Text>
            </View>
          ))}
          <View style={styles.milkTypeInputRow}>
            <TextInput
              style={[styles.cowTypeCapacityInput, { flex: 1, marginRight: 8 }]}
              value={newCowTypeName}
              onChangeText={setNewCowTypeName}
              placeholder="Add Cow Type"
            />
            <TextInput
              style={styles.cowTypeCapacityInput}
              value={newCowTypeCapacity}
              keyboardType="numeric"
              onChangeText={setNewCowTypeCapacity}
              placeholder="Capacity"
            />
            <TouchableOpacity style={styles.addBtn} onPress={handleAddCowType}>
              <Icon name="plus" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {hasBuffalo && (
        <View style={styles.milkDetailsSection}>
          <Text style={styles.sectionTitle}>Buffalo Milk Capacity (ltrs)</Text>
          <View style={styles.milkTypeInputRow}>
            <TextInput
              style={[styles.cowTypeCapacityInput, { flex: 1, marginRight: 8 }]}
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

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 64,
    backgroundColor: '#f6fbf6',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1d7e14',
    letterSpacing: 1.2,
  },
  roleSelector: {
    marginBottom: 28,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  roleLink: {
    color: '#0d99ff',
    textDecorationLine: 'underline',
    fontWeight: '600',
    fontSize: 20,
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  orText: {
    marginHorizontal: 5,
    fontSize: 17,
    color: '#333',
    fontWeight: '600',
  },
  roleActive: {
    color: '#22be19',
    backgroundColor: '#e7f9e5',
    textDecorationLine: 'underline',
  },
  formGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    color: '#166512',
    letterSpacing: 0.4,
  },
  required: {
    color: 'red',
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#c6e0b4',
    borderRadius: 8,
    padding: 11,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#222',
  },
  inputBoxRelative: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  inputWithIcon: {
    paddingRight: 44,
  },
  iconInside: {
    position: 'absolute',
    right: 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    height: '100%',
    zIndex: 2,
  },
  milkTypeRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  milkTypeButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c6e0b4',
    backgroundColor: '#f4fff6',
    alignItems: 'center',
  },
  milkTypeSelected: {
    backgroundColor: '#22be19',
    borderColor: '#22be19',
  },
  milkTypeText: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },
  milkTypeTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: '#fdecea',
    padding: 12,
    marginBottom: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  errorText: {
    color: '#a94442',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
  },
  milkDetailsSection: {
    marginBottom: 18,
    marginTop: 8,
    backgroundColor: '#eaf9ea',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: '#c6e0b4',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#166512',
    letterSpacing: 0.4,
  },
  milkTypeInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cowTypeLabel: {
    fontSize: 15,
    color: '#333',
    marginRight: 5,
    minWidth: 60,
    fontWeight: '500',
  },
  cowTypeCapacityInput: {
    borderWidth: 1,
    borderColor: '#c6e0b4',
    borderRadius: 8,
    padding: 7,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#222',
    width: 70,
    marginRight: 5,
  },
  flexGrowInput: {
    flex: 1,
    marginRight: 8,
  },
  addBtn: {
    backgroundColor: '#22be19',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 7,
    alignItems: 'center',
    alignSelf: 'flex-start',
    justifyContent: 'center',
    height: 40,
    marginLeft: 6,
  },
  addBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  terms: {
    fontSize: 13,
    textAlign: 'center',
    color: '#666',
    marginVertical: 18,
  },
  link: {
    color: '#0d99ff',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#22be19',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#166512',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.8,
  },
});