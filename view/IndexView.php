<?php

namespace View;


require_once('View.php');

class IndexView extends View
{
    public $modules_dir = 'view/';

    public function __construct()
    {
        parent::__construct();
    }


    public function fetch()
    {

        // Способы доставки
        $deliveries = $this->delivery->get_deliveries(array('enabled' => 1));
        $this->design->assign('deliveries', $deliveries);
        //- Доставка
        if (isset($_COOKIE['delivery_id'])) {
            $this->design->assign('current_delivery_id', $_COOKIE['delivery_id']);
        }

        // получаем корзину
        $cart = $this->cart->get_cart();

        // получаем ид всех товаров добавленных в корзину
        $cart_product_variant_ids = [];
        foreach ( $cart->purchases as $product ) {
            $cart_product_variant_ids [] =  $product->variant->id;
        }

        // Содержимое корзины
        $this->design->assign('cart', $cart);
        $this->design->assign('cart_product_ids', $cart_product_variant_ids);
        $this->design->assign('cart_product_ids_str', implode(',',$cart_product_variant_ids));

        //  сравнение
        $this->design->assign('compares', $this->compares->gets());


        // Категории товаров
        $this->design->assign('categories', $this->categories->get_categories_tree());

        // Страницы
        $pages = $this->pages->get_pages(array('visible'=>1));
        $this->design->assign('pages', $pages);


        //-------------------- функционал тегов(сео теги)
        if (!empty($_GET['page_url']) && $tag = $this->tags->get_tag($this->request->get('page_url', 'string'))) {
            $_GET['module'] = 'ProductsView';
            $category = $this->categories->get_category(intval($tag->category_id));
            if (empty($category)) {
                return false;
            }
            if (!$tag->visible && empty($_SESSION['admin'])) {
                return false;
            }
            $_GET['category'] = $category->url;
            if (!empty($tag->features)) {
                parse_str($tag->features, $tag->features);
                foreach ($tag->features as $k => $v) {
                    $_GET[$k] = $v;
                }
            }
            if (!empty($tag->colors)) {
                parse_str($tag->colors, $tag->colors);
                foreach ($tag->colors as $k => $v) {
                    $_GET['color'][] = $v;
                }

            }

            if (!empty($tag->brands)) {
                parse_str($tag->brands, $tag->brands);

                foreach ($tag->brands as $k => $v) {
                    $_GET['brand'][] = $v;
                }

            }
            $this->design->assign('tag', $tag);
        }
        //--------------------------------------------




        // Текущий модуль (для отображения центрального блока)
        $module = $this->request->get('module', 'string');
        $module = preg_replace("/[^A-Za-z0-9]+/", "", $module);

        // Если не задан - берем из настроек
        if (empty($module)) {
            return false;
        }
        //$module = $this->settings->main_module;

        // Создаем соответствующий класс
        if (is_file($this->modules_dir."$module.php")) {
            include_once($this->modules_dir."$module.php");

            $module = '\View\\' . $module;
            if (class_exists($module)) {

                $view = new  $module($this);
            } else {
                return false;
            }
        } else {
            return false;
        }

        // Создаем основной блок страницы
        if (!$content = $view->fetch()) {
            return false;
        }



        // Передаем основной блок в шаблон
        $this->design->assign('content', $content);

        // Передаем название модуля в шаблон, это может пригодиться
        $this->design->assign('module', $module);

        // Создаем текущую обертку сайта (обычно index.tpl)
        $wrapper = $this->design->get_var('wrapper');
        if (is_null($wrapper)) {
            $wrapper = 'index.tpl';
        }

        if (!empty($wrapper)) {
            return $this->design->fetch($wrapper);
        } else {
            return trim($content);
        }


    }







}
