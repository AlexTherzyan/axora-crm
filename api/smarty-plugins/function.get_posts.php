<?php

use Api\Simpla;

function smarty_function_get_posts($params, &$smarty)
{
    if (!isset($params['visible'])) {
        $params['visible'] = 1;
    }
    if (!empty($params['var'])) {
        $simpla = new Simpla();

        $smarty->assign($params['var'], $simpla->blog->get_posts($params));
    }
}
