import {
  Dimensions,
  Price,
  Weight,
} from '@modules/common/models/product.model';
import { DeliverySpeed } from '../delivery.constant';

export interface CalculateDeliveryFee {
  deliverySpeed: DeliverySpeed;
  platformDomainName: string;
  weight?: Weight;
  dimensions?: Dimensions;
  quantity: number;
}

export interface DeliveryFeeCalculatable {
  getCountryCode(): string;
  getCurrencyCode(): string;
  calculateShopLocalDelivery(request: CalculateDeliveryFee): Price;
  calculateInternationalDelivery(request: CalculateDeliveryFee): Price;
  calculateDomesticDeliveryFee(request: CalculateDeliveryFee): Price;
}
