import { useLayoutEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
import styles from "./IdeShell.module.css";

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
  const [visualLineCounts, setVisualLineCounts] = useState(() => sourceLines.map(() => 1));
  const viewportRef = useRef(null);

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
            className={`type-code ${styles.textarea} ${language ? styles.highlightedTextarea : ""}`}
            value={value}
            onChange={(event) => onChange(event.target.value)}
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
        </div>
      </div>
    </section>
  );
}