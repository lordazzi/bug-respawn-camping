import { HttpMethod } from './http-method.enum';

export interface HttpRequestOptions {
  method: HttpMethod;
  server: string;
  headers: {
    [header: string]: string
  } | null;
  payload?: Object | Object[] | null;
  queryParams?: {
    [param: string]: string
  };
}
