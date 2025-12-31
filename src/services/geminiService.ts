
import { GoogleGenAI, Type } from "@google/genai";
import { BookingRequest, BookingResponse, DriverProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getDisplayName = (driver: DriverProfile) => {
  if (driver.surname) return `${driver.driverName} ${driver.surname}`;
  if (driver.surnameInitial) return `${driver.driverName} ${driver.surnameInitial}.`;
  return driver.driverName;
};

export const generateBookingConfirmation = async (
  booking: BookingRequest,
  driver: DriverProfile,
  bookingRef: string
): Promise<BookingResponse> => {
  const modelId = "gemini-3-flash-preview";
  const fullName = getDisplayName(driver);

  const prompt = `
    You are an AI booking assistant for "${driver.businessName}", a professional private driver service.
    Driver: ${fullName}
    Vehicle: ${driver.vehicleType}
    Service Area: ${driver.location}
    Experience: ${driver.experienceYears} years
    Specialties: ${driver.specialties?.join(", ")}
    
    A customer (${booking.fullName}) has submitted a booking request (Ref: ${bookingRef}):
    - Pickup: ${booking.pickupLocation}
    - Destination: ${booking.dropoffLocation}
    - Date: ${booking.date}
    - Time: ${booking.time}
    - Passengers: ${booking.passengers}
    - Notes: ${booking.notes || "None"}

    Please generate a professional JSON response:
    1. 'confirmationMessage': A warm, trust-building success message (max 2 sentences) written in ${fullName}'s voice.
    2. 'estimatedDuration': A realistic estimate of travel time between the two locations.
    3. 'travelTips': One professional tip based on the ${driver.vehicleType} or the specific trip.
    4. 'emailSubject': A high-end email subject line including Ref #${bookingRef}.
    5. 'emailBody': A formal, beautifully written email confirmation. Use ${fullName} in the signature.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            confirmationMessage: { type: Type.STRING },
            estimatedDuration: { type: Type.STRING },
            travelTips: { type: Type.STRING },
            emailSubject: { type: Type.STRING },
            emailBody: { type: Type.STRING },
            bookingRef: { type: Type.STRING },
          },
          required: ["confirmationMessage", "estimatedDuration", "travelTips", "emailSubject", "emailBody"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    const parsed = JSON.parse(text);
    return { ...parsed, bookingRef };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      confirmationMessage: `Request received! ${fullName} will review your trip to ${booking.dropoffLocation} and contact you shortly.`,
      estimatedDuration: "Estimated upon confirmation",
      travelTips: "Keep your phone handy for arrival updates.",
      emailSubject: `Booking Request ${bookingRef} - ${driver.businessName}`,
      emailBody: `Hi ${booking.fullName},\n\nThanks for choosing ${driver.businessName}. I've received your request for a ride from ${booking.pickupLocation} on ${booking.date}. I will confirm availability shortly.\n\nBest regards,\n${fullName}`,
      bookingRef
    };
  }
};
