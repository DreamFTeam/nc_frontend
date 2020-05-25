import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthenticationService} from '../_services/authentication/authentication.service';
import {Role} from '../_models/role';
import {GameSettingsService} from '../_services/game/game-settings.service';
import {ModalMessageService} from '../_services/utils/modal-message.service';
import {AnonymService} from '../_services/game/anonym.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AnonymInitComponent} from '../../game/anonym-init/anonym-init.component';


@Injectable({
    providedIn: 'root'
})
export class GameConnectionGuard implements CanActivate {

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private gameSettingsService: GameSettingsService,
        private modal: ModalMessageService,
        private modalService: NgbModal,
        private anonymService: AnonymService
    ) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        const currentUser = this.authenticationService.currentUserValue;
        const currentAnonym = this.anonymService.currentAnonymValue;
        const accessId = next.paramMap.get('accessId');

        if (currentUser && currentUser.role !== Role.User) {
            this.modal.show('Access denied', 'You cannot play on this account.');
        }

        if (currentUser && currentUser.role === Role.User || currentAnonym) {
            this.gameJoining(accessId);
        }

        if (!currentUser && !currentAnonym) {
            const modalRef = this.modalService.open(AnonymInitComponent);
            modalRef.componentInstance.anonymName.subscribe(n => {
                    this.anonymService.anonymLogin(n).subscribe(() => {
                        this.gameJoining(accessId);
                    });
                }
            );
        }
        return true;

    }

    private gameJoining(accessId: string) {
        this.gameSettingsService.join(accessId).subscribe(
            n => {
                console.log('Joining');
                localStorage.setItem('sessionid', n.id);
                this.router.navigateByUrl(`game/${n.gameId}/lobby`);
            },
            error => {
                this.modal.show('An error occurred', 'An error occurred.');
                this.router.navigateByUrl('/');
                console.error(error);
            }
        );
    }

}
