import express from "express";
import cors from "cors";
import db from "./config/database.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
// Import routes
import UserRoute from "./route/UserRoute.js";
import ContactRoute from "./route/ContactRoute.js";
import ChatRoute from "./route/ChatRoute.js";

import "./models/association.js";

const app = express();
app.set("view engine", "ejs");

dotenv.config();
const PORT = process.env.PORT || 5000;
app.use(cookieParser());

app.use(cors({ origin: "https://projek-akhir-072-096-dot-f-07-450706.uc.r.appspot.com" }));
app.use(express.json());

app.use("/users", UserRoute);
app.use("/contacts", ContactRoute);
app.use("/chats", ChatRoute);

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to the Chat App API" });
});

const startServer = async () => {
  try {
    await db.authenticate();
    console.log("✅ Database connected...");

    await db.sync();
    console.log("✅ Database synced...");

   app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Database connection error:", error);
  }
};

startServer();
