import React, { useState } from 'react';
import { BookingRequest, BookingResponse, DriverProfile } from '../types';
import { generateBookingConfirmation } from '../services/geminiService';
import { Loader2, CheckCircle, Car, Calendar, MapPin, Users, Mail, Phone, User, Clock, MessageCircle } from 'lucide-react';

interface Props {
    driver: DriverProfile;
}

const BookingForm: React.FC<Props> = ({ driver }) => {
  const [formData, setFormData] = useState<BookingRequest>({
    fullName: '',
    email: '',
    phone: '',
    pickupLocation: '',
    dropoffLocation: '',
    date: '',
    time: '',
    passengers: 1,
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BookingResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Generate a simple unique ref ID based on driver ID + random number
    const bookingRef = `#${driver.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    try {
      const response = await generateBookingConfirmation(formData, driver, bookingRef);
      setResult(response);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setFormData({
        fullName: '',
        email: '',
        phone: '',
        pickupLocation: '',
        dropoffLocation: '',
        date: '',
        time: '',
        passengers: 1,
        notes: ''
    });
  };

  if (result) {
    const smsBody = `Hi ${driver.driverName}, New Booking ${result.bookingRef}. \n\nFrom: ${formData.pickupLocation}\nTo: ${formData.dropoffLocation}\nWhen: ${formData.date} @ ${formData.time}\nName: ${formData.fullName}\nPhone: ${formData.phone}`;
    
    // Logic to handle phone numbers for WA
    const rawPhone = driver.phone.replace(/[^0-9]/g, ''); // strip everything but numbers
    const whatsappLink = `https://wa.me/${rawPhone}?text=${encodeURIComponent(smsBody)}`;
    const smsLink = `sms:${driver.phone}?body=${encodeURIComponent(smsBody)}`;

    return (
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto border border-brand-100 animate-fade-in-up">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Request Generated!</h2>
          <p className="text-gray-600 mt-2">{result.confirmationMessage}</p>
          <span className="inline-block mt-2 bg-gray-100 px-3 py-1 rounded-full text-xs font-mono text-gray-500">Ref: {result.bookingRef}</span>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-6">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <Car className="w-4 h-4" /> Trip Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <p><span className="font-medium text-gray-900">Est. Duration:</span> {result.estimatedDuration}</p>
                <p><span className="font-medium text-gray-900">Vehicle:</span> {driver.vehicleType}</p>
            </div>
        </div>

        <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center font-medium">
                👇 Click below to send this booking to {driver.driverName} instantly:
            </p>
            
            <div className="flex flex-col gap-3">
                 <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 px-4 rounded-lg font-bold text-lg transition-colors shadow-md"
                >
                    <MessageCircle className="w-6 h-6" />
                    Send via WhatsApp (Recommended)
                </a>
                 <a 
                    href={smsLink}
                    className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 py-3 px-4 rounded-lg font-medium transition-colors"
                >
                    <Phone className="w-4 h-4" />
                    Send via SMS
                </a>
                <a 
                    href={`mailto:${driver.email}?subject=${encodeURIComponent(result.emailSubject)}&body=${encodeURIComponent(result.emailBody)}`}
                    className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 py-2 text-sm"
                >
                    <Mail className="w-4 h-4" />
                    Or send via Email
                </a>
            </div>
             <button onClick={handleReset} className="w-full text-brand-600 font-medium hover:underline text-sm mt-4">
                Make another booking
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl max-w-2xl mx-auto border border-gray-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Book with {driver.driverName}</h2>
        <p className="text-gray-500">Direct booking. No hidden fees. Instant confirmation.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                />
            </div>
            <div className="relative">
                <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Mobile Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                />
            </div>
        </div>
        
        <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
                type="email"
                name="email"
                required
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
            />
        </div>

        {/* Journey Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="relative">
                <MapPin className="absolute left-3 top-3 text-brand-600 w-5 h-5" />
                <input
                    type="text"
                    name="pickupLocation"
                    required
                    placeholder="Pickup Location"
                    value={formData.pickupLocation}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                />
            </div>
             <div className="relative">
                <MapPin className="absolute left-3 top-3 text-red-500 w-5 h-5" />
                <input
                    type="text"
                    name="dropoffLocation"
                    required
                    placeholder="Dropoff Destination"
                    value={formData.dropoffLocation}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                />
            </div>
             <div className="relative">
                <Clock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <input
                    type="time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                />
            </div>
             <div className="relative">
                <Users className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <select
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all bg-white"
                >
                    <option value={1}>1 Passenger</option>
                    <option value={2}>2 Passengers</option>
                    <option value={3}>3 Passengers</option>
                    <option value={4}>4 Passengers</option>
                    <option value={5}>5+ Passengers</option>
                </select>
            </div>
        </div>

        <textarea
            name="notes"
            rows={3}
            placeholder="Any special requests? (Child seat, extra luggage, etc.)"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
        />

        <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-900 hover:bg-brand-800 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
        >
            {loading ? (
                <>
                    <Loader2 className="animate-spin w-5 h-5" /> Preparing...
                </>
            ) : (
                <>
                    Confirm Details & Contact Driver
                </>
            )}
        </button>
        <p className="text-xs text-center text-gray-400">
            Clicking confirm prepares a message to send directly to {driver.driverName}.
        </p>
      </form>
    </div>
  );
};

export default BookingForm;
