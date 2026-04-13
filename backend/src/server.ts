import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes";
import { authenticate } from "./middleware/auth.middleware";
import { errorHandler } from "./middleware/error.middleware";
import projectRoutes from "./modules/project/project.routes";
import taskRoutes from "./modules/task/task.routes";

dotenv.config();

const app = express();
app.get("/me", authenticate, (req: any, res) => {
  res.json({
    message: "Protected route working",
    user: req.user,
  });
});
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.options("*", cors());
app.use(helmet());
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/", taskRoutes);

app.get("/", (_req, res) => {
  res.json({ message: "Taskflow API is running 🚀" });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("PORT FROM ENV:", process.env.PORT);
  console.log(`🚀 Server running on port ${PORT}`);
});
