import Vue from "vue";

function getLineHeight(el) {
  const { lineHeight, fontSize } = getComputedStyle(el);

  if (lineHeight === "normal") {
    return 1.5;
  }

  return parseFloat(lineHeight) / parseFloat(fontSize);
}

function update(el) {
  const style = getComputedStyle(el);
  const { scrollHeight, clientHeight } = el;
  const scale = scrollHeight / clientHeight / 1.5; //getLineHeight(el);
  const fontSize = parseFloat(style[`font-size`]);
  const newFontSize = fontSize / scale;

  el.style.fontSize = `${newFontSize}px`;
}

Vue.directive("fittext", {
  bind(el) {
    update(el);
  },
  update(el) {
    update(el);
  }
});
