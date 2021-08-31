"use strict";

import $ from "./parts/jquery.js";
import {convert} from "./parts/convert.js";

$(() => {
    $(".container *").each(function () {
        let s = $(this).text();
        console.log(s);
        $(this).text(convert(s));
    });
});
