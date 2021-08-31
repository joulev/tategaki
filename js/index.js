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

$(() => {
    // Convert text to full-width
    $(".container p").each(function () {
        let s = $(this).text();
        // A whitespace at the beginning
        let html = '<div class="tategaki-character">　</div>';
        for (let i = 0; i < s.length; i++) {
            let char = convert(s[i]);
            html += '<div class="tategaki-character">' + char + '</div>';
        }
        $(this).html(html);
    });
    $(".container h1, .container h2, .container h3").each(function () {
        let s = $(this).text();
        // A whitespace at the beginning
        let html = "";
        for (let i = 0; i < s.length; i++) {
            let char = convert(s[i]);
            html += '<div class="tategaki-character">' + char + '</div>';
        }
        $(this).html(html);
    });

    set_container_height();
    $(window).on("resize", set_container_height);

    // Remove margin at the beginning and the end of the block
    $(".container").children(":first").css("margin-block-start", "0");
    $(".container").children(":last").css("margin-block-end", "0");
});
