
import { DriverProfile } from "./types";

export const drivers: DriverProfile[] = [
  {
    id: "harry", // Legacy URL: ?driver=harry
    businessName: "Harry's PrivateRide",
    driverName: "Harry",
    phone: "+61413948080",
    email: "harchand2000@yahoo.com",
    location: "Melbourne Airport & South East",
    themeColor: "teal",
    tagline: "Your reliable link around Melbourne.",
    heroImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop",
    vehicleType: "Toyota RAV4",
    experienceYears: 15,
    specialties: ["Airport Transfers", "Fixed Rates"]
  },
  {
    id: "harry-s", // Initial URL: ?driver=harry-s
    businessName: "Harry S. Prestige Hire",
    driverName: "Harry",
    surnameInitial: "S",
    phone: "+61400000004",
    email: "harry.s@privateride.com.au",
    location: "Melbourne Eastern Suburbs",
    themeColor: "teal",
    tagline: "Luxury travel for the East.",
    heroImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop",
    vehicleType: "Audi A8",
    experienceYears: 6,
    specialties: ["Wedding Hire", "Winery Tours"]
  },
  {
    id: "harry-singh-west", // Extended Slug URL: ?driver=harry-singh-west
    businessName: "Singh's West Melbourne Chauffeurs",
    driverName: "Harry",
    surname: "Singh",
    phone: "+61400000006",
    email: "west.singh@privateride.com.au",
    location: "Melbourne Western Suburbs",
    themeColor: "teal",
    tagline: "Your local Western specialist.",
    heroImage: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?q=80&w=2070&auto=format&fit=crop",
    vehicleType: "Tesla Model X",
    experienceYears: 4,
    specialties: ["Eco-Luxury", "Tarneit/Truganina Specials"]
  },
  {
    id: "avtar",
    businessName: "Avtar's Executive Travel",
    driverName: "Avtar",
    phone: "+61402496021",
    email: "avtar@gmail.com",
    location: "Melbourne SE Suburbs",
    themeColor: "teal",
    tagline: "First-class service for every passenger.",
    heroImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop",
    vehicleType: "Toyota Kluger",
    experienceYears: 15,
    specialties: ["Large Groups", "Child Seats"]
  },
  {
    id: "inder",
    businessName: "Inder's Premium Hire",
    driverName: "Inder",
    phone: "+61421914654",
    email: "ipsk2005@yahoo.com",
    location: "Melbourne Metro All-Areas",
    themeColor: "teal",
    tagline: "Always ready, always on time.",
    heroImage: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop",
    vehicleType: "Toyota Camry Hybrid",
    experienceYears: 10,
    specialties: ["City Tours", "Daily Hire"]
  }
];

