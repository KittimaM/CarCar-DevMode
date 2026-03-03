import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetAdminGeneral, PostAdminLogin } from "./Modules/Api";
import LoginImg from "../assets/carbukilogo.jpg";

const AdminLogin = () => {
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
      username: data.get("username"),
      password: data.get("password"),
      staff_failed_login_limit: settings.staff_failed_login_limit,
      staff_user_login_mins_limit: settings.staff_user_login_mins_limit,
    };

    PostAdminLogin(jsonData).then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        sessionStorage.setItem("token", msg.token);
        sessionStorage.setItem("staff_id", msg.staff_id);
        sessionStorage.setItem("username", msg.username);
        sessionStorage.setItem("is_system_id", msg.is_system_id);
        navigate("/admin/main");
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
            <h1 className="text-4xl font-bold text-center py-6">Login Admin</h1>

            <label className="form-control w-full flex flex-col ">
              <div className="label ">
                <span className="label-text">Username</span>
              </div>
              <input
                type="text"
                name="username"
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
          </div>

        </form>
      </div>
    </>
  );
};

export default AdminLogin;
