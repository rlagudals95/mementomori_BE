import { priceSchema } from './price.schema';

export const deliveryFeeSchema = {
  type: Object,
  schema: {
    local: priceSchema,
    international: priceSchema,
    domestic: priceSchema,
  },
};
