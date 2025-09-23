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
  fetchVendorProfile,
  updateVendorProfile,
  clearError,
  clearSuccess,
} from '../../store/vendorProfileSlice';

const VendorProfileEditScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);

  const { profile, loading, updating, error, success } = useSelector(
    (state: RootState) => state.vendorProfile
  );

  const toStringSafe = (val: any): string => (typeof val === 'string' ? val : '');
  const toNumberSafe = (val: any): number => (typeof val === 'number' ? val : 0);

  const [form, setForm] = useState({
    name: '',
    flat_house: '',
    society_area: '',
    village: '',
    tal: '',
    dist: '',
    state: '',
    buffalo_milk_litre: 0,
    br: '',
    gir_cow_milk_litre: 0,
    jarshi_cow_milk_litre: 0,
    deshi_milk_litre: 0,
    gir_cow_rate: '',
    jarshi_cow_rate: '',
    deshi_cow_rate: '',
    cr: '',
    email: '',
    pincode: '',
  });

  useEffect(() => {
    if (user?.userID) {
      dispatch(fetchVendorProfile(user.userID));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (profile) {
      const data = profile.data || profile;
      setForm({
        name: toStringSafe(data.name),
        flat_house: toStringSafe(data.flat_house),
        society_area: toStringSafe(data.society_area),
        village: toStringSafe(data.village),
        tal: toStringSafe(data.tal),
        dist: toStringSafe(data.dist),
        state: toStringSafe(data.state),
        buffalo_milk_litre: toNumberSafe(data.buffalo_milk_litre),
        br: toStringSafe(data.br),
        gir_cow_milk_litre: toNumberSafe(data.gir_cow_milk_litre),
        jarshi_cow_milk_litre: toNumberSafe(data.jarshi_cow_milk_litre),
        deshi_milk_litre: toNumberSafe(data.deshi_milk_litre),
        gir_cow_rate: toStringSafe(data.gir_cow_rate),
        jarshi_cow_rate: toStringSafe(data.jarshi_cow_rate),
        deshi_cow_rate: toStringSafe(data.deshi_cow_rate),
        cr: toStringSafe(data.cr),
        email: toStringSafe(data.email),
        pincode: toStringSafe(data.pincode),
      });
    }
  }, [profile]);

  useEffect(() => {
    if (success) {
      Alert.alert('Success', 'Vendor profile updated successfully');
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
    if (form.name.length > 100) {return 'Name must be under 100 characters';}
    if (form.flat_house.length > 100) {return 'Flat/House must be under 100 characters';}
    if (form.society_area.length > 100) {return 'Society/Area must be under 100 characters';}
    if (form.village.length > 100) {return 'Village must be under 100 characters';}
    if (form.tal.length > 100) {return 'Tal must be under 100 characters';}
    if (form.dist.length > 100) {return 'District must be under 100 characters';}
    if (form.state.length > 100) {return 'State must be under 100 characters';}
    if (form.email && !form.email.includes('@')) {return 'Invalid email format';}
    if (form.pincode.trim() && form.pincode.length !== 6) {return 'Pincode must be 6 digits';}
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

    dispatch(updateVendorProfile({ id: user.userID, data: form }));
  };

  if (loading && !form.name) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loading}>Loading vendor profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Ionicons name="storefront-outline" size={60} color="#007AFF" />
        <Text style={styles.heading}>Edit Vendor Profile</Text>
        <Text style={styles.subheading}>Update your business information</Text>
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={styles.title}>Personal Information</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={form.name}
            onChangeText={(v) => handleChange('name', v)}
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
          <Ionicons name="location-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Society/Area"
            value={form.society_area}
            onChangeText={(v) => handleChange('society_area', v)}
            maxLength={100}
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
            placeholder="Tal"
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

      {/* Milk Details */}
      <View style={styles.section}>
        <Text style={styles.title}>Milk Details</Text>

        {/* Buffalo Milk */}
        <Text style={styles.subTitle}>Buffalo Milk</Text>
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Ionicons name="water-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Litres"
              value={form.buffalo_milk_litre.toString()}
              onChangeText={(v) => handleChange('buffalo_milk_litre', Number(v) || 0)}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Ionicons name="cash-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="BR Rate"
              value={form.br}
              onChangeText={(v) => handleChange('br', v)}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Gir Cow Milk */}
        <Text style={styles.subTitle}>Gir Cow Milk</Text>
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Ionicons name="water-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Litres"
              value={form.gir_cow_milk_litre.toString()}
              onChangeText={(v) => handleChange('gir_cow_milk_litre', Number(v) || 0)}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Ionicons name="cash-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Rate"
              value={form.gir_cow_rate}
              onChangeText={(v) => handleChange('gir_cow_rate', v)}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Jarshi Cow Milk */}
        <Text style={styles.subTitle}>Jarshi Cow Milk</Text>
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Ionicons name="water-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Litres"
              value={form.jarshi_cow_milk_litre.toString()}
              onChangeText={(v) => handleChange('jarshi_cow_milk_litre', Number(v) || 0)}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Ionicons name="cash-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Rate"
              value={form.jarshi_cow_rate}
              onChangeText={(v) => handleChange('jarshi_cow_rate', v)}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Deshi Milk */}
        <Text style={styles.subTitle}>Deshi Milk</Text>
        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Ionicons name="water-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Litres"
              value={form.deshi_milk_litre.toString()}
              onChangeText={(v) => handleChange('deshi_milk_litre', Number(v) || 0)}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Ionicons name="cash-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Rate"
              value={form.deshi_cow_rate}
              onChangeText={(v) => handleChange('deshi_cow_rate', v)}
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* CR Field */}
        <View style={styles.inputContainer}>
          <Ionicons name="document-text-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="CR"
            value={form.cr}
            onChangeText={(v) => handleChange('cr', v)}
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
  subTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 10,
    marginTop: 10,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default VendorProfileEditScreen;
