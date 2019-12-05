import { ErrorNormalized } from './error-normalized.model';

export interface CustomErrorNormalizer<ErrorType> {

  /**
   * This will help to identify the error origin in the issue.
   * Normalizers with the same name will override will overwrite the existing ones.
   */
  name: string;

  /**
   * Here we're go to check if the lauch thing can
   * be normalized by your normalizer
   *
   * @param throwable
   * every throwable thing in ecmascript
   */
  typeCheck(throwable: any): boolean;

  /**
   * Here you say to us how this thrown structure will
   * turn into something we can understand.
   *
   * If you can't generate an id or normalize it, there
   * is no problem, you can return null.
   *
   * @param error
   */
  normalize(error: ErrorType): ErrorNormalized | null;
}
