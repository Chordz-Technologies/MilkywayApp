
// export default DistributorProfileScreen;
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
import { RootState, AppDispatch } from '../../store/index';
import {
  fetchDistributorProfile,
  updateDistributorProfile,
  clearError,
  clearSuccess,
} from '../../store/distributorProfileSlice';

const DistributorProfileScreen = () => {
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
      Alert.alert('Success', 'Profile updated successfully');
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
    if (form.full_name.length > 100) {return 'Full name must be under 100 characters';}
    if (form.flat_house.length > 100) {return 'Flat House must be under 100 characters';}
    if (form.society_name.length > 255) {return 'Society Name must be under 255 characters';}
    if (form.village.length > 100) {return 'Village must be under 100 characters';}
    if (form.tal.length > 100) {return 'Tal must be under 100 characters';}
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
      Alert.alert('Error', 'User ID not found');
      return;
    }
    const submitData = {
      ...form,
      provider: typeof form.provider === 'string' ? Number(form.provider) : form.provider,
    };
    dispatch(updateDistributorProfile({ id: user.userID, data: submitData }));
  };

  if (loading && !form.full_name) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="person-circle-outline" size={60} color="#007AFF" />
        <Text style={styles.heading}>Edit Profile</Text>
        <Text style={styles.subheading}>Update your information below</Text>
      </View>
      {/* Personal Info */}
      <View style={styles.section}>
        <Text style={styles.title}>Personal Information</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={form.full_name}
            onChangeText={(v) => handleChange('full_name', v)}
            maxLength={100}
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
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="map-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Tal"
            value={form.tal}
            onChangeText={(v) => handleChange('tal', v)}
            maxLength={100}
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
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, updating && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={updating}
      >
        {updating ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.buttonText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subheading: {
    color: '#666',
    fontSize: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#555',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    fontSize: 18,
    height: 40,
    flex: 1,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 6,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default DistributorProfileScreen;
