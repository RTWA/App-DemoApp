<?php

namespace WebApps\Apps\DemoApp\Providers;

use App\Models\App;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class DemoAppServiceProvider extends ServiceProvider
{
    /**
     * The namespace for this App's Controllers
     *
     * @var string
     */
    protected $namespace = 'WebApps\Apps\DemoApp\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        // Find files that are required by this app
        $folders = ["Controllers", "Models"];
        foreach ($folders as $folder) {
            foreach (GLOB(__DIR__.'/../'.$folder.'/*.php') as $file) {
                $className = str_replace(__DIR__.'/../'.$folder.'/', '', str_replace('.php', '', $file));
                if ($folder === 'Controllers' && class_exists($this->namespace.'\\'.$className)) {
                    continue;
                }
                include $file;
            }
        }
        // Add the Apps views
        $this->loadViewsFrom(__DIR__.'/../Views', "DemoApp");
    }

    /**
     * Define the routes for your App
     *
     * @return void
     */
    public function map()
    {
        $this->mapWebRoutes();
        $this->mapApiRoutes();
    }

    /**
     * Define the "web" routes for your App.
     *
     * @return void
     */
    protected function mapWebRoutes()
    {
        Route::group([
            'middleware' => 'web',
            'namespace' => $this->namespace,
            'prefix' => 'apps/DemoApp'
        ], function () {
            require App::path() . 'DemoApp/Routes/web.php';
        });
    }

    /**
     * Define the "api" routes for your App.
     *
     * @return void
     */
    protected function mapApiRoutes()
    {
        Route::group([
            'middleware' => 'api',
            'namespace' => $this->namespace,
            'prefix' => 'api/apps/DemoApp'
        ], function () {
            require App::path() . 'DemoApp/Routes/api.php';
        });
    }
}
