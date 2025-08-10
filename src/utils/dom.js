// src/utils/dom.js
export const qs = (sel, ctx=document) => ctx.querySelector(sel);
export const qsa = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
export const on = (evt, selOrEl, handler, opts) => {
  if (typeof selOrEl === 'string') {
    document.addEventListener(evt, e => {
      if (e.target.closest(selOrEl)) handler(e);
    }, opts);
  } else {
    selOrEl.addEventListener(evt, handler, opts);
  }
};
export const ready = (fn) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
};
