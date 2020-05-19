import {DesearizableWImage} from '../deserializable-w-image';
import {DomSanitizer} from '@angular/platform-browser';

export class ExtendedQuestion implements DesearizableWImage {
  id: string;
  quizId: string;
  title: string;
  content: string;
  imageContent: any;
  points: number;
  typeId: number;
  typeName: string;
  rightOptions: string[];
  otherOptions: string[];
  unsanitizedImage: File;

  deserialize(input: any, sanitizer: DomSanitizer): this {
    Object.assign(this, input);
    switch (this.typeId) {
      case 1: {
        this.typeName = 'Options';
        break;
      }
      case 2: {
        this.typeName = 'True or false';
        if (this.rightOptions[0]) {
          this.otherOptions = ['false'];
        } else {
          this.otherOptions = ['true'];
        }
        break;
      }
      case 3: {
        this.typeName = 'Open answer';
        break;
      }
      case 4: {
        this.typeName = 'Sequence answer';
        break;
      }
    }

    if (this.imageContent !== null && this.imageContent != "") {
      const objUrl = 'data:image/jpeg;base64,' + this.imageContent;
      this.imageContent = sanitizer.bypassSecurityTrustUrl(objUrl);

      this.unsanitizedImage = this.dataURLtoFile(objUrl);
    }else{
      this.imageContent = null;
    }
    return this;
  }

  dataURLtoFile(dataurl) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], "img", { type: mime });
}
}
