import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreatePrivilegedComponent} from '../create-privileged/create-privileged.component';
import {AuthenticationService} from '../../core/_services/authentication/authentication.service';
import {User} from '../../core/_models/user';
import {AdminDashboardService} from '../../core/_services/admin/admin-dashboard.service';
import {TranslateService} from '@ngx-translate/core';
import {Role} from '../../core/_models/role';
import {first} from 'rxjs/operators';

@Component({
    selector: 'app-privileged-profile',
    templateUrl: './privileged-profile.component.html',
    styleUrls: ['./privileged-profile.component.css']
})
export class PrivilegedProfileComponent implements OnInit {
    ready: boolean;
    profile: User;
    Role = Role;

    // Popular quizzes chart
    showXAxisPopQuiz = true;
    showYAxisPopQuiz = true;
    gradientPopQuiz = false;
    showYAxisLabelPopQuiz = true;
    quizPopAmount = 5;
    dataPopQuiz: any[];
    showDataLabelPopQuiz = true;

    // Quizzes statuses chart
    dataQuizStatus: any[];
    labelQuizStatus = true;
    legendQuizStatus = true;
    legendTitleQuizStatus = '';

    // Quizzes valid/invalid chart
    legendValidQuiz = true;
    dataValidQuiz: any[];
    noBarWhenZeroValidQuiz = false;
    legendTitleValidQuiz = '';


    // Games per day chart
    dataGamesPerDay: any[];
    xAxisGamesPerDay = true;


    constructor(private router: Router, private modalService: NgbModal,
                private authenticationService: AuthenticationService,
                private adminDashboardService: AdminDashboardService,
                private translate: TranslateService) {
        this.ready = false;
        this.profile = authenticationService.currentUserValue;
    }

    ngOnInit(): void {
        if (this.profile == null ||
            this.profile.role === Role.User) {
            this.router.navigate(['/']);
        }
        this.ready = true;
        this.adminDashboardService.getPopularQuizWeek(this.quizPopAmount).pipe(first())
            .subscribe(data => {
                this.dataPopQuiz = data.map(x => {
                    return {name: x.title, value: x.gamesAmount, id: x.quizId};
                });
            });
        this.adminDashboardService.getQuizzesStatuses().pipe(first())
            .subscribe(data => {
                this.dataQuizStatus = [];
                for (const stat in data) {
                    this.dataQuizStatus.push({name: this.translate.instant('adminDash.' + stat), value: data[stat]});
                }
            });
        this.adminDashboardService.getQuizzesValidInvalid().pipe(first())
            .subscribe(data => {
                this.dataValidQuiz = [
                    {
                        name: this.translate.instant('adminDash.admins'),
                        value: data.countValidatedByAdmin
                    },
                    {
                        name: this.translate.instant('adminDash.moderators'),
                        value: data.countValidatedByModerator
                    }
                ];
            });

        this.adminDashboardService.getGamesAmountPerDay().pipe(first())
            .subscribe(data => {
                this.dataGamesPerDay = [{
                    name: this.translate.instant('adminDash.games'),
                    series: data.map(x => {
                        return {name: x.date, value: x.gamesAmount};
                    })
                }];
            });
    }

    selectQuiz(data) {
        this.router.navigateByUrl(`viewquiz/${this.dataPopQuiz.filter(x => x.name === data.name)[0].id}`);
    }


    createAdmin() {
        const modalRef = this.modalService.open(CreatePrivilegedComponent);
        modalRef.componentInstance.userrole = Role.Admin;

    }

    createModerator() {
        const modalRef = this.modalService.open(CreatePrivilegedComponent);
        modalRef.componentInstance.userrole = Role.Moderator;

    }
}
