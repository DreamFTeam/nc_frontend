import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Announcement } from '../_models/announcement';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AnnouncementService } from '../_services/announcement.service';
import { Alert } from '../_models/alert';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';


const PAGE_SIZE: number = 5;

@Component({
  selector: 'app-announcement-edit',
  templateUrl: './announcement-edit.component.html',
  styleUrls: ['./announcement-edit.component.css']
})
export class AnnouncementEditComponent implements OnInit {
  announcements: Announcement[];
  currentAnnouncement: Announcement
  isCollapsed: boolean[];
  inEdit: boolean[];
  editorEnabled: boolean;
  alerts: Alert[] = [];

  collectionSize: number;
  page: number;
  pageSize: number;

  loading: boolean = true;

  faSpinner = faSpinner;


  constructor(private modalService: NgbModal, 
    private announcementService: AnnouncementService) { 
    this.announcementService.getAmount().subscribe(ans => this.collectionSize = ans, err => console.log(err));
    this.announcementService.getAnnouncements(0,5).subscribe(ans => 
      this.setAnnouncements(ans)
      , err => console.log(err));
  }

  ngOnInit(): void {
    this.page = 1;
    this.pageSize = PAGE_SIZE;
    this.inEdit = [false];  //EVERY TIME +1 in code, first element for adding
    this.editorEnabled = false;
  }

  
  //getting announcements on request
  setAnnouncements(ans){
    console.log(ans);
    this.announcements = ans;
    this.isCollapsed = [];
    
    for (const key in this.announcements) {
      this.isCollapsed.push(true);
      this.inEdit.push(false);
    }
    this.loading = false;
  }

  //start editing announcement
  edit(i){
    this.editorEnabled = true;
    this.inEdit[i+1]=true;
    this.currentAnnouncement = this.announcements[i];
  }

  //deleting announcement
  delete(i){
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.text="Are you sure you want to delete announcement?";
    

    modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
      console.log(receivedEntry);
      if(receivedEntry){
        this.announcementService.deleteAnnouncement(this.announcements[i].announcementId)
        .subscribe(ans => console.log(ans), err => console.log(err));

        this.announcements.splice(i,1);
      } 
      })
  }

  //saving edited announcement
  save(i){
    if(this.announcementService.validateAnnouncement(this.currentAnnouncement)){
      const modalRef = this.modalService.open(NgbdModalContent);
    
      modalRef.componentInstance.text="Are you sure you want to save this announcement?";

      modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        console.log(receivedEntry);
        if(receivedEntry){
          
            this.announcementService.editAnnouncement(this.currentAnnouncement)
            .subscribe(ans => console.log(ans), err => console.log(err));

            Object.assign(this.announcements[i], this.currentAnnouncement);
            this.cancel(i); 
        } 
        })
    }else{
      this.alerts.push({type: 'warning', message: 'No title or description',});
    }
  }

  //cancel editing or adding
  cancel(i){
    this.inEdit[i+1]=false;
    this.currentAnnouncement = null;
    this.editorEnabled = false;
  }

  //start adding announcement
  add(){
    this.editorEnabled = true;
    this.inEdit[0]=true;
    this.currentAnnouncement = new Announcement().deserialize({"announcementId":"","creatorId":"",
    "title":"","textContent":"","creationDate":new Date(),"image":"image"});
  }

  //saving adding announcement
  saveAdd(){
    if(this.announcementService.validateAnnouncement(this.currentAnnouncement)){
      const modalRef = this.modalService.open(NgbdModalContent);
      modalRef.componentInstance.text="Are you sure you want to add this announcement?";

      modalRef.componentInstance.passEntry.subscribe((receivedEntry) => {
        if(receivedEntry){       

          
            this.announcementService.addAnnouncement(this.currentAnnouncement)
            .subscribe(ans => console.log(ans), err => console.log(err));
            
            this.announcements.unshift(new Announcement().deserialize(Object.assign({},this.currentAnnouncement)));
            this.cancel(-1);
        }
        })
    }else{
      this.alerts.push({type: 'warning', message: 'No title or description',});
    }
  }

  //close alert
  close(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }


  //get announcements on page change
  loadPage(e){
    this.loading = true;
    this.announcementService.getAnnouncements((this.page-1) * 5 ,5).subscribe(ans => 
      this.setAnnouncements(ans)
      , err => console.log(err));
  }

  getFormData(file: File): FormData {

    const formData = new FormData();
    formData.append('img', file);
    

    return formData;
  }

}






//Modal to accept deletion
@Component({
  selector: 'ngbd-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">Warning</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>{{text}}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-danger" (click)="trueResult()">Yes</button>
      <button type="button" class="btn btn-outline-dark" (click)="activeModal.close('Close click')">No</button>
    </div>
  `
})
export class NgbdModalContent {
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  @Input() text: string;

  constructor(public activeModal: NgbActiveModal) {}

  trueResult(){
    this.passEntry.emit(true);
    this.activeModal.close('Close click');
  }
}
