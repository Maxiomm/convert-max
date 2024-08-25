"use client";

import React from "react";

const Navbar = ({ setConverterType }) => {
  return (
    <nav className="flex justify-center p-4 bg-gray-900 text-white border-b border-gray-800 shadow-md">
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
    </nav>
  );
};

export default Navbar;
