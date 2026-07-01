import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/RegisterStyles';
import { useDispatch, useSelector } from 'react-redux';
import { registerDistributor, clearError } from '../../store/authSlice';
import { RootState, AppDispatch } from '../../store';
import SafeAreaWrapper from '../../styles/SafeAreaWrapper';
import { useTranslation } from '../../i18n/LanguageProvider';

interface DistributorPayload {
  full_name: string;
  phone_number?: string;
  flat_house: string;
  society_name: string;
  village: string;
  tal: string;
  dist: string;
  state: string;
  pincode: string;
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
  pincode: string;
  password: string;
  confirmPassword: string;
}

export default function DistributorRegistrationScreen({ navigation }: { navigation: any }) {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const { t } = useTranslation();

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
    pincode: '', // Added pincode initialization
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
    if (localError) { setLocalError(''); }
    if (error) { dispatch(clearError()); }
  };

  const validate = () => {
    setLocalError('');
    if (!form.name.trim()) { return t('validation.fullNameRequired'); }

    const phone = form.phone.trim();
    if (!phone) { return t('validation.phoneRequired'); }
    if (!/^[6-9]\d{9}$/.test(phone)) { return t('validation.invalidPhone'); }

    if (!form.flat.trim()) { return t('validation.flatRequired'); }
    if (!form.society.trim()) { return t('validation.societyRequired'); }
    if (!form.village.trim()) { return t('validation.villageRequired'); }
    if (!form.tal.trim()) { return t('validation.talRequired'); }
    if (!form.dist.trim()) { return t('validation.districtRequired'); }
    if (!form.state.trim()) { return t('validation.stateRequired'); }

    // Added pincode validation
    if (!form.pincode.trim()) { return t('validation.pincodeRequired'); }
    if (!/^\d{6}$/.test(form.pincode.trim())) { return t('validation.invalidPincode'); }

    if (!form.password) { return t('validation.passwordRequired'); }
    if (form.password.length < 6) { return t('validation.passwordMinLength'); }
    if (form.password !== form.confirmPassword) { return t('validation.passwordMismatch1'); }

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
      const payload: DistributorPayload = {
        full_name: form.name,
        phone_number: form.phone.trim() ? `+91${form.phone.trim()}` : undefined,
        flat_house: form.flat.trim(),
        society_name: form.society.trim(),
        village: form.village.trim(),
        tal: form.tal.trim(),
        dist: form.dist.trim(),
        state: form.state.trim(),
        pincode: form.pincode.trim(),
        password: form.password,
        confirm_password: form.confirmPassword,
      };

      const result = await dispatch(registerDistributor(payload));
      if (registerDistributor.fulfilled.match(result)) {
        Alert.alert(t('registration.registrationSuccessful'), t('registration.distributorRegistrationSuccess'), [
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
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Icon name="arrow-left" size={32} color="#333" />
              </TouchableOpacity>
              <Text style={styles.title}>{t('registration.distributorRegistration')}</Text>
            </View>

            {displayError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{displayError}</Text>
              </View>
            ) : null}

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
              <Text style={styles.label}>{t('registration.confirmPassword')}<Text style={styles.required}> *</Text></Text>
              <View style={styles.inputBoxRelative}>
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  value={form.confirmPassword}
                  onChangeText={text => handleInputChange('confirmPassword', text)}
                  placeholder={t('registration.reEnterPassword')}
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

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
              <Text style={styles.buttonText}>
                {isLoading ? t('registration.registering') : t('registration.register')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
}