import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { dirname } from "path";
import { fileURLToPath } from "url";

const _dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(morgan("combined"));

app.use(bandgen)
function bandgen(req, res, next)
{
  bandName = req.body["street"] + req.body["pet"];
  next();
}
var bandName = "";

app.get("/", (req, res)=>
{
  res.sendFile(_dirname + "/public/index.html");
});

app.post("/submit", (req, res) => {
  res.send("<h1>" + bandName + "</h1>") ;
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
