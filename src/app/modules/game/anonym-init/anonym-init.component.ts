import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-anonim-init',
    templateUrl: './anonym-init.component.html',
    styleUrls: ['./anonym-init.component.css']
})
export class AnonymInitComponent implements OnInit {

    @Output() anonymName: EventEmitter<string> = new EventEmitter();
    nameStr: string;
    loading: boolean;

    constructor(public activeModal: NgbActiveModal) {
    }

    ngOnInit(): void {
    }

    initAnon() {
        this.activeModal.close('Close click');
        this.anonymName.emit(this.nameStr);
    }
}
