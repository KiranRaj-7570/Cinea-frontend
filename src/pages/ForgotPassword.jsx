import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const goNext = () => setStep((prev) => prev + 1);
  const goBack = () => setStep((prev) => prev - 1);

  const handleSendOtp = async () => {
    if (!email.trim()) return setMessage("Email is required!");

    try {
      setLoading(true);
      setMessage("");
      await api.post("/auth/forgot-password", { email });
      setMessage("OTP sent to your email!");
      goNext();
    } catch (err) {
      setMessage(err.response?.data?.msg || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setMessage("Please enter OTP!");

    try {
      setLoading(true);
      setMessage("");
      await api.post("/auth/verify-otp", { email, otp });
      setMessage("OTP Verified!");
      goNext();
    } catch (err) {
      setMessage(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      return setMessage("Password must be 6+ characters!");
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      // 🔥 Auto Login after reset
      loginUser(res.data.user);

      setMessage("Password reset successful! Redirecting...");
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-[#0B1120] border border-slate-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        
        {/* Slide container */}
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
        >

          {/* STEP 1: Email */}
          <section className="w-full shrink-0">
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            <input
              type="email"
              placeholder="Your email"
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              disabled={loading}
              onClick={handleSendOtp}
              className="w-full mt-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold disabled:opacity-60 transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            <Link to="/login" className="block text-slate-400 text-xs mt-4 hover:text-white">
              Back to Login
            </Link>
          </section>

          {/* STEP 2: OTP */}
          <section className="w-full shrink-0">
            <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
            <input
              type="text"
              placeholder="6-digit OTP"
              className="w-full p-3 text-center tracking-widest rounded-lg bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <div className="flex gap-2 mt-5">
              <button onClick={goBack} className="w-1/2 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold">
                Back
              </button>

              <button
                disabled={loading}
                onClick={handleVerifyOtp}
                className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold disabled:opacity-60"
              >
                {loading ? "Checking..." : "Verify OTP"}
              </button>
            </div>
          </section>

          {/* STEP 3: New Password */}
          <section className="w-full shrink-0">
            <h2 className="text-xl font-bold mb-4">New Password</h2>
            <input
              type="password"
              placeholder="New password"
              className="w-full p-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-indigo-500 outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <div className="flex gap-2 mt-5">
              <button onClick={goBack} className="w-1/2 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold">
                Back
              </button>

              <button
                disabled={loading}
                onClick={handleResetPassword}
                className="w-1/2 py-2.5 bg-green-600 hover:bg-green-700 rounded-lg font-semibold disabled:opacity-60"
              >
                {loading ? "Saving..." : "Reset"}
              </button>
            </div>
          </section>
        </div>

        {message && (
          <p className="mt-4 text-center text-xs text-amber-300">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;