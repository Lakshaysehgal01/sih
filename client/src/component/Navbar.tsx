import { ConnectButton } from "@rainbow-me/rainbowkit";
import { motion } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/technology", label: "Tech" },
  { to: "/blog", label: "Blog" },
  { to: "/more", label: "More" },
];

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-3 z-50">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        className="mx-auto flex items-center justify-around px-4"
      >
        {/* Left brand */}
        <div className="font-semibold tracking-wide select-none">
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-4xl font-bold ">
            Veri
          </span>
          <span
            style={{ fontFamily: "BitCount Grid Double,sans-serif" }}
            className="font-sans sm:text-[2.5vw] text-[10vw] md:text-[5vw] lg:text-[2.5vw] text-white/90"
          >
            Fy
          </span>
        </div>

        {/* Center pill nav */}
        <nav className="relative mx-4 hidden md:block">
          {/* top accent bar */}
          <span className="pointer-events-none absolute -top-2 left-1/2 h-1 w-14 -translate-x-1/2 rounded-full bg-white/90"></span>

          {/* glass container */}
          <div className="relative mx-auto flex items-center gap-1 rounded-full border border-white/10 bg-[rgb(16_14_22/70%)] px-2 py-2 backdrop-blur-xl shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8),inset_0_0_40px_rgba(255,255,255,0.04)]">
            {/* soft outer glow */}
            <div className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/10" />
            <div className="pointer-events-none absolute -inset-px rounded-full bg-[radial-gradient(80%_80%_at_50%_-20%,rgba(255,255,255,0.12),transparent_60%)]" />

            {/* links */}
            <ul className="flex items-center">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    className={({ isActive }) =>
                      [
                        "relative rounded-full px-1 py-2 text-sm transition-colors",
                        "hover:text-white",
                        isActive ? "text-white" : "",
                      ].join(" ")
                    }
                  >
                    {({ isActive }) => (
                      <span className="relative inline-flex items-center p-2">
                        {/* active glow pill */}
                        {isActive && (
                          <>
                            <span className="absolute inset-0 -z-10 rounded-full bg-white/10 shadow-[0_0_10px_10px_rgba(255,255,255,0.2)]" />
                            <span className="absolute inset-0 -z-10 rounded-full ring-1 ring-white/10" />
                          </>
                        )}
                        <div
                          className={`px-3 ${
                            isActive
                              ? "text-white font-semibold"
                              : "text-gray-300"
                          }`}
                        >
                          {l.label}
                        </div>
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}

              {/* CTA */}
              <li className="ml-1 pl-1">
                <ConnectButton />
              </li>
            </ul>
          </div>
        </nav>

        {/* Right icon */}
        <button
          type="button"
          className="group bg-[#2d2b3a] border border-white/10 rounded-full px-6 hover:cursor-pointer hover:bg-[#7B3FE4] py-3 flex items-center gap-1.5 md:gap-2 transition-all duration-300"
        >
          <span
            onClick={() => navigate("/signin")}
            className="text-sm md:text-base font-normal"
          >
            Login
          </span>
        </button>
      </motion.div>
    </header>
  );
}
