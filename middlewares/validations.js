const ExpressError = require("../utils/ExpressError"),
    sanitizeHTML = require("sanitize-html"),
    BaseJoi = require("joi");

const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!",
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value)
                    return helpers.error("string.escapeHTML", { value });

                return clean;
            },
        },
    },
});

const Joi = BaseJoi.extend(extension);

exports.validateCampground = (req, res, next) => {
    const campgroundSchema = Joi.object({
        campground: Joi.object({
            name: Joi.string().required().min(3).escapeHTML(),
            price: Joi.number().required().min(1),
            location: Joi.string().required().min(3).escapeHTML(),
            description: Joi.string().required().min(3).escapeHTML(),
            startMonth: Joi.any(),
            endMonth: Joi.any(),
            facilities: Joi.any(),
        }).required(),
        deleteImages: Joi.array(),
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
            text: Joi.string().required().min(3).escapeHTML(),
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
