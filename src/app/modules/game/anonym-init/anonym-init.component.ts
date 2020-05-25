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


    // joinGame() {
    //
    //     if (this.anonymName) {
    //         this.loading = true;
    //         console.log(this.anonymName);
    //         this.anonymService.anonymLogin(this.anonymName).subscribe(anon => {
    //             console.log(anon);
    //             this.gameSettingsService.join(this.activeRouter.snapshot.paramMap.get('accessId'))
    //                 .subscribe(session => {
    //                         console.log(session);
    //                         localStorage.setItem('sessionid', session.id);
    //                         this.router.navigateByUrl(`game/${session.gameId}/lobby`);
    //                     },
    //                     error => {
    //                         // this.modal.show('An error occurred', 'An error occurred.');
    //                         // this.router.navigateByUrl('/');
    //                         console.error(error);
    //                         return false;
    //                     }
    //                 );
    //         });
    //     }
    // }
    initAnon() {
        this.activeModal.close('Close click');
        this.anonymName.emit(this.nameStr);
    }
}
