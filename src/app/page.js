"use client";

import React, { useState } from "react";
import Navbar from "./components/Navbar";
import ImagesConverter from "./components/ImagesConverter";
import VideosConverter from "./components/VideosConverter";
import VideosDownloader from "./components/VideosDownloader";
import AudiosConverter from "./components/AudiosConverter";
import AudiosDownloader from "./components/AudiosDownloader";
import DocumentsConverter from "./components/DocumentsConverter";

const Page = () => {
  /* -----------HOOKS----------- */

  // Default to image converter
  const [converterType, setConverterType] = useState("image");

  // State to trigger animation
  const [animate, setAnimate] = useState(false);

  /* -------------METHODS------------- */

  const handleConverterChange = (type) => {
    setAnimate(true);
    setTimeout(() => {
      setConverterType(type);
      setAnimate(false);
    }, 200); // Duration matches with the animation duration
  };

  /* -----------HTML----------- */

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar with buttons to switch between converters */}
      <Navbar
        setConverterType={handleConverterChange}
        converterType={converterType}
      />

      {/* Container to centralize the converter and give it a "bubble" effect */}
      <div className="flex-grow flex justify-center items-center">
        {/* Only show this div if converterType is NOT "video" or "audio" */}
        {converterType !== "video" && converterType !== "audio" && (
          <div
            className={`bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full ${
              animate ? "animate-scale-down-up" : ""
            }`}
          >
            {/* Render the appropriate converter */}
            {converterType === "image" && <ImagesConverter />}
            {converterType === "document" && <DocumentsConverter />}
          </div>
        )}

        {converterType === "video" && (
          <div className="flex space-x-8">
            {/* Separate container for VideosConverter */}
            <div
              className={`bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full ${
                animate ? "animate-scale-down-up" : ""
              }`}
            >
              <VideosConverter />
            </div>

            {/* Separate container for VideosDownloader */}
            <div
              className={`bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full ${
                animate ? "animate-scale-down-up" : ""
              }`}
            >
              <VideosDownloader />
            </div>
          </div>
        )}

        {converterType === "audio" && (
          <div className="flex space-x-8">
            {/* Separate container for AudiosConverter */}
            <div
              className={`bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full ${
                animate ? "animate-scale-down-up" : ""
              }`}
            >
              <AudiosConverter />
            </div>

            {/* Separate container for AudiosDownloader */}
            <div
              className={`bg-gray-800 p-8 rounded-lg shadow-lg max-w-lg w-full ${
                animate ? "animate-scale-down-up" : ""
              }`}
            >
              <AudiosDownloader />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
