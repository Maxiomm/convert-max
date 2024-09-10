"use client";

import React, { useState, useRef } from "react";

const DocumentConverter = () => {
  /* -----------HOOKS----------- */

  /*// State to manage the selected document file
  const [document, setDocument] = useState(null);

  // State to manage the selected output format
  const [format, setFormat] = useState("pdf");

  // State to manage the conversion process
  const [isConverting, setIsConverting] = useState(false);

  // State to manage the modal visibility when no file is selected
  const [isModalVisible, setIsModalVisible] = useState(false);

  // useRef hook to directly manipulate the file input element
  const fileInputRef = useRef(null);*/

  /* -------------METHODS------------- */

  /*// Handle document file selection from the file input
  const handleDocumentUpload = (e) => {
    setDocument(e.target.files[0]);
  };

  // Handle format change from the dropdown menu
  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  // Function to handle the document conversion process
  const convertDocument = async () => {
    if (!document) {
      // If no document is selected, show the modal
      setIsModalVisible(true);
      return;
    }

    setIsConverting(true); // Start conversion process

    const formData = new FormData();
    formData.append("document", document); // Append the file
    formData.append("format", format); // Append the desired output format

    try {
      const response = await fetch(
        "http://localhost:3001/api/convert-document",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Document conversion failed");
      }

      const blob = await response.blob(); // Get the converted file as a blob
      const url = URL.createObjectURL(blob); // Create a URL for the blob

      // Create a temporary link to trigger the file download
      const a = document.createElement("a");
      a.href = url;
      a.download = `converted-document.${format}`; // Set the filename
      document.body.appendChild(a);
      a.click(); // Trigger the download
      document.body.removeChild(a); // Clean up
    } catch (error) {
      console.error("Error converting document:", error);
      alert("An error occurred during conversion.");
    } finally {
      setIsConverting(false); // End conversion process
    }
  };

  // Function to handle the cancel action
  const handleCancel = () => {
    setDocument(null); // Reset the document file state
    setFormat("pdf"); // Reset the format to default
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input element
    }
  };*/

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-gray-800 text-white rounded-lg">
      {/*<h1 className="font-bold text-2xl">DOCUMENTS CONVERTER</h1>

      <br />*/}

      {/* Input for uploading a document file */}
      {/*<input
        type="file"
        accept=".docx,.html,.odt,.txt,.md,.epub"
        onChange={handleDocumentUpload}
        ref={fileInputRef}
        className="file-input file-input-bordered w-full max-w-xs"
      />*/}

      {/* Dropdown to select the document format */}
      {/*<select
        value={format}
        onChange={handleFormatChange}
        className="select select-bordered w-full max-w-xs"
      >
        <option value="docx">DOCX</option>
        <option value="html">HTML</option>
        <option value="odt">ODT</option>
        <option value="md">Markdown</option>
        <option value="txt">TXT</option>
        <option value="epub">EPUB</option>
      </select>

      <br />*/}

      {/* Buttons for cancel and convert actions */}
      {/*<div className="flex space-x-4">
        <button
          onClick={handleCancel}
          className="btn bg-red-600 hover:bg-red-800 text-white"
        >
          Cancel
        </button>
        <button
          onClick={convertDocument}
          className="btn bg-blue-600 hover:bg-blue-800 text-white"
          disabled={isConverting}
        >
          {isConverting ? "Converting..." : "Convert"}
        </button>
      </div>*/}

      {/* Modal to warn about no file being selected */}
      {/*{isModalVisible && (
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
      )}*/}

      <h1 className="font-bold text-2xl">WORK IN PROGRESS</h1>
    </div>
  );
};

export default DocumentConverter;
