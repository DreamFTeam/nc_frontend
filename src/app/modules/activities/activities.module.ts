import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {ActivitiesComponent} from './activities/activities.component';


@NgModule({
    declarations: [
        ActivitiesComponent
    ],
    imports: [
        CommonModule,
        SharedModule
    ]
})
export class ActivitiesModule {
}
