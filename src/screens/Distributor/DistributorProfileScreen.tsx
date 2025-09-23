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
import { RootState, AppDispatch } from '../../store/index';
import {
  fetchDistributorProfile,
  updateDistributorProfile,
  clearError,
  clearSuccess,
  resetDistributorProfileState,
} from '../../store/distributorProfileSlice';
import { logout } from '../../store/authSlice';

const DistributorProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const { profile, loading, updating, error, success } = useSelector(
    (state: RootState) => state.profile || {
      profile: null,
      loading: false,
      updating: false,
      error: null,
      success: false,
    }
  );

  // Safely cast any value to string
  const toStringSafe = (val: any): string => (typeof val === 'string' ? val : '');

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
    if (!form.full_name.trim()) return 'Full name is required';
    if (form.full_name.length > 100) return 'Full name must be under 100 characters';
    if (form.flat_house.length > 100) return 'Flat House must be under 100 characters';
    if (form.society_name.length > 255) return 'Society Name must be under 255 characters';
    if (form.village.length > 100) return 'Village must be under 100 characters';
    if (form.tal.length > 100) return 'Tal must be under 100 characters';
    if (form.dist.length > 100) return 'District must be under 100 characters';
    if (form.state.length > 100) return 'State must be under 100 characters';
    if (form.pincode.trim() && form.pincode.length !== 6) return 'Pincode must be exactly 6 digits';
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
    const submitData = {
      ...form,
      provider: typeof form.provider === 'string' ? Number(form.provider) : form.provider,
    };
    dispatch(updateDistributorProfile({ id: user.userID, data: submitData }));
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              // Clear AsyncStorage
              await AsyncStorage.multiRemove([
                'userToken',
                'userID', 
                'userRole',
                'userData'
              ]);
              
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
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          }
        }
      ]
    );
  };

  if (loading && !form.full_name) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loading}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={60} color="#007AFF" />
        <Text style={styles.heading}>Edit Profile</Text>
        <Text style={styles.subheading}>Update your information</Text>
      </View>

      {/* Personal Info */}
      <View style={styles.section}>
        <Text style={styles.title}>Personal Information</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            value={form.full_name}
            onChangeText={(v) => handleChange('full_name', v)}
            maxLength={100}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Address Info */}
      <View style={styles.section}>
        <Text style={styles.title}>Address</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="home-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Flat/House"
            value={form.flat_house}
            onChangeText={(v) => handleChange('flat_house', v)}
            maxLength={100}
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
            maxLength={255}
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
            maxLength={6}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>
      </View>

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
});

export default DistributorProfileScreen;
