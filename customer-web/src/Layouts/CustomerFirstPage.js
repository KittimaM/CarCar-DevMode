import React, { useState } from "react";
import CustomerLogin from "./CustomerLogin";
import CustomerRegister from "./CustomerRegister";

const CustomerFirstPage = () => {
  const [login, setLogin] = useState(true);
  const [register, setRegister] = useState(false);

  const handleSelectedContent = (event) => {
    event.preventDefault();
    const { value } = event.target;
    setLogin(value === "login" ? true : false);
    setRegister(value === "register" ? true : false);
  };
  return (
    <>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">Carcare</a>
        </div>

        <div className="navbar-end">
          <button
            className="btn"
            value="login"
            onClick={handleSelectedContent}
            disabled={login}
          >
            Login
          </button>
          <button
            className="btn"
            value="register"
            onClick={handleSelectedContent}
            disabled={register}
          >
            register
          </button>
        </div>
      </div>
      {login && <CustomerLogin />}
      {register && <CustomerRegister />}
    </>
  );
};
export default CustomerFirstPage;
