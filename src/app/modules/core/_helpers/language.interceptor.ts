import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocaleService } from '../_services/utils/locale.service';

@Injectable()
export class LanguageInterceptor implements HttpInterceptor {

  constructor(private localeService: LocaleService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url.startsWith(environment.apiUrl)) {
      request = request.clone({
        setHeaders: {
          Lang: this.localeService.getLanguage()
        }
      });
    }
    console.log("inter")
    return next.handle(request);
  }
}
