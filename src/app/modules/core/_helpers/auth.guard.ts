import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../_services/authentication/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authenticationService: AuthenticationService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const info = this.authenticationService.currentUserValue;

        if (info) {
            if (next.data.roles && next.data.roles.indexOf(info.role) === -1) {
                return this.unavailable();
            }
        } else {
            return this.unavailable();
        }
        return true;
    }

    unavailable(): boolean {
        this.router.navigate(['/']);
        return false;
    }

}
