import React from "react";
import Header from "../components/Header";

const About = () => {
  return (
    <div>
      <Header cartCount={0} setCartCount={() => {}} />
      <main className="p-4 max-w-3xl mx-auto bg-white p-6 rounded shadow mt-4">
        <h1 className="text-3xl font-bold mb-4">About Us</h1>
        <p className="mb-4">
          Flipkart Clone is a demo e-commerce project built with React and
          Tailwind CSS. It showcases features such as authentication, product
          browsing, cart management, and checkout.
        </p>
        <p className="mb-4">
          This project is designed for learning purposes only and does not
          represent a real store. All products, prices, and data are sample
          placeholders.
        </p>
        <p>
          Explore the site, try adding products to your cart, create an account,
          and experience the basic functionality of an e-commerce platform!
        </p>
      </main>
    </div>
  );
};

export default About;
