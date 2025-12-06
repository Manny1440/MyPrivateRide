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
  id: string;
  businessName: string;
  driverName: string;
  phone: string;
  email: string;
  location: string;
  themeColor: string;
  tagline: string;
  heroImage: string;
  vehicleType: string;
}
