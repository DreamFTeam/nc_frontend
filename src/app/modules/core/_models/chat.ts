import { DesearizableWImage } from './deserializable-w-image';
import { DomSanitizer } from '@angular/platform-browser';

export class Chat implements DesearizableWImage{
    id: string;
    title: string;
    isCreator: boolean;
    isPersonal: boolean;
    joinedDate: Date;
    image: any;

    deserialize(input: any, sanitizer: DomSanitizer): this {
        Object.assign(this, input);
        if (this.image !== null && this.image !== undefined && this.image !== '') {
            const objUrl = 'data:image/jpeg;base64,' + this.image;
            this.image = sanitizer.bypassSecurityTrustUrl(objUrl);
        }
        return this;
    }
}
