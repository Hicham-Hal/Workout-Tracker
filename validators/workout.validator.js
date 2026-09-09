import { body } from "express-validator";

const STATUS = ['pending', 'active', 'completed']

export const updateStatusValidator = [
    body('status')
        .trim()
        .notEmpty().withMessage('Status is required')
        .isIn(STATUS).withMessage(`Status must be one of: ${STATUS.join(', ')}`)
]