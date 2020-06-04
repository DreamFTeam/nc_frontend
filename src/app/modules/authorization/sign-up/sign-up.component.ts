import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/_services/authentication/authentication.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMessageService } from '../../core/_services/utils/modal-message.service';
import { TranslateService } from '@ngx-translate/core';
import {first} from 'rxjs/operators';
import {LocaleService} from '../../core/_services/utils/locale.service';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.css']
})

export class SignUpComponent implements OnInit {

    isSent: boolean;
    loading: boolean;

    constructor(private authenticationService: AuthenticationService,
        public activeModal: NgbActiveModal,
        private modalMessageService: ModalMessageService,
        private localeService: LocaleService) {
    }

    username = '';
    email = '';
    password = '';
    confirmPassword = '';
    message: string;

    signUp() {
        if (!this.username) {
            this.message = this.localeService.getValue('authorization.login.emptyName');
            return;
        }
        if (!this.email || !this.email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)) {
            this.message = this.localeService.getValue('authorization.signUp.incEmail');
            return;
        }
        if (!this.password || this.password.length < 6) {
            this.message = this.localeService.getValue('authorization.signUp.shortPassword');
            return;
        }
        if (!this.password.match(/([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+)/)) {
            this.message = this.localeService.getValue('authorization.signUp.matchPasswordRegExp');
            return;
        }
        if (this.password !== this.confirmPassword) {
            this.message = this.localeService.getValue('authorization.signUp.matchPasswords');
            return;
        }
        this.authenticationService.signupUser(this.username, this.email, this.password).pipe(first())
            .subscribe(n => {
                if (n) {
                    this.isSent = true;
                    this.activeModal.close();
                    this.modalMessageService.show(this.localeService.getValue('authorization.signUp.mailTitle'),
                        this.localeService.getValue('authorization.signUp.mailBody'));
                }
            },
                error => {
                    this.message = error.error ? error.error.message : this.localeService.getValue('authorization.login.error');
                    console.log(error);
                    this.loading = false;
                }
            );
        this.loading = true;
    }

    ngOnInit(): void {
        this.isSent = false;
        this.loading = false;
    }


}
