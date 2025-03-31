<?php

namespace App\Http\Controllers\Facturacion;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class HistorialFacturasController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Facturacion/HistorialFacturas');
    }
}