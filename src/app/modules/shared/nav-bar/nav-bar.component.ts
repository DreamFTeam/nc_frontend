import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LogInComponent} from '../../authorization/log-in/log-in.component';
import {SignUpComponent} from '../../authorization/sign-up/sign-up.component';
import {AuthenticationService} from '../../core/_services/authentication/authentication.service';
import {Role} from '../../core/_models/role';
import {NotificationsService} from '../../core/_services/user/notifications.service';
import {SearchFilterQuizService} from '../../core/_services/quiz/search-filter-quiz.service';
import {environment} from 'src/environments/environment';
import {LocaleService} from '../../core/_services/utils/locale.service';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
    readonly languages = [
        {name: 'English', value: `${environment.locales[0]}`},
        {name: 'Українська', value: `${environment.locales[1]}`}
    ];
    private readonly NEW_FILTER_SETTINGS = true;
    public isMenuCollapsed = true;
    public signedIn: boolean;
    public privileged;
    notification: boolean;
    searchArea: string;

    language: string;
    notificationsAmount: Observable<number>;

    constructor(private modalService: NgbModal,
                private authenticationService: AuthenticationService,
                private searchFilterQuizService: SearchFilterQuizService,
                private notificationsService: NotificationsService,
                private localeService: LocaleService,
                private router: Router) {
    }

    ngOnInit(): void {
        this.signedIn = (this.authenticationService.currentUserValue === undefined) ? false : true;
        this.privileged = (this.signedIn &&
            this.authenticationService.currentUserValue.role !== Role.User);
        if (this.signedIn) {
            this.notification = true;
            this.subscribeNotifications();
        }
        this.language = this.localeService.getAnonymousLanguage();
    }

    search() {
        this.searchFilterQuizService.search(this.searchArea, this.NEW_FILTER_SETTINGS);
        this.searchArea = '';
        this.router.navigateByUrl('/quiz-list');
    }


    openLogin() {
        this.isMenuCollapsed = true;
        const modalRef = this.modalService.open(LogInComponent);
    }

    openReg() {
        this.isMenuCollapsed = true;
        const modalRef = this.modalService.open(SignUpComponent, {size: 'lg'});

    }

    logout() {
        this.isMenuCollapsed = true;
        this.router.navigate(['/']);
        this.authenticationService.signoutUser();
        window.location.reload();
    }

    subscribeNotifications() {
        this.notificationsService.notifications
            .subscribe(n => {
                this.notification = n && n.length > 0;
                if (this.notification) {
                    this.playAudio();
                    this.notificationsAmount = this.notificationsService.getAmounts();
                }
            });

    }

    onChange() {
        localStorage.setItem('anonymousLang', this.localeService.setLang(this.language));
        this.searchFilterQuizService.initSettings();
    }

    playAudio() {
        const audio = new Audio();
        audio.src = '../../assets/audio/notification.mp3';
        audio.load();
        audio.play().catch(error => {
            console.log(error);
        }).then(() => {
        });
    }
}
