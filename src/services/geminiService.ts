
import { GoogleGenAI, Type } from "@google/genai";
import { BookingRequest, BookingResponse, DriverProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBookingConfirmation = async (
  booking: BookingRequest,
  driver: DriverProfile,
  bookingRef: string
): Promise<BookingResponse> => {
  const modelId = "gemini-3-flash-preview";

  const prompt = `
    You are an AI booking assistant for "${driver.businessName}", a private driver service run by ${driver.driverName}.
    The driver drives a ${driver.vehicleType}.
    
    A customer has just submitted a booking request (Ref: ${bookingRef}) with the following details:
    - Name: ${booking.fullName}
    - From: ${booking.pickupLocation}
    - To: ${booking.dropoffLocation}
    - Date: ${booking.date}
    - Time: ${booking.time}
    - Passengers: ${booking.passengers}
    - Notes: ${booking.notes || "None"}

    Please generate a professional JSON response:
    1. 'confirmationMessage': A friendly, short web UI success message (max 2 sentences) from ${driver.driverName} to the customer.
    2. 'estimatedDuration': A realistic travel time estimate (e.g., "Approx 45-50 mins").
    3. 'travelTips': One short, helpful travel tip.
    4. 'emailSubject': A professional subject line including Ref #${bookingRef}.
    5. 'emailBody': A polite email body confirming the request receipt.
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
          required: ["confirmationMessage", "estimatedDuration", "emailSubject", "emailBody"],
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
      confirmationMessage: `Booking request received! ${driver.driverName} will contact you shortly to confirm.`,
      estimatedDuration: "Estimated upon confirmation",
      travelTips: "Ensure you have your phone handy for updates.",
      emailSubject: `Booking Request ${bookingRef} - ${driver.businessName}`,
      emailBody: `Hi ${booking.fullName},\n\nI've received your booking request for ${booking.date}. I'll review it and get back to you shortly.\n\nBest,\n${driver.driverName}`,
      bookingRef
    };
  }
};
