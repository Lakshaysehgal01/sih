import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen h-screen overflow-x-hidden overflow-y-auto relative bg-[#080412] text-white flex flex-col scrollbar-thin scrollbar-thumb-[#392C52] scrollbar-track-[#120c1c] scrollbar-thumb-rounded-full">
      <div className="flex z-[100] justify-between px-[5vw] w-screen mt-6 text-4xl">
        <h1 className="font-roboto font-semibold">Flare</h1>
        <div className="flex gap-4 flex-row text-xl font-roboto font-semibold">
          <Link
            to="/sign-in"
            className="hover:cursor-pointer hover:text-[#ffffff]/80"
          >
            Sign In
          </Link>
          <Link
            to="/sign-up"
            className="hover:cursor-pointer hover:text-[#ffffff]/80"
          >
            Sign Up
          </Link>
        </div>
      </div>
      {/* Hero area */}
      <div className="relative min-h-screen flex-1 flex items-center justify-center px-6 ">
        {/* Starfield: tiny twinkling stars in background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {Array.from({ length: 70 }).map((_, i) => (
            <motion.span
              key={`star-${i}`}
              className="absolute block rounded-full bg-white"
              style={{
                width: `${Math.random() * 1 + 0.5}px`,
                height: `${Math.random() * 1 + 0.5}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 35}%`,
                opacity: 0.6,
                filter: "blur(0.2px)",
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
        </div>
        {/* Improved Lightning Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          className="absolute top-[-60px] w-full h-[500px]"
        >
          {/* Core bright source - moved down to be visible */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-[-20px] w-[40px] h-[40px] rounded-full"
            style={{
              background: `radial-gradient(circle, 
                rgba(255, 255, 255, 1) 0%, 
                rgba(255, 255, 255, 0.9) 20%, 
                rgba(243, 232, 255, 0.6) 50%, 
                transparent 100%)`,
              filter: "blur(1px)",
              boxShadow:
                "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(255, 255, 255, 0.4)",
            }}
          />

          {/* Central beam - cleaner and more focused (blurred background) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-[20px] h-[300px] w-[80px] opacity-50 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, 
                rgba(255, 255, 255, 0.8) 0%, 
                rgba(243, 232, 255, 0.7) 10%, 
                rgba(200, 160, 255, 0.5) 30%, 
                rgba(166, 85, 255, 0.3) 60%, 
                transparent 100%)`,
              filter: "blur(12px)",
              willChange: "transform, opacity",
            }}
          />
          {/* Central beam particles overlay (sharp, not blurred) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-[20px] h-[350px] w-[80px] pointer-events-none overflow-hidden z-[1]">
            {Array.from({ length: 2 }).map((_, i) => (
              <motion.span
                key={`cb-${i}`}
                className="absolute block w-[4px] h-[4px] rounded-full bg-white/90"
                style={{
                  left: `${8 + i * 7}%`,
                  boxShadow: "0 0 8px rgba(255,255,255,0.6)",
                  filter: "blur(2px)",
                }}
                initial={{ y: -20, opacity: 0.25, x: 0, scale: 0.8 }}
                animate={{
                  y: 350,
                  opacity: [0.25, 0.9, 0.25],
                  x: [0, i % 2 === 0 ? 3 : -3, 0],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 12 + (i % 5) * 2,
                  delay: (i % 7) * 0.35,
                  repeatDelay: 0.8 + (i % 3) * 0.4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          {/* Left ray - improved angle and positioning (blurred background) */}
          <div
            className="absolute left-1/2 top-[60px] h-[300px] w-[80px] opacity-50 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, 
                rgba(255, 255, 255, 0.7) 0%, 
                rgba(243, 232, 255, 0.6) 15%, 
                rgba(200, 160, 255, 0.4) 40%, 
                rgba(166, 85, 255, 0.2) 70%, 
                transparent 100%)`,
              filter: "blur(15px)",
              transform: "translateX(-50%) rotate(-25deg)",
              transformOrigin: "top center",
              willChange: "transform, opacity",
            }}
          />
          {/* Left ray particles overlay (sharp, not blurred) */}
          <div
            className="absolute left-1/2 top-[60px] h-[80px] w-[80px] rounded-full pointer-events-none z-[1]"
            style={{
              transform: "translateX(-50%) rotate(-25deg)",
              transformOrigin: "top center",
            }}
          >
            {Array.from({ length: 2 }).map((_, i) => (
              <motion.span
                key={`lr-${i}`}
                className="absolute block w-[4px] h-[4px] rounded-full bg-white/85"
                style={{
                  left: `${12 + i * 7}%`,
                  boxShadow: "0 0 7px rgba(255,255,255,0.5)",
                  filter: "blur(1.8px)",
                }}
                initial={{ y: -18, opacity: 0.25, x: 0, scale: 0.8 }}
                animate={{
                  y: 300,
                  opacity: [0.25, 0.85, 0.25],
                  x: [0, i % 2 === 0 ? 2.5 : -2.5, 0],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 10 + (i % 4) * 1.8,
                  delay: (i % 6) * 0.35,
                  repeatDelay: 0.8 + (i % 3) * 0.4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          {/* Right ray - improved angle and positioning (blurred background) */}
          <div
            className="absolute right-1/2 top-[60px] h-[280px] w-[100px] opacity-50 pointer-events-none"
            style={{
              background: `linear-gradient(to bottom, 
                rgba(255, 255, 255, 0.7) 0%, 
                rgba(243, 232, 255, 0.6) 15%, 
                rgba(200, 160, 255, 0.4) 40%, 
                rgba(166, 85, 255, 0.2) 70%, 
                transparent 100%)`,
              filter: "blur(15px)",
              transform: "translateX(50%) rotate(25deg)",
              transformOrigin: "top center",
              willChange: "transform, opacity",
            }}
          />
          {/* Right ray particles overlay (sharp, not blurred) */}
          <div
            className="absolute right-1/2 top-[60px] h-[280px] w-[80px] pointer-events-none overflow-hidden z-[1]"
            style={{
              transform: "translateX(50%) rotate(25deg)",
              transformOrigin: "top center",
            }}
          >
            {Array.from({ length: 2 }).map((_, i) => (
              <motion.span
                key={`rr-${i}`}
                className="absolute block w-[4px] h-[4px] rounded-full bg-white/85"
                style={{
                  left: `${10 + i * 7}%`,
                  boxShadow: "0 0 7px rgba(255,255,255,0.5)",
                  filter: "blur(1.8px)",
                }}
                initial={{ y: -18, opacity: 0.25, x: 0, scale: 0.8 }}
                animate={{
                  y: 280,
                  opacity: [0.25, 0.85, 0.25],
                  x: [0, i % 2 === 0 ? -2.5 : 2.5, 0],
                  scale: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 10 + (i % 4) * 1.8,
                  delay: (i % 6) * 0.35,
                  repeatDelay: 0.8 + (i % 3) * 0.4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            ))}
          </div>

          {/* Subtle wide glow for ambient lighting */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-[30px] h-[200px] w-[200px] opacity-25"
            style={{
              background: `radial-gradient(ellipse, 
                rgba(243, 232, 255, 0.4) 0%, 
                rgba(200, 160, 255, 0.2) 40%, 
                transparent 100%)`,
              filter: "blur(25px)",
            }}
          />
        </motion.div>

        {/* Improved purple glow arc - reduced intensity */}
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 w-[1000px] max-w-[90%] h-48 rounded-full bg-[radial-gradient(closest-side,rgba(166,85,255,0.15),rgba(31,8,33,0.0))] blur-2xl" />

        {/* Your existing SVG curve */}
        <motion.svg
          className="absolute w-screen top-[-250px] h-[900px] pointer-events-none"
          viewBox="0 0 100 50"
          preserveAspectRatio="none"
          initial={{ opacity: 0, y: -60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <defs>
            <linearGradient id="glowFill" x1="0%" y1="100%" x2="0%" y2="30%">
              <stop offset="0%" stopColor="transparent" />
              <stop offset="60%" stopColor="rgba(231, 186, 246, 0.15)" />
              <stop offset="100%" stopColor="rgba(231, 186, 246, 0.03)" />
            </linearGradient>

            <linearGradient
              id="curveGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="transparent" />
              <stop offset="25%" stopColor="rgba(166, 85, 255, 0.3)" />
              <stop offset="50%" stopColor="rgba(243, 232, 255, 0.8)" />
              <stop offset="75%" stopColor="rgba(166, 85, 255, 0.3)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          <motion.path
            d="M0,50 Q50,0 100,50 L100,0 L0,0 Z"
            fill="url(#glowFill)"
            opacity="1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />

          <motion.path
            d="M0,50 Q50,0 100,50"
            fill="none"
            stroke="url(#curveGradient)"
            strokeWidth="0.3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, delay: 0.5 }}
          />
        </motion.svg>

        {/* Your existing hero content */}
        <div className="relative z-10 w-full mt-[-7vw] max-w-3xl text-center py-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="flex items-center justify-center mb-[1vw]"
          >
            <span className="inline-block px-4 py-1 rounded-full border border-white/10 text-sm text-white/90 bg-white/5">
              New Update
            </span>
            <span className="ml-3 inline-block px-4 py-1 rounded-full border border-white/10 text-sm text-white/80 bg-white/3">
              Dashboard Live v2.3
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight"
          >
            Your Digital Safety Net,
            <br />
            on Autopilot.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="mt-4 text-gray-300 max-w-2xl mx-auto text-base md:text-lg"
          >
            Intelligence-driven cybersecurity, without the noise.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <button className="px-6 py-3 rounded-full bg-violet-600 text-white font-medium shadow hover:opacity-95 transition">
              Try Flare Now
            </button>
            <button className="px-6 py-3 rounded-full bg-white/10 text-white font-medium border border-white/10">
              Learn More
            </button>
          </motion.div>
        </div>
      </div>

      {/* Defense System Dynamic Section */}
      <div className="relative min-h-screen flex items-center justify-center bg-[#271D31]/40 py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25 }}
          className="text-center"
        >
          {/* Main Text */}
          <h2 className="text-4xl md:text-4xl lg:text-7xl flex flex-col leading-loose font-roboto font-medium text-[#ffffff]/90 mb-16 gap-3">
            <span>In an era where threats are constant and</span>
            <span>evolving, we believe your defense system</span>
            <span>should be just as dynamic.</span>
          </h2>

          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mt-5">
            <div className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                1.2M+
              </div>
              <div className="text-sm lg:text-md text-gray-400">
                A Scans Blocked Last Year
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                30 sec
              </div>
              <div className="text-sm lg:text-md text-gray-400">
                Average Response Time
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                20+
              </div>
              <div className="text-sm lg:text-md text-gray-400">
                Security Integrations
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                99.98%
              </div>
              <div className="text-sm lg:text-md text-gray-400">
                Threat Detection Accuracy
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
