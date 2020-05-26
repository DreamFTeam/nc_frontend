import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {QuizValidationComponent} from './quiz-validation/quiz-validation.component';
import {ValidationPageComponent} from './validation-page/validation-page.component';
import {ValidationTabComponent} from './validation-tab/validation-tab.component';


@NgModule({
    declarations: [
        QuizValidationComponent,
        ValidationPageComponent,
        ValidationTabComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class ValidationModule {
}
