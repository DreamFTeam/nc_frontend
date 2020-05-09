import { DesearizableWImage } from './deserializable-w-image';

export class ExtendedQuizPreview implements DesearizableWImage {
    id: string;
    title: string;
    imageContent: any;
    deserialize(input: any, sanitizer: import("@angular/platform-browser").DomSanitizer): this {
        Object.assign(this, input);
        let img = this.imageContent;
        if (img !== null){
            const objUrl = 'data:image/jpeg;base64,' + this.imageContent;
            this.imageContent = sanitizer.bypassSecurityTrustUrl(objUrl);
        }
        return this;
    }
}
