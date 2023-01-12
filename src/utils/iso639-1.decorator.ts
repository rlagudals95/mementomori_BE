import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';
import ISO6391 from 'iso-639-1';

export function IsISO6391(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isISO6391',
      constraints: [validationOptions],
      validator: {
        validate: (value): boolean => ISO6391.validate(value),
        defaultMessage: buildMessage(
          (eachPrefix) =>
            eachPrefix + '$property must be a valid ISO 639-1 string',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
