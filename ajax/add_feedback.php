<?php

require '../vendor/autoload.php';

use Api\Feedbacks;
use Api\Simpla;

class AddFeedbackAjax extends Simpla
{

    private $result = true;
    private $errors = [];
    private $collectData = [];

    public function fetch()
    {

        $data = $this->shieldingData($_POST);

        if ( $this->validate($data) ) {


            try {
                $this->collectData(['phone', 'name'], $data);

                $this->addToCollect('ip', $_SERVER['REMOTE_ADDR']);
                $this->addToCollect('message' ,'Заказ Звонка' );


                $id = $this->feedbacks->add_feedback($this->collectData);
                $this->notify->email_feedback_admin($id);
            } catch (Exception $exception) {
                $this->result = false;
                $this->errors[] = $exception;
            }

        }



        return ['success' => $this->result, 'errors' => $this->errors ];
    }

    private function shieldingData($data)
    {
        foreach ($data as $item) {
           htmlspecialchars($item);
        }

        return $data;
    }

    private function collectData($requiredFields, $data)
    {

        foreach ($requiredFields as $field) {
            if ( !array_key_exists($field, $data)){
                $this->errors[] = 'field ' . $field . ' does not exist';
                $this->result = false ;
            } else {
                $this->addToCollect($field, $data[$field]);
            }
        }

    }

    private function addToCollect($key, $value)
    {
        $this->collectData[$key] = $value;
        return $this;
    }


    public function validate($data) {

        $success = true;
        foreach ($data as $field =>  $item) {

            if (empty($item)) {
               $this->errors[] =  $field . ' не должно быть пустым' ;
               $success = false;
            }

        }

        return $success;
    }


}


header("Content-type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("X-Robots-Tag: noindex");
header("Pragma: no-cache");
header("Expires: -1");
print json_encode(
    (new AddFeedbackAjax())->fetch()
);
exit;
