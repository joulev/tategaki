"use strict";

import $ from "./parts/jquery.js";
import {convert} from "./parts/convert.js";

$(() => {
    $("body *").each(function () {
        let s = $(this).text();
        console.log(s);
        $(this).text(convert(s));
    });
});
