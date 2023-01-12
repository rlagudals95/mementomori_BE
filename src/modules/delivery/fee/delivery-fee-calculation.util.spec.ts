import { LengthUnit } from '@modules/common/models/product.constant';
import { floor5, isOversized, round5 } from './delivery-fee-calculation.util';

describe('DeliveryService', () => {
  it('test floor5', () => {
    expect(floor5(1)).toBe(0);
    expect(floor5(20)).toBe(20);
    expect(floor5(21)).toBe(20);
    expect(floor5(22)).toBe(20);
    expect(floor5(23)).toBe(20);
    expect(floor5(24)).toBe(20);
    expect(floor5(25)).toBe(25);
    expect(floor5(29)).toBe(25);
    expect(floor5(34)).toBe(30);
    expect(floor5(35)).toBe(35);
    expect(floor5(39.9)).toBe(35);
    expect(floor5(40)).toBe(40);
  });

  it('test round5', () => {
    expect(round5(1)).toBe(5);
    expect(round5(20)).toBe(20);
    expect(round5(21)).toBe(25);
    expect(round5(22)).toBe(25);
    expect(round5(23)).toBe(25);
    expect(round5(24)).toBe(25);
    expect(round5(25)).toBe(25);
    expect(round5(29)).toBe(30);
    expect(round5(34)).toBe(35);
    expect(round5(35)).toBe(35);
    expect(round5(39.9)).toBe(40);
    expect(round5(40)).toBe(40);
  });

  it('test isOversized with undefined unit', () => {
    const dimensions = { unit: undefined, width: 1, height: 1, depth: 1 };
    expect(isOversized(dimensions)).toBeFalsy();
  });

  it('test isOversized with undefined all dimensions', () => {
    const dimensions = {
      unit: LengthUnit.IN,
      width: undefined,
      height: undefined,
      depth: undefined,
    };
    expect(isOversized(dimensions)).toBeFalsy();
  });

  it('test isOversized with small sides in inch', () => {
    const dimensions = { unit: LengthUnit.IN, width: 1, height: 1, depth: 1 };
    expect(isOversized(dimensions)).toBeFalsy();
  });

  it('test isOversized with one long side in inch', () => {
    const dimensions = { unit: LengthUnit.IN, width: 51, height: 1, depth: 1 };
    expect(isOversized(dimensions)).toBeTruthy();
  });

  it('test isOversized with big volume in inch', () => {
    const dimensions = {
      unit: LengthUnit.IN,
      width: 30,
      height: 30,
      depth: 30,
    };
    expect(isOversized(dimensions)).toBeTruthy();
  });

  it('test isOversized with one long side in inch', () => {
    const dimensions = {
      unit: LengthUnit.CM,
      width: 2.54 * 51,
      height: 1,
      depth: 1,
    };
    expect(isOversized(dimensions)).toBeTruthy();
  });
});
