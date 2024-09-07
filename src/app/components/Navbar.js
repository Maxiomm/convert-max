"use client";

import React from "react";
import Image from "next/image";

const Navbar = ({ setConverterType }) => {
  return (
    <nav className="flex justify-between p-4 bg-gray-900 text-white border-b border-gray-800">
      {/* Logo Section */}
      <div className="flex items-center">
        <Image
          src="/images/Logo-ConvertMax.png" // Path to the image file
          alt="App Logo"
          width={200} // Specify the width of the image
          height={200} // Specify the height of the image
          priority={true} // Ensure the logo is loaded immediately for better performance
          draggable="false" // Prevent image from being dragged
        />
      </div>

      {/* Empty div to push the buttons to the center */}
      <div className="flex-grow"></div>

      {/* Navigation Buttons */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <button
          className="mx-2 btn btn-outline text-white border-white hover:bg-white hover:text-gray-900"
          onClick={() => setConverterType("image")}
        >
          IMAGES
        </button>
        <button
          className="mx-2 btn btn-outline text-white border-white hover:bg-white hover:text-gray-900"
          onClick={() => setConverterType("video")}
        >
          VIDEOS
        </button>
        <button
          className="mx-2 btn btn-outline text-white border-white hover:bg-white hover:text-gray-900"
          onClick={() => setConverterType("audio")}
        >
          AUDIOS
        </button>
        <button
          className="mx-2 btn btn-outline text-white border-white hover:bg-white hover:text-gray-900"
          onClick={() => setConverterType("document")}
        >
          DOCUMENTS
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
