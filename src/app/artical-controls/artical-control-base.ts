export class ArticalControlBase<T> {
  value: T | undefined;
  key: string;
  label: string;
  required: boolean;
  src: string;
  css: string;
  order: number;
  backGroundColor: string;
  row: number;
  column: number;
  controlType: string;
  type: string;
  options: { key: string; value: string }[];
  parentKey: string;
  hasChildren?: boolean;
  children?: ArticalControlBase<T>[];
  constructor(
    options: {
      value?: T;
      key?: string;
      label?: string;
      required?: boolean;
      order?: number;
      row?: number;
      css?: string;
      column?: number;
      src?: string;
      controlType?: string;
      type?: string;
      parentKey?: string;
      hasChildren?: boolean;
      children?: ArticalControlBase<T>[];
      backGroundColor?: string;

      options?: { key: string; value: string }[];
    } = {}
  ) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.row = options.row === undefined ? 1 : options.row;
    this.column = options.column === undefined ? 1 : options.column;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.options = options.options || [];
    this.src = options.src || '';
    this.css = options.css || '';
    this.parentKey = options.parentKey || '';
    this.hasChildren = options.hasChildren || false;
    this.children = options.children || [];
    this.backGroundColor = options.backGroundColor || 'inherit';
  }
  static derived = new Set();
  // static getAllSubclasses(baseClass: any) {
  //   var globalObject = Function('return this')(); 
    
  //   var allVars = Object.keys(globalObject);
  //   console.log("globalObject", allVars)
  //   var classes = allVars.filter(function (key) {
  //   try {
  //     var obj = globalObject[key];
  //         return obj.prototype instanceof baseClass;
  //     } catch (e) {
  //         return false;
  //     }
  //   });
  //   return classes;
  // }
}
