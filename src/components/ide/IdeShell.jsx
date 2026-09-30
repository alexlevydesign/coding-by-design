"use client";

import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faExpand,
  faPlus,
  faBars,
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

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={`type-body ${styles.logo}`}>logo goes here</p>
      </header>

      <div className={styles.panels}>
        <section className={styles.editorPanel} aria-label="Code editor">
          <div className={styles.editorToolbar}>
            <button className={styles.iconButton} type="button" aria-label="Open menu">
              <FontAwesomeIcon icon={faBars} />
            </button>
            <span className={`type-body-bold ${styles.panelTitle}`}>Files</span>
            <button className={`${styles.iconButton} ${styles.addButton}`} type="button" aria-label="Add file">
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <FileBrowser activeFile={activeFile} onSelect={setActiveFile} />
          <CodeEditor
            activeFile={activeFile}
            value={files[activeFile]}
            onChange={updateFile}
            onSelect={setActiveFile}
            tabs={tabs}
            onReorder={setTabs}
          />
        </section>

        <PreviewPanel document={previewDocument} />
      </div>
    </main>
  );
}