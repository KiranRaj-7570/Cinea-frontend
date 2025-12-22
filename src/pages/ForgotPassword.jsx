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
      setMessage("OTP sent to your email");
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
      setMessage("OTP verified");
      goNext();
    } catch (err) {
      setMessage(err.response?.data?.msg || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      return setMessage("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });

      loginUser(res.data.user);
      setMessage("Password reset successful");
      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center ">
      <div className="w-full max-w-md bg-[#151515] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden">
        
      
        <div
          className="flex transition-transform duration-300"
          style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
        >

          <section className="w-full shrink-0 p-8">
            <h2 className="text-2xl anton text-[#F6E7C6] mb-2">
              Forgot Password
            </h2>
            <p className="text-sm text-slate-400 mb-5">
              Enter your registered email
            </p>

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/10 focus:border-[#FF7A1A] outline-none text-white"
            />

            <button
              disabled={loading}
              onClick={handleSendOtp}
              className="w-full mt-6 py-3 rounded-full bg-[#FF7A1A] text-black font-semibold hover:bg-orange-600 transition disabled:opacity-60"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <Link
              to="/login"
              className="block text-center text-xs text-slate-400 mt-4 hover:text-[#F6E7C6]"
            >
              Back to Login
            </Link>
          </section>

          
          <section className="w-full shrink-0 p-8">
            <h2 className="text-2xl anton text-[#F6E7C6] mb-2">
              Verify OTP
            </h2>
            <p className="text-sm text-slate-400 mb-5">
              Enter the 6-digit code
            </p>

            <input
              type="text"
              placeholder="••••••"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 text-center tracking-widest rounded-xl bg-[#0f0f0f] border border-white/10 focus:border-[#FF7A1A] outline-none text-white"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={goBack}
                className="w-1/2 py-3 rounded-full bg-[#1c1c1c] border border-white/10 text-[#F6E7C6]"
              >
                Back
              </button>

              <button
                disabled={loading}
                onClick={handleVerifyOtp}
                className="w-1/2 py-3 rounded-full bg-[#FF7A1A] text-black font-semibold hover:bg-orange-600 transition disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </div>
          </section>

          
          <section className="w-full shrink-0 p-8">
            <h2 className="text-2xl anton text-[#F6E7C6] mb-2">
              New Password
            </h2>
            <p className="text-sm text-slate-400 mb-5">
              Set a new secure password
            </p>

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0f0f0f] border border-white/10 focus:border-[#FF7A1A] outline-none text-white"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={goBack}
                className="w-1/2 py-3 rounded-full bg-[#1c1c1c] border border-white/10 text-[#F6E7C6]"
              >
                Back
              </button>

              <button
                disabled={loading}
                onClick={handleResetPassword}
                className="w-1/2 py-3 rounded-full bg-[#FF7A1A] text-black font-semibold hover:bg-orange-600 transition disabled:opacity-60"
              >
                {loading ? "Saving..." : "Reset"}
              </button>
            </div>
          </section>
        </div>

        {message && (
          <p className="mt-5 text-center text-xs text-[#FF7A1A]">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
