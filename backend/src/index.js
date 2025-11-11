import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import prisma from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [`http://localhost:3000`],
  credentials: false,
}));

// Routes
app.get("/api/health", (req, res) => {
  res.send("HealLink API is up and running!");
});
app.use("/api/auth", authRoutes);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();