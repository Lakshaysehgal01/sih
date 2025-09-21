import Navbar from "@/component/Navbar";
import TechStackChart from "@/component/TechStackChart";

export default function Tech() {
  return (
    <div className="h-full min-h-screen bg-[#0a0a10] flex flex-col">
      <Navbar />
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
        <h2 className="text-3xl md:text-5xl lg:text-5xl font-semibold text-white max-w-5xl mx-auto mb-8 leading-tight">
          Technology Stack Performance{" "}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {" "}
            Metrics
          </span>
        </h2>

        {/* Tech Stack Chart */}
        <div className="w-full max-w-7xl mb-12">
          <TechStackChart />
        </div>
      </section>
      {/* <Footer /> */}
    </div>
  );
}
