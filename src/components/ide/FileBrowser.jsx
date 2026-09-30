import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faCode,
  faFolder,
  faImage,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./IdeShell.module.css";

export default function FileBrowser({ activeFile, onSelect, files, folders, folderFiles, onMoveFile }) {
  const [draggedFile, setDraggedFile] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const nestedFiles = Object.values(folderFiles).flat();
  const topLevelFiles = files.filter((file) => !nestedFiles.includes(file));

  function handleDrop(folder) {
    if (!draggedFile) {
      return;
    }

    onMoveFile(draggedFile, folder);
    setDraggedFile(null);
    setDropTarget(null);
  }

  function renderFile(file, nested = false) {
    return (
      <button
        className={`${styles.fileRow} ${nested ? styles.nestedFile : ""} ${activeFile === file ? styles.selectedFile : ""}`}
        key={`${nested ? "nested" : "file"}:${file}`}
        type="button"
        draggable="true"
        onClick={() => onSelect(file)}
        onDragStart={() => setDraggedFile(file)}
        onDragEnd={() => {
          setDraggedFile(null);
          setDropTarget(null);
        }}
      >
        <FontAwesomeIcon icon={faCode} />
        <span>{file}</span>
      </button>
    );
  }

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
      <div
        className={`${styles.projectFiles} ${dropTarget === "root" ? styles.dropTarget : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDropTarget("root");
        }}
        onDrop={() => handleDrop(null)}
      >
        {folders.map((folder) => (
          <div
            className={`${styles.folderGroup} ${dropTarget === folder ? styles.dropTarget : ""}`}
            key={`folder:${folder}`}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setDropTarget(folder);
            }}
            onDrop={(event) => {
              event.stopPropagation();
              handleDrop(folder);
            }}
          >
            <span className={styles.fileRow}>
              <FontAwesomeIcon icon={faFolder} />
              <span>{folder}</span>
            </span>
            <div className={styles.nestedFiles}>
              {(folderFiles[folder] || []).map((file) => renderFile(file, true))}
            </div>
          </div>
        ))}
        <div className={styles.topLevelFiles}>
          {topLevelFiles.map((file) => renderFile(file))}
        </div>
      </div>
    </nav>
  );
}