<?php

namespace App\Http\Controllers\Opinion;

use App\Http\Controllers\Controller;
use App\Models\Opinion;
use App\Models\RespuestaOpinion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class DashboardOpinionController extends Controller
{
    /**
     * Mostrar todas las opiniones en el dashboard
     */
    public function index()
    {
        $opiniones = Opinion::with(['usuario', 'respuestas.usuario'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('Dashboard/Opinion/ListaOpinion', [
            'opiniones' => $opiniones
        ]);
    }

    /**
     * Eliminar una opinión desde el dashboard
     */
    public function destroy($id)
    {
        $opinion = Opinion::findOrFail($id);
        $opinion->delete();
        
        return redirect()->back()
            ->with('message', 'Opinión eliminada correctamente');
    }

    /**
     * Eliminar una respuesta desde el dashboard
     */
    public function eliminarRespuesta($id)
    {
        $respuesta = RespuestaOpinion::findOrFail($id);
        $respuesta->delete();
        
        return redirect()->back()
            ->with('message', 'Respuesta eliminada correctamente');
    }

    /**
     * Responder a una opinión desde el dashboard
     */
    public function responder(Request $request, $id)
    {
        $request->validate([
            'contenido' => 'required|string|max:1000',
        ]);

        $opinion = Opinion::findOrFail($id);
        
        $respuesta = RespuestaOpinion::create([
            'opinion_id' => $opinion->id,
            'user_id' => Auth::id(),
            'contenido' => $request->contenido,
            'es_soporte' => true // Always true for dashboard responses
        ]);

        return redirect()->back()
            ->with('message', 'Respuesta publicada correctamente');
    }

    /**
     * Marcar una opinión como útil desde el dashboard
     */
    public function marcarUtil($id)
    {
        $opinion = Opinion::findOrFail($id);
        $opinion->increment('util');
        
        return redirect()->back()
            ->with('message', 'Opinión marcada como útil');
    }
}