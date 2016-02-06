<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    public function prices() {
        return $this->hasMany('App\Price')->orderBy('price_date', 'desc');
    }

    public function latestPrice() {
        return $this->prices()->first();
    }

    public function latestSalePrice() {
        return $this->prices()->where('type', 2)->orderBy('price_date', 'desc')->first();
    }
}
