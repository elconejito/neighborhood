<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::get('/', ['as' => 'home', function () {
    return view('index');
}]);

Route::resource('locations', 'LocationController');
Route::resource('locations.prices', 'PriceController');

Route::group(['prefix' => 'api'], function () {
    Route::get('stats/{method}', 'PriceController@stats');
});