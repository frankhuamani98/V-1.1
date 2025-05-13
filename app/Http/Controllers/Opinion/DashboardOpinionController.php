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
    public function index()
    {
        $opiniones = Opinion::with(['usuario', 'respuestas.usuario'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('Dashboard/Opinion/ListaOpinion', [
            'opiniones' => $opiniones
        ]);
    }

    public function destroy($id)
    {
        $opinion = Opinion::findOrFail($id);
        $opinion->delete();
        
        return redirect()->back()
            ->with('message', 'Opinión eliminada correctamente');
    }

    public function eliminarRespuesta($id)
    {
        $respuesta = RespuestaOpinion::findOrFail($id);
        $respuesta->delete();
        
        return redirect()->back()
            ->with('message', 'Respuesta eliminada correctamente');
    }

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
            'es_soporte' => true
        ]);

        return redirect()->back()
            ->with('message', 'Respuesta publicada correctamente');
    }

    public function marcarUtil($id)
    {
        $opinion = Opinion::findOrFail($id);
        $opinion->increment('util');
        
        return redirect()->back()
            ->with('message', 'Opinión marcada como útil');
    }
}