import Navbar from "@/component/Navbar";

export default function AboutUs() {
  return (
    <div className="h-full w-screen min-h-screen bg-[#0a0a10] flex flex-col">
      <Navbar />
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-white max-w-5xl mx-auto mb-8 leading-tight">
          In an era where threats are constant and evolving, we believe your
          defense system should be just as dynamic.
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-2">
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-bold text-white">
              1.2M+
            </span>
            <span className="text-xs md:text-sm text-white/70 mt-1">
              Attacks Blocked Last Year
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-bold text-white">
              30 sec
            </span>
            <span className="text-xs md:text-sm text-white/70 mt-1">
              Average Response Time
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-bold text-white">
              20+
            </span>
            <span className="text-xs md:text-sm text-white/70 mt-1">
              Security Integrations
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl md:text-2xl font-bold text-white">
              99.98%
            </span>
            <span className="text-xs md:text-sm text-white/70 mt-1">
              Threat Detection Accuracy
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
