import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, RotateCcw } from "lucide-react";
import { axiosInstance } from "@/lib/axios";

interface OtpFormProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerifySuccess: () => void;
}

const OtpForm: React.FC<OtpFormProps> = ({
  isOpen,
  onClose,
  email,
  onVerifySuccess,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft]);

  // Auto-focus first input when opened
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [isOpen]);

  // Reset form when opened
  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setError("");
      setTimeLeft(300);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit) && newOtp.join("").length === 6) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter" && otp.every((digit) => digit)) {
      handleVerify(otp.join(""));
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("").concat(Array(6).fill("")).slice(0, 6);
    setOtp(newOtp);

    // Focus last filled input or next empty one
    const nextFocusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  const handleVerify = async (otpValue: string) => {
    setIsVerifying(true);
    setError("");

    try {
      const response = await axiosInstance.post("/auth/verify-university-otp", {
        email: email,
        otp: otpValue,
      });

      if (response.status === 201) {
        onVerifySuccess();
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    try {
      // You'll need to implement a resend OTP endpoint
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(300);
      setError("");
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error("Failed to resend OTP:", error);
    }
  };

  const handleSubmit = () => {
    if (otp.every((digit) => digit)) {
      handleVerify(otp.join(""));
    }
  };

  const isExpired = timeLeft <= 0;
  const isComplete = otp.every((digit) => digit);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Starfield background for overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.span
                  key={`overlay-star-${i}`}
                  className="absolute block rounded-full bg-white"
                  style={{
                    width: `${Math.random() * 1 + 0.5}px`,
                    height: `${Math.random() * 1 + 0.5}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: 0.3,
                    filter: "blur(0.3px)",
                    boxShadow: "0 0 4px rgba(255,255,255,0.2)",
                  }}
                  initial={{ opacity: 0.1, scale: 0.8 }}
                  animate={{
                    opacity: [0.1, 0.6, 0.1],
                    scale: [0.8, 1.1, 0.8],
                  }}
                  transition={{
                    duration: 3 + (i % 5) * 0.8,
                    delay: (i % 7) * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* OTP Form Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#0f0720] border border-[#2c223c] rounded-2xl p-8 shadow-2xl"
            >
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#8a55d7]/20 via-[#4c2d9e]/20 to-[#8a55d7]/20 rounded-2xl blur-lg opacity-60" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#1e152e]"
              >
                <X size={20} />
              </button>

              <div className="relative">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#8a55d7] to-[#4c2d9e] rounded-full flex items-center justify-center">
                      <Mail className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Verify Your Email
                  </h2>
                  <p className="text-gray-300 text-sm">
                    We've sent a 6-digit code to
                  </p>
                  <p className="text-[#8a55d7] font-medium">{email}</p>
                </div>

                {/* OTP Input Fields */}
                <div className="mb-6">
                  <div className="flex justify-center gap-3 mb-4">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el: HTMLInputElement | null) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        value={digit}
                        onChange={(e) =>
                          handleInputChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        maxLength={1}
                        className={`w-12 h-12 text-center text-xl font-bold bg-[#1e152e] border-2 rounded-lg transition-all duration-200 ${
                          digit
                            ? "border-[#8a55d7] text-white"
                            : "border-[#2c223c] text-gray-400"
                        } focus:outline-none focus:border-[#8a55d7] focus:ring-2 focus:ring-[#8a55d7]/20`}
                        disabled={isVerifying}
                      />
                    ))}
                  </div>

                  {/* Error message */}
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm text-center mb-4"
                    >
                      {error}
                    </motion.p>
                  )}

                  {/* Timer */}
                  <div className="text-center mb-4">
                    {!isExpired ? (
                      <p className="text-gray-400 text-sm">
                        Code expires in{" "}
                        <span className="text-[#8a55d7] font-mono font-bold">
                          {formatTime(timeLeft)}
                        </span>
                      </p>
                    ) : (
                      <p className="text-red-400 text-sm font-medium">
                        Code has expired. Please request a new one.
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleSubmit}
                    disabled={!isComplete || isVerifying || isExpired}
                    className="w-full bg-gradient-to-r from-[#8a55d7] to-[#4c2d9e] text-white font-medium py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:from-[#9a65e7] hover:to-[#5c3dae] focus:outline-none focus:ring-2 focus:ring-[#8a55d7]/50"
                  >
                    {isVerifying ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </div>
                    ) : (
                      "Verify Code"
                    )}
                  </button>

                  <button
                    onClick={handleResend}
                    disabled={!isExpired && timeLeft > 240} // Allow resend only after 1 minute
                    className="w-full bg-transparent border border-[#2c223c] text-gray-300 font-medium py-3 rounded-lg transition-all duration-200 hover:border-[#8a55d7] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#8a55d7]/20"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <RotateCcw size={16} />
                      Resend Code
                    </div>
                  </button>
                </div>

                {/* Help text */}
                <div className="mt-6 text-center">
                  <p className="text-gray-400 text-xs">
                    Didn't receive the code? Check your spam folder or{" "}
                    <button
                      onClick={handleResend}
                      className="text-[#8a55d7] hover:underline"
                      disabled={!isExpired && timeLeft > 240}
                    >
                      request a new one
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OtpForm;
