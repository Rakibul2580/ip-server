// server.js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001; // different from Vite's 5173

app.use(cors()); // allow your frontend origin

app.get("/", (req, res) => {
  res.send("IP Info Proxy Server is running");
});

app.get("/api/iplocate", async (req, res) => {
  const ip = req.query.ip || ""; // empty = use caller's IP
  const apiKey = "610798c45d0f33437c2395508bcbdc85"; // ← YOUR REAL KEY HERE (keep secret!)

  let url = `https://api.iplocate.io/api/lookup?apikey=${apiKey}`;
  if (ip) {
    url = `https://api.iplocate.io/api/lookup/${ip}?apikey=${apiKey}`;
  }

  console.log(url);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errText = await response.text();
      console.error(`IPLocate error: ${response.status} - ${errText}`);
      return res
        .status(response.status)
        .json({ error: `API error: ${response.status}`, details: errText });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch from IPLocate", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
