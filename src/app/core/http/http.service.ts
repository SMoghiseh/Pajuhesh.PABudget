 

import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { catchError, map, Observable } from 'rxjs';

import { BaseResponse } from '@shared/models/response.model';

import { AppConfigService } from '../services/app-config.service';
import { HttpErrorHandlerService } from './http-error-handler/http-error-handler.service';
import { HandleError } from './http-error-handler/http-error-handler.type';
import { RETRY_COUNT } from '../interceptors/retry.interceptor';
import { MessageService } from 'primeng/api';

@Injectable()
export class HttpService {
  private httpOptions: { headers: HttpHeaders };
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    private config: AppConfigService,
    public httpErrorHandler: HttpErrorHandlerService,
    private messageService: MessageService
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };

    this.handleError = httpErrorHandler.createHandleError('HttpService');
  }

  //////// Global Methods //////////

  /** POST: fetch data with empty body */
  public getByPost<T>(
    url: string,
    retryCount = 1,
    params?: unknown
  ): Observable<BaseResponse<T>> {
    return this.http
      .post<BaseResponse<T>>(this.config.getAddress('baseUrl') + url, params, {
        context: new HttpContext().set(RETRY_COUNT, retryCount),
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        catchError(this.handleError('post', new BaseResponse<T>())),
        map(response => {
          return response;
          // if (response.successed) return response;
          // else {
          //   this.messageService.add({
          //     key: 'httpErrorMessage',
          //     life: 8000,
          //     severity: 'warn',
          //     detail: 'هشدار',
          //     summary: response.message,
          //   });

          //   return new BaseResponse<T>();
          // }
        })
      );
  }

  /**
   * GET: Fetch Data
   * @param type Api response type
   * @param url Api Address
   * @param serachParams URL Search Params
   * @param retryCount Retry Http Request Count
   * @returns Observable of response type
   */
  get<T>(
    url: string,
    serachParams?: unknown,
    retryCount?: number
  ): Observable<BaseResponse<T>> {
    const queryString = serachParams
      ? '?' + new URLSearchParams(serachParams as URLSearchParams).toString()
      : '';

    return this.http
      .get<BaseResponse<T>>(
        `${this.config.getAddress('baseUrl')}${url}${queryString}`,
        {
          withCredentials: true,
          context: new HttpContext().set(RETRY_COUNT, retryCount || 1),
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .pipe(
        catchError(this.handleError('get', new BaseResponse<T>())),
        map(response => {
          return response;
          // if (response.successed) return response;
          // else {
          //   this.messageService.add({
          //     key: 'httpErrorMessage',
          //     life: 8000,
          //     severity: 'warn',
          //     detail: 'هشدار',
          //     summary: response.message,
          //   });

          //   return new BaseResponse<T>();
          // }
        })
      );
  }

  /**
   * POST: pass params and fetch data
   * @param type Api response type
   * @param url Api address
   * @param params Api paramiters
   * @param retryCount Api retry count
   * @returns Observable of response type
   */
  post<T>(
    url: string,
    params: unknown,
    retryCount = 1
  ): Observable<BaseResponse<T>> {
    return this.http
      .post<BaseResponse<T>>(this.config.getAddress('baseUrl') + url, params, {
        context: new HttpContext().set(RETRY_COUNT, retryCount),
      })
      .pipe(
        catchError(this.handleError('post', new BaseResponse<T>())),
        map(response => {
          return response;
          // if (response.successed) return response;
          // else {
          //   this.messageService.add({
          //     key: 'httpErrorMessage',
          //     life: 8000,
          //     severity: 'warn',
          //     detail: 'هشدار',
          //     summary: response.message,
          //   });

          //   return new BaseResponse<T>();
          // }
        })
      );
  }

  /**
   * PUT: pass params and fetch data
   * @param type Api response type
   * @param url Api address
   * @param params Api paramiters
   * @param retryCount Api retry count
   * @returns Observable of response type
   */
  put<T>(
    url: string,
    params: unknown,
    retryCount = 1
  ): Observable<BaseResponse<T>> {
    return this.http
      .put<BaseResponse<T>>(this.config.getAddress('baseUrl') + url, params, {
        context: new HttpContext().set(RETRY_COUNT, retryCount),
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        catchError(this.handleError('put', new BaseResponse<T>())),
        map(response => {
          return response;
          // if (response.successed) return response;
          // else {
          //   this.messageService.add({
          //     key: 'httpErrorMessage',
          //     life: 8000,
          //     severity: 'warn',
          //     detail: 'هشدار',
          //     summary: response.message,
          //   });

          //   return new BaseResponse<T>();
          // }
        })
      );
  }
  /**
   * DELETE: pass params and fetch data
   * @param type Api response type
   * @param url Api address
   * @param params Api paramiters
   * @param retryCount Api retry count
   * @returns Observable of response type
   */
  delete<T>(url: string, retryCount = 1): Observable<BaseResponse<T>> {
    return this.http
      .delete<BaseResponse<T>>(this.config.getAddress('baseUrl') + url, {
        context: new HttpContext().set(RETRY_COUNT, retryCount),
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        catchError(this.handleError('delete', new BaseResponse<T>())),
        map(response => {
          return response;
          // if (response.successed) return response;
          // else {
          //   this.messageService.add({
          //     key: 'httpErrorMessage',
          //     life: 8000,
          //     severity: 'warn',
          //     detail: 'هشدار',
          //     summary: response.message,
          //   });

          //   return new BaseResponse<T>();
          // }
        })
      );
  }

  /**
   * GET: Fetch File
   * @param type Api response type
   * @param url Api Address
   * @param serachParams URL Search Params
   * @param retryCount Retry Http Request Count
   * @returns Observable of response type
   */
  getFile(url: string, retryCount?: number): Observable<Blob> {
    return this.http.get<Blob>(`${this.config.getAddress('baseUrl')}${url}`, {
      context: new HttpContext().set(RETRY_COUNT, retryCount || 1),
      responseType: 'blob' as 'json',
    });
  }
}
