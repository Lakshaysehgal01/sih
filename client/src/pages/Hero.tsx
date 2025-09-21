"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDrawerContext } from "@/shared-drawer-context";
import Navbar from "@/component/Navbar";
import TechStackChart from "@/component/TechStackChart";
import Footer from "@/components/Footer";

export default function Hero() {
  const { setIsDrawerOpen } = useDrawerContext();
  const moonRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<any[]>([]);
  const [showStars, setShowStars] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Create a subtle parallax effect for the moon
    const handleScroll = () => {
      if (moonRef.current) {
        const scrollY = window.scrollY;
        moonRef.current.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Generate random stars only on the client to prevent hydration mismatch
    const starArr = Array.from({ length: 500 }).map((_, i) => {
      const size = Math.random() * 2 + 0.5;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const opacity = Math.random() * 0.5 + 0.2;
      const twinkleDuration = Math.random() * 3 + 1.5;
      const floatDuration = Math.random() * 10 + 5;
      const delay = Math.random() * 2;
      return {
        size,
        posX,
        posY,
        opacity,
        twinkleDuration,
        floatDuration,
        delay,
        i,
      };
    });
    setStars(starArr);
  }, []);

  useEffect(() => {
    // Defer showing stars until after main content is loaded
    const timeout = setTimeout(() => setShowStars(true), 1200); // 1.2s delay
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Navbar />
      <section className="min-h-screen min-w-full pt-24 pb-0 flex flex-col justify-center relative overflow-hidden">
        {/* Purple radial background */}
        <div className="absolute inset-0 bg-[#15042c] [mask-image:radial-gradient(100%_50%,white,transparent_90%)] md:[mask-image:radial-gradient(50%_50%,white,transparent_90%)]"></div>
        {/* Stars background - implemented directly in the component */}
        <div className="absolute inset-0 z-[3] overflow-hidden">
          {showStars &&
            stars.map(
              ({
                size,
                posX,
                posY,
                opacity,
                twinkleDuration,
                floatDuration,
                delay,
                i,
              }) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    left: `${posX}%`,
                    top: `${posY}%`,
                    opacity: opacity,
                    animation: `twinkle ${twinkleDuration}s infinite ${delay}s, float ${floatDuration}s infinite ${delay}s`,
                  }}
                />
              )
            )}
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="flex flex-col items-center text-center md:mt-28 mt-5"
          >
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold tracking-tight max-w-5xl leading-normal">
              <span className="md:block">
                Smart blockchain credentials, <br />
                <span className="italic font-bold font-nyght bg-gradient-to-b from-zinc-700 via-zinc-200 to-zinc-50 bg-clip-text text-transparent tracking-wide">
                  without the complexity.
                </span>
              </span>
            </h1>

            <div className="md:mt-6 flex items-center justify-center gap-2 flex-wrap mt-6">
              <span className="bg-gradient-to-b from-neutral-100 to-neutral-500 bg-clip-text text-transparent text-lg md:text-xl lg:text-2xl font-normal">
                Blockchain-powered verification, without the fraud
              </span>
            </div>

            <div className="mt-8 md:mt-12 flex flex-col sm:flex-row items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="inline-block"
              >
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="group bg-[#2d2b3a] hover:bg-[#3a3a4a] border border-white/10 rounded-full  px-6 py-3 flex items-center gap-1.5 md:gap-2 transition-all duration-300"
                >
                  <span
                    onClick={() => navigate("/dashboard")}
                    className="text-sm md:text-base font-normal"
                  >
                    Try VeriFy
                  </span>
                  <span className="bg-white/10 rounded-full p-0.5 md:p-1 group-hover:translate-x-1 transition-transform duration-300">
                    <ArrowRight
                      size={14}
                      className="md:w-4 md:h-4 text-white"
                    />
                  </span>
                </button>
              </motion.div>
              <div className="flex items-center text-gray-300 hover:text-white transition-colors">
                <>
                  <button
                    className="mr-2 p-1 rounded text-white flex items-center justify-center"
                    aria-label="Copy email"
                    type="button"
                    style={{ width: 28, height: 28 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        stroke="currentColor"
                        fill="none"
                      />
                      <rect
                        x="3"
                        y="3"
                        width="13"
                        height="13"
                        rx="2"
                        stroke="currentColor"
                        fill="none"
                      />
                    </svg>
                  </button>
                  <Link to="about">
                    <span className="font-normal cursor-pointer">About Us</span>
                  </Link>
                </>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Gradient bridge to blend Hero's deep blue into About's black */}
        <div className="absolute -bottom-6 left-0 right-0 w-full h-12 pointer-events-none z-[11]" />

        {/* Moon visual effect, bottom of hero */}
        <div
          ref={moonRef}
          className="animate-scaleIn pointer-events-none relative z-10 mx-auto -mt-32 h-96 w-full [mask-image:radial-gradient(50%_50%,white,transparent)]"
        >
          <div
            className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#5506ba,transparent_85%)]"
            style={{ opacity: 0.5 }}
          ></div>
          <div className="absolute top-1/2 -left-1/2 z-20 aspect-[1/0.7] w-[200%]">
            <div className="absolute inset-0 rounded-[100%] bg-black"></div>
            <div
              className="absolute inset-0 overflow-hidden rounded-[100%]"
              style={{
                background: "transparent",
                boxShadow: "inset 0 2px 20px #fff, 0 -10px 50px 1px #ffffff6e",
              }}
            >
              <div
                className="absolute top-0 right-[25%] left-[25%] h-[3px] bg-gradient-to-r from-transparent via-white to-transparent"
                style={{
                  boxShadow:
                    "rgba(255, 255, 255, 0.898) 0px 0px 19.9443px 4.97771px",
                }}
              ></div>
            </div>
          </div>
          <div
            className="absolute top-1/2 -left-1/2 z-15 aspect-[1/0.7] w-[200%] rounded-[100%] bg-transparent"
            style={{
              boxShadow:
                "rgba(255, 255, 255, 0.698) 0px -5px 59.7771px 1px, rgba(255, 255, 255, 0.596) 0px 1px 14.9443px inset",
            }}
          ></div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="h-full min-h-screen bg-[#0a0a10] flex flex-col"
      >
        <section className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white max-w-5xl mx-auto mb-8 leading-tight">
            In an era where fake credentials are rampant and evolving, we
            believe your verification system should be just as sophisticated.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-2">
            <div className="flex flex-col items-center">
              <span className="text-xl md:text-2xl font-bold text-white">
                47M+
              </span>
              <span className="text-xs md:text-sm text-white/70 mt-1">
                Fake Certificates in India Workforce
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl md:text-2xl font-bold text-white">
                60 sec
              </span>
              <span className="text-xs md:text-sm text-white/70 mt-1">
                Blockchain Verification Time
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl md:text-2xl font-bold text-white">
                28%
              </span>
              <span className="text-xs md:text-sm text-white/70 mt-1">
                Job Applicants Submit Fake Degrees
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xl md:text-2xl font-bold text-white">
                ₹3,000Cr+
              </span>
              <span className="text-xs md:text-sm text-white/70 mt-1">
                Annual Loss from Education Fraud
              </span>
            </div>
          </div>
        </section>
      </motion.div>

      <div className="min-h-screen bg-[#0a0a10] pt-24 pb-16">
        {/* Purple radial background */}
        <div className="absolute inset-0 bg-[#15042c] [mask-image:radial-gradient(100%_50%,white,transparent_90%)]"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Technology Stack Performance
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                Metrics
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Transforming credential verification through blockchain technology
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <TechStackChart />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
