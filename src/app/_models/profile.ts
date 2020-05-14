import { DomSanitizer } from '@angular/platform-browser';

export class Profile {
  id: string;
  username: string;
  role: string;
  aboutMe: string;
  imageContent: any;
  online: boolean;
  activated: boolean;
  lastTimeOnline: Date;
  friend: boolean;
  outgoingRequest: boolean;
  incomingRequest: boolean;

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

