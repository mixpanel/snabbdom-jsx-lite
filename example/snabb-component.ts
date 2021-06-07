import {
  init as snabbdomInit,
  toVNode,
  VNode,
  attributesModule,
  classModule,
  styleModule,
  propsModule,
  eventListenersModule,
} from 'snabbdom';

const snabbPatch = snabbdomInit([attributesModule, classModule, styleModule, eventListenersModule, propsModule]);

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
