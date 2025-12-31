
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
    Context: You are the digital dispatch assistant for "${driver.businessName}".
    Driver: ${driverFullName} (Vehicle: ${driver.vehicleType}).
    Customer: ${booking.fullName}
    Ref: ${bookingRef}
    Trip: From ${booking.pickupLocation} to ${booking.dropoffLocation} on ${booking.date} at ${booking.time}.
    
    TASK: Generate a professional JSON response with two distinct pieces of communication.
    
    1. 'confirmationMessage': A message TO THE CUSTOMER (${booking.fullName}) from ${driver.driverName}. 
       It should be warm and professional. 
       Example: "Hi ${booking.fullName}, I've received your request for ${booking.date}. I look forward to driving you."
       (IMPORTANT: Do NOT mention AI or that a draft was prepared. Just be the driver.)

    2. 'driverReplyDraft': A pre-written response for the DRIVER to send back to the customer once they open the message on WhatsApp. 
       It should confirm they are available, mention the ${driver.vehicleType}, and invite any further questions.
       Example: "Hi ${booking.fullName}, thanks for your booking request ${bookingRef}. I'm available and will see you in my ${driver.vehicleType} at the requested time. Regards, ${driver.driverName}"

    3. 'estimatedDuration': Realistic travel time (e.g., "45 to 60 minutes").
    4. 'travelTips': A useful tip (e.g., "Traffic can be heavy on Friday nights, I'll aim for a few minutes early").
    5. 'emailSubject': Professional subject line.
    6. 'emailBody': Full email body for the customer.
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
