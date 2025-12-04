import React, { useEffect, useState } from "react";

const Welcome = ({ onFinish }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Show for 2 seconds before starting fade-out
    const visibleTimer = setTimeout(() => setFade(true), 2000);

    // After fade-out (0.5s), hide completely and call onFinish
    const hideTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2500);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(hideTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`w-screen h-screen flex items-center justify-center bg-blue-600 transition-opacity duration-500 ${
        fade ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src="/images.png" // public folder path
        alt="Flipcart Logo"
        className="w-48 h-48 animate-bounce"
      />
    </div>
  );
};

export default Welcome;
