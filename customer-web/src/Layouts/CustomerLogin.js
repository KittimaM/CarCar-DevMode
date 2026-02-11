import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetAdminGeneral, PostCustomerLogin } from "../Modules/Api";
import LoginImg from "../assets/carbukilogo.jpg";

const CustomerLogin = () => {
  const [errors, setErrors] = useState();
  const [settings, setSettings] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    sessionStorage.clear();
    GetAdminGeneral().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
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
      customer_failed_login_limit: settings?.customer_failed_login_limit,
      customer_user_login_mins_limit: settings?.customer_user_login_mins_limit,
    };

    PostCustomerLogin(jsonData).then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        sessionStorage.setItem("token", msg);
        navigate("/customer/main");
      } else {
        setErrors(msg);
      }
    });
  };
  return (
    <>
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center">
        <form
          onSubmit={handleLogin}
          className="max-w-[800px] w-full mx-auto flex flex-col lg:flex-row rounded-lg overflow-hidden lg:shadow-lg "
        >
          {/* ================== IMAGE: on top for smallest/sm/md (same width & height as form); left on lg+ ================== */}
          <div className="block w-full max-w-[400px] mx-auto flex-1 min-h-0 lg:max-w-[400px] lg:mx-0 lg:flex-none lg:shrink-0">
            <img src={LoginImg} alt="Login" className="w-full h-full object-cover rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none aspect-square lg:aspect-auto lg:min-h-[320px]" />
          </div>

          {/* ================== FORM: same width as image when stacked; right on lg+ ================== */}
          <div className="bg-white p-4 shadow-lg rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none flex flex-col justify-center w-full max-w-[400px] mx-auto flex-1 min-h-0 gap-y-2 lg:max-w-[400px] lg:flex-none">
            <h1 className="text-4xl font-bold text-center py-6">Login</h1>

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

            <label className="form-control w-full flex flex-col  ">
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
              <button className="btn w-full bg-[#0866FF] text-[#F1F5F8] border-none hover:bg-[#647173]" type="submit">
                LOGIN
              </button>
            </div>

            <div className="text-center">
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="link link-primary font-medium"
                  onClick={() => navigate("/customer/register")}
                >
                  Register
                </button>
              </p>
            </div>

          </div>

        </form>
      </div>
    </>
  );
};

export default CustomerLogin;
