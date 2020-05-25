import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreatePrivilegedComponent} from '../create-privileged/create-privileged.component';
import {AuthenticationService} from '../../core/_services/authentication/authentication.service';
import {User} from '../../core/_models/user';
import {AdminDashboardService} from '../../core/_services/admin/admin-dashboard.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
    selector: 'app-privileged-profile',
    templateUrl: './privileged-profile.component.html',
    styleUrls: ['./privileged-profile.component.css']
})
export class PrivilegedProfileComponent implements OnInit {
    ready: boolean;
    privilege: string;
    profile: User;

    // Popular quizzes chart
    showXAxisPopQuiz = true;
    showYAxisPopQuiz = true;
    gradientPopQuiz = false;
    showYAxisLabelPopQuiz = true;
    quizPopAmount = 5;
    dataPopQuiz: any[];

    // Quizzes statuses chart
    dataQuizStatus: any[];
    view = [400, 200];

    // Quizzes valid/invalid chart
    legendValidQuiz = true;
    dataValidQuiz: any[];
    noBarWhenZeroValidQuiz = false;

    // Games per day chart
    timeline = true;
    dataGamesPerDay: any[];


    constructor(private router: Router, private modalService: NgbModal,
                private authenticationService: AuthenticationService,
                private adminDashboardService: AdminDashboardService,
                private translate: TranslateService) {
        this.ready = false;
        this.profile = authenticationService.currentUserValue;
    }

    ngOnInit(): void {
        if (this.profile == null ||
            this.profile.role == 'ROLE_USER') {
            this.router.navigate(['/']);
        }
        this.ready = true;
        this.adminDashboardService.getPopularQuizWeek(this.quizPopAmount).subscribe(data => {
            this.dataPopQuiz = data.map(x => {
                return {name: x.title, value: x.gamesAmount, id: x.quizId};
            });
        });
        this.adminDashboardService.getQuizzesStatuses().subscribe(data => {
            this.dataQuizStatus = [];
            for (const stat in data) {
                this.dataQuizStatus.push({name: this.translate.instant('adminDash.' + stat), value: data[stat]});
            }
        });
        this.adminDashboardService.getQuizzesValidInvalid().subscribe(data => {
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

        this.adminDashboardService.getGamesAmountPerDay().subscribe(data => {
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
        modalRef.componentInstance.userrole = 'ROLE_ADMIN';

    }

    createModerator() {
        const modalRef = this.modalService.open(CreatePrivilegedComponent);
        modalRef.componentInstance.userrole = 'ROLE_MODERATOR';

    }
}
