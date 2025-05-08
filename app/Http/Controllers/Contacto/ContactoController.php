<?php

namespace App\Http\Controllers\Contacto;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactoController extends Controller
{
    public function ubicacion()
    {
        $ubicacionData = [
            'establecimientos' => [
                'tienda' => [
                    'nombre' => 'Tienda Principal Rudolf Motos',
                    'tipo' => 'Tienda de Ventas y Repuestos',
                    'direccion' => 'Av. Huayna Capac 168, Cusco 08002, Perú',
                    'referencias' => 'A dos cuadras de la Plaza Tupac Amaru',
                    'coordenadas' => [
                        'lat' => -13.522141727238067,
                        'lng' => -71.96969105962954
                    ]
                ],
                'taller' => [
                    'nombre' => 'Taller Técnico Rudolf Motos',
                    'tipo' => 'Centro de Servicio Técnico',
                    'direccion' => 'Cusco, Perú',
                    'referencias' => 'Taller especializado con equipo moderno',
                    'coordenadas' => [
                        'lat' => -13.521869713279548,
                        'lng' => -71.96909860496798
                    ]
                ]
            ]
        ];

        return Inertia::render('Home/Partials/Contacto/Ubicacion', [
            'ubicacionData' => $ubicacionData
        ]);
    }

    public function contactanos()
    {
        $contactoData = [
            'telefonos' => [
                'principal' => '+51 999 888 777',
                'whatsapp' => '+51 999 888 776'
            ],
            'correos' => [
                'atencion' => 'atencion@rudolfmotors.com',
                'ventas' => 'ventas@rudolfmotors.com',
                'soporte' => 'soporte@rudolfmotors.com'
            ],
            'personal' => [
                [
                    'nombre' => 'Rodolfo',
                    'cargo' => 'Gerente General',
                    'contacto' => 'rodolfo@rudolfmotors.com'
                ],
                [
                    'nombre' => 'María García',
                    'cargo' => 'Jefa de Ventas',
                    'contacto' => 'maria@rudolfmotors.com'
                ],
                [
                    'nombre' => 'Carlos López',
                    'cargo' => 'Jefe de Taller',
                    'contacto' => 'carlos@rudolfmotors.com'
                ]
            ],
            'horarioAtencion' => [
                'telefonica' => '24/7',
                'email' => 'Respuesta en máximo 24 horas'
            ]
        ];

        return Inertia::render('Home/Partials/Contacto/Contactanos', [
            'contactoData' => $contactoData
        ]);
    }

    public function redesSociales()
    {
        $redesData = [
            'facebook' => [
                'url' => 'https://facebook.com/rudolfmotors',
                'usuario' => '@RudolfMotors',
                'descripcion' => 'Síguenos para ver las últimas novedades y ofertas'
            ],
            'instagram' => [
                'url' => 'https://instagram.com/rudolfmotors',
                'usuario' => '@rudolf_motors',
                'descripcion' => 'Fotos y videos de nuestros servicios y productos'
            ],
            'youtube' => [
                'url' => 'https://youtube.com/rudolfmotors',
                'usuario' => 'Rudolf Motors Oficial',
                'descripcion' => 'Tutoriales y contenido exclusivo'
            ],
            'twitter' => [
                'url' => 'https://twitter.com/rudolfmotors',
                'usuario' => '@RudolfMotors',
                'descripcion' => 'Noticias y actualizaciones en tiempo real'
            ],
            'linkedin' => [
                'url' => 'https://linkedin.com/company/rudolf-motors',
                'usuario' => 'Rudolf Motors',
                'descripcion' => 'Información corporativa y oportunidades laborales'
            ]
        ];

        return Inertia::render('Home/Partials/Contacto/RedesSociales', [
            'redesData' => $redesData
        ]);
    }
}