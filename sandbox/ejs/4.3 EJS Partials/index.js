import express from "express";
import { exec } from "child_process";
import multer from "multer";

const app = express();
const port = 3000;

app.use(express.static("public"));

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index.ejs");
});

// Handle the file upload and execute a Bash command
app.post("/upload", upload.single("file"), (req, res) => {
  // Run a Bash command using the exec function
  console.log("loading the response");
  exec("python3 icare.py", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return;
    }

    // Render the result.ejs template and pass the command's output
    res.render("index.ejs", { result: stdout });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
