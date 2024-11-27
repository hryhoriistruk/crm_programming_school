import Joi from 'joi';

import { ECourse, ECourseFormat, ECourseType, EOrderStatus } from '../enums';

const positiveNumberMessages = {
    'number.base': '{#label} must be a number.',
    'number.positive': '{#label} must be a positive number.',
    'number.min': `{#label} must be at least {#limit}.`,
    'number.max': `{#label} must be at most {#limit}.`,
};

const stringLengthMessages = {
    'string.min': `{#label} must be at least {#limit} characters.`,
    'string.max': `{#label} must be at most {#limit} characters.`,
};

const enumMessages = {
    'any.only': '{#label} must be one of the following: {#valids}',
};

const orderValidator = Joi.object({
    group_id: Joi.number()
        .positive()
        .label('Group ID')
        .allow(null, '')
        .messages(positiveNumberMessages),

    name: Joi.string()
        .min(1)
        .max(35)
        .label('Name')
        .allow('')
        .messages(stringLengthMessages),

    surname: Joi.string()
        .min(1)
        .max(35)
        .label('Surname')
        .allow('')
        .messages(stringLengthMessages),

    email: Joi.string()
        .pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
        .label('Email')
        .allow('')
        .messages({
            'string.pattern.base':
                '{#label} must be a valid email format (e.g., user@example.com).',
        }),

    phone: Joi.string()
        .pattern(/^\d{3}\s\d{2}\s\d{3}\s\d{2}\s\d{2}$/)
        .label('Phone')
        .allow('')
        .messages({
            'string.pattern.base':
                '{#label} must be in the format "380 12 345 67 89".',
        }),

    age: Joi.number()
        .positive()
        .min(16)
        .max(90)
        .label('Age')
        .allow('', null)
        .messages(positiveNumberMessages),

    status: Joi.string()
        .valid(...Object.values(EOrderStatus), '')
        .label('Status')
        .allow('')
        .messages(enumMessages),

    course: Joi.string()
        .valid(...Object.values(ECourse), '')
        .label('Course')
        .allow('')
        .messages(enumMessages),

    course_format: Joi.string()
        .valid(...Object.values(ECourseFormat), '')
        .label('Course Format')
        .allow('')
        .messages(enumMessages),

    course_type: Joi.string()
        .valid(...Object.values(ECourseType), '')
        .label('Course Type')
        .allow('')
        .messages(enumMessages),

    sum: Joi.number()
        .positive()
        .min(1)
        .max(2147483647)
        .label('Sum')
        .allow('', null)
        .messages(positiveNumberMessages),

    alreadyPaid: Joi.number()
        .positive()
        .min(1)
        .max(2147483647)
        .label('Already Paid')
        .allow('', null)
        .messages(positiveNumberMessages),
});

const groupValidator = Joi.object({
    name: Joi.string()
        .min(2)
        .max(30)
        .label('Group name')
        .messages({
            ...stringLengthMessages,
            'string.empty': '{#label} can not be empty',
        }),
});

export { orderValidator, groupValidator };
