import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../_services/authentication/authentication.service';
import {Role} from '../_models/role';
import {ModalMessageService} from '../_services/utils/modal-message.service';
import {LocaleService} from '../_services/utils/locale.service';


@Injectable({
    providedIn: 'root'
})
export class GameConnectionGuard implements CanActivate {

    constructor(
        private authenticationService: AuthenticationService,
        private modal: ModalMessageService,
        private localeService: LocaleService
    ) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const currentUser = this.authenticationService.currentUserValue;

        if (currentUser && currentUser.role !== Role.User) {
            this.modal.show(this.localeService.getValue('game.accessDen'), this.localeService.getValue('game.accountError'));
        }
        return true;

    }

}
