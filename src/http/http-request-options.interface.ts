export interface HttpRequestOptions {
  method: string;
  server: string;
  headers: {
    [header: string]: string
  } | null;
  payload?: Object | Object[] | null;
  queryParams?: {
    [param: string]: string
  };
}
