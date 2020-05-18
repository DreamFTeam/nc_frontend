import {DesearizableWImage} from './deserializable-w-image';
import {DomSanitizer} from '@angular/platform-browser';

export class ExtendedQuizPreview implements DesearizableWImage {
  quiz_id: string;
  title: string;
  image_content: any;

  deserialize(input: any, sanitizer: DomSanitizer): this {
    Object.assign(this, input);
    let img = this.image_content;
    if (img !== null) {
      const objUrl = 'data:image/jpeg;base64,' + img;
      this.image_content = sanitizer.bypassSecurityTrustUrl(objUrl);
    }
    return this;
  }
}
