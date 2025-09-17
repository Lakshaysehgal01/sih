import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { EyeClosed, EyeIcon } from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SignInFormData {
  email: string;
  password: string;
  role: "user" | "university";
}

const SignIn: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [seePassword, setSeePassword] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<"user" | "university">(
    "user"
  );
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const onSubmit = async (data: SignInFormData) => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/auth/login", {
        email: data.email,
        password: data.password,
        role: selectedRole,
      });

      if (response.status === 200) {
        // Redirect based on role or to dashboard
        navigate("/dashboard");
        toast.success("Login successful!");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);

      if (error.response?.status === 401) {
        alert("Invalid credentials. Please try again.");
      } else if (error.response?.status === 403) {
        alert("Account not verified or approved.");
      } else {
        alert("Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#080412] text-white flex items-center justify-center font-sans">
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
        className="relative z-10 w-full max-w-sm mx-auto text-center p-8 flex flex-col items-center"
      >
        <h1 className="text-4xl font-light text-white mb-4">Sign In</h1>
        <p className="text-lg text-gray-400 mb-8 font-light">
          Welcome back to your digital safety net.
        </p>

        {/* Role Selection */}
        <div className="w-full mb-6">
          <div className="flex bg-[#1e152e] rounded-lg p-1 border border-[#2c223c]">
            <button
              type="button"
              onClick={() => setSelectedRole("user")}
              className={`flex-1 py-2 px-3 rounded-md transition-all duration-200 text-xs font-medium ${
                selectedRole === "user"
                  ? "bg-gradient-to-r from-[#8a55d7] to-[#4c2d9e] text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole("university")}
              className={`flex-1 py-2 px-3 rounded-md transition-all duration-200 text-xs font-medium ${
                selectedRole === "university"
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
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
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
              className="w-full bg-[#1e152e] text-white placeholder-gray-500 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-600 border border-[#2c223c]"
            />
            <div
              className="absolute right-3 top-[13px] cursor-pointer"
              onClick={() => setSeePassword(!seePassword)}
            >
              {seePassword ? <EyeClosed size={20} /> : <EyeIcon size={20} />}
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#8a55d7] to-[#4c2d9e] text-white font-semibold py-3 rounded-lg hover:from-[#9b68e8] hover:to-[#5d3ea9] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </div>

        {/* Footer link */}
        <p className="mt-6 text-gray-400 text-sm">
          Don't have an account?{" "}
          <a href="/signUp" className="text-[#8a55d7] hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
