import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCode,
  faImage,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./IdeShell.module.css";

const files = [
  { name: "contact.html", icon: faCode },
  { name: "index.html", icon: faCode },
  { name: "style.css", icon: faCode },
];

export default function FileBrowser({ activeFile, onSelect }) {
  return (
    <nav className={`type-code ${styles.fileBrowser}`} aria-label="Project files">
      <button className={styles.folder} type="button">
        <FontAwesomeIcon icon={faChevronDown} />
        <span>Assets</span>
      </button>
      <div className={styles.assetFiles}>
        <span className={styles.fileRow}>
          <FontAwesomeIcon icon={faImage} />
          <span>headshot.jpeg</span>
        </span>
        <span className={styles.fileRow}>
          <FontAwesomeIcon icon={faImage} />
          <span>thumbnail.jpeg</span>
        </span>
        <span className={styles.fileRow}>
          <FontAwesomeIcon icon={faPlay} />
          <span>animation.mp4</span>
        </span>
      </div>
      <div className={styles.projectFiles}>
        {files.map((file) => (
          <button
            className={`${styles.fileRow} ${activeFile === file.name ? styles.selectedFile : ""}`}
            key={file.name}
            type="button"
            onClick={() => onSelect(file.name)}
          >
            <FontAwesomeIcon icon={file.icon} />
            <span>{file.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}