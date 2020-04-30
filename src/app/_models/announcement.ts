export class Announcement {
    announcementId: string;
    creatorId: string;
    title: string;
    textContent: string;
    creationDate: Date;
    image: any;


    deserialize(input: any): this{
        Object.assign(this,input);
        return this;
    }
}