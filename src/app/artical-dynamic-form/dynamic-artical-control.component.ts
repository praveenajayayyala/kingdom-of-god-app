import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ArticalControlBase } from "../artical-controls/artical-control-base";
import { MarkdownEditorComponent } from "ngx-markdown-editor";
import unescapeJs from "unescape-js";

@Component({
    selector: "app-artical-control",
    templateUrl: "./dynamic-artical-control.component.html",
    standalone: false
})
export class DynamicArticalControlComponent implements AfterViewInit {
  
  @ViewChild(MarkdownEditorComponent)
   mdView!: MarkdownEditorComponent;

  @Input() content!: string;

  ngAfterViewInit(): void {
    if(this.control.controlType == "markdown"){
      //console.log("this.mdView", this.mdView);
      this.mdView.writeValue(unescapeJs(this.control.label));
    }
  }
  @Input() control!: ArticalControlBase<string>;
  @Input() form!: FormGroup;
 
  get isValid() {
    // console.log("this.control?.required", this.control?.required, this.control)
    return this.control?.required as boolean ? this.form?.controls[this.control.key]?.valid ?? true : true;
  }
}
