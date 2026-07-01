import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/RegisterStyles';
import { useDispatch, useSelector } from 'react-redux';
import { registerCustomer, clearError } from '../../store/authSlice';
import { RootState, AppDispatch } from '../../store';
import SafeAreaWrapper from '../../styles/SafeAreaWrapper';
import { useTranslation } from '../../i18n/LanguageProvider';

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
  pincode: string; // Added pincode
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
  pincode: string;
}

export default function ConsumerRegistrationScreen({ navigation }: { navigation: any }) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [cowCapacity, setCowCapacity] = useState<string>('');
  const [buffaloCapacity, setBuffaloCapacity] = useState<string>('');
  const [hasCow, setHasCow] = useState(false);
  const [hasBuffalo, setHasBuffalo] = useState(false);
  const { t } = useTranslation();

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
    pincode: '',
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
    if (localError) { setLocalError(''); }
    if (error) { dispatch(clearError()); }
  };

  const validate = () => {
    setLocalError('');
    if (!form.firstName.trim()) { return t('validation.firstNameRequired'); }
    if (!form.lastName.trim()) { return t('validation.lastNameRequired'); }
    if (!form.password) { return t('validation.passwordRequired'); }
    if (form.password.length < 6) { return t('validation.passwordMinLength'); }
    if (form.password !== form.confirmPassword) { return t('validation.passwordMismatch1'); }
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { return t('validation.invalidEmail'); }

    const phone = form.phone.trim();
    if (!phone) { return t('validation.phoneRequired'); }
    if (!/^[6-9]\d{9}$/.test(phone)) { return t('validation.invalidPhone'); }

    // Validate address parts separately
    if (!form.flat.trim()) { return t('validation.flatRequired'); }
    if (!form.society.trim()) { return t('validation.societyRequired'); }
    if (!form.village.trim()) { return t('validation.villageRequired'); }
    if (!form.tal.trim()) { return t('validation.talRequired'); }
    if (!form.dist.trim()) { return t('validation.districtRequired'); }
    if (!form.state.trim()) { return t('validation.stateRequired'); }

    // Added pincode validation
    if (!form.pincode.trim()) { return t('validation.pincodeRequired'); }
    if (!/^\d{6}$/.test(form.pincode.trim())) { return t('validation.invalidPincode'); }

    if (!hasCow && !hasBuffalo) { return t('validation.selectMilkType'); }

    if (hasCow) {
      const capacity = Number(cowCapacity);
      if (isNaN(capacity) || capacity <= 0) { return t('validation.invalidCowCapacity'); }
    }
    if (hasBuffalo) {
      const capacity = Number(buffaloCapacity);
      if (isNaN(capacity) || capacity <= 0) { return t('validation.invalidBuffaloCapacity'); }
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
        pincode: form.pincode.trim(),
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
        Alert.alert(t('registration.registrationSuccessful'), t('registration.consumerRegistrationSuccess'), [
          {
            text: 'OK',
            onPress: () => navigation.replace('Login'),
          },
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
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="arrow-left" size={32} color="#333" />
              </TouchableOpacity>
              <Text style={styles.title}>{t('registration.consumerRegistration')}</Text>
            </View>

            {displayError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{displayError}</Text>
              </View>
            ) : null}

            {/* First Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {t('registration.firstName')}<Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.firstName}
                onChangeText={(text) => handleInputChange('firstName', text)}
                placeholder={t('registration.enterFirstName')}
                placeholderTextColor="#888"
              />
            </View>

            {/* Last Name */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {t('registration.lastName')}<Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.lastName}
                onChangeText={(text) => handleInputChange('lastName', text)}
                placeholder={t('registration.enterLastName')}
                placeholderTextColor="#888"
              />
            </View>

            {/* Email */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('registration.email')}</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder={t('registration.enterEmail')}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#888"
              />
            </View>

            {/* Phone Number */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {t('registration.phoneNumber')}<Text style={styles.required}> *</Text>
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
                  placeholder={t('registration.enterPhoneNumber')}
                  keyboardType="number-pad"
                  maxLength={10}
                  placeholderTextColor="#888"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {t('registration.password')}<Text style={styles.required}> *</Text>
              </Text>
              <View style={styles.inputBoxRelative}>
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  value={form.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                  placeholder={t('registration.enterPassword')}
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
                {t('registration.confirmPassword')}<Text style={styles.required}> *</Text>
              </Text>
              <View style={styles.inputBoxRelative}>
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  value={form.confirmPassword}
                  onChangeText={(text) => handleInputChange('confirmPassword', text)}
                  placeholder={t('registration.reEnterPassword')}
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

            {/* Address Fields */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {t('registration.flatHouse')}<Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.flat}
                onChangeText={(text) => handleInputChange('flat', text)}
                placeholder={t('registration.enterFlatHouse')}
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {t('registration.societyArea')}<Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.society}
                onChangeText={(text) => handleInputChange('society', text)}
                placeholder={t('registration.enterSocietyArea')}
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {t('registration.village')}<Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.village}
                onChangeText={(text) => handleInputChange('village', text)}
                placeholder={t('registration.enterVillage')}
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {t('registration.taluka')}<Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.tal}
                onChangeText={(text) => handleInputChange('tal', text)}
                placeholder={t('registration.enterTaluka')}
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {t('registration.district')}<Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.dist}
                onChangeText={(text) => handleInputChange('dist', text)}
                placeholder={t('registration.enterDistrict')}
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {t('registration.state')}<Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.state}
                onChangeText={(text) => handleInputChange('state', text)}
                placeholder={t('registration.enterState')}
                placeholderTextColor="#888"
              />
            </View>

            {/* Added Pincode Field */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                {t('registration.pincode')}<Text style={styles.required}> *</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={form.pincode}
                onChangeText={(text) => {
                  const cleaned = text.replace(/\D/g, '').slice(0, 6);
                  handleInputChange('pincode', cleaned);
                }}
                placeholder={t('registration.enterPincode')}
                keyboardType="number-pad"
                maxLength={6}
                placeholderTextColor="#888"
              />
            </View>

            {/* Milk Types */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>{t('registration.milkTypes')}</Text>
              <View style={styles.milkTypeRow}>
                <TouchableOpacity
                  style={[styles.milkTypeButton, hasCow && styles.milkTypeSelected]}
                  onPress={() => setHasCow((v) => !v)}
                >
                  <Text style={[styles.milkTypeText, hasCow && styles.milkTypeTextSelected]}>{t('registration.cow')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.milkTypeButton, hasBuffalo && styles.milkTypeSelected]}
                  onPress={() => setHasBuffalo((v) => !v)}
                >
                  <Text style={[styles.milkTypeText, hasBuffalo && styles.milkTypeTextSelected]}>{t('registration.buffalo')}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {hasCow && (
              <View style={styles.milkDetailsSection}>
                <Text style={styles.sectionTitle}>{t('registration.cowMilkDailyRequirement')}</Text>
                <View style={styles.milkTypeInputRow}>
                  <TextInput
                    style={styles.compactInputBox}
                    value={cowCapacity}
                    keyboardType="numeric"
                    onChangeText={setCowCapacity}
                    placeholder="0"
                    placeholderTextColor="#888"
                  />
                  <Text style={styles.cowTypeLabel}>{t('registration.liters')}</Text>
                </View>
              </View>
            )}

            {hasBuffalo && (
              <View style={styles.milkDetailsSection}>
                <Text style={styles.sectionTitle}>{t('registration.buffaloMilkDailyRequirement')}</Text>
                <View style={styles.milkTypeInputRow}>
                  <TextInput
                    style={styles.compactInputBox}
                    value={buffaloCapacity}
                    keyboardType="numeric"
                    onChangeText={setBuffaloCapacity}
                    placeholder="0"
                    placeholderTextColor="#888" />
                  <Text style={styles.cowTypeLabel}>{t('registration.liters')}</Text>
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