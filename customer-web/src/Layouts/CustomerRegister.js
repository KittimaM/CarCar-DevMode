import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostAddCustomer, PostCustomerLogin } from "../Modules/Api";
import LoginImg from "../assets/carbukilogo.jpg";

const CustomerRegister = () => {
  const [errors, setErrors] = useState(null);
  const navigate = useNavigate();
  const handleRegister = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      name: data.get("name"),
      phone: data.get("phone"),
      email: data.get("email") || null,
      password: data.get("password"),
    };

    PostAddCustomer(jsonData).then((data) => {
      if (!data) return;
      const { status, msg } = data;
      if (status === "SUCCESS") {
        const loginData = {
          phone: jsonData.phone,
          password: jsonData.password,
        };
        PostCustomerLogin(loginData).then((loginRes) => {
          if (!loginRes) return;
          const { status: loginStatus, msg: loginMsg } = loginRes;
          if (loginStatus === "SUCCESS") {
            sessionStorage.setItem("token", loginMsg);
            navigate("/customer/main");
          } else {
            setErrors(loginMsg || "Login failed");
          }
        });
      } else if (status === "ER_DUP_ENTRY" || status === "WARNING") {
        setErrors(msg || "Already In System");
      } else {
        setErrors(msg || "Registration failed");
      }
    });
  };
  return (
    <>
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center">
        <form
          onSubmit={handleRegister}
          className="max-w-[800px] w-full mx-auto flex flex-col lg:grid lg:grid-cols-2 rounded-lg overflow-hidden lg:shadow-lg "
        >
          {/* ================== IMAGE ================== */}
          <div className="block w-full max-w-[400px] mx-auto lg:max-w-none lg:mx-0 min-h-0 overflow-hidden rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none lg:flex lg:flex-col lg:min-h-0 lg:h-full">
            <div className="w-full h-[200px] lg:flex-1 lg:min-h-0 lg:flex lg:items-center lg:justify-center overflow-hidden bg-gray-50">
              <img
                src={LoginImg}
                alt="Register"
                className="w-full h-full object-cover object-center lg:object-cover "
              />
            </div>
          </div>

          {/* ================== FORM ================== */}
          <div className="bg-white p-4 shadow-lg rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none flex flex-col justify-center w-full max-w-[400px] mx-auto flex-1 min-h-0 gap-y-2 lg:max-w-[400px] lg:flex-none">
            <h1 className="text-4xl font-bold text-center py-6">Register</h1>

            <label className="form-control w-full flex flex-col ">
              <div className="label ">
                <span className="label-text">Phone Number</span>
              </div>
              <input
                type="tel"
                name="phone"
                required
                placeholder="Type here"
                className="input input-bordered w-full"
              />
            </label>

            <label className="form-control w-full flex flex-col ">
              <div className="label">
                <span className="label-text">Name</span>
              </div>
              <input
                type="text"
                name="name"
                required
                placeholder="Type here"
                className="input input-bordered w-full"
              />
            </label>

            <label className="form-control w-full flex flex-col ">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                className="input input-bordered w-full"
              />
            </label>

            <label className="form-control w-full flex flex-col ">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                name="password"
                required
                placeholder="Type here"
                className="input input-bordered w-full"
              />
            </label>
            <label className="form-control w-full flex flex-col p-2 ">
              {errors && <p className="mt-1 text-red-500 text-sm">{errors}</p>}
            </label>

            <div className="mb-4">
              <button type="submit" className="btn w-full bg-[#0866FF] text-[#F1F5F8] border-none hover:bg-[#647173]">
                REGISTER
              </button>
            </div>

            <div className="text-center">
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  className="link link-primary font-medium"
                  onClick={() => navigate("/customer/login")}
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default CustomerRegister;
