export class Announcement {
    announcementId: string;
    creatorId: string;
    title: string;
    textContent: string;
    creationDate: Date;
    image: any;

    // constructor(announcementId: string, creatorId: string,
    //     title: string,textContent: string, creationDate: Date,
    //     image: any){
    //         this.announcementId = announcementId;
    //         this.creatorId = creatorId;
    //         this.title = title;
    //         this.textContent = textContent;
    //         this.creationDate = creationDate;
    //         this.image = image;
    //     }

    deserialize(input: any): this{
        Object.assign(this,input);
        return this;
    }
}