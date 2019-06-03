<?php

require '../vendor/autoload.php';

use Api\Simpla;

session_start();

class UserLogin extends Simpla
{

    public function login()
    {
        $response = [];

        if ($this->request->method('post') ) {
            $email = $this->request->post('email');
            $password = $this->request->post('password');

            if ($user_id = $this->users->check_password($email, $password)) {
                $user = $this->users->get_user($email);
                if ($user->enabled) {
                    $_SESSION['user_id'] = $user_id;
                    $this->users->update_user($user_id, array('last_ip' => $_SERVER['REMOTE_ADDR']));

                    // Перенаправляем пользователя на прошлую страницу, если она известна
                    if (!empty($_SESSION['last_visited_page'])) {
                        $response['redirect_url']  = $_SESSION['last_visited_page'];
                    } else {
                        $response['redirect_url']  = $this->config->root_url;
                    }
                } else {
                    $response['error'] = 'Пользователь отключен';
                }
            } else {
                $response['error'] = 'Неправильный логин или пароль';
            }
        }

        return $response;

    }



}

$response =  (new UserLogin())->login();


header("Content-type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("X-Robots-Tag: noindex, noarchive, nosnippet");
header("Pragma: no-cache");
header("Expires: -1");
print json_encode(['response' => $response]);
exit;
