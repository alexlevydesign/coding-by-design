import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import styles from "./IdeShell.module.css";

export default function PreviewPanel({ document }) {
  return (
    <section className={styles.previewPanel} aria-label="Browser preview">
      <div className={styles.previewToolbar}>
        <button className={styles.expandButton} type="button" aria-label="Expand preview">
          <FontAwesomeIcon icon={faExpand} />
        </button>
      </div>
      <iframe className={styles.previewFrame} srcDoc={document} title="Website preview" />
    </section>
  );
}