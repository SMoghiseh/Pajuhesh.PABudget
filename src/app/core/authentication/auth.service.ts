import { Injectable } from '@angular/core';

import { Account } from '@shared/models/response.model';

import { HttpService } from '../http/http.service';
import { map, catchError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../services/app-config.service';
import { HandleError } from '../http/http-error-handler/http-error-handler.type';
import { HttpErrorHandlerService } from '../http/http-error-handler/http-error-handler.service';
import { BaseResponse } from '@shared/models/response.model';

@Injectable()
export class AuthService {
  /** Store the URL so we can redirect after logging in */
  public redirectUrl: string | null = null;
  private handleError: HandleError;
  constructor(
    private httpService: HttpService,
    private messageService: MessageService,
    private http: HttpClient,
    private config: AppConfigService,
    public httpErrorHandler: HttpErrorHandlerService
  ) {
    this.handleError = httpErrorHandler.createHandleError('HttpService');
  }

  /** Return token if exists */
  public getAuthorizationToken(): string {
    const sessionStorageToken = localStorage.getItem('TOKEN');
    const localStorageToken = localStorage.getItem('TOKEN');

    return sessionStorageToken || localStorageToken || '';
  }

  /** Return token and menu if exists */
  public getAccess(): string {
    const sessionStorageToken = localStorage.getItem('TOKEN');
    const localStorageToken = localStorage.getItem('TOKEN');

    const sessionStorageMenu = localStorage.getItem('MENU');
    const localStorageMenu = localStorage.getItem('MENU');

    return (
      (sessionStorageToken && sessionStorageMenu) ||
      (localStorageToken && localStorageMenu) ||
      ''
    );
  }

  /** Try to log in */
  public logIn(form: FormData) {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/x-www-form-urlencoded',
    // });
    return this.http
      .post<any>(
        this.config.getAddress('baseUrl') + Account.apiAddress + '/login',
        form,
        {
          // headers: headers,
          withCredentials: true,
        }
      )
      .subscribe(res => {
        return res;
      });
    // .pipe(
    //   catchError(this.handleError('get', new BaseResponse<any>())),
    //   map(response => {
    //     if (response.successed && response.data && response.data.result)
    //       localStorage.setItem(
    //         'loginData',
    //         JSON.stringify(response.data.result)
    //       );
    //     if (response.successed && response.data && response.data.token)
    //       return response.data.token;
    //     else {
    //       this.messageService.add({
    //         key: 'httpErrorMessage',
    //         life: 8000,
    //         severity: 'warn',
    //         detail: 'هشدار',
    //         summary: response.message,
    //       });

    //       return '';
    //     }
    //   })
    // );
  }

  /** Try to log out */
  public logOut(): void {
    localStorage.clear();
    localStorage.clear();
  }
}
