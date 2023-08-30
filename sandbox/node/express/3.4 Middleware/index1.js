import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import morgan from "morgan"
// Get the directory name of the current module's URL
const __dirname = dirname(fileURLToPath(import.meta.url));

console.log(__dirname + "/public/index.html");
// Create an Express application
const app = express();
const port = 3000;

// Use bodyParser middleware to parse URL-encoded data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined"));


// Serve the index.html file when a GET request is made to the root path
app.get("/", (req, res) => {
  console.log(res);
  console.log(req);
  res.sendFile(__dirname + "/public/index.html");
  console.log(__dirname + "/public/index.html");
});

// Handle POST request made to the /submit path
app.post("/submit", (req, res) => {
  console.log(req.body);
  // Process the POST data and send a response
  res.send("POST request received");
});

// Start the Express server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
