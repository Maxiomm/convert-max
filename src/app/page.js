"use client";

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import ImageConverter from "./components/ImageConverter";
import VideoConverter from "./components/VideoConverter";

const Page = () => {
  /* -----------HOOKS----------- */

  // Default to image converter
  const [converterType, setConverterType] = useState("image");

  // State to trigger animation
  const [animate, setAnimate] = useState(false);

  /* ------------- METHODS ------------- */

  const handleConverterChange = (type) => {
    setAnimate(true);
    setTimeout(() => {
      setConverterType(type);
      setAnimate(false);
    }, 200); // Duration matches with the animation duration
  };

  /* -----------HTML----------- */

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar with buttons to switch between converters */}
      <Navbar setConverterType={handleConverterChange} />

      {/* Container to centralize the converter and give it a "bubble" effect */}
      <div className="flex justify-center items-center mt-8">
        <div
          className={`bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full ${
            animate ? "animate-scale-down-up" : ""
          }`}
        >
          {converterType === "image" && <ImageConverter />}
          {converterType === "video" && <VideoConverter />}
        </div>
      </div>
    </div>
  );
};

export default Page;
