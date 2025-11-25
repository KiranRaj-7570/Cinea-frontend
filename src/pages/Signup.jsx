import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signup", {
        name,
        email,
        password,
      });
      loginUser(res.data.user);

      setMessage("Signup successful! Redirecting...");

      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Signup failed! Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#1A1A1A] p-8 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Create your account
        </h2>

        <form className="space-y-4" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full bg-transparent border border-gray-500 px-4 py-2 rounded-md focus:outline-none focus:border-[#FF7A1A] text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            className="w-full bg-[#FF7A1A] hover:bg-[#e96b10] text-black font-semibold py-2 rounded-md transition"
          >
            Sign Up
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-[#FF7A1A] mt-4">{message}</p>
        )}

        <p className="text-center text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-[#FF7A1A] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
