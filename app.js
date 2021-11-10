(() => {
  // node_modules/snabbdom/build/htmldomapi.js
  function createElement(tagName2, options) {
    return document.createElement(tagName2, options);
  }
  function createElementNS(namespaceURI, qualifiedName, options) {
    return document.createElementNS(namespaceURI, qualifiedName, options);
  }
  function createTextNode(text) {
    return document.createTextNode(text);
  }
  function createComment(text) {
    return document.createComment(text);
  }
  function insertBefore(parentNode2, newNode, referenceNode) {
    parentNode2.insertBefore(newNode, referenceNode);
  }
  function removeChild(node, child) {
    node.removeChild(child);
  }
  function appendChild(node, child) {
    node.appendChild(child);
  }
  function parentNode(node) {
    return node.parentNode;
  }
  function nextSibling(node) {
    return node.nextSibling;
  }
  function tagName(elm) {
    return elm.tagName;
  }
  function setTextContent(node, text) {
    node.textContent = text;
  }
  function getTextContent(node) {
    return node.textContent;
  }
  function isElement(node) {
    return node.nodeType === 1;
  }
  function isText(node) {
    return node.nodeType === 3;
  }
  function isComment(node) {
    return node.nodeType === 8;
  }
  var htmlDomApi = {
    createElement,
    createElementNS,
    createTextNode,
    createComment,
    insertBefore,
    removeChild,
    appendChild,
    parentNode,
    nextSibling,
    tagName,
    setTextContent,
    getTextContent,
    isElement,
    isText,
    isComment
  };

  // node_modules/snabbdom/build/vnode.js
  function vnode(sel, data, children, text, elm) {
    const key = data === void 0 ? void 0 : data.key;
    return {sel, data, children, text, elm, key};
  }

  // node_modules/snabbdom/build/is.js
  var array = Array.isArray;
  function primitive(s) {
    return typeof s === "string" || typeof s === "number";
  }

  // node_modules/snabbdom/build/init.js
  function isUndef(s) {
    return s === void 0;
  }
  function isDef(s) {
    return s !== void 0;
  }
  var emptyNode = vnode("", {}, [], void 0, void 0);
  function sameVnode(vnode1, vnode2) {
    var _a, _b;
    const isSameKey = vnode1.key === vnode2.key;
    const isSameIs = ((_a = vnode1.data) === null || _a === void 0 ? void 0 : _a.is) === ((_b = vnode2.data) === null || _b === void 0 ? void 0 : _b.is);
    const isSameSel = vnode1.sel === vnode2.sel;
    return isSameSel && isSameKey && isSameIs;
  }
  function isVnode(vnode2) {
    return vnode2.sel !== void 0;
  }
  function createKeyToOldIdx(children, beginIdx, endIdx) {
    var _a;
    const map = {};
    for (let i = beginIdx; i <= endIdx; ++i) {
      const key = (_a = children[i]) === null || _a === void 0 ? void 0 : _a.key;
      if (key !== void 0) {
        map[key] = i;
      }
    }
    return map;
  }
  var hooks = [
    "create",
    "update",
    "remove",
    "destroy",
    "pre",
    "post"
  ];
  function init(modules, domApi) {
    let i;
    let j;
    const cbs = {
      create: [],
      update: [],
      remove: [],
      destroy: [],
      pre: [],
      post: []
    };
    const api = domApi !== void 0 ? domApi : htmlDomApi;
    for (i = 0; i < hooks.length; ++i) {
      cbs[hooks[i]] = [];
      for (j = 0; j < modules.length; ++j) {
        const hook = modules[j][hooks[i]];
        if (hook !== void 0) {
          cbs[hooks[i]].push(hook);
        }
      }
    }
    function emptyNodeAt(elm) {
      const id = elm.id ? "#" + elm.id : "";
      const c = elm.className ? "." + elm.className.split(" ").join(".") : "";
      return vnode(api.tagName(elm).toLowerCase() + id + c, {}, [], void 0, elm);
    }
    function createRmCb(childElm, listeners) {
      return function rmCb() {
        if (--listeners === 0) {
          const parent = api.parentNode(childElm);
          api.removeChild(parent, childElm);
        }
      };
    }
    function createElm(vnode2, insertedVnodeQueue) {
      var _a, _b;
      let i2;
      let data = vnode2.data;
      if (data !== void 0) {
        const init2 = (_a = data.hook) === null || _a === void 0 ? void 0 : _a.init;
        if (isDef(init2)) {
          init2(vnode2);
          data = vnode2.data;
        }
      }
      const children = vnode2.children;
      const sel = vnode2.sel;
      if (sel === "!") {
        if (isUndef(vnode2.text)) {
          vnode2.text = "";
        }
        vnode2.elm = api.createComment(vnode2.text);
      } else if (sel !== void 0) {
        const hashIdx = sel.indexOf("#");
        const dotIdx = sel.indexOf(".", hashIdx);
        const hash = hashIdx > 0 ? hashIdx : sel.length;
        const dot = dotIdx > 0 ? dotIdx : sel.length;
        const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
        const elm = vnode2.elm = isDef(data) && isDef(i2 = data.ns) ? api.createElementNS(i2, tag, data) : api.createElement(tag, data);
        if (hash < dot)
          elm.setAttribute("id", sel.slice(hash + 1, dot));
        if (dotIdx > 0)
          elm.setAttribute("class", sel.slice(dot + 1).replace(/\./g, " "));
        for (i2 = 0; i2 < cbs.create.length; ++i2)
          cbs.create[i2](emptyNode, vnode2);
        if (array(children)) {
          for (i2 = 0; i2 < children.length; ++i2) {
            const ch = children[i2];
            if (ch != null) {
              api.appendChild(elm, createElm(ch, insertedVnodeQueue));
            }
          }
        } else if (primitive(vnode2.text)) {
          api.appendChild(elm, api.createTextNode(vnode2.text));
        }
        const hook = vnode2.data.hook;
        if (isDef(hook)) {
          (_b = hook.create) === null || _b === void 0 ? void 0 : _b.call(hook, emptyNode, vnode2);
          if (hook.insert) {
            insertedVnodeQueue.push(vnode2);
          }
        }
      } else {
        vnode2.elm = api.createTextNode(vnode2.text);
      }
      return vnode2.elm;
    }
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
      for (; startIdx <= endIdx; ++startIdx) {
        const ch = vnodes[startIdx];
        if (ch != null) {
          api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
        }
      }
    }
    function invokeDestroyHook(vnode2) {
      var _a, _b;
      const data = vnode2.data;
      if (data !== void 0) {
        (_b = (_a = data === null || data === void 0 ? void 0 : data.hook) === null || _a === void 0 ? void 0 : _a.destroy) === null || _b === void 0 ? void 0 : _b.call(_a, vnode2);
        for (let i2 = 0; i2 < cbs.destroy.length; ++i2)
          cbs.destroy[i2](vnode2);
        if (vnode2.children !== void 0) {
          for (let j2 = 0; j2 < vnode2.children.length; ++j2) {
            const child = vnode2.children[j2];
            if (child != null && typeof child !== "string") {
              invokeDestroyHook(child);
            }
          }
        }
      }
    }
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
      var _a, _b;
      for (; startIdx <= endIdx; ++startIdx) {
        let listeners;
        let rm;
        const ch = vnodes[startIdx];
        if (ch != null) {
          if (isDef(ch.sel)) {
            invokeDestroyHook(ch);
            listeners = cbs.remove.length + 1;
            rm = createRmCb(ch.elm, listeners);
            for (let i2 = 0; i2 < cbs.remove.length; ++i2)
              cbs.remove[i2](ch, rm);
            const removeHook = (_b = (_a = ch === null || ch === void 0 ? void 0 : ch.data) === null || _a === void 0 ? void 0 : _a.hook) === null || _b === void 0 ? void 0 : _b.remove;
            if (isDef(removeHook)) {
              removeHook(ch, rm);
            } else {
              rm();
            }
          } else {
            api.removeChild(parentElm, ch.elm);
          }
        }
      }
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
      let oldStartIdx = 0;
      let newStartIdx = 0;
      let oldEndIdx = oldCh.length - 1;
      let oldStartVnode = oldCh[0];
      let oldEndVnode = oldCh[oldEndIdx];
      let newEndIdx = newCh.length - 1;
      let newStartVnode = newCh[0];
      let newEndVnode = newCh[newEndIdx];
      let oldKeyToIdx;
      let idxInOld;
      let elmToMove;
      let before;
      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (oldStartVnode == null) {
          oldStartVnode = oldCh[++oldStartIdx];
        } else if (oldEndVnode == null) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (newStartVnode == null) {
          newStartVnode = newCh[++newStartIdx];
        } else if (newEndVnode == null) {
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) {
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
          api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) {
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
          api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          if (oldKeyToIdx === void 0) {
            oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
          }
          idxInOld = oldKeyToIdx[newStartVnode.key];
          if (isUndef(idxInOld)) {
            api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
          } else {
            elmToMove = oldCh[idxInOld];
            if (elmToMove.sel !== newStartVnode.sel) {
              api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
            } else {
              patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
              oldCh[idxInOld] = void 0;
              api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
            }
          }
          newStartVnode = newCh[++newStartIdx];
        }
      }
      if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
        if (oldStartIdx > oldEndIdx) {
          before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
          addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
        } else {
          removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
      }
    }
    function patchVnode(oldVnode, vnode2, insertedVnodeQueue) {
      var _a, _b, _c, _d, _e;
      const hook = (_a = vnode2.data) === null || _a === void 0 ? void 0 : _a.hook;
      (_b = hook === null || hook === void 0 ? void 0 : hook.prepatch) === null || _b === void 0 ? void 0 : _b.call(hook, oldVnode, vnode2);
      const elm = vnode2.elm = oldVnode.elm;
      const oldCh = oldVnode.children;
      const ch = vnode2.children;
      if (oldVnode === vnode2)
        return;
      if (vnode2.data !== void 0) {
        for (let i2 = 0; i2 < cbs.update.length; ++i2)
          cbs.update[i2](oldVnode, vnode2);
        (_d = (_c = vnode2.data.hook) === null || _c === void 0 ? void 0 : _c.update) === null || _d === void 0 ? void 0 : _d.call(_c, oldVnode, vnode2);
      }
      if (isUndef(vnode2.text)) {
        if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch)
            updateChildren(elm, oldCh, ch, insertedVnodeQueue);
        } else if (isDef(ch)) {
          if (isDef(oldVnode.text))
            api.setTextContent(elm, "");
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
          removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
          api.setTextContent(elm, "");
        }
      } else if (oldVnode.text !== vnode2.text) {
        if (isDef(oldCh)) {
          removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        }
        api.setTextContent(elm, vnode2.text);
      }
      (_e = hook === null || hook === void 0 ? void 0 : hook.postpatch) === null || _e === void 0 ? void 0 : _e.call(hook, oldVnode, vnode2);
    }
    return function patch(oldVnode, vnode2) {
      let i2, elm, parent;
      const insertedVnodeQueue = [];
      for (i2 = 0; i2 < cbs.pre.length; ++i2)
        cbs.pre[i2]();
      if (!isVnode(oldVnode)) {
        oldVnode = emptyNodeAt(oldVnode);
      }
      if (sameVnode(oldVnode, vnode2)) {
        patchVnode(oldVnode, vnode2, insertedVnodeQueue);
      } else {
        elm = oldVnode.elm;
        parent = api.parentNode(elm);
        createElm(vnode2, insertedVnodeQueue);
        if (parent !== null) {
          api.insertBefore(parent, vnode2.elm, api.nextSibling(elm));
          removeVnodes(parent, [oldVnode], 0, 0);
        }
      }
      for (i2 = 0; i2 < insertedVnodeQueue.length; ++i2) {
        insertedVnodeQueue[i2].data.hook.insert(insertedVnodeQueue[i2]);
      }
      for (i2 = 0; i2 < cbs.post.length; ++i2)
        cbs.post[i2]();
      return vnode2;
    };
  }

  // node_modules/snabbdom/build/tovnode.js
  function toVNode(node, domApi) {
    const api = domApi !== void 0 ? domApi : htmlDomApi;
    let text;
    if (api.isElement(node)) {
      const id = node.id ? "#" + node.id : "";
      const cn = node.getAttribute("class");
      const c = cn ? "." + cn.split(" ").join(".") : "";
      const sel = api.tagName(node).toLowerCase() + id + c;
      const attrs = {};
      const children = [];
      let name;
      let i, n;
      const elmAttrs = node.attributes;
      const elmChildren = node.childNodes;
      for (i = 0, n = elmAttrs.length; i < n; i++) {
        name = elmAttrs[i].nodeName;
        if (name !== "id" && name !== "class") {
          attrs[name] = elmAttrs[i].nodeValue;
        }
      }
      for (i = 0, n = elmChildren.length; i < n; i++) {
        children.push(toVNode(elmChildren[i], domApi));
      }
      return vnode(sel, {attrs}, children, void 0, node);
    } else if (api.isText(node)) {
      text = api.getTextContent(node);
      return vnode(void 0, void 0, void 0, text, node);
    } else if (api.isComment(node)) {
      text = api.getTextContent(node);
      return vnode("!", {}, [], text, node);
    } else {
      return vnode("", {}, [], void 0, node);
    }
  }

  // node_modules/snabbdom/build/modules/attributes.js
  var xlinkNS = "http://www.w3.org/1999/xlink";
  var xmlNS = "http://www.w3.org/XML/1998/namespace";
  var colonChar = 58;
  var xChar = 120;
  function updateAttrs(oldVnode, vnode2) {
    let key;
    const elm = vnode2.elm;
    let oldAttrs = oldVnode.data.attrs;
    let attrs = vnode2.data.attrs;
    if (!oldAttrs && !attrs)
      return;
    if (oldAttrs === attrs)
      return;
    oldAttrs = oldAttrs || {};
    attrs = attrs || {};
    for (key in attrs) {
      const cur = attrs[key];
      const old = oldAttrs[key];
      if (old !== cur) {
        if (cur === true) {
          elm.setAttribute(key, "");
        } else if (cur === false) {
          elm.removeAttribute(key);
        } else {
          if (key.charCodeAt(0) !== xChar) {
            elm.setAttribute(key, cur);
          } else if (key.charCodeAt(3) === colonChar) {
            elm.setAttributeNS(xmlNS, key, cur);
          } else if (key.charCodeAt(5) === colonChar) {
            elm.setAttributeNS(xlinkNS, key, cur);
          } else {
            elm.setAttribute(key, cur);
          }
        }
      }
    }
    for (key in oldAttrs) {
      if (!(key in attrs)) {
        elm.removeAttribute(key);
      }
    }
  }
  var attributesModule = {
    create: updateAttrs,
    update: updateAttrs
  };

  // node_modules/snabbdom/build/modules/class.js
  function updateClass(oldVnode, vnode2) {
    let cur;
    let name;
    const elm = vnode2.elm;
    let oldClass = oldVnode.data.class;
    let klass = vnode2.data.class;
    if (!oldClass && !klass)
      return;
    if (oldClass === klass)
      return;
    oldClass = oldClass || {};
    klass = klass || {};
    for (name in oldClass) {
      if (oldClass[name] && !Object.prototype.hasOwnProperty.call(klass, name)) {
        elm.classList.remove(name);
      }
    }
    for (name in klass) {
      cur = klass[name];
      if (cur !== oldClass[name]) {
        elm.classList[cur ? "add" : "remove"](name);
      }
    }
  }
  var classModule = {create: updateClass, update: updateClass};

  // node_modules/snabbdom/build/modules/eventlisteners.js
  function invokeHandler(handler, vnode2, event) {
    if (typeof handler === "function") {
      handler.call(vnode2, event, vnode2);
    } else if (typeof handler === "object") {
      for (let i = 0; i < handler.length; i++) {
        invokeHandler(handler[i], vnode2, event);
      }
    }
  }
  function handleEvent(event, vnode2) {
    const name = event.type;
    const on = vnode2.data.on;
    if (on && on[name]) {
      invokeHandler(on[name], vnode2, event);
    }
  }
  function createListener() {
    return function handler(event) {
      handleEvent(event, handler.vnode);
    };
  }
  function updateEventListeners(oldVnode, vnode2) {
    const oldOn = oldVnode.data.on;
    const oldListener = oldVnode.listener;
    const oldElm = oldVnode.elm;
    const on = vnode2 && vnode2.data.on;
    const elm = vnode2 && vnode2.elm;
    let name;
    if (oldOn === on) {
      return;
    }
    if (oldOn && oldListener) {
      if (!on) {
        for (name in oldOn) {
          oldElm.removeEventListener(name, oldListener, false);
        }
      } else {
        for (name in oldOn) {
          if (!on[name]) {
            oldElm.removeEventListener(name, oldListener, false);
          }
        }
      }
    }
    if (on) {
      const listener = vnode2.listener = oldVnode.listener || createListener();
      listener.vnode = vnode2;
      if (!oldOn) {
        for (name in on) {
          elm.addEventListener(name, listener, false);
        }
      } else {
        for (name in on) {
          if (!oldOn[name]) {
            elm.addEventListener(name, listener, false);
          }
        }
      }
    }
  }
  var eventListenersModule = {
    create: updateEventListeners,
    update: updateEventListeners,
    destroy: updateEventListeners
  };

  // node_modules/snabbdom/build/modules/props.js
  function updateProps(oldVnode, vnode2) {
    let key;
    let cur;
    let old;
    const elm = vnode2.elm;
    let oldProps = oldVnode.data.props;
    let props = vnode2.data.props;
    if (!oldProps && !props)
      return;
    if (oldProps === props)
      return;
    oldProps = oldProps || {};
    props = props || {};
    for (key in props) {
      cur = props[key];
      old = oldProps[key];
      if (old !== cur && (key !== "value" || elm[key] !== cur)) {
        elm[key] = cur;
      }
    }
  }
  var propsModule = {create: updateProps, update: updateProps};

  // node_modules/snabbdom/build/modules/style.js
  var raf = typeof window !== "undefined" && window.requestAnimationFrame.bind(window) || setTimeout;
  var nextFrame = function(fn) {
    raf(function() {
      raf(fn);
    });
  };
  var reflowForced = false;
  function setNextFrame(obj, prop, val) {
    nextFrame(function() {
      obj[prop] = val;
    });
  }
  function updateStyle(oldVnode, vnode2) {
    let cur;
    let name;
    const elm = vnode2.elm;
    let oldStyle = oldVnode.data.style;
    let style = vnode2.data.style;
    if (!oldStyle && !style)
      return;
    if (oldStyle === style)
      return;
    oldStyle = oldStyle || {};
    style = style || {};
    const oldHasDel = "delayed" in oldStyle;
    for (name in oldStyle) {
      if (!style[name]) {
        if (name[0] === "-" && name[1] === "-") {
          elm.style.removeProperty(name);
        } else {
          elm.style[name] = "";
        }
      }
    }
    for (name in style) {
      cur = style[name];
      if (name === "delayed" && style.delayed) {
        for (const name2 in style.delayed) {
          cur = style.delayed[name2];
          if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
            setNextFrame(elm.style, name2, cur);
          }
        }
      } else if (name !== "remove" && cur !== oldStyle[name]) {
        if (name[0] === "-" && name[1] === "-") {
          elm.style.setProperty(name, cur);
        } else {
          elm.style[name] = cur;
        }
      }
    }
  }
  function applyDestroyStyle(vnode2) {
    let style;
    let name;
    const elm = vnode2.elm;
    const s = vnode2.data.style;
    if (!s || !(style = s.destroy))
      return;
    for (name in style) {
      elm.style[name] = style[name];
    }
  }
  function applyRemoveStyle(vnode2, rm) {
    const s = vnode2.data.style;
    if (!s || !s.remove) {
      rm();
      return;
    }
    if (!reflowForced) {
      vnode2.elm.offsetLeft;
      reflowForced = true;
    }
    let name;
    const elm = vnode2.elm;
    let i = 0;
    const style = s.remove;
    let amount = 0;
    const applied = [];
    for (name in style) {
      applied.push(name);
      elm.style[name] = style[name];
    }
    const compStyle = getComputedStyle(elm);
    const props = compStyle["transition-property"].split(", ");
    for (; i < props.length; ++i) {
      if (applied.indexOf(props[i]) !== -1)
        amount++;
    }
    elm.addEventListener("transitionend", function(ev) {
      if (ev.target === elm)
        --amount;
      if (amount === 0)
        rm();
    });
  }
  function forceReflow() {
    reflowForced = false;
  }
  var styleModule = {
    pre: forceReflow,
    create: updateStyle,
    update: updateStyle,
    destroy: applyDestroyStyle,
    remove: applyRemoveStyle
  };

  // src/jsx.ts
  function flattenAndFilterFalsey(children, flattened) {
    for (const child of children) {
      if (child !== void 0 && child !== null && child !== false && child !== ``) {
        if (Array.isArray(child)) {
          flattenAndFilterFalsey(child, flattened);
        } else if (typeof child === `string` || typeof child === `number` || typeof child === `boolean`) {
          flattened.push(vnode(void 0, void 0, void 0, String(child), void 0));
        } else if (child.sel === void 0 && child.text === void 0) {
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
  function addSvgNs(sel, data, children) {
    data.ns = `http://www.w3.org/2000/svg`;
    if (sel !== `foreignObject` && children !== void 0) {
      for (const child of children) {
        if (child.data !== void 0) {
          addSvgNs(child.sel, child.data, child.children);
        }
      }
    }
  }
  function jsx(tag, data, ...children) {
    const flattenedChildren = children.length > 0 ? flattenAndFilterFalsey(children, []) : children;
    if (typeof tag === `function`) {
      return tag(data, flattenedChildren);
    } else {
      if (tag === null) {
        tag = void 0;
      } else if (tag === `svg`) {
        addSvgNs(tag, data, flattenedChildren);
      }
      data = data ?? {};
      if (data.sel) {
        tag += data.sel;
        data.sel = void 0;
      }
      const numFlattenedChildren = flattenedChildren.length;
      if (numFlattenedChildren === 0) {
        return vnode(tag, data, void 0, void 0, void 0);
      } else if (numFlattenedChildren === 1 && flattenedChildren[0].sel === void 0 && flattenedChildren[0].text) {
        return vnode(tag, data, void 0, flattenedChildren[0].text, void 0);
      } else {
        return vnode(tag, data, flattenedChildren, void 0, void 0);
      }
    }
  }

  // example/snabb-component.ts
  var snabbPatch = init([attributesModule, classModule, styleModule, eventListenersModule, propsModule]);
  var Component = class {
    constructor() {
      this.state = {};
      this.renderCallback = null;
      this._renderQueued = false;
      this.update();
    }
    update(stateUpdate) {
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
    render() {
      return null;
    }
  };
  function render(componentClass, rootEl) {
    let vnode2 = toVNode(document.createComment(``));
    rootEl.appendChild(vnode2.elm);
    const componentInstance = new componentClass();
    componentInstance.renderCallback = function renderCallback(newVNode) {
      vnode2 = snabbPatch(vnode2, newVNode);
    };
    return componentInstance;
  }

  // example/app.tsx
  var ProgressCircle = ({unit, value, maxValue}) => {
    const radiusForUnit = {
      seconds: 185,
      minutes: 150,
      hours: 115
    };
    const radius = radiusForUnit[unit];
    const circumference = Math.PI * 2 * radius;
    const progress = 1 - value / maxValue;
    return /* @__PURE__ */ jsx("circle", {
      attrs: {class: unit, r: radius, cx: 200, cy: 200},
      style: {
        strokeDasharray: String(circumference),
        strokeDashoffset: String(progress * circumference)
      }
    });
  };
  var TimeSpans = ({
    hours,
    minutes,
    seconds,
    ampm
  }) => /* @__PURE__ */ jsx(null, null, /* @__PURE__ */ jsx("span", {
    sel: ".hours"
  }, String(hours).padStart(2, `0`)), /* @__PURE__ */ jsx("span", {
    sel: ".minutes"
  }, String(minutes).padStart(2, `0`)), /* @__PURE__ */ jsx("span", {
    sel: ".seconds"
  }, String(seconds).padStart(2, `0`)), /* @__PURE__ */ jsx("span", {
    sel: ".am_pm"
  }, ampm));
  var ClockApp = class extends Component {
    constructor() {
      super();
      this.update({date: new Date()});
      setInterval(() => this.update({date: new Date()}), 1e3);
    }
    render() {
      const {date} = this.state;
      const hours = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      const ampm = date.getHours() >= 12 ? `PM` : `AM`;
      return /* @__PURE__ */ jsx("div", {
        sel: ".clock"
      }, /* @__PURE__ */ jsx("svg", {
        sel: ".progress",
        attrs: {
          width: `400`,
          height: `400`,
          viewport: `0 0 400 400`
        }
      }, /* @__PURE__ */ jsx(ProgressCircle, {
        unit: "seconds",
        value: seconds,
        maxValue: 60
      }), /* @__PURE__ */ jsx(ProgressCircle, {
        unit: "minutes",
        value: minutes,
        maxValue: 60
      }), /* @__PURE__ */ jsx(ProgressCircle, {
        unit: "hours",
        value: hours,
        maxValue: 12
      })), /* @__PURE__ */ jsx("div", {
        sel: ".text_grid"
      }, /* @__PURE__ */ jsx(TimeSpans, {
        ...{hours, minutes, seconds, ampm}
      })));
    }
  };
  render(ClockApp, document.body);
})();
//# sourceMappingURL=app.js.map
