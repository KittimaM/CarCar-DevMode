import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetCustomerProfile } from "../Modules/Api";
import CustomerCar from "./CustomerCar/CustomerCar";
import CustomerProfile from "./CustomerProfile";
import CustomerBooking from "./CustomerBooking";

const CustomerIndex = () => {
  const [, setProfile] = useState();
  const [active, setActive] = useState("index");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    GetCustomerProfile().then(({ status, msg }) => {
      if (status === "SUCCESS") setProfile(msg[0]);
    });
  }, [navigate]);

  const handleSelect = (value) => setActive(value);

  const handleSelectAndClose = (value) => {
    handleSelect(value);
    document.activeElement?.blur?.(); // Close mobile dropdown after selection
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ================= NAVBAR ================= */}
      <header className="bg-white border-b border-gray-200 shadow-sm px-3 sm:px-4 md:px-6 lg:px-8 min-h-12 sm:min-h-14 sticky top-0 z-50 flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0 flex items-center">
          <button
            className="py-2 px-2 sm:px-4 -ml-2 text-sm sm:text-base font-semibold text-gray-900 bg-transparent border-none rounded-md cursor-pointer transition-colors hover:bg-gray-100 truncate"
            onClick={() => handleSelect("index")}
          >
            🚗 Carcare
          </button>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-0 sm:gap-1 lg:gap-2 flex-shrink-0">
          <button
            className={`py-2 px-3 sm:px-4 text-xs sm:text-[0.9375rem] font-medium rounded-md cursor-pointer transition-colors border-none whitespace-nowrap ${
              active === "customer_car" ? "bg-gray-100 text-gray-900" : "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
            onClick={() => handleSelect("customer_car")}
          >
            <span >MyCars</span>
          </button>
          <button
            className={`py-2 px-3 sm:px-4 text-xs sm:text-[0.9375rem] font-medium rounded-md cursor-pointer transition-colors border-none whitespace-nowrap ${
              active === "profile" ? "bg-gray-100 text-gray-900" : "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
            onClick={() => handleSelect("profile")}
          >
            Profile
          </button>
          <button
            className={`py-2 px-3 sm:px-4 text-xs sm:text-[0.9375rem] font-medium rounded-md cursor-pointer transition-colors border-none whitespace-nowrap ${
              active === "booking" ? "bg-gray-100 text-gray-900" : "bg-transparent text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }`}
            onClick={() => handleSelect("booking")}
          >
            Booking
          </button>
          <button
            className="py-2 px-3 sm:px-4 text-xs sm:text-[0.9375rem] font-medium rounded-md cursor-pointer transition-colors border-none bg-transparent text-gray-700 hover:bg-red-50 hover:text-red-600 whitespace-nowrap"
            onClick={() => {
              sessionStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden dropdown dropdown-end">
          <label tabIndex={0} className="p-2 min-w-[2.5rem] bg-transparent border-none rounded-md cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content menu-sm mt-3 p-2 w-[min(14rem,calc(100vw-2rem))] sm:w-56 text-sm sm:text-base right-0 left-auto bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <li>
              <button
                className="w-full text-left py-3 sm:py-3.5 px-4 text-sm sm:text-[0.9375rem] bg-transparent border-none text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 transition-colors touch-manipulation"
                onClick={() => handleSelectAndClose("customer_car")}
              >
                My Cars
              </button>
            </li>
            <li>
              <button
                className="w-full text-left py-3 sm:py-3.5 px-4 text-sm sm:text-[0.9375rem] bg-transparent border-none text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 transition-colors touch-manipulation"
                onClick={() => handleSelectAndClose("profile")}
              >
                Profile
              </button>
            </li>
            <li>
              <button
                className="w-full text-left py-3 sm:py-3.5 px-4 text-sm sm:text-[0.9375rem] bg-transparent border-none text-gray-700 rounded-md cursor-pointer hover:bg-gray-100 transition-colors touch-manipulation"
                onClick={() => handleSelectAndClose("booking")}
              >
                Booking
              </button>
            </li>
            <li>
              <button
                className="w-full text-left py-3 sm:py-3.5 px-4 text-sm sm:text-[0.9375rem] bg-transparent border-none text-red-600 rounded-md cursor-pointer hover:bg-red-50 transition-colors touch-manipulation"
                onClick={() => {
                  sessionStorage.clear();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-b from-slate-50 to-gray-100">
        {active === "customer_car" && (
          <div className="p-3 sm:p-5 md:p-6 lg:p-8 w-full max-w-6xl mx-auto transition-all duration-300">
            <div className="rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-sm shadow-md sm:shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8">
                <CustomerCar />
              </div>
            </div>
          </div>
        )}
        {active === "profile" && (
          <div className="p-3 sm:p-5 md:p-6 lg:p-8 w-full max-w-2xl mx-auto transition-all duration-300">
            <div className="rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-sm shadow-md sm:shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8">
                <CustomerProfile />
              </div>
            </div>
          </div>
        )}
        {active === "booking" && (
          <div className="p-3 sm:p-5 md:p-6 lg:p-8 w-full max-w-6xl mx-auto transition-all duration-300">
            <div className="rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-sm shadow-md sm:shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="p-4 sm:p-6 md:p-8">
                <CustomerBooking />
              </div>
            </div>
          </div>
        )}

        {/* ================= HERO ================= */}
        {active === "index" && (
          <div className="flex flex-col">
            <section
              className="relative w-full h-full min-h-[100dvh] flex items-center justify-center text-center bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url('https://images.pexels.com/photos/1056516/pexels-photo-1056516.jpeg')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
              <div className="relative z-10 px-4 sm:px-6 md:px-8 py-6 sm:py-10 md:py-12 max-w-lg w-full">
                <div className="rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl shadow-black/20 px-6 py-8 sm:px-10 sm:py-12 md:px-12 md:py-14">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-[0.2em] sm:tracking-widest text-white drop-shadow-lg">
                    OPEN EVERYDAY
                  </h1>
                  <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold mt-2 sm:mt-3 text-white/95 tracking-wide">
                    10.00 – 20.00
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-slate-200 mt-4 sm:mt-5 max-w-xs sm:max-w-sm mx-auto leading-relaxed px-1">
                    Provident cupiditate voluptatem et in. Quaerat fugiat ut
                    assumenda.
                  </p>
                  <button
                    className="mt-6 sm:mt-8 w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl bg-white text-slate-800 shadow-lg shadow-black/25 hover:bg-slate-100 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 touch-manipulation min-h-[44px] sm:min-h-0"
                    onClick={() => handleSelect("booking")}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </section>

            {/* Image Cards with Motion */}
            <section className="px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-16 bg-gradient-to-b from-slate-100 to-slate-50">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 text-center mb-8 sm:mb-10">
                  Our Services
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
                  <div
                    className="animate-card-in animate-card-in-delay-1 group rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                    style={{ backgroundImage: "url('https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg')", backgroundSize: "cover", backgroundPosition: "center" }}
                  >
                    <div className="aspect-[4/3] relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-white font-medium text-sm sm:text-base">Car Wash</p>
                        <p className="text-white/80 text-xs sm:text-sm">Spotless clean</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="animate-card-in animate-card-in-delay-2 group rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                    style={{ backgroundImage: "url('https://images.pexels.com/photos/6373434/pexels-photo-6373434.jpeg')", backgroundSize: "cover", backgroundPosition: "center" }}
                  >
                    <div className="aspect-[4/3] relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-white font-medium text-sm sm:text-base">Maintenance</p>
                        <p className="text-white/80 text-xs sm:text-sm">Expert care</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="animate-card-in animate-card-in-delay-3 group rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                    style={{ backgroundImage: "url('https://images.pexels.com/photos/4480505/pexels-photo-4480505.jpeg')", backgroundSize: "cover", backgroundPosition: "center" }}
                  >
                    <div className="aspect-[4/3] relative">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 bg-gradient-to-t from-black/70 to-transparent">
                        <p className="text-white font-medium text-sm sm:text-base">Detailing</p>
                        <p className="text-white/80 text-xs sm:text-sm">Premium finish</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Location & Map */}
            <section className="px-4 sm:px-6 md:px-8 py-10 sm:py-14 md:py-16 bg-gradient-to-b from-slate-50 to-slate-100">
              <div className="max-w-5xl mx-auto">
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 text-center mb-8 sm:mb-10">
                  Our Location
                </h2>
                <div className="rounded-xl sm:rounded-2xl bg-white shadow-md overflow-hidden border border-slate-100 flex flex-col sm:flex-row">
                  {/* Map - Left */}
                  <div className="sm:w-1/2 min-h-[240px] sm:min-h-[320px] flex-shrink-0">
                    <iframe
                      title="Carcare Location"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.63283246996!2d100.519272!3d13.736877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29c6553631c9f%3A0x3307f5853b379e84!2sBangkok%2C%20Thailand!5e0!3m2!1sen!2sth!4v1708400000000"
                      width="100%"
                      height="100%"
                      style={{ border: 0, minHeight: '240px' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full min-h-[240px] sm:min-h-[320px]"
                    />
                  </div>
                  {/* Location Name & Info - Right */}
                  <div className="sm:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                      Carcare Service Center
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                      📍 Bangkok, Thailand
                    </p>
                    <p className="text-slate-500 text-sm mb-2">
                      Open Everyday
                    </p>
                    <p className="text-slate-600 font-medium">
                      10:00 – 20:00
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-800 text-slate-300 py-6 sm:py-8 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-semibold text-white">🚗 Carcare</span>
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Carcare. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm">
            <button
              className="hover:text-white transition-colors"
              onClick={() => handleSelect("booking")}
            >
              Book
            </button>
            <button
              className="hover:text-white transition-colors"
              onClick={() => handleSelect("profile")}
            >
              Profile
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CustomerIndex;
