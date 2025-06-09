<?php

namespace App\Http\Controllers\Facturacion;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ManualController extends Controller
{    public function index()
    {
        return Inertia::render('Dashboard/Facturacion/Manual');
    }
}
