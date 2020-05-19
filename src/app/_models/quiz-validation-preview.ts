import {DesearizableWImage} from './deserializable-w-image';
import {DomSanitizer} from '@angular/platform-browser';

export class QuizValidationPreview implements DesearizableWImage {
  id: string;
  title: string;
  description: string;
  creationDate: Date;
  creatorId: string;
  username: string;
  language: string;
  adminComment: string;
  imageContent: any;
  published: boolean;
  activated: boolean;

  deserialize(input: any, sanitizer: DomSanitizer): this {
    Object.assign(this, input);
    const img = this.imageContent;
    if (img !== null) { //don't add url data inside if it is null - then use mock img in html
      const objUrl = 'data:image/jpeg;base64,' + img;
      this.imageContent = sanitizer.bypassSecurityTrustUrl(objUrl);
    }
    return this;
  }
}
