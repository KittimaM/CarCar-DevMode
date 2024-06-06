import React, { useEffect, useState } from "react";
import { Button } from "../Module";
import { DeleteCustomerBooking, GetAllCustomerBooking } from "../Api";

const CustomerIndex = () => {
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    fetchCustomerBooking();
  }, []);

  const fetchCustomerBooking = () => {
    GetAllCustomerBooking().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setBooking(msg);
      } else {
        setBooking(null);
        console.log(data);
      }
    });
  };

  const handleDeleteCustomerBooking = (event) => {
    event.preventDefault();
    const jsonData = {
      id: event.target.value,
    };
    DeleteCustomerBooking(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchCustomerBooking();
      } else {
        console.log(data);
      }
    });
  };
  return (
    <>
      <div className="navbar bg-neutral text-neutral-content">
        <div className="flex-1">
          <a to="/customer/index" className="btn btn-ghost text-xl">Carcare</a>
        </div>
        <div className="flex-none gap-2">
          {/* <div className="form-control">
                  <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                </div> */}
          <div>
            <Button to="/customer/car" name="Customer Car" />
          </div>
          <div>
            <Button to="/customer/profile" name="Profile" />
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
              <div className="badge m-2">Phattraporn Bunjongket</div>
              {/* <li>
                      <a className="justify-between">
                        Profile
                      </a>
                    </li> */}
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

      <div className="hero min-h-screen bg-[url('https://images.pexels.com/photos/1056516/pexels-photo-1056516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')]">
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">
              OPEN EVERYDAY 10.00-20.00
            </h1>
            <p className="mb-5">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>

            <Button
              to="/customer/booking"
              className="btn btn-warning"
              name="Booking"
            >
              BOOK HERE!
            </Button>
          </div>
        </div>
      </div>

      <div>
        {/* <Button to="/customer/booking" name="Booking" className="bg-black"/>
              <Button to="/customer/car" name="Customer Car" /> */}
        {booking && (
          <table>
            <thead>
              <tr>
                <td>id</td>
                <td>car_no</td>
                <td>start_service_datetime</td>
                <td>processing_status</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {booking.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.car_no}</td>
                  <td>{item.start_service_datetime}</td>
                  <td>{item.processing_status}</td>
                  <td>
                    {item.processing_status == "Waiting" && (
                      <button
                        className="btn"
                        onClick={handleDeleteCustomerBooking}
                        value={item.id}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default CustomerIndex;
