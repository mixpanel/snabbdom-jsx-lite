import { VNode, VNodeData } from 'snabbdom/vnode';
import { ArrayOrElement } from 'snabbdom/h';
export declare type JsxVNodeChild = VNode | string | number | boolean | undefined | null;
export declare type JsxVNodeChildren = ArrayOrElement<JsxVNodeChild>;
export declare type JsxVNodeData = VNodeData & {
    sel?: string;
};
export declare type FunctionComponent = (props: {
    [prop: string]: any;
} | null, children?: VNode[]) => VNode;
/**
 * jsx/tsx compatible factory function
 * see: https://www.typescriptlang.org/docs/handbook/jsx.html#factory-functions
 */
export declare function jsx(tag: string | FunctionComponent, data: JsxVNodeData | null, ...children: JsxVNodeChildren[]): VNode;
