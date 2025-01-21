import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ArticalControlBase } from "../artical-controls/artical-control-base";
//import { MarkdownEditorComponent } from "ngx-markdown-editor";

import unescapeJs from "unescape-js";

@Component({
    selector: "app-artical-control",
    templateUrl: "./dynamic-artical-control.component.html",
    standalone: false
})
export class DynamicArticalControlComponent {
  
  // @ViewChild(MarkdownEditorComponent)
  //  mdView!: MarkdownEditorComponent;

  // ngAfterViewInit(): void {
  //   if(this.control.controlType == "markdown"){
  //     //console.log("this.mdView", this.mdView);
  //     //this.mdView.writeValue(unescapeJs(this.control.label));
  //     //this.mdVie
  //   }
  // }
  @Input() control!: ArticalControlBase<string>;
  @Input() form!: FormGroup;
  
  getMarkdown(content: string): string{
    return unescapeJs(content);
  }
  get isValid() {
    // console.log("this.control?.required", this.control?.required, this.control)
    return this.control?.required as boolean ? this.form?.controls[this.control.key]?.valid ?? true : true;
  }
}
