import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthenticationService} from '../../core/_services/authentication/authentication.service';
import {TranslateService} from '@ngx-translate/core';
import {first} from 'rxjs/operators';
import {ToastsService} from '../../core/_services/utils/toasts.service';
import {LocaleService} from '../../core/_services/utils/locale.service';

@Component({
    selector: 'app-recover-password',
    templateUrl: './recover-password.component.html',
    styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {

    isSent: boolean;
    email: string;
    loading: boolean;
    message: string;

    constructor(
        private authenticationService: AuthenticationService,
        public activeModal: NgbActiveModal,
        private localeService: LocaleService,
        private toastsService: ToastsService) {
    }

    ngOnInit(): void {
        this.isSent = false;
        this.loading = false;
    }

    requestPasswordChange() {
        if (this.email == '' || this.email == null) {
            this.message = this.localeService.getValue('authorization.recoverPassword.empty');
            return;
        }
        if (!this.email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)) {
            this.message = this.localeService.getValue('authorization.recoverPassword.incorrect');
            return;
        }
        this.authenticationService.recoverPassword(this.email).pipe(first())
            .subscribe(n => {
                    this.isSent = true;
                    this.loading = false;
                    this.activeModal.close();
                    this.toastsService.toastAddSuccess(this.localeService.getValue('authorization.signUp.mailBody'));
                },
                error => {
                    this.message = error.error ? error.error.message : this.localeService.getValue('authorization.login.error');
                    this.loading = false;
                });
        this.loading = true;
    }


}
