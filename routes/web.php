<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{  DashboardController, WelcomeController, ResultadosController};
use App\Http\Controllers\Usuarios\{ListaUsuariosController, AdministradoresController};
use App\Http\Controllers\Productos\{AgregarProductoController, InventarioProductosController};
use App\Http\Controllers\Servicio\{CategoriaServicioController, ServicioController};
use App\Http\Controllers\Reserva\{DashboardHorarioController, ReservaController, DashboardReservaController, HorarioController};
use App\Http\Controllers\Moto\RegistroMotosController;
use App\Http\Controllers\Facturacion\{FacturasPendientesController, HistorialFacturasController};
use App\Http\Controllers\Soporte\{ManualUsuarioController, SoporteTecnicoController};
use App\Http\Controllers\Opinion\{OpinionController, DashboardOpinionController};
use App\Http\Controllers\Banners\{SubirBannersController, HistorialBannersController};
use App\Http\Controllers\Pedidos\{EstadoPedidosController, NuevosPedidosController, PedidosFinalizadosController, HistorialPedidosController};

// Rutas Públicas
Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/resultados', [ResultadosController::class, 'index'])->name('resultados');

// Rutas para servicios públicos
Route::prefix('servicios')->name('servicios.publico.')->group(function () {
    Route::get('/', [ServicioController::class, 'publicIndex'])->name('index');
    Route::get('/categoria/{categoria}', [ServicioController::class, 'publicCategory'])
        ->name('categoria')
        ->where('categoria', '[0-9]+');
    
    // Debe ir al final porque contiene un parámetro dinámico
    Route::get('/{servicio}', [ServicioController::class, 'publicShow'])
        ->name('show')
        ->where('servicio', '[0-9]+');
});

// Autenticación
require __DIR__.'/auth.php';

// Rutas Protegidas
Route::middleware('auth')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Usuarios
    Route::prefix('usuarios')->group(function () {
        Route::get('/', [ListaUsuariosController::class, 'index'])->name('usuarios.index');
        Route::put('/{user}', [ListaUsuariosController::class, 'update'])->name('usuarios.update');
        
        // Administradores
        Route::prefix('administradores')->group(function () {
            Route::get('/', [AdministradoresController::class, 'index'])->name('usuarios.administradores.index');
            Route::delete('/{user}', [AdministradoresController::class, 'destroy'])->name('usuarios.administradores.destroy');
            Route::post('/{user}/promote', [AdministradoresController::class, 'promote'])->name('usuarios.administradores.promote');
        });
    });

    // Dashboard Reservas
    Route::prefix('dashboard/reservas')->name('dashboard.reservas.')->group(function () {
        // Rutas específicas primero
        Route::get('/', [DashboardReservaController::class, 'index'])->name('index');
        Route::get('/confirmadas', [DashboardReservaController::class, 'confirmadas'])->name('confirmadas');
        Route::patch('/{reserva}/estado', [DashboardReservaController::class, 'actualizarEstado'])
            ->where('reserva', '[0-9]+')
            ->name('actualizar-estado');
            
        // Horarios de atención (debe ir antes de la ruta con parámetro wildcard)
        Route::prefix('horario-atencion')->name('horario.')->group(function () {
            Route::get('/', [DashboardHorarioController::class, 'index'])->name('index');
            
            // Horarios recurrentes
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
            
            // Excepciones
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
        
        // Ruta con parámetro wildcard debe ir al final
        Route::get('/{reserva}', [DashboardReservaController::class, 'show'])
            ->where('reserva', '[0-9]+')
            ->name('show');
    });

    // Categorías
    Route::prefix('categorias')->group(function () {
        Route::get('/lista', [ListaCategoriasController::class, 'index'])->name('categorias.lista');
        
        // Principales
        Route::prefix('principales')->group(function () {
            Route::get('/', [CategoriasPrincipalesController::class, 'index'])->name('categorias.principales');
            Route::post('/', [CategoriasPrincipalesController::class, 'store'])->name('categorias.principales.store');
            Route::put('/{id}', [CategoriasPrincipalesController::class, 'update'])->name('categorias.principales.update');
            Route::delete('/{id}', [CategoriasPrincipalesController::class, 'destroy'])->name('categorias.principales.destroy');
        });
        
        // Subcategorías
        Route::prefix('subcategorias')->group(function () {
            Route::get('/', [SubcategoriasController::class, 'index'])->name('subcategorias.index');
            Route::post('/', [SubcategoriasController::class, 'store'])->name('subcategorias.store');
            Route::put('/{subcategoria}', [SubcategoriasController::class, 'update'])->name('subcategorias.update');
            Route::delete('/{subcategoria}', [SubcategoriasController::class, 'destroy'])->name('subcategorias.destroy');
        });
    });
    
    // Motos
    Route::prefix('motos')->group(function () {
        Route::get('/registro', [RegistroMotosController::class, 'index'])->name('motos.registro');
        Route::post('/registro', [RegistroMotosController::class, 'store'])->name('motos.store');
        Route::put('/registro/{moto}', [RegistroMotosController::class, 'update'])->name('motos.update');
        Route::delete('/registro/{moto}', [RegistroMotosController::class, 'destroy'])->name('motos.destroy');
    });
    
    // Productos
    Route::prefix('productos')->group(function () {
        Route::get('/agregar', [AgregarProductoController::class, 'index'])->name('productos.agregar');
        Route::post('/agregar', [AgregarProductoController::class, 'store'])->name('productos.store');
        Route::get('/inventario', [InventarioProductosController::class, 'index'])->name('productos.inventario');
        Route::delete('/{producto}', [InventarioProductosController::class, 'destroy'])->name('productos.destroy');
    });

    // Servicios
    Route::prefix('servicios')->name('servicios.')->group(function () {
        Route::get('/', [ServicioController::class, 'index'])->name('lista');
        Route::get('/crear', [ServicioController::class, 'create'])->name('crear');
        Route::post('/', [ServicioController::class, 'store'])->name('store');
        
        // Categorías de Servicios
        Route::prefix('categorias')->name('categorias.')->group(function () {
            Route::get('/crear', [CategoriaServicioController::class, 'create'])->name('crear');
            Route::post('/', [CategoriaServicioController::class, 'store'])->name('store');
            Route::get('/todas', [CategoriaServicioController::class, 'getAll'])->name('todas');
            Route::get('/{categoriaServicio}/editar', [CategoriaServicioController::class, 'edit'])
                ->name('editar')
                ->where('categoriaServicio', '[0-9]+');
            Route::put('/{categoriaServicio}', [CategoriaServicioController::class, 'update'])
                ->name('update')
                ->where('categoriaServicio', '[0-9]+');
            Route::delete('/{categoriaServicio}', [CategoriaServicioController::class, 'destroy'])
                ->name('destroy')
                ->where('categoriaServicio', '[0-9]+');
        });
        
        // Estas rutas deben ir al final porque contienen parámetros dinámicos
        Route::get('/{servicio}/editar', [ServicioController::class, 'edit'])
            ->name('editar')
            ->where('servicio', '[0-9]+');
        Route::put('/{servicio}', [ServicioController::class, 'update'])
            ->name('update')
            ->where('servicio', '[0-9]+');
        Route::delete('/{servicio}', [ServicioController::class, 'destroy'])
            ->name('destroy')
            ->where('servicio', '[0-9]+');
    });

    // Reservas
    Route::prefix('reservas')->name('reservas.')->middleware(['auth'])->group(function () {
        Route::get('/', [ReservaController::class, 'index'])->name('index');
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

    // API Routes
    Route::prefix('api')->name('api.')->group(function () {
        Route::get('/reservas/horas-disponibles', [ReservaController::class, 'horasDisponibles'])->name('reservas.horas-disponibles');
    });

    // Pedidos
    Route::prefix('pedidos')->group(function () {
        Route::get('/nuevos', [NuevosPedidosController::class, 'index'])->name('pedidos.nuevos');
        Route::get('/estado', [EstadoPedidosController::class, 'index'])->name('pedidos.estado');
        Route::get('/finalizados', [PedidosFinalizadosController::class, 'index'])->name('pedidos.finalizados');
        Route::get('/historial', [HistorialPedidosController::class, 'index'])->name('pedidos.historial');
    });
    
    //Opiniones
    Route::prefix('opiniones')->group(function () {
        Route::get('/', [OpinionController::class, 'index'])->name('opiniones.index');
        
        // Rutas que requieren autenticación
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
        Route::get('/opiniones', [DashboardOpinionController::class, 'index'])->name('dashboard.opiniones.index');
        Route::delete('/opiniones/{id}', [DashboardOpinionController::class, 'destroy'])->name('dashboard.opiniones.destroy');
        Route::delete('/opiniones/respuesta/{id}', [DashboardOpinionController::class, 'eliminarRespuesta'])->name('dashboard.opiniones.respuesta.destroy');
        Route::post('/opiniones/{id}/responder', [DashboardOpinionController::class, 'responder'])->name('dashboard.opiniones.responder');
        Route::post('/opiniones/{id}/util', [DashboardOpinionController::class, 'marcarUtil'])->name('dashboard.opiniones.util');
    });
    
// Banners
Route::prefix('banners')->group(function () {
    // Create
    Route::get('/subir', [SubirBannersController::class, 'index'])->name('banners.subir');
    Route::post('/subir', [SubirBannersController::class, 'store'])->name('banners.store');
    
    // Read
    Route::get('/historial', [HistorialBannersController::class, 'index'])->name('banners.historial');
    
    // Update (toggle status)
    Route::put('/{banner}/toggle-status', [HistorialBannersController::class, 'toggleStatus'])->name('banners.toggle-status');
    
    // Delete/Restore
    Route::delete('/{banner}', [HistorialBannersController::class, 'destroy'])->name('banners.destroy');
    Route::post('/{id}/restore', [HistorialBannersController::class, 'restore'])->name('banners.restore');
});
    
    // Facturación
    Route::prefix('facturacion')->group(function () {
        Route::get('/pendientes', [FacturasPendientesController::class, 'index'])->name('facturacion.pendientes');
        Route::get('/historial', [HistorialFacturasController::class, 'index'])->name('facturacion.historial');
    });
    
    // Soporte
    Route::prefix('soporte')->group(function () {
        Route::get('/manual', [ManualUsuarioController::class, 'index'])->name('soporte.manual');
        Route::get('/tecnico', [SoporteTecnicoController::class, 'index'])->name('soporte.tecnico');
    });
});
