<?php

namespace App\Http\Controllers\Pedidos;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

class EstadoPedidosController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Pedidos/EstadoPedidosPage');
    }
}