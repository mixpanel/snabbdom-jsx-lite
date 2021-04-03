(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __commonJS = (cb, mod) => () => (mod || cb((mod = {exports: {}}).exports, mod), mod.exports);
  var __exportStar = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    return __exportStar(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? {get: () => module.default, enumerable: true} : {value: module, enumerable: true})), module);
  };

  // node_modules/snabbdom/vnode.js
  var require_vnode = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    function vnode2(sel, data, children, text, elm) {
      var key = data === void 0 ? void 0 : data.key;
      return {sel, data, children, text, elm, key};
    }
    exports.vnode = vnode2;
    exports.default = vnode2;
  });

  // node_modules/snabbdom/is.js
  var require_is = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    exports.array = Array.isArray;
    function primitive(s) {
      return typeof s === "string" || typeof s === "number";
    }
    exports.primitive = primitive;
  });

  // node_modules/snabbdom/htmldomapi.js
  var require_htmldomapi = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    function createElement(tagName2) {
      return document.createElement(tagName2);
    }
    function createElementNS(namespaceURI, qualifiedName) {
      return document.createElementNS(namespaceURI, qualifiedName);
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
    exports.htmlDomApi = {
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
    exports.default = exports.htmlDomApi;
  });

  // node_modules/snabbdom/h.js
  var require_h = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    var vnode_1 = require_vnode();
    var is = require_is();
    function addNS(data, children, sel) {
      data.ns = "http://www.w3.org/2000/svg";
      if (sel !== "foreignObject" && children !== void 0) {
        for (var i = 0; i < children.length; ++i) {
          var childData = children[i].data;
          if (childData !== void 0) {
            addNS(childData, children[i].children, children[i].sel);
          }
        }
      }
    }
    function h(sel, b, c) {
      var data = {}, children, text, i;
      if (c !== void 0) {
        data = b;
        if (is.array(c)) {
          children = c;
        } else if (is.primitive(c)) {
          text = c;
        } else if (c && c.sel) {
          children = [c];
        }
      } else if (b !== void 0) {
        if (is.array(b)) {
          children = b;
        } else if (is.primitive(b)) {
          text = b;
        } else if (b && b.sel) {
          children = [b];
        } else {
          data = b;
        }
      }
      if (children !== void 0) {
        for (i = 0; i < children.length; ++i) {
          if (is.primitive(children[i]))
            children[i] = vnode_1.vnode(void 0, void 0, void 0, children[i], void 0);
        }
      }
      if (sel[0] === "s" && sel[1] === "v" && sel[2] === "g" && (sel.length === 3 || sel[3] === "." || sel[3] === "#")) {
        addNS(data, children, sel);
      }
      return vnode_1.vnode(sel, data, children, text, void 0);
    }
    exports.h = h;
    exports.default = h;
  });

  // node_modules/snabbdom/thunk.js
  var require_thunk = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    var h_1 = require_h();
    function copyToThunk(vnode2, thunk) {
      thunk.elm = vnode2.elm;
      vnode2.data.fn = thunk.data.fn;
      vnode2.data.args = thunk.data.args;
      thunk.data = vnode2.data;
      thunk.children = vnode2.children;
      thunk.text = vnode2.text;
      thunk.elm = vnode2.elm;
    }
    function init(thunk) {
      var cur = thunk.data;
      var vnode2 = cur.fn.apply(void 0, cur.args);
      copyToThunk(vnode2, thunk);
    }
    function prepatch(oldVnode, thunk) {
      var i, old = oldVnode.data, cur = thunk.data;
      var oldArgs = old.args, args = cur.args;
      if (old.fn !== cur.fn || oldArgs.length !== args.length) {
        copyToThunk(cur.fn.apply(void 0, args), thunk);
        return;
      }
      for (i = 0; i < args.length; ++i) {
        if (oldArgs[i] !== args[i]) {
          copyToThunk(cur.fn.apply(void 0, args), thunk);
          return;
        }
      }
      copyToThunk(oldVnode, thunk);
    }
    exports.thunk = function thunk(sel, key, fn, args) {
      if (args === void 0) {
        args = fn;
        fn = key;
        key = void 0;
      }
      return h_1.h(sel, {
        key,
        hook: {init, prepatch},
        fn,
        args
      });
    };
    exports.default = exports.thunk;
  });

  // node_modules/snabbdom/snabbdom.js
  var require_snabbdom = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    var vnode_1 = require_vnode();
    var is = require_is();
    var htmldomapi_1 = require_htmldomapi();
    function isUndef(s) {
      return s === void 0;
    }
    function isDef(s) {
      return s !== void 0;
    }
    var emptyNode = vnode_1.default("", {}, [], void 0, void 0);
    function sameVnode(vnode1, vnode2) {
      return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
    }
    function isVnode(vnode2) {
      return vnode2.sel !== void 0;
    }
    function createKeyToOldIdx(children, beginIdx, endIdx) {
      var i, map = {}, key, ch;
      for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i];
        if (ch != null) {
          key = ch.key;
          if (key !== void 0)
            map[key] = i;
        }
      }
      return map;
    }
    var hooks = ["create", "update", "remove", "destroy", "pre", "post"];
    var h_1 = require_h();
    exports.h = h_1.h;
    var thunk_1 = require_thunk();
    exports.thunk = thunk_1.thunk;
    function init(modules, domApi) {
      var i, j, cbs = {};
      var api = domApi !== void 0 ? domApi : htmldomapi_1.default;
      for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
          var hook = modules[j][hooks[i]];
          if (hook !== void 0) {
            cbs[hooks[i]].push(hook);
          }
        }
      }
      function emptyNodeAt(elm) {
        var id = elm.id ? "#" + elm.id : "";
        var c = elm.className ? "." + elm.className.split(" ").join(".") : "";
        return vnode_1.default(api.tagName(elm).toLowerCase() + id + c, {}, [], void 0, elm);
      }
      function createRmCb(childElm, listeners) {
        return function rmCb() {
          if (--listeners === 0) {
            var parent_1 = api.parentNode(childElm);
            api.removeChild(parent_1, childElm);
          }
        };
      }
      function createElm(vnode2, insertedVnodeQueue) {
        var i2, data = vnode2.data;
        if (data !== void 0) {
          if (isDef(i2 = data.hook) && isDef(i2 = i2.init)) {
            i2(vnode2);
            data = vnode2.data;
          }
        }
        var children = vnode2.children, sel = vnode2.sel;
        if (sel === "!") {
          if (isUndef(vnode2.text)) {
            vnode2.text = "";
          }
          vnode2.elm = api.createComment(vnode2.text);
        } else if (sel !== void 0) {
          var hashIdx = sel.indexOf("#");
          var dotIdx = sel.indexOf(".", hashIdx);
          var hash = hashIdx > 0 ? hashIdx : sel.length;
          var dot = dotIdx > 0 ? dotIdx : sel.length;
          var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
          var elm = vnode2.elm = isDef(data) && isDef(i2 = data.ns) ? api.createElementNS(i2, tag) : api.createElement(tag);
          if (hash < dot)
            elm.setAttribute("id", sel.slice(hash + 1, dot));
          if (dotIdx > 0)
            elm.setAttribute("class", sel.slice(dot + 1).replace(/\./g, " "));
          for (i2 = 0; i2 < cbs.create.length; ++i2)
            cbs.create[i2](emptyNode, vnode2);
          if (is.array(children)) {
            for (i2 = 0; i2 < children.length; ++i2) {
              var ch = children[i2];
              if (ch != null) {
                api.appendChild(elm, createElm(ch, insertedVnodeQueue));
              }
            }
          } else if (is.primitive(vnode2.text)) {
            api.appendChild(elm, api.createTextNode(vnode2.text));
          }
          i2 = vnode2.data.hook;
          if (isDef(i2)) {
            if (i2.create)
              i2.create(emptyNode, vnode2);
            if (i2.insert)
              insertedVnodeQueue.push(vnode2);
          }
        } else {
          vnode2.elm = api.createTextNode(vnode2.text);
        }
        return vnode2.elm;
      }
      function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
          var ch = vnodes[startIdx];
          if (ch != null) {
            api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
          }
        }
      }
      function invokeDestroyHook(vnode2) {
        var i2, j2, data = vnode2.data;
        if (data !== void 0) {
          if (isDef(i2 = data.hook) && isDef(i2 = i2.destroy))
            i2(vnode2);
          for (i2 = 0; i2 < cbs.destroy.length; ++i2)
            cbs.destroy[i2](vnode2);
          if (vnode2.children !== void 0) {
            for (j2 = 0; j2 < vnode2.children.length; ++j2) {
              i2 = vnode2.children[j2];
              if (i2 != null && typeof i2 !== "string") {
                invokeDestroyHook(i2);
              }
            }
          }
        }
      }
      function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
          var i_1 = void 0, listeners = void 0, rm = void 0, ch = vnodes[startIdx];
          if (ch != null) {
            if (isDef(ch.sel)) {
              invokeDestroyHook(ch);
              listeners = cbs.remove.length + 1;
              rm = createRmCb(ch.elm, listeners);
              for (i_1 = 0; i_1 < cbs.remove.length; ++i_1)
                cbs.remove[i_1](ch, rm);
              if (isDef(i_1 = ch.data) && isDef(i_1 = i_1.hook) && isDef(i_1 = i_1.remove)) {
                i_1(ch, rm);
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
        var oldStartIdx = 0, newStartIdx = 0;
        var oldEndIdx = oldCh.length - 1;
        var oldStartVnode = oldCh[0];
        var oldEndVnode = oldCh[oldEndIdx];
        var newEndIdx = newCh.length - 1;
        var newStartVnode = newCh[0];
        var newEndVnode = newCh[newEndIdx];
        var oldKeyToIdx;
        var idxInOld;
        var elmToMove;
        var before;
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
              newStartVnode = newCh[++newStartIdx];
            } else {
              elmToMove = oldCh[idxInOld];
              if (elmToMove.sel !== newStartVnode.sel) {
                api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
              } else {
                patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                oldCh[idxInOld] = void 0;
                api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
              }
              newStartVnode = newCh[++newStartIdx];
            }
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
        var i2, hook2;
        if (isDef(i2 = vnode2.data) && isDef(hook2 = i2.hook) && isDef(i2 = hook2.prepatch)) {
          i2(oldVnode, vnode2);
        }
        var elm = vnode2.elm = oldVnode.elm;
        var oldCh = oldVnode.children;
        var ch = vnode2.children;
        if (oldVnode === vnode2)
          return;
        if (vnode2.data !== void 0) {
          for (i2 = 0; i2 < cbs.update.length; ++i2)
            cbs.update[i2](oldVnode, vnode2);
          i2 = vnode2.data.hook;
          if (isDef(i2) && isDef(i2 = i2.update))
            i2(oldVnode, vnode2);
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
        if (isDef(hook2) && isDef(i2 = hook2.postpatch)) {
          i2(oldVnode, vnode2);
        }
      }
      return function patch2(oldVnode, vnode2) {
        var i2, elm, parent;
        var insertedVnodeQueue = [];
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
    exports.init = init;
  });

  // node_modules/snabbdom/tovnode.js
  var require_tovnode = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    var vnode_1 = require_vnode();
    var htmldomapi_1 = require_htmldomapi();
    function toVNode2(node, domApi) {
      var api = domApi !== void 0 ? domApi : htmldomapi_1.default;
      var text;
      if (api.isElement(node)) {
        var id = node.id ? "#" + node.id : "";
        var cn = node.getAttribute("class");
        var c = cn ? "." + cn.split(" ").join(".") : "";
        var sel = api.tagName(node).toLowerCase() + id + c;
        var attrs = {};
        var children = [];
        var name_1;
        var i = void 0, n = void 0;
        var elmAttrs = node.attributes;
        var elmChildren = node.childNodes;
        for (i = 0, n = elmAttrs.length; i < n; i++) {
          name_1 = elmAttrs[i].nodeName;
          if (name_1 !== "id" && name_1 !== "class") {
            attrs[name_1] = elmAttrs[i].nodeValue;
          }
        }
        for (i = 0, n = elmChildren.length; i < n; i++) {
          children.push(toVNode2(elmChildren[i], domApi));
        }
        return vnode_1.default(sel, {attrs}, children, void 0, node);
      } else if (api.isText(node)) {
        text = api.getTextContent(node);
        return vnode_1.default(void 0, void 0, void 0, text, node);
      } else if (api.isComment(node)) {
        text = api.getTextContent(node);
        return vnode_1.default("!", {}, [], text, node);
      } else {
        return vnode_1.default("", {}, [], void 0, node);
      }
    }
    exports.toVNode = toVNode2;
    exports.default = toVNode2;
  });

  // node_modules/snabbdom/modules/attributes.js
  var require_attributes = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    var xlinkNS = "http://www.w3.org/1999/xlink";
    var xmlNS = "http://www.w3.org/XML/1998/namespace";
    var colonChar = 58;
    var xChar = 120;
    function updateAttrs(oldVnode, vnode2) {
      var key, elm = vnode2.elm, oldAttrs = oldVnode.data.attrs, attrs = vnode2.data.attrs;
      if (!oldAttrs && !attrs)
        return;
      if (oldAttrs === attrs)
        return;
      oldAttrs = oldAttrs || {};
      attrs = attrs || {};
      for (key in attrs) {
        var cur = attrs[key];
        var old = oldAttrs[key];
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
    exports.attributesModule = {create: updateAttrs, update: updateAttrs};
    exports.default = exports.attributesModule;
  });

  // node_modules/snabbdom/modules/class.js
  var require_class = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    function updateClass(oldVnode, vnode2) {
      var cur, name, elm = vnode2.elm, oldClass = oldVnode.data.class, klass = vnode2.data.class;
      if (!oldClass && !klass)
        return;
      if (oldClass === klass)
        return;
      oldClass = oldClass || {};
      klass = klass || {};
      for (name in oldClass) {
        if (!klass[name]) {
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
    exports.classModule = {create: updateClass, update: updateClass};
    exports.default = exports.classModule;
  });

  // node_modules/snabbdom/modules/style.js
  var require_style = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
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
      var cur, name, elm = vnode2.elm, oldStyle = oldVnode.data.style, style = vnode2.data.style;
      if (!oldStyle && !style)
        return;
      if (oldStyle === style)
        return;
      oldStyle = oldStyle || {};
      style = style || {};
      var oldHasDel = "delayed" in oldStyle;
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
          for (var name2 in style.delayed) {
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
      var style, name, elm = vnode2.elm, s = vnode2.data.style;
      if (!s || !(style = s.destroy))
        return;
      for (name in style) {
        elm.style[name] = style[name];
      }
    }
    function applyRemoveStyle(vnode2, rm) {
      var s = vnode2.data.style;
      if (!s || !s.remove) {
        rm();
        return;
      }
      if (!reflowForced) {
        vnode2.elm.offsetLeft;
        reflowForced = true;
      }
      var name, elm = vnode2.elm, i = 0, compStyle, style = s.remove, amount = 0, applied = [];
      for (name in style) {
        applied.push(name);
        elm.style[name] = style[name];
      }
      compStyle = getComputedStyle(elm);
      var props = compStyle["transition-property"].split(", ");
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
    exports.styleModule = {
      pre: forceReflow,
      create: updateStyle,
      update: updateStyle,
      destroy: applyDestroyStyle,
      remove: applyRemoveStyle
    };
    exports.default = exports.styleModule;
  });

  // node_modules/snabbdom/modules/props.js
  var require_props = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    function updateProps(oldVnode, vnode2) {
      var key, cur, old, elm = vnode2.elm, oldProps = oldVnode.data.props, props = vnode2.data.props;
      if (!oldProps && !props)
        return;
      if (oldProps === props)
        return;
      oldProps = oldProps || {};
      props = props || {};
      for (key in oldProps) {
        if (!props[key]) {
          delete elm[key];
        }
      }
      for (key in props) {
        cur = props[key];
        old = oldProps[key];
        if (old !== cur && (key !== "value" || elm[key] !== cur)) {
          elm[key] = cur;
        }
      }
    }
    exports.propsModule = {create: updateProps, update: updateProps};
    exports.default = exports.propsModule;
  });

  // node_modules/snabbdom/modules/eventlisteners.js
  var require_eventlisteners = __commonJS((exports) => {
    "use strict";
    Object.defineProperty(exports, "__esModule", {value: true});
    function invokeHandler(handler, vnode2, event) {
      if (typeof handler === "function") {
        handler.call(vnode2, event, vnode2);
      } else if (typeof handler === "object") {
        if (typeof handler[0] === "function") {
          if (handler.length === 2) {
            handler[0].call(vnode2, handler[1], event, vnode2);
          } else {
            var args = handler.slice(1);
            args.push(event);
            args.push(vnode2);
            handler[0].apply(vnode2, args);
          }
        } else {
          for (var i = 0; i < handler.length; i++) {
            invokeHandler(handler[i], vnode2, event);
          }
        }
      }
    }
    function handleEvent(event, vnode2) {
      var name = event.type, on = vnode2.data.on;
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
      var oldOn = oldVnode.data.on, oldListener = oldVnode.listener, oldElm = oldVnode.elm, on = vnode2 && vnode2.data.on, elm = vnode2 && vnode2.elm, name;
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
        var listener = vnode2.listener = oldVnode.listener || createListener();
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
    exports.eventListenersModule = {
      create: updateEventListeners,
      update: updateEventListeners,
      destroy: updateEventListeners
    };
    exports.default = exports.eventListenersModule;
  });

  // src/jsx.ts
  var import_vnode = __toModule(require_vnode());
  function flattenAndFilterFalsey(children, flattened) {
    for (const child of children) {
      if (child !== void 0 && child !== null && child !== false && child !== ``) {
        if (Array.isArray(child)) {
          flattenAndFilterFalsey(child, flattened);
        } else if (typeof child === `string` || typeof child === `number` || typeof child === `boolean`) {
          flattened.push((0, import_vnode.vnode)(void 0, void 0, void 0, String(child), void 0));
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
        return (0, import_vnode.vnode)(tag, data, void 0, void 0, void 0);
      } else if (numFlattenedChildren === 1 && flattenedChildren[0].sel === void 0 && flattenedChildren[0].text) {
        return (0, import_vnode.vnode)(tag, data, void 0, flattenedChildren[0].text, void 0);
      } else {
        return (0, import_vnode.vnode)(tag, data, flattenedChildren, void 0, void 0);
      }
    }
  }

  // example/app.tsx
  var import_snabbdom = __toModule(require_snabbdom());
  var import_tovnode = __toModule(require_tovnode());
  var import_attributes = __toModule(require_attributes());
  var import_class = __toModule(require_class());
  var import_style = __toModule(require_style());
  var import_props = __toModule(require_props());
  var import_eventlisteners = __toModule(require_eventlisteners());
  var patch = (0, import_snabbdom.init)([import_attributes.default, import_class.default, import_style.default, import_eventlisteners.default, import_props.default]);
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
  var ClockApp = class {
    constructor(props) {
      this.props = {};
      this.state = {};
      this.props = props;
      this.update({date: new Date()});
      setInterval(() => this.update({date: new Date()}), 1e3);
    }
    update(stateUpdate) {
      this.state = Object.assign(this.state, stateUpdate);
      this.props.renderCallback(this.render());
    }
    render() {
      const date = new Date();
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
  function bindRender(el) {
    let vnode2 = (0, import_tovnode.default)(document.createComment(``));
    el.appendChild(vnode2.elm);
    function renderCallback(newVNode) {
      vnode2 = patch(vnode2, newVNode);
    }
    return renderCallback;
  }
  new ClockApp({
    renderCallback: bindRender(document.body)
  });
})();
