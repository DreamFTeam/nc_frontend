import { TagCatg } from './tagcateg';

export class Category implements TagCatg{
    id: string;
    description: string;

    constructor(id: string, description: string){
        this.id = id;
        this.description = description;
    }
}