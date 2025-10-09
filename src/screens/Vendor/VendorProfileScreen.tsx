
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
  fetchVendorProfile,
  updateVendorProfileData,
  clearError,
  clearSuccess,
  resetVendorProfileState,
} from '../../store/vendorProfileSlice';
import { logout } from '../../store/authSlice';

const VendorProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const { profile, loading, updating, error, success } = useSelector(
    (state: RootState) => state.vendorProfile || {
      profile: null,
      loading: false,
      updating: false,
      error: null,
      success: false,
    }
  );

  const toStringSafe = (val: any): string => {
    if (typeof val === 'string') {return val;}
    if (typeof val === 'number') {return val.toString();}
    return '';
  };

  const [form, setForm] = useState({
    name: '',
    email: '',
    contact: '',
    flat_house: '',
    society_area: '',
    village: '',
    tal: '',
    dist: '',
    state: '',
    pincode: '',
    buffalo_milk_litre: '',
    br: '',
    gir_cow_milk_litre: '',
    gir_cow_rate: '',
    jarshi_cow_milk_litre: '',
    jarshi_cow_rate: '',
    deshi_milk_litre: '',
    deshi_cow_rate: '',
    cr: '',
  });

  useEffect(() => {
    if (user?.userID) {
      console.log('🔍 Fetching profile for vendor ID:', user.userID);
      dispatch(fetchVendorProfile(user.userID));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (profile) {
      console.log('📦 Raw Profile Response:', JSON.stringify(profile, null, 2));

      let data = profile;

      if (profile.data) {
        data = profile.data;
      }

      if (data.data) {
        data = data.data;
      }

      console.log('📋 Final Data Object:', JSON.stringify(data, null, 2));

      const formData = {
        name: toStringSafe(data.name),
        email: toStringSafe(data.email),
        contact: toStringSafe(data.contact),
        flat_house: toStringSafe(data.flat_house),
        society_area: toStringSafe(data.society_area),
        village: toStringSafe(data.village),
        tal: toStringSafe(data.tal),
        dist: toStringSafe(data.dist),
        state: toStringSafe(data.state),
        pincode: toStringSafe(data.pincode),
        buffalo_milk_litre: toStringSafe(data.buffalo_milk_litre),
        br: toStringSafe(data.br),
        gir_cow_milk_litre: toStringSafe(data.gir_cow_milk_litre),
        gir_cow_rate: toStringSafe(data.gir_cow_rate),
        jarshi_cow_milk_litre: toStringSafe(data.jarshi_cow_milk_litre),
        jarshi_cow_rate: toStringSafe(data.jarshi_cow_rate),
        deshi_milk_litre: toStringSafe(data.deshi_milk_litre),
        deshi_cow_rate: toStringSafe(data.deshi_cow_rate),
        cr: toStringSafe(data.cr),
      };

      console.log('✅ Form Data to Set:', formData);
      setForm(formData);
    }
  }, [profile]);

  useEffect(() => {
    if (success) {
      Alert.alert('Success', 'Profile updated successfully!');
      dispatch(clearSuccess());
      if (user?.userID) {
        dispatch(fetchVendorProfile(user.userID));
      }
    }
  }, [success, dispatch, user]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!form.name.trim()) {return 'Name is required';}
    if (form.name.length > 100) {return 'Name must be under 100 characters';}
    if (!form.contact.trim()) {return 'Contact is required';}
    if (form.contact.length !== 10) {return 'Contact must be exactly 10 digits';}
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {return 'Invalid email format';}
    if (form.email.length > 255) {return 'Email must be under 255 characters';}
    if (form.flat_house.length > 100) {return 'Flat/House must be under 100 characters';}
    if (form.society_area.length > 100) {return 'Society area must be under 100 characters';}
    if (form.village.length > 100) {return 'Village must be under 100 characters';}
    if (form.tal.length > 100) {return 'Taluka must be under 100 characters';}
    if (form.dist.length > 100) {return 'District must be under 100 characters';}
    if (form.state.length > 100) {return 'State must be under 100 characters';}
    if (form.pincode.trim() && form.pincode.length !== 6) {return 'Pincode must be exactly 6 digits';}
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
      name: form.name,
      email: form.email || '',
      contact: form.contact,
      flat_house: form.flat_house || '',
      society_area: form.society_area || '',
      village: form.village || '',
      tal: form.tal || '',
      dist: form.dist || '',
      state: form.state || '',
      pincode: form.pincode ? parseInt(form.pincode, 10) : undefined,
      buffalo_milk_litre: form.buffalo_milk_litre ? parseInt(form.buffalo_milk_litre, 10) : undefined,
      br: form.br || '',
      gir_cow_milk_litre: form.gir_cow_milk_litre ? parseInt(form.gir_cow_milk_litre, 10) : undefined,
      gir_cow_rate: form.gir_cow_rate || '',
      jarshi_cow_milk_litre: form.jarshi_cow_milk_litre ? parseInt(form.jarshi_cow_milk_litre, 10) : undefined,
      jarshi_cow_rate: form.jarshi_cow_rate || '',
      deshi_milk_litre: form.deshi_milk_litre ? parseInt(form.deshi_milk_litre, 10) : undefined,
      deshi_cow_rate: form.deshi_cow_rate || '',
      cr: form.cr || '',
    };

    console.log('📤 Sending data:', submitData);
    dispatch(updateVendorProfileData({ id: user.userID, data: submitData }));
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'userInfo']);
            dispatch(resetVendorProfileState());
            dispatch(logout());
            if (navigation) {
              navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
            }
          } catch (error) {
            Alert.alert('Error', 'Failed to logout. Please try again.');
          }
        },
      },
    ]);
  };

  if (loading && !form.name) {
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
        <Text style={styles.subheading}>Update your business information</Text>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.title}>Personal Information</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            value={form.name}
            onChangeText={(v) => handleChange('name', v)}
            maxLength={100}
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="call-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Contact *"
            value={form.contact}
            onChangeText={(v) => handleChange('contact', v)}
            maxLength={10}
            keyboardType="phone-pad"
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
            maxLength={255}
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
            placeholder="Society Area"
            value={form.society_area}
            onChangeText={(v) => handleChange('society_area', v)}
            maxLength={100}
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="map-outline" size={20} color="#666" style={styles.icon} />
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
          <Ionicons name="navigate-outline" size={20} color="#666" style={styles.icon} />
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
          <Ionicons name="keypad-outline" size={20} color="#666" style={styles.icon} />
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

      {/* Buffalo Milk Details */}
      <View style={styles.section}>
        <Text style={styles.title}>Buffalo Milk</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="water-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Buffalo Milk Litre"
            value={form.buffalo_milk_litre}
            onChangeText={(v) => handleChange('buffalo_milk_litre', v)}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="cash-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Buffalo Rate (BR)"
            value={form.br}
            onChangeText={(v) => handleChange('br', v)}
            keyboardType="decimal-pad"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Gir Cow Milk Details */}
      <View style={styles.section}>
        <Text style={styles.title}>Gir Cow Milk</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="water-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Gir Cow Milk Litre"
            value={form.gir_cow_milk_litre}
            onChangeText={(v) => handleChange('gir_cow_milk_litre', v)}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="cash-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Gir Cow Rate"
            value={form.gir_cow_rate}
            onChangeText={(v) => handleChange('gir_cow_rate', v)}
            keyboardType="decimal-pad"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Jarshi Cow Milk Details */}
      <View style={styles.section}>
        <Text style={styles.title}>Jarshi Cow Milk</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="water-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Jarshi Cow Milk Litre"
            value={form.jarshi_cow_milk_litre}
            onChangeText={(v) => handleChange('jarshi_cow_milk_litre', v)}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="cash-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Jarshi Cow Rate"
            value={form.jarshi_cow_rate}
            onChangeText={(v) => handleChange('jarshi_cow_rate', v)}
            keyboardType="decimal-pad"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Deshi Cow Milk Details */}
      <View style={styles.section}>
        <Text style={styles.title}>Deshi Cow Milk</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="water-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Deshi Milk Litre"
            value={form.deshi_milk_litre}
            onChangeText={(v) => handleChange('deshi_milk_litre', v)}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="cash-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Deshi Cow Rate"
            value={form.deshi_cow_rate}
            onChangeText={(v) => handleChange('deshi_cow_rate', v)}
            keyboardType="decimal-pad"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Commission Rate */}
      <View style={styles.section}>
        <Text style={styles.title}>Commission</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="trending-up-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Commission Rate (CR)"
            value={form.cr}
            onChangeText={(v) => handleChange('cr', v)}
            keyboardType="decimal-pad"
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

export default VendorProfileScreen;
