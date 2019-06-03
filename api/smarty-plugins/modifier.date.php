<?php

use Api\Simpla;

function smarty_modifier_date($date, $format = null)
{
    $simpla = new Simpla();

    if (empty($date)) {
        $date = date("Y-m-d");
    }
    return date(empty($format)?$simpla->settings->date_format:$format, strtotime($date));
}
