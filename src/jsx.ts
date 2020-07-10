import {vnode, VNode, VNodeData} from 'snabbdom/vnode';

// for conditional rendering we support boolean child element e.g cond && <tag />
export type JsxVNode = VNode;
export type JsxVNodeChild = VNode | string | number | boolean | undefined | null;
export type JsxVNodeChildren = JsxVNodeChild | JsxVNodeChild[];
export interface JsxVNodeProps extends VNodeData {
  /** css selector shorthand e.g <div sel="#id.class1.class1" /> */
  sel?: string;
}

export type FunctionComponent = (props: {[prop: string]: any} | null, children?: VNode[]) => VNode;

/** Equivalent of <> (React.Fragment) that that wraps children without a containing dom element */
export function Fragment(_props: {}, children?: Array<string | VNode>): VNode {
  return vnode(undefined, undefined, children, undefined, undefined);
}

function flattenAndFilterFalsey(children: JsxVNodeChildren[], flattened: VNode[]): VNode[] {
  for (const child of children) {
    // filter out falsey children, except 0 since zero can be a valid value e.g inside a chart
    if (child !== undefined && child !== null && child !== false && child !== ``) {
      if (Array.isArray(child)) {
        flattenAndFilterFalsey(child, flattened);
      } else if (typeof child === `string` || typeof child === `number` || typeof child === `boolean`) {
        flattened.push(vnode(undefined, undefined, undefined, String(child), undefined));
      } else if (child.sel === undefined && child.text === undefined) {
        // vnode from Fragment
        if (Array.isArray(child.children)) {
          flattenAndFilterFalsey(child.children, flattened);
        }
      } else {
        flattened.push(child);
      }
    }
  }
  return flattened;
}

function addSvgNs(sel: string, data: VNodeData | undefined, children: VNode[] | undefined): void {
  data.ns = `http://www.w3.org/2000/svg`;
  if (sel !== `foreignObject` && children !== undefined) {
    for (const child of children) {
      if (child.data !== undefined) {
        addSvgNs(child.sel, child.data, child.children as VNode[]);
      }
    }
  }
}

/**
 * jsx/tsx + hyperscript compatible vnode factory function
 * see: https://www.typescriptlang.org/docs/handbook/jsx.html#factory-functions
 */
export function jsx(
  tag: string | FunctionComponent | null,
  data: JsxVNodeProps | null,
  ...children: JsxVNodeChildren[]
): JsxVNode {
  // don't call flattenAndFilterFalsey if no children
  const flattenedChildren = children.length > 0 ? flattenAndFilterFalsey(children, []) : (children as []);

  if (typeof tag === `function`) {
    // tag is a function component
    return tag(data, flattenedChildren);
  } else {
    if (tag === null) {
      // Fragment via jsxFragmentFactory: 'null' compiler option
      // change to undefined since snabbdom expects `tag: string | undefined`
      tag = undefined as string; // `as string` so we don't get TS typeguard error
    } else if (tag === `svg`) {
      // svg elements need recursive namespace
      addSvgNs(tag, data, flattenedChildren);
    }

    // append sel css selector to tag to support equivalent of h('div.foo.bar')
    data = data ?? {};
    if (data.sel) {
      tag += data.sel;
      data.sel = undefined;
    }

    const numFlattenedChildren = flattenedChildren.length;
    if (numFlattenedChildren === 0) {
      return vnode(tag, data, undefined, undefined, undefined);
    } else if (numFlattenedChildren === 1 && flattenedChildren[0].sel === undefined && flattenedChildren[0].text) {
      // only child is a simple text node, return as simple text node
      return vnode(tag, data, undefined, flattenedChildren[0].text, undefined);
    } else {
      return vnode(tag, data, flattenedChildren, undefined, undefined);
    }
  }
}
