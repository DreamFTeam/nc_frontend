import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {AnnouncementViewComponent} from './announcement-view/announcement-view.component';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {LastAchievementsListComponent} from './last-achievements-list/last-achievements-list.component';
import {LastPlayedGamesComponent} from './last-played-games/last-played-games.component';
import {ShortQuizListComponent} from './short-quiz-list/short-quiz-list.component';
import {SuggestionsComponent} from './suggestions/suggestions.component';
import {UserQuizzesRatingsComponent} from './user-quizzes-ratings/user-quizzes-ratings.component';


@NgModule({
    declarations: [
        LandingPageComponent,
        LastAchievementsListComponent,
        LastPlayedGamesComponent,
        ShortQuizListComponent,
        SuggestionsComponent,
        UserQuizzesRatingsComponent,
        AnnouncementViewComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class DashboardModule {
}
