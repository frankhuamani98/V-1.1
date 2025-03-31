<?php

namespace App\Http\Controllers\Pedidos;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

class NuevosPedidosController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Pedidos/NuevosPedidosPage');
    }
}