// import React from "react";

// const SignIn = () => {
//   return <div>SignIn</div>;
// };

// export default SignIn;

import React from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    // This is where you would handle the form submission, e.g., send data to a backend.
    console.log(data);
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

          <input
            id="password"
            type="password"
            placeholder="Password"
            {...register("password", { required: "Password is required" })}
            className="w-full bg-[#1e152e] text-white placeholder-gray-500 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-violet-600 border border-[#2c223c]"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#8a55d7] to-[#4c2d9e] text-white font-semibold py-3 rounded-lg hover:from-[#9b68e8] hover:to-[#5d3ea9] transition-all duration-300"
          >
            LOG IN
          </button>
        </div>

        {/* Footer link */}
        <p className="mt-6 text-gray-400 text-sm">
          Don't have an account?{" "}
          <a href="#" className="text-[#8a55d7] hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
