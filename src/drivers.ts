
import { DriverProfile } from "./types";

export const drivers: DriverProfile[] = [
  {
    id: "harry",
    businessName: "Harry's PrivateRide",
    driverName: "Harry",
    phone: "+61413948080",
    email: "harchand2000@yahoo.com",
    location: "Melbourne Metro & Airport",
    themeColor: "teal",
    tagline: "Professional. Punctual. Private.",
    heroImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop",
    vehicleType: "Luxury Sedan"
  },
  {
    id: "gary",
    businessName: "Gary's PrivateRide",
    driverName: "Gary",
    phone: "+61400000002",
    email: "gary@privateride.com.au",
    location: "Melbourne CBD",
    themeColor: "teal",
    tagline: "Your reliable local driver.",
    heroImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop",
    vehicleType: "Maxi Taxi"
  },
  {
    id: "tom",
    businessName: "Tom's PrivateRide",
    driverName: "Tom",
    phone: "+61400000003",
    email: "tom@privateride.com.au",
    location: "Brisbane & Gold Coast",
    themeColor: "teal",
    tagline: "Airport transfers made easy.",
    heroImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop",
    vehicleType: "Tesla Model Y"
  },
  // --- NEW DRIVER ADDED BELOW ---
  {
    id: "Avtar", // <--- CHANGE THIS to determine their URL (e.g. ?driver=david)
    businessName: "Avtar's PrivateRide",
    driverName: "Avtar",
    phone: "+61402496021", // <--- Enter real phone (International format)
    email: "avtar@gmail.com", // <--- Enter real email
    location: "Melbourne Metro",
    themeColor: "teal",
    tagline: "Executive travel for business professionals.",
    heroImage: "https://images.unsplash.com/photo-1562141961-b5d1855d7f28?q=80&w=2070&auto=format&fit=crop", // You can keep this image or find a new one on Unsplash
    vehicleType: "Toyota Kluger"
  }
];
