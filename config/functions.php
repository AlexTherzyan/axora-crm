<?php

function debug($arr)
{
    echo '<pre>' . print_r($arr,true) . '</pre>';
}



function dd($arr)
{
    echo '<pre>' . print_r($arr,true) . '</pre>';die();
}
