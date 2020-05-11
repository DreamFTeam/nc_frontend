import { DesearizableWImage } from './deserializable-w-image';
import { DomSanitizer } from '@angular/platform-browser';

export class Announcement implements DesearizableWImage{
    announcementId: string;
    creatorId: string;
    title: string;
    textContent: string;
    creationDate: Date;
    image: any;


    deserialize(input: any, sanitizer: DomSanitizer): this{
        Object.assign(this,input);

        let img = this.image;
        if (img !== null){
            const objUrl = 'data:image/jpeg;base64,' + this.image;
            this.image = sanitizer.bypassSecurityTrustUrl(objUrl);    
        }

        return this;
    }
}
