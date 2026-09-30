"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faBars,
  faFile,
  faFolderPlus,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import FileBrowser from "./FileBrowser";
import CodeEditor from "./CodeEditor";
import PreviewPanel from "./PreviewPanel";
import styles from "./IdeShell.module.css";

const initialFiles = {
  "index.html": `<h1>Welcome to my portfolio site!</h1>\n\n<h2>Projects</h2>\n\n<h3>Coffee shop redesign</h3>\n\n<p>I redesigned a coffee shop brand across print and digital mediums, increasing sales by 20%</p>`,
  "style.css": `h1 {\n  font-size: 2rem;\n}\n\nh2 {\n  margin-top: 2rem;\n}`,
  "contact.html": `<h1>Contact</h1>\n\n<p>Let's work together.</p>`,
};

const initialTabs = ["index.html", "style.css", "contact.html"];

export default function IdeShell() {
  const [files, setFiles] = useState(initialFiles);
  const [tabs, setTabs] = useState(initialTabs);
  const [activeFile, setActiveFile] = useState("index.html");
  const [fileBrowserOpen, setFileBrowserOpen] = useState(true);
  const [expandedPanel, setExpandedPanel] = useState(null);
  const [folders, setFolders] = useState([]);
  const [folderFiles, setFolderFiles] = useState({});
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [editorRatio, setEditorRatio] = useState(0.62);
  const [isResizing, setIsResizing] = useState(false);
  const panelsRef = useRef(null);
  const uploadInputRef = useRef(null);

  useEffect(() => {
    if (!isResizing) {
      return undefined;
    }

    function handlePointerMove(event) {
      const bounds = panelsRef.current?.getBoundingClientRect();

      if (!bounds) {
        return;
      }

      const nextRatio = (event.clientX - bounds.left) / bounds.width;
      setEditorRatio(Math.min(Math.max(nextRatio, 0.3), 0.7));
    }

    function handlePointerUp() {
      setIsResizing(false);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isResizing]);

  const previewHtml = activeFile.endsWith(".html")
    ? files[activeFile]
    : files["index.html"];

  const previewDocument = useMemo(
    () => `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><style>${files["style.css"]}</style></head><body>${previewHtml}</body></html>`,
    [files, previewHtml],
  );

  function updateFile(value) {
    setFiles((currentFiles) => ({ ...currentFiles, [activeFile]: value }));
  }

  function createFile() {
    const fileName = window.prompt("File name");

    if (!fileName?.trim() || Object.hasOwn(files, fileName.trim())) {
      return;
    }

    const name = fileName.trim();
    setFiles((currentFiles) => ({ ...currentFiles, [name]: "" }));
    setTabs((currentTabs) => [...currentTabs, name]);
    setActiveFile(name);
    setIsAddMenuOpen(false);
  }

  function createFolder() {
    const folderName = window.prompt("Folder name");

    if (!folderName?.trim() || folders.includes(folderName.trim())) {
      return;
    }

    setFolders((currentFolders) => [...currentFolders, folderName.trim()]);
    setFolderFiles((currentFolderFiles) => ({ ...currentFolderFiles, [folderName.trim()]: [] }));
    setIsAddMenuOpen(false);
  }

  function moveFileToFolder(fileName, folderName) {
    setFolderFiles((currentFolderFiles) => {
      const nextFolderFiles = Object.fromEntries(
        Object.entries(currentFolderFiles).map(([folder, folderContents]) => [
          folder,
          folderContents.filter((file) => file !== fileName),
        ]),
      );

      if (folderName) {
        nextFolderFiles[folderName] = [...(nextFolderFiles[folderName] || []), fileName];
      }
      return nextFolderFiles;
    });
  }

  async function uploadFile(event) {
    const [file] = event.target.files;

    if (!file) {
      return;
    }

    const name = file.name;
    const contents = await file.text();
    setFiles((currentFiles) => ({ ...currentFiles, [name]: contents }));
    setTabs((currentTabs) => currentTabs.includes(name) ? currentTabs : [...currentTabs, name]);
    setActiveFile(name);
    setIsAddMenuOpen(false);
    event.target.value = "";
  }

  function toggleExpandedPanel(panel) {
    setExpandedPanel((currentPanel) => (currentPanel === panel ? null : panel));
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={`type-body ${styles.logo}`}>logo goes here</p>
      </header>

      <div
        className={`${styles.panels} ${isResizing ? styles.resizing : ""} ${expandedPanel ? styles[`${expandedPanel}Expanded`] : ""}`}
        ref={panelsRef}
        style={{
          "--editor-track": `${editorRatio}fr`,
          "--preview-track": `${1 - editorRatio}fr`,
        }}
      >
        <section
          className={`${styles.editorPanel} ${!fileBrowserOpen ? styles.fileBrowserClosed : ""}`}
          aria-label="Code editor"
        >
          <div className={styles.editorToolbar}>
            <button
              className={styles.iconButton}
              type="button"
              aria-label={fileBrowserOpen ? "Close file browser" : "Open file browser"}
              aria-expanded={fileBrowserOpen}
              onClick={() => setFileBrowserOpen((isOpen) => !isOpen)}
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            <span className={`type-body-bold ${styles.panelTitle}`}>Files</span>
            <button
              className={`${styles.iconButton} ${styles.addButton}`}
              type="button"
              aria-label="Add file"
              aria-expanded={isAddMenuOpen}
              onClick={() => setIsAddMenuOpen((isOpen) => !isOpen)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
            {isAddMenuOpen && (
              <div className={styles.addMenu} role="menu" aria-label="Create or upload">
                <button type="button" role="menuitem" onClick={createFile}>
                  <FontAwesomeIcon icon={faFile} />
                  <span>New file</span>
                </button>
                <button type="button" role="menuitem" onClick={createFolder}>
                  <FontAwesomeIcon icon={faFolderPlus} />
                  <span>New folder</span>
                </button>
                <button type="button" role="menuitem" onClick={() => uploadInputRef.current?.click()}>
                  <FontAwesomeIcon icon={faUpload} />
                  <span>Upload file</span>
                </button>
                <input
                  ref={uploadInputRef}
                  className={styles.hiddenInput}
                  type="file"
                  onChange={uploadFile}
                  aria-label="Upload file"
                />
              </div>
            )}
          </div>
          <FileBrowser
            activeFile={activeFile}
            onSelect={setActiveFile}
            files={Object.keys(files)}
            folders={folders}
            folderFiles={folderFiles}
            onMoveFile={moveFileToFolder}
          />
          <CodeEditor
            activeFile={activeFile}
            value={files[activeFile]}
            onChange={updateFile}
            onSelect={setActiveFile}
            tabs={tabs}
            onReorder={setTabs}
            onExpand={() => toggleExpandedPanel("editor")}
          />
        </section>

        <div
          className={styles.resizeHandle}
          role="separator"
          aria-label="Resize editor and preview panels"
          aria-orientation="vertical"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setIsResizing(true);
          }}
        />

        <PreviewPanel
          document={previewDocument}
          onExpand={() => toggleExpandedPanel("preview")}
        />
      </div>
    </main>
  );
}