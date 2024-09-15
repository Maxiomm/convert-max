"use client";

import React from "react";
import Image from "next/image";

const Navbar = ({ setConverterType, converterType }) => {
  return (
    <nav className="flex flex-col lg:flex-row lg:justify-between items-center p-4 bg-gray-900 text-white border-b border-gray-800">
      {/* Logo Section */}
      <div className="flex items-center ml-4 mr-4 mb-4 lg:mb-0">
        <Image
          src="/images/Logo-ConvertMax.png"
          alt="App Logo"
          width={200}
          height={200}
          priority={true}
          draggable="false"
        />
      </div>

      {/* Navigation Buttons */}
      <div className="w-full flex flex-row items-center justify-center lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 space-x-4">
        {/* Image Button */}
        <button
          className={`btn ${
            converterType === "image"
              ? "btn-neutral bg-white text-gray-900 cursor-default no-animation"
              : "btn-outline text-white border-white hover:bg-white hover:text-gray-900"
          } xs:px-3 sm:px-4 px-2 py-2 text-xs xs:text-sm sm:text-base`}
          onClick={() => converterType !== "image" && setConverterType("image")}
        >
          IMAGES
        </button>

        {/* Video Button */}
        <button
          className={` btn ${
            converterType === "video"
              ? "btn-neutral bg-white text-gray-900 cursor-default no-animation"
              : "btn-outline text-white border-white hover:bg-white hover:text-gray-900"
          } xs:px-3 xs:px-3 sm:px-4 px-2 py-2 text-xs xs:text-sm sm:text-base`}
          onClick={() => converterType !== "video" && setConverterType("video")}
        >
          VIDEOS
        </button>

        {/* Audio Button */}
        <button
          className={`btn ${
            converterType === "audio"
              ? "btn-neutral bg-white text-gray-900 cursor-default no-animation"
              : "btn-outline text-white border-white hover:bg-white hover:text-gray-900"
          } xs:px-3 sm:px-4 px-2 py-2 text-xs xs:text-sm sm:text-base`}
          onClick={() => converterType !== "audio" && setConverterType("audio")}
        >
          AUDIOS
        </button>

        {/* Document Button */}
        <button
          className={` btn ${
            converterType === "document"
              ? "btn-neutral bg-white text-gray-900 cursor-default no-animation"
              : "btn-outline text-white border-white hover:bg-white hover:text-gray-900"
          } xs:px-3 sm:px-4 px-2 py-2 text-xs xs:text-sm sm:text-base`}
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
