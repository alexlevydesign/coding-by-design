import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";
import styles from "./IdeShell.module.css";

const lessons = [
  {
    title: "Adding text",
    sections: [
      {
        title: "Headings",
        element: "<h1> - <h6>",
        description: "Heading elements are used to create titles and organize content on a webpage. They help define a clear structure by indicating the importance of each section. There are six levels of headings, and you can think of them as similar to chapter titles, section headers, and sub-sections in a book.",
        code: ["<h1>Today's news</h1>", "<h2>Sports</h2>", "<h3>Football</h3>", "<h4>Late touchdown seals win</h4>", "<h3>Basketball</h3>", "<h4>The costly free throw</h4>"],
      },
      {
        title: "Paragraphs",
        element: "<p>",
        description: "Paragraph elements (aka <p> tags) are used to create blocks of text. Despite the name, they don't actually need to be a full paragraph (you can have a <p> tag with one sentence if you want).",
        code: ["<p>My favorite sports are football,", "   basketball, baseball,", "   and soccer.</p>"],
      },
      {
        title: "Comments",
        element: "<!-- -->",
        description: "Comments are useful if you want to leave notes for yourself or other people reading the code without being shown on the actual site. You can also use comments to disable chunks of code, which can be useful for testing different layouts or content.",
        code: ["<!-- This is a comment.", "Comments can span multiple lines.", "-->"],
      },
    ],
  },
];

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
                  {section.code.map((line, index) => (
                    <span className={styles.lessonCodeLine} key={`${section.title}-${index}`}>
                      <span className={styles.lessonLineNumber}>{index + 1}</span>
                      <span>{renderCodeLine(line)}</span>
                      {index < section.code.length - 1 && "\n"}
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