import {DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {QRCodeModule} from 'angularx-qrcode';
import {SharedModule} from '../shared/shared.module';
import {AnonymInitComponent} from './anonym-init/anonym-init.component';
import {GameConnectorComponent} from './game-connector/game-connector.component';
import {GameQuestionComponent} from './game-question/game-question.component';
import {GameResultComponent} from './game-result/game-result.component';
import {GameSettingsComponent} from './game-settings/game-settings.component';
import {RatingQuizModalComponent} from './rating-quiz-modal/rating-quiz-modal.component';
import {NgxChartsModule} from '@swimlane/ngx-charts';


@NgModule({
    declarations: [
        AnonymInitComponent,
        GameConnectorComponent,
        GameQuestionComponent,
        GameResultComponent,
        GameSettingsComponent,
        RatingQuizModalComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        QRCodeModule,
        NgxChartsModule,
        DragDropModule
    ]
})
export class GameModule {
}
