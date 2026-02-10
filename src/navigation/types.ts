type Vendor = {
  id: string;
  name: string;
  location: string;
  rating: number;
};

export type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  ResetPassword: { mobile: string, otp: string };
  VerifyOtp: { mobile: string };
  VendorRegistration: undefined;
  ConsumerRegistration: undefined;
  DistributorRegistration: undefined;
  VendorHome: undefined;
  ConsumerHome: undefined;
  DistributorHome: undefined;
  Notifications: undefined;
  EditProfile: undefined;
  Splash: undefined;
  Slide: undefined;
  TermsConditions: undefined;
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

  // Vendor Consumer Requests - Extra milk when distributor on leave
  VendorConsumerRequests: undefined;
  MilkRequestDistributorAssign: undefined;

  // Vendor Distributor Leave - Manage distributor leave requests
  VendorDistributorLeave: undefined;
  VendorSubscription: undefined;

  // Consumer and Distributor lists
  AllConsumersList: undefined;
  DistributorsList: undefined;

  // Extra Milk List for Distributor
  ExtraMilkList: { milkmanId: number, today: string }
};