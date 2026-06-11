const testStr = "Block: \\\\[ \\\\Delta S \\\\] and Inline: \\\\( x \\\\).";
console.log("Original:", testStr);

// Correct replacement using $$$$ for double dollar signs, and $$ for single dollar signs
const corrected = testStr
  .replace(/\\+\[/g, "$$$$\n")
  .replace(/\\+\]/g, "\n$$$$")
  .replace(/\\+\(/g, "$$")
  .replace(/\\+\)/g, "$$");

console.log("Corrected:", corrected);
