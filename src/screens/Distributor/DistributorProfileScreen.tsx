import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Alert, Platform, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState, AppDispatch } from '../../store/index';
import { fetchDistributorProfile, updateDistributorProfile, clearError, clearSuccess, resetDistributorProfileState, deleteDistributorAccount, } from '../../store/distributorProfileSlice';
import { logout } from '../../store/authSlice';
import { changePassword } from '../../apiServices/allApi';
import SafeAreaWrapper from '../../styles/SafeAreaWrapper';
import { useTranslation } from '../../i18n/LanguageProvider';

const DistributorProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditMode, setIsEditMode] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const { profile, loading, updating, deleting, error, success } = useSelector(
    (state: RootState) => state.profile || {
      profile: null,
      loading: false,
      updating: false,
      deleting: false,
      error: null,
      success: false,
    }
  );

  // Safely cast any value to string
  const toStringSafe = (val: any): string => {
    if (typeof val === 'string') { return val; }
    if (typeof val === 'number') { return val.toString(); }
    return '';
  };

  const [form, setForm] = useState({
    full_name: '',
    flat_house: '',
    society_name: '',
    village: '',
    tal: '',
    dist: '',
    state: '',
    pincode: '',
    provider: 0,
  });

  useEffect(() => {
    if (user?.userID) {
      dispatch(fetchDistributorProfile(user.userID));
    }
  }, [dispatch, user]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setIsEditMode(false);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (profile) {
      const data = profile.data || profile;
      setForm({
        full_name: toStringSafe(data.full_name),
        flat_house: toStringSafe(data.flat_house),
        society_name: toStringSafe(data.society_name),
        village: toStringSafe(data.village),
        tal: toStringSafe(data.tal),
        dist: toStringSafe(data.dist),
        state: toStringSafe(data.state),
        pincode: toStringSafe(data.pincode),
        provider: data.provider || 0,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (success) {
      Alert.alert(t('common.success'), t('profile.profileUpdated'));
      setIsEditMode(false);
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert(t('common.error'), error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (key: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!form.full_name.trim()) { return t('validation.fullNameRequired'); }
    if (form.full_name.length > 100) { return t('validation.fullNameLength'); }
    if (form.flat_house.length > 100) { return t('validation.flatHouseLength'); }
    if (form.society_name.length > 200) { return t('validation.societyLength'); }
    if (form.village.length > 100) { return t('validation.villageLength'); }
    if (form.tal.length > 100) { return t('validation.talukaLength'); }
    if (form.dist.length > 100) { return t('validation.districtLength'); }
    if (form.state.length > 100) { return t('validation.stateLength'); }
    if (form.pincode.trim() && form.pincode.length !== 6) { return t('validation.pincodeLength'); }
    return null;
  };

  const handleSubmit = () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert(t('common.validationError'), validationError);
      return;
    }
    if (!user?.userID) {
      Alert.alert(t('common.error'), t('validation.sessionExpired'));
      return;
    }
    const submitData = {
      ...form,
      provider: typeof form.provider === 'string' ? Number(form.provider) : form.provider,
    };
    dispatch(updateDistributorProfile({ id: user.userID, data: submitData }));
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError(t('validation.allFieldsRequired'));
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError(t('validation.passwordLength'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('validation.passwordMismatch'));
      return;
    }

    setPasswordError('');

    try {
      setChangingPassword(true);

      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });

      Alert.alert(t('common.success'), t('profile.passwordChanged'));

      setShowChangePasswordModal(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err: any) {
      setPasswordError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        t('validation.passwordChangeFailed')
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('common.logout'), t('common.confirmlogout'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('common.logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear AsyncStorage
              await AsyncStorage.multiRemove([
                'userToken',
                'userID',
                'userRole',
                'userData',
              ]);

              await AsyncStorage.setItem('isLoggedOut', 'true');

              // Reset distributor profile state
              dispatch(resetDistributorProfileState());

              // Dispatch logout action
              dispatch(logout());

              // Navigate to login (if navigation prop is available)
              if (navigation) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              }
            } catch (error) {
              Alert.alert(t('common.error'), t('profile.logoutFailed'));
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('profile.deleteAccount'), t('profile.confirmDelete'),
      [
        {
          text: t('common.cancel'),
          style: "cancel",
        },
        {
          text: t('common.delete'),
          style: "destructive",
          onPress: async () => {
            if (!user?.userID) {
              Alert.alert(t('common.error'), t('common.userNotFound'));
              return;
            }

            try {
              await dispatch(deleteDistributorAccount(user.userID)).unwrap();

              Alert.alert(t('common.deleted'), t('common.deletedAccount'));

              // Clear local storage
              await AsyncStorage.multiRemove([
                "userToken",
                "userID",
                "userRole",
                "userData",
              ]);

              await AsyncStorage.setItem('isLoggedOut', 'true');

              // Reset redux
              dispatch(resetDistributorProfileState());
              dispatch(logout());

              // Go to Login
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });

            } catch (err: any) {
              Alert.alert(t('common.error'), err || t('common.failedToDelete'));
            }
          },
        },
      ]
    );
  };

  if (loading && !form.full_name) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loading}>{t('profile.loadingProfile')}</Text>
      </View>
    );
  }

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
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              styles.container,
              { flexGrow: 1, paddingBottom: 85 }
            ]}
          >
            <View style={styles.header}>
              <Ionicons name="person-circle-outline" size={60} color="#007AFF" />
              <Text style={styles.heading}>{t('profile.editProfile')}</Text>
              <Text style={styles.subheading}>{t('profile.updateInformation')}</Text>
            </View>

            {/* Action Buttons Row */}
            <View style={styles.actionRow}>
              {/* Change Password - LEFT */}
              <TouchableOpacity
                style={[styles.editButton, styles.leftButton]}
                onPress={() => setShowChangePasswordModal(true)}
              >
                <Ionicons
                  name="key-outline"
                  size={20}
                  color="#007AFF"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.editButtonText}>{t('profile.changePassword')}</Text>
              </TouchableOpacity>

              {/* Edit Profile - RIGHT */}
              <TouchableOpacity
                style={[styles.editButton, styles.rightButton]}
                onPress={() => setIsEditMode(!isEditMode)}
              >
                <Ionicons
                  name={isEditMode ? 'close-outline' : 'pencil-outline'}
                  size={20}
                  color="#007AFF"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.editButtonText}>
                  {isEditMode ? t('common.cancel') : t('profile.edit')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Personal Info */}
            <View style={styles.section}>
              <Text style={styles.title}>{t('profile.personalInformation')}</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('profile.fullName')}
                  value={form.full_name}
                  onChangeText={(v) => handleChange('full_name', v)}
                  maxLength={100}
                  editable={isEditMode}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Address Info */}
            <View style={styles.section}>
              <Text style={styles.title}>{t('profile.address')}</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="home-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('profile.flatNo')}
                  value={form.flat_house}
                  onChangeText={(v) => handleChange('flat_house', v)}
                  maxLength={100}
                  editable={isEditMode}
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="business-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('profile.societyName')}
                  value={form.society_name}
                  onChangeText={(v) => handleChange('society_name', v)}
                  maxLength={255}
                  editable={isEditMode}
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="business-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('profile.village')}
                  value={form.village}
                  onChangeText={(v) => handleChange('village', v)}
                  maxLength={100}
                  editable={isEditMode}
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="map-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('profile.taluka')}
                  value={form.tal}
                  onChangeText={(v) => handleChange('tal', v)}
                  maxLength={100}
                  editable={isEditMode}
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('profile.district')}
                  value={form.dist}
                  onChangeText={(v) => handleChange('dist', v)}
                  maxLength={100}
                  editable={isEditMode}
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="flag-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('profile.state')}
                  value={form.state}
                  onChangeText={(v) => handleChange('state', v)}
                  maxLength={100}
                  editable={isEditMode}
                  placeholderTextColor="#999"
                />
              </View>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder={t('profile.pincode')}
                  value={form.pincode}
                  onChangeText={(v) => handleChange('pincode', v)}
                  maxLength={6}
                  editable={isEditMode}
                  keyboardType="numeric"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {isEditMode && (
              <TouchableOpacity
                style={[styles.button, updating && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={updating}
              >
                {updating ? (
                  <View style={styles.buttonContent}>
                    <ActivityIndicator color="#fff" size="small" style={{ marginRight: 10 }} />
                    <Text style={styles.buttonText}>{t('profile.updating')}</Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>{t('profile.saveChanges')}</Text>
                )}
              </TouchableOpacity>
            )}

            {/* Bottom Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#dc3545" style={{ marginRight: 8 }} />
              <Text style={styles.logoutButtonText}>{t('profile.logout')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleDeleteAccount}
              disabled={deleting}   // disable when deleting
            >
              {deleting ? (
                <ActivityIndicator size="small" color="#dc3545" style={{ marginRight: 8 }} />
              ) : (
                <Ionicons name="lock-closed-outline" size={20} color="#dc3545" style={{ marginRight: 8 }} />
              )}
              <Text style={styles.logoutButtonText}>
                {deleting ? t('profile.deleting') : t('profile.deleteAccount')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Change Password Modal */}
      <Modal visible={showChangePasswordModal} animationType="slide" transparent>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>

              <Text style={styles.modalTitle}>{t('profile.changePassword')}</Text>

              {/* Error Message */}
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}

              {/* Old Password */}
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t('profile.oldPassword')}
                  secureTextEntry={!showOldPassword}
                  value={oldPassword}
                  onChangeText={(v) => {
                    setOldPassword(v);
                    setPasswordError('');
                  }}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
                  <Ionicons
                    name={showOldPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              {/* New Password */}
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t('profile.newPassword')}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={(v) => {
                    setNewPassword(v);
                    setPasswordError('');
                  }}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Ionicons
                    name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              {/* Confirm Password */}
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder={t('profile.confirmPassword')}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={(v) => {
                    setConfirmPassword(v);
                    setPasswordError('');
                  }}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              {/* Submit */}
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleChangePassword}
                disabled={changingPassword}
              >
                {changingPassword ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>{t('profile.updatePassword')}</Text>
                )}
              </TouchableOpacity>

              {/* Cancel */}
              <TouchableOpacity
                onPress={() => {
                  setShowChangePasswordModal(false);
                  setPasswordError('');
                }}
                style={{ marginTop: 20 }}
              >
                <Text style={styles.cancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loading: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  subheading: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  leftButton: {
    alignSelf: 'flex-start',
  },
  rightButton: {
    alignSelf: 'flex-end',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#E9F2FF',
    borderRadius: 8,
    marginBottom: 10,
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
    paddingBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#e1e5e9',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    minHeight: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dc3545',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  cancelText: {
    color: '#dc3545',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DistributorProfileScreen;
