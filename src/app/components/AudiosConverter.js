"use client";

import { useState, useRef } from "react";

const AudioConverter = () => {
  /* -----------HOOKS----------- */

  // useState hook to manage the selected audio file
  const [audio, setAudio] = useState(null);

  // useState hook to manage the selected output format
  const [format, setFormat] = useState("mp3");

  // useState hook to manage the conversion state (loading indicator)
  const [isConverting, setIsConverting] = useState(false);

  // useState hook to manage the modal visibility when no file is selected
  const [isModalVisible, setIsModalVisible] = useState(false);

  // useRef hook to directly manipulate the file input element
  const fileInputRef = useRef(null);

  /* -------------METHODS------------- */

  // Handle audio file selection from the file input
  const handleAudioUpload = (e) => {
    setAudio(e.target.files[0]);
  };

  // Handle format change from the dropdown menu
  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  // Function to handle the audio conversion process
  const convertAudio = async () => {
    if (!audio) {
      // If no audio file is selected, show the modal
      setIsModalVisible(true);
      return;
    }

    // Start conversion
    setIsConverting(true);

    const formData = new FormData();
    formData.append("audio", audio);
    formData.append("format", format);

    try {
      const response = await fetch("http://localhost:3001/api/convert-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Audio conversion failed");
      }

      // Convert response to a blob and create a URL for download
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger the download
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted-audio.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a); // Clean up after download
    } catch (error) {
      console.error("Error converting audio:", error);
      alert("An error occurred while converting the audio.");
    } finally {
      setIsConverting(false); // End conversion
    }
  };

  // Function to handle the cancel action
  const handleCancel = () => {
    setAudio(null); // Reset the audio file state
    setFormat("mp3"); // Reset the format to default
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input element
    }
  };

  /* -----------HTML----------- */

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-gray-800 text-white rounded-lg">
      <h1 className="font-bold text-2xl">AUDIOS CONVERTER</h1>
      <br />

      {/* Input for uploading an audio file */}
      <input
        type="file"
        accept="audio/*"
        onChange={handleAudioUpload}
        ref={fileInputRef}
        className="file-input file-input-bordered w-full max-w-xs"
      />

      {/* Dropdown to select the audio format */}
      <select
        value={format}
        onChange={handleFormatChange}
        className="select select-bordered w-full max-w-xs"
      >
        <option value="mp3">MP3</option>
        <option value="aac">AAC</option>
        <option value="wav">WAV</option>
        <option value="m4a">M4A</option>
        <option value="flac">FLAC</option>
        <option value="ogg">OGG</option>
        <option value="wma">WMA</option>
        <option value="aiff">AIFF</option>
        <option value="opus">OPUS</option>
        <option value="pcm">PCM</option>
        <option value="wv">WV</option>
        <option value="ra">RA</option>
        <option value="au">AU</option>
      </select>

      <br />

      {/* Button to trigger the audio conversion */}
      <div className="flex space-x-4">
        <button
          onClick={handleCancel}
          className="btn bg-red-600 hover:bg-red-800 text-white"
        >
          Cancel
        </button>
        <button
          onClick={convertAudio}
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
                No File Selected!
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

export default AudioConverter;
