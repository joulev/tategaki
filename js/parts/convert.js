/**
 * parts/convert.js
 * Convert all half-width characters to full-width characters
 */

"use strict";

/**
 * Function dec_code(): char -> number
 * Get the decimal value of codePoint of a for easier conversion
 * 
 * @param {string} a The input character
 * @returns Decimal value of codePoint of a
 */
var dec_code = (a) => a.codePointAt(0);

/**
 * Function convert(): char -> char
 * Convert the character to full-width characters.
 * 
 * Currently this only supports conversion of basic characters, namely numbers,
 * Latin characters, and (planned) some usually-used punctuations.
 * However basically every half-width characters can be added this way.
 * 
 * @param {string} char The input character
 * @returns The converted character
 */
export function convert(char) {
    let code_point = dec_code(char);
    if (char === "<" || char === ">")
        return char;
    // Unicode table is more generous than I expected: all are aligned perfectly
    if (code_point >= dec_code("!") && code_point <= dec_code("~"))
        return String.fromCodePoint(dec_code("！") + (code_point - dec_code("!")));
    // Space
    if (char === " ")
        return "　";
    // Otherwise, it should already be a full-width character
    return char;
}