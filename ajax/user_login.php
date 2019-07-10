<?php

require '../vendor/autoload.php';

use Api\Simpla;

session_start();

class UserLogin extends Simpla
{

    public function login()
    {
        $response = [];

        if ( isset($_POST['password_remind']) ) {
            // Если запостили email
            if ($this->request->method('post') && $this->request->post('email')) {
                $email = $this->request->post('email');
                $this->design->assign('email', $email);

                // Выбираем пользователя из базы
                $user = $this->users->get_user($email);
                if (!empty($user)) {
                    // Генерируем секретный код и сохраняем в сессии
                    $code = md5(uniqid($this->config->salt, true));
                    $_SESSION['password_remind_code'] = $code;
                    $_SESSION['password_remind_user_id'] = $user->id;

                    // Отправляем письмо пользователю для восстановления пароля
                    $this->notify->email_password_remind($user->id, $code);
                    $response['success'] = 'Письмо успешно отправлено, проверьте почту';
                } else {
                    $response['error'] = 'Пользователь не найден';
                }
            } // Если к нам перешли по ссылке для восстановления пароля
            elseif ($this->request->get('code')) {
                // Проверяем существование сессии
                if (!isset($_SESSION['password_remind_code']) || !isset($_SESSION['password_remind_user_id'])) {
                    return false;
                }

                // Проверяем совпадение кода в сессии и в ссылке
                if ($this->request->get('code') != $_SESSION['password_remind_code']) {
                    return false;
                }

                // Выбераем пользователя из базы
                $user = $this->users->get_user(intval($_SESSION['password_remind_user_id']));
                if (empty($user)) {
                    return false;
                }

                // Залогиниваемся под пользователем и переходим в кабинет для изменения пароля
                $_SESSION['user_id'] = $user->id;
                header('Location: ' . $this->config->root_url . '/user', true, 302);
                exit();
            }
        } else {
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
