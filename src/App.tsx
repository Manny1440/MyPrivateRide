
import React, { useState, useEffect, useMemo } from 'react';
import BookingForm from './components/BookingForm';
import { drivers } from './drivers';
import { DriverProfile } from './types';
import { Star, Shield, Clock, Smile, Menu, X, Phone, Mail, Check, Zap, Globe, Smartphone, Car, ArrowLeft, WifiOff, QrCode, Download, Search, MapPin, Briefcase, UserCircle, BadgeCheck, Send, MessageSquare, ArrowRight } from 'lucide-react';

/* --- UTILS --- */
const getDisplayName = (driver: DriverProfile) => {
  if (driver.surname) return `${driver.driverName} ${driver.surname}`;
  if (driver.surnameInitial) return `${driver.driverName} ${driver.surnameInitial}.`;
  return driver.driverName;
};

/* --- SHARED COMPONENTS --- */

const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="bg-amber-500 text-white text-center py-2 px-4 text-xs font-bold flex items-center justify-center gap-2 fixed bottom-0 w-full z-[100] shadow-2xl">
      <WifiOff className="w-4 h-4" />
      OFFLINE: WhatsApp & SMS bookings remain active.
    </div>
  );
};

const PricingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSignup = (plan: string) => {
    const subject = `Sign me up for MyPrivateRide (${plan} Plan)`;
    const body = `Hi,\n\nI want to start my 3-month free trial for the ${plan} plan.\n\nName:\nPhone:\nVehicle:`;
    window.location.href = `mailto:s.manny1440@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-slate-200">
          <div className="px-6 py-8 sm:p-10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter italic text-brand-600">Scale Your Business</h3>
                <p className="text-slate-500 max-w-md">The professional standard for independent drivers who want to own their client list.</p>
                <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black tracking-widest border border-emerald-100 uppercase">
                  <Zap className="w-3 h-3 fill-emerald-700" /> PROMO: 3 MONTHS FREE TRIAL
                </div>
              </div>
              <button onClick={onClose} className="bg-slate-100 rounded-full p-2 hover:bg-slate-200 transition-colors">
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: 'Starter', price: '$29', features: ['Custom Booking Link', 'Email Notifications', 'Basic Analytics'], color: 'slate' },
                { name: 'Professional', price: '$39', features: ['AI Smart Drafts', 'WhatsApp Generator', 'SMS Reminders', 'Priority Support'], color: 'brand', popular: true },
                { name: 'Elite', price: '$99', features: ['Multi-Driver Fleet', 'Dispatch Panel', 'Custom Domain', 'White Label App'], color: 'slate' }
              ].map((plan) => (
                <div key={plan.name} className={`relative p-8 rounded-2xl border transition-all hover:shadow-xl ${plan.popular ? 'border-brand-500 border-2 bg-brand-50/10' : 'border-slate-100 bg-white'}`}>
                  {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-[10px] font-black tracking-widest px-3 py-1 rounded-full">MOST POPULAR</div>}
                  <h4 className="text-lg font-bold text-slate-900 uppercase tracking-wider">{plan.name}</h4>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                    <span className="text-slate-400 font-medium">/mo</span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-3 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => handleSignup(plan.name)} className={`w-full mt-10 py-3 rounded-xl font-bold transition-all shadow-md uppercase tracking-widest text-xs ${plan.popular ? 'bg-brand-600 text-white hover:bg-brand-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                    Select {plan.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DriverToolsModal: React.FC<{ isOpen: boolean; onClose: () => void; driver: DriverProfile }> = ({ isOpen, onClose, driver }) => {
  if (!isOpen) return null;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(window.location.origin + '?driver=' + driver.id)}`;

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md" onClick={onClose}></div>
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-md w-full border border-slate-200">
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
               <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter">
                 <QrCode className="w-6 h-6 text-brand-600" />
                 Marketing Kit
               </h3>
               <button onClick={onClose} className="bg-slate-100 rounded-full p-1.5 hover:bg-slate-200">
                 <X className="w-5 h-5 text-slate-500" />
               </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white p-6 shadow-sm border border-slate-100 rounded-2xl mb-6">
                <img src={qrUrl} alt="Driver QR Code" className="w-56 h-56" />
              </div>
              <p className="text-sm text-center text-slate-500 mb-8 leading-relaxed">
                Customers scan this to reach <strong>{driver.businessName}</strong>. 
                Your permanent direct link: <span className="text-brand-600 font-bold block mt-1">?driver={driver.id}</span>
              </p>

              <div className="grid grid-cols-1 gap-3 w-full">
                <a href={qrUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-brand-600 text-white py-4 rounded-xl font-bold hover:bg-brand-700 transition-all shadow-lg shadow-brand-200 uppercase tracking-widest text-xs">
                  <Download className="w-5 h-5" /> Download QR Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SUB-APPS --- */

const DriverApp: React.FC<{ driver: DriverProfile; onBack: () => void }> = ({ driver, onBack }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  const displayName = getDisplayName(driver);

  const scrollToBooking = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById('book-now');
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-brand-100">
      <OfflineBanner />
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      <DriverToolsModal isOpen={isToolsOpen} onClose={() => setIsToolsOpen(false)} driver={driver} />
      
      <nav className="bg-slate-950 text-white sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="bg-brand-600 p-2 rounded-xl">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg md:text-xl tracking-tight">MyPrivateRide</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-10">
              <a href="#about" className="text-sm font-semibold hover:text-brand-400 transition-colors uppercase tracking-wider">The Difference</a>
              <a href="#book-now" onClick={scrollToBooking} className="bg-brand-500 text-brand-950 px-6 py-2.5 rounded-full text-sm font-black hover:bg-brand-400 transition-all uppercase tracking-widest shadow-lg shadow-brand-500/20">Book Now</a>
            </div>

            <div className="-mr-2 flex md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-400 hover:text-white">
                {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="relative bg-slate-950 h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={driver.heroImage} className="w-full h-full object-cover opacity-40 scale-105" alt="Hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-500/10 backdrop-blur-md px-4 py-1.5 rounded-full text-brand-400 text-[10px] font-black tracking-widest uppercase mb-8 border border-brand-500/20">
                <Star className="w-4 h-4 fill-brand-400" /> Rated #1 in {driver.location}
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] mb-8 uppercase tracking-tighter italic">
              {driver.tagline}
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-xl font-medium leading-relaxed">
              Experience a {driver.experienceYears}+ year professional service. Skip the surge and book {displayName} directly for premium {driver.vehicleType} transfers.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
                <a href="#book-now" onClick={scrollToBooking} className="inline-flex items-center justify-center px-10 py-5 bg-brand-500 text-brand-950 text-lg font-black rounded-2xl hover:bg-brand-400 transition-all shadow-xl shadow-brand-500/20 uppercase tracking-widest">
                  Confirm Booking
                </a>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-brand-600 font-black uppercase tracking-[0.2em] mb-4 text-xs">The Premium Difference</h2>
              <p className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none uppercase">Why clients choose {driver.driverName}</p>
            </div>
            <p className="text-slate-500 max-w-xs font-medium">Professionalism isn't just a promise, it's my standard for every mile driven.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Immaculate', desc: 'Detailed daily. My vehicle is a sanctuary of cleanliness for every guest.' },
              { icon: Clock, title: 'Reliable', desc: 'Always on time. I monitor traffic and flights to ensure a seamless arrival.' },
              { icon: Smile, title: 'Bespoke', desc: 'Climate control, music, and routing tailored exactly to your preferences.' }
            ].map((feat, idx) => (
              <div key={idx} className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="h-14 w-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-8">
                  <feat.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 uppercase italic tracking-tighter">{feat.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="book-now" className="py-16 md:py-32 bg-white relative scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BookingForm driver={driver} />
        </div>
      </section>

      <footer className="bg-slate-950 text-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 mb-20">
            <div>
              <h3 className="text-3xl font-black mb-6 uppercase tracking-widest">{driver.businessName}</h3>
              <p className="text-slate-500 max-w-xs leading-relaxed font-medium italic">
                Professional private transport solutions for the discerning traveler in {driver.location}.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-500 mb-6">Connect</h4>
                <ul className="space-y-4">
                  <li className="flex items-center text-slate-400 group cursor-pointer hover:text-white transition-colors">
                    <Phone className="h-5 w-5 mr-3 text-brand-500" /><span>{driver.phone}</span>
                  </li>
                  <li className="flex items-center text-slate-400 group cursor-pointer hover:text-white transition-colors">
                    <Mail className="h-5 w-5 mr-3 text-brand-500" /><span>{driver.email}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-brand-500 mb-6">Service Area</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-black uppercase tracking-wider">{driver.location}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-12 flex flex-col sm:flex-row justify-between items-center gap-8">
            <p className="text-slate-600 text-xs font-medium">&copy; {new Date().getFullYear()} {driver.businessName}. Built on MyPrivateRide.</p>
            <div className="flex gap-4">
                <button onClick={() => setIsToolsOpen(true)} className="text-[10px] font-black uppercase tracking-widest text-brand-500 bg-brand-500/5 border border-brand-500/20 px-4 py-2 rounded-full hover:bg-brand-500 hover:text-brand-950 transition-all">
                  Marketing Kit
                </button>
                <button onClick={() => setIsPricingOpen(true)} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Start Your App</button>
                <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1 hover:text-white">
                  <ArrowLeft className="w-3 h-3" /> All Drivers
                </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const LandingPage: React.FC<{ onDriverSelect: (id: string) => void }> = ({ onDriverSelect }) => {
    const [isPricingOpen, setIsPricingOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDrivers = useMemo(() => {
        const lower = searchTerm.toLowerCase();
        return drivers.filter(d => 
            d.driverName.toLowerCase().includes(lower) || 
            (d.surnameInitial && d.surnameInitial.toLowerCase().includes(lower)) ||
            (d.surname && d.surname.toLowerCase().includes(lower)) ||
            d.location.toLowerCase().includes(lower) || 
            d.vehicleType.toLowerCase().includes(lower) ||
            d.businessName.toLowerCase().includes(lower)
        );
    }, [searchTerm]);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <OfflineBanner />
            <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
            
            <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                        <div className="bg-brand-600 p-2 rounded-xl">
                            <Car className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-lg md:text-2xl tracking-tight">MyPrivateRide</span>
                    </div>
                    <button onClick={() => setIsPricingOpen(true)} className="bg-slate-950 text-white px-4 md:px-8 py-2 md:py-3 rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 whitespace-nowrap">
                      Start Free Trial
                    </button>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="relative pt-24 pb-20 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-block bg-brand-50 text-brand-700 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-brand-100">
                      For Professional Drivers in Australia AU
                    </div>
                    <h1 className="text-5xl md:text-[5.5rem] font-black text-slate-900 leading-[0.9] tracking-tighter uppercase mb-10">
                      Your Own <span className="text-brand-500">Private Booking App</span><br />
                      in 60 Seconds.
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
                      Stop losing 30% to Uber. Give your private clients a professional way to book you directly. Includes AI confirmations and WhatsApp integration.
                    </p>
                    <div className="flex justify-center mb-20">
                      <button onClick={() => setIsPricingOpen(true)} className="bg-brand-600 text-white px-12 py-6 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-brand-700 transition-all shadow-2xl shadow-brand-500/20 active:scale-95">
                        Create My App Now
                      </button>
                    </div>

                    <div className="mt-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">SEE LIVE DEMOS</p>
                        <div className="flex justify-center gap-3 md:gap-4 flex-wrap max-w-3xl mx-auto">
                            {['harry', 'gary', 'avtar', 'inder', 'tom'].map(id => {
                              const d = drivers.find(drv => drv.id === id);
                              if (!d) return null;
                              return (
                                <button 
                                  key={id}
                                  onClick={() => onDriverSelect(id)} 
                                  className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-5 py-3 rounded-full hover:bg-white hover:border-brand-500 transition-all cursor-pointer group shadow-sm"
                                >
                                  <span className="w-2 h-2 rounded-full bg-brand-500 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(20,184,166,0.5)]"></span> 
                                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{d.businessName}</span>
                                </button>
                              );
                            })}
                        </div>
                    </div>
                </div>
            </header>

            {/* --- AI SHOWCASE SECTION --- */}
            <section className="bg-slate-50 py-32 border-y border-slate-100">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-20">
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic mb-6">AI Drafts That Build Trust.</h2>
                  <p className="text-slate-500 font-medium max-w-xl mx-auto">When a booking arrives, our AI instantly prepares a professional draft for you. Just tap 'Send' to confirm via WhatsApp or Email.</p>
                </div>

                <div className="grid md:grid-cols-12 gap-12 items-center">
                  <div className="md:col-span-6 flex flex-col items-center">
                    
                    {/* CLIENT REQUEST CARD */}
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 w-full max-w-md relative overflow-hidden mb-10">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -mr-16 -mt-16 rounded-full opacity-50"></div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200"><UserCircle /></div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">CLIENT REQUEST</p>
                          <p className="font-bold text-slate-900 text-lg">John Smith</p>
                        </div>
                      </div>
                      <div className="border-l-4 border-slate-100 pl-6 py-2">
                        <p className="text-slate-600 font-medium leading-relaxed italic text-lg">
                          "Hi Harry, can you pick me up from Melb Airport tomorrow around 5:30am? Just me, flying to Sydney."
                        </p>
                      </div>
                    </div>

                    {/* ANIMATED ARROW */}
                    <div className="mb-10">
                      <div className="bg-brand-500 p-4 rounded-full text-white shadow-xl shadow-brand-500/30 animate-pulse">
                        <ArrowRight className="w-6 h-6 rotate-90 md:rotate-90" />
                      </div>
                    </div>

                    {/* SMART REPLY CARD */}
                    <div className="bg-[#0f172a] p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md relative border border-white/5">
                      <div className="absolute top-6 right-8 bg-brand-500 text-[#042f2e] px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-brand-500/20">
                        <Zap className="w-3 h-3 fill-brand-950" /> MYPRIVATERIDE AI
                      </div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center text-[#042f2e] shadow-lg shadow-brand-500/20"><Smartphone /></div>
                        <div>
                          <p className="text-white font-bold italic text-lg tracking-tight">Harry Singh</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-slate-800/60 p-5 rounded-2xl rounded-bl-none text-white text-sm font-medium leading-relaxed border border-white/5">
                          "Hi John, I've received your request for 5:30 AM tomorrow at Melbourne Airport. I'll be there in the Audi A8. Looking forward to driving you again!"
                        </div>
                        <div className="bg-slate-800/40 p-4 rounded-xl text-slate-400 text-xs font-bold border border-white/5 flex items-center gap-2">
                          <Check className="w-4 h-4 text-brand-500" />
                          <span>Travel Tip: 5:30am can be chilly, I'll have the seat heaters ready!</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-6 md:pl-16">
                    <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic mb-10 leading-tight">Professionalism<br/>On Autopilot.</h3>
                    <ul className="space-y-10">
                      {[
                        { title: 'Zero Manual Writing', desc: 'The AI draft is ready before you even open your phone. Save hours of typing every week.', icon: Clock },
                        { title: 'Fleet-Grade Reliability', desc: 'Every client gets a polite, structured response that makes you look like a top-tier operator.', icon: Shield },
                        { title: 'Instant Confirmation', desc: 'One tap opens WhatsApp with the message already typed. You just hit send.', icon: Zap }
                      ].map((item, idx) => (
                        <li key={idx} className="flex gap-6 group">
                          <div className="shrink-0 w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:bg-brand-500 group-hover:text-white transition-all"><item.icon className="w-7 h-7" /></div>
                          <div>
                            <p className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">{item.title}</p>
                            <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-16">
                      <button onClick={() => setIsPricingOpen(true)} className="flex items-center gap-3 bg-slate-950 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                        Try It For Free <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* --- CUSTOMER SEARCH / DIRECTORY --- */}
            <div className="max-w-5xl mx-auto px-4 mt-20 mb-32 relative z-10" id="driver-search">
                <div className="text-center mb-10">
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-2">Looking for a ride?</p>
                   <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Find your local driver</h2>
                </div>
                <div className="relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 transition-colors group-focus-within:text-brand-600" />
                    <input 
                        type="text" 
                        placeholder="Search by location, car type, or driver..."
                        className="w-full pl-16 pr-8 py-8 bg-white rounded-[2.5rem] shadow-2xl border-none focus:ring-4 focus:ring-brand-500/10 text-xl font-medium placeholder:text-slate-300 transition-all border border-slate-50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            
            <section className="pb-32 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDrivers.map((d) => (
                          <button 
                            key={d.id} 
                            onClick={() => onDriverSelect(d.id)} 
                            className="group relative flex flex-col text-left bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:border-brand-200 transition-all duration-500"
                          >
                            <div className="h-64 w-full overflow-hidden relative">
                              <img src={d.heroImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={d.businessName} />
                              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-1.5 border border-slate-100 shadow-sm">
                                <MapPin className="w-3 h-3 text-brand-600" /> {d.location}
                              </div>
                            </div>
                            <div className="p-10">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">
                                    {d.businessName}
                                </h3>
                                <div className="bg-brand-50 p-2.5 rounded-2xl text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all">
                                  <ArrowLeft className="w-5 h-5 rotate-180" />
                                </div>
                              </div>
                              <p className="text-brand-600 text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-1.5">
                                <UserCircle className="w-3 h-3" /> {getDisplayName(d)}
                              </p>
                              <p className="text-slate-500 text-sm font-medium mb-8 leading-relaxed line-clamp-2">{d.tagline}</p>
                              
                              <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-50">
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl">
                                  <Car className="w-3.5 h-3.5" /> {d.vehicleType}
                                </span>
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl">
                                  <Briefcase className="w-3.5 h-3.5" /> {d.experienceYears}yr Exp
                                </span>
                              </div>
                            </div>
                          </button>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="bg-slate-950 py-20">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase mb-24 leading-[0.8]">Build a brand,<br/>not just a shift.</h2>
                <div className="grid md:grid-cols-3 gap-12">
                    {[
                      { icon: Smartphone, title: 'Direct WhatsApp', desc: 'Bookings land in your personal WhatsApp. No dashboards, just direct conversation.' },
                      { icon: Zap, title: 'AI Smart Drafts', desc: 'Our AI drafts professional email confirmations for you instantly. Look like a 5-star fleet.' },
                      { icon: Globe, title: 'Client Loyalty', desc: 'Owning the relationship means customers call you first, not an app. Build a secure future.' }
                    ].map((benefit, idx) => (
                      <div key={idx} className="bg-white/5 backdrop-blur-md p-14 rounded-[3.5rem] border border-white/5 hover:bg-white/[0.07] transition-all">
                        <div className="w-16 h-16 bg-brand-500 rounded-3xl flex items-center justify-center mx-auto mb-10 text-brand-950 shadow-2xl shadow-brand-500/40"><benefit.icon className="w-8 h-8" /></div>
                        <h3 className="text-2xl font-black text-white mb-6 uppercase italic tracking-widest">{benefit.title}</h3>
                        <p className="text-slate-400 font-medium leading-relaxed text-lg">{benefit.desc}</p>
                      </div>
                    ))}
                </div>
                <button onClick={() => setIsPricingOpen(true)} className="mt-24 px-16 py-8 bg-brand-500 text-brand-950 text-2xl font-black rounded-[2.5rem] hover:bg-brand-400 transition-all uppercase tracking-[0.2em] shadow-2xl shadow-brand-500/30 active:scale-95">Start 3-Month Free Trial</button>
              </div>
            </footer>
        </div>
    );
}

const App: React.FC = () => {
  const [currentDriver, setCurrentDriver] = useState<DriverProfile | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const driverSlug = params.get('driver');
    if (driverSlug) {
      const foundDriver = drivers.find(d => d.id === driverSlug);
      if (foundDriver) {
        setCurrentDriver(foundDriver);
        document.title = foundDriver.businessName;
      }
    }
  }, []);

  const handleDriverSelect = (slug: string) => {
    const foundDriver = drivers.find(d => d.id === slug);
    if (foundDriver) {
        setCurrentDriver(foundDriver);
        document.title = foundDriver.businessName;
        try { window.history.pushState({}, '', `?driver=${slug}`); } catch (e) {}
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToLanding = () => {
    setCurrentDriver(null);
    document.title = "MyPrivateRide - Find Your Driver";
    try { window.history.pushState({}, '', window.location.pathname); } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentDriver) {
    return <DriverApp driver={currentDriver} onBack={handleBackToLanding} />;
  }
  return <LandingPage onDriverSelect={handleDriverSelect} />;
};

export default App;
