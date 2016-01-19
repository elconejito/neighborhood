process.env.DISABLE_NOTIFIER = true;
var elixir = require('laravel-elixir');

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

elixir(function(mix) {
    // Mix Bootstrap files, only the ones needed
    mix.scripts([
            '../bower/bootstrap/js/dist/util.js',
            '../bower/bootstrap/js/dist/alert.js',
            '../bower/bootstrap/js/dist/button.js',
            // '../bower/bootstrap/js/dist/carousel.js',
            '../bower/bootstrap/js/dist/collapse.js',
            '../bower/bootstrap/js/dist/dropdown.js',
            '../bower/bootstrap/js/dist/modal.js',
            // '../bower/bootstrap/js/dist/scrollspy.js',
            '../bower/bootstrap/js/dist/tab.js',
            // '../bower/bootstrap/js/dist/tooltip.js',
            // '../bower/bootstrap/js/dist/popover.js'
        ],
        'resources/assets/js/vendors/bootstrap.js');

    // Concat all the vendor files together
    mix.scriptsIn('resources/assets/js/vendors', 'public/assets/js/vendors.js');

    // Compile App JS
    mix.scripts('app.js', 'public/assets/js/app.js');

    // Compile custom SASS
    mix.sass('app.scss', 'public/assets/css/app.css');
    // Get Font-Awesome fonts and copy to the right place
    mix.copy('resources/assets/bower/font-awesome/fonts', 'public/assets/fonts');
});
