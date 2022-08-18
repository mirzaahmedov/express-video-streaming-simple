"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const PORT = process.env.PORT || 4000;
const CHUNK_SIZE = 10 ** 6;
const server = (0, express_1.default)();
server.get("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.sendFile(path_1.default.resolve(__dirname, "../public/index.html"));
    });
});
server.get("/video", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const range = req.headers.range;
        if (!range) {
            res.status(400).send("Must include the range header");
        }
        const videoPath = path_1.default.resolve(__dirname, "../public/video.mp4");
        const videoSize = fs_1.default.statSync(videoPath).size;
        const start = Number(range === null || range === void 0 ? void 0 : range.replace(/\D/g, ""));
        const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": end - start + 1,
            "Content-Type": "video/mp4",
        };
        res.writeHead(206, headers);
        const videoStream = fs_1.default.createReadStream(videoPath, { start, end });
        videoStream.pipe(res);
    });
});
server.listen(PORT, () => {
    console.log(`==> Server up and running on PORT: ${PORT}`);
});
