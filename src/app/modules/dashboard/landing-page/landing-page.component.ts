import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastsService} from '../../core/_services/utils/toasts.service';
import {AuthenticationService} from '../../core/_services/authentication/authentication.service';
import {Role} from '../../core/_models/role';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
    isSignedIn: boolean;
    isRoleUser: boolean;

    constructor(private activatedRoute: ActivatedRoute,
                private toastsService: ToastsService,
                private authenticationService: AuthenticationService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.message) {
                this.toastsService.toastAddWarning(params.message);
                this.router.navigateByUrl('');
            }
        });
        this.isSignedIn = (this.authenticationService.currentUserValue === undefined) ? false : true;
        this.isRoleUser = (this.isSignedIn &&
            this.authenticationService.currentUserValue.role === Role.User);
    }


}
