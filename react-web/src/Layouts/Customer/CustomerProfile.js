import React, { useEffect, useState } from 'react'
import { GetCustomerProfile, UpdateCustomerProfile } from '../Api'


//------------------------
import { Button } from '../Module';

const CustomerProfile = () => {
    const [profile, setProfile] = useState([]);
    const [disabledEditProfile, setDisabledEditProfile] = useState(true);
    const [isError, setIsError] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);

    const fetchProfile = () => {
        GetCustomerProfile().then((data) => {
            const {status, msg} = data;
            if (status == "SUCCESS") {
                setProfile(msg);
            } else {
                console.log(data);
            }
        })
    }

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEditProfile = (event) => {
        event.preventDefault();
        setDisabledEditProfile(false);
    }

    const handleUpdateProfile = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const jsonData = {
            phone: data.get("phone"),
            name: data.get("name"),
        }
        UpdateCustomerProfile(jsonData).then((data) => {
            const {status, msg} = data;
            if(status == "SUCCESS") {
                setIsError(false);
                setDisabledEditProfile(true);
            } else if (status == "ER_DUP_ENTRY") {
                setIsError(true);
                setErrorMsg("phone number or name are already been used")
            }
        })
    }

    const handleCancelEdit = (event) => {
        event.preventDefault();
        setIsError(false);
        setDisabledEditProfile(true);
    }
  return (
    <>
    <div className="navbar bg-neutral text-neutral-content">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Carcare</a>
        </div>
        <div className="flex-none gap-2">
          {/* <div className="form-control">
                  <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                </div> */}
          <div>
            <Button to="/customer/car" name="Customer Car" />
          </div>
          <div>
            <Button to="/customer/profile" name="Profile" />
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <div className="badge m-2">Phattraporn Bunjongket</div>
              {/* <li>
                      <a className="justify-between">
                        Profile
                      </a>
                    </li> */}
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
        </div>
      
    <div>
        {profile && profile.map((item) => (
            <div>
                <button className="btn" onClick={handleEditProfile} disabled={!disabledEditProfile}>Edit</button>
                <form onSubmit={handleUpdateProfile}>
                    <label>phone number</label>
                    <input type="tel" name="phone" defaultValue={item.phone} disabled={disabledEditProfile}/>
                    <label>name</label>
                    <input type="text" name="name" defaultValue={item.name} disabled={disabledEditProfile}/>
                    {isError && <p>{errorMsg}</p>}
                    {disabledEditProfile == false && 
                        <div>
                            <button type="submit" className="btn">Submit</button>
                            <button className="btn" onClick={handleCancelEdit}>Cancel</button>
                        </div>
                    }
                </form>
            </div>

        ))}
    </div>
    </>
    
  )
}

export default CustomerProfile;
