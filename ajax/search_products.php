<?php
require '../vendor/autoload.php';

use Api\Simpla;

session_start();


class SearchProductsAjax extends Simpla
{
    private $limit = 10;
    public function fetch()
    {
        $result = new \stdClass();
        $result->suggestions = array();
        $result->query = $this->request->get('query', 'string');

        if (!empty($result->query)) {

            $kw = $this->db->escape($result->query);

            $this->db->query("SELECT c.id, c.name, c.url, 'category' AS type, CONCAT('catalog/', c.url) AS url
                                    FROM __categories AS c
                                    WHERE (c.name LIKE '%$kw%' OR c.meta_keywords LIKE '%$kw%')
                                    AND c.visible = 1");
            $categories = $this->db->results();

            foreach ($categories as $category) {
                $suggestion = new \stdClass();
                $suggestion->value = $category->name;
                $suggestion->type = $category->type;
                $suggestion->data = $category;
                $result->suggestions[] = $suggestion;
            }


            $this->db->query("SELECT b.id, b.name, 'brand' AS type, CONCAT('brands/', b.url) AS url
                                    FROM __brands AS b
                                    WHERE (b.name LIKE '%$kw%' OR b.meta_keywords LIKE '%$kw%')");
            $brands = $this->db->results();

            foreach ($brands as $brand) {
                $suggestion = new \stdClass();
                $suggestion->value = $brand->name;
                $suggestion->type = $brand->type;
                $suggestion->data = $brand;
                $result->suggestions[] = $suggestion;
            }
            $products_ids = array();
            $this->db->query("SELECT p.id, p.name, i.filename as image, 'product' AS type, v.price, CONCAT('products/', p.url) AS url
                                    FROM __products p
									LEFT JOIN __images i ON i.product_id=p.id AND i.position=(SELECT MIN(position) FROM __images WHERE product_id=p.id LIMIT 1)
									LEFT JOIN __variants v ON v.product_id=p.id AND v.position=(SELECT MIN(position) FROM __variants WHERE product_id=p.id LIMIT 1)
									WHERE (p.name LIKE '%$kw%' OR p.meta_keywords LIKE '%$kw%' OR p.id in (SELECT product_id FROM __variants WHERE sku LIKE '%$kw%'))
									AND p.visible=1
									GROUP BY p.id
									ORDER BY p.name
									LIMIT ?", $this->limit);
            foreach($this->db->results() as $p){
                $products[$p->id] = $p;
            }


            if(!empty($products)){

                $currencies = $this->money->get_currencies(array('enabled'=>1));
                if (isset($_SESSION['currency_id'])) {
                    $currency = $this->money->get_currency($_SESSION['currency_id']);
                } else {
                    $currency = reset($currencies);
                }


                $this->db->query("SELECT IF(c.name_in_type <> '', c.name_in_type, c.name) AS name, IF(c.image <> '', CONCAT(? , c.image), '') AS image, CONCAT('catalog/', c.url) as url, pc.product_id
                                FROM __categories AS c
                                INNER JOIN __products_categories pc ON c.id = pc.category_id AND pc.position=( SELECT MIN(pc2.position)
											                    FROM __products_categories pc2
											                    WHERE pc.product_id = pc2.product_id)
											                    AND pc.product_id IN( ?@ )
											                    GROUP BY pc.product_id", $this->config->categories_images_dir, array_keys($products));




                try {
                    foreach ($this->db->results() as $row) {

                        $products[$row->product_id]->category = $row;
                    }
                } catch (Exception $e) {
                    echo  $e;
                }



                foreach ($products as $product) {
                    $suggestion = new \stdClass();

                    if (!empty($product->image)) {
                        $product->image = $this->image->resize_image($product->image, 200, 150);
                    }
                    if ( $product->price > 0) {
                        $product->price = $this->money->convert($product->price) . ' ' .$currency->sign;
                    } else {
                        $product->price = '';
                    }


                    $suggestion->value = $product->name;
                    $suggestion->type = $product->type;
                    $suggestion->data = $product;
                    $result->suggestions[] = $suggestion;
                }




            }
        }

        return $result;
    }
}

$cart_ajax = new SearchProductsAjax();
$result = $cart_ajax->fetch();

header("Content-type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("X-Robots-Tag: noindex, noarchive, nosnippet");
header("Pragma: no-cache");
header("Expires: -1");
print json_encode($result);
exit;
