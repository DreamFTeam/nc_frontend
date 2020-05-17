import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';

import {environment} from '../../environments/environment';
import {AuthenticationService} from '../_services/authentication.service';
import {AnonymService} from '../_services/anonym.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService,
              private anonymService: AnonymService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to api url
    const currentUser = this.authenticationService.currentUserValue;
    const currentAnonym = this.anonymService.currentAnonymValue;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if ((currentUser || currentAnonym) && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser ? localStorage.getItem('userData') : localStorage.getItem('anonymData')}`
        }
      });
    }

    return next.handle(request);
  }
}
