import { GoogleGenAI, Type } from "@google/genai";
import { BookingRequest, BookingResponse, DriverProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBookingConfirmation = async (
  booking: BookingRequest,
  driver: DriverProfile,
  bookingRef: string
): Promise<BookingResponse> => {
  const modelId = "gemini-2.5-flash";

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
    - Notes: ${booking.notes}

    Please generate a JSON response containing:
    1. 'confirmationMessage': A friendly, short web UI success message (max 2 sentences) from ${driver.driverName}.
    2. 'estimatedDuration': A realistic guess of travel time (e.g., "Approx 45 mins").
    3. 'travelTips': One short, helpful tip relevant to a car ride.
    4. 'emailSubject': A professional email subject line for the confirmation including the Ref #${bookingRef}.
    5. 'emailBody': A polite, professional email body written from "${driver.driverName}" confirming the request is received. Use the Driver's Name in the signature.
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
      confirmationMessage: `Booking received! ${driver.driverName} will contact you shortly.`,
      estimatedDuration: "Varies by traffic",
      travelTips: "Sit back and relax.",
      emailSubject: `Booking Request ${bookingRef} - ${driver.businessName}`,
      emailBody: `Hi ${booking.fullName},\n\nThanks for your booking request. I'll review the details and get back to you shortly.\n\nBest,\n${driver.driverName}`,
      bookingRef
    };
  }
};
