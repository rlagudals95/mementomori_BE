import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';
import { validateCurrencyCode } from './currency-code.util';

export function IsISO4217(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isISO4217',
      constraints: [validationOptions],
      validator: {
        validate: (value): boolean => validateCurrencyCode(value),
        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix + '$property must be a valid ISO 4217 string',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
