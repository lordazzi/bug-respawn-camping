import { ObjectUtil } from '../util/object.util';
import { EcmaModel } from './../common-types/ecma-model.type';
import { HttpRequestOptions } from './http-request-options.interface';

export class HttpService {

  private static instance: HttpService | null = null;

  private objectUtil = new ObjectUtil();
  static XMLHttpRequest = XMLHttpRequest;

  private defaultHeaders = {
    'Content-Type': 'application/json'
  };

  constructor() {
    if (!HttpService.instance) {
      HttpService.instance = this;
    }

    return HttpService.instance;
  }

  request(options: HttpRequestOptions): Promise<any> {
    const xhr = new HttpService.XMLHttpRequest();
    xhr.open(<string><any>options.method, options.server);
    this.setRequestHeaders(xhr, options.headers || {});

    const promise = this.listenRequest(xhr);

    if (options.payload) {
      xhr.send(JSON.stringify(options.payload));
    } else {
      xhr.send();
    }

    return promise;
  }

  private listenRequest(xhr: XMLHttpRequest): Promise<EcmaModel> {
    const statusCodeSimplification = 100;
    const statusCodeSuccessLevel = 2;
    const httpReadyStateDone = 4;
    const httpNoContentStatus = 204;

    return new Promise<EcmaModel | null>((resolve, reject) => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === httpReadyStateDone) {
          if (Math.floor(xhr.status / statusCodeSimplification) === statusCodeSuccessLevel) {
            try {
              const responseData = xhr.status === httpNoContentStatus ? null : JSON.parse(xhr.responseText);
              resolve(responseData);
            } catch (e) {
              reject(e);
            }
          } else {
            reject(xhr);
          }
        }
      };
    });
  }

  private setRequestHeaders(xhr: XMLHttpRequest, headers: { [header: string]: string }): void {
    const newHeaders = this.objectUtil.assign(this.defaultHeaders, headers);
    Object.keys(newHeaders).forEach(key => {
      xhr.setRequestHeader(key, String(newHeaders[key]));
    });
  }


}
