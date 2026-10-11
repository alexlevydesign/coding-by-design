import { lessons } from "../../content/lessons";
import styles from "./IdeShell.module.css";

function renderCodeLine(line) {
  return line.split(/(<!--|-->|<\/?[^>]+>)/g).map((part, index) => {
    if (/^(<!--|-->|<\/?[^>]+>)$/.test(part)) {
      return <span className={styles.lessonTag} key={`${part}-${index}`}>{part}</span>;
    }

    return part;
  });
}

export default function LessonsPanel({ onShowFiles }) {
  return (
    <aside className={`${styles.fileBrowser} ${styles.lessonsPanel}`} aria-label="Lessons">
      <div className={styles.lessonContent}>
        {lessons.map((lesson) => (
          <article key={lesson.title}>
            <h1 className={`type-page-heading ${styles.lessonHeading}`}>{lesson.title}</h1>
            {lesson.sections.map((section) => (
              <section className={styles.lessonSection} key={section.title}>
                <h2 className={`type-section-heading ${styles.lessonSectionHeading}`}>
                  {section.title} <span className={styles.lessonElement}>{section.element}</span>
                </h2>
                <p className="type-body">{section.description}</p>
                <pre className={`type-code ${styles.lessonCode}`}>
                  {section.code.lines.map((line, index) => (
                    <span className={styles.lessonCodeLine} key={`${section.title}-${index}`}>
                      <span className={styles.lessonLineNumber}>{index + 1}</span>
                      <span>{renderCodeLine(line)}</span>
                      {index < section.code.lines.length - 1 && "\n"}
                    </span>
                  ))}
                </pre>
              </section>
            ))}
          </article>
        ))}
      </div>
    </aside>
  );
}