const Joi = require("joi");

const registerSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(255)
    .required(),

  password: Joi.string()
    .min(6)
    .pattern(new RegExp("(?=.*[a-zA-Z])(?=.*[A-Z])"))
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter and one letter",
    }),

  name: Joi.string().max(100).required(),

  phone_number: Joi.string().max(20).required(),

  address: Joi.string().max(255).allow(null, ""),

  role: Joi.string().valid("user").optional().messages({
    "any.only": "Invalid role. You are only allowed to register as user.",
  }),
});

module.exports = {
  registerSchema,
};
