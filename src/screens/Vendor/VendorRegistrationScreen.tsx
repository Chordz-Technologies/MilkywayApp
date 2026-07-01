import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/RegisterStyles';
import { useDispatch, useSelector } from 'react-redux';
import { registerVendor, clearError } from '../../store/authSlice';
import { RootState, AppDispatch } from '../../store';
import SafeAreaWrapper from '../../styles/SafeAreaWrapper';
import { useTranslation } from '../../i18n/LanguageProvider';

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
  pincode: string; // Added pincode

  // Individual cow milk fields (exactly as backend expects)
  gir_cow_milk_litre?: number;
  gir_cow_rate?: number;
  jarshi_cow_milk_litre?: number;
  jarshi_cow_rate?: number;
  deshi_milk_litre?: number;
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
  pincode: string; // Added pincode to form state
}

export default function VendorRegisterScreen({ navigation }: { navigation: any }) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation();

  const [cowMilk, setCowMilk] = useState<CowMilkDetail[]>([
    { name: t('registration.girCow'), capacity: '', rate: '' },
    { name: t('registration.deshiCow'), capacity: '', rate: '' },
    { name: t('registration.jerseyCow'), capacity: '', rate: '' },
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
    pincode: '', // Added pincode initialization
  });

  const [localError, setLocalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (error) { scrollRef.current?.scrollTo({ y: 0, animated: true }); }
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
    if (localError) { setLocalError(''); }
    if (error) { dispatch(clearError()); }
  };

  const validate = () => {
    setLocalError('');
    if (!form.name.trim()) { return t('validation.fullNameRequired'); }
    if (!form.password) { return t('validation.passwordRequired'); }
    if (form.password.length < 6) { return t('validation.passwordMinLength'); }
    if (form.password !== form.confirmPassword) { return t('validation.passwordMismatch1'); }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { return t('validation.invalidEmail'); }

    const phone = form.phone.trim();
    if (!phone) { return t('validation.phoneRequired'); }
    if (!/^[6-9]\d{9}$/.test(phone)) { return t('validation.invalidPhone'); }

    if (
      !form.flat.trim() || !form.society.trim() || !form.village.trim() ||
      !form.tal.trim() || !form.dist.trim() || !form.state.trim()
    ) { return t('validation.addressRequired'); }

    // ✅ Added pincode validation
    if (!form.pincode.trim()) { return t('validation.pincodeRequired'); }
    if (!/^\d{6}$/.test(form.pincode.trim())) { return t('validation.invalidPincode'); }

    if (!hasCow && !hasBuffalo) { return t('validation.milkTypeRequired'); }

    if (hasCow) {
      for (const c of cowMilk) {
        if (c.capacity && (isNaN(Number(c.capacity)) || Number(c.capacity) <= 0)) {
          return t('validation.cowCapacityInvalid', { name: c.name });
        }
        if (c.capacity && (!c.rate.trim() || isNaN(Number(c.rate)) || Number(c.rate) <= 0)) {
          return t('validation.cowRateInvalid', { name: c.name });
        }
      }
    }

    if (hasBuffalo) {
      const capacity = Number(buffaloCapacity);
      if (isNaN(capacity) || capacity <= 0) { return t('validation.buffaloCapacityInvalid'); }
      if (!buffaloRate.trim() || isNaN(Number(buffaloRate)) || Number(buffaloRate) <= 0) {
        return t('validation.buffaloRateInvalid');
      }
    }

    return '';
  };

  const handleSubmit = async () => {
    if (isLoading) { return; }

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
        pincode: form.pincode.trim(), // Added pincode to payload

        // Global rates (cr = cow rate, br = buffalo rate)
        cr: cowMilkRate ? Number(cowMilkRate) : undefined,
        br: buffaloMilkRate ? Number(buffaloMilkRate) : undefined,
      };

      if (hasCow) {
        // Gir cow
        if (cowMilk[0]?.capacity) { vendorPayload.gir_cow_milk_litre = Number(cowMilk[0].capacity); }
        if (cowMilk[0]?.rate) { vendorPayload.gir_cow_rate = Number(cowMilk[0].rate); }

        // Deshi cow - Note: backend expects "deshi_milk_litre" not "deshi_cow_milk_litre"
        if (cowMilk[1]?.capacity) { vendorPayload.deshi_milk_litre = Number(cowMilk[1].capacity); }
        if (cowMilk[1]?.rate) { vendorPayload.deshi_cow_rate = Number(cowMilk[1].rate); }

        // Jarshi cow
        if (cowMilk[2]?.capacity) { vendorPayload.jarshi_cow_milk_litre = Number(cowMilk[2].capacity); }
        if (cowMilk[2]?.rate) { vendorPayload.jarshi_cow_rate = Number(cowMilk[2].rate); }
      }

      if (hasBuffalo) {
        vendorPayload.buffalo_milk_litre = Number(buffaloCapacity);
      }

      const result = await dispatch(registerVendor(vendorPayload));
      if (registerVendor.fulfilled.match(result)) {
        Alert.alert(t('registration.registrationSuccessful'), t('registration.vendorRegistrationSuccess'), [
          { text: 'OK', onPress: () => navigation.replace('Login') },
        ]);
      }
    } catch (err: any) {
      console.log('Registration error:', err);
    }
  };

  const displayError = error || localError;

  return (
    <SafeAreaWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollRef}
            style={[styles.container, { paddingBottom: 100 }]}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.contentContainer,
              { flexGrow: 1 }
            ]}
          >
            <View style={styles.titleRow}>
              <TouchableOpacity
                style={styles.backArrow}
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 10, bottom: 10, left: 0, right: 10 }}
              >
                <Icon name="arrow-left" size={26} color="#333" />
              </TouchableOpacity>
              <Text style={styles.title}>{t('registration.vendorRegistration')}</Text>
            </View>

            {displayError && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{displayError}</Text>
              </View>
            )}

            {/* Basic Information */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('registration.fullName')}<Text style={styles.required}> *</Text></Text>
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={text => handleInputChange('name', text)}
                placeholder={t('registration.enterFullName')}
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('registration.email')}</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={text => handleInputChange('email', text)}
                placeholder={t('registration.enterEmail')}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('registration.phoneNumber')}<Text style={styles.required}> *</Text></Text>
              <View style={styles.phoneInputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.phoneInput}
                  value={form.phone}
                  onChangeText={text => {
                    const cleaned = text.replace(/\D/g, '').slice(0, 10);
                    handleInputChange('phone', cleaned);
                  }}
                  placeholder={t('registration.enterPhoneNumber')}
                  keyboardType="number-pad"
                  maxLength={10}
                  placeholderTextColor="#888"
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('registration.password')}<Text style={styles.required}> *</Text></Text>
              <View style={styles.inputBoxRelative}>
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  value={form.password}
                  onChangeText={text => handleInputChange('password', text)}
                  placeholder={t('registration.enterPassword')}
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
              <Text style={styles.label}>{t('registration.confirmPassword')}<Text style={styles.required}> *</Text></Text>
              <View style={styles.inputBoxRelative}>
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  value={form.confirmPassword}
                  onChangeText={text => handleInputChange('confirmPassword', text)}
                  placeholder={t('registration.reEnterPassword')}
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
              <Text style={styles.label}>{t('registration.flatHouse')}<Text style={styles.required}> *</Text></Text>
              <TextInput
                style={styles.input}
                value={form.flat}
                onChangeText={text => handleInputChange('flat', text)}
                placeholder={t('registration.enterFlatHouse')}
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('registration.societyArea')}<Text style={styles.required}> *</Text></Text>
              <TextInput
                style={styles.input}
                value={form.society}
                onChangeText={text => handleInputChange('society', text)}
                placeholder={t('registration.enterSocietyArea')}
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('registration.village')}<Text style={styles.required}> *</Text></Text>
              <TextInput
                style={styles.input}
                value={form.village}
                onChangeText={text => handleInputChange('village', text)}
                placeholder={t('registration.enterVillage')}
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('registration.taluka')}<Text style={styles.required}> *</Text></Text>
              <TextInput
                style={styles.input}
                value={form.tal}
                onChangeText={text => handleInputChange('tal', text)}
                placeholder={t('registration.enterTaluka')}
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('registration.district')}<Text style={styles.required}> *</Text></Text>
              <TextInput
                style={styles.input}
                value={form.dist}
                onChangeText={text => handleInputChange('dist', text)}
                placeholder={t('registration.enterDistrict')}
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('registration.state')}<Text style={styles.required}> *</Text></Text>
              <TextInput
                style={styles.input}
                value={form.state}
                onChangeText={text => handleInputChange('state', text)}
                placeholder={t('registration.enterState')}
                placeholderTextColor="#888"
              />
            </View>

            {/* Added Pincode Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('registration.pincode')}<Text style={styles.required}> *</Text></Text>
              <TextInput
                style={styles.input}
                value={form.pincode}
                onChangeText={text => {
                  const cleaned = text.replace(/\D/g, '').slice(0, 6);
                  handleInputChange('pincode', cleaned);
                }}
                placeholder={t('registration.enterPincode')}
                keyboardType="number-pad"
                maxLength={6}
                placeholderTextColor="#888"
              />
            </View>

            {/* Global Milk Rate Fields (Optional) */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('registration.cowMilkRate')}</Text>
              <TextInput
                style={styles.input}
                value={cowMilkRate}
                keyboardType="numeric"
                onChangeText={setCowMilkRate}
                placeholder={t('registration.enterCowMilkRate')}
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('registration.buffaloMilkRate')}</Text>
              <TextInput
                style={styles.input}
                value={buffaloMilkRate}
                keyboardType="numeric"
                onChangeText={setBuffaloMilkRate}
                placeholder={t('registration.enterBuffaloMilkRate')}
                placeholderTextColor="#888"
              />
            </View>

            {/* Milk Types Toggle */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('registration.milkTypes')}</Text>
              <View style={styles.milkTypeRow}>
                <TouchableOpacity
                  style={[styles.milkTypeButton, hasCow && styles.milkTypeSelected]}
                  onPress={() => setHasCow(!hasCow)}
                >
                  <Text style={[styles.milkTypeText, hasCow && styles.milkTypeTextSelected]}>{t('registration.cow')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.milkTypeButton, hasBuffalo && styles.milkTypeSelected]}
                  onPress={() => setHasBuffalo(!hasBuffalo)}
                >
                  <Text style={[styles.milkTypeText, hasBuffalo && styles.milkTypeTextSelected]}>{t('registration.buffalo')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Cow Milk Section */}
            {hasCow && (
              <View style={styles.milkDetailsSection}>
                <Text style={styles.sectionTitle}>{t('registration.cowMilkTypes')}</Text>
                {cowMilk.map((item, idx) => (
                  <View key={idx} style={styles.milkTypeBlock}>
                    <View style={styles.milkTypeInputRow}>
                      <TextInput
                        style={styles.cowTypeInput}
                        value={item.name}
                        onChangeText={val => handleCowMilkChange(idx, 'name', val)}
                        placeholder={t('registration.cowType')}
                        editable={idx > 2}
                      />
                      <TextInput
                        style={styles.cowCapacityInput}
                        value={item.capacity}
                        keyboardType="numeric"
                        onChangeText={val => handleCowMilkChange(idx, 'capacity', val)}
                        placeholder="0"
                        placeholderTextColor="#888"
                      />
                      <Text style={styles.ltrsLabel}>{t('registration.liters')}</Text>
                    </View>
                    <View style={styles.rateRow}>
                      <Text style={styles.rateLabel}>{t('registration.rate')}</Text>
                      <TextInput
                        style={styles.rateInput}
                        value={item.rate}
                        keyboardType="numeric"
                        onChangeText={val => handleCowMilkChange(idx, 'rate', val)}
                        placeholder={t('registration.perLitre')}
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
                <Text style={styles.sectionTitle}>{t('registration.buffaloMilk')}</Text>
                <View style={styles.milkTypeBlock}>
                  <View style={styles.milkTypeInputRow}>
                    <TextInput
                      style={styles.cowTypeInput}
                      value={t('registration.buffalo')}
                      editable={false}
                    />
                    <TextInput
                      style={styles.cowCapacityInput}
                      value={buffaloCapacity}
                      keyboardType="numeric"
                      onChangeText={setBuffaloCapacity}
                      placeholder="0"
                      placeholderTextColor="#888"
                    />
                    <Text style={styles.ltrsLabel}>{t('registration.liters')}</Text>
                  </View>
                  <View style={styles.rateRow}>
                    <Text style={styles.rateLabel}>{t('registration.rate')}</Text>
                    <TextInput
                      style={styles.rateInput}
                      value={buffaloRate}
                      keyboardType="numeric"
                      onChangeText={setBuffaloRate}
                      placeholder={t('registration.perLitre')}
                      placeholderTextColor="#888"
                    />
                  </View>
                </View>
              </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
              <Text style={styles.buttonText}>{isLoading ? t('registration.registering') : t('registration.register')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
}
