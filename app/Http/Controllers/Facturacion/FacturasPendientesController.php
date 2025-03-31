<?php

namespace App\Http\Controllers\Facturacion;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class FacturasPendientesController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Facturacion/FacturasPendientes');
    }
}