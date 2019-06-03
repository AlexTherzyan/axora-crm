<?php

require '../vendor/autoload.php';


use Api\Simpla;

session_start();

class addRatingAjax extends Simpla
{
    public function fetch()
    {
        $msg = [];
        $avg_rating = 0;

        $rating = $this->request->post('rating');
        $user_id = $this->request->post('user_id');
        $product_id = $this->request->post('product_id');


        if ( !empty($rating) && !empty($product_id) && !empty($user_id) ) {

            if ( $this->rating->getRating($product_id,$user_id)) {
                $this->rating->updateRating($rating,$product_id,$user_id);
                $msg = ['status' => 1, 'text' => 'Рейтинг обновлен'];
            } else {
                $this->rating->createRating($rating,$product_id,$user_id);
                $msg = ['status' => 2, 'text' => 'Рейтинг добавлен'];

            }

            $avg_rating = $this->rating->calculateRating($product_id);

        } else {

            if (!$user_id) {
                $msg = ['status' => 3, 'text' => 'Для голосования необходимо зарегистрироваться'];

            } else {
                $msg = ['status' => 4, 'text' => 'Не все данные получены, необходимо отправить rating,product_id,user_id'];


            }

        }

        return  $result = ['msg' => $msg, 'avg_rating' => $avg_rating ];
    }
}

$rating = new addRatingAjax();
$result = $rating->fetch();

header("Content-type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("X-Robots-Tag: noindex");
header("Pragma: no-cache");
header("Expires: -1");
print json_encode($result);
exit;
