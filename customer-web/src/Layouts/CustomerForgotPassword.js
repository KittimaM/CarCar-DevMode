import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PostForgotPassword } from "../Modules/Api";
import LoginImg from "../assets/carbukilogo.jpg";

const CustomerForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    PostForgotPassword({ email: email.trim() }).then((data) => {
      setLoading(false);
      if (data && data.status === "SUCCESS") {
        setMessage(data.msg);
      } else if (data && data.msg) {
        setMessage(data.msg);
      }
    });
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] lg:max-w-[800px] mx-auto flex flex-col lg:grid lg:grid-cols-2 rounded-lg overflow-hidden lg:shadow-lg bg-white lg:max-h-[90vh]">
        <div className="block w-full mx-auto lg:max-w-none lg:mx-0 min-h-0 overflow-hidden rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none lg:flex lg:flex-col lg:min-h-0">
          <div className="w-full h-[200px] lg:h-full lg:min-h-[280px] lg:flex lg:items-center lg:justify-center overflow-hidden bg-gray-50">
            <img
              src={LoginImg}
              alt="Forgot password"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        <div className="p-6 shadow-lg rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none flex flex-col justify-center w-full gap-y-2">
          <h1 className="text-4xl font-bold text-center py-6">Forgot password</h1>
          <p className="text-gray-600 text-sm text-center -mt-4">
            Enter your email and we'll send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label className="form-control w-full flex flex-col">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="input input-bordered w-full"
              />
            </label>
            {message && (
              <p className="text-sm text-gray-700 bg-gray-100 p-2 rounded">{message}</p>
            )}
            <div className="mb-4 mt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn w-full bg-[#0866FF] text-[#F1F5F8] border-none hover:bg-[#647173]"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </div>
          </form>
          <div className="text-center">
            <button
              type="button"
              className="link link-primary font-medium"
              onClick={() => navigate("/customer/login")}
            >
              Back to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForgotPassword;
