import { toBoolean } from './cast.util';

describe('cast.util', () => {
  it('test toBoolean', () => {
    expect(toBoolean(undefined)).toBeFalsy();
    expect(toBoolean(null)).toBeFalsy();
    expect(toBoolean('')).toBeFalsy();
    expect(toBoolean('0')).toBeFalsy();
    expect(toBoolean('false')).toBeFalsy();
    expect(toBoolean('False')).toBeFalsy();

    expect(toBoolean('1')).toBeTruthy();
    expect(toBoolean('true')).toBeTruthy();
    expect(toBoolean('True')).toBeTruthy();
    expect(toBoolean('tRue')).toBeTruthy();
    expect(toBoolean('TRUE')).toBeTruthy();
  });
});
