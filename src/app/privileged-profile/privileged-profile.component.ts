import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreatePrivilegedComponent} from '../create-privileged/create-privileged.component';
import {AuthenticationService} from '../_services/authentication.service';
import {User} from '../_models/user';
import {AdminDashboardService} from '../_services/admin-dashboard.service';

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
    titlePopQuiz = 'Most popular quizzes';
    quizPopAmount = 5;
    dataPopQuiz: any[];

    // Quizzes statuses chart
    dataQuizStatus: any[];
    titleQuizStatus = 'Quizzes statuses (FALSE) ';
    view = [400, 200];

    // Quizzes valid/invalid chart
    legendValidQuiz = true;
    dataValidQuiz: any[];
    titleValidQuiz = 'Validation statistic';
    noBarWhenZeroValidQuiz = false;

    // Games per day chart
    timeline = true;
    titleGamesPerDay = 'Games statistic';
    dataGamesPerDay: any[];


    constructor(private router: Router, private modalService: NgbModal,
                private authenticationService: AuthenticationService,
                private adminDashboardService: AdminDashboardService) {
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
            console.log(data);
        });
        // this.adminDashboardService.getQuizzesStatuses().subscribe(data => {
        //     this.dataQuizStatus = data.map(x => {
        //         return {name: x.title, value: x.gamesAmount};
        //     });
        //     console.log(data);
        // });
        this.dataQuizStatus = [
            {name: 'Published', value: 21},
            {name: 'Rejected', value: 6},
            {name: 'Activated', value: 24},
            {name: 'Unvalidated', value: 12},
            {name: 'Total', value: 35}
        ]
        this.adminDashboardService.getQuizzesValidInvalid().subscribe(data => {
            this.dataValidQuiz = [
                {
                    name: 'Admins',
                    value: data.countValidatedByAdmin
                },
                {
                    name: 'Moderators',
                    value: data.countValidatedByModerator
                }
            ];
            console.log(data);
        });

        this.adminDashboardService.getGamesAmountPerDay().subscribe(data => {
            console.log(data)
            this.dataGamesPerDay = [{
                name: 'Games',
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
