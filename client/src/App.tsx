import { Route, Routes } from "react-router-dom";
import "./App.css";
import Hero from "./pages/Hero";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
import Tech from "./pages/Tech";
import "@rainbow-me/rainbowkit/styles.css";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { Toaster } from "sonner";
import AdminSignIn from "./pages/AdminSignIn";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import Verify from "./pages/Verify";

function App() {
  return (
    <div className="mx-0">
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/technology" element={<Tech />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/admin/signin" element={<AdminSignIn />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/verify/:certHash" element={<Verify />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
