import { DomSanitizer } from '@angular/platform-browser';

export class Profile {
  id: string;
  username: string;
  role: string;
  aboutMe: string;
  image: any;
  online: boolean;
  activated: boolean;
  lastTimeOnline: Date;
  friend: boolean;
  outgoingRequest: boolean;
  incomingRequest: boolean;

  static deserialize(input: any, sanitizer: DomSanitizer): Profile {

    if (input.image !== null) {
      input.image =
        sanitizer.bypassSecurityTrustUrl
          ('data:image\/(png|jpg|jpeg);base64,'
            + input.image);
    }
    return input;
  }

}

