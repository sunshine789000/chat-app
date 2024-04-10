const Joi = require('joi')
const schema = {

    register: Joi.object().keys({
        password: Joi.string().min(8)
            .max(255)
            .pattern(/^(?=.*[a-zA-Z])([a-zA-Z@#$%^&*!0-9]+)$/).required().messages({
                'string.min': 'Password must be at least eight characters long',
                'string.pattern.base': 'Password must contain at least one letter and one digit, and may contain special characters',
                'any.required': 'Password is required'
            }),
        username: Joi.string().required().messages({
            'string.empty': 'Username must not be empty',
            'any.required': 'Username is required'
        })
    })

}
module.exports = schema;