import { DesearizableWImage } from '../deserializable-w-image';
import { DomSanitizer } from '@angular/platform-browser';

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
    deserialize(input: any, sanitizer: DomSanitizer): this {
        Object.assign(this, input);
        switch(this.typeId){
            case 1:{
                this.typeName = 'Open answer';
                break;
            }
            case 2:{
                this.typeName = 'One of four';
                break;
            }
            case 3:{
                this.typeName = 'Sequence';
                break;
            }
            case 4:{
                this.typeName = 'True of false';
                break;
            }
        }
        let img = this.imageContent;
        if (img !== null){
            const objUrl = 'data:image/jpeg;base64,' + this.imageContent;
            this.imageContent = sanitizer.bypassSecurityTrustUrl(objUrl);    
        }
        return this;
    }
}