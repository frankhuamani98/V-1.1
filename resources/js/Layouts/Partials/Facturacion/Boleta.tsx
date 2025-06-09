import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

const Boleta = () => {
    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">Gestión de Boletas</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="p-4 rounded-lg bg-gray-50">
                            <p className="text-gray-600">
                                Esta sección está en desarrollo. Pronto podrás gestionar tus boletas aquí.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Boleta;
