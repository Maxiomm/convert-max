"use client";

import { useState, useRef } from "react";
import { jsPDF } from "jspdf";

const ImageConverter = () => {
  /* -----------HOOKS----------- */

  // useState hook to manage the selected image file
  const [image, setImage] = useState(null);

  // useState hook to manage the selected format (default is 'png')
  const [format, setFormat] = useState("png");

  // useState hook to manage the modal visibility when an error occurs
  const [isModalVisible, setIsModalVisible] = useState(false);

  // useRef hook to directly manipulate the file input element
  const fileInputRef = useRef(null);

  /* -------------METHODS------------- */

  // Function to handle image file upload
  const handleImageUpload = (e) => {
    setImage(e.target.files[0]); // Set the uploaded image file to the state
  };

  // Function to handle format selection
  const handleFormatChange = (e) => {
    setFormat(e.target.value); // Update the format state with the selected format
  };

  // Function to convert the uploaded image to the selected format
  const convertImage = async () => {
    if (!image) {
      // If no image is selected, show the modal
      setIsModalVisible(true);
      return;
    }

    const reader = new FileReader();

    // This function is triggered once the file is read
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result; // Set the image source to the uploaded file's data URL

      img.onload = () => {
        if (format === "pdf") {
          // Handle PDF conversion using jsPDF
          const pdf = new jsPDF({
            orientation: img.width > img.height ? "landscape" : "portrait",
            unit: "px",
            format: [img.width, img.height],
          });
          pdf.addImage(img.src, "JPEG", 0, 0, img.width, img.height);
          pdf.save("converted-image.pdf");
        } else if (format === "svg") {
          // Handle SVG conversion
          const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" width="${img.width}" height="${img.height}">
              <image href="${img.src}" width="${img.width}" height="${img.height}" />
            </svg>`;
          const blob = new Blob([svg], { type: "image/svg+xml" });
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = "converted-image.svg";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          // Create a canvas element to draw the image on
          const canvas = document.createElement("canvas");
          canvas.width = img.width; // Set canvas width to image width
          canvas.height = img.height; // Set canvas height to image height
          const ctx = canvas.getContext("2d"); // Get the 2D drawing context
          ctx.drawImage(img, 0, 0); // Draw the image onto the canvas

          // Create a temporary link element to download the converted image
          const convertedImgURL = canvas.toDataURL(`image/${format}`);

          const link = document.createElement("a");
          link.href = convertedImgURL;
          link.download = `converted-image.${format}`;
          document.body.appendChild(link); // Append link to the body
          link.click(); // Programmatically click the link to trigger the download
          document.body.removeChild(link); // Remove the link after download
        }
      };
    };

    // Read the image file as a data URL
    reader.readAsDataURL(image);
  };

  // Function to handle the cancel action
  const handleCancel = () => {
    setImage(null); // Reset the image state
    setFormat("png"); // Reset the format to default
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset the file input element
    }
  };

  /* -----------HTML----------- */

  return (
    <div className="flex flex-col items-center p-4 space-y-4 bg-gray-800 text-white rounded-lg">
      <h1 className="font-bold text-2xl">IMAGES CONVERTER</h1>
      <br />

      {/* Input for uploading an image file */}
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        className="file-input file-input-bordered w-full max-w-xs"
      />

      {/* Dropdown to select the image format */}
      <select
        value={format}
        onChange={handleFormatChange}
        className="select select-bordered w-full max-w-xs"
      >
        <option value="png">PNG</option>
        <option value="jpg">JPG</option>
        <option value="jpeg">JPEG</option>
        <option value="webp">WEBP</option>
        <option value="svg">SVG</option>
        <option value="pdf">PDF</option>
        <option value="bmp">BMP</option>
        <option value="tiff">TIFF</option>
        <option value="ico">ICO</option>
        <option value="avif">AVIF</option>
        <option value="heic">HEIC</option>
        <option value="psd">PSD</option>
        <option value="xcf">XCF</option>
        <option value="tga">TGA</option>
        <option value="pcx">PCX</option>
      </select>

      <br />

      {/* Button to trigger the image conversion */}
      <div className="flex space-x-4">
        <button
          onClick={handleCancel}
          className="btn bg-red-600 hover:bg-red-800 text-white"
        >
          Cancel
        </button>
        <button
          onClick={convertImage}
          className="btn bg-blue-600 hover:bg-blue-800 text-white"
        >
          Convert
        </button>
      </div>

      {/* Modal to warn about no file being selected */}
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal modal-open">
            <div className="modal-box">
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

export default ImageConverter;
