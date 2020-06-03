import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../core/_services/authentication/authentication.service';
import {TranslateService} from '@ngx-translate/core';
import {ToastsService} from '../../core/_services/utils/toasts.service';

@Component({
    selector: 'app-user-change-password',
    templateUrl: './user-change-password.component.html',
    styleUrls: ['./user-change-password.component.css']
})
export class UserChangePasswordComponent implements OnInit {
    isSent: boolean;
    currentPassword: string;
    password: string;
    confirmPassword: string;
    answer: string;
    loading: boolean;

    constructor(private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private translate: TranslateService,
                private toastsService: ToastsService) {
    }

    ngOnInit(): void {
        this.isSent = false;
        this.loading = false;
    }

    changePassword() {
        if (this.password.length < 6) {
            this.toastsService.removeAll();
            this.toastsService.toastAddWarning(this.translate.instant('authorization.signUp.shortPassword'));
            return;
        }
        if (!this.password.match(/([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+)/)) {
            this.toastsService.removeAll();
            this.toastsService.toastAddWarning(this.translate.instant('authorization.signUp.matchPasswordRegExp'));
            return;
        }
        if (this.password !== this.confirmPassword) {
            this.toastsService.removeAll();
            this.toastsService.toastAddWarning(this.translate.instant('authorization.signUp.matchPasswords'));
            return;
        }

        this.authenticationService.changeUserPassword(this.currentPassword, this.password).subscribe((n) => {
                this.answer = this.translate.instant('authorization.changePassword.success');
                this.isSent = true;
                this.loading = false;
                setInterval(function() {
                    this.isSent = false;
                    clearInterval(this);
                }, 5000);
                console.log(n);
            },
            err => {
                this.loading = false;
                console.error(err.error.message);
                this.answer = 'An error occurred';
                this.isSent = true;
            });
        this.loading = true;
    }
}
