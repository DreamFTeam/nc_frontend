import { DesearizableWImage } from './deserializable-w-image';
import {DomSanitizer} from "@angular/platform-browser";

export class UserView implements DesearizableWImage{
    
    id: string;
    username: string;
    lastTimeOnline: Date;
    online: boolean;
    imageContent: any;

    deserialize(input: any, sanitizer: DomSanitizer): this {
        Object.assign(this, input);
        if (this.imageContent !== null && this.imageContent !== undefined && this.imageContent !== '') {
            const objUrl = 'data:image/jpeg;base64,' + this.imageContent;
            this.imageContent = sanitizer.bypassSecurityTrustUrl(objUrl);
        }
        return this;
    }

}