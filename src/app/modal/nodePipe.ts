import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: "nodeItemPipe"})
export class NodeItemPipe implements PipeTransform {
    transform(value: any, ...args: any[]) {
        // console.log("nodeItemPipe", value);
        return value?.node?.item;
    }
}