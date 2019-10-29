import { EcmaModel } from '../common-types/ecma-model.type';
import { HttpMethod } from './http-method.enum';

export interface HttpRequestOptions {
  method: HttpMethod;
  server: string;
  headers: {
    [header: string]: string
  } | null;
  payload: EcmaModel | EcmaModel[] | null;
  queryParams: {
    [param: string]: string
  };
}
