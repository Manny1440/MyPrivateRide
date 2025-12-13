import React, { useState, useEffect } from 'react';
import BookingForm from './components/BookingForm';
import { drivers } from './drivers';
import { DriverProfile } from './types';
import { Star, Shield, Clock, Smile, Menu, X, Phone, Mail, Check, Zap, Globe, Smartphone, Car, ArrowLeft, WifiOff, QrCode, Download } from 'lucide-react';

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
    <div className="bg-yellow-500 text-white text-center py-2 px-4 text-sm font-medium flex items-center justify-center gap-2 fixed bottom-0 w-full z-[100]">
      <WifiOff className="w-4 h-4" />
      You are offline. SMS & WhatsApp bookings will still work!
    </div>
  );
};

const PricingModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSignup = (plan: string) => {
    const subject = `Sign me up for MyPrivateRide (${plan} Plan) - 3 Month Trial`;
    const body = `Hi,\n\nI want to claim the Special 3-Month Free Trial for the ${plan} plan.\n\nMy Details:\nName:\nPhone:\nLocation:`;
    window.location.href = `mailto:s.manny1440@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start justify-between mb-8">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-2xl leading-6 font-bold text-gray-900" id="modal-title">
                  Turn your Taxi into a Business
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Stop relying on Uber/Didi commissions. Build your own private client list with a professional booking app.
                  </p>
                  <div className="mt-3 inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                    🎉 Special Offer: First 3 Months FREE
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="bg-gray-100 rounded-full p-2 hover:bg-gray-200 transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Starter Tier */}
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold text-gray-900">Starter</h4>
                <p className="text-3xl font-bold text-brand-600 mt-2">$29<span className="text-sm text-gray-500 font-normal">/mo</span></p>
                <p className="text-sm text-gray-500 mt-2">Perfect for solo drivers building a list.</p>
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Personal Booking Link</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Email Notifications</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Standard Theme</li>
                </ul>
                <button onClick={() => handleSignup('Starter')} className="w-full mt-8 bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-gray-800">Start 3-Month Free Trial</button>
              </div>

              {/* Pro Tier */}
              <div className="border-2 border-brand-500 rounded-xl p-6 relative shadow-xl transform scale-105 bg-white">
                <div className="absolute top-0 right-0 bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
                <h4 className="text-lg font-semibold text-gray-900">Professional</h4>
                <p className="text-3xl font-bold text-brand-600 mt-2">$39<span className="text-sm text-gray-500 font-normal">/mo</span></p>
                <p className="text-sm text-gray-500 mt-2">Automate your business.</p>
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Everything in Starter</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> <strong className="text-gray-900">AI Confirmations</strong></li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> SMS Reminders</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> WhatsApp Generator</li>
                </ul>
                <button onClick={() => handleSignup('Professional')} className="w-full mt-8 bg-brand-600 text-white py-2 rounded-lg font-medium hover:bg-brand-700 shadow-lg shadow-brand-500/30">Start 3-Month Free Trial</button>
              </div>

              {/* Fleet Tier */}
              <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <h4 className="text-lg font-semibold text-gray-900">Fleet</h4>
                <p className="text-3xl font-bold text-brand-600 mt-2">$99<span className="text-sm text-gray-500 font-normal">/mo</span></p>
                <p className="text-sm text-gray-500 mt-2">For multiple drivers & dispatch.</p>
                <ul className="mt-6 space-y-3 text-sm text-gray-600">
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Multi-driver Login</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Calendar Sync</li>
                  <li className="flex items-center"><Check className="w-4 h-4 text-green-500 mr-2" /> Custom Domain Name</li>
                </ul>
                <button onClick={() => handleSignup('Fleet')} className="w-full mt-8 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50">Contact Sales</button>
              </div>
            </div>
            <p className="text-center text-xs text-gray-400">
              No credit card required for trial. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DriverToolsModal: React.FC<{ isOpen: boolean; onClose: () => void; driver: DriverProfile }> = ({ isOpen, onClose, driver }) => {
  if (!isOpen) return null;

  // Generate QR Code URL using a free reliable API
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(window.location.href)}`;

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
            <div className="flex justify-between items-start mb-4">
               <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                 <QrCode className="w-5 h-5 text-brand-600" />
                 Driver Marketing Kit
               </h3>
               <button onClick={onClose} className="bg-gray-100 rounded-full p-1 hover:bg-gray-200">
                 <X className="w-5 h-5 text-gray-500" />
               </button>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white p-4 border-2 border-dashed border-gray-300 rounded-xl mb-4">
                <img src={qrUrl} alt="Driver QR Code" className="w-48 h-48" />
              </div>
              <p className="text-sm text-center text-gray-600 mb-6">
                This QR code links directly to <strong>{driver.businessName}</strong>.
              </p>

              <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4 w-full">
                <strong>💡 How to use:</strong>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Show this to passengers to scan.</li>
                  <li>Save the image and print it on business cards.</li>
                  <li>Share it on your WhatsApp status.</li>
                </ul>
              </div>

              <a 
                href={qrUrl} 
                download="my-qr-code.png"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors"
              >
                <Download className="w-4 h-4" />
                Open Image to Save
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SUB-APPS --- */

// 1. THE DRIVER APP (What customers see when they book Harry)
const DriverApp: React.FC<{ driver: DriverProfile; onBack: () => void }> = ({ driver, onBack }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  // Standardized Theme Colors (Teal for everyone)
  const themeClass = 'text-brand-500';
  const buttonClass = 'bg-brand-500 hover:bg-brand-400 text-brand-950';

  const scrollToBooking = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById('book-now');
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <OfflineBanner />
      <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
      <DriverToolsModal isOpen={isToolsOpen} onClose={() => setIsToolsOpen(false)} driver={driver} />
      
      {/* Navigation */}
      <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <div className="bg-brand-500 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-brand-950" />
              </div>
              <span className="font-bold text-xl tracking-tight">{driver.businessName}</span>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#home" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">Home</a>
                <a href="#about" className="hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">Why Me?</a>
                <a href="#book-now" onClick={scrollToBooking} className={`${buttonClass} px-4 py-2 rounded-md text-sm font-bold transition-colors`}>Book Now</a>
              </div>
            </div>

            <div className="-mr-2 flex md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-800 focus:outline-none">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={driver.heroImage}
            alt="Premium Car Interior" 
            className="w-full h-full object-cover opacity-30 transform -scale-x-100"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 to-slate-900/40"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="md:w-2/3">
            <div className="inline-flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm px-4 py-1.5 rounded-full text-slate-100 text-sm font-medium mb-6 border border-slate-700">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Rated #1 for Service in {driver.location}
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
              {driver.tagline}
            </h1>
            <p className="mt-4 max-w-lg text-xl text-gray-300 mb-8">
              Skip the cancellations and surge pricing. Book {driver.driverName} directly for a reliable, safe {driver.vehicleType} experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <a href="#book-now" onClick={scrollToBooking} className={`inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-lg ${buttonClass} md:py-4 md:text-lg md:px-10 transition-all shadow-lg cursor-pointer`}>
                  Book {driver.driverName}
                </a>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-base ${themeClass} font-semibold tracking-wide uppercase`}>The Difference</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why clients prefer {driver.businessName}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Features remain generic but relevant to all drivers */}
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-lg leading-6 font-bold text-gray-900 mb-2">Immaculate Cleanliness</h3>
              <p className="text-gray-500">My vehicle is detailed daily. Experience a fresh, spotless environment every time.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-6">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-lg leading-6 font-bold text-gray-900 mb-2">Always On Time</h3>
              <p className="text-gray-500">Reliability is my hallmark. I arrive early so you never have to worry.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 text-yellow-600 mb-6">
                <Smile className="h-8 w-8" />
              </div>
              <h3 className="text-lg leading-6 font-bold text-gray-900 mb-2">Friendly Service</h3>
              <p className="text-gray-500">A professional yet warm atmosphere. I adapt to your needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="book-now" className="py-16 bg-slate-50 relative scroll-mt-24">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <BookingForm driver={driver} />
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">{driver.businessName}</h3>
              <p className="text-slate-400 max-w-sm mb-6">
                Providing exceptional private transport services in {driver.location}.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Contact Info</h4>
              <ul className="space-y-4">
                <li className="flex items-center text-slate-300">
                  <Phone className="h-5 w-5 mr-3 text-brand-500" />
                  <span>{driver.phone}</span>
                </li>
                <li className="flex items-center text-slate-300">
                  <Mail className="h-5 w-5 mr-3 text-brand-500" />
                  <span>{driver.email}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} {driver.businessName}. Powered by MyPrivateRide.
            </p>
            <div className="flex gap-4">
                 <button 
                  onClick={() => setIsToolsOpen(true)}
                  className="text-xs text-brand-400 hover:text-brand-300 transition-colors bg-slate-800 px-3 py-1 rounded-full border border-slate-700 hover:border-brand-500 flex items-center gap-1"
                >
                  <QrCode className="w-3 h-3" /> Driver Tools
                </button>
                <button 
                onClick={() => setIsPricingOpen(true)}
                className="text-xs text-brand-400 hover:text-brand-300 transition-colors bg-slate-800 px-3 py-1 rounded-full border border-slate-700 hover:border-brand-500"
                >
                Get your own app
                </button>
                {/* Back button for demo navigation */}
                <button onClick={onBack} className="text-xs text-slate-400 hover:text-white flex items-center gap-1">
                    <ArrowLeft className="w-3 h-3" /> Back to Demo List
                </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// 2. THE LANDING PAGE (Selling the software to drivers)
const LandingPage: React.FC<{ onDriverSelect: (id: string) => void }> = ({ onDriverSelect }) => {
    const [isPricingOpen, setIsPricingOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <OfflineBanner />
            <PricingModal isOpen={isPricingOpen} onClose={() => setIsPricingOpen(false)} />
            
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-brand-600 p-2 rounded-lg">
                            <Car className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">MyPrivateRide</span>
                    </div>
                    {/* Header Action Button - Opens Pricing Modal now */}
                    <div className="flex gap-4">
                        <button onClick={() => setIsPricingOpen(true)} className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-700">Start Free Trial</button>
                    </div>
                </div>
            </nav>

            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-block bg-brand-50 text-brand-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-2">
                        For Professional Drivers in Australia 🇦🇺
                    </div>
                    <div className="mb-8">
                        <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold text-sm border border-green-200 animate-pulse">
                            🎉 Special Launch Offer: Get 3 Months FREE
                        </span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
                        Your Own <span className="text-brand-600">Private Booking App</span><br />
                        in 60 Seconds.
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
                        Stop losing 30% to Uber. Give your private clients a professional way to book you directly. Includes AI confirmations and WhatsApp integration.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => setIsPricingOpen(true)} className="bg-brand-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-brand-700 shadow-xl shadow-brand-500/20 transition-all">
                            Create My App Now
                        </button>
                    </div>
                    
                    <div className="mt-16 text-sm text-gray-500">
                        <p className="mb-4 font-semibold uppercase tracking-wider">See Live Demos</p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <button onClick={() => onDriverSelect('harry')} className="flex items-center gap-2 bg-slate-50 border border-gray-200 px-4 py-2 rounded-lg hover:bg-white hover:border-brand-500 transition-colors cursor-pointer group">
                                <span className="w-2 h-2 rounded-full bg-teal-500 group-hover:scale-125 transition-transform"></span> Harry's PrivateRide
                            </button>
                            <button onClick={() => onDriverSelect('gary')} className="flex items-center gap-2 bg-slate-50 border border-gray-200 px-4 py-2 rounded-lg hover:bg-white hover:border-brand-500 transition-colors cursor-pointer group">
                                <span className="w-2 h-2 rounded-full bg-teal-500 group-hover:scale-125 transition-transform"></span> Gary's PrivateRide
                            </button>
                            <button onClick={() => onDriverSelect('tom')} className="flex items-center gap-2 bg-slate-50 border border-gray-200 px-4 py-2 rounded-lg hover:bg-white hover:border-brand-500 transition-colors cursor-pointer group">
                                <span className="w-2 h-2 rounded-full bg-teal-500 group-hover:scale-125 transition-transform"></span> Tom's PrivateRide
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            
            <section className="bg-slate-50 py-20">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-12">Everything you need to go independent</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-6 text-green-600"><Smartphone /></div>
                            <h3 className="font-bold text-xl mb-3">WhatsApp Integration</h3>
                            <p className="text-gray-500">Bookings arrive directly on your phone via WhatsApp or SMS. No complex dashboards.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-6 text-blue-600"><Zap /></div>
                            <h3 className="font-bold text-xl mb-3">AI Auto-Response</h3>
                            <p className="text-gray-500">Our AI writes professional email replies for you instantly, impressing your clients.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-6 text-purple-600"><Globe /></div>
                            <h3 className="font-bold text-xl mb-3">Your Own Brand</h3>
                            <p className="text-gray-500">Your name, your photo, your business. We are invisible to your customers.</p>
                        </div>
                    </div>
                </div>
            </section>

             {/* Footer for Landing Page */}
             <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-4">
                         <Car className="w-5 h-5 text-brand-600" />
                         <span className="font-bold text-lg text-slate-900">MyPrivateRide</span>
                    </div>
                    <div className="flex gap-8 mb-8">
                        <button onClick={() => setIsPricingOpen(true)} className="text-gray-600 hover:text-brand-600 text-sm font-medium">Pricing</button>
                    </div>
                    <p className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} MyPrivateRide. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

/* --- MAIN ROUTER --- */

const App: React.FC = () => {
  const [currentDriver, setCurrentDriver] = useState<DriverProfile | null>(null);

  useEffect(() => {
    // Check URL params for ?driver=id
    const params = new URLSearchParams(window.location.search);
    const driverId = params.get('driver');
    
    if (driverId) {
      const foundDriver = drivers.find(d => d.id === driverId);
      if (foundDriver) {
        setCurrentDriver(foundDriver);
        // Update Page Title
        document.title = foundDriver.businessName;
      }
    }
  }, []);

  const handleDriverSelect = (id: string) => {
    const foundDriver = drivers.find(d => d.id === id);
    if (foundDriver) {
        setCurrentDriver(foundDriver);
        document.title = foundDriver.businessName;
        try {
            window.history.pushState({}, '', `?driver=${id}`);
        } catch (e) {
            // ignore
        }
    }
  };

  const handleBackToLanding = () => {
    setCurrentDriver(null);
    document.title = "MyPrivateRide";
    try {
        window.history.pushState({}, '', window.location.pathname);
    } catch (e) {
        // ignore
    }
  };

  // ROUTING LOGIC
  if (currentDriver) {
    return <DriverApp driver={currentDriver} onBack={handleBackToLanding} />;
  }

  return <LandingPage onDriverSelect={handleDriverSelect} />;
};

export default App;
