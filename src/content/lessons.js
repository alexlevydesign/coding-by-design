export const lessons = [
  {
    id: "adding-text",
    title: "Adding text",
    sections: [
      {
        id: "headings",
        type: "explanation",
        title: "Headings",
        element: "<h1> - <h6>",
        description: "Heading elements are used to create titles and organize content on a webpage. They help define a clear structure by indicating the importance of each section. There are six levels of headings, and you can think of them as similar to chapter titles, section headers, and sub-sections in a book.",
        code: {
          language: "html",
          lines: [
            "<h1>Today's news</h1>",
            "<h2>Sports</h2>",
            "<h3>Football</h3>",
            "<h4>Late touchdown seals win</h4>",
            "<h3>Basketball</h3>",
            "<h4>The costly free throw</h4>",
          ],
        },
      },
      {
        id: "paragraphs",
        type: "explanation",
        title: "Paragraphs",
        element: "<p>",
        description: "Paragraph elements (aka <p> tags) are used to create blocks of text. Despite the name, they don't actually need to be a full paragraph (you can have a <p> tag with one sentence if you want).",
        code: {
          language: "html",
          lines: [
            "<p>My favorite sports are football,",
            "   basketball, baseball,",
            "   and soccer.</p>",
          ],
        },
      },
      {
        id: "comments",
        type: "explanation",
        title: "Comments",
        element: "<!-- -->",
        description: "Comments are useful if you want to leave notes for yourself or other people reading the code without being shown on the actual site. You can also use comments to disable chunks of code, which can be useful for testing different layouts and content.",
        code: {
          language: "html",
          lines: [
            "<!-- This is a comment.",
            "Comments can span multiple lines.",
            "-->",
          ],
        },
      },
    ],
  },
];
