import { Component, OnInit, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Announcement } from '../../core/_models/announcement';
import { AnnouncementService } from '../../core/_services/announcements/announcement.service';
import { LocaleService } from '../../core/_services/utils/locale.service';
import { ModalService } from '../../core/_services/utils/modal.service';
import { ToastsService } from '../../core/_services/utils/toasts.service';
import { Subscription } from 'rxjs';


@Component({
    selector: 'app-announcement-edit',
    templateUrl: './announcement-edit.component.html',
    styleUrls: ['./announcement-edit.component.css']
})
export class AnnouncementEditComponent implements OnInit, OnDestroy {
    faSpinner = faSpinner;

    readonly pageSize: number = 5;
    page: number = 1;
    collectionSize: number;
    

    announcements: Announcement[];
    currentAnnouncement: Announcement;
    isCollapsed: boolean[];
    inEdit: number;
    
    loading: boolean;
    saveLoading: boolean = false;

    img: File;
    thumbnail: any;

    subscriptions: Subscription = new Subscription();


    constructor(private announcementService: AnnouncementService,
        private sanitizer: DomSanitizer,
        private toastsService: ToastsService,
        private modalService: ModalService,
        private localeService: LocaleService) {

    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }


    ngOnInit(): void {
        this.loadPage();
    }


    //getting announcements on request
    setAnnouncements(ans) {
        this.announcements = ans;

        this.isCollapsed = [];

        for (let index = 0; index < this.announcements.length; index++) {
            this.isCollapsed.push(true);
        }

        this.loading = false;
    }

    //start editing announcement
    edit(i) {
        this.img = undefined;
        this.inEdit = i + 1;
        this.currentAnnouncement = Object.assign({}, this.announcements[i]);

        if (this.currentAnnouncement.image !== null) {
            this.thumbnail = this.currentAnnouncement.image;
        } else {
            this.thumbnail = null;
        }
    }

    //deleting announcement
    delete(i) {
        this.modalService
            .openModal(this.localeService.getValue('modal.deleteAnnouncement'), 'danger')
            .subscribe((receivedEntry) => {
                if (receivedEntry) {
                    this.announcementService.deleteAnnouncement(this.announcements[i].announcementId)
                        .subscribe(
                            ans => ans,
                            () => this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'))
                        );

                    this.announcements.splice(i, 1);
                }
            });
    }

    //saving edited announcement
    saveEdit(i) {
        if (this.announcementService.validateAnnouncement(this.currentAnnouncement)) {
            this.modalService
                .openModal(this.localeService.getValue('modal.saveAnnouncement'), 'warning')
                .subscribe((receivedEntry) => {
                    if (receivedEntry) {
                        this.saveLoading = true;
                        this.announcementService.editAnnouncement(this.currentAnnouncement, this.img)
                            .subscribe(
                                () => {
                                    this.announcements[i].creatorId = this.announcementService.getAdminName();
                                    this.cancel(i);
                                },
                                () => {
                                    this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'))
                                },
                                () => this.saveLoading = false)


                    }
                });
        } else {
            this.toastsService.toastAddDanger(this.localeService.getValue('validator.noTitleOrDescription'));
        }
    }

    //cancel editing or adding
    cancel(i) {
        this.inEdit = undefined;
        this.currentAnnouncement = null;
    }

    //start adding announcement
    add() {
        this.img = undefined;
        this.inEdit = 0;
        this.thumbnail = null;
        this.currentAnnouncement = new Announcement().deserialize({
            'announcementId': '', 'creatorId': '',
            'title': '', 'textContent': '', 'creationDate': new Date(), 'image': null
        }, this.sanitizer);
    }

    //saving added announcement
    saveAdd() {
        if (this.announcementService.validateAnnouncement(this.currentAnnouncement)) {
            this.modalService
                .openModal(this.localeService.getValue('modal.saveAnnouncement'), 'warning')
                .subscribe((receivedEntry) => {
                    if (receivedEntry) {
                        this.saveLoading = true;
                        this.announcementService.addAnnouncement(this.currentAnnouncement, this.img)
                            .subscribe(
                                ans => {
                                    this.announcements.unshift(ans);
                                    this.announcements[0].creatorId = this.announcementService.getAdminName();
                                    this.cancel(-1);
                                    this.saveLoading = false;
                                },

                                () => {
                                    this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'))
                                    this.saveLoading = false;
                                },
                                () => this.saveLoading = false);


                    }
                });
        } else {
            this.toastsService.toastAddDanger(this.localeService.getValue('validator.noTitleOrDescription'));
        }
    }

    //get announcements on page change
    loadPage() {
        this.loading = true;

        this.subscriptions.add(this.announcementService.getAmount().subscribe(
            ans => this.collectionSize = ans,
            () => this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'))
        ));

        this.announcementService.getAnnouncements((this.page - 1) * 5, 5).subscribe(
            ans => this.setAnnouncements(ans),
            () => this.toastsService.toastAddDanger(this.localeService.getValue('toasterEditor.wentWrong'))
        );
    }

    //upload image click
    uploadImage(e) {
        this.img = e.target.files[0];

        let reader = new FileReader();
        if (this.img !== null && this.img !== undefined) {
            reader.readAsDataURL(this.img);
            reader.onload = () => {
                this.thumbnail = reader.result;
            };
        }
    }


    removeImage() {
        this.thumbnail = null;

        if (this.currentAnnouncement.announcementId === '') {
            this.img = undefined;
        } else {
            this.img = null;
        }

    }
}
