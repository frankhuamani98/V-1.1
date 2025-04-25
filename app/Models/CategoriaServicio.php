<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategoriaServicio extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'categorias_servicios';

    /**
     * Los atributos que son asignables masivamente.
     *
     * @var array
     */
    protected $fillable = [
        'nombre',
        'descripcion',
        'estado',
        'orden'
    ];

    /**
     * Los atributos que deben ser convertidos.
     *
     * @var array
     */
    protected $casts = [
        'estado' => 'boolean',
        'orden' => 'integer'
    ];

    /**
     * Obtiene los servicios relacionados con esta categoría.
     */
    public function servicios(): HasMany
    {
        return $this->hasMany(Servicio::class, 'categoria_servicio_id');
    }
}