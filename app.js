import express from "express";
import mongoose from "mongoose";
import { MONGODB_URI, PORT, JWT_SECRET_KEY } from "./config/config.js";
import authRoutes from "./routes/authRoutes.js";
import authenticate from "./middleware/authMiddleware.js";
import cookieParser from "cookie-parser";

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI = MONGODB_URI;

async function connectToDB() {
  try {
    await mongoose.connect(dbURI).then(() => {
      console.log("connected to db");
      startServer();
    });
  } catch (error) {
    console.log(error);
  }
}

connectToDB();

// server
function startServer() {
  app.listen(PORT, () => console.log(`server started on port ${PORT}`));
}

// routes
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", authenticate, (req, res) => res.render("smoothies"));
app.use(authRoutes);
