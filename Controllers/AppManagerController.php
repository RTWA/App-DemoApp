<?php

namespace WebApps\Apps\DemoApp\Controllers;

use App\Http\Controllers\AppManagerController as Controller;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AppManagerController extends Controller
{

    public function __construct()
    {
        parent::__construct(json_decode(file_get_contents(__DIR__ . '/../manifest.json'), true));

        // Your code here
    }

    public function install()
    {
        if (!Schema::hasTable('app_DemoApp_Teams')) {
            Schema::create('app_DemoApp_Teams', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->integer('points')->default(0);
                $table->timestamps();
            });
        }
        if (!Schema::hasTable('app_DemoApp_Members')) {
            Schema::create('app_DemoApp_Members', function (Blueprint $table) {
                $table->id();
                $table->string('forename');
                $table->string('surname');
                $table->string('short_name');
                $table->foreignId('team_id')->constrained('app_DemoApp_Teams');
                $table->integer('points')->default(0);
                $table->timestamps();
            });
        }
        $this->createPermissions();
        $this->createSettings();
        $this->copyAppJS();
    }

    public function uninstall()
    {
        Schema::dropIfExists('app_demoApp_Teams');
        Schema::dropIfExists('app_demoApp_Members');
        $this->dropPermissions();
        $this->dropSettings();
        $this->dropAppJS();
    }

    private function copyAppJS()
    {
        $js = __DIR__ . '/../public/DemoApp.js';
        $js2 = __DIR__.'/../public/DemoApp_view.js';
        $path = public_path("js/apps/");

        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }

        if (file_exists($path . $this->slug . '.js')) {
            unlink($path . $this->slug . '.js');
        }
        copy($js, $path . $this->slug . '.js');

        if (file_exists($path.$this->slug.'_View.js')) {
            unlink($path.$this->slug.'_View.js');
        }
        copy($js2, $path.$this->slug.'_View.js');
    }

    private function dropAppJS()
    {
        $path = public_path("js/apps/");
        if (file_exists($path . $this->slug . '.js')) {
            unlink($path . $this->slug . '.js');
        }
        if (file_exists($path.$this->slug.'_View.js')) {
            unlink($path.$this->slug.'_View.js');
        }
    }
}
