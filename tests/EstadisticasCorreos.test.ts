import { describe, it, expect } from 'vitest';
import { EstadisticasCorreos } from '../src/models/EstadisticasCorreos';
import { Correo } from '../src/models/Correo';
import { Contacto } from '../src/models/Contacto';
import { noLeido } from '../src/models/PredicadosCorreo';

describe('RF-10: Procesamiento funcional y estadísticas', () => {
    const profe = new Contacto('Profe', 'profe@ucp.edu.ar');
    const yo = new Contacto('Gabi', 'gabi@ucp.edu.ar');
    const examen = new Correo('1', 'Examen', 'Temario', profe, [yo]);
    const tp = new Correo('2', 'TP', 'Consigna', profe, [yo]);

    it('asuntos() devuelve la lista de asuntos con map', () => {
        expect(new EstadisticasCorreos([examen, tp]).asuntos()).toEqual(['Examen', 'TP']);
        expect(new EstadisticasCorreos([]).asuntos()).toEqual([]);
    });

    it('filtrar() usa el predicado que le pasen', () => {
        tp.marcarComoLeido();
        expect(new EstadisticasCorreos([examen, tp]).filtrar(noLeido)).toEqual([examen]);
    });

    it('contarNoLeidos() y contarPorRemitente() acumulan con reduce', () => {
        const respuesta = new Correo('3', 'Re: TP', 'Listo', yo, [profe]);
        const estadisticas = new EstadisticasCorreos([examen, tp, respuesta]);

        expect(estadisticas.contarNoLeidos()).toBe(2);
        expect(estadisticas.contarPorRemitente().get('profe@ucp.edu.ar')).toBe(2);
        expect(estadisticas.contarPorRemitente().get('gabi@ucp.edu.ar')).toBe(1);
    });
});
