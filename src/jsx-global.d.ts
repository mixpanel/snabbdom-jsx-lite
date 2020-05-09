// ts-eslint has a bug for .d.ts files
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {VNode, VNodeData} from 'snabbdom/vnode';

declare global {
  /**
   * opt-in jsx intrinsic global interfaces
   * see: https://www.typescriptlang.org/docs/handbook/jsx.html#type-checking
   */
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    type Element = VNode;
    interface IntrinsicElements {
      [elemName: string]: VNodeData;
    }
  }
}
