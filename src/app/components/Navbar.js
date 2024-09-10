"use client";

import React from "react";
import Image from "next/image";

const Navbar = ({ setConverterType, converterType }) => {
  return (
    <nav className="flex justify-between p-4 bg-gray-900 text-white border-b border-gray-800">
      {/* Logo Section */}
      <div className="flex items-center">
        <Image
          src="/images/Logo-ConvertMax.png" // Path to the image file
          alt="App Logo"
          width={200}
          height={200}
          priority={true}
          draggable="false"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        {/* Image Button */}
        <button
          className={`mx-2 btn ${
            converterType === "image"
              ? "btn-neutral bg-white text-gray-900 cursor-default no-animation"
              : "btn-outline text-white border-white hover:bg-white hover:text-gray-900"
          }`}
          onClick={() => converterType !== "image" && setConverterType("image")}
        >
          IMAGES
        </button>

        {/* Video Button */}
        <button
          className={`mx-2 btn ${
            converterType === "video"
              ? "btn-neutral bg-white text-gray-900 cursor-default no-animation"
              : "btn-outline text-white border-white hover:bg-white hover:text-gray-900"
          }`}
          onClick={() => converterType !== "video" && setConverterType("video")}
        >
          VIDEOS
        </button>

        {/* Audio Button */}
        <button
          className={`mx-2 btn ${
            converterType === "audio"
              ? "btn-neutral bg-white text-gray-900 cursor-default no-animation"
              : "btn-outline text-white border-white hover:bg-white hover:text-gray-900"
          }`}
          onClick={() => converterType !== "audio" && setConverterType("audio")}
        >
          AUDIOS
        </button>

        {/* Document Button */}
        <button
          className={`mx-2 btn ${
            converterType === "document"
              ? "btn-neutral bg-white text-gray-900 cursor-default no-animation"
              : "btn-outline text-white border-white hover:bg-white hover:text-gray-900"
          }`}
          onClick={() =>
            converterType !== "document" && setConverterType("document")
          }
        >
          DOCUMENTS
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
