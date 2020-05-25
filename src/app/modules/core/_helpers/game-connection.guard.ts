import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../_services/authentication/authentication.service';
import {Role} from '../_models/role';
import {GameSettingsService} from '../_services/game/game-settings.service';
import {ModalMessageService} from '../_services/utils/modal-message.service';


@Injectable({
  providedIn: 'root'
})
export class GameConnectionGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private gameSettingsService: GameSettingsService,
    private modal: ModalMessageService
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.authenticationService.currentUserValue;
    const accessId = next.paramMap.get('accessId');

    if (currentUser && currentUser.role === Role.User) {
      this.gameSettingsService.join(accessId).subscribe(
        n => {
          console.log('Joining');
          localStorage.setItem('sessionid', n.id);
          this.router.navigateByUrl(`game/${n.gameId}/lobby`);
          return false;
        },
        error => {
          this.modal.show('An error occurred', 'An error occurred.');
          this.router.navigateByUrl('/');
          console.error(error);
          return false;

        }
      );
      return false;
    }

    if (currentUser && currentUser.role !== Role.User) {
      this.modal.show('Access denied', 'You cannot play on this account.');
      this.router.navigateByUrl('');
      return false;
    }
    return true;
  }

}
