<?php

namespace App\Http\Controllers\Productos;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class AgregarProductoController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Productos/AgregarProducto');
    }
}