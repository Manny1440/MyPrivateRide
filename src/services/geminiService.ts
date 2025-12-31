
import { GoogleGenAI, Type } from "@google/genai";
import { BookingRequest, BookingResponse, DriverProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getDisplayName = (driver: DriverProfile) => {
  if (driver.surname) return `${driver.driverName} ${driver.surname}`;
  if (driver.surnameInitial) return `${driver.driverName} ${driver.surnameInitial}.`;
  return driver.driverName;
};

export interface EnhancedBookingResponse extends BookingResponse {
  driverReplyDraft: string;
}

export const generateBookingConfirmation = async (
  booking: BookingRequest,
  driver: DriverProfile,
  bookingRef: string
): Promise<EnhancedBookingResponse> => {
  const modelId = "gemini-3-flash-preview";
  const driverFullName = getDisplayName(driver);

  const prompt = `
    You are an AI booking assistant for "${driver.businessName}".
    Driver Info: ${driverFullName}, driving a ${driver.vehicleType} with ${driver.experienceYears} years experience.
    
    A Customer named "${booking.fullName}" has just submitted a booking request (Ref: ${bookingRef}):
    - Pickup: ${booking.pickupLocation}
    - Destination: ${booking.dropoffLocation}
    - Date: ${booking.date}
    - Time: ${booking.time}
    - Notes: ${booking.notes || "None"}

    Please generate a professional JSON response:
    1. 'confirmationMessage': A message shown on the website TO THE CUSTOMER (${booking.fullName}) from the Driver (${driver.driverName}). (e.g., "Hi ${booking.fullName}, I've received your request...")
    2. 'estimatedDuration': Realistic travel time estimate.
    3. 'travelTips': A short tip for the customer.
    4. 'emailSubject': Email subject for the customer.
    5. 'emailBody': Full email body for the customer.
    6. 'driverReplyDraft': A professional WhatsApp reply written FOR THE DRIVER to send BACK to the customer to confirm the booking. It should be polite, mention the vehicle (${driver.vehicleType}), and sound executive.
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
            driverReplyDraft: { type: Type.STRING },
          },
          required: ["confirmationMessage", "estimatedDuration", "driverReplyDraft"],
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
      confirmationMessage: `Hi ${booking.fullName}, I've received your request! I'll review the details and contact you shortly.`,
      estimatedDuration: "Estimated upon confirmation",
      travelTips: "Keep your phone handy for updates.",
      emailSubject: `Booking Request ${bookingRef}`,
      emailBody: `Hi ${booking.fullName}, I've received your request. Regards, ${driver.driverName}`,
      driverReplyDraft: `Hi ${booking.fullName}, thanks for your booking request ${bookingRef}. I'm available and will see you at ${booking.pickupLocation} in my ${driver.vehicleType}.`,
      bookingRef
    };
  }
};
