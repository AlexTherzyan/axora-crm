<?php

require '../../vendor/autoload.php';
use Api\Simpla;

$simpla = new Simpla();

    $category_id = $simpla->request->get('category_id', 'integer');
    $product_id = $simpla->request->get('product_id', 'integer');

    if (!empty($category_id)) {
        $features = $simpla->features->get_features(array('category_id'=>$category_id));
    } else {
        $features = $simpla->features->get_features();
    }

    $options = array();
    if (!empty($product_id)) {
        $opts = $simpla->features->get_product_options($product_id);
        foreach ($opts as $opt) {
            if (empty($options[$opt->feature_id])) {
                $options[$opt->feature_id] = $opt;
                $options[$opt->feature_id]->values = array();
            }
            $options[$opt->feature_id]->values[] = $opt->value;
        }
    }

    foreach ($features as &$f) {
        if (isset($options[$f->id])) {
            $f->values = array_unique($options[$f->id]->values);
        } else {
            $f->values = array('');
        }
    }

    header("Content-type: application/json; charset=UTF-8");
    header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
    header("Pragma: no-cache");
    header("Expires: -1");
    print json_encode($features);




