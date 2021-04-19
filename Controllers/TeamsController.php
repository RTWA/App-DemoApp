<?php

namespace WebApps\Apps\DemoApp\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use WebApps\Apps\DemoApp\Models\Team;

class TeamsController extends Controller
{
    public function teams()
    {
        return response()->json(['teams' => Team::with('members')->get()], 200);
    }

    public function create(Request $request)
    {
        Team::create([
            'name' => $request->input('name'),
            'points' => $request->input('points'),
        ]);

        return response()->json(['teams' => Team::with('members')->get()], 200);
    }

    public function store(Request $request)
    {
        $team = Team::find($request->input('id'));
        $team->name = $request->input('name');
        $team->points = $request->input('points');
        $team->save();

        return response()->json(['teams' => Team::with('members')->get()], 200);
    }

    public function drop($id)
    {
        Team::find($id)->delete();

        return response()->json(['teams' => Team::with('members')->get()], 200);
    }
}
