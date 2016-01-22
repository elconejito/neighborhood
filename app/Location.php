<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    public function prices() {
        $this->hasMany('App/Price');
    }
}
