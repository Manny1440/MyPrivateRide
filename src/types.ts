
export interface BookingRequest {
  fullName: string;
  email: string;
  phone: string;
  pickupLocation: string;
  dropoffLocation: string;
  date: string;
  time: string;
  passengers: number;
  notes: string;
}

export interface BookingResponse {
  confirmationMessage: string;
  estimatedDuration: string;
  travelTips: string;
  emailSubject: string;
  emailBody: string;
  bookingRef: string;
}

export interface DriverProfile {
  id: string; // The unique slug used in URLs (e.g., 'harry', 'harry-s', 'harry-singh')
  businessName: string;
  driverName: string;
  surnameInitial?: string; // e.g., 'S'
  surname?: string; // e.g., 'Singh' - Full surname for display
  phone: string;
  email: string;
  location: string;
  themeColor: string;
  tagline: string;
  heroImage: string;
  vehicleType: string;
  experienceYears?: number;
  specialties?: string[];
}
