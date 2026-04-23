import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import './config/db.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

server.on('error', (err) => {
  console.error('Szerver hiba:', err.message);
});