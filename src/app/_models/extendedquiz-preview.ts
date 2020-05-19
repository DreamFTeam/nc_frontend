import { DesearizableWImage } from './deserializable-w-image';
import { DomSanitizer } from '@angular/platform-browser';

export class ExtendedQuizPreview implements DesearizableWImage {
  id: string;
  title: string;
  imageContent: any;

  deserialize(input: any, sanitizer: DomSanitizer): this {
    Object.assign(this, input);
    const img = this.imageContent;
    if (img !== null) {
      const objUrl = 'data:image/jpeg;base64,' + img;
      this.imageContent = sanitizer.bypassSecurityTrustUrl(objUrl);
    }
    return this;
  }
}
