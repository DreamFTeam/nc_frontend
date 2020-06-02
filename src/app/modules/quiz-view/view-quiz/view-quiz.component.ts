import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ExtendedQuiz } from '../../core/_models/extended-quiz';
import { Role } from '../../core/_models/role';
import { User } from '../../core/_models/user';
import { AuthenticationService } from '../../core/_services/authentication/authentication.service';
import { AnonymService } from '../../core/_services/game/anonym.service';
import { QuizService } from '../../core/_services/quiz/quiz.service';
import { DateService } from '../../core/_services/utils/date.service';
import { LocaleService } from '../../core/_services/utils/locale.service';
import { ModalService } from '../../core/_services/utils/modal.service';
import { ToastsService } from '../../core/_services/utils/toasts.service';
import { AnonymInitComponent } from '../../game/anonym-init/anonym-init.component';

@Component({
    selector: 'app-view-quiz',
    templateUrl: './view-quiz.component.html',
    styleUrls: ['./view-quiz.component.css']
})
export class ViewQuizComponent implements OnInit, OnDestroy {
    user: User;
    quiz: ExtendedQuiz;
    thumbnail: any;

    loading: boolean;
    faSpinner = faSpinner;

    subscriptions: Subscription = new Subscription();

    constructor(private quizService: QuizService,
                private activateRoute: ActivatedRoute,
                private router: Router,
                private authenticationService: AuthenticationService,
                private ngbService: NgbModal,
                private localeService: LocaleService,
                private anonymService: AnonymService, 
                public toastsService: ToastsService,
                public dateService: DateService,
                private modalService: ModalService,
                private location: Location) {
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    ngOnInit(): void {
        this.user = this.authenticationService.currentUserValue;
        this.loading = true;

        this.subscriptions.add(this.quizService.getQuiz(this.activateRoute.snapshot.params.id).subscribe(
            ans => this.setGettedQuiz(ans),
            () => this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'))
        ));
    }


    setGettedQuiz(answer) {
        this.quiz = answer;
        this.thumbnail = this.quiz.imageContent;
        this.loading = false;
    }

    markAsFavorite() {
        this.subscriptions.add(this.quizService.markAsFavorite(this.quiz.id).subscribe(
            () => {},
            () => this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'))
            ));
        this.quiz.favourite = !this.quiz.favourite;
    }

    deactivate() {
        this.subscriptions.add(this.modalService.openModal(this.localeService.getValue('modal.deactivateQ'), 'danger')
            .subscribe((receivedEntry) => {
                if (receivedEntry) {
                    this.subscriptions.add(this.quizService.deactivate(this.quiz.id).subscribe(
                        () => this.quiz.activated = false,
                        () => this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'))
                        ));
                }
            }));

    }

    delete() {
        this.subscriptions.add(
            this.modalService.openModal(this.localeService.getValue('modal.deleteQ'), 'danger')
                .subscribe((receivedEntry) => {
                    if (receivedEntry) {
                        this.subscriptions.add(this.quizService.delete(this.quiz.id).subscribe(
                            () => this.location.back(),
                            () => this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'))
                        ));
                    }
                })
        );
    }



    isMyQuiz() {
        return this.user && this.quiz.creatorId === this.user.id;
    }

    isPrivileged() {
        return this.user && (this.user.role !== Role.User);
    }


    newGame() {
        if (this.authenticationService.currentUserValue) {
            this.router.navigateByUrl(`quiz/${this.quiz.id}/newgame`);
            return;
        }
        const modalRef = this.ngbService.open(AnonymInitComponent);
        this.subscriptions.add(modalRef.componentInstance.anonymName.subscribe(n => {
            this.anonymService.anonymLogin(n).subscribe(() =>
                this.router.navigateByUrl(`quiz/${this.quiz.id}/newgame`)
            );
        }));

    }
}
