import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthenticationService} from '../../core/_services/authentication/authentication.service';
import {ToastsService} from '../../core/_services/utils/toasts.service';
import {TranslateService} from '@ngx-translate/core';
import {first} from 'rxjs/operators';
import {LocaleService} from '../../core/_services/utils/locale.service';

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
                private router: Router,
                private authenticationService: AuthenticationService,
                private toastsService: ToastsService,
                private localeService: LocaleService) {
    }

    ngOnInit(): void {
        this.route.queryParams.pipe(first()).subscribe(x => {
            this.id = x.key;
        });
        if (!this.id) {
            this.router.navigateByUrl('');
        }
        this.isSent = false;
        this.loading = false;
    }

    changePassword() {
        if (!this.password.length || this.password.length < 6) {
            this.toastsService.removeAll();
            this.toastsService.toastAddWarning(this.localeService.getValue('authorization.signUp.shortPassword'));
            return;
        }
        if (!this.password.match(/([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+)/)) {
            this.toastsService.removeAll();
            this.toastsService.toastAddWarning(this.localeService.getValue('authorization.signUp.matchPasswordRegExp'));
            return;
        }
        if (this.password !== this.confirmPassword) {
            this.toastsService.removeAll();
            this.toastsService.toastAddWarning(this.localeService.getValue('authorization.signUp.matchPasswords'));
            return;
        }

        this.authenticationService.changePassword(this.id, this.password).pipe(first())
            .subscribe((n) => {
                    this.toastsService.toastAddSuccess(this.localeService.getValue('authorization.changePassword.success'));
                    setInterval(function() {
                        location.replace('');
                        clearInterval(this);
                    }, 3000);
                },
                err => {
                    this.toastsService.toastAddDanger(this.localeService.getValue('authorization.login.error'));
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
