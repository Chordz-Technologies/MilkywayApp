// import React, { useRef, useState, useEffect } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     Alert,
//     Image,
// } from 'react-native';
// import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
// import { styles } from '../styles/VerifyOtpStyle';
// import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
// import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// import { RootStackParamList } from '../navigation/types';
// import { forgotPassword } from '../apiServices/allApi';
// import SafeAreaWrapper from '../styles/SafeAreaWrapper';

// type VerifyOtpRouteProp = RouteProp<RootStackParamList, 'VerifyOtp'>;
// type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'VerifyOtp'>;

// const VerifyOtpScreen = () => {
//     const [otp, setOtp] = useState(Array(4).fill(''));
//     const [timer, setTimer] = useState(30);
//     const [canResend, setCanResend] = useState(false);
//     const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

//     const inputs = useRef<TextInput[]>([]);
//     const navigation = useNavigation<NavigationProp>();
//     const route = useRoute<VerifyOtpRouteProp>();

//     const { phoneNumber } = route.params;

//     // keep confirmation in state (correct)
//     const [confirmation, setConfirmation] =
//         useState<FirebaseAuthTypes.ConfirmationResult>(
//             route.params.confirmation
//         );

//     const handleChange = (text: string, index: number) => {
//         if (text.length > 1) return;
//         const updated = [...otp];
//         updated[index] = text;
//         setOtp(updated);
//         if (text && index < 3) inputs.current[index + 1]?.focus();
//     };

//     const handleKeyPress = (e: any, index: number) => {
//         if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
//             inputs.current[index - 1]?.focus();
//         }
//     };

//     // VERIFY OTP
//     const handleOtpSubmit = async () => {
//         const finalOtp = otp.join('');

//         if (finalOtp.length !== 4) {
//             Alert.alert('Error', 'Please enter 4-digit OTP');
//             return;
//         }

//         try {
//             const userCredential = await confirmation.confirm(finalOtp);
//             if (!userCredential) {
//                 Alert.alert('Error', 'OTP verification failed. Please try again.');
//                 return;
//             }

//             const firebaseToken = await userCredential.user.getIdToken();
//             await forgotPassword({
//                 phone_number: phoneNumber,
//                 firebase_token: firebaseToken,
//             });

//             Alert.alert('Verified', 'OTP verified successfully!');
//             navigation.navigate('ResetPassword');
//         } catch (error: any) {
//             console.log(error);
//             Alert.alert('Verification Failed', 'Invalid OTP or expired code');
//         }
//     };

//     const handleResendOtp = async () => {
//         try {
//             setOtp(Array(4).fill(''));
//             setTimer(30);
//             setCanResend(false);

//             const newConfirmation = await auth().signInWithPhoneNumber(phoneNumber);
//             setConfirmation(newConfirmation);

//             Alert.alert('OTP Resent', `OTP resent to ${phoneNumber}`);
//         } catch {
//             Alert.alert('Error', 'Failed to resend OTP');
//         }
//     };

//     useEffect(() => {
//         let interval: ReturnType<typeof setInterval>;
//         if (timer > 0) {
//             interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
//         } else {
//             setCanResend(true);
//         }
//         return () => clearInterval(interval);
//     }, [timer]);

//     return (
//         <SafeAreaWrapper>
//             <View style={styles.container}>
//                 <Image source={require('../assets/otplogo.png')} style={styles.logo} />

//                 <Text style={styles.title}>Verify Your Mobile</Text>
//                 <Text style={styles.label}>We sent an OTP to {phoneNumber}</Text>

//                 <View style={styles.otpContainer}>
//                     {otp.map((digit, index) => (
//                         <TextInput
//                             key={index}
//                             style={[
//                                 styles.otpBox,
//                                 focusedIndex === index && styles.otpBoxFocused,
//                             ]}
//                             keyboardType="number-pad"
//                             maxLength={1}
//                             value={digit}
//                             onFocus={() => setFocusedIndex(index)}
//                             onBlur={() => setFocusedIndex(null)}
//                             onChangeText={(text) => handleChange(text, index)}
//                             onKeyPress={(e) => handleKeyPress(e, index)}
//                             ref={(ref) => {
//                                 if (ref) inputs.current[index] = ref;
//                             }}
//                         />
//                     ))}
//                 </View>

//                 <TouchableOpacity style={styles.continueBtn} onPress={handleOtpSubmit}>
//                     <Text style={styles.btnText}>Continue</Text>
//                 </TouchableOpacity>

//                 <Text style={styles.timerText}>
//                     {canResend ? (
//                         <>
//                             Didn't receive the code?{' '}
//                             <Text style={styles.resend} onPress={handleResendOtp}>
//                                 Resend OTP
//                             </Text>
//                         </>
//                     ) : (
//                         <>Resend OTP in {timer}s</>
//                     )}
//                 </Text>

//                 <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//                     <Text style={styles.backToLogin}>Back to Login</Text>
//                 </TouchableOpacity>
//             </View>
//         </SafeAreaWrapper>
//     );
// };

// export default VerifyOtpScreen;
