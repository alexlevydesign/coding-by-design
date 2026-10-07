import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpRightAndDownLeftFromCenter } from "@fortawesome/free-solid-svg-icons";
import styles from "./IdeShell.module.css";

export default function PreviewPanel({ document, onExpand }) {
  const iframeRef = useRef(null);
  const scrollbarRef = useRef(null);
  const [scrollbar, setScrollbar] = useState({ height: 0, top: 0, visible: false });

  useEffect(() => {
    const iframe = iframeRef.current;

    if (!iframe) {
      return undefined;
    }

    function syncScrollbar() {
      const previewDocument = iframe.contentDocument;
      const root = previewDocument?.documentElement;
      const body = previewDocument?.body;
      const viewportHeight = root?.clientHeight || iframe.clientHeight;
      const scrollHeight = Math.max(root?.scrollHeight || 0, body?.scrollHeight || 0);
      const trackHeight = scrollbarRef.current?.clientHeight || iframe.clientHeight;

      if (!viewportHeight || scrollHeight <= viewportHeight || !trackHeight) {
        setScrollbar({ height: 0, top: 0, visible: false });
        return;
      }

      const height = Math.max(24, (trackHeight * viewportHeight) / scrollHeight);
      const maxTop = trackHeight - height;
      const maxScrollTop = scrollHeight - viewportHeight;
      const scrollTop = iframe.contentWindow?.scrollY || root?.scrollTop || body?.scrollTop || 0;

      setScrollbar({
        height,
        top: maxScrollTop ? (scrollTop / maxScrollTop) * maxTop : 0,
        visible: true,
      });
    }

    function handleLoad() {
      iframe.contentWindow?.addEventListener("scroll", syncScrollbar);
      syncScrollbar();
    }

    iframe.addEventListener("load", handleLoad);
    window.addEventListener("resize", syncScrollbar);

    return () => {
      iframe.removeEventListener("load", handleLoad);
      iframe.contentWindow?.removeEventListener("scroll", syncScrollbar);
      window.removeEventListener("resize", syncScrollbar);
    };
  }, [document]);

  return (
    <section className={styles.previewPanel} aria-label="Browser preview">
      <div className={styles.previewToolbar}>
        <button className={styles.expandButton} type="button" aria-label="Expand preview" onClick={onExpand}>
          <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} />
        </button>
      </div>
      <div className={styles.previewViewport}>
        <iframe ref={iframeRef} className={styles.previewFrame} srcDoc={document} title="Website preview" />
        <div ref={scrollbarRef} className={styles.previewScrollbar} aria-hidden="true">
          <div
            className={styles.previewScrollbarThumb}
            style={{ height: `${scrollbar.height}px`, transform: `translateY(${scrollbar.top}px)`, visibility: scrollbar.visible ? "visible" : "hidden" }}
          />
        </div>
      </div>
    </section>
  );
}