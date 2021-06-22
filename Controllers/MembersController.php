<?php

namespace WebApps\Apps\DemoApp\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use RobTrehy\LaravelApplicationSettings\ApplicationSettings;
use WebApps\Apps\DemoApp\Models\Member;

class MembersController extends Controller
{
    public function members()
    {
        return response()->json(['members' => Member::with('team')->get()], 200);
    }

    public function addWin($id)
    {
        $member = Member::findOrFail($id);
        $member->points = $member->points + ApplicationSettings::get('apps.demoApp.memberWinPoints');
        $member->save();

        $member->team->points = $member->team->points + ApplicationSettings::get('apps.demoApp.teamWinPoints');
        $member->team->save();

        return response()->json(['success' => 'true']);
    }

    public function create(Request $request)
    {
        Member::create([
            'forename' => $request->input('forename'),
            'surname' => $request->input('surname'),
            'short_name' => $request->input('short_name'),
            'team_id' => $request->input('team_id'),
            'points' => $request->input('points'),
        ]);

        return response()->json(['members' => Member::with('team')->get()], 200);
    }

    public function store(Request $request)
    {
        $member = Member::find($request->input('id'));
        $member->forename = $request->input('forename');
        $member->surname = $request->input('surname');
        $member->short_name = $request->input('short_name');
        $member->team_id = $request->input('team_id');
        $member->points = $request->input('points');
        $member->save();

        return response()->json(['members' => Member::with('team')->get()], 200);
    }

    public function drop($id)
    {
        Member::find($id)->delete();

        return response()->json(['members' => Member::with('team')->get()], 200);
    }
}
