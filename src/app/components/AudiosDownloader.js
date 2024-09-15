"use client";

import React, { useState, useEffect } from "react";

const AudiosDownloader = () => {
  /* -----------HOOKS----------- */
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState("mp3"); // Default format is mp3
  const [progress, setProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Regex to check if the URL is a valid YouTube link
  const youtubeUrlRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

  // Interpolation for smooth progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayedProgress((prev) => (prev < progress ? prev + 0.5 : progress));
    }, 1); // Update every 1ms for a smooth effect

    return () => clearInterval(interval);
  }, [progress]);

  /* -------------METHODS------------- */

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const downloadAudio = async () => {
    // Check if URL is empty
    if (!url) {
      setModalMessage("No URL Provided! Please enter a YouTube URL.");
      setIsModalVisible(true);
      return;
    }

    // Check if the entered URL is a valid YouTube link
    if (!youtubeUrlRegex.test(url)) {
      setModalMessage("Invalid URL! Please enter a valid YouTube URL.");
      setIsModalVisible(true);
      return;
    }

    setIsDownloading(true);

    // Open SSE connection to receive real-time progress updates
    const eventSource = new EventSource(
      "https://convert-max-production.up.railway.app/api/audio-progress"
    );

    eventSource.onmessage = (event) => {
      const progress = parseFloat(event.data);
      setProgress(progress); // Update the progress bar
    };

    eventSource.onerror = (error) => {
      console.error("SSE connection error:", error);
      eventSource.close(); // Close connection on error
    };

    try {
      const response = await fetch(
        "https://convert-max-production.up.railway.app/api/download-audio",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url, format }),
        }
      );

      if (!response.ok) {
        throw new Error("Error downloading the audio");
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);

      // Create an anchor element to trigger the download
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `downloaded-audio.${format}`;
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
    setFormat("mp3"); // Reset the format to default
  };

  /* -----------HTML----------- */

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-gray-800 text-white rounded-lg">
      <h2 className="font-bold text-2xl text-center w-full">
        AUDIOS DOWNLOADER
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

      {/* Dropdown to select the audio format */}
      <div className="flex space-x-2 w-full">
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="select select-bordered w-full max-w-xs"
        >
          <option value="mp3">MP3</option>
          <option value="m4a">M4A</option>
          <option value="wav">WAV</option>
        </select>
      </div>

      <br />

      {/* Progress */}
      {isDownloading && (
        <div className="flex items-center w-full" style={{ marginTop: "0" }}>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-blue-600 rounded-full h-1"
              style={{ width: `${displayedProgress}%` }}
            ></div>
          </div>
          {/* Percentage text */}
          <span className="ml-2 text-white text-xs font-bold">
            {Math.round(displayedProgress)}%
          </span>
        </div>
      )}

      {/* Button to trigger the audio download */}
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
          onClick={downloadAudio}
          className="btn bg-blue-600 hover:bg-blue-800 text-white"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <span className="loading loading-spinner loading-md text-gray-400"></span>
          ) : (
            "Download"
          )}
        </button>
      </div>

      {/* Modal to warn about errors */}
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

export default AudiosDownloader;
