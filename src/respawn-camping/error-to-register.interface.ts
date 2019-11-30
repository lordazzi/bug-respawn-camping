import { ErrorNormalized } from './../error-handler/error-normalized.model';

export interface ErrorToRegister {
  originName: string;
  aditionalInformation: string;
  error: ErrorNormalized;
}
