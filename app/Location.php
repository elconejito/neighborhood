<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $appends = ['urls'];

    protected $guarded = [
        'id'
    ];

    public function prices() {
        return $this->hasMany('App\Price')->orderBy('price_date', 'desc');
    }

    public function latestPrice() {
        // return $this->prices()->first();
        return $this->hasOne('App\Price')->orderBy('price_date', 'desc')->latest();
    }

    public function latestSalePrice() {
        // return $this->prices()->where('type', 2)->first();
        return $this->hasOne('App\Price')->where('type', 2)->orderBy('price_date', 'desc')->latest();
    }

    public function getUrlsAttribute() {
        return action('LocationController@show', $this->id);
    }
}
