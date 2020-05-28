export class Message{
    authorId: string;
    authorUsername: string;
    content: string;
    sentDate: Date;

    constructor(authorId: string, authorUsername: string, content: string){
        this.authorId = authorId;
        this.authorUsername = authorUsername;
        this.content = content;
    }
}