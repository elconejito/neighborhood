<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Team extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'name', 'personal_team'];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function neighborhoods(): HasMany
    {
        return $this->hasMany(Neighborhood::class);
    }

    public function properties(): HasManyThrough
    {
        return $this->hasManyThrough(Property::class, Neighborhood::class);
    }
}
