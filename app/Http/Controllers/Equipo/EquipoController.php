<?php

namespace App\Http\Controllers\Equipo;

use App\Http\Controllers\Controller;
use App\Models\Equipo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class EquipoController extends Controller
{
    public function index()
    {
        $equipo = Equipo::orderBy('created_at', 'desc')->get();
        return Inertia::render('Dashboard/Equipo/Equipo', [
            'equipo' => $equipo
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'cargo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'imagen' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $imagePath = $request->file('imagen')->store('equipo', 'public');
        $imagePath = Storage::url('equipo/' . basename($imagePath));

        Equipo::create([
            'nombre' => $request->nombre,
            'cargo' => $request->cargo,
            'descripcion' => $request->descripcion,
            'imagen' => $imagePath,
            'activo' => true
        ]);

        return redirect()->back()->with('success', 'Miembro del equipo agregado correctamente');
    }

    public function update(Request $request, Equipo $equipo)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'cargo' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $data = $request->only(['nombre', 'cargo', 'descripcion', 'activo']);

        if ($request->hasFile('imagen')) {
            // Delete old image
            if ($equipo->imagen) {
                $oldPath = str_replace('/storage/', '', $equipo->imagen);
                Storage::disk('public')->delete($oldPath);
            }

            $imagePath = $request->file('imagen')->store('equipo', 'public');
            $data['imagen'] = Storage::url('equipo/' . basename($imagePath));
        }

        $equipo->update($data);

        return redirect()->back()->with('success', 'Miembro del equipo actualizado correctamente');
    }

    public function destroy(Equipo $equipo)
    {
        if ($equipo->imagen) {
            $path = str_replace('/storage/', '', $equipo->imagen);
            Storage::disk('public')->delete($path);
        }

        $equipo->delete();

        return redirect()->back()->with('success', 'Miembro del equipo eliminado correctamente');
    }

    public function toggleActive(Equipo $equipo)
    {
        $equipo->update([
            'activo' => !$equipo->activo
        ]);

        return redirect()->back()->with('success', 'Estado actualizado correctamente');
    }
}