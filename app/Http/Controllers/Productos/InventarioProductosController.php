<?php

namespace App\Http\Controllers\Productos;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

class InventarioProductosController extends Controller
{
    public function index()
    {

        return Inertia::render('Dashboard/Productos/InventarioProductos', [

        ]);
    }
}