import { useLayoutEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
import styles from "./IdeShell.module.css";

const htmlTags = [
  "a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "menu", "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "search", "section", "select", "slot", "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "var", "video", "wbr",
];

const htmlAttributes = [
  "accept", "accesskey", "action", "alt", "aria-describedby", "aria-hidden", "aria-label", "aria-labelledby", "aria-live", "aria-pressed", "aria-selected", "aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext", "autocapitalize", "autocomplete", "autofocus", "autoplay", "charset", "checked", "cite", "class", "cols", "colspan", "content", "contenteditable", "controls", "coords", "crossorigin", "data-*", "datetime", "decoding", "default", "defer", "dir", "dirname", "disabled", "download", "draggable", "enctype", "for", "form", "formaction", "formenctype", "formmethod", "formnovalidate", "formtarget", "headers", "height", "hidden", "high", "href", "hreflang", "http-equiv", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "novalidate", "open", "optimum", "pattern", "placeholder", "playsinline", "poster", "preload", "readonly", "referrerpolicy", "rel", "required", "reversed", "role", "rows", "rowspan", "sandbox", "scope", "selected", "shape", "size", "sizes", "slot", "span", "spellcheck", "src", "srcdoc", "srclang", "srcset", "start", "step", "style", "tabindex", "target", "title", "translate", "type", "usemap", "value", "width", "wrap",
];

const cssProperties = [
  "align-content", "align-items", "align-self", "all", "animation", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-timing-function", "appearance", "aspect-ratio", "backdrop-filter", "backface-visibility", "background", "background-attachment", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-repeat", "background-size", "border", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-left", "border-radius", "border-right", "border-spacing", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-shadow", "box-sizing", "break-inside", "caption-side", "caret-color", "clear", "clip-path", "color", "column-count", "column-gap", "columns", "content", "cursor", "direction", "display", "fill", "filter", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "font", "font-family", "font-size", "font-style", "font-variant", "font-weight", "gap", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-gap", "grid-column-start", "grid-gap", "grid-row", "grid-row-end", "grid-row-gap", "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows", "height", "hyphens", "justify-content", "justify-items", "justify-self", "left", "letter-spacing", "line-height", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-block", "margin-bottom", "margin-inline", "margin-left", "margin-right", "margin-top", "max-height", "max-width", "min-height", "min-width", "object-fit", "object-position", "opacity", "order", "outline", "outline-offset", "overflow", "overflow-wrap", "overflow-x", "overflow-y", "padding", "padding-block", "padding-bottom", "padding-inline", "padding-left", "padding-right", "padding-top", "place-content", "place-items", "place-self", "pointer-events", "position", "resize", "right", "scroll-behavior", "stroke", "tab-size", "table-layout", "text-align", "text-decoration", "text-indent", "text-overflow", "text-shadow", "text-transform", "top", "transform", "transform-origin", "transition", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "user-select", "vertical-align", "visibility", "white-space", "widows", "width", "word-break", "word-spacing", "word-wrap", "z-index",
];

const cssValues = [
  "absolute", "auto", "baseline", "block", "bold", "border-box", "both", "center", "column", "contain", "cover", "dashed", "ease", "ease-in", "ease-in-out", "ease-out", "fixed", "flex", "forwards", "grid", "hidden", "inherit", "inline", "inline-block", "inline-flex", "italic", "left", "linear", "none", "nowrap", "pointer", "relative", "repeat", "round", "scroll", "separate", "solid", "space-around", "space-between", "space-evenly", "stretch", "top", "transparent", "uppercase", "visible", "wrap", "wrap-reverse", "var", "calc", "rgb", "rgba", "hsl", "hsla", "url",
];

const htmlVoidTags = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr",
]);

function autoCloseHtmlTag(value, cursor) {
  if (value[cursor - 1] !== ">") {
    return null;
  }

  const beforeCursor = value.slice(0, cursor);
  const openingTag = beforeCursor.match(/<([a-z][\w:-]*)(?:\s[^<>]*)?>$/i);

  if (!openingTag) {
    return null;
  }

  const tagName = openingTag[1];

  if (htmlVoidTags.has(tagName.toLowerCase()) || /\/\s*>$/.test(openingTag[0])) {
    return null;
  }

  const followingText = value.slice(cursor);

  if (new RegExp(`^<\\/${tagName}>`, "i").test(followingText)) {
    return null;
  }

  const closingTag = `</${tagName}>`;
  return {
    value: `${beforeCursor}${closingTag}${followingText}`,
    cursor,
  };
}

function autoCloseCssBlock(value, cursor) {
  if (value[cursor - 1] !== "{") {
    return null;
  }

  const beforeCursor = value.slice(0, cursor);
  const lineStart = beforeCursor.lastIndexOf("\n") + 1;
  const currentIndent = beforeCursor.slice(lineStart).match(/^\s*/)?.[0] || "";
  const followingText = value.slice(cursor);

  if (/^\s*}/.test(followingText)) {
    return null;
  }

  const contentIndent = `${currentIndent}  `;
  const insertedText = `\n${contentIndent}\n${currentIndent}`;

  return {
    value: `${beforeCursor}${insertedText}}${followingText}`,
    cursor: cursor + 1 + contentIndent.length,
  };
}

function autoIndentCssLine(value, cursor) {
  if (value[cursor - 1] !== "\n" || value[cursor] === " " || value[cursor] === "\t") {
    return null;
  }

  const beforeCursor = value.slice(0, cursor);
  const currentLineStart = beforeCursor.length - 1;
  const previousLineStart = beforeCursor.lastIndexOf("\n", currentLineStart - 1) + 1;
  const previousLine = beforeCursor.slice(previousLineStart, currentLineStart);
  const currentIndent = previousLine.match(/^\s*/)?.[0] || "";
  const contentIndent = /\{\s*$/.test(previousLine) ? `${currentIndent}  ` : currentIndent;

  return {
    value: `${beforeCursor}${contentIndent}${value.slice(cursor)}`,
    cursor: cursor + contentIndent.length,
  };
}

function getCompletionContext(value, cursor, language) {
  const beforeCursor = value.slice(0, cursor);
  const lineStart = beforeCursor.lastIndexOf("\n") + 1;
  const line = beforeCursor.slice(lineStart);
  const lineNumber = beforeCursor.split("\n").length - 1;
  const wordMatch = line.match(/[\w-]*$/);
  const word = wordMatch?.[0] || "";
  const wordStart = cursor - word.length;

  if (language === "html") {
    const openTag = line.match(/<([\w-]*)$/);
    const insideTag = /<[^>]*$/.test(line);

    if (openTag) {
      return { items: htmlTags, kind: "tag", word, wordStart, lineNumber, column: line.length - word.length };
    }

    if (insideTag) {
      return { items: htmlAttributes, kind: "attribute", word, wordStart, lineNumber, column: line.length - word.length };
    }
  }

  if (language === "css") {
    const insideRule = /\{[^}]*$/.test(beforeCursor);
    const propertyContext = insideRule && /(?:^|[;{])\s*[\w-]*$/.test(line);
    const valueContext = insideRule && /[\w-]+\s*:\s*[\w-]*$/.test(line);

    if (valueContext) {
      return { items: cssValues, kind: "value", word, wordStart, lineNumber, column: line.length - word.length };
    }

    if (propertyContext) {
      return { items: cssProperties, kind: "property", word, wordStart, lineNumber, column: line.length - word.length };
    }
  }

  return null;
}

function tokenize(value, language) {
  const pattern = language === "html"
    ? /(<!--[\s\S]*?-->|<\/?[\w-]+|\/?\s*>|\s+[\w-]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)/g
    : /(\/\*[\s\S]*?\*\/|#[0-9a-fA-F]{3,8}\b|\b(?:var|calc|rgb|rgba|hsl|hsla)\b|[{}:;(),]|\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms)?\b)/g;
  const parts = [];
  let lastIndex = 0;

  for (const match of value.matchAll(pattern)) {
    if (match.index > lastIndex) {
      parts.push({ value: value.slice(lastIndex, match.index), type: "plain" });
    }

    const token = match[0];
    let type = "punctuation";

    if (language === "html") {
      if (token.startsWith("<!--")) {
        parts.push({ value: token, type: "comment" });
        lastIndex = match.index + token.length;
        continue;
      }

      const tagMatch = token.match(/^(<\/?)([\w-]+)$/);
      if (tagMatch) {
        parts.push({ value: tagMatch[1], type: "punctuation" });
        parts.push({ value: tagMatch[2], type: "tag" });
        lastIndex = match.index + token.length;
        continue;
      }

      type = token.includes("=") ? "attribute" : "punctuation";
    } else if (token.startsWith("/*")) {
      type = "comment";
    } else if (token.startsWith("#") || /^\d/.test(token)) {
      type = "value";
    } else if (/^[a-z]/.test(token)) {
      type = "function";
    }

    parts.push({ value: token, type });
    lastIndex = match.index + token.length;
  }

  if (lastIndex < value.length) {
    parts.push({ value: value.slice(lastIndex), type: "plain" });
  }

  return parts;
}

export default function CodeEditor({
  activeFile,
  value,
  onChange,
  onSelect,
  tabs,
  onReorder,
  onExpand,
}) {
  const sourceLines = value.split("\n");
  const language = activeFile.endsWith(".css") ? "css" : activeFile.endsWith(".html") ? "html" : null;
  const [draggedTab, setDraggedTab] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [visualLineCounts, setVisualLineCounts] = useState(() => sourceLines.map(() => 1));
  const viewportRef = useRef(null);
  const textareaRef = useRef(null);

  function updateCompletion(nextValue, cursor, force = false) {
    const context = getCompletionContext(nextValue, cursor, language);

    if (!context || (!force && !context.word)) {
      setCompletion(null);
      return;
    }

    const filteredItems = context.items.filter((item) => item.startsWith(context.word.toLowerCase()));
    setCompletion(filteredItems.length ? { ...context, items: filteredItems, selectedIndex: 0 } : null);
  }

  function applyCompletion(item) {
    if (!completion) {
      return;
    }

    const nextValue = `${value.slice(0, completion.wordStart)}${item}${value.slice(textareaRef.current?.selectionStart || value.length)}`;
    const nextCursor = completion.wordStart + item.length;
    onChange(nextValue);
    setCompletion(null);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(nextCursor, nextCursor);
    });
  }

  function handleEditorKeyDown(event) {
    const explicitTrigger = (event.metaKey || event.ctrlKey) && event.code === "Space";

    if (completion && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      setCompletion((current) => ({
        ...current,
        selectedIndex: (current.selectedIndex + (event.key === "ArrowDown" ? 1 : -1) + current.items.length) % current.items.length,
      }));
      return;
    }

    if (completion && (event.key === "Enter" || event.key === "Tab")) {
      event.preventDefault();
      applyCompletion(completion.items[completion.selectedIndex]);
      return;
    }

    if (event.key === "Escape") {
      setCompletion(null);
      return;
    }

    if (explicitTrigger) {
      event.preventDefault();
      updateCompletion(value, textareaRef.current?.selectionStart || value.length, true);
    }
  }

  useLayoutEffect(() => {
    function measureWrappedLines() {
      const measure = viewportRef.current?.querySelector("[data-line-measure]");

      if (!measure) {
        return;
      }

      const lineHeight = parseFloat(getComputedStyle(measure).lineHeight);
      const nextCounts = Array.from(measure.children, (line) => Math.max(1, Math.round(line.getBoundingClientRect().height / lineHeight)));
      setVisualLineCounts(nextCounts);
    }

    measureWrappedLines();
    const observer = new ResizeObserver(measureWrappedLines);
    const viewport = viewportRef.current;

    if (viewport) {
      observer.observe(viewport);
    }

    return () => observer.disconnect();
  }, [value]);

  function handleDragOver(event, targetTab) {
    event.preventDefault();

    if (!draggedTab || draggedTab === targetTab) {
      setDropTarget(null);
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const position = event.clientX < bounds.left + bounds.width / 2 ? "before" : "after";
    setDropTarget({ position, tab: targetTab });
  }

  function handleDrop(targetTab) {
    if (!draggedTab || draggedTab === targetTab) {
      setDraggedTab(null);
      setDropTarget(null);
      return;
    }

    const nextTabs = [...tabs];
    const draggedIndex = nextTabs.indexOf(draggedTab);
    nextTabs.splice(draggedIndex, 1);
    const targetIndex = nextTabs.indexOf(targetTab);
    const insertionIndex = targetIndex + (dropTarget?.position === "after" ? 1 : 0);
    nextTabs.splice(insertionIndex, 0, draggedTab);
    onReorder(nextTabs);
    setDraggedTab(null);
    setDropTarget(null);
  }

  return (
    <section className={styles.codeEditor} aria-label={`${activeFile} editor`}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <div className={styles.tabSlot} key={tab}>
            {dropTarget?.tab === tab && dropTarget.position === "before" && (
              <span className={styles.dropIndicator} aria-hidden="true" />
            )}
            <button
              className={`type-body-bold ${styles.tab} ${activeFile === tab ? styles.activeTab : ""} ${draggedTab === tab ? styles.dragging : ""}`}
              type="button"
              onClick={() => onSelect(tab)}
              draggable="true"
              onDragStart={() => {
                setDraggedTab(tab);
                setDropTarget(null);
              }}
              onDragOver={(event) => handleDragOver(event, tab)}
              onDrop={() => handleDrop(tab)}
              onDragEnd={() => {
                setDraggedTab(null);
                setDropTarget(null);
              }}
            >
              {tab}
            </button>
            {dropTarget?.tab === tab && dropTarget.position === "after" && (
              <span className={styles.dropIndicator} aria-hidden="true" />
            )}
          </div>
        ))}
        <button className={styles.expandButton} type="button" aria-label="Expand editor" onClick={onExpand}>
          <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
        </button>
      </div>
      <div className={styles.editorBody}>
        <div className={`type-code ${styles.lineNumbers}`} aria-hidden="true">
          {sourceLines.map((line, index) => (
            <span className={styles.lineNumberRow} key={index}>
              {index + 1}
              {Array.from({ length: (visualLineCounts[index] || 1) - 1 }, (_, wrapIndex) => (
                <span className={styles.wrappedLine} key={wrapIndex} />
              ))}
            </span>
          ))}
        </div>
        <div className={styles.codeViewport} ref={viewportRef}>
          <div className={`type-code ${styles.lineMeasure}`} data-line-measure aria-hidden="true">
            {sourceLines.map((line, index) => <div key={index}>{line || " "}</div>)}
          </div>
          {language && (
            <pre className={`type-code ${styles.highlightedCode}`} aria-hidden="true">
              {tokenize(value, language).map((token, index) => (
                <span className={styles[`token${token.type[0].toUpperCase()}${token.type.slice(1)}`]} key={index}>
                  {token.value}
                </span>
              ))}
              {"\n"}
            </pre>
          )}
          <textarea
            ref={textareaRef}
            className={`type-code ${styles.textarea} ${language ? styles.highlightedTextarea : ""}`}
            value={value}
            onChange={(event) => {
              const cursor = event.target.selectionStart;
              const autoClosed = language === "html" ? autoCloseHtmlTag(event.target.value, cursor) : null;
              const autoClosedCss = language === "css" ? autoCloseCssBlock(event.target.value, cursor) : null;
              const autoIndentedCss = language === "css" && event.nativeEvent.inputType === "insertLineBreak"
                ? autoIndentCssLine(event.target.value, cursor)
                : null;

              if (autoClosed) {
                onChange(autoClosed.value);
                updateCompletion(autoClosed.value, autoClosed.cursor);
                requestAnimationFrame(() => {
                  textareaRef.current?.setSelectionRange(autoClosed.cursor, autoClosed.cursor);
                });
                return;
              }

              if (autoClosedCss) {
                onChange(autoClosedCss.value);
                updateCompletion(autoClosedCss.value, autoClosedCss.cursor);
                requestAnimationFrame(() => {
                  textareaRef.current?.setSelectionRange(autoClosedCss.cursor, autoClosedCss.cursor);
                });
                return;
              }

              if (autoIndentedCss) {
                onChange(autoIndentedCss.value);
                updateCompletion(autoIndentedCss.value, autoIndentedCss.cursor);
                requestAnimationFrame(() => {
                  textareaRef.current?.setSelectionRange(autoIndentedCss.cursor, autoIndentedCss.cursor);
                });
                return;
              }

              onChange(event.target.value);
              updateCompletion(event.target.value, cursor);
            }}
            onKeyDown={handleEditorKeyDown}
            onClick={() => setCompletion(null)}
            onScroll={(event) => {
              const viewport = event.currentTarget.parentElement;
              const highlight = viewport?.querySelector("pre");
              const lineNumbers = viewport?.previousElementSibling;

              if (highlight) {
                highlight.scrollTop = event.currentTarget.scrollTop;
                highlight.scrollLeft = event.currentTarget.scrollLeft;
              }

              if (lineNumbers) {
                lineNumbers.scrollTop = event.currentTarget.scrollTop;
              }
            }}
            wrap="soft"
            spellCheck="false"
            aria-label={`Edit ${activeFile}`}
          />
          {completion && (
            <div
              className={styles.completionMenu}
              role="listbox"
              aria-label={`${completion.kind} completions`}
              style={{ "--completion-top": `${completion.lineNumber * 1.45}em`, "--completion-left": `${completion.column}ch` }}
            >
              {completion.items.map((item, index) => (
                <button
                  className={`${styles.completionItem} ${index === completion.selectedIndex ? styles.selectedCompletion : ""}`}
                  key={item}
                  type="button"
                  role="option"
                  aria-selected={index === completion.selectedIndex}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setCompletion((current) => ({ ...current, selectedIndex: index }))}
                  onClick={() => applyCompletion(item)}
                >
                  <span>{item}</span>
                  <span className={styles.completionKind}>{completion.kind}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}