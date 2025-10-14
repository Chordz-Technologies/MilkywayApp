import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
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
} from '../../store/consumerProfileSlice';
import { logout } from '../../store/authSlice';

const ConsumerProfileEditScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  // Fixed selectors - each selector returns only what it needs
  const profile = useSelector((state: RootState) => state.consumerProfile?.profile);
  const loading = useSelector((state: RootState) => state.consumerProfile?.loading || false);
  const updating = useSelector((state: RootState) => state.consumerProfile?.updating || false);
  const error = useSelector((state: RootState) => state.consumerProfile?.error);
  const success = useSelector((state: RootState) => state.consumerProfile?.success || false);

const toStringSafe = (val: any): string => {
  if (typeof val === 'string') {return val;}
  if (typeof val === 'number') {return val.toString();}
  return '';
};  const toNumberSafe = (val: any): number => (typeof val === 'number' ? val : 0);

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
    if (!form.first_name.trim()) {return 'First name is required';}
    if (!form.last_name.trim()) {return 'Last name is required';}
    if (form.first_name.length > 100) {return 'First name must be under 100 characters';}
    if (form.last_name.length > 100) {return 'Last name must be under 100 characters';}
    if (form.email && !form.email.includes('@')) {return 'Please enter a valid email';}
    if (form.flat_no.length > 50) {return 'Flat no must be under 50 characters';}
    if (form.society_name.length > 200) {return 'Society name must be under 200 characters';}
    if (form.village.length > 100) {return 'Village must be under 100 characters';}
    if (form.tal.length > 100) {return 'Tal must be under 100 characters';}
    if (form.dist.length > 100) {return 'District must be under 100 characters';}
    if (form.state.length > 100) {return 'State must be under 100 characters';}
    if (form.pincode.trim() && form.pincode.length !== 6) {return 'Pincode must be exactly 6 digits';}

    // Validate milk quantities
    if (form.cow_milk_litre && isNaN(Number(form.cow_milk_litre))) {return 'Cow milk quantity must be a number';}
    if (form.buffalo_milk_litre && isNaN(Number(form.buffalo_milk_litre))) {return 'Buffalo milk quantity must be a number';}

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

  if (loading && !form.first_name && !form.last_name) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loading}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      {/* Simple Header */}
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={60} color="#007AFF" />
        <Text style={styles.heading}>Edit Profile</Text>
        <Text style={styles.subheading}>Update your information</Text>
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
              />
              <Text style={styles.unitText}>Litres</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.button, (updating || loading) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={updating || loading}
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

      {/* Bottom Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#dc3545" style={{ marginRight: 8 }} />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
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
});

export default ConsumerProfileEditScreen;
