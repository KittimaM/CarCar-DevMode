import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginImg from "../../assets/login-2.jpeg";
import { GetAdminGeneralSetting, PostCustomerLogin } from "../Api";

const CustomerLogin = () => {
  const [errors, setErrors] = useState();
  const [settings, setSettings] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    GetAdminGeneralSetting().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setSettings(msg[0]);
      } else {
        console.log(data);
      }
    });
  }, []);
  const handleLogin = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      phone: data.get("phone"),
      password: data.get("password"),
      customer_failed_login_limit: settings.customer_failed_login_limit,
      customer_user_login_mins_limit: settings.customer_user_login_mins_limit,
    };
    PostCustomerLogin(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        localStorage.setItem("token", msg);
        navigate("/customer/main");
      } else {
        setErrors(msg);
      }
    });
  };
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
        <div className="hidden sm:block">
          <img className="w-full h-full object " src={LoginImg} alt="" />
        </div>

        <div className="bg-gray-100 flex flex-col justify-center">
          <form
            onSubmit={handleLogin}
            className="max-w-[400px] w-full mx-auto bg-white p-4"
          >
            <h1 className="text-4xl font-bold text-center py-6">Login</h1>

            <label className="form-control w-full flex flex-col p-2">
              <div className="label">
                <span className="label-text">Phone Number</span>
              </div>
              <input
                type="text"
                name="phone"
                className="input input-bordered w-full max-w-xs"
              />
            </label>

            <label className="form-control w-full flex flex-col p-2 ">
              <div className="label">
                <span className="label-text">Password</span>
              </div>

              <input
                type="password"
                name="password"
                className="input input-bordered w-full max-w-xs"
              />
            </label>
            <label className="form-control w-full flex flex-col p-2 ">
              {errors && <p className="mt-1 text-red-500 text-sm">{errors}</p>}
            </label>

            <div className="py-4">
              <button className="btn btn-warning w-full" type="submit">
                LOGIN
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CustomerLogin;
