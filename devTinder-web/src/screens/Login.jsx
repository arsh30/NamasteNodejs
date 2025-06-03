import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
axios.defaults.withCredentials = true; // jb axios se request bhjte hai and  cookies, authorization token ko include krna hota hai
// toh  tab hmko withCredentials:true set krna pdhta hai
// bydefault browser cross-origin request me cookies nhi bhjta, aur na hi accept krta hai
// and agr humko cookies store krni hai to withCredentials likhna is mandatory

const Login = () => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLogginForm, setIsLogginForm] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(BASE_URL + "/login", {
        emailId,
        password,
      });
      console.log(res.data);
      dispatch(addUser(res.data));
      navigate("/");
    } catch (error) {
      console.log("error: ", error);
    }
  };

  const handleSignup = async() => {
    try {
      const res = await axios.post(BASE_URL + "/signup", {
        firstName,
        lastName,
        emailId,
        password,
      });
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (error) {
      console.log("error: ", error);
    }
  };

  return (
    <div className="card card-dash bg-base-300 w-96 flex justify-center mt-32">
      <div className="card-body">
        <h2 className="card-title justify-center">
          {isLogginForm ? "Login" : "SignUp"}
        </h2>

        <div className="my-2">
          {!isLogginForm && (
            <>
              {" "}
              <fieldset className="fieldset">
                <legend className="fieldset-legend">First Name</legend>
                <input
                  type="text"
                  className="input"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </fieldset>
              <fieldset className="fieldset">
                <legend className="fieldset-legend">Last Name</legend>
                <input
                  type="text"
                  className="input"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </fieldset>
            </>
          )}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Email</legend>
            <input
              type="email"
              className="input"
              placeholder="Enter Email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">Password</legend>
            <input
              type="password"
              className="input"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </fieldset>
        </div>

        <div className="card-actions justify-center">
          <button
            onClick={isLogginForm ? handleLogin : handleSignup}
            className="btn btn-primary"
          >
            {isLogginForm ? "Login" : "Signup"}
          </button>
        </div>

        <p
          className="mt-6 cursor-pointer text-center"
          onClick={() => setIsLogginForm((prev) => !prev)}
        >
          {isLogginForm
            ? "New User? Signup Here"
            : "Existing User? Login Here!"}
        </p>
      </div>
    </div>
  );
};

export default Login;
