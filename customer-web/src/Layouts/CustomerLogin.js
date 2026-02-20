import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { GetAdminGeneral, PostCustomerLogin } from "../Modules/Api";
import LoginImg from "../assets/carbukilogo.jpg";

const LINE_LOGIN_URL =
  (process.env.REACT_APP_NODE_API_URL || "http://localhost:5000/") + "customer/line/auth";

const CustomerLogin = () => {
  const [errors, setErrors] = useState();
  const [settings, setSettings] = useState();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const errorFromUrl = searchParams.get("error");
    if (token) {
      sessionStorage.setItem("token", token);
      navigate("/customer/main", { replace: true });
      return;
    }
    if (errorFromUrl) {
      setErrors(decodeURIComponent(errorFromUrl));
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    if (searchParams.get("token")) return;
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
  }, [searchParams]);
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
          className="max-w-[800px] w-full mx-auto flex flex-col lg:grid lg:grid-cols-2 rounded-lg overflow-hidden lg:shadow-lg "
        >
          {/* ================== IMAGE: cropped on sm/md; on lg fills same-size grid cell as form ================== */}
          <div className="block w-full max-w-[400px] mx-auto lg:max-w-none lg:mx-0 min-h-0 overflow-hidden rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none lg:flex lg:flex-col lg:min-h-0 lg:h-full">
            <div className="w-full h-[200px] lg:flex-1 lg:min-h-0 lg:flex lg:items-center lg:justify-center overflow-hidden bg-gray-50">
              <img
                src={LoginImg}
                alt="Login"
                className="w-full h-full object-cover object-center lg:object-cover "
              />
            </div>
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

            <div className="text-right">
              <button
                type="button"
                className="link link-primary text-sm"
                onClick={() => navigate("/customer/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            <div className="mb-4">
              <button className="btn w-full bg-[#0866FF] text-[#F1F5F8] border-none hover:bg-[#647173]" type="submit">
                LOGIN
              </button>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-500">หรือ</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <a
                href={LINE_LOGIN_URL}
                className="btn w-full bg-[#06C755] text-white border-none hover:bg-[#05b04c] flex items-center justify-center gap-2"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 13.393 24 11.994 24 10.314" />
                </svg>
                 LINE
              </a>
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
