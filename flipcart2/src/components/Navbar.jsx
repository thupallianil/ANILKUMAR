import React, { useState } from "react";
import { Link } from "react-router-dom";

const categories = {
  Electronics: ["Smartphones", "Laptops", "Headphones", "Smart Watches"],
  Fashion: ["Men's Clothing", "Women's Clothing", "Shoes", "Accessories"],
  Appliances: ["Refrigerators", "Washing Machines", "Microwaves", "Air Conditioners"],
  Beauty: ["Makeup", "Skincare", "Haircare", "Fragrances"],
};

const Navbar = () => {
  const [openCat, setOpenCat] = useState(null);

  return (
    <nav className="bg-gray-600 shadow-md sticky top-0 z-40">
      <ul className="flex justify-center gap-8 py-3 text-white font-medium">
        {Object.keys(categories).map((cat) => (
          <li
            key={cat}
            className="relative"
            onMouseEnter={() => setOpenCat(cat)}
            onMouseLeave={() => setOpenCat(null)}
          >
            <Link
              to={`/products/${cat}`}
              className="cursor-pointer hover:text-yellow-300 transition-colors duration-200 px-3 py-2 flex items-center gap-1"
            >
              {cat}
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${openCat === cat ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>

            {/* Subcategory Dropdown */}
            <ul
              className={`absolute left-0 mt-0 w-52 bg-white shadow-xl rounded-lg overflow-hidden transition-all duration-300 transform origin-top ${openCat === cat
                  ? "opacity-100 scale-y-100 visible"
                  : "opacity-0 scale-y-0 invisible"
                }`}
              style={{ zIndex: 100 }}
            >
              {categories[cat].map((sub, index) => (
                <li key={sub}>
                  <Link
                    to={`/products/${encodeURIComponent(cat)}/${encodeURIComponent(sub)}`}
                    className={`block px-4 py-3 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors duration-200 ${index !== categories[cat].length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                  >
                    {sub}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
