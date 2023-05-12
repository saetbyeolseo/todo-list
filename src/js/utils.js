const $qs = (selector, scope) => (scope || document).querySelector(selector);
const $on = (target, type, callback, capture) => target.addEventListener(type, callback, !!capture);
const $delegate = (target, selector, type, handler, capture) => {
  const dispatchEvent = (event) => {
    const targetElement = event.target;
    const potentialElements = target.querySelectorAll(selector);
    let i = potentialElements.length;

    while (i--) {
      if (potentialElements[i] === targetElement) {
        handler.call(targetElement, event);
        break;
      }
    }
  };

  $on(target, type, dispatchEvent, !!capture);
};
module.exports = {
  $qs,
  $on,
  $delegate,
};
