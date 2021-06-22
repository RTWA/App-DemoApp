<?php

namespace WebApps\Apps\DemoApp\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use RobTrehy\LaravelApplicationSettings\ApplicationSettings;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AppManagerController extends Controller
{
    public $name;
    public $slug;
    public $icon;
    public $version;
    public $author;

    public $menu;
    public $routes;

    private $manifest;

    public function __construct()
    {
        $this->manifest = json_decode(file_get_contents(__DIR__.'/../manifest.json'), true);
        $this->name = $this->manifest['name'];
        $this->slug = $this->manifest['slug'];
        $this->icon = $this->manifest['icon'];
        $this->version = $this->manifest['version'];
        $this->author = $this->manifest['author'];
        $this->menu = $this->manifest['menu'];
        $this->routes = $this->manifest['routes'];
    }

    public function install()
    {
        if (!Schema::hasTable('app_demoApp_Teams')) {
            if (!Schema::hasTable('app_demoApp_Teams')) {
                Schema::create('app_demoApp_Teams', function (Blueprint $table) {
                    $table->id();
                    $table->string('name');
                    $table->integer('points')->default(0);
                    $table->timestamps();
                });
            }
        }
        if (!Schema::hasTable('app_demoApp_Members')) {
            Schema::create('app_demoApp_Members', function (Blueprint $table) {
                $table->id();
                $table->string('forename');
                $table->string('surname');
                $table->string('short_name');
                $table->foreignId('team_id')->constrained('app_demoApp_Teams');
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

    private function createPermissions()
    {
        $admin = Role::findByName('Administrators', 'web');

        foreach ($this->manifest['permissions'] as $permission) {
            if (Permission::where('name', $permission['name'])
                    ->where('guard_name', $permission['guard'])
                    ->first() === null) {
                $p = Permission::create([
                    'name' => $permission['name'],
                    'title' => $permission['title'],
                    'guard_name' => $permission['guard'],
                ]);
                if ($permission['admin']) {
                    $admin->givePermissionTo($p);
                }
            }
        }
    }

    private function dropPermissions()
    {
        foreach ($this->manifest['permissions'] as $permission) {
            $p = Permission::where('name', $permission['name'])
                ->where('guard_name', $permission['guard'])
                ->first();
            if ($p <> null) {
                // Revoke direct user permissions
                $users = User::permission($permission['name'])->get();
                foreach ($users as $user) {
                    $user->revokePermissionTo($p);
                }
                // Revoke all role permissions
                $roles = Role::all();
                foreach ($roles as $role) {
                    $role->revokePermissionTo($permission);
                }
                
                $p->delete();
            }
        }
    }

    private function createSettings()
    {
        foreach ($this->manifest['settings'] as $setting) {
            if (ApplicationSettings::get($setting['key']) === null) {
                ApplicationSettings::set($setting['key'], (is_array($setting['value']))
                                                    ? json_encode($setting['value'])
                                                    : $setting['value']);
            }
        }
    }

    private function dropSettings()
    {
        foreach ($this->manifest['settings'] as $setting) {
            ApplicationSettings::delete($setting['key']);
        }
    }

    private function copyAppJS()
    {
        $js = __DIR__.'/../public/DemoApp.js';
        $path = public_path("js/apps/");

        if (!file_exists($path)) {
            mkdir($path, 0777, true);
        }

        if (file_exists($path.$this->slug.'.js')) {
            unlink($path.$this->slug.'.js');
        }
        copy($js, $path.$this->slug.'.js');
    }

    private function dropAppJS()
    {
        $path = public_path("js/apps/");
        if (file_exists($path.$this->slug.'.js')) {
            unlink($path.$this->slug.'.js');
        }
    }
}
