<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    protected $dates = ['price_date', 'created_at', 'updated_at', 'deleted_at'];

    public function location() {
        return $this->belongsTo('App\Location');
    }
}
