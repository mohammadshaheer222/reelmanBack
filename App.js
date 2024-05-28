const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ErrorHandler = require("./Middleware/Error");
const notFound = require("./Middleware/not-Found");
const cookieParser = require("cookie-parser");
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173","https://reelman-front.onrender.com"],
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

//routes
const adminController = require("./Controllers/Admin/adminController");
const adminHeroController = require("./Controllers/Admin/adminHeroController");
const adminMidController = require("./Controllers/Admin/adminMidController");
const adminWeddingController = require("./Controllers/Admin/adminWeddingController");
const adminInstaController = require("./Controllers/Admin/adminInstaController");
const userContactForm = require("./Controllers/User/contactController");
app.use(
  "/api/v2",
  adminController,
  adminHeroController,
  adminMidController,
  adminWeddingController,
  adminInstaController
);

app.use("/api/v2/user", userContactForm);
//for error handling
app.use(ErrorHandler);
app.use(notFound);

module.exports = app;
