import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { tap } from 'rxjs';

import {
  RequestCache,
  RequestCacheWithMap,
} from './services/request-cache.service';

import { httpInterceptorProviders } from './interceptors';

import { AppConfigService } from './services/app-config.service';
import { AuthService } from './authentication/auth.service';
import { HttpErrorHandlerService } from './http/http-error-handler/http-error-handler.service';
import { LogService } from './services/log.service';
import { HttpService } from './http/http.service';
import { StoredRoutesService } from './services/route-reuse-strategy/stored-routes.service';
import { RouteReuseService } from './services/route-reuse-strategy/route-reuse.service';
import { ThemeService } from './services/theme.service';
import { SidemenuService } from './layout/sidemenu/sidemenu.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


/* PrimeNG */
import { MessageService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
@NgModule({
  declarations: [
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgOptimizedImage
  ],
  providers: [
    AppConfigService,
    HttpService,
    HttpErrorHandlerService,
    LogService,
    AuthService,
    MessageService,
    StoredRoutesService,
    ThemeService,
    SidemenuService,
    { provide: RouteReuseStrategy, useClass: RouteReuseService },
    { provide: RequestCache, useClass: RequestCacheWithMap },
    httpInterceptorProviders,
    {
      provide: APP_INITIALIZER,
      deps: [AppConfigService],
      multi: true,
      useFactory: (appConfigService: AppConfigService) => {
        return () =>
          appConfigService
            .loadAppConfig()
            .pipe(tap(config => appConfigService.setAppConfig(config)));
      },
    },
  ],
  exports:[
    SpinnerComponent
  ]
})
export class CoreModule { }
