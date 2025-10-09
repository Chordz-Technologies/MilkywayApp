

// // Vendor
// type Vendor = {
//   id: string;
//   name: string;
//   location: string;
//   rating: number;
//   // Add additional fields as required (e.g., profilePhoto, email)
// };

// export type RootStackParamList = {
//   Login: undefined;
//   ForgotPassword: undefined;
//   ResetPassword: undefined;
//   VerifyOtp: { mobile: string };
//   VendorRegistration: undefined;
//   ConsumerRegistration: undefined;
//   DistributorRegistration: undefined;
//   VendorHome: undefined;
//   ConsumerHome: undefined;
//   DistributorHome: undefined;
//   EditProfile: undefined; // New screen type
//   Splash: undefined;
//   Slide: undefined;
//   CustomerDetail: { customerId: string; customerName: string }; // EXACTLY as used in navigate and route.params
//   MilkmanList: undefined;
//   VendorList: { onSelectVendor: (vendor: Vendor) => void };
//   BillDetails: { billId: string };
//   PendingRequests: { pendingRequests?: Request[] }; // Optional param for pre-fetched requests
//   AssignDistributor: { consumerId: string; consumerName: string }; // New screen type
//   ConsumerCalendar: {
//     consumerId: number;
//     consumerName: string;
//     consumerContact: string;
//     milkRequirement: {
//       cow_milk_litre: number | null;
//       buffalo_milk_litre: number | null;
//     };
//     distributorInfo?: {
//       id: number;
//       name: string;
//       contact: string;
//     };
//   };
//   ConsumerList: undefined;
//   DistributorConsumerCalendar: {
//     viewerRole: 'distributor';
//     targetConsumerId: number;
//     targetConsumerName: string;
//     showBackButton: boolean;
//   };
//   UserDetails: {
//     userId: number;
//     userType: 'consumer' | 'distributor';
//     userName: string;
//   };
//    TemporaryDistributorAssignment: {
//     consumerId: number;
//     consumerName: string;
//     currentDistributorId?: number;
//     currentDistributorName?: string;
//     isTemporary?: boolean;
//   };
// };


// Vendor
type Vendor = {
  id: string;
  name: string;
  location: string;
  rating: number;
  // Add additional fields as required (e.g., profilePhoto, email)
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
  EditProfile: undefined;
  Splash: undefined;
  Slide: undefined;
  CustomerDetail: { customerId: string; customerName: string };
  MilkmanList: undefined;
  VendorList: { onSelectVendor: (vendor: Vendor) => void };
  BillDetails: { billId: string };
  PendingRequests: { pendingRequests?: Request[] };
  AssignDistributor: { consumerId: string; consumerName: string };
  
  // Vendor Profile
  VendorProfile: undefined;
  
  // Consumer Calendar - Multiple use cases
  ConsumerCalendar: {
    viewerRole?: 'consumer' | 'distributor' | 'vendor';
    targetConsumerId?: number;
    targetConsumerName?: string;
    showBackButton?: boolean;
    // Legacy params for backward compatibility
    consumerId?: number;
    consumerName?: string;
    consumerContact?: string;
    milkRequirement?: {
      cow_milk_litre: number | null;
      buffalo_milk_litre: number | null;
    };
    distributorInfo?: {
      id: number;
      name: string;
      contact: string;
    };
  };
  
  ConsumerList: undefined;
  
  // Distributor viewing consumer calendar
  DistributorConsumerCalendar: {
    viewerRole: 'distributor';
    targetConsumerId: number;
    targetConsumerName: string;
    showBackButton: boolean;
  };
  
  // Vendor viewing distributor calendar
  VendorDistributorCalendar: {
    viewerRole: 'vendor';
    targetDistributorId: number;
    targetDistributorName: string;
    showBackButton: boolean;
  };
  
  // User Details (Consumer/Distributor details for vendors)
  UserDetails: {
    userId: number;
    userType: 'consumer' | 'distributor';
    userName: string;
  };
  
  // Temporary Distributor Assignment
  TemporaryDistributorAssignment: {
    consumerId: number;
    consumerName: string;
    currentDistributorId?: number;
    currentDistributorName?: string;
    isTemporary?: boolean;
  };
};
