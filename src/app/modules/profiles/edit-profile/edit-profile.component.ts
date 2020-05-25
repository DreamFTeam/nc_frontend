import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileService } from '../../core/_services/profile/profile.service';
import { PrivilegedService } from '../../core/_services/admin/privileged.service';
import { Profile } from '../../core/_models/profile';
import { AuthenticationService } from '../../core/_services/authentication/authentication.service';
import { ToastsService } from '../../core/_services/utils/toasts.service';
import { LocaleService } from '../../core/_services/utils/locale.service';
import { YesNoModalComponent } from '../../shared/yes-no-modal/yes-no-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {faSpinner} from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

    @ViewChild('fileinput')
    fileInput: ElementRef;

    private usernameToChange: string;
    private profilePictureFile: File;

    profile: Profile;
    ready: boolean; // indicates the data was loaded and can be shown
    faSpinner = faSpinner;


    constructor(private router: Router,
                private getProfileService: ProfileService,
                private priviligedService: PrivilegedService,
                private authenticationService: AuthenticationService,
                private toastsService: ToastsService,
                private localeService: LocaleService,
                private modalService: NgbModal
    ) {

        if (!this.setUsername()) {
            this.router.navigate(['/']);
        }

    }

    ngOnInit(): void {
        this.getProfileService.getProfile(this.usernameToChange).subscribe(
            result => {
                this.profile = result;
                this.ready = true;
            },
            error => {
                this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));
                this.router.navigate(['/']);
            });

    }


    setUsername(): boolean { // returns true if could identify the profile to change
        this.usernameToChange = history.state.data;

        // only users are capable of changing their own profile
        // thus only they can use the /editprofile shortcut
        if (!this.usernameToChange && this.authenticationService.currentUserValue.role === 'ROLE_USER') {
            this.usernameToChange = this.authenticationService.currentUserValue.username;
        }

        return this.usernameToChange !== null;
    }

    saveProfile() {
        this.modal(this.localeService.getValue('modal.saveChanges'), 'danger')
            .subscribe((receivedEntry) => {
                if (receivedEntry) {
                    if (this.profile.role === 'ROLE_USER') {

                        this.getProfileService.editProfile('aboutMe', this.profile.aboutMe).subscribe(
                            () => {
                                this.uploadPic();
                            },
                            (error) => {
                                this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));
                            });

                    } else {
                        this.priviligedService.edit(this.profile.id, 'aboutMe', this.profile.aboutMe).subscribe(
                            () => {
                                this.uploadPic();
                            },
                            (error) => {
                                this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

                            });
                    }
                }
            });


    }

    goBackToProfile() {
        this.modal(this.localeService.getValue('modal.leavePage'), 'danger')
        .subscribe((receivedEntry) => {
            if (receivedEntry) {
             this.router.navigate(['/profile/' + this.usernameToChange]);
            }
        });

    }

    onSelectFile(event) {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();

            reader.readAsDataURL(event.target.files[0]); // read file as data url

            if (event.target.files[0].type !== 'image/jpeg'
                && event.target.files[0].type !== 'image/png') {
                alert('Your file must be an image, try other file.');
                this.fileInput.nativeElement.value = null;
                return;
            }

            this.profilePictureFile = event.target.files[0];

            reader.onload = (value) => { // called once readAsDataURL is completed
                this.profile.image = value.target.result;
            };
        }
    }

    uploadPic(): void {
        if (!this.profilePictureFile) {
            this.router.navigate(['/profile/' + this.usernameToChange]);

        }

        const newPic = new FormData();
        newPic.append('key', this.profilePictureFile);

        if (this.profile.role === 'ROLE_USER') {
            this.getProfileService.uploadPicture(newPic).subscribe(
                () => {
                    this.router.navigate(['/profile/' + this.usernameToChange]);
                },
                (error) => {
                    this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

                });

        } else {

            newPic.append('userId', this.profile.id); // required to change moderator's or admin's profile

            this.priviligedService.uploadPicture(newPic).subscribe(
                () => {
                    this.router.navigate(['/profile/' + this.usernameToChange]);
                },
                (error) => {
                    this.toastsService.toastAddWarning(this.localeService.getValue('toasterEditor.wentWrong'));

                });
        }
    }


    modal(text, style): any {
        const modalRef = this.modalService.open(YesNoModalComponent);
        modalRef.componentInstance.text = text;
        modalRef.componentInstance.style = style;

        return modalRef.componentInstance.passEntry;
    }
}
