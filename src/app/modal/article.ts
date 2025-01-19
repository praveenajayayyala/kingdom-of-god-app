import { ArticalControlBase } from "../artical-controls/artical-control-base";

export class Article {
    content?: string;
    controls?: ArticalControlBase<string>[];
    isActive?: boolean;
    parent?: string;
    order?: number;
    id?: string;
    name?: string;
    pageTitle?: string;
    pageBackImg?: string;
    constructor(original: any){
        Object.assign(this, original);
    }
}