<?php

namespace App\Http\Controllers\Reservas;

use Inertia\Inertia;
use App\Http\Controllers\Controller;

class HistorialReservasController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Reservas/HistorialReservas');
    }
}