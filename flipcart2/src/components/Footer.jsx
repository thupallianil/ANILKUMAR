// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">About</h3>
          <ul className="space-y-2">
            <li><Link to="/about" className="hover:text-blue-400">About Us</Link></li>
            <li><a href="#" className="hover:text-blue-400">Careers</a></li>
            <li><a href="#" className="hover:text-blue-400">Flipkart Stories</a></li>
            <li><a href="#" className="hover:text-blue-400">Press</a></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Customer Service</h3>
          <ul className="space-y-2">
            <li><Link to="/payments" className="hover:text-blue-400">Payments</Link></li>
            <li><Link to="/shipping" className="hover:text-blue-400">Shipping</Link></li>
            <li><Link to="/cancellation" className="hover:text-blue-400">Cancellation & Returns</Link></li>
            <li><Link to="/faq" className="hover:text-blue-400">FAQ</Link></li>
            <li><Link to="/report" className="hover:text-blue-400">Report Infringement</Link></li>
          </ul>
        </div>

        {/* Policy */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Policy</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-blue-400">Return Policy</a></li>
            <li><a href="#" className="hover:text-blue-400">Terms of Use</a></li>
            <li><a href="#" className="hover:text-blue-400">Security</a></li>
            <li><a href="#" className="hover:text-blue-400">Privacy</a></li>
            <li><a href="#" className="hover:text-blue-400">Sitemap</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <MapPin size={18} /> Andhra Pradesh, India
            </li>
            <li className="flex items-center gap-2">
              <Mail size={18} /> support@flipkartclone.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={18} /> +91 6303068697
            </li>
          </ul>
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-blue-500"><Facebook /></a>
            <a href="#" className="hover:text-blue-400"><Twitter /></a>
            <a href="#" className="hover:text-pink-500"><Instagram /></a>
            <a href="#" className="hover:text-red-500"><Youtube /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Flipkart Clone — Designed by <span className="text-blue-400 font-semibold">Anil Thupalli</span>
      </div>
    </footer>
  );
};

export default Footer;
