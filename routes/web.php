<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\{DashboardController, WelcomeController, ResultadosController, NotificacionController};
use App\Http\Controllers\Usuarios\{ListaUsuariosController, AdministradoresController};
use App\Http\Controllers\Productos\{AgregarProductoController, InventarioProductosController, DetalleProductoController};
use App\Http\Controllers\Servicio\{CategoriaServicioController, ServicioController};
use App\Http\Controllers\Reserva\{DashboardHorarioController, ReservaController, DashboardReservaController, HorarioController};
use App\Http\Controllers\Moto\RegistroMotosController;
use App\Http\Controllers\Facturacion\{FacturaController, BoletaController, NotaVentasController};
use App\Http\Controllers\Soporte\{ManualUsuarioController, SoporteTecnicoController};
use App\Http\Controllers\Opinion\{OpinionController, DashboardOpinionController};
use App\Http\Controllers\Banners\{SubirBannersController, HistorialBannersController};
use App\Http\Controllers\Pedidos\{EstadoPedidosController, NuevosPedidosController, PedidosFinalizadosController, HistorialPedidosController, MisPedidosController};
use App\Http\Controllers\Categorias\{CategoriasPrincipalesController, SubcategoriasController, ListaCategoriasController, CategoriaPublicaController};
use App\Http\Controllers\Contacto\ContactoController;
use App\Http\Controllers\Auth\ProfileController;
use App\Http\Controllers\Shop\{CartController, FavoriteController};
use App\Http\Controllers\Checkout\{FormularioPagoController, MetodosPagoController, ConfirmacionPagoController, ProcesandoPagoController, InformacionCheckout};
use App\Http\Controllers\Equipo\EquipoController;



// Rutas Públicas
Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/resultados', [ResultadosController::class, 'index'])->name('resultados');
Route::get('/details/{id}', [DetalleProductoController::class, 'show'])->name('productos.detalles');

// Ruta para Nosotros
Route::get('/nosotros', function () {
    $equipo = \App\Models\Equipo::where('activo', true)->get();
    return Inertia::render('Home/Partials/Nosotros/NosotrosPage', [
        'equipo' => $equipo
    ]);
})->name('nosotros');

// Rutas para categorias públicas
Route::get('/categorias', [CategoriaPublicaController::class, 'index'])->name('categorias.index');
Route::get('/categorias/{categoria}', [CategoriaPublicaController::class, 'show'])
    ->name('categorias.show')
    ->where('categoria', '[0-9]+');

// Rutas para servicios públicos
Route::prefix('catalogo-servicios')->name('servicios.publico.')->group(function () {
    Route::get('/', [ServicioController::class, 'publicIndex'])->name('index');
    Route::get('/categoria/{categoria}', [ServicioController::class, 'publicCategory'])
        ->name('categoria')
        ->where('categoria', '[0-9]+');
    
    // Debe ir al final porque contiene un parámetro dinámico
    Route::get('/{servicio}', [ServicioController::class, 'publicShow'])
        ->name('show')
        ->where('servicio', '[0-9]+');
});

// Rutas de Contacto (públicas)
Route::prefix('contacto')->group(function () {
    Route::get('/ubicacion', [ContactoController::class, 'ubicacion'])->name('contacto.ubicacion');
    Route::get('/contactanos', [ContactoController::class, 'contactanos'])->name('contacto.contactanos');
    Route::get('/redes-sociales', [ContactoController::class, 'redesSociales'])->name('contacto.redes-sociales');
});

// Autenticación
require __DIR__.'/auth.php';

// Rutas Protegidas
Route::middleware('auth')->group(function () {
    // Dashboard
    Route::get('/dashboard', function () {
        if (!auth()->check() || auth()->user()->role !== 'admin') {
            return redirect('/')->with('error', 'Solo los administradores pueden acceder al dashboard.');
        }
        return app(\App\Http\Controllers\DashboardController::class)->index(request());
    })->name('dashboard');

    // Notificaciones
    Route::prefix('dashboard/notificaciones')->name('notificaciones.')->group(function () {
        Route::get('/', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden ver las notificaciones.');
            }
            return app(\App\Http\Controllers\NotificacionController::class)->index(request());
        })->name('index');
        Route::get('/obtener', [NotificacionController::class, 'obtenerNotificaciones'])->name('obtener');
        Route::post('/marcar-leida/{id}', [NotificacionController::class, 'marcarComoLeida'])->name('marcar-leida');
        Route::post('/marcar-todas-leidas', [NotificacionController::class, 'marcarTodasComoLeidas'])->name('marcar-todas-leidas');
    });

    // Facturación routes
    Route::prefix('facturacion')->name('facturacion.')->middleware(['auth'])->group(function () {
        Route::get('/factura', [FacturaController::class, 'index'])->name('factura');
        Route::get('/boleta', [BoletaController::class, 'index'])->name('boleta');
        Route::get('/nota-ventas', [NotaVentasController::class, 'index'])->name('nota.ventas');
    });

    // Cart routes (protegido solo admin)
    Route::prefix('cart')->name('cart.')->group(function () {
        Route::get('/', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden ver el carrito.');
            }
            return app(\App\Http\Controllers\Shop\CartController::class)->index(request());
        })->name('index');
        Route::post('/add', [CartController::class, 'store'])->name('add');
        Route::put('/{id}', [CartController::class, 'update'])->name('update');
        Route::delete('/{id}', [CartController::class, 'destroy'])->name('remove');
        Route::delete('/', [CartController::class, 'clear'])->name('clear');
    });

    // Checkout routes (protegido solo admin)
    Route::prefix('checkout')->name('checkout.')->group(function () {
        Route::get('/metodos-pago', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden ver los métodos de pago.');
            }
            return app(\App\Http\Controllers\Checkout\MetodosPagoController::class)->index(request());
        })->name('metodos');
        Route::post('/metodos-pago/procesar', [MetodosPagoController::class, 'procesar'])->name('metodos.procesar');
        Route::get('/procesando', [ProcesandoPagoController::class, 'index'])->name('procesando');
        Route::post('/procesar-pago', [ProcesandoPagoController::class, 'procesar'])->name('procesar');
        Route::get('/confirmacion', [ConfirmacionPagoController::class, 'index'])->name('confirmacion');
        Route::get('/confirmacion/{id}', [ConfirmacionPagoController::class, 'show'])->name('confirmacion.show');
        Route::get('/informacion', [InformacionCheckout::class, 'index'])->name('informacion');
        Route::post('/informacion', [InformacionCheckout::class, 'store'])->name('informacion.store');
        Route::post('/direccion-alternativa', [InformacionCheckout::class, 'guardarDireccionAlternativa'])->name('direccion.alternativa');
    });

    // Favorite routes (protegido solo admin)
    Route::prefix('favorites')->name('favorites.')->group(function () {
        Route::get('/', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden ver favoritos.');
            }
            return app(\App\Http\Controllers\Shop\FavoriteController::class)->index(request());
        })->name('index');
        Route::post('/add', [FavoriteController::class, 'store'])->name('add');
        Route::delete('/{id}', [FavoriteController::class, 'destroy'])->name('remove');
        Route::post('/toggle', [FavoriteController::class, 'toggle'])->name('toggle');
        Route::get('/check/{productoId}', [FavoriteController::class, 'check'])->name('check');
        Route::delete('/', [FavoriteController::class, 'clear'])->name('clear');
    });

    // Usuarios
    Route::prefix('usuarios')->group(function () {
        Route::get('/', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden ver la lista de usuarios.');
            }
            return app(\App\Http\Controllers\Usuarios\ListaUsuariosController::class)->index(request());
        })->name('usuarios.index');
        Route::put('/{user}', [ListaUsuariosController::class, 'update'])->name('usuarios.update');
        Route::prefix('administradores')->group(function () {
            Route::get('/', function () {
                if (!auth()->check() || auth()->user()->role !== 'admin') {
                    return redirect('/')->with('error', 'Solo los administradores pueden ver la lista de administradores.');
                }
                return app(\App\Http\Controllers\Usuarios\AdministradoresController::class)->index(request());
            })->name('usuarios.administradores.index');
            Route::delete('/{user}', [AdministradoresController::class, 'destroy'])->name('usuarios.administradores.destroy');
            Route::post('/{user}/promote', [AdministradoresController::class, 'promote'])->name('usuarios.administradores.promote');
        });
    });

    // Dashboard Reservas
    Route::prefix('dashboard/reservas')->name('dashboard.reservas.')->group(function () {
        Route::get('/', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden acceder al dashboard de reservas.');
            }
            return app(\App\Http\Controllers\Reserva\DashboardReservaController::class)->index(request());
        })->name('index');
        Route::get('/confirmadas', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden ver las reservas confirmadas.');
            }
            return app(\App\Http\Controllers\Reserva\DashboardReservaController::class)->confirmadas(request());
        })->name('confirmadas');
        Route::patch('/{reserva}/estado', [DashboardReservaController::class, 'actualizarEstado'])
            ->where('reserva', '[0-9]+')
            ->name('actualizar-estado');
        Route::patch('/{reserva}/reprogramar', [DashboardReservaController::class, 'reprogramar'])
            ->where('reserva', '[0-9]+')
            ->name('reprogramar');
        Route::prefix('horario-atencion')->name('horario.')->group(function () {
            Route::get('/', function () {
                if (!auth()->check() || auth()->user()->role !== 'admin') {
                    return redirect('/')->with('error', 'Solo los administradores pueden acceder a los horarios de atención.');
                }
                return app(\App\Http\Controllers\Reserva\DashboardHorarioController::class)->index(request());
            })->name('index');
            Route::prefix('recurrentes')->name('recurrentes.')->group(function () {
                Route::get('/crear', [DashboardHorarioController::class, 'createRecurrente'])->name('create');
                Route::post('/', [DashboardHorarioController::class, 'storeRecurrente'])->name('store');
                Route::get('/{horario}/editar', [DashboardHorarioController::class, 'editRecurrente'])
                    ->where('horario', '[0-9]+')
                    ->name('edit');
                Route::put('/{horario}', [DashboardHorarioController::class, 'updateRecurrente'])
                    ->where('horario', '[0-9]+')
                    ->name('update');
                Route::delete('/{horario}', [DashboardHorarioController::class, 'destroyRecurrente'])
                    ->where('horario', '[0-9]+')
                    ->name('destroy');
            });
            Route::prefix('excepciones')->name('excepciones.')->group(function () {
                Route::get('/crear', [DashboardHorarioController::class, 'createExcepcion'])->name('create');
                Route::post('/', [DashboardHorarioController::class, 'storeExcepcion'])->name('store');
                Route::get('/{horario}/editar', [DashboardHorarioController::class, 'editExcepcion'])
                    ->where('horario', '[0-9]+')
                    ->name('edit');
                Route::put('/{horario}', [DashboardHorarioController::class, 'updateExcepcion'])
                    ->where('horario', '[0-9]+')
                    ->name('update');
                Route::delete('/{horario}', [DashboardHorarioController::class, 'destroyExcepcion'])
                    ->where('horario', '[0-9]+')
                    ->name('destroy');
            });
            Route::get('/disponibles', [DashboardHorarioController::class, 'horariosDisponibles'])->name('disponibles');
        });
        Route::get('/{reserva}', [DashboardReservaController::class, 'show'])
            ->where('reserva', '[0-9]+')
            ->name('show');
    });

    // Categorías
    Route::prefix('categorias')->group(function () {
        Route::get('/lista', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden ver la lista de categorías.');
            }
            return app(\App\Http\Controllers\Categorias\ListaCategoriasController::class)->index(request());
        })->name('categorias.lista');
        Route::prefix('principales')->group(function () {
            Route::get('/', function () {
                if (!auth()->check() || auth()->user()->role !== 'admin') {
                    return redirect('/')->with('error', 'Solo los administradores pueden ver las categorías principales.');
                }
                return app(\App\Http\Controllers\Categorias\CategoriasPrincipalesController::class)->index(request());
            })->name('categorias.principales');
            Route::post('/', [CategoriasPrincipalesController::class, 'store'])->name('categorias.principales.store');
            Route::put('/{id}', [CategoriasPrincipalesController::class, 'update'])->name('categorias.principales.update');
            Route::delete('/{id}', [CategoriasPrincipalesController::class, 'destroy'])->name('categorias.principales.destroy');
        });
        Route::prefix('subcategorias')->group(function () {
            Route::get('/', function () {
                if (!auth()->check() || auth()->user()->role !== 'admin') {
                    return redirect('/')->with('error', 'Solo los administradores pueden ver las subcategorías.');
                }
                return app(\App\Http\Controllers\Categorias\SubcategoriasController::class)->index(request());
            })->name('subcategorias.index');
            Route::post('/', [SubcategoriasController::class, 'store'])->name('subcategorias.store');
            Route::put('/{subcategoria}', [SubcategoriasController::class, 'update'])->name('subcategorias.update');
            Route::delete('/{subcategoria}', [SubcategoriasController::class, 'destroy'])->name('subcategorias.destroy');
        });
    });
    
    // Motos
    Route::prefix('motos')->group(function () {
        Route::get('/registro', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden ver el registro de motos.');
            }
            return app(\App\Http\Controllers\Moto\RegistroMotosController::class)->index(request());
        })->name('motos.registro');
        Route::post('/registro', [RegistroMotosController::class, 'store'])->name('motos.store');
        Route::put('/registro/{moto}', [RegistroMotosController::class, 'update'])->name('motos.update');
        Route::delete('/registro/{moto}', [RegistroMotosController::class, 'destroy'])->name('motos.destroy');
    });
    
    // Productos
    Route::prefix('productos')->group(function () {
        Route::get('/agregar', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden agregar productos.');
            }
            return app(\App\Http\Controllers\Productos\AgregarProductoController::class)->index(request());
        })->name('productos.agregar');
        Route::post('/agregar', [AgregarProductoController::class, 'store'])->name('productos.store');
        Route::get('/inventario', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden acceder al inventario.');
            }
            return app(\App\Http\Controllers\Productos\InventarioProductosController::class)->index(request());
        })->name('productos.inventario');
        Route::delete('/{producto}', [InventarioProductosController::class, 'destroy'])->name('productos.destroy');
    });

    // Servicios
    Route::prefix('servicios')->name('servicios.')->group(function () {
        Route::get('/', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden ver la lista de servicios.');
            }
            return app(\App\Http\Controllers\Servicio\ServicioController::class)->index(request());
        })->name('lista');
        Route::get('/crear', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden crear servicios.');
            }
            return app(\App\Http\Controllers\Servicio\ServicioController::class)->create(request());
        })->name('crear');
        Route::post('/', [ServicioController::class, 'store'])->name('store');
        Route::get('/todos', [ServicioController::class, 'getAll'])->name('todos');
        Route::prefix('categorias')->name('categorias.')->group(function () {
            Route::get('/crear', function () {
                if (!auth()->check() || auth()->user()->role !== 'admin') {
                    return redirect('/')->with('error', 'Solo los administradores pueden crear categorías de servicios.');
                }
                return app(\App\Http\Controllers\Servicio\CategoriaServicioController::class)->create(request());
            })->name('crear');
            Route::post('/', [CategoriaServicioController::class, 'store'])->name('store');
            Route::get('/todas', [CategoriaServicioController::class, 'getAll'])->name('todas');
            Route::get('/{categoriaServicio}/editar', [CategoriaServicioController::class, 'edit'])->name('editar')->where('categoriaServicio', '[0-9]+');
            Route::put('/{categoriaServicio}', [CategoriaServicioController::class, 'update'])->name('update')->where('categoriaServicio', '[0-9]+');
            Route::delete('/{categoriaServicio}', [CategoriaServicioController::class, 'destroy'])->name('destroy')->where('categoriaServicio', '[0-9]+');
        });
        Route::get('/{servicio}/editar', [ServicioController::class, 'edit'])->name('editar')->where('servicio', '[0-9]+');
        Route::put('/{servicio}', [ServicioController::class, 'update'])->name('update')->where('servicio', '[0-9]+');
        Route::delete('/{servicio}', [ServicioController::class, 'destroy'])->name('destroy')->where('servicio', '[0-9]+');
    });

    // Reservas
    Route::prefix('reservas')->name('reservas.')->group(function () {
        Route::get('/', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden ver las reservas.');
            }
            return app(\App\Http\Controllers\Reserva\ReservaController::class)->index(request());
        })->name('index');
        Route::get('/agendar', [ReservaController::class, 'create'])->name('create');
        Route::post('/', [ReservaController::class, 'store'])->name('store');
        Route::get('/servicios-disponibles', [ReservaController::class, 'serviciosDisponibles'])->name('servicios-disponibles');
        Route::get('/horarios-atencion', [HorarioController::class, 'index'])->name('horarios-atencion');
        Route::get('/horas-disponibles', [ReservaController::class, 'horasDisponibles'])->name('horas-disponibles');
        Route::get('/{reserva}', [ReservaController::class, 'show'])->name('show');
        Route::get('/{reserva}/editar', [ReservaController::class, 'edit'])->name('edit');
        Route::put('/{reserva}', [ReservaController::class, 'update'])->name('update');
        Route::delete('/{reserva}', [ReservaController::class, 'destroy'])->name('destroy');
    });

    // Pedidos
    Route::prefix('pedidos')->group(function () {

        Route::get('/mis-pedidos', [MisPedidosController::class, 'index'])->name('pedidos.mis-pedidos');

        Route::get('/nuevos', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden acceder a los pedidos nuevos.');
            }
            return app(\App\Http\Controllers\Pedidos\NuevosPedidosController::class)->index(request());
        })->name('pedidos.nuevos');
        Route::get('/estado', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden acceder al estado de pedidos.');
            }
            return app(\App\Http\Controllers\Pedidos\EstadoPedidosController::class)->index(request());
        })->name('pedidos.estado');
        Route::get('/finalizados', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden acceder a los pedidos finalizados.');
            }
            return app(\App\Http\Controllers\Pedidos\PedidosFinalizadosController::class)->index(request());
        })->name('pedidos.finalizados');
        Route::get('/historial', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden acceder al historial de pedidos.');
            }
            return app(\App\Http\Controllers\Pedidos\HistorialPedidosController::class)->index(request());
        })->name('pedidos.historial');
        Route::patch('/{pedido}/actualizar-estado', [NuevosPedidosController::class, 'actualizarEstado'])->name('pedidos.actualizar-estado');
    });

    // Opiniones
    Route::prefix('opiniones')->group(function () {
        Route::get('/', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden ver las opiniones.');
            }
            return app(\App\Http\Controllers\Opinion\OpinionController::class)->index(request());
        })->name('opiniones.index');
        Route::middleware(['auth'])->group(function () {
            Route::post('/', [OpinionController::class, 'store'])->name('opiniones.store');
            Route::post('/{id}/util', [OpinionController::class, 'marcarUtil'])->name('opiniones.util');
            Route::post('/{id}/responder', [OpinionController::class, 'responder'])->name('opiniones.responder');
            Route::delete('/{id}', [OpinionController::class, 'destroy'])->name('opiniones.destroy');
            Route::delete('/respuesta/{id}', [OpinionController::class, 'eliminarRespuesta'])->name('opiniones.respuesta.destroy');
        });
    });

    // Dashboard - Opiniones
    Route::prefix('dashboard')->group(function () {
        Route::get('/opiniones', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden ver el dashboard de opiniones.');
            }
            return app(\App\Http\Controllers\Opinion\DashboardOpinionController::class)->index(request());
        })->name('dashboard.opiniones.index');
        Route::delete('/opiniones/{id}', [DashboardOpinionController::class, 'destroy'])->name('dashboard.opiniones.destroy');
        Route::delete('/opiniones/respuesta/{id}', [DashboardOpinionController::class, 'eliminarRespuesta'])->name('dashboard.opiniones.respuesta.destroy');
        Route::post('/opiniones/{id}/responder', [DashboardOpinionController::class, 'responder'])->name('dashboard.opiniones.responder');
        Route::post('/opiniones/{id}/util', [DashboardOpinionController::class, 'marcarUtil'])->name('dashboard.opiniones.util');
    });

    // Banners
    Route::prefix('banners')->group(function () {
        Route::get('/subir', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden subir banners.');
            }
            return app(\App\Http\Controllers\Banners\SubirBannersController::class)->index(request());
        })->name('banners.subir');
        Route::post('/subir', [SubirBannersController::class, 'store'])->name('banners.store');
        Route::get('/historial', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden ver el historial de banners.');
            }
            return app(\App\Http\Controllers\Banners\HistorialBannersController::class)->index(request());
        })->name('banners.historial');
        Route::put('/{banner}/toggle-status', [HistorialBannersController::class, 'toggleStatus'])->name('banners.toggle-status');
        Route::delete('/{banner}', [HistorialBannersController::class, 'destroy'])->name('banners.destroy');
    });


    // Soporte
    Route::prefix('soporte')->group(function () {
        Route::get('/manual', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden ver el manual de usuario.');
            }
            return app(\App\Http\Controllers\Soporte\ManualUsuarioController::class)->index(request());
        })->name('soporte.manual');
        Route::get('/tecnico', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden ver el soporte técnico.');
            }
            return app(\App\Http\Controllers\Soporte\SoporteTecnicoController::class)->index(request());
        })->name('soporte.tecnico');
    });

    // Rutas para la gestión del equipo
    Route::prefix('equipo')->name('equipo.')->group(function () {
        Route::get('/dashboard', function () {
            if (!auth()->check() || auth()->user()->role !== 'admin') {
                return redirect('/')->with('error', 'Solo los administradores pueden ver el dashboard del equipo.');
            }
            return app(\App\Http\Controllers\Equipo\EquipoController::class)->index(request());
        })->name('dashboard');
        Route::post('/store', [EquipoController::class, 'store'])->name('store');
        Route::put('/{equipo}', [EquipoController::class, 'update'])->name('update');
        Route::delete('/{equipo}', [EquipoController::class, 'destroy'])->name('destroy');
        Route::put('/{equipo}/toggle-active', [EquipoController::class, 'toggleActive'])->name('toggle-active');
    });
});

// Rutas API
Route::get('/api/buscar-productos', [WelcomeController::class, 'buscarProductos']);
Route::get('/api/notificaciones', [NotificacionController::class, 'obtenerNotificaciones'])->middleware('auth');
