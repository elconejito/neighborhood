let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.setPublicPath(path.normalize('public/assets'))
.setResourceRoot('../');

mix.react('resources/assets/js/app.js', 'js')
.extract(['bootstrap', 'popper.js'])
.sass('resources/assets/sass/app.scss', 'css')
.autoload({
  'jquery': ['$', 'window.jQuery', 'jQuery'],
  'popper.js': ['Popper'],
  'd3': ['d3']
});
