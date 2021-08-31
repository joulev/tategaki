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
    $(".container *").each(function () {
        let s = $(this).text();
        $(this).text(convert(s));
    });

    set_container_height();
    $(window).on("resize", set_container_height);

    // Remove margin at the beginning and the end of the block
    $(".container").children(":first").css("margin-block-start", "0");
    $(".container").children(":last").css("margin-block-end", "0");
});
