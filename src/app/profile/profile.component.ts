import { Component, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GetProfileService } from '../_services/get-profile.service';
import { PrivilegedService } from '../_services/privileged.service';
import { Quiz } from '../_models/quiz'
import { Profile } from '../_models/profile'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  public profile;
  role: string;
  privileged: boolean = false;
  private username;
  ready: boolean
  owner;
  quizzes: Quiz[];

  constructor(private _router: Router,
    private route: ActivatedRoute,
    private getProfileService: GetProfileService,
    private privilegedService: PrivilegedService,
    private sanitizer: DomSanitizer
  ) {
    this.role = JSON.parse(localStorage.getItem('userData')).role
  }

  ngOnInit(): void {
    if (GetProfileService.getCurrentProfile() == null) {
      this._router.navigate(['/']);
    }

    this.setUsername();

    console.log();
    this.getProfileService.getProfile(this.username).subscribe(
      result => {
        this.profile = Profile.deserialize(result, this.sanitizer);
        this.setRights();
        if (this.profile.role === 'ROLE_USER') {
          this.getQuizzes();
        }

        this.ready = true;

      },
      error => {
        console.error(error.error);
        this._router.navigate(['/']);
      })
  }

  setUsername() {
    this.username = this.route.snapshot.paramMap.get('username');
    if (this.username == null) {
      this.username = GetProfileService.getCurrentProfile()
      this._router.navigate(['/profile/' + GetProfileService.getCurrentProfile()]);
    }

  }

  setRights() {
    this.owner = (GetProfileService.getCurrentProfile() === this.username &&
      this.role.match('^ROLE_USER|ROLE_SUPERADMIN$')) ||
      (this.role === 'ROLE_SUPERADMIN' && this.profile.role.match('^ROLE_MODERATOR|ROLE_ADMIN'))
      || (this.role === 'ROLE_ADMIN' && this.profile.role === 'ROLE_MODERATOR');

    if (this.role !== 'ROLE_USER' && this.profile.role !== 'ROLE_USER') {
      this.privileged = true;
    }
  }

  edit() {
    this._router.navigate(['/editprofile'], { state: { data: this.profile.username } });
  }

  editAdmin(higher: boolean) {
    this.privilegedService.edit(this.profile.id, 'role', higher).subscribe(result => {
      alert('Privileges have been changed');
      window.location.reload();

    },
      error => {
        console.log(error)
        alert('An error occured, try again');
      });
  }

  deactivate(bool: boolean) {
    this.privilegedService.deactivate(this.profile.id, bool).subscribe(result => {
      alert('User`s activation status changed');
      window.location.reload();

    },
      error => {
        console.log(error)
        alert('An error occured, try again');
      });
  }


  getQuizzes() {

    this.getProfileService.getProfileQuiz(this.profile.id).subscribe(
      result => {
        result.forEach(input => {
          if (input['imageContent'] !== null) {
            input['imageContent'] =
              this.sanitizer.bypassSecurityTrustUrl
                ("data:image\/(png|jpg|jpeg);base64,"
                  + input['imageContent'])
          }
          return input;
        })
        this.quizzes = result;
      },
      error => {
        console.error(error.error);
        this.ready = true;
      })
  }


  goToQuiz(id: string) {
    this._router.navigate(['/viewquiz/' + id]);
  }
}


