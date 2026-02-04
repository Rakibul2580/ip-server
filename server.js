// server.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001; // different from Vite's 5173

app.use(cors()); // allow your frontend origin

app.get("/", (req, res) => {
  res.send("IP Info Proxy Server is running");
});

app.get("/api/ip-info", async (req, res) => {
  const ip =
    req.query.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {
    const response = await fetch(
      `https://api.findip.net/${ip}/?token=f1ebe4d52dab40fa90c4af7a32bf585e`,
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch IP data" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
