"use client";

import { useState, useRef } from "react";

const VideoConverter = () => {
  /* -----------HOOKS----------- */

  // useState hook to store the selected video file
  const [video, setVideo] = useState(null);

  // useState hook to store the selected output format (default is 'mp4')
  const [format, setFormat] = useState("mp4");

  // useState hook to track if the video is currently being converted
  const [isConverting, setIsConverting] = useState(false);

  // useState hook to manage the modal visibility when an error occurs
  const [isModalVisible, setIsModalVisible] = useState(false);

  // useRef hook to directly manipulate the file input element
  const fileInputRef = useRef(null);

  /* -------------METHODS------------- */

  // Method to handle when a video file is uploaded by the user
  const handleVideoUpload = (e) => {
    setVideo(e.target.files[0]);
  };

  // Method to handle when the output format is changed by the user
  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  // Method to handle the video conversion process
  const convertVideo = async () => {
    if (!video) {
      // If no video is selected, show the modal
      setIsModalVisible(true);
      return;
    }

    // Indicate that the conversion process has started
    setIsConverting(true);

    const formData = new FormData();
    formData.append("video", video); // Append the selected video file
    formData.append("format", format); // Append the selected format

    try {
      // Send the video to the backend for conversion
      const response = await fetch("http://localhost:3001/api/convert-video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // If the response is not OK, throw an error
        throw new Error("Video conversion failed");
      }

      const blob = await response.blob(); // Get the video as a blob
      const url = URL.createObjectURL(blob); // Create a URL for the blob

      // Create a link element and trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted-video.${format}`; // Set the filename for download
      document.body.appendChild(a);
      a.click(); // Programmatically click the link to start the download
      document.body.removeChild(a); // Remove the link from the document
    } catch (error) {
      // Handle any errors that occur during the conversion
      alert("An error occurred while converting the video.");
    } finally {
      // Reset the converting state
      setIsConverting(false);
    }
  };

  // Function to handle the cancel action
  const handleCancel = () => {
    setVideo(null); // Reset the image state
    setFormat("mp4"); // Reset the format to default
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input element
    }
  };

  /* -----------HTML----------- */

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-gray-800 text-white rounded-lg">
      <h1 className="font-bold text-2xl">VIDEOS CONVERTER</h1>

      <br />

      {/* Input for uploading a video file */}
      <input
        type="file"
        accept="video/*"
        onChange={handleVideoUpload}
        ref={fileInputRef}
        className="file-input file-input-bordered w-full max-w-xs"
      />

      {/* Dropdown to select the video format */}
      <select
        value={format}
        onChange={handleFormatChange}
        className="select select-bordered w-full max-w-xs"
      >
        <option value="mp4">MP4</option>
        <option value="webm">WEBM</option>
        <option value="avi">AVI</option>
        <option value="mov">MOV</option>
        <option value="mkv">MKV</option>
        <option value="wmv">WMV</option>
        <option value="m4v">M4V</option>
        <option value="flv">FLV</option>
        <option value="mpg">MPG</option>
        <option value="ogv">OGV</option>
      </select>

      <br />

      {/* Button to trigger the video conversion */}
      <div className="flex space-x-4">
        <button
          onClick={handleCancel}
          className="btn bg-red-600 hover:bg-red-800 text-white"
        >
          Cancel
        </button>
        <button
          onClick={convertVideo}
          className="btn bg-blue-600 hover:bg-blue-800 text-white"
          disabled={isConverting}
        >
          {isConverting ? "Converting..." : "Convert"}
        </button>
      </div>

      {/* Modal to warn about no file being selected */}
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="modal modal-open cursor-custom"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsModalVisible(false); // Close modal if clic is out of the modal box
              }
            }}
          >
            <div className="modal-box cursor-default">
              <h2 className="font-bold text-red-600 text-lg">
                No File Selected !
              </h2>
              <br />
              <p>Please select a file before attempting to convert.</p>
              <div className="modal-action">
                <button
                  className="btn glass bg-blue-700 hover:bg-blue-800 text-white"
                  onClick={() => setIsModalVisible(false)}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConverter;
