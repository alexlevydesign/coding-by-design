import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import styles from "./IdeShell.module.css";

export default function CodeEditor({
  activeFile,
  value,
  onChange,
  onSelect,
  tabs,
  onReorder,
}) {
  const lineCount = Math.max(value.split("\n").length, 1);
  const [draggedTab, setDraggedTab] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);

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
        <button className={styles.expandButton} type="button" aria-label="Expand editor">
          <FontAwesomeIcon icon={faExpand} />
        </button>
      </div>
      <div className={styles.editorBody}>
        <div className={`type-code ${styles.lineNumbers}`} aria-hidden="true">
          {Array.from({ length: lineCount }, (_, index) => <span key={index}>{index + 1}</span>)}
        </div>
        <textarea
          className={`type-code ${styles.textarea}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck="false"
          aria-label={`Edit ${activeFile}`}
        />
      </div>
    </section>
  );
}