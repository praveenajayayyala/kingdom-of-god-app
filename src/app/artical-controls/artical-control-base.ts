export class ArticalControlBase<T> {
  value: T | undefined;
  key: string;
  label: string;
  required: boolean;
  src: string;
  order: number;
  layout: {
    fxLayout: string;
    fxLayoutAlignVertical: string;
    fxLayoutAlignHorizontal: string;
    fxflex: string; //percentage
    fxLayoutGap: string;
    default?: boolean;
    fxLayoutAlign?: string;
    color?: string;
  };
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
      column?: number;
      src?: string;
      controlType?: string;
      type?: string;
      parentKey?: string;
      hasChildren?: boolean;
      children?: ArticalControlBase<T>[];
      layout?: {
        fxLayout: string;
        fxLayoutAlignVertical: string;
        fxLayoutAlignHorizontal: string;
        fxflex: string;
        fxLayoutGap: string;
        default?: boolean;
        color?: string;
      };

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
    this.parentKey = options.parentKey || '';
    this.hasChildren = options.hasChildren || false;
    this.children = options.children || [];
    this.layout = options.layout || {
      fxLayout: 'row',
      fxLayoutAlignVertical: '',
      fxLayoutAlignHorizontal: 'stretch',
      fxflex: '', //percentage
      fxLayoutGap: '',
      default: true,
    };
    this.layout.fxLayoutAlign =
      this.layout.fxLayoutAlignVertical +
      ' ' +
      this.layout.fxLayoutAlignHorizontal;
  }
}
