import React, { useState } from "react";
import loginImg from "../../assets/loginImg.jpg";

import Button from "../../components/Button";
import Input from "../../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/authSlice";
import axios from "axios";
import toast from "react-hot-toast";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // verify and login
  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Email or Password cannote be empty!!");
      return;
    }
    setLoading(true);
    try {
      dispatch(signInStart());

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth//login`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.data.success === false) {
        dispatch(signInFailure(response.data.message));
        toast.error(response.data.message);
        return;
      }
      dispatch(signInSuccess(response.data.user));
      console.log("Login Success:", response.data);
      toast.success("Login Success");
      navigate("/home");
    } catch (err: any) {
      console.error("Login Error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "An error occurred");
      dispatch(signInFailure(err.response?.data?.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side: form */}
      <div className="flex flex-col w-full md:w-1/2">
        <div className="flex gap-2 p-6 items-center justify-center md:justify-start">
          <p className="font-semibold text-lg">Hotel Management System</p>
        </div>
        <div className="w-full max-w-full justify-center items-center px-6 md:px-20 mt-10">
          <h1 className="text-3xl font-bold mb-2 text-center md:text-left">
            Sign in
          </h1>
          <p className="mb-6 text-gray-500 text-center md:text-left">
            Please login to continue to your account.
          </p>

          {/* Email input */}
          <Input
            label="Email"
            type="email"
            placeholder="jonas_kahnwald@gmail.com"
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Email input */}
          <Input
            label="Password"
            type="password"
            placeholder="Enter Password"
            disabled={loading}
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
          />

          {/*Submit */}

          <Button
            type="button"
            fullWidth={true}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign In"}
          </Button>

          {/* Create Account */}
          <p className="text-sm mt-4 text-center md:text-left">
            Need an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>

      {/* Right side: image */}
      <div className="hidden md:flex w-1/2 h-screen">
        <img
          src={loginImg}
          alt="background"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default Login;
