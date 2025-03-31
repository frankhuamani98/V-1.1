<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{  DashboardController, WelcomeController, ResultadosController};
use App\Http\Controllers\Usuarios\{ListaUsuariosController, AdministradoresController};
use App\Http\Controllers\Productos\{AgregarProductoController, InventarioProductosController};
use App\Http\Controllers\Categorias\{CategoriasPrincipalesController, SubcategoriasController, ListaCategoriasController};
use App\Http\Controllers\Reservas\{NuevasReservasController, EstadoReservasController, ReservasFinalizadasController, HistorialReservasController};
use App\Http\Controllers\Moto\RegistroMotosController;
use App\Http\Controllers\Facturacion\{FacturasPendientesController, HistorialFacturasController};
use App\Http\Controllers\Soporte\{ManualUsuarioController, SoporteTecnicoController};
use App\Http\Controllers\Comentarios\ListaComentariosController;
use App\Http\Controllers\Banners\{SubirBannersController, HistorialBannersController};
use App\Http\Controllers\Pedidos\{EstadoPedidosController, NuevosPedidosController, PedidosFinalizadosController, HistorialPedidosController};

// Rutas Públicas
Route::get('/', [WelcomeController::class, 'index'])->name('home');
Route::get('/resultados', [ResultadosController::class, 'index'])->name('resultados');

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
    });
    
    // Reservas
    Route::prefix('reservas')->group(function () {
        Route::get('/nuevas', [NuevasReservasController::class, 'index'])->name('reservas.nuevas');
        Route::get('/estado', [EstadoReservasController::class, 'index'])->name('reservas.estado');
        Route::get('/finalizadas', [ReservasFinalizadasController::class, 'index'])->name('reservas.finalizadas');
        Route::get('/historial', [HistorialReservasController::class, 'index'])->name('reservas.historial');
    });
    
    // Pedidos
    Route::prefix('pedidos')->group(function () {
        Route::get('/nuevos', [NuevosPedidosController::class, 'index'])->name('pedidos.nuevos');
        Route::get('/estado', [EstadoPedidosController::class, 'index'])->name('pedidos.estado');
        Route::get('/finalizados', [PedidosFinalizadosController::class, 'index'])->name('pedidos.finalizados');
        Route::get('/historial', [HistorialPedidosController::class, 'index'])->name('pedidos.historial');
    });
    
    // Comentarios
    Route::prefix('comentarios')->group(function () {
        Route::get('/lista', [ListaComentariosController::class, 'index'])->name('comentarios.lista');
    });
    
// Banners
Route::prefix('banners')->group(function () {
    Route::get('/subir', [SubirBannersController::class, 'index'])->name('banners.subir');
    Route::post('/subir', [SubirBannersController::class, 'store'])->name('banners.store');
    Route::get('/historial', [HistorialBannersController::class, 'index'])->name('banners.historial');
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