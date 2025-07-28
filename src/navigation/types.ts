

// Vendor
type Vendor = {
  id: string;
  name: string;
  location: string;
  rating: number;
  // Add additional fields as required (e.g., profilePhoto, email)
};

// Milkman
// type Milkman = {
//   id: string;
//   name: string;
//   phone: string;
//   assignedRoute: string; // Optional
//   // Add further specifics if needed
// };

// // Request (for both customers and milkmen)
// type Request = {
//   id: string;
//   vendorId: string;
//   userId: string;
//   userRole: 'customer' | 'milkman';
//   status: 'pending' | 'accepted' | 'rejected';
//   createdAt: string;
//   // Optionally: vendorName, userName, etc., for easy UI rendering
// };


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


