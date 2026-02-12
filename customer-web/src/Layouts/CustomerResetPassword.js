import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { PostResetPassword } from "../Modules/Api";
import LoginImg from "../assets/carbukilogo.jpg";

const CustomerResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }
    if (!token) {
      setMessage("Invalid reset link. Request a new one from the login page.");
      return;
    }
    setLoading(true);
    PostResetPassword({ token, newPassword: password }).then((data) => {
      setLoading(false);
      if (data && data.status === "SUCCESS") {
        setSuccess(true);
        setMessage(data.msg);
      } else {
        setMessage((data && data.msg) || "Something went wrong.");
      }
    });
  };

  if (!token) {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <h1 className="text-xl font-bold mb-2">Invalid link</h1>
          <p className="text-gray-600 mb-4">
            This reset link is missing or invalid. Please use "Forgot password?" on the login page to get a new link.
          </p>
          <button
            type="button"
            className="btn bg-[#0866FF] text-white"
            onClick={() => navigate("/customer/login")}
          >
            Go to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center">
      <div className="max-w-[800px] w-full mx-auto flex flex-col lg:grid lg:grid-cols-2 rounded-lg overflow-hidden lg:shadow-lg bg-white">
        <div className="block w-full max-w-[400px] mx-auto lg:max-w-none lg:mx-0 min-h-0 overflow-hidden rounded-t-lg lg:rounded-l-lg lg:rounded-tr-none lg:flex lg:flex-col lg:min-h-0 lg:h-full">
          <div className="w-full h-[200px] lg:flex-1 lg:min-h-0 lg:flex lg:items-center lg:justify-center overflow-hidden bg-gray-50">
            <img
              src={LoginImg}
              alt="Reset password"
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
        <div className="p-4 shadow-lg rounded-b-lg lg:rounded-r-lg lg:rounded-bl-none flex flex-col justify-center w-full max-w-[400px] mx-auto flex-1 min-h-0 gap-y-2 lg:max-w-[400px] lg:flex-none">
          <h1 className="text-4xl font-bold text-center py-6">Set new password</h1>
          {success ? (
            <>
              <p className="text-gray-700 mb-4">{message}</p>
              <button
                type="button"
                className="btn w-full bg-[#0866FF] text-[#F1F5F8] border-none hover:bg-[#647173]"
                onClick={() => navigate("/customer/login")}
              >
                Go to login
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <label className="form-control w-full flex flex-col">
                <div className="label">
                  <span className="label-text">New password</span>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  className="input input-bordered w-full"
                />
              </label>
              <label className="form-control w-full flex flex-col">
                <div className="label">
                  <span className="label-text">Confirm password</span>
                </div>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Same as above"
                  className="input input-bordered w-full"
                />
              </label>
              {message && (
                <p className="text-sm text-red-600">{message}</p>
              )}
              <div className="mb-4 mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-full bg-[#0866FF] text-[#F1F5F8] border-none hover:bg-[#647173]"
                >
                  {loading ? "Updating…" : "Update password"}
                </button>
              </div>
            </form>
          )}
          {!success && (
            <div className="text-center">
              <button
                type="button"
                className="link link-primary font-medium"
                onClick={() => navigate("/customer/login")}
              >
                Back to login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerResetPassword;
