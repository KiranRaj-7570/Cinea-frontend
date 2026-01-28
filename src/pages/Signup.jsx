import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { validatePassword } from "../utils/passwordValidator";

const Signup = () => {
  const navigate = useNavigate();
  const { loginUser, user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect after signup based on user role
  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage(""); // Clear previous messages immediately

    // Validation 1: Check if passwords match
    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    // Validation 2: Check name is not empty
    if (!name.trim()) {
      setMessage("Name is required!");
      return;
    }

    // Validation 3: Check email is not empty
    if (!email.trim()) {
      setMessage("Email is required!");
      return;
    }

    // Validation 4: Check password strength (CLIENT-SIDE - NO SERVER CALL)
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setMessage(`Password must contain: ${passwordValidation.failedRequirements.join(", ")}`);
      return; // EXIT HERE - Don't make any server call
    }

    // ALL validations passed - NOW make server call
    try {
      setLoading(true);
      const res = await api.post("/auth/signup", { name, email, password });
      loginUser(res.data.user);
      setMessage("Signup successful! Redirecting...");
    } catch (err) {
      setMessage(err.response?.data?.msg || "Signup failed! Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a0a0a] via-[#111111] to-[#1a1a1a] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF7A1A] opacity-5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FF7A1A] opacity-5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Header with logo/branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 antonio">
            CINÉA
          </h1>
          <p className="text-[#FF7A1A] text-sm font-medium tracking-wider">
            YOUR CINEMA GATEWAY
          </p>
        </div>

        {/* Main card */}
        <div className="bg-linear-to-b from-[#151515] to-[#0f0f0f] rounded-3xl p-8 shadow-2xl border border-white/10 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <h2 className="text-3xl text-white mb-2 anton tracking-widest">
              Create Account
            </h2>
            <p className="text-gray-400 text-sm poppins-regular">
              Join Cinéa and start exploring
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSignup}>
            <div className="group">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2 block">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your Name"
                  className="w-full bg-white/5 border border-white/10 px-5 py-3 rounded-xl focus:outline-none focus:border-[#FF7A1A] focus:bg-white/10 text-white placeholder-gray-500 transition-all duration-300"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-[#FF7A1A]/0 to-[#FF7A1A]/0 group-focus-within:from-[#FF7A1A]/10 group-focus-within:to-transparent pointer-events-none transition-all duration-300"></div>
              </div>
            </div>

            <div className="group">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2 block">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/10 px-5 py-3 rounded-xl focus:outline-none focus:border-[#FF7A1A] focus:bg-white/10 text-white placeholder-gray-500 transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-[#FF7A1A]/0 to-[#FF7A1A]/0 group-focus-within:from-[#FF7A1A]/10 group-focus-within:to-transparent pointer-events-none transition-all duration-300"></div>
              </div>
            </div>

            {/* Password Input */}
            <div className="group">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 px-5 py-3 rounded-xl focus:outline-none focus:border-[#FF7A1A] focus:bg-white/10 text-white placeholder-gray-500 transition-all duration-300 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF7A1A] transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.73 5.08A9.53 9.53 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.96 9.96 0 01-4.29 5.233M6.61 6.61A9.96 9.96 0 002.457 12c1.275 4.057 5.065 7 9.543 7 1.07 0 2.098-.168 3.063-.478"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.88 9.88a3 3 0 104.24 4.24"
                      />
                    </svg>
                  )}
                </button>
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-[#FF7A1A]/0 to-[#FF7A1A]/0 group-focus-within:from-[#FF7A1A]/10 group-focus-within:to-transparent pointer-events-none transition-all duration-300"></div>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="group">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2 block">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 px-5 py-3 rounded-xl focus:outline-none focus:border-[#FF7A1A] focus:bg-white/10 text-white placeholder-gray-500 transition-all duration-300 pr-12"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF7A1A] transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.73 5.08A9.53 9.53 0 0112 5c4.478 0 8.268 2.943 9.543 7a9.96 9.96 0 01-4.29 5.233M6.61 6.61A9.96 9.96 0 002.457 12c1.275 4.057 5.065 7 9.543 7 1.07 0 2.098-.168 3.063-.478"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.88 9.88a3 3 0 104.24 4.24"
                      />
                    </svg>
                  )}
                </button>
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-[#FF7A1A]/0 to-[#FF7A1A]/0 group-focus-within:from-[#FF7A1A]/10 group-focus-within:to-transparent pointer-events-none transition-all duration-300"></div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-3 rounded-xl transition-all duration-300 text-sm uppercase tracking-wide relative overflow-hidden group mt-8
                ${
                  loading
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-[#FF7A1A] to-[#ff6b00] hover:shadow-xl hover:shadow-[#FF7A1A]/50 text-white"
                }`}
            >
              <span className="relative z-10">
                {loading ? "Creating Account..." : "Sign Up"}
              </span>
              {!loading && (
                <div className="absolute inset-0 bg-linear-to-r from-[#ffffff]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          </form>

          {/* Message Alert */}
          {message && (
            <div
              className={`mt-6 p-4 rounded-xl text-sm font-medium text-center transition-all duration-300 
                ${
                  message.includes("successful")
                    ? "bg-green-500/20 text-green-300 border border-green-500/30"
                    : "bg-[#FF7A1A]/20 text-[#FF7A1A] border border-[#FF7A1A]/30"
                }`}
            >
              {message}
            </div>
          )}

          {/* Divider */}
          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-linear-to-r from-white/5 to-transparent"></div>
            <span className="text-xs text-gray-500">Already joined?</span>
            <div className="flex-1 h-px bg-linear-to-l from-white/5 to-transparent"></div>
          </div>

          {/* Login Link */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#FF7A1A] font-semibold hover:text-[#ff6b00] transition-colors duration-200"
            >
              Log in here
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2025 Cinéa. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Signup;
