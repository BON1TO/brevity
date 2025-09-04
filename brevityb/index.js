import express from "express";
import "dotenv/config";

const app = express();
app.use(express.json());

// test route
app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "brevityb", time: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`));
