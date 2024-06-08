import React from "react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">Carcare</a>
        </div>

        <div className="navbar-end">
          <Link to="/customer">
            <button className="btn m-2">Customer</button>
          </Link>
          <Link to="/admin">
            <button className="btn m-2">Admin</button>
          </Link>
        </div>
      </div>

      <div className="hero min-h-screen bg-[url('https://images.pexels.com/photos/1056516/pexels-photo-1056516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')]">
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">
              OPEN EVERYDAY 10.00-20.00
            </h1>
            {/* <p className="mb-5">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p> */}
            <button className="btn btn-warning">BOOK HERE!</button>
          </div>
        </div>
      </div>

      {/* <div>
        <Button to="/customer" name="Customer" />
        <Button to="/admin/login" name="Admin" />
      </div> */}
    </>
  );
};

export default Index;
