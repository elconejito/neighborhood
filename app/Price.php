<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
    public function location() {
        $this->belongsTo('App/Location');
    }
}
