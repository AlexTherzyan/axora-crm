<?php

use Api\Simpla;

function smarty_modifier_crop($filename, $width=0, $height=0, $set_watermark=false)
{
    $simpla = new Simpla();

    return $simpla->image->crop_image($filename, $width, $height, $set_watermark);
}
