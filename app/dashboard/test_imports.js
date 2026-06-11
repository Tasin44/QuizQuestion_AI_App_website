const React = require('react');
try {
  const ReactMarkdown = require('react-markdown');
  const remarkMath = require('remark-math');
  const rehypeKatex = require('rehype-katex');
  console.log("SUCCESS: All packages imported successfully!");
} catch (err) {
  console.error("ERROR during import:", err);
}
