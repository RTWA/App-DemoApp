<?php

namespace WebApps\Apps\DemoApp\Models;

use Illuminate\Database\Eloquent\Model;
use WebApps\Apps\DemoApp\Models\Team;

class Member extends Model
{
    protected $table = "app_demoApp_Members";

    protected $fillable = [
        'forename',
        'surname',
        'short_name',
        'points',
        'team_id'
    ];

    public function team()
    {
        return $this->belongsTo(Team::class);
    }
}
