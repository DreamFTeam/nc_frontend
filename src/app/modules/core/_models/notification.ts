export interface Notification {
    id: string;
    date: Date;
    seen: boolean;
    userId: string;
    content: string;
    link: string;
    typeId: number;
}
