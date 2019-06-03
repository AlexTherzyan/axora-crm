<?php


require '../vendor/autoload.php';

use Api\Simpla;

session_start();

class userRegister  extends Simpla
{



    public function register()
    {
        $default_status = 1; // Активен ли пользователь сразу после регистрации (0 или 1)

        //Ответ, который будем отдавать
        $response = [];

        if ($this->request->method('post')) {

            $name            = $this->request->post('name');
            $email            = $this->request->post('email');
            $password        = $this->request->post('password');


            $this->db->query('SELECT count(*) as count FROM __users WHERE email=?', $email);
            $user_exists = $this->db->result('count');

            if ($user_exists) {
                $response['error'] = 'Пользователь с таким E-mail существует';
            } elseif (empty($name)) {
                $response['error'] = 'Поле Имя не должно быть пустым';
            } elseif (empty($email)) {
                $response['error'] = 'Поле E-mail не должно быть пустым';
            } elseif (empty($password)) {
                $response['error'] = 'Поле Пароль не должно быть пустым';
            } elseif ($user_id = $this->users->add_user(array('name'=>$name, 'email'=>$email, 'password'=>$password, 'enabled'=>$default_status, 'last_ip'=>$_SERVER['REMOTE_ADDR']))) {
                $_SESSION['user_id'] = $user_id;
                if (!empty($_SESSION['last_visited_page'])) {
                    $response['redirect_url'] = $_SESSION['last_visited_page'];
                } else {
                    $response['redirect_url'] = $this->config->root_url;
                }
            } else {
                $response['error'] = 'Поле E-mail не должно быть пустым';
            }
        }


        return $response;
    }

}


$response =  (new userRegister())->register();


header("Content-type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("X-Robots-Tag: noindex, noarchive, nosnippet");
header("Pragma: no-cache");
header("Expires: -1");
print json_encode(['response' => $response]);
exit;







