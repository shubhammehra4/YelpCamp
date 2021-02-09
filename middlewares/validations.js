const ExpressError = require("../utils/ExpressError"),
    Joi = require("joi");

exports.validateCampground = (req, res, next) => {
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            name: Joi.string().required().min(3),
            price: Joi.number().required().min(1),
            location: Joi.string().required().min(3),
            image: Joi.string(),
            description: Joi.string().required().min(3),
            startMonth: Joi.any(),
            endMonth: Joi.any(),
            facilities: Joi.any(),
        }).required(),
    });
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((e) => e.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

exports.validateReview = (req, res, next) => {
    const reviewSchema = Joi.object({
        review: Joi.object({
            text: Joi.string().required().min(3),
            rating: Joi.number().required().min(1).max(5),
        }).required(),
    });

    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((e) => e.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
