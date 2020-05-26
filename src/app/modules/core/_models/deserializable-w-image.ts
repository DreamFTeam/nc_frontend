import {DomSanitizer} from '@angular/platform-browser';

export interface DesearizableWImage {
    deserialize(input: any, sanitizer: DomSanitizer): this;
}
