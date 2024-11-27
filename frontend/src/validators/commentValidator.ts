import Joi from 'joi';

const commentValidator = Joi.object({
    text: Joi.string().required().min(1).max(50).messages({
        'string.base': "comment should be a type of 'text'",
        'any.required': 'comment is a required field',
        'string.empty': 'comment should not be empty',
        'string.min': 'comment should have a minimum length of {#limit}',
        'string.max': 'comment should have a maximum length of {#limit}',
    }),
});

export { commentValidator };
