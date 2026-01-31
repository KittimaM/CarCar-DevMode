import React, { useEffect, useState } from "react";
import { GetCustomerProfile, UpdateCustomerProfile } from "../Modules/Api";

const CustomerProfile = () => {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const fetchProfile = () => {
    GetCustomerProfile().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setProfile(msg[0]);
      } else {
        console.log(data);
      }
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      name: data.get("name"),
      phone: data.get("phone"),
    };
    UpdateCustomerProfile(jsonData).then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setEditMode(false);
        fetchProfile();
      } else {
        console.log(data);
      }
    });
  };

  if (!profile) return (
    <div className="flex justify-center items-center min-h-[200px]">
      <span className="loading loading-spinner loading-lg" />
    </div>
  );

  return (
    <div className="w-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Profile</h2>
      {!editMode ? (
        <div className="bg-base-200/50 rounded-lg p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <p className="text-sm text-base-content/70">Name</p>
              <p className="font-medium text-base sm:text-lg">{profile.name}</p>
            </div>
            <div>
              <p className="text-sm text-base-content/70">Phone</p>
              <p className="font-medium text-base sm:text-lg">{profile.phone}</p>
            </div>
          </div>
          <button
            className="btn btn-primary mt-4 w-full sm:w-auto min-h-11"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="space-y-4">
          <label className="form-control w-full">
            <span className="label-text">Name</span>
            <input
              type="text"
              name="name"
              defaultValue={profile.name}
              className="input input-bordered w-full"
            />
          </label>
          <label className="form-control w-full">
            <span className="label-text">Phone</span>
            <input
              type="text"
              name="phone"
              defaultValue={profile.phone}
              className="input input-bordered w-full"
            />
          </label>
          <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
            <button
              type="button"
              className="btn btn-ghost flex-1 min-h-11"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary flex-1 min-h-11">
              Save
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CustomerProfile;
