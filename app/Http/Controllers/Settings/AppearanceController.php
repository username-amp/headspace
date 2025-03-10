<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AppearanceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('settings/appearance');
    }

    public function update(Request $request)
    {
        $request->validate([
            'appearance' => ['required', 'string', 'in:light,dark,system'],
        ]);

        $user = Auth::user();
        $user->appearance = $request->appearance;
        $user->save();

        return back();
    }
}
