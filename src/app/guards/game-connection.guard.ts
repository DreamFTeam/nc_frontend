import {Component, Injectable, OnInit} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../_services/authentication.service';
import {Role} from '../_models/role';
import {GameSettingsService} from '../_services/game-settings.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MessageModalComponent} from '../message-modal/message-modal.component';
import {ModalMessageService} from '../_services/modal-message.service';


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
        },
        error => {alert(JSON.stringify(error)); }
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
