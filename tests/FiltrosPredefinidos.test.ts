import { describe, it, expect } from 'vitest';
import { Correo } from '../src/models/Correo';
import { Contacto } from '../src/models/Contacto';
import { correosDeLaUCP, academicosImportantes, pendientesDeRevision, personalesPrioritarios, paraSeguimiento } from '../src/models/FiltrosPredefinidos';

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

    it('Personales prioritarios pide que sea favorito y de ese contacto', () => {
        const deAmigo = new Correo('4', 'Hola', 'Texto', amigo, [yo]);
        const deProfe = new Correo('5', 'Hola', 'Texto', profe, [yo]);
        deAmigo.alternarFavorito();
        deProfe.alternarFavorito();

        expect(personalesPrioritarios(amigo).aplicar([deAmigo, deProfe, examenAfuera])).toEqual([deAmigo]);
    });

    it('Para seguimiento toma Proyecto o Reunión y saca los leídos', () => {
        const proyecto = new Correo('6', 'Proyecto final', 'Texto', profe, [yo]);
        const reunion = new Correo('7', 'Reunión del lunes', 'Texto', profe, [yo]);
        const reunionLeida = new Correo('8', 'Reunión vieja', 'Texto', profe, [yo]);
        reunionLeida.marcarComoLeido();

        expect(paraSeguimiento().aplicar([proyecto, reunion, reunionLeida, examenUCP])).toEqual([proyecto, reunion]);
    });
});
