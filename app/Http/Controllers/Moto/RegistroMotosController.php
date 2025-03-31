<?php

namespace App\Http\Controllers\Moto;

use App\Http\Controllers\Controller;
use App\Models\Moto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RegistroMotosController extends Controller
{
    // Método para mostrar la vista con la lista de motos
    public function index()
    {
        // Obtener todas las motos de la base de datos
        $motos = Moto::all();

        // Enviar las motos a la vista
        return Inertia::render('Dashboard/Motos/RegistroMotos', [
            'motos' => $motos,
        ]);
    }

    // Método para guardar una nueva moto
    public function store(Request $request)
    {
        // Validar los datos del formulario
        $request->validate([
            'año' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'modelo' => 'required|string|max:255',
            'marca' => 'required|string|max:255',
            'estado' => 'required|string|in:Activo,Inactivo',
        ]);

        // Crear la moto en la base de datos
        Moto::create($request->all());

        // Redirigir con un mensaje de éxito
        return redirect()->route('motos.registro')->with('success', 'Moto registrada correctamente.');
    }

    // Método para actualizar una moto existente
    public function update(Request $request, Moto $moto)
    {
        // Validar los datos del formulario
        $request->validate([
            'año' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'modelo' => 'required|string|max:255',
            'marca' => 'required|string|max:255',
            'estado' => 'required|string|in:Activo,Inactivo',
        ]);

        // Actualizar la moto en la base de datos
        $moto->update($request->all());

        // Redirigir con un mensaje de éxito
        return redirect()->route('motos.registro')->with('success', 'Moto actualizada correctamente.');
    }

    // Método para eliminar una moto
    public function destroy(Moto $moto)
    {
        // Eliminar la moto de la base de datos
        $moto->delete();

        // Redirigir con un mensaje de éxito
        return redirect()->route('motos.registro')->with('success', 'Moto eliminada correctamente.');
    }
}