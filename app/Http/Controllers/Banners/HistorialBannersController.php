<?php

namespace App\Http\Controllers\Banners;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HistorialBannersController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Banners/HistorialBanners', [

        ]);
    }

}