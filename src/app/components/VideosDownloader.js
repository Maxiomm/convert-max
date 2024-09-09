"use client";

import React, { useState } from "react";

const VideosDownloader = () => {
  /* -----------HOOKS----------- */

  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp4"); // Default format is mp4
  const [quality, setQuality] = useState("1080"); // Default quality is 1080p
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Regex to check if the URL is a valid YouTube link
  const youtubeUrlRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

  /* -------------METHODS------------- */

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const downloadVideo = async () => {
    // Check if URL is empty
    if (!url) {
      setModalMessage("No URL Provided! Please enter a YouTube URL.");
      setIsModalVisible(true); // Show the modal if no URL is entered
      return;
    }

    // Check if the entered URL is a valid YouTube link
    if (!youtubeUrlRegex.test(url)) {
      setModalMessage("Invalid URL! Please enter a valid YouTube URL.");
      setIsModalVisible(true); // Show the modal if the URL is invalid
      return;
    }

    setIsDownloading(true);

    // Open SSE connection to receive real-time progress updates
    const eventSource = new EventSource(
      "http://localhost:3001/api/download-progress"
    );

    eventSource.onmessage = (event) => {
      const progress = parseFloat(event.data);
      setProgress(progress); // Update the progress bar
    };

    try {
      const response = await fetch("http://localhost:3001/api/download-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, format, quality }),
      });

      if (!response.ok) {
        throw new Error("Error downloading the video");
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `downloaded-video.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during the download.");
    } finally {
      setIsDownloading(false);
      setProgress(0);
      eventSource.close(); // Close the SSE connection after download
    }
  };

  // Function to handle the cancel action
  const handleCancel = () => {
    setUrl(""); // Clear the URL input
    setFormat("mp4"); // Reset the format to default
    setQuality("1080"); // Reset the quality to default
  };

  /* -----------HTML----------- */

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-gray-800 text-white rounded-lg">
      <h2 className="font-bold text-2xl text-center w-full">
        VIDEOS DOWNLOADER
      </h2>

      <br />

      {/* Input for writing a video url */}
      <input
        type="text"
        value={url}
        onChange={handleUrlChange}
        placeholder="Enter YouTube URL"
        className="input input-bordered w-full max-w-xs"
      />

      {/* Dropdown to select the video format and quality */}
      <div className="flex space-x-2 w-full">
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="mp4">MP4</option>
          <option value="webm">WEBM</option>
          <option value="mkv">MKV</option>
        </select>

        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="4320">4320p (8K)</option>
          <option value="2160">2160p (4K)</option>
          <option value="1440">1440p (2K)</option>
          <option value="1080">1080p</option>
          <option value="720">720p</option>
          <option value="480">480p</option>
          <option value="360">360p</option>
          <option value="240">240p</option>
          <option value="144">144p</option>
        </select>
      </div>

      <br />

      {/* Progress bar */}
      {isDownloading && (
        <div
          className="w-full bg-gray-200 rounded-full h-1"
          style={{ marginTop: "0" }}
        >
          <div
            className="bg-blue-600 rounded-full h-1"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      {/* Button to trigger the video download */}
      <div className="flex justify-center space-x-4">
        {/* Cancel Button */}
        <button
          onClick={handleCancel}
          className="btn bg-red-600 hover:bg-red-800 text-white"
        >
          Cancel
        </button>

        {/* Download Button */}
        <button
          onClick={downloadVideo}
          className="btn bg-blue-600 hover:bg-blue-800 text-white"
          disabled={isDownloading}
        >
          {isDownloading ? "Downloading..." : "Download"}
        </button>
      </div>

      {/* Modal to warn about errors */}
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal modal-open">
            <div className="modal-box">
              <h2 className="font-bold text-red-600 text-lg">Error !</h2>
              <br />
              <p>{modalMessage}</p>
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

export default VideosDownloader;
