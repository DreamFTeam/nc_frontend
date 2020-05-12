import { DesearizableWImage } from './deserializable-w-image';
import { DomSanitizer } from '@angular/platform-browser';
import { Tag } from './tag';
import { Category } from './category';

export class ExtendedQuiz implements DesearizableWImage {
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

    tags: Tag[];
    categories: Category[];

    isFavourite: boolean;
    imageContent: any;
    favourite: boolean;
    unsanitizedImage: File;

    deserialize(input: any, sanitizer: DomSanitizer): this {
        Object.assign(this, input);
        let img = this.imageContent;

        console.log("got");


        if (input.tagIdList !== undefined) {
            this.tags = [];
            for (let i = 0; i < input.tagIdList.length; i++) {
                this.tags.push(new Tag(input.tagIdList[i], input.tagNameList[i]))
            }
        }

        if (input.categoryIdList !== undefined) {
        this.categories = [];
            for (let i = 0; i < input.categoryIdList.length; i++) {
                this.categories.push(new Category(input.categoryIdList[i], input.categoryNameList[i]))
            }
        }

        if (img !== null) {
            const objUrl = 'data:image/jpeg;base64,' + this.imageContent;
            this.imageContent = sanitizer.bypassSecurityTrustUrl(objUrl);

            this.unsanitizedImage = this.dataURLtoFile(objUrl);
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
