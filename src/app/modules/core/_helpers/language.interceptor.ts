import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../_services/authentication/authentication.service';
import { LocaleService } from '../_services/utils/locale.service';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService,
    private localeService: LocaleService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    request = request.clone({
      setHeaders: {
        Lang: this.localeService.getLanguage()
      }
    });

    return next.handle(request);
  }
}
