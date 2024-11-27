import Joi from 'joi';

const email = Joi.string()
    .pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
    .required()
    .messages({
        'string.pattern.base':
            '{#label} must be in a valid format (Example: user@gmail.com)',
        'any.required': '{#label} is a required field',
        'string.empty': '{#label} should not be empty',
    });

const nameFieldValidator = Joi.string()
    .min(1)
    .max(25)
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
        'string.min': '{#label} must be at least {#limit} characters long',
        'string.max': '{#label} must be at most {#limit} characters long',
        'string.pattern.base': '{#label} must contain only letters',
        'any.required': '{#label} is a required field',
        'string.empty': '{#label} should not be empty',
    });

const loginValidator = Joi.object({
    email,
    password: Joi.string().required().messages({
        'any.required': '{#label} is a required field',
        'string.empty': '{#label} should not be empty',
        'string.base': '{#label} should be a type of text',
    }),
});

const registerValidator = Joi.object({
    email,
    name: nameFieldValidator,
    surname: nameFieldValidator,
});

const setPassword = Joi.object({
    password: Joi.string()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%_])(?=\S+$).{8,}$/)
        .required()
        .messages({
            'string.pattern.base':
                '{#label} must:\n- Be at least 8 characters\n- Include 1 lowercase and 1 uppercase letter\n- Include 1 digit and 1 special character (e.g., @, #, $, %)\n- Have no spaces',
            'any.required': '{#label} is a required field',
            'string.empty': '{#label} should not be empty',
        }),
    confirmPassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Passwords do not match',
        }),
});

export { loginValidator, registerValidator, setPassword };
