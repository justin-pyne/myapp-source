require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");

app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.get("/api/health/db", async (req, res) => {
  try {
    await db.sequelize.authenticate();
    res.status(200).json({ ok: true, db: "up" });
  } catch (err) {
    res.status(503).json({ ok: false, db: "down", error: err.message });
  }
});

require("./app/routes/turorial.routes")(app);

const PORT = process.env.NODE_DOCKER_PORT || 8080;

db.sequelize
  .sync()
  .then(() => {
    console.log("Synced db.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync db:", err);
    process.exit(1);
  });