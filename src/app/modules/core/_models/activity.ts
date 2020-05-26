import {DesearizableWImage} from './deserializable-w-image';
import {DomSanitizer} from '@angular/platform-browser';

export class Activity implements DesearizableWImage {
    id: string;
    userId: string;
    username: string;
    datetime: Date;
    imageContent: any;
    title: string;
    link: string;


    deserialize(input: any, sanitizer: DomSanitizer): this {
        Object.assign(this, input);
        this.id = input.activityId;

        switch(input.activityTypeId) { 
            case 1: { 
               this.link = "/profile/"+input.linkInfo;
               break; 
            } 
            case 2: { 
                this.link = "/profile/"+input.linkInfo+"/3";
               break; 
            } 
            case 3: { 
               this.link = "/game/result/"+input.linkInfo;
               break; 
            } 
            case 4: { 
                this.link = "/viewquiz/"+input.linkInfo;
                break; 
             } 
         }

        if (this.imageContent) {
            const objUrl = 'data:image/jpeg;base64,' + this.imageContent;
            this.imageContent = sanitizer.bypassSecurityTrustUrl(objUrl);
        }
        return this;
    }


}
