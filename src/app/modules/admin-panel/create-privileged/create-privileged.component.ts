import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PrivilegedService} from '../../core/_services/admin/privileged.service';
import {Role} from '../../core/_models/role';
import {ToastsService} from '../../core/_services/utils/toasts.service';
import {TranslateService} from '@ngx-translate/core';
import {first} from 'rxjs/operators';

@Component({
    selector: 'app-create-privileged',
    templateUrl: './create-privileged.component.html',
    styleUrls: ['./create-privileged.component.css']
})
export class CreatePrivilegedComponent implements OnInit {
    @Input() public userrole;
    Role = Role;
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    message: string;

    constructor(public activeModal: NgbActiveModal,
                public privilegedService: PrivilegedService,
                private toastsService: ToastsService,
                private translateService: TranslateService) {
    }

    ngOnInit(): void {
    }

    create() {
        if (!this.username) {
            this.message = this.translateService.instant('authorization.login.emptyName');
            return;
        }
        if (!this.email || !this.email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)) {
            this.message = this.translateService.instant('authorization.signUp.incEmail');
            return;
        }
        if (!this.password || this.password.length < 6) {
            this.message = this.translateService.instant('authorization.signUp.shortPassword');
            return;
        }
        if (!this.password.match(/([a-zA-Z]+[0-9]+)|([0-9]+[a-zA-Z]+)/)) {
            this.message = this.translateService.instant('authorization.signUp.matchPasswordRegExp');
            return;
        }
        if (this.password !== this.confirmPassword) {
            this.message = this.translateService.instant('authorization.signUp.matchPasswords');
            return;
        }
        /*Code for comunication with back-end*/
        this.privilegedService.create(this.username, this.email, this.password, this.userrole).pipe(first())
            .subscribe(result => {
                    this.activeModal.dismiss('Cross click');
                    this.toastsService.toastAddSuccess('Notify the ' + this.userrole.substr(5).toLowerCase());
                },
                error => {
                    console.log(error);
                    this.activeModal.dismiss('Cross click');
                    this.toastsService.toastAddDanger(error.error ?
                        error.error.message : this.translateService.instant('authorization.login.error'));
                });
    }

}
