import {Injectable} from '@angular/core';
import {MessageModalComponent} from '../../../authorization/message-modal/message-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Injectable({
    providedIn: 'root'
})
export class ModalMessageService {

    private modal: NgbModal;

    constructor(modalService: NgbModal) {
        this.modal = modalService;
    }

    show(title: string, body: string) {
        const modalRef = this.modal.open(MessageModalComponent, {centered: true});
        modalRef.componentInstance.title = title;
        modalRef.componentInstance.body = body;
    }
}
