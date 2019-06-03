<?php

use Api\Simpla;

function smarty_function_url($params, $template)
{
    $simpla = new Simpla();

    if (is_array(reset($params))) {
        return $simpla->request->url(reset($params));
    } else {
        return $simpla->request->url($params);
    }
}
