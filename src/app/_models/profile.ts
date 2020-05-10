import {DomSanitizer} from '@angular/platform-browser';

export class Profile {
  username: string;
  aboutMe: string;
  imageContent: any;
  isonline: boolean;
  lastTimeOnline: Date;


  static deserialize(input: any, sanitizer: DomSanitizer): Profile {

    if (input.imageContent !== null) {
      input.imageContent =
        sanitizer.bypassSecurityTrustUrl
        ('data:image\/(png|jpg|jpeg);base64,'
          + input.imageContent);
    }
    return input;
  }

}

