import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetAdminAdvanceSetting, PostAdminLogin } from "../Api";
import LoginImg from "../../assets/login-2.jpeg";

const AdminLogin = () => {
  const [errors, setErrors] = useState();
  const [settings, setSettings] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    GetAdminAdvanceSetting().then((data) => {
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
      username: data.get("username"),
      password: data.get("password"),
      staff_failed_login_limit: settings.staff_failed_login_limit,
      staff_user_login_mins_limit: settings.staff_user_login_mins_limit,
    };

    PostAdminLogin(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {       
        localStorage.setItem("token", msg.token);
        localStorage.setItem("username", msg.username);
        localStorage.setItem("role_name", msg.role_name);
        navigate("/admin/main");
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
            <h1 className="text-4xl font-bold text-center py-6">Login Admin</h1>

            <label className="form-control w-full flex flex-col p-2">
              <div className="label">
                <span className="label-text">Username</span>
              </div>
              <input
                type="text"
                name="username"
                required
                placeholder="Type here"
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
                required
                placeholder="Type here"
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

export default AdminLogin;
