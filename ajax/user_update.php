<?php


require '../vendor/autoload.php';

use Api\Simpla;

session_start();


class UpdateUser extends Simpla
{

    public function update()
    {
        $user = [
            'name' => $this->request->post('name'),
            'email' => $this->request->post('email'),
            'password' => $this->request->post('password'),
            'phone' => $this->request->post('phone'),
            'address' => $this->request->post('address'),
        ];
        $id            = $this->request->post('user_id');


        foreach ($user as $key => $field) {

            if (!$field) {
                unset($user[$key]);
            }
        }
        $this->users->update_user($id, $user);

    }

}


(new UpdateUser())->update();


header("Content-type: application/json; charset=UTF-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("X-Robots-Tag: noindex, noarchive, nosnippet");
header("Pragma: no-cache");
header("Expires: -1");
print json_encode(['success' => true]);
exit;













