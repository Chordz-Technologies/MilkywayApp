// src/navigation/types.ts

export type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  VerifyOtp: { mobile: string };
  Register: undefined;
  DummyHome: undefined; 
};
