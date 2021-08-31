"use strict";

import $ from "./parts/jquery.js";
import {convert} from "./parts/convert.js";

/**
 * Function set_container_height(): void -> void
 * Change height of container so that it is exactly a multiple of 23px
 */
function set_container_height() {
    //let container_height = $(".container-wrapper").height();
    let container_height = $(window).height() - 100;
    container_height = container_height - container_height % 23 - 1;
    $(".container-wrapper").height(container_height);
}

/**
 * Function check_display(): char -> string
 * Check whether it's necessary to add additional transformation/repositioning
 * to the div with CSS classes.
 * 
 * @param {string} char The input character for checking
 * @returns The <div> element with necessary classes added
 */
function check_display(char) {
    let start_chars = "「『［【〔｛〈《（"; // characters that should be shifted down
    let end_chars   = "」』］】〕｝〉》）。、"; // characters that should be shifted up
    for (let i = 0; i < start_chars.length; i++)
        if (char === start_chars[i]) return '<div class="tategaki-character tategaki-start">';
    for (let i = 0; i < end_chars.length; i++)
        if (char === end_chars[i]) return '<div class="tategaki-character tategaki-end">';
    // Normal characters INCLUDING NUMBERS: rotate the character
    // Thus, please write dates with kanji. Don't write dates with numbers in tategaki in
    // general, such writing style doesn't make sense to me.
    if ("！".codePointAt(0) <= char.codePointAt(0) && char.codePointAt(0) <= "～".codePointAt(0)) {
        return `<div class="tategaki-character tategaki-rotate"><span style="width: 0; content: 'ｐｈ'"></span>`;
    }
    // "Small" kana
    let small_kana = "ぁぃぅぇぉァィゥェォっッゃゅょャュョ";
    for (let i = 0; i < small_kana.length; i++)
        if (char === small_kana[i]) return '<div class="tategaki-character tategaki-small-kana">';
    // All normally
    return '<div class="tategaki-character tategaki-none">';
}

$(() => {
    // Convert text to full-width
    $(".container p").each(function () {
        let s = $(this).text();
        // A whitespace at the beginning
        let html = '<div class="tategaki-character">　</div>';
        for (let i = 0; i < s.length; i++) {
            let char = convert(s[i]);
            html += check_display(char) + char + "</div>";
        }
        $(this).html(html);
    });
    $(".container h1, .container h2, .container h3").each(function () {
        let s = $(this).text();
        // A whitespace at the beginning
        let html = "";
        for (let i = 0; i < s.length; i++) {
            let char = convert(s[i]);
            html += check_display(char) + char + "</div>";
        }
        $(this).html(html);
    });

    set_container_height();
    $(window).on("resize", set_container_height);

    // Remove margin at the beginning and the end of the block
    $(".container").children(":first").css("margin-block-start", "0");
    $(".container").children(":last").css("margin-block-end", "0");
});
