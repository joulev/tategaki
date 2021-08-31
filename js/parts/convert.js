/**
 * parts/convert.js
 * Convert all half-width characters to full-width characters
 */

"use strict";

/**
 * Function dec_code()
 * Get the decimal value of codePoint of a for easier conversion
 * 
 * @param {string} a The input _character_
 * @returns Decimal value of codePoint of a
 */
var dec_code = (a) => a.codePointAt(0);

/**
 * Function convert()
 * Convert all half-width characters in the string to full-width characters.
 * 
 * Currently this only supports conversion of basic characters, namely numbers,
 * Latin characters, and (planned) some usually-used punctuations.
 * However basically every half-width characters can be added this way.
 * 
 * @param {string} s The input string
 * @returns The string after the conversion process
 */
export function convert(s) {
    var convert_s = "";
    for (let i = 0; i < s.length; i++) {
        let code_point = dec_code(s[i]);
        // Unicode table is more generous than I expected: all are aligned perfectly
        if (code_point >= dec_code("!") && code_point <= dec_code("~")) {
            convert_s += String.fromCodePoint(dec_code("！") + (code_point - dec_code("!")));
            continue;
        }
        // Space
        if (s[i] == " ") {
            convert_s += "　";
            continue;
        }
        // Otherwise, it should already be a full-width character
        convert_s += s[i];
    }
    return convert_s;
}