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

// Middleware to parse JSON bodies
app.use(express.json());

// Configure Multer to handle file uploads, storing them in the 'uploads' directory
const upload = multer({ dest: "uploads/" });

// Video conversion route
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

// Video downloader route
app.post("/api/download-video", (req, res) => {
  const youtubeUrl = req.body.url; // Get the YouTube URL from the request body
  const format = req.body.format || "mp4"; // Get the format or default to mp4
  const quality = req.body.quality || "best"; // Default to best quality

  const outputFile = `uploads/${Date.now()}.${format}`; // Use the selected format

  // Command to download the YouTube video using yt-dlp, specifying the quality and format
  const command = `yt-dlp -f "bestvideo[height<=${quality}]+bestaudio/best" -o "${outputFile.replace(
    `.${format}`,
    ""
  )}.%(ext)s" ${youtubeUrl}`;

  // Execute the download command
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Download error: ${error.message}`);
      return res.status(500).send("Download error");
    }

    console.log(`Download successful: ${stdout}`);

    // Detect if the final output is .mp4 or .webm
    const finalOutputFile = outputFile.replace(`.${format}`, ".webm"); // Forcing to WebM

    // Send the downloaded file to the client
    res.download(finalOutputFile, (err) => {
      if (err) {
        console.error(`Error sending file: ${err.message}`);
      }
      fs.unlinkSync(finalOutputFile); // Clean up the file after sending
    });
  });
});

// Audio conversion route
app.post("/api/convert-audio", upload.single("audio"), (req, res) => {
  const format = req.body.format;
  const outputPath = `uploads/converted-audio.${format}`;

  const command = `ffmpeg -i ${req.file.path} ${outputPath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("Error converting audio:", error.message);
      console.error("stderr:", stderr);
      return res.status(500).send("Error converting audio");
    }

    res.download(outputPath, (err) => {
      if (err) {
        console.error("Error sending audio:", err);
      }

      fs.unlink(req.file.path, () => {});
      fs.unlink(outputPath, () => {});
    });
  });
});

// Document conversion route
/*app.post("/api/convert-document", upload.single("document"), (req, res) => {
  const inputFile = req.file.path; // Path to the uploaded file
  const outputFormat = req.body.format; // Desired output format (e.g., docx, html, etc.)
  const outputFile = `uploads/${path.basename(inputFile)}.${outputFormat}`; // Output file path

  // Execute Pandoc command for conversion
  const command = `pandoc "${inputFile}" -o "${outputFile}"`;
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Conversion error: ${error.message}`);
      return res.status(500).send("Conversion error");
    }
    // Send the converted file to the client
    res.download(outputFile, (err) => {
      if (err) {
        console.error(`File sending error: ${err.message}`);
      }
      // Clean up temporary files after download
      fs.unlinkSync(inputFile);
      fs.unlinkSync(outputFile);
    });
  });
});*/

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
  console.log(`Converter backend running at http://localhost:${port}`);
});
