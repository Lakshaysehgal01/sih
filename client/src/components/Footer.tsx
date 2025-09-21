import React from "react";
import { Link } from "react-router-dom";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ArrowUp,
} from "lucide-react";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#0a0a10] border-t border-white/10 relative">
      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </button>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-4xl font-bold">
                Veri
              </span>
              <span
                style={{ fontFamily: "BitCount Grid Double,sans-serif" }}
                className="font-sans sm:text-[2.5vw] text-[10vw] md:text-[5vw] lg:text-[2.5vw] text-white/90"
              >
                Fy
              </span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Advanced document verification platform powered by AI, blockchain,
              and OCR technology. Ensuring authenticity and security in the
              digital age.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                className="text-white/60 hover:text-purple-400 transition-colors duration-200"
                aria-label="GitHub"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="text-white/60 hover:text-purple-400 transition-colors duration-200"
                aria-label="Twitter"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="text-white/60 hover:text-purple-400 transition-colors duration-200"
                aria-label="LinkedIn"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="text-white/60 hover:text-purple-400 transition-colors duration-200"
                aria-label="Email"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail size={20} />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/technology"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-white/70 hover:text-white transition-colors duration-200 text-sm hover:translate-x-1 inline-block"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-semibold text-lg">Services</h3>
            <ul className="space-y-2">
              <li>
                <span className="text-white/70 text-sm">
                  Document Verification
                </span>
              </li>
              <li>
                <span className="text-white/70 text-sm">AI Detection</span>
              </li>
              <li>
                <span className="text-white/70 text-sm">
                  Blockchain Security
                </span>
              </li>
              <li>
                <span className="text-white/70 text-sm">OCR Technology</span>
              </li>
              <li>
                <span className="text-white/70 text-sm">
                  University Integration
                </span>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-white font-semibold text-lg">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin
                  size={16}
                  className="text-purple-400 mt-1 flex-shrink-0"
                />
                <span className="text-white/70 text-sm">
                  123 Innovation Street
                  <br />
                  Tech City, TC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-purple-400 flex-shrink-0" />
                <span className="text-white/70 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-purple-400 flex-shrink-0" />
                <span className="text-white/70 text-sm">
                  support@verify.com
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/60 text-sm">
              © {currentYear} VeriFy. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-white/60 hover:text-white transition-colors duration-200 text-sm"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
