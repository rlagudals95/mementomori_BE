import convert from 'convert';
import { Dimensions } from '@modules/common/models/product.model';
import { LengthUnit } from '@modules/common/models/product.constant';
import { DeliveryFee } from './calculate-delivery-fee.dto';
// import { CalculateDeliveryFeeDto } from './calculate-delivery-fee.dto';

// function needInspection(requestDto: CalculateDeliveryFeeDto): boolean {
//   return assumeCategory(requestDto) === 'TV';
// }

// function assumeCategory(requestDto: CalculateDeliveryFeeDto): string {
//   return requestDto.title.includes('TV') ? 'TV' : 'ETC';
// }

export function floor5(input: number): number {
  const first = Math.trunc(input / 10) * 10;
  const second = Math.round((input % 10) / 10) * 5;
  return first + second;
}

export function round5(input: number): number {
  const first = Math.trunc(input / 10) * 10;
  let second = input % 10;
  if (second % 5 !== 0) {
    second = input % 10 < 5 ? 5 : 10;
  }
  return first + second;
}

export function ceiling(input: number, significance: number): number {
  return Math.ceil(input / significance) * significance;
}

export function isOversized(dimensions: Dimensions): boolean {
  if (
    !dimensions ||
    !dimensions.unit ||
    (!dimensions.width && !dimensions.height && !dimensions.depth)
  ) {
    return false; // TODO: 부피값이 주어지지 않았을 경우 어떻게 처리할지.
  }
  const copy = { ...dimensions };
  if (dimensions.unit !== LengthUnit.IN) {
    copy.unit = LengthUnit.IN;
    copy.width = convert(dimensions.width, dimensions.unit).to(LengthUnit.IN);
    copy.height = convert(dimensions.height, dimensions.unit).to(LengthUnit.IN);
    copy.depth = convert(dimensions.depth, dimensions.unit).to(LengthUnit.IN);
  }
  // oversize= 한변이 50인치 이상이거나, 세변의 합이 70인치 이상인 경우
  const sides = [copy.width, copy.height, copy.depth];
  const hasOversizedSide = sides.some((length) => length >= 50);
  const sumSides = sides.reduce((acc, side) => acc + side, 0);
  return hasOversizedSide || sumSides >= 70;
}

export function createPriceFactory(currencyCode: string) {
  return (amount: number) => {
    return { currencyCode, amount };
  };
}

export function createDeliveryFee(
  localCurrencyCode: string,
  local: number,
  international: number,
  domestic: number,
): DeliveryFee {
  const toPrice = createPriceFactory(localCurrencyCode);
  return {
    local: toPrice(local),
    international: toPrice(international),
    domestic: toPrice(domestic),
  };
}
