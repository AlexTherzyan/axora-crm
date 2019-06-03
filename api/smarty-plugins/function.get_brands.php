<?php

use Api\Simpla;

function smarty_function_get_brands($params, &$smarty)
{
    if (!isset($params['visible'])) {
        $params['visible'] = 1;
    }

    if (isset($params['show_on_main'])) {
        $params['show_on_main'] = 1;
    }

    if (!empty($params['var'])) {
        $simpla = new Simpla();

        $smarty->assign($params['var'], $simpla->brands->get_brands($params));
    }
}
