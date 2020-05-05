import { DesearizableWImage } from './deserializable-w-image';
import { DomSanitizer } from '@angular/platform-browser';

export class ExtendedQuiz implements DesearizableWImage{
    id: string;
    title: string;
    description: string;
    creationDate: Date;
    creatorId: string;
    author: string;
    activated: boolean;
    validated: boolean;
    published: boolean;
    language: string;
    adminComment: string;
    rating: number;
    tagIdList: string[];
    tagNameList: string[];
    categoryIdList: string[];
    categoryNameList: string[];
    isFavourite: boolean;
    imageContent: any;
    
    deserialize(input: any, sanitizer: DomSanitizer): this {
        Object.assign(this, input);
        let img = this.imageContent;
        if (img !== null){
            const objUrl = 'data:image/jpeg;base64,' + this.imageContent;
            this.imageContent = sanitizer.bypassSecurityTrustUrl(objUrl);    
        }
        return this;
    }
}