const express = require("express"),
    router = express.Router(),
    Campgrounds = require("../models/campgrounds"),
    Review = require("../models/review"),
    catchAsync = require("../utils/catchAsync");

const multer = require("multer"),
    { storage, cloudinary } = require("../middlewares/cloudinary"),
    upload = multer({ storage });

const {
    validateCampground,
    validateReview,
} = require("../middlewares/validations");
const {
    isLoggedIn,
    checkCampgroundOwnership,
} = require("../middlewares/authorization");

//**                MAIN

router.get(
    "/",
    catchAsync(async (_req, res) => {
        const campgrounds = await Campgrounds.find({});
        res.render("campgrounds/index", { campgrounds });
    })
);

//**                CREATE FORM

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

//**                CREATE POST
//! EDIT
router.post(
    "/new",
    isLoggedIn,
    upload.array("images"),
    validateCampground,
    catchAsync(async (req, res) => {
        const campground = new Campgrounds(req.body.campground);
        campground.images = req.files.map((f) => ({
            url: f.path,
            filename: f.filename,
        }));
        campground.author = req.user._id;
        await campground.save();
        req.flash("success", "New Campground Created!");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

//**                SHOW

router.get(
    "/:id",
    catchAsync(async (req, res) => {
        const campground = await Campgrounds.findById(req.params.id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author",
                    select: "username",
                },
            })
            .populate({ path: "author", select: "username" });
        if (!campground) {
            req.flash("error", "Cannot find that Campground");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", { campground });
    })
);

//**                UPDATE FORM

router.get(
    "/:id/edit",
    checkCampgroundOwnership,
    catchAsync(async (req, res) => {
        const campground = await Campgrounds.findById(req.params.id);
        res.render("campgrounds/edit", { campground });
    })
);

//**                UPDATE POST

router.put(
    "/:id/edit",
    checkCampgroundOwnership,
    upload.array("images"),
    validateCampground,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campgrounds.findByIdAndUpdate(id, {
            ...req.body.campground,
        });

        if (!campground) {
            req.flash("error", "Cannot find that Campground");
            return res.redirect("/campgrounds");
        }

        const images = req.files.map((f) => ({
            url: f.path,
            filename: f.filename,
        }));
        campground.images.push(...images);
        await campground.save();

        if (req.body.deleteImages) {
            for (let filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename);
            }
            await campground.updateOne({
                $pull: { images: { filename: { $in: req.body.deleteImages } } },
            });
        }

        req.flash("success", "Updated " + campground.name);
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

//**                DELETE

router.delete(
    "/:id/delete",
    checkCampgroundOwnership,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Campgrounds.findByIdAndDelete(id);
        req.flash("success", "Successfully Deleted Campground");
        res.redirect("/campgrounds");
    })
);

//**                Reviews

router.post(
    "/:id/reviews",
    isLoggedIn,
    validateReview,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campgrounds.findById(id);
        const review = new Review(req.body.review);
        campground.reviews.push(review);
        campground.rating += review.rating;
        review.author = req.user._id;
        await review.save();
        await campground.save();
        req.flash("success", "Created New Review!");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

//**                Delete Review

router.delete(
    "/:id/reviews/:rId",
    isLoggedIn,
    catchAsync(async (req, res) => {
        const { id, rId } = req.params;
        const review = await Review.findByIdAndDelete(rId);
        await Campgrounds.findByIdAndUpdate(id, {
            $pull: { reviews: rId },
            $inc: { rating: -Number(review.rating) },
        });

        req.flash("success", "Deleted Review");
        res.redirect(`/campgrounds/${id}`);
    })
);

// router.post("/save", isLoggedIn, (req, res) => {
//     Campgrounds.findByIdAndUpdate(
//         req.body.campgroundId,
//         {
//             $addToSet: {
//                 likes: req.user._id,
//             },
//         },
//         (err, _campground) => {
//             if (err) {
//                 res.send(err);
//             } else {
//                 res.send("Successful");
//             }
//         }
//     );
// });

// router.delete("/unsave", isLoggedIn, (req, res) => {
//     Campgrounds.findByIdAndUpdate(
//         req.body.campgroundId,
//         {
//             $pull: {
//                 likes: req.user._id,
//             },
//         },
//         (err) => {
//             if (err) {
//                 res.send(err);
//             } else {
//                 res.send("Successful");
//             }
//         }
//     );
// });

module.exports = router;
