import React, { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import Alert from "./Alert";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl);
  const [gender, setGender] = useState(user.gender);
  const [age, setAge] = useState(user.age || "");
  const [about, setAbout] = useState(user.about || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const dispatch = useDispatch();

  const handleSaveProfile = async () => {
    try {
      setError("");
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoUrl,
          gender,
          age,
          about,
        },
        {
          withCredentials: true,
        }
      );
      // we are updating the profile

      dispatch(addUser(res?.data?.data));
      setShowToast(true);
    } catch (err) {
      setError(err?.message);
    }
  };

  return (
    <>
      <div className="flex justify-between gap-20 items-center">
        <div className="card card-dash bg-base-300 w-96 flex justify-center mt-32">
          <div className="card-body">
            <h2 className="card-title justify-center">Edit Profile</h2>

            <div className="my-2">
              <fieldset className="fieldset">
                <legend className="fieldset-legend">First Name</legend>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter Email"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Last Name</legend>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter Password"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Photo Url</legend>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter Password"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Gender</legend>
                {/* <input
                type="text"
                className="input"
                placeholder="Enter Password"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              /> */}
                <select
                  className="input"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">Age</legend>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter Password"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend">About</legend>
                {/* <input
                  type="text"
                  className="input"
                  placeholder="Enter Password"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                /> */}
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="textarea"
                  placeholder="Enter About"
                ></textarea>
              </fieldset>
            </div>

            <p className="text-red-500">{error}</p>

            <div className="card-actions justify-center">
              <button onClick={handleSaveProfile} className="btn btn-primary">
                Save Profile
              </button>
            </div>
          </div>
        </div>
        <UserCard
          user={{ firstName, lastName, photoUrl, age, gender, about }}
        />
      </div>

      {showToast && (
        <div className="flex justify-center">
          <Alert sty message={"data updated successfully"} />{" "}
        </div>
      )}
    </>
  );
};

export default EditProfile;
