const elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(mix => {
    mix.sass('app.scss', 'public/assets/css/app.css')
        .webpack('app.js', 'public/assets/js/app.js');

    mix.version(['assets/css/app.css', 'assets/js/app.js', 'assets/fonts/*']);

    // Get Font-Awesome fonts and copy to the right place
    mix.copy('node_modules/font-awesome/fonts', 'public/build/assets/fonts');
});
