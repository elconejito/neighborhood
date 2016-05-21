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
    /**
     * Mix Vendor JS files
     */
    // Vendor - D3.js
    mix.scripts(
        '../bower/d3/d3.js',
        'resources/assets/js/vendors/d3.js'
    );
    // Vendor - tether (for bootstrap)
    mix.scripts(
        '../bower/tether/dist/js/tether.js',
        'resources/assets/js/vendors/tether.js'
    );
    // Vendor - Trix.js
    mix.scripts(
        '../bower/trix/dist/trix-core.js',
        'resources/assets/js/vendors/trix.js'
    );

    /**
     * Mix Vendor CSS files
     */
    mix.styles(
        '../bower/trix/dist/trix.css',
        'resources/assets/css/vendors/trix.css'
    );

    /**
     * Concat all the vendor files together
     */
    mix.scriptsIn('resources/assets/js/vendors', 'public/assets/js/vendors.js');
    mix.stylesIn('resources/assets/css/vendors', 'public/assets/css/vendors.css');

    /**
     * Compile App JS/Css
     */
    mix.scripts([
        '../bower/bootstrap/js/dist/util.js',
        '../bower/bootstrap/js/dist/alert.js',
        '../bower/bootstrap/js/dist/button.js',
        '../bower/bootstrap/js/dist/carousel.js',
        '../bower/bootstrap/js/dist/collapse.js',
        '../bower/bootstrap/js/dist/dropdown.js',
        '../bower/bootstrap/js/dist/modal.js',
        '../bower/bootstrap/js/dist/scrollspy.js',
        '../bower/bootstrap/js/dist/tab.js',
        '../bower/bootstrap/js/dist/tooltip.js',
        '../bower/bootstrap/js/dist/popover.js',
        'app.js'
    ], 'public/assets/js/app.js');
    mix.sass('app.scss', 'public/assets/css/app.css');

    // Get Font-Awesome fonts and copy to the right place
    mix.copy('resources/assets/bower/font-awesome/fonts', 'public/assets/fonts');
});
