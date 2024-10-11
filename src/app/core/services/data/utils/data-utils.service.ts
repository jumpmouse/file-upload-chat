import { Injectable } from '@angular/core';
import { environment } from '@environment';
import { EndpointList, HttpMethod } from './endpoints';
import { TokenService } from '../../token.service';
import { HttpHeaders } from '@angular/common/http';

type Observe = 'events' | undefined;
interface HttpOptions { headers: HttpHeaders, params?: HttpQueryParams };
interface HttpQueryParams { [key: string]: any };

@Injectable({
  providedIn: 'root',
})
export class DataUtilsService {
  constructor(private tokenService: TokenService) {}

  public getHttpOptions(params?: HttpQueryParams | null, headers: {[key: string]: string} = {}, customOptions: {[key: string]: string} = {}):  HttpOptions {
    let options: HttpOptions = {
      headers: new HttpHeaders({
        Authorization: this.tokenService.getToken(),
        ...headers
      }),
      ...customOptions
    };
    if (params) options['params'] = params;
    return options;
  };

  public getEndpointUrl(httpMethod: HttpMethod, endpointName: string, ...args: Array<string | number> ) {
    const endpoint = `${EndpointList[httpMethod][endpointName](...args as string[])}`;
    return `${environment.apiUrl}/${environment.apiPrefix}/${endpoint}`;
  };
}
