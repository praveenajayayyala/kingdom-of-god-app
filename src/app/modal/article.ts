export class Article {
    content?: string;
    isActive?: boolean;
    parent?: string;
    order?: number;
    id?: string;
    name?: string;
    constructor(original: any){
        Object.assign(this, original);
    }
}