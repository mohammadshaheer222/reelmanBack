const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../../Middleware/CatchAsyncErrors");
const sendMail = require("../../Utils/sendMail");
const ErrorHandler = require("../../Middleware/Error");

router.route("/contact-form").post(
  catchAsyncErrors(async (req, res, next) => {
    try {
      const formData = req.body;
      let message = `
      Name: ${formData.name}
      Email: ${formData.email}
      Phone: ${formData.phone}
      Message: ${formData.message}
      Location: ${formData.location}
      Event Date: ${formData.date}
    `;
      if (formData.photography) {
        message += `  Photography: Yes`;
      }
      if (formData.videography) {
        message += `  Videography: Yes`;
      }

      if (formData.both) {
        message += `  Both Photography and Videography: Yes`;
      }
      await sendMail({
        subject: "Booking Details",
        message: message,
      });
      res.status(201).json({
        success: true,
        message: "Thank you for your response!!",
      });
    } catch (error) {
      return next(new ErrorHandler("Internal Server Error", 500));
    }
  })
);

module.exports = router;
