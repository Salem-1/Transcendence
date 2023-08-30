import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(bodyParser.urlencoded({ extended: true }));

function authenticate(req, res, next) {
    // Print the raw packet
    console.log("Raw Packet:\n", req.rawHeaders.join('\n'), "\n\n", req.rawBody);

    // Regenerate the request object
    const regeneratedReq = {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body
    };

    console.log("Regenerated Packet:\n", regeneratedReq);

    console.log("received pass  " + req.body["password"]);
    if (req.body["password"] == "ILoveProgramming") {
        res.sendFile(__dirname + "/public/secret.html");
    } else {
        res.sendFile(__dirname + "/public/index.html");
    }
    next();
}

app.use(authenticate);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/secret.html");
});

app.post("/check", (req, res) => {
    // Process the regenerated request object here
    res.send("Post Check endpoint");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
