
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Linking, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/RegisterStyles';
import { useDispatch, useSelector } from 'react-redux';
import { registerVendor, clearError } from '../../store/authSlice';
import { RootState, AppDispatch } from '../../store';

interface CowMilkDetail {
  name: string;
  capacity: string;
  rate: string;
}

interface VendorPayload {
  name: string;
  email?: string;
  contact?: string;
  password: string;
  confirm_password?: string;

  // Address fields (exactly as backend expects)
  flat_house: string;
  society_area: string;
  village: string;
  tal: string;
  dist: string;
  state: string;

  // Individual cow milk fields (exactly as backend expects)
  gir_cow_milk_litre?: number;
  gir_cow_rate?: number;
  jarshi_cow_milk_litre?: number;
  jarshi_cow_rate?: number;
  deshi_milk_litre?: number;      // Note: backend uses "deshi_milk_litre" not "deshi_cow_milk_litre"
  deshi_cow_rate?: number;

  // Buffalo fields
  buffalo_milk_litre?: number;

  // Global rates
  cr?: number;  // Global cow rate
  br?: number;  // Global buffalo rate
}

interface FormState {
  name: string;
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

export default function VendorRegisterScreen({ navigation }: { navigation: any }) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [cowMilk, setCowMilk] = useState<CowMilkDetail[]>([
    { name: 'Gir Cow', capacity: '', rate: '' },
    { name: 'Deshi', capacity: '', rate: '' },
    { name: 'Jarshi', capacity: '', rate: '' },
  ]);

  const [buffaloCapacity, setBuffaloCapacity] = useState<string>('');
  const [buffaloRate, setBuffaloRate] = useState<string>('');
  const [cowMilkRate, setCowMilkRate] = useState<string>('');
  const [buffaloMilkRate, setBuffaloMilkRate] = useState<string>('');
  const [hasCow, setHasCow] = useState(false);
  const [hasBuffalo, setHasBuffalo] = useState(false);

  const [form, setForm] = useState<FormState>({
    name: '',
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
    if (error) {scrollRef.current?.scrollTo({ y: 0, animated: true });}
  }, [error]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleCowMilkChange = (idx: number, field: 'name' | 'capacity' | 'rate', value: string) => {
    setCowMilk(prev => prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)));
  };

  const handleInputChange = (field: keyof FormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (localError) {setLocalError('');}
    if (error) {dispatch(clearError());}
  };

  const validate = () => {
    setLocalError('');
    if (!form.name.trim()) {return 'Name is required';}
    if (!form.password) {return 'Password is required';}
    if (form.password.length < 6) {return 'Password should be at least 6 characters';}
    if (form.password !== form.confirmPassword) {return 'Password and Confirm Password do not match';}
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {return 'Please enter a valid email address';}

    const phone = form.phone.trim();
    if (!phone) {return 'Phone number is required';}
    if (!/^[6-9]\d{9}$/.test(phone)) {return 'Phone number must be valid 10 digits starting with 6-9';}

    if (
      !form.flat.trim() || !form.society.trim() || !form.village.trim() ||
      !form.tal.trim() || !form.dist.trim() || !form.state.trim()
    ) {return 'All address fields (Flat, Society, Village, Tal, Dist, State) are required';}

    if (!hasCow && !hasBuffalo) {return 'Select at least one milk type (Cow or Buffalo)';}

    if (hasCow) {
      for (const c of cowMilk) {
        if (c.capacity && (isNaN(Number(c.capacity)) || Number(c.capacity) <= 0)) {
          return `Please enter valid capacity for ${c.name}`;
        }
        if (c.capacity && (!c.rate.trim() || isNaN(Number(c.rate)) || Number(c.rate) <= 0)) {
          return `Please enter valid rate for ${c.name}`;
        }
      }
    }

    if (hasBuffalo) {
      const capacity = Number(buffaloCapacity);
      if (isNaN(capacity) || capacity <= 0) {return 'Please enter a valid capacity for Buffalo milk';}
      if (!buffaloRate.trim() || isNaN(Number(buffaloRate)) || Number(buffaloRate) <= 0) {
        return 'Please enter a valid Buffalo milk rate';
      }
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
      const vendorPayload: VendorPayload = {
        name: form.name,
        email: form.email.trim() || undefined,
        contact: form.phone.trim() ? `+91${form.phone.trim()}` : undefined,
        password: form.password,
        confirm_password: form.confirmPassword,

        // Separate address fields (exactly as backend expects)
        flat_house: form.flat,
        society_area: form.society,
        village: form.village,
        tal: form.tal,
        dist: form.dist,
        state: form.state,

        // Global rates (cr = cow rate, br = buffalo rate)
        cr: cowMilkRate ? Number(cowMilkRate) : undefined,
        br: buffaloMilkRate ? Number(buffaloMilkRate) : undefined,
      };

      if (hasCow) {
        // Gir cow
        if (cowMilk[0]?.capacity) {vendorPayload.gir_cow_milk_litre = Number(cowMilk[0].capacity);}
        if (cowMilk[0]?.rate) {vendorPayload.gir_cow_rate = Number(cowMilk[0].rate);}

        // Deshi cow - Note: backend expects "deshi_milk_litre" not "deshi_cow_milk_litre"
        if (cowMilk[1]?.capacity) {vendorPayload.deshi_milk_litre = Number(cowMilk[1].capacity);}
        if (cowMilk[1]?.rate) {vendorPayload.deshi_cow_rate = Number(cowMilk[1].rate);}

        // Jarshi cow
        if (cowMilk[2]?.capacity) {vendorPayload.jarshi_cow_milk_litre = Number(cowMilk[2].capacity);}
        if (cowMilk[2]?.rate) {vendorPayload.jarshi_cow_rate = Number(cowMilk[2].rate);}
      }

      if (hasBuffalo) {
        vendorPayload.buffalo_milk_litre = Number(buffaloCapacity);
        // Buffalo individual rate is handled by buffaloRate input
        // Global buffalo rate is handled by br field above
      }

      console.log('Vendor Payload:', vendorPayload); // For debugging

      const result = await dispatch(registerVendor(vendorPayload));
      if (registerVendor.fulfilled.match(result)) {
        showSuccessAlert('Vendor registration successful!');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
    }
  };

  const showSuccessAlert = (message: string) => {
    Alert.alert('Registration Successful', `${message}\nYou will be redirected to Login.`, [
      { text: 'OK', onPress: () => navigation.replace('Login') },
    ]);
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
          hitSlop={{ top: 10, bottom: 10, left: 0, right: 10 }}
        >
          <Icon name="arrow-left" size={26} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Vendor Registration</Text>
      </View>

      {displayError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{displayError}</Text>
        </View>
      )}

      {/* Basic Information */}
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
        <Text style={styles.label}>Password<Text style={styles.required}> *</Text></Text>
        <View style={styles.inputBoxRelative}>
          <TextInput
            style={[styles.input, styles.inputWithIcon]}
            value={form.password}
            onChangeText={text => handleInputChange('password', text)}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={styles.iconInside}
            onPress={() => setShowPassword(v => !v)}
            activeOpacity={0.7}
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
            placeholder="Re-enter your password"
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#aaa"
          />
          <TouchableOpacity
            style={styles.iconInside}
            onPress={() => setShowConfirmPassword(v => !v)}
            activeOpacity={0.7}
          >
            <Icon name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="#444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Address Fields */}
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

      {/* Global Milk Rate Fields (Optional) */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Cow Milk Rate (₹ per litre)</Text>
        <TextInput
          style={styles.input}
          value={cowMilkRate}
          keyboardType="numeric"
          onChangeText={setCowMilkRate}
          placeholder="Enter cow milk rate"
          placeholderTextColor="#888"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Buffalo Milk Rate (₹ per litre)</Text>
        <TextInput
          style={styles.input}
          value={buffaloMilkRate}
          keyboardType="numeric"
          onChangeText={setBuffaloMilkRate}
          placeholder="Enter buffalo milk rate"
          placeholderTextColor="#888"
        />
      </View>

      {/* Milk Types Toggle */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Milk Types:</Text>
        <View style={styles.milkTypeRow}>
          <TouchableOpacity
            style={[styles.milkTypeButton, hasCow && styles.milkTypeSelected]}
            onPress={() => setHasCow(!hasCow)}
          >
            <Text style={[styles.milkTypeText, hasCow && styles.milkTypeTextSelected]}>Cow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.milkTypeButton, hasBuffalo && styles.milkTypeSelected]}
            onPress={() => setHasBuffalo(!hasBuffalo)}
          >
            <Text style={[styles.milkTypeText, hasBuffalo && styles.milkTypeTextSelected]}>Buffalo</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Cow Milk Section */}
      {hasCow && (
        <View style={styles.milkDetailsSection}>
          <Text style={styles.sectionTitle}>Cow Milk Types</Text>
          {cowMilk.map((item, idx) => (
            <View key={idx} style={styles.milkTypeBlock}>
              <View style={styles.milkTypeInputRow}>
                <TextInput
                  style={styles.cowTypeInput}
                  value={item.name}
                  onChangeText={val => handleCowMilkChange(idx, 'name', val)}
                  placeholder="Cow Type"
                  editable={idx > 2}
                />
                <TextInput
                  style={styles.cowCapacityInput}
                  value={item.capacity}
                  keyboardType="numeric"
                  onChangeText={val => handleCowMilkChange(idx, 'capacity', val)}
                  placeholder="Capacity"
                />
                <Text style={styles.ltrsLabel}>ltrs</Text>
              </View>
              <View style={styles.rateRow}>
                <Text style={styles.rateLabel}>Rate</Text>
                <TextInput
                  style={styles.rateInput}
                  value={item.rate}
                  keyboardType="numeric"
                  onChangeText={val => handleCowMilkChange(idx, 'rate', val)}
                  placeholder="per litre"
                  placeholderTextColor="#888"
                />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Buffalo Milk Section */}
      {hasBuffalo && (
        <View style={styles.milkDetailsSection}>
          <Text style={styles.sectionTitle}>Buffalo Milk</Text>
          <View style={styles.milkTypeBlock}>
            <View style={styles.milkTypeInputRow}>
              <TextInput
                style={styles.cowTypeInput}
                value="Buffalo"
                editable={false}
              />
              <TextInput
                style={styles.cowCapacityInput}
                value={buffaloCapacity}
                keyboardType="numeric"
                onChangeText={setBuffaloCapacity}
                placeholder="Capacity"
              />
              <Text style={styles.ltrsLabel}>ltrs</Text>
            </View>
            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>Rate</Text>
              <TextInput
                style={styles.rateInput}
                value={buffaloRate}
                keyboardType="numeric"
                onChangeText={setBuffaloRate}
                placeholder="per litre"
                placeholderTextColor="#888"
              />
            </View>
          </View>
        </View>
      )}

      <Text style={styles.terms}>
        By registering, you agree to our{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://example.com/terms/vendor')}>
          Vendor Terms
        </Text>.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
        <Text style={styles.buttonText}>{isLoading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
