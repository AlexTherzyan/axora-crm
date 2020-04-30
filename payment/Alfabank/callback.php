<?php

require '../../vendor/autoload.php';

// Работаем в корневой директории
use Payment\Alfabank\Alfabank;

chdir('../../');
$alfa = new Alfabank();

$external_order_id = $_GET['orderId'];
$order_id = intval($_GET['o']);

$order = $alfa->orders->get_order(intval($order_id));

if (empty($order))
    errorlink('Оплачиваемый заказ не найден', $alfa, $order);

// Нельзя оплатить уже оплаченный заказ  
if ($order->paid)
    errorlink('Этот заказ уже оплачен', $alfa, $order);

$method = $alfa->payment->get_payment_method(intval($order->payment_method_id));
if (empty($method))
    errorlink("Неизвестный метод оплаты", $alfa, $order);

$settings = unserialize($method->settings);
if (!empty($settings['alfabank_server']))
    $alfa->getaway_url = $settings['alfabank_server'];


$data = array(
    'userName' => $settings['alfabank_login'],
    'password' => $settings['alfabank_password'],
    'orderId' => $external_order_id
);

$response = $alfa->gateway('getOrderStatus.do', $data);
if ($response['ErrorCode'] != 0) {
    errorlink($response['ErrorMessage'], $alfa, $order);
}

if ($response['Amount'] != 100 * $alfa->money->convert($order->total_price, $method->currency_id, false) || $response['Amount'] <= 0)
    errorlink("incorrect price\n", $alfa, $order);

if ($response['OrderNumber'] != $order->id)
    errorlink("incorrect order number\n", $alfa, $order);


// Установим статус оплачен
$alfa->orders->update_order(intval($order->id), array('paid' => 1));

// Спишем товары  
$alfa->orders->close(intval($order->id));
$alfa->notify->email_order_user(intval($order->id));
$alfa->notify->email_order_admin(intval($order->id));

header("Location: " . $alfa->config->root_url . '/order/' . $order->url);

function errorlink($message, $alfa, $order)
{
    print "$message<br>";
    if (isset($order)) {
        print "<a href='" . $alfa->config->root_url . "/order/" . $order->url . "'>Вернуться на страницу заказа</a>";
    } else {
        print "<a href='" . $alfa->config->root_url . "/order/'>Вернуться на страницу заказа</a>";

    }
    die();
}
