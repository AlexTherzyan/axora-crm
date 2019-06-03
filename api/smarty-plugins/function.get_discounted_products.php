<?php

use Api\Simpla;

function smarty_function_get_discounted_products($params, &$smarty)
{
    if (!isset($params['visible'])) {
        $params['visible'] = 1;
    }
    $params['discounted'] = 1;

    if (!empty($params['var'])) {

        $simpla = new Simpla();

        $products = $simpla->products->get_products_compile($params);

        $smarty->assign($params['var'], $products);
    }
}
