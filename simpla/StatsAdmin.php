<?php

namespace Simpla;

use Api\Simpla;

class StatsAdmin extends Simpla
{

    public function fetch()
    {
        return $this->design->fetch('stats.tpl');
    }
}
