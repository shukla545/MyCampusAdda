import { validationResult } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const details = errors.array();
  res.status(422).json({
    message: details[0]?.msg || 'Validation failed',
    errors: details
  });
};
