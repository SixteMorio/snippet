import fs from "fs";
import express from "express";
import https from "https";
import cors from "cors";
import "dotenv/config";
import v1Router from "./routes/v1.js";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5500"],
    credentials: true,
  })
);

app.use("/v1", v1Router);

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ msg: "Ton JWT est invalide !" });
  }

  console.log("erreur", "err");

  return res.status(err.status).json({ message: err.message });
});

const port = 7006;

// use https
const server = https.createServer(
  {
    key: fs.readFileSync("./localhost+1-key.pem"),
    cert: fs.readFileSync("./localhost+1.pem"),
  },
  app
);

// server.listen instead of app.listen
server.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
