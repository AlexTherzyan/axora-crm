<?php

namespace View;

class UserView extends View
{
    public function fetch()
    {
        if (empty($this->user)) {
            header('Location: '.$this->config->root_url.'/user/login', true, 302);
            exit();
        }

        if ($this->request->method('post') && $this->request->post('name')) {
            $name            = $this->request->post('name');
            $email            = $this->request->post('email');
            $password        = $this->request->post('password');

            $this->design->assign('name', $name);
            $this->design->assign('email', $email);

            $this->db->query('SELECT count(*) as count FROM __users WHERE email=? AND id!=?', $email, $this->user->id);
            $user_exists = $this->db->result('count');

            if ($user_exists) {
                $this->design->assign('error', 'user_exists');
            } elseif (empty($name)) {
                $this->design->assign('error', 'empty_name');
            } elseif (empty($email)) {
                $this->design->assign('error', 'empty_email');
            } elseif ($user_id = $this->users->update_user($this->user->id, array('name'=>$name, 'email'=>$email))) {
                $this->user = $this->users->get_user(intval($user_id));
                $this->design->assign('name', $this->user->name);
                $this->design->assign('user', $this->user);
                $this->design->assign('email', $this->user->email);
            } else {
                $this->design->assign('error', 'unknown error');
            }

            if (!empty($password)) {
                $this->users->update_user($this->user->id, array('password'=>$password));
            }
        } else {
            // Передаем в шаблон
            $this->design->assign('user', $this->user);

        }

        $orders = $this->getUserOrdersDetail( $this->orders->get_orders(array('user_id'=>$this->user->id)) );

        $this->design->assign('orders', $orders);
        $this->design->assign('meta_title', $this->user->name);
        $body = $this->design->fetch('user.tpl');

        return $body;
    }




    public function getUserOrdersDetail($orders)
    {


        foreach ($orders as $order) {

            $purchases = $this->orders->get_purchases(array('order_id' => intval($order->id)));
            if (!$purchases) {
                return false;
            }

            $products_ids = array();
            foreach ($purchases as $purchase) {
                $products_ids[] = $purchase->product_id;
            }

            $products = $this->products->get_products_compile(array('id' => $products_ids, 'limit' => count($products_ids)));


            foreach ($purchases as $key => $purchase) {
                if (!empty($products[$purchase->product_id])) {

                    $purchase->product = $products[$purchase->product_id];

                    if (!empty($products[$purchase->product_id]->variants[$purchase->variant_id])) {
                        $purchase->variant = $products[$purchase->product_id]->variants[$purchase->variant_id];
                    }
                }
            }

            // Способ оплаты
            if ($order->payment_method_id) {
                $order->payment_method = $this->payment->get_payment_method($order->payment_method_id);
            }
            // Способ доставки
            $order->delivery = $this->delivery->get_delivery($order->delivery_id);

            $order->purchases = $purchases;

        }

        return $orders;

    }
}


























