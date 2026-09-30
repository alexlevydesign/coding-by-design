import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import styles from "./IdeShell.module.css";

export default function CodeEditor({ activeFile, value, onChange }) {
  const lineCount = Math.max(value.split("\n").length, 1);
  const tabs = ["index.html", "style.css", "contact.html"];

  return (
    <section className={styles.codeEditor} aria-label={`${activeFile} editor`}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            className={`type-body-bold ${styles.tab} ${activeFile === tab ? styles.activeTab : ""}`}
            key={tab}
            type="button"
          >
            {tab}
          </button>
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