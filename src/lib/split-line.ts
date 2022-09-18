import type { Line, Paragraph, RawParagraph } from "$lib/types";

export default function splitLine(paragraph: RawParagraph, height: number): Paragraph {
  const lines: Paragraph = [];
  let line: Line = [{ char: " ", furigana: null }];
  for (const char of paragraph) {
    line.push(char);
    if (line.length === height) {
      lines.push(line);
      line = [];
    }
  }
  lines.push(line);
  return lines;
}
