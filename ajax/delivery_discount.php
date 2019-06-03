<?php

require '../vendor/autoload.php';


use Api\Simpla;

session_start();


class DeliveryDiscount extends Simpla
{
    public $user;

    public function fetch()
    {
        $expire = time() + 60 * 60 * 24;
        setcookie('delivery_id', $_POST['delivery_id'] ,$expire,'/');
        return $_POST['delivery_id'];
    }
}

$DeliveryDiscount = new DeliveryDiscount();
$result = $DeliveryDiscount->fetch();


header("Content-type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("X-Robots-Tag: noindex");
header("Pragma: no-cache");
header("Expires: -1");
print json_encode(['delivery_id'=> $result]);
exit;




















