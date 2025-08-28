const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const fileUpload = require("express-fileupload");

// Load environment variables
dotenv.config({ path: "./Backend.env" });

// Passport config
require("./passport")(passport);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Session middleware (needed for Passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", require("../routes/auth")); // adjust if you have auth routes
app.use("/api/users", require("../routes/users")); // adjust if you have user routes

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Smart Campus Companion backend is running...");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

