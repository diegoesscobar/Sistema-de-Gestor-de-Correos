import { describe, it, expect } from 'vitest';
import { Correo } from '../src/models/Correo';
import { Contacto } from '../src/models/Contacto';
import { correosDeLaUCP, academicosImportantes, pendientesDeRevision } from '../src/models/FiltrosPredefinidos';

describe('RF-05: Filtros complejos del enunciado', () => {
    const profe = new Contacto('Profe', 'profe@ucp.edu.ar');
    const amigo = new Contacto('Amigo', 'amigo@gmail.com');
    const yo = new Contacto('Gabi', 'gabi@ucp.edu.ar');
    const examenUCP = new Correo('1', 'Examen parcial', 'Temario', profe, [yo]);
    const entregaUCP = new Correo('2', 'TP', 'Fecha de Entrega', profe, [yo]);
    const examenAfuera = new Correo('3', 'Examen de manejo', 'Entrega de papeles', amigo, [yo]);
    const correos = [examenUCP, entregaUCP, examenAfuera];

    it('Correos de la UCP y académicos importantes reutilizan el mismo predicado de dominio', () => {
        expect(correosDeLaUCP().aplicar(correos)).toEqual([examenUCP, entregaUCP]);
        expect(academicosImportantes().aplicar(correos)).toEqual([examenUCP]);
    });

    it('Pendientes de revisión deja de mostrar el correo cuando se lee', () => {
        const filtro = pendientesDeRevision();
        expect(filtro.aplicar(correos)).toEqual([entregaUCP, examenAfuera]);

        entregaUCP.marcarComoLeido();
        expect(filtro.aplicar(correos)).toEqual([examenAfuera]);
    });
});
