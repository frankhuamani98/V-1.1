<?php

namespace App\Http\Controllers\Opinion;

use App\Http\Controllers\Controller;
use App\Models\Opinion;
use App\Models\RespuestaOpinion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OpinionController extends Controller
{
    public function index()
    {
        $opiniones = Opinion::with(['usuario', 'respuestas.usuario'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('Home/Opiniones', [
            'opiniones' => $opiniones
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'calificacion' => 'required|integer|min:1|max:5',
            'contenido' => 'required|string|max:1000',
        ]);

        $opinion = Opinion::create([
            'user_id' => Auth::id(),
            'calificacion' => $request->calificacion,
            'contenido' => $request->contenido,
            'util' => 0,
            'es_soporte' => Auth::user()->role === 'admin'
        ]);

        $opinion->load('usuario');

        return redirect()->back()
            ->with('message', 'Opinión publicada correctamente')
            ->with(['scroll' => false])
            ->with('opinion', [
                'id' => $opinion->id,
                'calificacion' => $opinion->calificacion,
                'contenido' => $opinion->contenido,
                'util' => $opinion->util,
                'es_soporte' => $opinion->es_soporte,
                'created_at' => $opinion->created_at->diffForHumans(),
                'usuario' => [
                    'id' => $opinion->usuario->id,
                    'nombre' => $opinion->usuario->first_name . ' ' . $opinion->usuario->last_name,
                    'iniciales' => $opinion->es_soporte ? 'ES' :
                                strtoupper(substr($opinion->usuario->first_name, 0, 1) . 
                                substr($opinion->usuario->last_name, 0, 1))
                ],
                'respuestas' => []
            ]);
    }

    public function marcarUtil(Request $request, $id)
    {
        $opinion = Opinion::findOrFail($id);
        $opinion->increment('util');
        
        return redirect()->back()
            ->with('message', 'Opinión marcada como útil')
            ->with('util', $opinion->util)
            ->with('scroll', false);
    }


    public function responder(Request $request, $id)
    {
        $request->validate([
            'contenido' => 'required|string|max:1000',
        ]);

        $opinion = Opinion::findOrFail($id);
        $usuario = Auth::user();
        $esSoporte = $usuario->role === 'admin';

        $respuesta = RespuestaOpinion::create([
            'opinion_id' => $opinion->id,
            'user_id' => $usuario->id,
            'contenido' => $request->contenido,
            'es_soporte' => $esSoporte
        ]);

        $respuesta->load('usuario');

        return redirect()->back()
            ->with('message', 'Respuesta publicada correctamente')
            ->with(['scroll' => false])
            ->with('respuesta', [
                'id' => $respuesta->id,
                'contenido' => $respuesta->contenido,
                'es_soporte' => $respuesta->es_soporte,
                'created_at' => $respuesta->created_at->diffForHumans(),
                'usuario' => [
                    'id' => $respuesta->usuario->id,
                    'nombre' => $respuesta->usuario->first_name . ' ' . $respuesta->usuario->last_name,
                    'iniciales' => $respuesta->es_soporte ? 'ES' : 
                                 strtoupper(substr($respuesta->usuario->first_name, 0, 1) . 
                                 substr($respuesta->usuario->last_name, 0, 1))
                ]
            ]);
    }

    public function destroy($id)
    {
        $opinion = Opinion::findOrFail($id);
        $usuario = Auth::user();
        
        if ($opinion->user_id !== $usuario->id && $usuario->role !== 'admin') {
            return redirect()->back()
                ->with('error', 'No tienes permiso para eliminar esta opinión');
        }

        $opinion->delete();
        
        return redirect()->back()
            ->with('message', 'Opinión eliminada correctamente');
    }

    public function eliminarRespuesta($id)
    {
        $respuesta = RespuestaOpinion::findOrFail($id);
        $usuario = Auth::user();
        
        if ($respuesta->user_id !== $usuario->id && $usuario->role !== 'admin') {
            return redirect()->back()
                ->with('error', 'No tienes permiso para eliminar esta respuesta');
        }

        $respuesta->delete();
        
        return redirect()->back()
            ->with('message', 'Respuesta eliminada correctamente');
    }
}