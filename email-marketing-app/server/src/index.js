import express, { json } from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/db.js";
import agenda, { start } from "./agenda.js";
import apiRoutes from "./routes/api.js";

connectDB();

const app = express();
app.use(cors());
app.use(json());
app.use("/api", apiRoutes);

(async () => {
  await start();
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
