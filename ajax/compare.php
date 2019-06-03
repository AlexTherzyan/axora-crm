<?php
require '../vendor/autoload.php';

use Api\Simpla;

session_start();


class CompareAjax extends Simpla
{
    public function __destruct()
    {
        // это не ajax
        if (empty($_SERVER['HTTP_X_REQUESTED_WITH'])) {
            if (!empty($_SERVER['HTTP_REFERER'])) {
                header('location: ' . $_SERVER['HTTP_REFERER']);
            } else {
                header('location: ' . $this->config->root_url);
            }
        }
    }

    public function fetch()
    {
        $result = new stdClass();
        $result->status = 'error';

        if ($this->request->method('post')) {
            $product_id = $this->request->post('product_id', 'int');

            if (!empty($product_id)) {
                $compares = $this->compares->gets();
                if(isset( $compares) && in_array($product_id,  $compares)) {
                    $this->compares->delete($product_id);
                } else {
                    $this->compares->add($product_id);
                }
            }
        }
        $this->design->assign('compares', $this->compares->gets());
        return $this->design->fetch('compare_informer.tpl');
    }
}

$CompareAjax = new CompareAjax();
$result = $CompareAjax->fetch();

header("Content-type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("X-Robots-Tag: noindex, noarchive, nosnippet");
header("Pragma: no-cache");
header("Expires: -1");
print json_encode($result);
exit;
