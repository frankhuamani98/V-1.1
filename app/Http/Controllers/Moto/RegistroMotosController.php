<?php

namespace App\Http\Controllers\Moto;

use App\Http\Controllers\Controller;
use App\Models\Moto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegistroMotosController extends Controller
{
    public function index()
    {
        $motos = Moto::all();

        return Inertia::render('Dashboard/Motos/RegistroMotos', [
            'motos' => $motos,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'año' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'modelo' => 'required|string|max:255',
            'marca' => 'required|string|max:255',
            'estado' => 'required|string|in:Activo,Inactivo',
        ]);

        $exists = Moto::where('año', $request->año)
            ->where('marca', $request->marca)
            ->where('modelo', $request->modelo)
            ->exists();
        if ($exists) {
            return redirect()->back()
                ->withErrors(['modelo' => 'Ya existe una moto con ese año, marca y modelo.'])
                ->withInput();
        }

        Moto::create($request->all());

        return redirect()->route('motos.registro')->with('success', 'Moto registrada correctamente.');
    }

    public function update(Request $request, Moto $moto)
    {
        $request->validate([
            'año' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'modelo' => 'required|string|max:255',
            'marca' => 'required|string|max:255',
            'estado' => 'required|string|in:Activo,Inactivo',
        ]);

        $exists = Moto::where('año', $request->año)
            ->where('marca', $request->marca)
            ->where('modelo', $request->modelo)
            ->where('id', '!=', $moto->id)
            ->exists();
        if ($exists) {
            return redirect()->back()
                ->withErrors(['modelo' => 'Ya existe otra moto con ese año, marca y modelo.'])
                ->withInput();
        }

        $moto->update($request->all());

        return redirect()->route('motos.registro')->with('success', 'Moto actualizada correctamente.');
    }

    public function destroy(Moto $moto)
    {
        $moto->delete();

        return redirect()->route('motos.registro')->with('success', 'Moto eliminada correctamente.');
    }
}