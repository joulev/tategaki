"use strict";

import $ from "./parts/jquery.js";
import {convert} from "./parts/convert.js";

let start_chars = "「『［【〔｛〈《（"; // characters that should be shifted down
let end_chars   = "」』］】〕｝〉》）。、"; // characters that should be shifted up

let loading_cnt = 0;

let char_cnt = 0;
let allchar_cnt = 0;

let furigana = false;
let furigana_cnt = 0;

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
 * @param {number} cnt Number of "end" characters already added so far. This param
 *                     is only necessary to position "end" characters.
 * @returns The <div> element with necessary classes added
 */
function check_display(char, cnt) {
    if (char === "<") {
        furigana = true;
        return '<div class="furigana">';
    }
    if (char === ">") {
        let out_html = "";
        if (furigana_cnt > 2) {
            out_html = '<div class="furigana-crushed-check"></div>';
        }
        furigana = false;
        furigana_cnt = 0;
        return out_html + "</div>";
    }
    if (furigana) {
        furigana_cnt++;
        return char;
    }
    allchar_cnt++;
    for (let i = 0; i < start_chars.length; i++)
        if (char === start_chars[i]) return '</div><div class="tategaki-character tategaki-start">' + char;
    for (let i = 0; i < end_chars.length; i++)
        if (char === end_chars[i]) return `<div style="position: absolute; top: ${23 - 10 + 10 * cnt}px;">${char}</div>`;
    // Normal characters INCLUDING NUMBERS: rotate the character
    // Thus, please write dates with kanji. Don't write dates with numbers in tategaki in
    // general, such writing style doesn't make sense to me.
    char_cnt++;
    if ("０".codePointAt(0) <= char.codePointAt(0) && char.codePointAt(0) <= "９".codePointAt(0)) {
        return '</div><div class="tategaki-character tategaki-rotate"><div class="tategaki-rotate-character">' + char + '</div>';
    }
    if ("ａ".codePointAt(0) <= char.codePointAt(0) && char.codePointAt(0) <= "ｚ".codePointAt(0)) {
        return '</div><div class="tategaki-character tategaki-rotate"><div class="tategaki-rotate-character">' + char + '</div>';
    }
    if ("Ａ".codePointAt(0) <= char.codePointAt(0) && char.codePointAt(0) <= "Ｚ".codePointAt(0)) {
        return '</div><div class="tategaki-character tategaki-rotate"><div class="tategaki-rotate-character">' + char + '</div>';
    }
    // "Small" kana
    let small_kana = "ぁぃぅぇぉァィゥェォっッゃゅょャュョ";
    for (let i = 0; i < small_kana.length; i++)
        if (char === small_kana[i]) return '</div><div class="tategaki-character tategaki-small-kana">' + char;
    // All normally
    return '</div><div class="tategaki-character tategaki-none">' + char;
}

/**
 * Function check_space_dot_comma(): void -> void
 * 
 * Check whether a whitespace should be added
 */
function check_space_dot_comma() {
    $(".container p").each(function() {
        let $elm_arr = $(this).children();
        for (let i = 0; i < $elm_arr.length; i++) {
            let $el = $elm_arr.eq(i);
            if ($el.text().length > 1) {
                // check whether the extra length is due to furigana or dot/comma
                let comma = false;
                for (let j = 0; j < $el.text().length; j++) {
                    for (let k = 0; k < end_chars.length; k++) {
                        if ($el.text()[j] === end_chars[k]) {
                            comma = true;
                            break;
                        }
                    }
                    if (comma) break;
                }
                if (!comma) continue;
                let $space = $('<div class="tategaki-character">　</div>');
                $space.insertAfter($el);
                if ($space.offset().top - $el.offset().top < 0) $space.remove();
                continue;
            }
            for (let j = 0; j < start_chars.length; j++) {
                if ($el.text() === start_chars[j]) {
                    let $space = $('<div class="tategaki-character">　</div>');
                    $space.insertBefore($el);
                    //console.log($el.text() + " " + $el.offset().top + " " + $space.offset.top());
                    if ($el.offset().top - $space.offset().top > 0) $space.remove();
                    break;
                }
            }
            if ($el.text() === "　") {
                if (i === 0) continue;
                if (i === $elm_arr.length - 1) {
                    $el.remove();
                    continue;
                }
                let prev = $elm_arr.eq(i - 1).text();
                let next = $elm_arr.eq(i + 1).text();
                if (prev.length > 1 || next.length > 1) {
                    $el.remove();
                    continue;
                }
                if ("！".codePointAt(0) > prev.codePointAt(0) || prev.codePointAt(0) > "～".codePointAt(0) ||
                    "！".codePointAt(0) > next.codePointAt(0) || next.codePointAt(0) > "～".codePointAt(0)) {
                    $el.remove();
                    continue;
                }
            }
        }
    });
}

$(window).on("load", () => {
    loading_cnt++;
    if (loading_cnt === 2) $("#loading").fadeOut(200);
});

$(() => {
    $("#loading").show();
    // Convert text to full-width
    $(".container p").each(function () {
        let s = $(this).text();
        // A whitespace at the beginning
        let html = '<div class="tategaki-character">　';
        let cnt = 0;
        for (let i = 0; i < s.length; i++) {
            let char = convert(s[i]);
            let inside = false;
            for (let j = 0; j < end_chars.length; j++) {
                if (char === end_chars[j]) {
                    inside = true;
                    break;
                }
            }
            if (inside) cnt++; else cnt = 0;
            html += check_display(char, cnt);
        }
        $(this).html(html + "</div>");
    });
    console.log("Character count: " + char_cnt);
    console.log("All characters (including punctuations) count: " + allchar_cnt);
    $(".container h1, .container h2, .container h3").each(function () {
        let s = $(this).text();
        // A whitespace at the beginning
        let html = "";
        let cnt = 0;
        for (let i = 0; i < s.length; i++) {
            let char = convert(s[i]);
            let inside = false;
            for (let j = 0; j < end_chars.length; j++) {
                if (char === end_chars[j]) {
                    inside = true;
                    break;
                }
            }
            if (inside) cnt++; else cnt = 0;
            html += check_display(char, cnt);
        }
        $(this).html(html + "</div>");
    });

    // "Crushed furigana"
    $(".furigana").each(function () {
        let $el = $(this).children(".furigana-crushed-check");
        if ($el.length > 0)
            $(this).addClass("furigana-crushed");
    });

    set_container_height();
    check_space_dot_comma();

    // Remove margin at the beginning and the end of the block
    $(".container").children(":first").css("margin-block-start", "0");
    $(".container").children(":last").css("margin-block-end", "0");

    loading_cnt++;
    if (loading_cnt === 2) $("#loading").fadeOut(200);

    $(window).on("resize", () => {
        $("#loading").fadeIn(200);
        setTimeout(() => {
            set_container_height();
            check_space_dot_comma();
            $("#loading").fadeOut(200);
        }, 200);
    });
});
