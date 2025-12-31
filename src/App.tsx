
import React, { useState, useEffect } from 'react';
import BookingForm from './components/BookingForm';
import { drivers } from './drivers';
import { DriverProfile } from './types';
import { Star, Shield, Clock, Smile, Menu, X, Phone, Mail, Check, Zap, Globe, Smartphone, Car, ArrowLeft, WifiOff, UserCircle, ArrowRight, Copy, MessageCircle, MapPin } from 'lucide-react';

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
                <h3 className="text-3xl font-black text-slate-900 mb-2 uppercase tracking-tighter italic text-teal-600">Scale Your Business</h3>
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
                { name: 'Professional', price: '$39', features: ['AI Auto-Confirmations', 'WhatsApp Message Generator', 'SMS Alerts', 'Priority Support'], color: 'brand', popular: true },
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
                  <button onClick={() => handleSignup(plan.name)} className={`w-full mt-10 py-3 rounded-xl font-bold transition-all shadow-md uppercase tracking-widest text-xs ${plan.popular ? 'bg-teal-600 text-white hover:bg-teal-700' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
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

/* --- SUB-APPS --- */

const DriverApp: React.FC<{ driver: DriverProfile; onBack: () => void }> = ({ driver, onBack }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);

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
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-teal-100">
      <OfflineBanner />
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      
      <nav className="bg-slate-950 text-white sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="bg-teal-600 p-2 rounded-xl">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg md:text-xl tracking-tight">MyPrivateRide</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-10">
              <a href="#about" className="text-sm font-semibold hover:text-teal-400 transition-colors uppercase tracking-wider">The Difference</a>
              <a href="#book-now" onClick={scrollToBooking} className="bg-teal-500 text-teal-950 px-6 py-2.5 rounded-full text-sm font-black hover:bg-teal-400 transition-all uppercase tracking-widest shadow-lg shadow-teal-500/20">Book Now</a>
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
            <div className="inline-flex items-center gap-2 bg-teal-500/10 backdrop-blur-md px-4 py-1.5 rounded-full text-teal-400 text-[10px] font-black tracking-widest uppercase mb-8 border border-teal-500/20">
                <Star className="w-4 h-4 fill-teal-400" /> Rated #1 in {driver.location}
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] mb-8 uppercase tracking-tighter italic">
              {driver.tagline}
            </h1>
            <p className="text-xl text-slate-400 mb-10 max-w-xl font-medium leading-relaxed">
              Experience a {driver.experienceYears}+ year professional service. Skip the surge and book {displayName} directly for premium {driver.vehicleType} transfers.
            </p>
            <div className="flex flex-col sm:flex-row gap-5">
                <a href="#book-now" onClick={scrollToBooking} className="inline-flex items-center justify-center px-10 py-5 bg-teal-500 text-teal-950 text-lg font-black rounded-2xl hover:bg-teal-400 transition-all shadow-xl shadow-teal-500/20 uppercase tracking-widest">
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
              <h2 className="text-teal-600 font-black uppercase tracking-[0.2em] mb-4 text-xs">The Premium Difference</h2>
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
                <h4 className="text-[10px] font-black uppercase tracking-widest text-teal-500 mb-6">Connect</h4>
                <ul className="space-y-4">
                  <li className="flex items-center text-slate-400 group cursor-pointer hover:text-white transition-colors">
                    <Phone className="h-5 w-5 mr-3 text-teal-500" /><span>{driver.phone}</span>
                  </li>
                  <li className="flex items-center text-slate-400 group cursor-pointer hover:text-white transition-colors">
                    <Mail className="h-5 w-5 mr-3 text-teal-500" /><span>{driver.email}</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-teal-500 mb-6">Service Area</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-black uppercase tracking-wider">{driver.location}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-12 flex flex-col sm:flex-row justify-between items-center gap-8">
            <p className="text-slate-600 text-xs font-medium">&copy; {new Date().getFullYear()} {driver.businessName}. Built on MyPrivateRide.</p>
            <div className="flex gap-4">
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

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <OfflineBanner />
            <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
            
            <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 md:gap-3 shrink-0">
                        <div className="bg-teal-600 p-2 rounded-xl">
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
                    <div className="inline-block bg-teal-50 text-teal-700 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-10 border border-teal-100">
                      For Professional Drivers in Australia AU
                    </div>
                    <h1 className="text-5xl md:text-[5.5rem] font-black text-slate-900 leading-[0.9] tracking-tighter uppercase mb-10">
                      Your Own <span className="text-teal-500">Private Booking App</span><br />
                      in 60 Seconds.
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
                      Stop losing 30% to Uber. Give your private clients a professional way to book you directly. Includes AI confirmations and WhatsApp integration.
                    </p>
                    <div className="flex justify-center mb-20">
                      <button onClick={() => setIsPricingOpen(true)} className="bg-teal-600 text-white px-12 py-6 rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-teal-700 transition-all shadow-2xl shadow-teal-500/20 active:scale-95">
                        Create My App Now
                      </button>
                    </div>

                    <div className="mt-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6">SEE LIVE DEMOS</p>
                        <div className="flex justify-center gap-3 md:gap-4 flex-wrap max-w-3xl mx-auto">
                            {drivers.map(d => (
                                <button 
                                  key={d.id}
                                  onClick={() => onDriverSelect(d.id)} 
                                  className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-5 py-3 rounded-full hover:bg-white hover:border-teal-500 transition-all cursor-pointer group shadow-sm"
                                >
                                  <span className="w-2 h-2 rounded-full bg-teal-500 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(20,184,166,0.5)]"></span> 
                                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{d.businessName}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* --- AI SHOWCASE SECTION --- */}
            <section className="bg-slate-50 py-32 border-y border-slate-100">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-20">
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic mb-6">Professional Bookings, No Fuss.</h2>
                  <p className="text-slate-500 font-medium max-w-xl mx-auto">Let your customers book you through a clean interface that sends everything you need to WhatsApp in one tap.</p>
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
                      <div className="bg-teal-500 p-4 rounded-full text-white shadow-xl shadow-teal-500/30 animate-pulse">
                        <ArrowRight className="w-6 h-6 rotate-90 md:rotate-90" />
                      </div>
                    </div>

                    {/* WHATSAPP CARD */}
                    <div className="bg-[#0f172a] p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md relative border border-white/5">
                      <div className="absolute top-6 right-8 bg-[#25D366] text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-[#25D366]/20">
                        <MessageCircle className="w-3 h-3 fill-white" /> WHATSAPP DIRECT
                      </div>
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-[#042f2e] shadow-lg shadow-teal-500/20"><Smartphone /></div>
                        <div>
                          <p className="text-white font-bold italic text-lg tracking-tight">Harry Singh</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-slate-800/60 p-5 rounded-2xl rounded-bl-none text-white text-xs font-medium leading-relaxed border border-white/5">
                          <p className="text-[#25D366] font-black mb-2 uppercase">NEW PRIVATE BOOKING</p>
                          👤 Client: John Smith<br/>
                          📍 From: Melb Airport<br/>
                          🏁 To: Sydney Flight<br/>
                          📅 When: Tomorrow @ 5:30am
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-6 md:pl-16">
                    <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic mb-10 leading-tight">Elevate Your<br/>Independence.</h3>
                    <ul className="space-y-10">
                      {[
                        { title: 'Own Your Clients', desc: 'No more algorithms. Your customers book you directly on your branded portal.', icon: Clock },
                        { title: 'Fixed Rate Trust', desc: 'Clients love knowing the rate upfront. Build long-term loyalty with every ride.', icon: Shield },
                        { title: 'Modern Interface', desc: 'Look like a global travel company while keeping the personal local touch.', icon: Zap }
                      ].map((item, idx) => (
                        <li key={idx} className="flex gap-6 group">
                          <div className="shrink-0 w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center border border-slate-100 group-hover:scale-110 group-hover:bg-teal-500 group-hover:text-white transition-all"><item.icon className="w-7 h-7" /></div>
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

            {/* --- BENEFITS SECTION --- */}
            <section className="bg-slate-950 py-32">
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-5xl md:text-[5rem] font-black text-white italic tracking-tighter uppercase mb-24 leading-[0.9]">
                    No Middleman.<br/>No Commission.
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {[
                      { icon: Smartphone, title: 'DIRECT BOOKING', desc: 'Instant WhatsApp messages containing everything you need to start the ride.' },
                      { icon: Zap, title: 'AI CONFIRMATION', desc: 'Smart automated responses that let customers know you have received their request.' },
                      { icon: Globe, title: 'SECURE REVENUE', desc: 'Keep 100% of your earnings. Your app, your business, your profit.' }
                    ].map((benefit, idx) => (
                      <div key={idx} className="bg-[#0f172a]/40 backdrop-blur-md p-14 rounded-[3.5rem] border border-white/5 hover:bg-white/[0.03] transition-all group">
                        <div className="w-16 h-16 bg-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-10 text-teal-950 shadow-[0_0_20px_rgba(20,184,166,0.2)] group-hover:scale-110 transition-transform">
                            <benefit.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-6 uppercase italic tracking-widest">{benefit.title}</h3>
                        <p className="text-slate-400 font-medium leading-relaxed text-lg">{benefit.desc}</p>
                      </div>
                    ))}
                </div>
                <div className="mt-24">
                  <button onClick={() => setIsPricingOpen(true)} className="px-16 py-6 bg-teal-500 text-teal-950 text-xl font-black rounded-full hover:bg-teal-400 transition-all uppercase tracking-widest shadow-[0_0_30px_rgba(20,184,166,0.3)] active:scale-95">
                    Start 3-Month Free Trial
                  </button>
                </div>
              </div>
            </section>

            <footer className="bg-slate-950 py-12 border-t border-white/5">
              <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-3">
                  <div className="bg-teal-600 p-2 rounded-xl">
                      <Car className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-white tracking-tight uppercase">MyPrivateRide</span>
                </div>
                <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                  &copy; {new Date().getFullYear()} MyPrivateRide Australia AU.
                </p>
                <div className="flex gap-6">
                  <button onClick={() => setIsPricingOpen(true)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Pricing</button>
                  <a href="mailto:s.manny1440@gmail.com" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Support</a>
                </div>
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
    document.title = "MyPrivateRide - Direct Driver Booking";
    try { window.history.pushState({}, '', window.location.pathname); } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentDriver) {
    return <DriverApp driver={currentDriver} onBack={handleBackToLanding} />;
  }
  return <LandingPage onDriverSelect={handleDriverSelect} />;
};

export default App;
