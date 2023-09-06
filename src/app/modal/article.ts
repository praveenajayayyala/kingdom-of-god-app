export class Article {
    content?: string;
    isActive?: true;
    parent?: string;
    order?: number;
    id?: string;
    name?: string;
    constructor(original: any){
        Object.assign(this, original);
    }
}