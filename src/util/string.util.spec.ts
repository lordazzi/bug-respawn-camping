import { StringUtil } from './string.util';

describe('StringUtil', () => {
  const stringUtil = new StringUtil();

  it('Checking labelfy method with simple data', () => {
    expect(stringUtil.labelfy('Script error.')).toBe('script-error');
  });

  it('Checking labelfy method with complex data', () => {
    expect(stringUtil.labelfy(
      `Checking ácênt, punctuation
      and "other characteres like &"
      and a very extense text
      `)).toBe('checking-acent-punctuation-and-other-characte');
  });
});
