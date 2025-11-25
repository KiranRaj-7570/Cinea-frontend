import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const {loginUser} = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post(
        "/auth/login",
        { email, password } // needed later for secure cookies
      );
      loginUser(res.data.user)
      setMessage("Login successful! Redirecting...");
      setTimeout(() => navigate("/home"), 100); // redirect to home (temporary landing/home)
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed! Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1A1A1A] p-8 rounded-2xl shadow-lg border border-gray-700">

        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Welcome Back 👋
        </h2>

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full bg-transparent border border-gray-500 px-4 py-2 rounded-md focus:outline-none focus:border-[#FF7A1A] text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-transparent border border-gray-500 px-4 py-2 rounded-md focus:outline-none focus:border-[#FF7A1A] text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-[#FF7A1A] hover:bg-[#f6f6f6] text-black font-semibold py-2 rounded-md transition"
          >
            Login
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-[#FF7A1A] mt-4">{message}</p>
        )}

        <p className="text-center text-gray-400 text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#FF7A1A] hover:underline">
            Create one
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;