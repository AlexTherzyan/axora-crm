<?php

use Api\Simpla;

function smarty_modifier_convert($price, $currency_id = null, $format = true)
{
    $simpla = new Simpla();

    return $simpla->money->convert($price, $currency_id, $format);
}
