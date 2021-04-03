import {init as snabbdomInit} from 'snabbdom/snabbdom';
import toVNode from 'snabbdom/tovnode';
import {VNode} from 'snabbdom/vnode';
import attrsModule from 'snabbdom/modules/attributes';
import classModule from 'snabbdom/modules/class';
import styleModule from 'snabbdom/modules/style';
import propsModule from 'snabbdom/modules/props';
import onModule from 'snabbdom/modules/eventlisteners';

const snabbPatch = snabbdomInit([attrsModule, classModule, styleModule, onModule, propsModule]);

export type RenderCallBack = (vnode: VNode) => void;

export class Component<StateT> {
  public state: StateT = {} as StateT;
  public renderCallback: RenderCallBack = null;

  private _renderQueued = false;

  constructor() {
    this.update();
  }

  update(stateUpdate?: Partial<StateT>) {
    // simple update -> render -> callback loop
    if (stateUpdate) {
      this.state = Object.assign(this.state, stateUpdate);
    }
    this._queueRender();
  }

  _queueRender() {
    if (!this._renderQueued) {
      this._renderQueued = true;
      requestAnimationFrame(() => {
        if (this.renderCallback) {
          this.renderCallback(this.render());
        }
        this._renderQueued = false;
      });
    }
  }

  render(): VNode {
    return null;
  }
}

export function render<StateT>(componentClass: new () => Component<StateT>, rootEl: HTMLElement): Component<StateT> {
  let vnode = toVNode(document.createComment(``));
  rootEl.appendChild(vnode.elm);

  const componentInstance: Component<StateT> = new componentClass();
  componentInstance.renderCallback = function renderCallback(newVNode: VNode) {
    vnode = snabbPatch(vnode, newVNode);
  };

  return componentInstance;
}
