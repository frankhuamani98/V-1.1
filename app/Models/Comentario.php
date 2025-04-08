<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comentario extends Model
{
    use HasFactory;
    protected $table = 'comments';

    protected $fillable = [
        'user_id',
        'comment',
        'parent_comment_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function replies()
    {
        return $this->hasMany(Comentario::class, 'parent_comment_id');
    }

    public function parent()
    {
        return $this->belongsTo(Comentario::class, 'parent_comment_id');
    }
}