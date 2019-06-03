<?php

require '../vendor/autoload.php';

use Api\Simpla;

session_start();

class FavoritesAjax extends Simpla
{
    public $user;

    public function fetch()
    {

        $product_id = $this->request->get('product_id', 'integer');

        if ($product_id){

            $expire = time() + 60 * 60 * 24 * 30; // Время жизни - 30 дней

            if (!empty($_COOKIE['favorites'])){

                $favorites = explode(',',$_COOKIE['favorites']);

                switch ($_GET['action']){
                    case 'add':
                        $favorites[] = $product_id;

                        setcookie('favorites',implode(',',$favorites),$expire,'/');
                        break;
                    case 'remove':
                        unset($favorites[array_search($product_id,$favorites)]);
                        setcookie('favorites',implode(',',$favorites),$expire,'/');
                        break;
                }
            } else {
                $favorites[] = $product_id;
                setcookie("favorites",implode(',',$favorites),$expire,'/');
            }

        } else {

            if (empty($_COOKIE['favorites'])){
                echo $favorites = [];
            } else {
                $favorites = explode(',',$_COOKIE['favorites']);
            }
        }



        return count($favorites);
    }
}

$favorites = new FavoritesAjax();
$result = $favorites->fetch();


header("Content-type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("X-Robots-Tag: noindex");
header("Pragma: no-cache");
header("Expires: -1");
print json_encode(['count'=> $result]);
exit;




















