import path from "path";
import fs from "fs";
import express, { Express, Request, Response } from "express";

const PORT = process.env.PORT || 4000;
const CHUNK_SIZE = 10 ** 6;

const server: Express = express();

server.get("/", async function (req: Request, res: Response) {
  res.sendFile(path.resolve(__dirname, "../public/index.html"));
});

server.get("/video", async function (req: Request, res: Response) {
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Must include the range header");
  }

  const videoPath = path.resolve(__dirname, "../public/video.mp4");
  const videoSize = fs.statSync(videoPath).size;

  const start = Number(range?.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": end - start + 1,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

server.listen(PORT, () => {
  console.log(`==> Server up and running on PORT: ${PORT}`);
});
