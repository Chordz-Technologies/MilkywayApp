import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView, Alert, Platform, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, Modal } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootState, AppDispatch } from '../../store';
import {
  fetchConsumerProfile,
  updateConsumerProfile,
  clearError,
  clearSuccess,
  resetConsumerProfileState,
  deleteConsumerAccount
} from '../../store/consumerProfileSlice';
import { logout } from '../../store/authSlice';
import { changePassword } from '../../apiServices/allApi';
import SafeAreaWrapper from '../../styles/SafeAreaWrapper';

const ConsumerProfileEditScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fixed selectors - each selector returns only what it needs
  const profile = useSelector((state: RootState) => state.consumerProfile?.profile);
  const loading = useSelector((state: RootState) => state.consumerProfile?.loading || false);
  const updating = useSelector((state: RootState) => state.consumerProfile?.updating || false);
  const deleting = useSelector((state: RootState) => state.consumerProfile?.deleting || false);
  const error = useSelector((state: RootState) => state.consumerProfile?.error);
  const success = useSelector((state: RootState) => state.consumerProfile?.success || false);
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

  const toStringSafe = (val: any): string => {
    if (typeof val === 'string') { return val; }
    if (typeof val === 'number') { return val.toString(); }
    return '';
  }; const toNumberSafe = (val: any): number => (typeof val === 'number' ? val : 0);

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    flat_no: '',
    society_name: '',
    village: '',
    tal: '',
    dist: '',
    state: '',
    provider: 0,
    milkman: 0,
    cow_milk_litre: '',
    buffalo_milk_litre: '',
    pincode: '',
  });

  useEffect(() => {
    if (user?.userID) {
      dispatch(fetchConsumerProfile(user.userID));
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
        first_name: toStringSafe(data.first_name),
        last_name: toStringSafe(data.last_name),
        email: toStringSafe(data.email),
        flat_no: toStringSafe(data.flat_no),
        society_name: toStringSafe(data.society_name),
        village: toStringSafe(data.village),
        tal: toStringSafe(data.tal),
        dist: toStringSafe(data.dist),
        state: toStringSafe(data.state),
        provider: toNumberSafe(data.provider),
        milkman: toNumberSafe(data.milkman),
        cow_milk_litre: toStringSafe(data.cow_milk_litre),
        buffalo_milk_litre: toStringSafe(data.buffalo_milk_litre),
        pincode: toStringSafe(data.pincode),
      });
    }
  }, [profile]);

  useEffect(() => {
    if (success) {
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditMode(false);
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (key: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!form.first_name.trim()) { return 'First name is required'; }
    if (!form.last_name.trim()) { return 'Last name is required'; }
    if (form.first_name.length > 100) { return 'First name must be under 100 characters'; }
    if (form.last_name.length > 100) { return 'Last name must be under 100 characters'; }
    if (form.email && !form.email.includes('@')) { return 'Please enter a valid email'; }
    if (form.flat_no.length > 50) { return 'Flat no must be under 50 characters'; }
    if (form.society_name.length > 200) { return 'Society name must be under 200 characters'; }
    if (form.village.length > 100) { return 'Village must be under 100 characters'; }
    if (form.tal.length > 100) { return 'Tal must be under 100 characters'; }
    if (form.dist.length > 100) { return 'District must be under 100 characters'; }
    if (form.state.length > 100) { return 'State must be under 100 characters'; }
    if (form.pincode.trim() && form.pincode.length !== 6) { return 'Pincode must be exactly 6 digits'; }

    // Validate milk quantities
    if (form.cow_milk_litre && isNaN(Number(form.cow_milk_litre))) { return 'Cow milk quantity must be a number'; }
    if (form.buffalo_milk_litre && isNaN(Number(form.buffalo_milk_litre))) { return 'Buffalo milk quantity must be a number'; }

    return null;
  };

  const handleSubmit = () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Validation Error', validationError);
      return;
    }

    if (!user?.userID) {
      Alert.alert('Error', 'User session expired. Please login again.');
      return;
    }

    dispatch(updateConsumerProfile({ id: user.userID, data: form }));
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match');
      return;
    }

    setPasswordError('');

    try {
      setChangingPassword(true);

      await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });

      Alert.alert('Success', 'Password changed successfully');

      setShowChangePasswordModal(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (err: any) {
      setPasswordError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        'Failed to change password'
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
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

              // Reset consumer profile state
              dispatch(resetConsumerProfileState());

              // Dispatch logout action
              dispatch(logout());

              // Navigate to login (if navigation prop is available)
              if (navigation) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              }
            } catch (err) {
              console.error('Logout error:', err);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (!user?.userID) {
              Alert.alert("Error", "User not found.");
              return;
            }

            try {
              await dispatch(deleteConsumerAccount(user.userID)).unwrap();

              Alert.alert("Deleted", "Your account has been permanently deleted.");

              // Clear local storage
              await AsyncStorage.multiRemove([
                "userToken",
                "userID",
                "userRole",
                "userData",
              ]);

              await AsyncStorage.setItem('isLoggedOut', 'true');

              // Reset redux
              dispatch(resetConsumerProfileState());
              dispatch(logout());

              // Go to Login
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });

            } catch (err: any) {
              Alert.alert("Error", err || "Failed to delete account.");
            }
          },
        },
      ]
    );
  };

  if (loading && !form.first_name && !form.last_name) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loading}>Loading profile...</Text>
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
            {/* Simple Header */}
            <View style={styles.header}>
              <Ionicons name="person-circle-outline" size={60} color="#007AFF" />
              <Text style={styles.heading}>Edit Profile</Text>
              <Text style={styles.subheading}>Update your information</Text>
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
                <Text style={styles.editButtonText}>Change Password</Text>
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
                  {isEditMode ? 'Cancel' : 'Edit Profile'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Personal Information */}
            <View style={styles.section}>
              <Text style={styles.title}>Personal Information</Text>

              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="First Name *"
                  value={form.first_name}
                  onChangeText={(v) => handleChange('first_name', v)}
                  maxLength={100}
                  editable={isEditMode}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Last Name *"
                  value={form.last_name}
                  onChangeText={(v) => handleChange('last_name', v)}
                  maxLength={100}
                  editable={isEditMode}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={form.email}
                  onChangeText={(v) => handleChange('email', v)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                  editable={isEditMode}
                />
              </View>
            </View>

            {/* Address Information */}
            <View style={styles.section}>
              <Text style={styles.title}>Address</Text>

              <View style={styles.inputContainer}>
                <Ionicons name="home-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Flat/House No"
                  value={form.flat_no}
                  onChangeText={(v) => handleChange('flat_no', v)}
                  maxLength={50}
                  editable={isEditMode}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="business-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Society Name"
                  value={form.society_name}
                  onChangeText={(v) => handleChange('society_name', v)}
                  maxLength={200}
                  editable={isEditMode}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="business-outline" size={20} color="#666" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Village"
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
                  placeholder="Taluka"
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
                  placeholder="District"
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
                  placeholder="State"
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
                  placeholder="Pincode"
                  value={form.pincode}
                  onChangeText={(v) => handleChange('pincode', v)}
                  keyboardType="numeric"
                  maxLength={6}
                  editable={isEditMode}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            {/* Milk Requirements */}
            <View style={styles.section}>
              <Text style={styles.title}>Daily Milk Requirements</Text>

              <View style={styles.milkContainer}>
                <View style={styles.milkItem}>
                  <View style={styles.milkHeader}>
                    <Ionicons name="water-outline" size={24} color="#4CAF50" />
                    <Text style={styles.milkTitle}>Cow Milk</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.input, styles.milkInput]}
                      placeholder="0.0"
                      value={form.cow_milk_litre}
                      onChangeText={(v) => handleChange('cow_milk_litre', v)}
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                      editable={isEditMode}
                    />
                    <Text style={styles.unitText}>Litres</Text>
                  </View>
                </View>

                <View style={styles.milkItem}>
                  <View style={styles.milkHeader}>
                    <Ionicons name="water-outline" size={24} color="#FF9800" />
                    <Text style={styles.milkTitle}>Buffalo Milk</Text>
                  </View>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={[styles.input, styles.milkInput]}
                      placeholder="0.0"
                      value={form.buffalo_milk_litre}
                      onChangeText={(v) => handleChange('buffalo_milk_litre', v)}
                      keyboardType="decimal-pad"
                      placeholderTextColor="#999"
                      editable={isEditMode}
                    />
                    <Text style={styles.unitText}>Litres</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Save Button */}
            {isEditMode && (
              <TouchableOpacity
                style={[styles.button, updating && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={updating}
              >
                {updating ? (
                  <View style={styles.buttonContent}>
                    <ActivityIndicator color="#fff" size="small" style={{ marginRight: 10 }} />
                    <Text style={styles.buttonText}>Updating...</Text>
                  </View>
                ) : (
                  <Text style={styles.buttonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            )}

            {/* Bottom Logout Button */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={20} color="#dc3545" style={{ marginRight: 8 }} />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleDeleteAccount}
              disabled={deleting}   // ⬅ disable when deleting
            >
              {deleting ? (
                <ActivityIndicator size="small" color="#dc3545" style={{ marginRight: 8 }} />
              ) : (
                <Ionicons name="lock-closed-outline" size={20} color="#dc3545" style={{ marginRight: 8 }} />
              )}
              <Text style={styles.logoutButtonText}>
                {deleting ? "Deleting..." : "Delete Account"}
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

              <Text style={styles.modalTitle}>Change Password</Text>

              {/* Error Message */}
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}

              {/* Old Password */}
              <View style={styles.passwordInputWrapper}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Old Password"
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
                  placeholder="New Password"
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
                  placeholder="Confirm New Password"
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
                  <Text style={styles.modalButtonText}>Update Password</Text>
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
                <Text style={styles.cancelText}>Cancel</Text>
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
    fontSize: 16,
    color: '#666',
    marginTop: 5,
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
    paddingBottom: 8,
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
  milkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  milkItem: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  milkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  milkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  milkInput: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  unitText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
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

export default ConsumerProfileEditScreen;