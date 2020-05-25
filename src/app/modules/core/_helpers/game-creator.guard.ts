import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../_services/authentication/authentication.service';
import {ModalMessageService} from '../_services/utils/modal-message.service';
import {Role} from '../_models/role';

@Injectable({
    providedIn: 'root'
})
export class GameCreatorGuard implements CanActivate {
    constructor(private router: Router,
                private authenticationService: AuthenticationService,
                private modal: ModalMessageService) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.role !== Role.User) {
            this.modal.show('Access denied', 'You cannot create game on this account.');
            this.router.navigateByUrl('');
            return false;
        }

        return true;
    }

}
