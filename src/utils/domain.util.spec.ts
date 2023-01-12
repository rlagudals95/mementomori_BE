import { getDomain } from './domain.util';

describe('domain.util', () => {
  it('test getDomain', () => {
    expect(getDomain('https://www.amazon.com')).toBe('www.amazon.com');
    expect(getDomain('https://www.amazon.com/dp/JDKAKS812D0')).toBe(
      'www.amazon.com',
    );
    expect(getDomain('www.amazon.com')).toBe('www.amazon.com');
  });
});
