const mix = require('laravel-mix');

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

 /**
  * Ensure you replace all instances of 'DemoApp' with your App's slug
  */

mix
    .setPublicPath('public')
    .js('resources/js/app.js', 'public/DemoApp.js').react()
    .js('resources/js/view.js', 'public/DemoApp_view.js').react()
    /**
     * Uncomment this lines during development to copy your updated JS
     * file automatically (you must have installed and activated your app)
     */    
    .copy('public/DemoApp.js', '../../../../public/js/apps/DemoApp.js')
    .copy('public/DemoApp_view.js', '../../../../public/js/apps/DemoApp_view.js')
