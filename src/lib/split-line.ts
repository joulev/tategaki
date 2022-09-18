import type { Line, Paragraph, RawParagraph } from "$lib/types";

const START_CHARS = "「『［【〔｛〈《（"; // characters that should be shifted down
const END_CHARS = "」』］】〕｝〉》）。、"; // characters that should be shifted up

export default function splitLine(paragraph: RawParagraph, height: number): Paragraph {
  const lines: Paragraph = [];
  let line: Line = [{ char: " ", furigana: null }];
  for (const char of paragraph) {
    if (line.length + 1 === height && START_CHARS.includes(char.char)) {
      lines.push(line);
      line = [char];
      continue;
    }
    line.push(char);
    if (line.length === height) {
      lines.push(line);
      line = [];
    }
  }
  lines.push(line);
  return lines;
}
