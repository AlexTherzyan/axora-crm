<?php

use Api\Simpla;

function smarty_modifier_token($text)
{
    $simpla = new Simpla();

    return $simpla->config->token($text);
}
