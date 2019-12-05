import { CommonErrorNormalizer } from './common-error.normalizer';

describe('[CommonErrorNormalizer]', () => {
  const commonErrorNormalizer = new CommonErrorNormalizer();

  it('verificação de tipo', () => {
    const is = commonErrorNormalizer.typeCheck(new ErrorEvent(''));
    expect(is).toBe(true);
  });

  it('conversão de defeito em estrutura de issue', () => {
    const normalized = commonErrorNormalizer.normalize(<ErrorEvent><any>{
      error: new Error('Script error.')
    });

    expect(typeof normalized.id).toBe('string');
    expect(typeof normalized.title).toBe('string');
  });
});
