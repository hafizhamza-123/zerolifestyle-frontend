import { useState } from "react";
import API from "../api/axios";
// import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState(null);
  // const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {

      const res = await API.post("/auth/verify-otp", { email, otp });
      setMessage({ type: "success", text: res.data.message || "OTP verified!" });

    } catch (err) {
        setMessage({ type: "error", text: err.response?.data?.error || "OTP verification failed." });
    }
    
    setLoading(false);
    
  };
  

  // Resend OTP handler
  const handleResend = async () => {
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email first." });
      return;
    }

    setResendLoading(true);
    setMessage(null);

    try {
      const res = await API.post("/auth/resend-otp", { email });
      setMessage({ type: "success", text: res.data.message || "OTP resent successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.error || "Failed to resend OTP." });
    }

    setResendLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 font-inter">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Verify OTP</h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded-md text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-black focus:outline-none"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="text-sm text-black underline hover:font-bold cursor-pointer"
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
