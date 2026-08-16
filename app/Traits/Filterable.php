<?php

namespace App\Traits;

use App\Support\QueryFilter\FilterParser;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

trait Filterable
{
    public function scopeFilter(Builder $query, Request $request): Builder
    {
        return (new FilterParser($query, $request, $this))->apply();
    }
}
