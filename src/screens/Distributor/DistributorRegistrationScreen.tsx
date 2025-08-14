import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../../styles/RegisterStyles';
import { useDispatch, useSelector } from 'react-redux';
import { registerDistributor, clearError } from '../../store/authSlice';
import { RootState, AppDispatch } from '../../store';

interface DistributorPayload {
    full_name: string;
    phone_number?: string;
    address: string;
    society_name: string;
    password: string;
    confirm_password: string;
}

export default function DistributorRegistrationScreen({ navigation }: { navigation: any }) {
    const dispatch = useDispatch<AppDispatch>();

    // Redux state - replaces local isLoading and error handling
    const { isLoading, error } = useSelector((state: RootState) => state.auth);

    const scrollRef = useRef<ScrollView>(null);
    const [form, setForm] = useState({
        name: '',
        phone: '',
        address: '',
        society: '',
        password: '',
        confirmPassword: '',
    });

    const [localError, setLocalError] = useState(''); // For validation errors
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Handle Redux errors
    useEffect(() => {
        if (error) {
            scrollRef.current?.scrollTo({ y: 0, animated: true });
        }
    }, [error]);

    // Clear errors when component unmounts or user starts typing
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleInputChange = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        // Clear errors when user starts typing
        if (localError) {setLocalError('');}
        if (error) {dispatch(clearError());}
    };

    const validate = () => {
        setLocalError('');
        if (!form.name.trim()) { return 'Full name is required'; }
        const phone = form.phone.trim();
        if (!phone) {
            return 'Phone number is required';
        }
        if (!/^\d{10}$/.test(phone)) {
            return 'Phone number must be exactly 10 digits';
        }
        if (!form.address.trim()) { return 'Address is required'; }
        if (!form.society.trim()) { return 'Society name is required'; }
        if (!form.password) { return 'Password is required'; }
        if (form.password.length < 6) { return 'Password must be at least 6 characters'; }
        if (form.password !== form.confirmPassword) { return 'Passwords do not match'; }
        return '';
    };

    const showSuccessAlert = (message: string) => {
        Alert.alert(
            'Registration Successful',
            `${message}\nYou will be redirected to Login.`,
            [
                {
                    text: 'OK',
                    onPress: () => navigation.replace('Login'),
                },
            ]
        );
    };

    const handleSubmit = async () => {
        if (isLoading) { return; }

        const validationError = validate();
        if (validationError) {
            setLocalError(validationError);
            scrollRef.current?.scrollTo({ y: 0, animated: true });
            return;
        }

        const payload: DistributorPayload = {
            full_name: form.name,
            phone_number: form.phone.trim() ? `+91${form.phone.trim()}` : undefined,
            address: form.address,
            society_name: form.society,
            password: form.password,
            confirm_password: form.confirmPassword,
        };

        try {
            // Dispatch Redux action instead of direct API call
            const result = await dispatch(registerDistributor(payload));

            // Check if registration was successful
            if (registerDistributor.fulfilled.match(result)) {
                showSuccessAlert('Distributor registration successful!');
            }
        } catch (err: any) {
            // Redux will handle the error, but we can add additional local handling if needed
            console.error('Registration error:', err);
        }
    };

    // Display error from Redux or local validation
    const displayError = error || localError;

    return (
        <ScrollView
            ref={scrollRef}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.titleRow}>
                <TouchableOpacity
                    style={styles.backArrow}
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Icon name="arrow-left" size={32} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>Distributor Registration</Text>
            </View>

            {displayError ? (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{displayError}</Text>
                </View>
            ) : null}

            <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name<Text style={styles.required}> *</Text></Text>
                <TextInput
                    style={styles.input}
                    value={form.name}
                    onChangeText={text => handleInputChange('name', text)}
                    placeholder="Enter full name"
                    placeholderTextColor="#888"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Phone Number<Text style={styles.required}> *</Text></Text>
                <View style={styles.phoneInputContainer}>
                    <Text style={styles.countryCode}>
                        +91
                    </Text>
                    <TextInput
                        style={[styles.input, styles.inputWithLeftPadding]}
                        value={form.phone}
                        onChangeText={(text) => {
                            const cleaned = text.replace(/\D/g, '').slice(0, 10);
                            handleInputChange('phone', cleaned);
                        }}
                        placeholder="Enter phone number"
                        keyboardType="number-pad"
                        maxLength={10}
                        placeholderTextColor="#888"
                    />
                </View>
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Address<Text style={styles.required}> *</Text></Text>
                <TextInput
                    style={styles.input}
                    value={form.address}
                    onChangeText={text => handleInputChange('address', text)}
                    placeholder="Enter address"
                    placeholderTextColor="#888"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Society Name<Text style={styles.required}> *</Text></Text>
                <TextInput
                    style={styles.input}
                    value={form.society}
                    onChangeText={text => handleInputChange('society', text)}
                    placeholder="Enter society name"
                    placeholderTextColor="#888"
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Password<Text style={styles.required}> *</Text></Text>
                <View style={styles.inputBoxRelative}>
                    <TextInput
                        style={[styles.input, styles.inputWithIcon, styles.inputText]}
                        value={form.password}
                        onChangeText={text => handleInputChange('password', text)}
                        placeholder="Enter password"
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
                <Text style={styles.label}>Confirm Password<Text style={styles.required}> *</Text></Text>
                <View style={styles.inputBoxRelative}>
                    <TextInput
                        style={[styles.input, styles.inputWithIcon, styles.inputText]}
                        value={form.confirmPassword}
                        onChangeText={text => handleInputChange('confirmPassword', text)}
                        placeholder="Confirm password"
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

            <Text style={styles.terms}>
                By registering, you agree to our{' '}
                <Text
                    style={styles.link}
                    onPress={() => Linking.openURL('https://example.com/terms/distributor')}
                >
                    Distributor Terms
                </Text>.
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
                <Text style={styles.buttonText}>
                    {isLoading ? 'Registering...' : 'Register'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}
