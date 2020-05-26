import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'yes-no-modal',
    templateUrl: './yes-no-modal.component.html',
    styleUrls: ['./yes-no-modal.component.css']
})
export class YesNoModalComponent {
    @Output()
    passEntry: EventEmitter<any> = new EventEmitter();

    @Input()
    text: string;

    @Input()
    style: string;

    constructor(public activeModal: NgbActiveModal) {
    }

    trueResult() {
        this.passEntry.emit(true);
        this.activeModal.close('Close click');
    }
}
