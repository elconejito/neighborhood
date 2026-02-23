<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['email' => config('app.seeder_user.email')],
            [
                'name' => config('app.seeder_user.name'),
                'password' => Hash::make(config('app.seeder_user.password')),
            ]
        );

        if ($user->teams()->count() === 0) {
            $user->createPersonalTeam();
        }
    }
}
