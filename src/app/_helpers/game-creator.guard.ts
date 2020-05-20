import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../_services/authentication.service';
import {GameSettingsService} from '../_services/game-settings.service';
import {ModalMessageService} from '../_services/modal-message.service';
import {Role} from '../_models/role';
import {AnonymService} from '../_services/anonym.service';

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
    if (currentUser && currentUser.role === Role.User) {
      return true;
    }

    // if (currentUser && currentUser.role !== Role.User) {
    this.modal.show('Access denied', 'You cannot create game on this account.');
    this.router.navigateByUrl('');
    return false;
    // }
    //
    // return true;
  }

}