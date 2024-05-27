const express = require("express");
const router = express.Router();
const catchAsynErrors = require("../../Middleware/CatchAsyncErrors");
const Admin = require("../../Model/Admin/adminModel");
const { comparePassword, hashPassword } = require("../../Utils/bcrypt");
const jwt = require("jsonwebtoken");
const ErrorHandler = require("../../Utils/ErrorHandler");
const sendMail = require("../../Utils/sendMail");
const sendToken = require("../../Utils/jwtToken");
const CatchAsyncErrors = require("../../Middleware/CatchAsyncErrors");

router.route("/login").post(
  catchAsynErrors(async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return next(new ErrorHandler("Please Provide All Fields", 400));
      }
      // const userN = await Admin.create({email,password})
      const admin = await Admin.findOne({ email });

      if (admin && (await comparePassword(password, admin.password))) {
        // const accessToken = jwt.sign(
        //   { admin: { id: admin._id } },
        //   process.env.ACTIVATION_SECRET,
        //   {
        //     expiresIn: process.env.ACTIVATION_EXPIRES,
        //   }
        // );
        // return res
        //   .status(200)
        //   .json({ success: true, accessToken, message: "Login Successfull!!" });

        sendToken(admin, 201, res);
        return;
      }
      return next(new ErrorHandler("Invalid credentials", 400));
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//forgotten
router.route("/forgotten-password").post(
  catchAsynErrors(async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        return next(new ErrorHandler("Email field is mandatory", 400));
      }

      const admin = await Admin.findOne({ email });
      if (!admin) {
        return next(new ErrorHandler("Admin is not registered", 400));
      }

      const accessToken = jwt.sign(
        { id: admin._id },
        process.env.ACTIVATION_SECRET,
        {
          expiresIn: process.env.ACTIVATION_EXPIRES,
        }
      );

      try {
        await sendMail({
          email,
          subject: "Reset Password",
          message: `http://localhost:5173/reset-password/${accessToken}`,
        });
      } catch (error) {
        return next(new ErrorHandler(error.message, 500));
      }

      res.status(200).json({
        success: true,
        message: "Check your email and Reset Your Password",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.route("/reset-password/:token").post(
  catchAsynErrors(async (req, res, next) => {
    try {
      const { token } = req.params;
      const { password, confirmPass } = req.body;

      if (!password) {
        return next(new ErrorHandler("Password field is mandatory", 400));
      }

      const decoded = jwt.verify(token, process.env.ACTIVATION_SECRET);
      if (!decoded) {
        return next(new ErrorHandler("Not verified", 401));
      }

      if (password !== confirmPass) {
        return next(new ErrorHandler("Passwords do not match", 400));
      }

      const id = decoded.id;
      const hashedPassword = await hashPassword(password);
      const updatedPassword = await Admin.findByIdAndUpdate(
        { _id: id },
        { password: hashedPassword },
        { new: true, runValidators: true }
      );

      res.status(201).json({ success: true, message: "Password Updated" });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

//protected route

// router.route("/verify-user").get(
//   verifyAdmin,
//   catchAsynErrors(async (req, res, next) => {
//     try {
//       res.status(200).json({ success: true, message: "Authorized" });
//     } catch (error) {
//       console.log(error);
//     }
//   })
// );

router.route("/logout").get(
  CatchAsyncErrors(async (req, res, next) => {
    res.clearCookie("token");
    res.status(200).json("User has been logged out!!!");
  })
);

module.exports = router;
