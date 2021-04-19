<?php

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your WebApp App. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your App's API!
|
*/

use Illuminate\Support\Facades\Route;
use WebApps\Apps\DemoApp\Controllers\TeamsController;
use WebApps\Apps\DemoApp\Controllers\MembersController;

// These routes are accessible without authentication
Route::get('/teams', [TeamsController::class, 'teams']);
Route::get('/members', [MembersController::class, 'members']);

// These routes require authentication to access
Route::group(['middleware' => 'auth:sanctum'], function () {
    Route::post('/team', [TeamsController::class, 'create']);
    Route::put('/team', [TeamsController::class, 'store']);
    Route::delete('/team/{id}', [TeamsController::class, 'drop']);

    Route::post('/member', [MembersController::class, 'create']);
    Route::put('/member', [MembersController::class, 'store']);
    Route::delete('/member/{id}', [MembersController::class, 'drop']);

    Route::put('/member/{id}/win', [MembersController::class, 'addWin']);
});
