import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService} from '../../core/_services/authentication/authentication.service';
import {ToastsService} from '../../core/_services/utils/toasts.service';
import {TranslateService} from '@ngx-translate/core';

// import {switchMap} from 'rxjs/operators';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

    isSent: boolean;
    password: string;
    confirmPassword: string;
    id: string;
    answer: string;
    loading: boolean;

    constructor(private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private toastsService: ToastsService,
                private translateService: TranslateService) {
    }

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        console.log(this.id);
        this.isSent = false;
        this.loading = false;
    }

    changePassword() {
        if (!this.password.length || this.password.length < 6) {
            this.toastsService.removeAll();
            this.toastsService.toastAddWarning(this.translateService.instant('authorization.signUp.shortPassword'));
            return;
        }
        if (!this.password.match(/([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+)/)) {
            this.toastsService.removeAll();
            this.toastsService.toastAddWarning(this.translateService.instant('authorization.signUp.matchPasswordRegExp'));
            return;
        }
        if (this.password !== this.confirmPassword) {
            this.toastsService.removeAll();
            this.toastsService.toastAddWarning(this.translateService.instant('authorization.signUp.matchPasswords'));
            return;
        }

        const subscription = this.authenticationService.changePassword(this.id, this.password).subscribe((n) => {
                this.toastsService.toastAddSuccess(this.translateService.instant('authorization.changePassword.success'));
                subscription.unsubscribe();
                setInterval(function() {
                    location.replace('');
                    clearInterval(this);
                }, 3000);
                console.log(n);
            },
            err => {
                subscription.unsubscribe();
                this.toastsService.toastAddDanger(this.translateService.instant('authorization.login.error'));
                if (err.error) {
                    this.toastsService.toastAddDanger(err.error.message);
                }
                setInterval(function() {
                    location.replace('');
                    clearInterval(this);
                }, 3000);
            });
        this.loading = true;
    }
}
