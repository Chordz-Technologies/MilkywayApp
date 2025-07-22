
export type Vendor = {
  id: string;
  name: string;
  location: string;
  rating: number;
};


export type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  VerifyOtp: { mobile: string };
  VendorRegistration: undefined;
  ConsumerRegistration: undefined;
  DistributorRegistration: undefined;
  VendorHome: undefined;
  ConsumerHome: undefined;
  DistributorHome: undefined;
  EditProfile: undefined; // New screen type
  Splash: undefined;
  Slide: undefined;
  CustomerDetail: { customerId: string; customerName: string }; // EXACTLY as used in navigate and route.params
  MilkmanList: undefined;
  VendorList: { onSelectVendor: (vendor: Vendor) => void };
  BillDetails: { billId: string };
};


