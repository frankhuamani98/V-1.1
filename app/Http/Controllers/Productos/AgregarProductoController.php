<?php

namespace App\Http\Controllers\Productos;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class AgregarProductoController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Productos/AgregarProducto');
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string',
            'precio' => 'required|numeric|min:0',
            'imagen_principal' => 'nullable|image|max:5120',
            'imagen_principal_url' => 'nullable|url',
            'imagenes_adicionales' => 'nullable|array',
            'imagenes_adicionales.*.tipo' => 'required|in:archivo,url',
            'imagenes_adicionales.*.estilo' => 'required|string|max:255',
            'imagenes_adicionales.*.archivo' => 'required_if:imagenes_adicionales.*.tipo,archivo|image|max:5120',
            'imagenes_adicionales.*.url' => 'required_if:imagenes_adicionales.*.tipo,url|url',
        ]);

        // Validar que al menos una imagen principal esté presente
        if (!$request->hasFile('imagen_principal') && empty($request->imagen_principal_url)) {
            return back()->withErrors(['imagen_principal' => 'Debes proporcionar una imagen principal (archivo o URL)']);
        }

        // Procesar imagen principal
        $urlImagenPrincipal = '';
        
        if ($request->hasFile('imagen_principal')) {
            $imagenPrincipal = $request->file('imagen_principal');
            $nombreImagenPrincipal = Str::uuid() . '.' . $imagenPrincipal->extension();
            
            // Cambio aquí: Usar el disco 'public' directamente
            $imagenPrincipalPath = $imagenPrincipal->storeAs('productos', $nombreImagenPrincipal, 'public');
            $urlImagenPrincipal = asset('storage/' . $imagenPrincipalPath);
        } else {
            try {
                $url = $request->imagen_principal_url;
                $client = new \GuzzleHttp\Client([
                    'verify' => false,
                    'timeout' => 10,
                    'allow_redirects' => true,
                    'headers' => ['Accept' => 'image/*']
                ]);
                
                try {
                    $response = $client->head($url);
                    $contentType = $response->getHeaderLine('Content-Type');
                    if (!str_starts_with($contentType, 'image/')) {
                        return back()->withErrors(['imagen_principal_url' => 'La URL no apunta a una imagen válida']);
                    }
                    $urlImagenPrincipal = $url;
                } catch (\GuzzleHttp\Exception\RequestException $e) {
                    try {
                        $response = $client->get($url, ['headers' => ['Range' => 'bytes=0-1']]);
                        $contentType = $response->getHeaderLine('Content-Type');
                        if (!str_starts_with($contentType, 'image/')) {
                            return back()->withErrors(['imagen_principal_url' => 'La URL no apunta a una imagen válida']);
                        }
                        $urlImagenPrincipal = $url;
                    } catch (\Exception $e) {
                        return back()->withErrors(['imagen_principal_url' => 'No se pudo validar la URL de la imagen: ' . $e->getMessage()]);
                    }
                }
            } catch (\Exception $e) {
                return back()->withErrors(['imagen_principal_url' => 'Error al procesar la URL: ' . $e->getMessage()]);
            }
        }

        // Crear el producto
        $product = Product::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'precio' => $request->precio,
            'imagen_principal' => $urlImagenPrincipal,
        ]);

        // Procesar imágenes adicionales
        if ($request->has('imagenes_adicionales') && is_array($request->imagenes_adicionales)) {
            foreach ($request->imagenes_adicionales as $imagenAdicional) {
                try {
                    if ($imagenAdicional['tipo'] === 'archivo' && isset($imagenAdicional['archivo'])) {
                        // Procesar archivo subido
                        $imagen = $imagenAdicional['archivo'];
                        $nombreImagen = Str::uuid() . '.' . $imagen->extension();
                        
                        // Cambio aquí: Usar el disco 'public' directamente
                        $imagenPath = $imagen->storeAs('productos', $nombreImagen, 'public');
                        $urlImagen = asset('storage/' . $imagenPath);
                        
                        ProductImage::create([
                            'product_id' => $product->id,
                            'image_path' => $urlImagen,
                            'description' => $imagenAdicional['estilo']
                        ]);
                    } elseif ($imagenAdicional['tipo'] === 'url' && isset($imagenAdicional['url'])) {
                        // Procesar URL de imagen
                        $url = trim($imagenAdicional['url']);
                        if (!empty($url)) {
                            // Verificación básica para URLs adicionales
                            $client = new \GuzzleHttp\Client(['verify' => false, 'timeout' => 5]);
                            
                            try {
                                $response = $client->head($url);
                                $contentType = $response->getHeaderLine('Content-Type');
                                
                                if (str_starts_with($contentType, 'image/')) {
                                    ProductImage::create([
                                        'product_id' => $product->id,
                                        'image_path' => $url,
                                        'description' => $imagenAdicional['estilo']
                                    ]);
                                }
                            } catch (\GuzzleHttp\Exception\RequestException $e) {
                                // Si falla HEAD, intentamos agregar igual con el estilo
                                ProductImage::create([
                                    'product_id' => $product->id,
                                    'image_path' => $url,
                                    'description' => $imagenAdicional['estilo']
                                ]);
                            }
                        }
                    }
                } catch (\Exception $e) {
                    continue; // Continuar con la siguiente imagen si hay error
                }
            }
        }

        return redirect()->back()->with('success', 'Producto agregado correctamente');
    }
}