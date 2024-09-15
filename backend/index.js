const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const cron = require("node-cron");

const app = express();
const port = process.env.PORT || 3001;

const corsOptions = {
  origin: "https://convertmax.vercel.app", // Allow requests from this specific origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Specify the allowed HTTP methods
  allowedHeaders: ["Content-Type"],
  credentials: true, // If you want to handle authentication or cookies
  optionsSuccessStatus: 204, // Handle pre-flight requests for older browsers
};

// Enable CORS for all origins to allow cross-origin requests from the frontend
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Configure Multer to handle file uploads, storing them in the 'uploads' directory
const upload = multer({ dest: "uploads/" });

app.get("/api/test", (req, res) => {
  res.send("API is working!");
});

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
  const youtubeUrl = req.body.url;
  const quality = req.body.quality || "best";

  const outputFile = `uploads/${Date.now()}`;

  const command = `yt-dlp -f "bestvideo[height<=${quality}]+bestaudio/best" -o "${outputFile}.%(ext)s" ${youtubeUrl}`;

  const downloadProcess = exec(command);

  // Track progress
  let progress = 0;

  downloadProcess.stdout.on("data", (data) => {
    console.log(`Download Progress: ${data}`);

    // Parse logs to extract progress percentage
    const progressMatch = data.match(/\[download\] +(\d+(\.\d+)?)%/);
    if (progressMatch) {
      progress = parseFloat(progressMatch[1]);

      // Send the progress to all SSE clients that are still connected
      sseClients.forEach((client, index) => {
        if (client.res && client.res.writableEnded === false) {
          // Check if the response is still active
          try {
            client.res.write(`data: ${progress}\n\n`);
          } catch (error) {
            console.error(`Error writing to client ${index}:`, error);
          }
        } else {
          console.log(
            `Client ${index} connection closed. Removing from the list.`
          );
          sseClients.splice(index, 1); // Remove client if connection is closed
        }
      });
    }
  });

  downloadProcess.on("close", (code) => {
    console.log(`Download process exited with code ${code}`);

    const possibleExtensions = [".mp4", ".webm", ".mkv"];
    let finalOutputFile;

    for (let ext of possibleExtensions) {
      if (fs.existsSync(`${outputFile}${ext}`)) {
        finalOutputFile = `${outputFile}${ext}`;
        break;
      }
    }

    if (!finalOutputFile) {
      return res.status(500).send("Error: Final file not found.");
    }

    // Send the final downloaded file as a response
    res.download(finalOutputFile, (err) => {
      if (err) {
        console.error(`Error sending file: ${err.message}`);
      } else {
        fs.unlinkSync(finalOutputFile); // Delete the file after sending
      }
    });
  });
});

// SSE (Server-Sent Events) to send progress updates continuously
let sseClients = [];

// Endpoint to open the SSE connection for progress updates
app.get("/api/download-progress", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Add the client to the list
  sseClients.push({ id: Date.now(), res });

  req.on("close", () => {
    // Remove the client when the connection is closed
    sseClients = sseClients.filter((client) => client.res !== res);
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

// Audio downloader route
app.post("/api/download-audio", (req, res) => {
  const youtubeUrl = req.body.url;
  const format = req.body.format || "mp3";
  const outputFile = `uploads/${Date.now()}.${format}`;

  // Command to extract audio
  const command = `yt-dlp -x --audio-format ${format} -o "${outputFile}" ${youtubeUrl}`;

  const downloadProcess = exec(command);

  downloadProcess.stdout.on("data", (data) => {
    console.log(`Download Progress: ${data}`);

    // Extract progress percentage from yt-dlp output
    const progressMatch = data.match(/\[download\] +(\d+(\.\d+)?)%/);
    if (progressMatch) {
      const progress = parseFloat(progressMatch[1]);

      // Send the progress to all SSE clients that are still connected
      sseClients.forEach((client, index) => {
        if (client && !client.writableEnded) {
          // Correct check for client
          try {
            client.write(`data: ${progress}\n\n`);
          } catch (error) {
            console.error(`Error writing to client ${index}:`, error);
          }
        } else {
          console.log(
            `Client ${index} connection closed. Removing from the list.`
          );
          sseClients.splice(index, 1); // Remove client if connection is closed
        }
      });
    }
  });

  downloadProcess.on("close", (code) => {
    console.log(`Download process exited with code ${code}`);

    res.download(outputFile, (err) => {
      if (err) {
        console.error(`Error sending file: ${err.message}`);
      } else {
        fs.unlinkSync(outputFile); // Delete the file after sending it
      }
    });
  });
});

// Endpoint to open SSE connection for progress updates
app.get("/api/audio-progress", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Add the client to the list
  sseClients.push(res);

  req.on("close", () => {
    // Remove client when the connection is closed
    const index = sseClients.indexOf(res);
    if (index !== -1) {
      sseClients.splice(index, 1);
    }
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
