import React, { useEffect, useState } from "react";
import { GetCustomerProfile } from "../Api";
import CustomerCar from "./CustomerCar";
import CustomerProfile from "./CustomerProfile";
import CustomerBooking from "./CustomerBooking";

const CustomerIndex = () => {
  const [profile, setProfile] = useState();
  const [isSelectedCustomerCar, setIsSelectedCustomerCar] = useState(false);
  const [isSelectedProfile, setIsSelectedProfile] = useState(false);
  const [isSelectedBooking, setIsSelectedBooking] = useState(false);
  const [isSelectedIndex, setIsSelectedIndex] = useState(true);

  useEffect(() => {
    GetCustomerProfile().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setProfile(msg[0]);
      } else {
        console.log(data);
      }
    });
  }, []);

  const handleSelectedContent = (event) => {
    event.preventDefault();
    const { value } = event.target;
    setIsSelectedCustomerCar(value === "customer_car" ? true : false);
    setIsSelectedProfile(value === "profile" ? true : false);
    setIsSelectedBooking(value === "booking" ? true : false);
    setIsSelectedIndex(value === "index" ? true : false);
  };
  return (
    <>
      <div className="navbar bg-neutral text-neutral-content">
        <div className="flex-1">
          <button value="index" className="btn" onClick={handleSelectedContent}>
            Carcare
          </button>
        </div>
        <div className="flex-none gap-2">
          <div>
            <button
              className="btn"
              value="customer_car"
              onClick={handleSelectedContent}
            >
              Customer's car
            </button>
          </div>
          <div>
            <button
              className="btn"
              value="profile"
              onClick={handleSelectedContent}
            >
              Profile
            </button>
          </div>
          <div>
            <button
              className="btn"
              value="booking"
              onClick={handleSelectedContent}
            >
              Booking
            </button>
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <div className="badge m-2">{profile && profile.name}</div>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        {isSelectedCustomerCar && <CustomerCar />}
        {isSelectedProfile && <CustomerProfile />}
        {isSelectedBooking && <CustomerBooking />}
        {isSelectedIndex && (
          <div>
            <div className="hero min-h-screen bg-[url('https://images.pexels.com/photos/1056516/pexels-photo-1056516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')]">
              <div className="hero-overlay bg-opacity-60"></div>
              <div className="hero-content text-center text-neutral-content">
                <div className="max-w-md">
                  <h1 className="mb-5 text-5xl font-bold">
                    OPEN EVERYDAY 10.00-20.00
                  </h1>
                  <p className="mb-5">
                    Provident cupiditate voluptatem et in. Quaerat fugiat ut
                    assumenda excepturi exercitationem quasi. In deleniti eaque
                    aut repudiandae et a id nisi.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomerIndex;
