import {Component, Input, OnInit, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ToastsService} from '../_services/toasts.service';
import { AuthenticationService } from '../_services/authentication.service';
import { Role } from '../_models/role';

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
              private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.message) {
        this.toastsService.toastAddWarning(params.message);
      }
    });
    this.isSignedIn = (this.authenticationService.currentUserValue === undefined) ? false : true;
    this.isRoleUser = (this.isSignedIn &&
      this.authenticationService.currentUserValue.role === Role.User);
  }


}
