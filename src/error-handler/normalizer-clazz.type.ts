import { CustomErrorNormalizer } from './custom-error-nomalizar.interface';

export type NormalizerCLazz = new () => CustomErrorNormalizer<unknown>;

