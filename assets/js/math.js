function decodeMathEscapes(value) {
  return value
    .replace(/\\\\/g, "\\")
    .replace(/\\\$/g, "$");
}

function isEscapedDelimiter(text, index) {
  var backslashCount = 0;
  var cursor = index - 1;

  while (cursor >= 0 && text.charAt(cursor) === "\\") {
    backslashCount += 1;
    cursor -= 1;
  }

  return backslashCount % 2 === 1;
}

function findClosingDelimiter(text, startIndex, delimiter) {
  var index = startIndex;

  while (index < text.length) {
    var foundIndex = text.indexOf(delimiter, index);

    if (foundIndex === -1) {
      return -1;
    }

    if (!isEscapedDelimiter(text, foundIndex)) {
      return foundIndex;
    }

    index = foundIndex + delimiter.length;
  }

  return -1;
}

function replaceInlineMathInTextNode(node) {
  var text = node.nodeValue;
  var fragment = document.createDocumentFragment();
  var cursor = 0;
  var hasMath = false;

  while (cursor < text.length) {
    var openIndex = text.indexOf("$", cursor);

    if (openIndex === -1) {
      break;
    }

    if (text.charAt(openIndex + 1) === "$") {
      cursor = openIndex + 2;
      continue;
    }

    if (isEscapedDelimiter(text, openIndex)) {
      cursor = openIndex + 1;
      continue;
    }

    var closeIndex = findClosingDelimiter(text, openIndex + 1, "$");

    if (closeIndex === -1) {
      break;
    }

    if (text.slice(cursor, openIndex)) {
      fragment.appendChild(document.createTextNode(text.slice(cursor, openIndex)));
    }

    var equation = decodeMathEscapes(text.slice(openIndex + 1, closeIndex).trim());
    var container = document.createElement("span");

    if (equation && window.MathSnap) {
      container.innerHTML = window.MathSnap.renderMath({
        equation: equation,
        displayMode: false
      }).html;
      fragment.appendChild(container);
      hasMath = true;
    } else {
      fragment.appendChild(document.createTextNode(text.slice(openIndex, closeIndex + 1)));
    }

    cursor = closeIndex + 1;
  }

  if (!hasMath) {
    return;
  }

  if (cursor < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(cursor)));
  }

  node.parentNode.replaceChild(fragment, node);
}

function replaceBlockMathInTextNode(node) {
  var text = node.nodeValue;
  var fragment = document.createDocumentFragment();
  var cursor = 0;
  var hasMath = false;

  while (cursor < text.length) {
    var openIndex = text.indexOf("$$", cursor);

    if (openIndex === -1) {
      break;
    }

    if (isEscapedDelimiter(text, openIndex)) {
      cursor = openIndex + 2;
      continue;
    }

    var closeIndex = findClosingDelimiter(text, openIndex + 2, "$$");

    if (closeIndex === -1) {
      break;
    }

    if (text.slice(cursor, openIndex)) {
      fragment.appendChild(document.createTextNode(text.slice(cursor, openIndex)));
    }

    var equation = decodeMathEscapes(text.slice(openIndex + 2, closeIndex).trim());
    var container = document.createElement("div");
    container.className = "aw-math-block";

    if (equation && window.MathSnap) {
      container.innerHTML = window.MathSnap.renderMath({
        equation: equation,
        displayMode: true
      }).html;
      fragment.appendChild(container);
      hasMath = true;
    } else {
      fragment.appendChild(document.createTextNode(text.slice(openIndex, closeIndex + 2)));
    }

    cursor = closeIndex + 2;
  }

  if (!hasMath) {
    return;
  }

  if (cursor < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(cursor)));
  }

  node.parentNode.replaceChild(fragment, node);
}

function renderInlineMath(root) {
  var walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        if (!node.nodeValue || node.nodeValue.indexOf("$") === -1) {
          return NodeFilter.FILTER_REJECT;
        }

        if (!node.parentNode) {
          return NodeFilter.FILTER_REJECT;
        }

        var tagName = node.parentNode.nodeName;
        if (tagName === "SCRIPT" || tagName === "STYLE" || tagName === "TEXTAREA" || tagName === "CODE" || tagName === "PRE") {
          return NodeFilter.FILTER_REJECT;
        }

        if (node.parentNode.closest(".mathsnap-render, .aw-math-block")) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  var textNodes = [];
  var currentNode;

  while ((currentNode = walker.nextNode())) {
    textNodes.push(currentNode);
  }

  textNodes.forEach(replaceInlineMathInTextNode);
}

function renderBlockMath(root) {
  var walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function (node) {
        if (!node.nodeValue || node.nodeValue.indexOf("$$") === -1) {
          return NodeFilter.FILTER_REJECT;
        }

        if (!node.parentNode) {
          return NodeFilter.FILTER_REJECT;
        }

        var tagName = node.parentNode.nodeName;
        if (tagName === "SCRIPT" || tagName === "STYLE" || tagName === "TEXTAREA" || tagName === "CODE" || tagName === "PRE") {
          return NodeFilter.FILTER_REJECT;
        }

        if (node.parentNode.closest(".mathsnap-render, .aw-math-block")) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  var textNodes = [];
  var currentNode;

  while ((currentNode = walker.nextNode())) {
    textNodes.push(currentNode);
  }

  textNodes.forEach(replaceBlockMathInTextNode);

  root.querySelectorAll("p, li, blockquote, td, th, div").forEach(function (element) {
    if (element.closest(".mathsnap-render, .aw-math-block")) {
      return;
    }

    if (element.children.length > 0) {
      return;
    }

    var content = element.textContent.trim();

    if (!content || content.slice(0, 2) !== "$$" || content.slice(-2) !== "$$") {
      return;
    }

    var equation = decodeMathEscapes(content.slice(2, -2).trim());
    if (!equation || !window.MathSnap) {
      return;
    }

    element.classList.add("aw-math-block");
    element.innerHTML = window.MathSnap.renderMath({
      equation: equation,
      displayMode: true
    }).html;
  });
}

function renderAcademicWorkMath() {
  if (!window.MathSnap) {
    return;
  }

  var root = document.querySelector("main") || document.body;
  renderBlockMath(root);
  renderInlineMath(root);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", renderAcademicWorkMath, { once: true });
} else {
  renderAcademicWorkMath();
}
