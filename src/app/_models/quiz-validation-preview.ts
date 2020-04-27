import { DesearizableWImage } from './deserializable-w-image';
import { DomSanitizer } from '@angular/platform-browser';

export class QuizValidationPreview implements DesearizableWImage{
    id: string;
    title: string;
    description: string;
    creationDate: Date;
    creatorId: string;
    username: string;
    language: string;
    adminComment: string;
    imageContent: any;

    deserialize(input: any, sanitizer: DomSanitizer): this {
      Object.assign(this, input);
      const objUrl = 'data:image/jpeg;base64,' + this.imageContent;
      this.imageContent = sanitizer.bypassSecurityTrustUrl(objUrl);
      return this;
    }
  }