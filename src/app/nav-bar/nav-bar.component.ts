import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogInComponent } from '../log-in/log-in.component';
import { SignUpComponent } from '../sign-up/sign-up.component';
import { AuthenticationService } from '../_services/authentication.service';
import { Role } from '../_models/role';
import { SseService } from '../_services/sse.service';
import { NotificationsService } from '../_services/notifications.service';
import { SearchFilterQuizService } from '../_services/search-filter-quiz.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  private readonly NEW_FILTER_SETTINGS = true;
  public isMenuCollapsed = true;
  public signedIn: boolean;
  public privileged;
  notification: boolean;
  searchArea: string;

  constructor(private modalService: NgbModal,
    private authenticationService: AuthenticationService,
    private searchFilterQuizService: SearchFilterQuizService,
    private notificationsService: NotificationsService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.signedIn = (this.authenticationService.currentUserValue === undefined) ? false : true;
    this.privileged = (this.signedIn &&
      this.authenticationService.currentUserValue.role !== Role.User);
    if (this.signedIn) {
      this.subscribeNotifications();
    }
  }

  search() {
    this.searchFilterQuizService.search(this.searchArea, this.NEW_FILTER_SETTINGS);
    this.router.navigateByUrl('/quiz-list');
  }


  openLogin() {
    this.isMenuCollapsed = true;
    const modalRef = this.modalService.open(LogInComponent);
    modalRef.result.then((result) => {
      if (result) {
        console.log(result);
      }
    });
  }

  openReg() {
    this.isMenuCollapsed = true;
    const modalRef = this.modalService.open(SignUpComponent, { size: 'lg' });

  }

  logout() {
    this.isMenuCollapsed = true;
    this.authenticationService.signoutUser();
    this.router.navigate(['/']);
    window.location.reload();
  }

  subscribeNotifications() {
    this.notificationsService.notifications
      .subscribe(n => this.notification = n && n.length > 0);
  }
}
