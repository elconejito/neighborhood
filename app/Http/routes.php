<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('index');
});

Route::resource('location', 'LocationController');
Route::resource('location.price', 'PriceController');

Route::get('/comments', function() {
    $json = [
        [
            'author' => "Bob Smith",
            'text' => "This is one comment"
        ],
        [
            'author' => "Jordan Walke",
            'text' => "This is *another* comment"
        ]
    ];
    return response()->json($json);
});

Route::post('/comments', function() {
    $json = [
        [
            'author' => "New Smith",
            'text' => "This is one comment"
        ],
        [
            'author' => "Jordan New",
            'text' => "This is *another* comment"
        ]
    ];
    return response()->json($json);
});