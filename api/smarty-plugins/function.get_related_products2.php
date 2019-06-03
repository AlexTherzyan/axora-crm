<?php


use Api\Simpla;

function smarty_function_get_related_products2($params, &$smarty)
{
    if (!isset($params['visible'])) {
        $params['visible'] = 1;
    }



    if (!empty($params['var'])) {

        $simpla = new Simpla();

        $related_products = $simpla->products->get_related_products2(array('product_id'=> $params['product_id']));


        $related_ids = [];
        foreach ($related_products as $related_product) {
            $related_ids [] = $related_product->related_id;
        }

        if (isset($params['limit'])) {
            $related_ids = array_slice($related_ids, 0, $params['limit']);
        }

        $products = $related_ids ? $simpla->products->get_products_compile(['id' => $related_ids]) : [] ;

        $smarty->assign($params['var'], $products);
    }
}
