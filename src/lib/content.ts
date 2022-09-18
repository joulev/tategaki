import type { Character, RawParagraph } from "$lib/types";
import content from "$lib/content.json";

export const title = content.title;

export const rawParagraphs = content.raw.split("\n").map((p) => {
  const characters: RawParagraph = [];
  for (let i = 0; i < p.length; i++) {
    const cur: Character = { char: p[i], furigana: null };
    if (i < p.length - 1 && p[i + 1] === content.markers.furigana.start) {
      const end = p.indexOf(content.markers.furigana.end, i + 2);
      cur.furigana = p.substring(i + 2, end);
      i = end;
    }
    characters.push(cur);
  }
  return characters;
});

/* Example: this is paragraphs[4]
[
  { char: 'あ', furigana: null },
  { char: 'あ', furigana: null },
  { char: '、', furigana: null },
  { char: '妹', furigana: 'いもうと' },
  { char: 'と', furigana: null },
  { char: '会', furigana: 'あ' },
  { char: 'い', furigana: null },
  { char: 'た', furigana: null },
  { char: 'い', furigana: null },
  { char: 'ん', furigana: null },
  { char: 'で', furigana: null },
  { char: 'す', furigana: null },
  { char: '！', furigana: null }
]
*/
