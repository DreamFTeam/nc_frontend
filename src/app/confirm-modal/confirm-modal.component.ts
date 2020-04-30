import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent{

  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Input() text: string;

  constructor(public activeModal: NgbActiveModal) {}

  trueResult(){
    this.passEntry.emit(true);
    this.activeModal.close('Close click');
  }

}
