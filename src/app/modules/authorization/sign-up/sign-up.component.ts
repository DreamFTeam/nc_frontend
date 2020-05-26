import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../core/_services/authentication/authentication.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalMessageService } from '../../core/_services/utils/modal-message.service';
import { TranslateService } from '@ngx-translate/core';

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
        private translateService: TranslateService) {
    }

    username = '';
    email = '';
    password = '';
    confirmPassword = '';
    message: string;

    signUp() {
        if (this.username == '' || this.username == null) {
            this.message = this.translateService.instant('authorization.login.emptyName');
            return;
        }
        if (!this.email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)) {
            this.message = this.translateService.instant('authorization.signUp.incEmail');
            return;
        }
        if (this.password.length < 6) {
            this.message = this.translateService.instant('authorization.signUp.shortPassword');
            return;
        }
        if (!this.password.match(/([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+)/)) {
            this.message = this.translateService.instant('authorization.signUp.matchPasswordRegExp');
            return;
        }
        if (this.password != this.confirmPassword) {
            this.message = this.translateService.instant('authorization.signUp.matchPasswords');
            return;
        }
        this.authenticationService.signupUser(this.username, this.email, this.password)
            .subscribe(n => {
                if (n) {
                    this.isSent = true;
                    this.activeModal.close();
                    this.modalMessageService.show(this.translateService.instant('authorization.signUp.mailTitle'),
                        this.translateService.instant('authorization.signUp.mailBody'));
                }
            },
                error => {
                    this.message = error.error ? error.error.message : this.translateService.instant('authorization.login.error');
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
