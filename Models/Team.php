<?php

namespace WebApps\Apps\DemoApp\Models;

use Akaunting\Setting\Facade as Setting;
use Illuminate\Database\Eloquent\Model;
use WebApps\Apps\DemoApp\Models\Member;

class Team extends Model
{
    protected $table = "app_demoApp_Teams";

    protected $fillable = [
        'name',
        'points'
    ];

    public function members()
    {
        return $this->hasMany(Member::class, 'team_id');
    }

    public function addWin()
    {
        $this->points = $this->points + Setting::get('app.DemoApp.teamPointsWin');
        $this->save();
    }
}
