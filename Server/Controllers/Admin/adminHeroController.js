const express = require("express");
const router = express.Router();
const AdminHero = require("../../Model/Admin/adminHeroModel");
const CatchAsyncErrors = require("../../Middleware/CatchAsyncErrors");
const upload = require("../../multer");
const path = require("path");
const ErrorHandler = require("../../Utils/ErrorHandler");

router.route("/get-slide").get(
  CatchAsyncErrors(async (req, res, next) => {
    try {
      const avatar = await AdminHero.find({});
      res.status(200).json({ success: true, avatar });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.route("/create-slide").post(
  upload.array("hero-avatar", 4),
  CatchAsyncErrors(async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return next(new ErrorHandler("Image field is mandatory", 400));
      }

      const dbPhotosCount = await AdminHero.countDocuments();
      const totalUploadedFiles = dbPhotosCount + req.files.length;

      if (totalUploadedFiles > 4) {
        return next(
          new ErrorHandler(
            "You can upload a maximum of 4 photos ,Delete photos in your list",
            400
          )
        );
      }

      const avatars = [];
      for (const file of req.files) {
        const fileName = file.filename;
        const heroAvatar = path.join(fileName);
        const avatar = await AdminHero.create({
          success: true,
          heroAvatar,
        });
        avatars.push(avatar._id);
      }

      res.status(201).json({ success: true, avatars });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.route("/update-slide/:id").patch(
  upload.single("file"),
  CatchAsyncErrors(async (req, res, next) => {
    try {
      const { id: avatarId } = req.params;
      const fileName = req.file.filename;

      const heroAvatar = await AdminHero.findOneAndUpdate(
        { _id: avatarId },
        { heroAvatar: fileName },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!heroAvatar) {
        return next(new ErrorHandler(`No image with this ${id}`, 404));
      }

      res.status(200).json({ success: true, heroAvatar });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

router.route("/delete-slide/:id").delete(
  CatchAsyncErrors(async (req, res, next) => {
    try {
      const { id: heroId } = req.params;
      const heroAvatar = await AdminHero.findOneAndDelete({ _id: heroId });

      if (!heroAvatar) {
        return next(new ErrorHandler("No Images with this category", 404));
      }

      res.status(200).json({ success: true, heroAvatar });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
