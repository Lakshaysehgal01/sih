import { Route, Routes } from "react-router-dom";
import "./App.css";
import Hero from "./pages/Hero";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
import "@rainbow-me/rainbowkit/styles.css";

function App() {
  return (
    <div className="mx-0">
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
    </div>
  );
}

export default App;
