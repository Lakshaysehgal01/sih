import { Route, Routes } from "react-router-dom";
import "./App.css";
import Hero from "./pages/Hero";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
import "@rainbow-me/rainbowkit/styles.css";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import { Toaster } from "sonner";
import AdminSignIn from "./pages/AdminSignIn";

function App() {
  return (
    <div className="mx-0">
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/admin/signin" element={<AdminSignIn />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
