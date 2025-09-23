import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { EyeClosed, EyeIcon } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import OtpForm from "@/component/OtpForm";
import { toast } from "sonner";

interface FormData {
  email: string;
  password: string;
  fullName?: string;
  universityName?: string;
  AISHE?: string;
  publicAddress?: string;
  letter?: FileList;
}

type UserType = "user" | "university";

const SignUp: React.FC = () => {
  const [userType, setUserType] = useState<UserType>("user");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [seePassword, setSeePassword] = useState<boolean>(false);
  const [showOtpForm, setShowOtpForm] = useState<boolean>(false);
  const [registrationEmail, setRegistrationEmail] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      if (userType === "university") {
        // Handle university registration - will need OTP verification
        const formData = new FormData();
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("universityName", data.universityName || "");
        formData.append("AISHE", data.AISHE || "");
        formData.append("publicAddress", data.publicAddress || "");

        if (data.letter && data.letter.length > 0) {
          formData.append("letter", data.letter[0]);
        }

        const response = await axiosInstance.post(
          "/auth/universitySignUp",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response?.status === 201) {
          setRegistrationEmail(data.email);
          setShowOtpForm(true);
        }
      } else {
        // Handle user registration
        const userData = {
          email: data.email,
          password: data.password,
          fullName: data.fullName,
        };

        const response = await axiosInstance.post("/auth/signup", userData);

        if (response?.status === 201) {
          toast.success("Registration successful! You can now log in.");
          reset();
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserTypeChange = (type: UserType) => {
    setUserType(type);
    reset();
  };

  const handleOtpSuccess = () => {
    setShowOtpForm(false);
    toast.success(
      "Registration successful! Your application is pending approval."
    );
    reset();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#080412] text-white flex items-center justify-center font-sans">
      {/* OTP Form Overlay */}
      <OtpForm
        isOpen={showOtpForm}
        onClose={() => setShowOtpForm(false)}
        email={registrationEmail}
        onVerifySuccess={handleOtpSuccess}
      />

      {/* === Starfield background === */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {Array.from({ length: 70 }).map((_, i) => (
          <motion.span
            key={`star-${i}`}
            className="absolute block rounded-full bg-white"
            style={{
              width: `${Math.random() * 1 + 0.5}px`,
              height: `${Math.random() * 1 + 0.5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.6,
              filter: "blur(0.3px)",
              boxShadow: "0 0 6px rgba(255,255,255,0.35)",
            }}
            initial={{ opacity: 0.2, scale: 0.9 }}
            animate={{ opacity: [0.2, 0.95, 0.2], scale: [0.9, 1.05, 0.9] }}
            transition={{
              duration: 2.4 + (i % 7) * 0.6,
              delay: (i % 9) * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* === Planet background element === */}
        <div
          className="absolute w-[400px] h-[400px] rounded-full top-1/4 -left-1/4 opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(138,85,215,0.7) 0%, rgba(10,5,15,0) 70%)",
            transform: "rotate(-20deg)",
            boxShadow: "0 0 100px 30px rgba(138,85,215,0.4)",
          }}
        ></div>
      </div>

      {/* === Glow effect === */}
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[1000px] max-w-[90%] h-48 rounded-full bg-[radial-gradient(closest-side,rgba(166,85,255,0.25),rgba(31,8,33,0.0))] blur-2xl" />

      {/* === Form === */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative z-10 w-full max-w-lg mx-auto text-center p-8 flex flex-col items-center"
      >
        <h1 className="text-4xl font-light text-white mb-4">Sign up</h1>
        <p className="text-lg text-gray-400 mb-8 font-light">
          Your Digital Safety Net on Autopilot.
        </p>

        {/* User Type Selection */}
        <div className="w-full mb-6">
          <div className="flex bg-[#1e152e] rounded-lg p-1 border border-[#2c223c]">
            <button
              type="button"
              onClick={() => handleUserTypeChange("user")}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 text-sm font-medium ${
                userType === "user"
                  ? "bg-gradient-to-r from-[#8a55d7] to-[#4c2d9e] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Individual User
            </button>
            <button
              type="button"
              onClick={() => handleUserTypeChange("university")}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-200 text-sm font-medium ${
                userType === "university"
                  ? "bg-gradient-to-r from-[#8a55d7] to-[#4c2d9e] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              University
            </button>
          </div>
        </div>

        {/* Form container */}
        <div className="space-y-4 w-full">
          <input
            id="email"
            type="email"
            placeholder="Email"
            {...register("email", { required: "Email is required" })}
            className="w-full bg-[#1e152e] text-white placeholder-gray-500 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-600 border border-[#2c223c]"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}

          <div className="relative">
            <input
              id="password"
              type={seePassword ? "text" : "password"}
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="w-full bg-[#1e152e] text-white placeholder-gray-500 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-600 border border-[#2c223c] relative"
            />
            <div
              className="absolute right-3 top-[13px]"
              onClick={() => setSeePassword(!seePassword)}
            >
              {seePassword ? <EyeClosed /> : <EyeIcon />}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Conditional fields based on user type */}
          {userType === "user" ? (
            <input
              id="fullName"
              type="text"
              placeholder="Full Name"
              {...register("fullName", { required: "Full name is required" })}
              className="w-full bg-[#1e152e] text-white placeholder-gray-500 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-600 border border-[#2c223c]"
            />
          ) : (
            <>
              <input
                id="universityName"
                type="text"
                placeholder="University Name"
                {...register("universityName", {
                  required: "University name is required",
                })}
                className="w-full bg-[#1e152e] text-white placeholder-gray-500 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-600 border border-[#2c223c]"
              />
              {errors.universityName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.universityName.message}
                </p>
              )}

              <input
                id="AISHE"
                type="text"
                placeholder="AISHE Code"
                {...register("AISHE", { required: "AISHE code is required" })}
                className="w-full bg-[#1e152e] text-white placeholder-gray-500 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-600 border border-[#2c223c]"
              />
              {errors.AISHE && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.AISHE.message}
                </p>
              )}

              <input
                id="publicAddress"
                type="text"
                placeholder="Public Address"
                {...register("publicAddress", {
                  required: "Public address is required",
                })}
                className="w-full bg-[#1e152e] text-white placeholder-gray-500 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-600 border border-[#2c223c]"
              />
              {errors.publicAddress && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.publicAddress.message}
                </p>
              )}

              <div className="w-full">
                <label
                  htmlFor="letter"
                  className="block text-sm text-gray-400 mb-2 text-left"
                >
                  Authorization Letter (Required)
                </label>
                <input
                  id="letter"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  {...register("letter", {
                    required: "Authorization letter is required",
                  })}
                  className="w-full bg-[#1e152e] text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-600 border border-[#2c223c] file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-[#2c223c] file:text-gray-300 hover:file:bg-[#3c3250]"
                />
                {errors.letter && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.letter.message}
                  </p>
                )}
              </div>
            </>
          )}

          {userType === "user" && errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#8a55d7] to-[#4c2d9e] text-white font-semibold py-3 rounded-lg hover:from-[#9b68e8] hover:to-[#5d3ea9] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "SIGNING UP..." : "SIGN UP"}
          </button>
        </div>

        {/* Footer link */}
        <p className="mt-6 text-gray-400 text-sm">
          Already have an account?{" "}
          <a href="/signin" className="text-[#8a55d7] hover:underline">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
