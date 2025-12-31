
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
        fullName: '', email: '', phone: '', pickupLocation: '', dropoffLocation: '', date: '', time: '', passengers: 1, notes: ''
    });
  };

  if (result) {
    // Simple, professional message for the driver
    const messageToDriver = `🚀 NEW PRIVATE BOOKING ${result.bookingRef}\n\n👤 Client: ${formData.fullName}\n📞 Phone: ${formData.phone}\n📍 From: ${formData.pickupLocation}\n🏁 To: ${formData.dropoffLocation}\n📅 When: ${formData.date} @ ${formData.time}\n👥 Pax: ${formData.passengers}\n📝 Notes: ${formData.notes || 'None'}`;
    
    const rawPhone = driver.phone.replace(/[^0-9]/g, '');
    const whatsappLink = `https://wa.me/${rawPhone}?text=${encodeURIComponent(messageToDriver)}`;
    const smsLink = `sms:${driver.phone}?body=${encodeURIComponent(messageToDriver)}`;

    return (
      <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl max-w-2xl mx-auto border border-teal-100 animate-fade-in-up">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Request Generated!</h2>
          <div className="mt-4 p-5 bg-teal-50 rounded-2xl border border-teal-100">
             <p className="text-teal-900 text-lg font-bold leading-relaxed">{result.confirmationMessage}</p>
          </div>
          <span className="inline-block mt-4 bg-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">Ref: {result.bookingRef}</span>
        </div>

        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 mb-8">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Car className="w-3 h-3" /> Trip Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-teal-500" />
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Pickup</p>
                        <p className="font-bold text-slate-900 leading-tight">{formData.pickupLocation}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Schedule</p>
                        <p className="font-bold text-slate-900 leading-tight">{formData.date} at {formData.time}</p>
                    </div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 italic">"{result.travelTips}"</p>
            </div>
        </div>

        <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 text-center uppercase tracking-[0.2em] mb-4">
                Send details to {driver.driverName} to confirm
            </p>
            
            <div className="flex flex-col gap-3">
                 <a 
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white py-5 px-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-emerald-500/20 active:scale-[0.98] uppercase tracking-widest"
                >
                    <MessageCircle className="w-6 h-6" />
                    Send via WhatsApp
                </a>
                 <a 
                    href={smsLink}
                    className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-4 px-4 rounded-2xl font-black text-xs transition-all uppercase tracking-widest"
                >
                    <Phone className="w-4 h-4" />
                    Send via SMS
                </a>
                <a 
                    href={`mailto:${driver.email}?subject=${encodeURIComponent(result.emailSubject)}&body=${encodeURIComponent(result.emailBody)}`}
                    className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 py-2 text-[10px] font-bold uppercase tracking-widest"
                >
                    <Mail className="w-3 h-3" />
                    Confirm via Email
                </a>
            </div>
             <button onClick={handleReset} className="w-full text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-teal-600 mt-6 transition-colors">
                Back to Form
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl max-w-2xl mx-auto border border-slate-100">
      <div className="mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic mb-2">Book with {driver.driverName}</h2>
        <p className="text-slate-500 font-medium">Direct executive transfers. No middleman.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
                <User className="absolute left-4 top-4 text-slate-300 w-5 h-5" />
                <input type="text" name="fullName" required placeholder="Your Full Name" value={formData.fullName} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium" />
            </div>
            <div className="relative">
                <Phone className="absolute left-4 top-4 text-slate-300 w-5 h-5" />
                <input type="tel" name="phone" required placeholder="Mobile Number" value={formData.phone} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium" />
            </div>
        </div>
        
        <div className="relative">
            <Mail className="absolute left-4 top-4 text-slate-300 w-5 h-5" />
            <input type="email" name="email" required placeholder="Email Address" value={formData.email} onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="relative">
                <MapPin className="absolute left-4 top-4 text-teal-500 w-5 h-5" />
                <input type="text" name="pickupLocation" required placeholder="Pickup Address" value={formData.pickupLocation} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium" />
            </div>
             <div className="relative">
                <MapPin className="absolute left-4 top-4 text-red-400 w-5 h-5" />
                <input type="text" name="dropoffLocation" required placeholder="Destination" value={formData.dropoffLocation} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium" />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="relative">
                <Calendar className="absolute left-4 top-4 text-slate-300 w-5 h-5" />
                <input type="date" name="date" required value={formData.date} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium" />
            </div>
             <div className="relative">
                <Clock className="absolute left-4 top-4 text-slate-300 w-5 h-5" />
                <input type="time" name="time" required value={formData.time} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium" />
            </div>
             <div className="relative">
                <Users className="absolute left-4 top-4 text-slate-300 w-5 h-5" />
                <select name="passengers" value={formData.passengers} onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium appearance-none">
                    <option value={1}>1 Pax</option>
                    <option value={2}>2 Pax</option>
                    <option value={3}>3 Pax</option>
                    <option value={4}>4 Pax</option>
                    <option value={5}>5+ Pax</option>
                </select>
            </div>
        </div>

        <textarea name="notes" rows={3} placeholder="Extra luggage, flight number, child seat?" value={formData.notes} onChange={handleChange}
            className="w-full p-6 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium" />

        <button type="submit" disabled={loading}
            className="w-full bg-slate-950 hover:bg-slate-800 text-white font-black py-6 px-6 rounded-2xl transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-70 uppercase tracking-widest">
            {loading ? <><Loader2 className="animate-spin w-6 h-6 text-teal-500" /> Preparing...</> : <>Request Your Ride</>}
        </button>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-center text-slate-400">
            Professional Direct Driver Link
        </p>
      </form>
    </div>
  );
};

export default BookingForm;
