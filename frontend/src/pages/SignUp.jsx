import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/logo.png";
import image from "../images/authPageSide.png";
import { api_base_url } from "../helper";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();
    fetch(api_base_url + "/signUp", {
      mode: "cors",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, name, email, password: pwd }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Account created successfully");
          navigate("/login");
        } else {
          setError(data.message);
        }
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="flex w-[80%] max-w-4xl bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        
        <div className="w-[50%] p-10 flex flex-col justify-center">
          <img className="w-[200px]  mb-6" src={logo} alt="Logo" />
          <h2 className="text-2xl font-semibold text-white text-center mb-4">Create an Account</h2>

          <form onSubmit={submitForm} className="space-y-4">
            <input
              required
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              required
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              required
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              required
              className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="Password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />

            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-400 hover:underline">
                Login
              </Link>
            </p>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-md hover:shadow-lg transition-all">
              Sign Up
            </button>
          </form>
        </div>

        
        <div className="w-[50%] hidden lg:flex items-center justify-center">
          <img className="h-[90%] w-[95%]  rounded-r-lg" src={image} alt="Illustration" />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
