import { DesearizableWImage } from './deserializable-w-image';
import { DomSanitizer } from '@angular/platform-browser';

export class Achievement implements DesearizableWImage {

  title: string;

  description: string;

  imageContent: any;

  categoryTitle: string;

  datetimeGained: Date;

  timesGained: number;

  deserialize(input: any, sanitizer: DomSanitizer): this {
    if (input.imageContent !== null) {
      input.imageContent =
        sanitizer.bypassSecurityTrustUrl
          ('data:image\/(png|jpg|jpeg);base64,'
            + input.imageContent);
    }
    return input;
  }
}
