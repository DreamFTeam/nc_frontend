import {Component, OnInit} from '@angular/core';
import {RouterModule} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LogInComponent} from '../log-in/log-in.component';
import {SignUpComponent} from '../sign-up/sign-up.component';
import {User} from '../_models/user';
import {Quiz} from '../_models/quiz';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {SearchFilterQuizService} from '../_services/search-filter-quiz.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public isMenuCollapsed = true;
  public signedIn;
  public privileged;
  searchArea = '';

  constructor(private modalService: NgbModal,
              private searchFilterQuizService: SearchFilterQuizService) {
  }

  ngOnInit(): void {
    this.signedIn = (localStorage.getItem('userData') == null) ? false : true;
    this.privileged = (this.signedIn &&
      JSON.parse(localStorage.getItem('userData')).role !== 'ROLE_USER') ? true : false;
  }

  formatter = (userNewDial: Quiz) => userNewDial.title;
  search = (text: Observable<string>) =>
    text.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(term => term.length < 2 ? []
        : this.searchFilterQuizService.searchQuiz(term))
    )


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
}
