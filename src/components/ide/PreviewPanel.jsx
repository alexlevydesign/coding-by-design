import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
import styles from "./IdeShell.module.css";

export default function PreviewPanel({ document, onExpand }) {
  return (
    <section className={styles.previewPanel} aria-label="Browser preview">
      <div className={styles.previewToolbar}>
        <button className={styles.expandButton} type="button" aria-label="Expand preview" onClick={onExpand}>
          <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
        </button>
      </div>
      <iframe className={styles.previewFrame} srcDoc={document} title="Website preview" />
    </section>
  );
}