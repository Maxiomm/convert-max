const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const cron = require("node-cron");

const app = express();
const port = 3001;

// Enable CORS for all origins to allow cross-origin requests from the frontend
app.use(cors());

// Configure Multer to handle file uploads, storing them in the 'uploads' directory
const upload = multer({ dest: "uploads/" });

// Route to handle video conversion requests
app.post("/api/convert-video", upload.single("video"), (req, res) => {
  const format = req.body.format; // Get the desired output format from the request
  const outputPath = `uploads/converted-video.${format}`; // Define the output path for the converted video

  // Construct the FFmpeg command to convert the video to the specified format
  const command = `ffmpeg -i ${req.file.path} ${outputPath}`;

  // Execute the FFmpeg command
  exec(command, (error, stdout, stderr) => {
    if (error) {
      // Log the error message if the conversion fails
      console.error("Error converting video:", error.message);
      console.error("stderr:", stderr); // Log FFmpeg's error output
      return res.status(500).send("Error converting video"); // Send a 500 response to the client
    }

    console.log("stdout:", stdout); // Log FFmpeg's standard output

    // Send the converted video file as a download to the client
    res.download(outputPath, (err) => {
      if (err) {
        console.error("Error sending video:", err); // Log any error that occurs during file download
      }

      // Clean up by deleting the original uploaded file and the converted file
      fs.unlink(req.file.path, () => {}); // Delete the uploaded file
      fs.unlink(outputPath, () => {}); // Delete the converted file after sending
    });
  });
});

// Function to clean up old files in the uploads directory
const cleanUploads = () => {
  const uploadsDir = path.join(__dirname, "uploads");
  const fileLifetime = 60 * 60 * 1000; // 1 hour in milliseconds

  fs.readdir(uploadsDir, (err, files) => {
    if (err) {
      console.error("Failed to read directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(uploadsDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Failed to get file stats:", err);
          return;
        }

        // Check if the file is older than the specified time
        if (Date.now() - stats.mtimeMs > fileLifetime) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Failed to delete file:", err);
            } else {
              console.log(`Deleted old file: ${filePath}`);
            }
          });
        }
      });
    });
  });
};

// Schedule the clean-up task to run every hour
cron.schedule("0 * * * *", () => {
  console.log("Running cleanup task");
  cleanUploads();
});

// Start the Express server and listen on the specified port
app.listen(port, () => {
  console.log(`Video converter backend running at http://localhost:${port}`);
});
