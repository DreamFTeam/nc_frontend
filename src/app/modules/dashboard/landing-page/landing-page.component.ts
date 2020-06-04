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
    }

    isSignedIn(){
        return this.authenticationService.currentUserValue;
    }

    isRoleUser(){
        return (this.isSignedIn() &&
            this.authenticationService.currentUserValue.role === Role.User);
    }


}
