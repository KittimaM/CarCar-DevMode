import React from "react";
import { Button } from "../Module";

const CustomerFirstPage = () => {
  return (


    <>
    
    <div className="navbar bg-base-100">
        <div className="navbar-start">
            <a className="btn btn-ghost text-xl">Carcare</a>
        </div>
        
        <div className="navbar-end">
            <Button to="/customer/login" name="Login" />
            <Button to="/customer/register" name="Register" />
            {/* <a className="btn bg- m-1" to="/login" >Login</a>
            <a className="btn bg-red-300 m-2">Sign up</a> */}
        </div>
   
    </div>

    <div className="hero min-h-screen bg-[url('https://images.pexels.com/photos/1056516/pexels-photo-1056516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')]" >
        <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content">
                <div className="max-w-md">
                    <h1 className="mb-5 text-5xl font-bold">OPEN EVERYDAY 10.00-20.00</h1>
                    <p className="mb-5">Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.</p>
                    <button className="btn btn-warning" >BOOK HERE!</button>
                </div>
            </div>
    </div>

    {/* <div>
      <Button to="/customer/login" name="Login" />
      <Button to="/customer/register" name="Register" />
    </div> */}
 

    </>

   
  );
};
export default CustomerFirstPage;
