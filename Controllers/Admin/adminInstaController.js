const express = require("express");
const router = express.Router();
const catchAsyncErrors = require("../../Middleware/CatchAsyncErrors");
const ErrorHandler = require("../../Utils/ErrorHandler");
const Insta = require("../../Model/Admin/adminInstaModel");

router.route("/get-insta").get(
  catchAsyncErrors(async (req, res, next) => {
    try {
      const insta = await Insta.find({});
      res.status(200).json({ success: true, insta });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.route("/create-insta").post(
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { link } = req.body;
      if (!link) {
        return next(new ErrorHandler("Link field is mandatory", 400));
      }
      const insta = await Insta.create({ link });
      res.status(201).json({ success: true, insta });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);


router.route("/delete-insta/:id").delete(
  catchAsyncErrors(async (req, res, next) => {
    const { id: instaId } = req.params;
    const insta = await Insta.findOneAndDelete({ _id: instaId });
    if (!insta) {
      return next(new ErrorHandler("No Images with this id", 400));
    }
    res.status(200).json({ success: true, insta });
  })
);

module.exports = router;
