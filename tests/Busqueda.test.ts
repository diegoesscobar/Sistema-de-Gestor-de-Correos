import { describe, it, expect } from 'vitest';
import { Buzon } from '../src/models/Buzon';
import { Correo } from '../src/models/Correo';
import { Contacto } from '../src/models/Contacto';

describe('RF-04: Búsqueda en la Bandeja de Entrada', () => {
    const profe = new Contacto('Profe Martinez', 'profe@ucp.edu.ar');
    const yo = new Contacto('Gabi', 'gabi@ucp.edu.ar');
    const diego = new Contacto('Diego', 'diego@gmail.com');

    it('Busca en asunto, contenido, remitente y destinatarios sin distinguir mayúsculas', () => {
        const buzon = new Buzon();
        const examen = new Correo('1', 'Examen', 'Temario', profe, [yo]);
        const asado = new Correo('2', 'Asado', 'Llevar carbón', diego, [yo, profe]);
        buzon.recibirCorreo(examen);
        buzon.recibirCorreo(asado);

        expect(buzon.buscarEnEntrada('EXAM')).toEqual([examen]);
        expect(buzon.buscarEnEntrada('carbón')).toEqual([asado]);
        expect(buzon.buscarEnEntrada('martinez')).toEqual([examen, asado]); // remitente en uno, destinatario en el otro
        expect(buzon.buscarEnEntrada('gmail')).toEqual([asado]);
    });

    it('Un correo aparece una sola vez aunque coincida en varios campos, y no se modifica', () => {
        const buzon = new Buzon();
        buzon.recibirCorreo(new Correo('1', 'Examen UCP', 'Examen en la ucp', profe, [yo]));

        const resultado = buzon.buscarEnEntrada('ucp');

        expect(resultado).toHaveLength(1);
        expect(resultado[0].asunto).toBe('Examen UCP');
        expect(resultado[0].leido).toBe(false);
    });

    it('Devuelve vacío si no hay coincidencias o la bandeja está vacía', () => {
        const buzon = new Buzon();
        expect(buzon.buscarEnEntrada('algo')).toEqual([]);

        buzon.recibirCorreo(new Correo('1', 'Examen', 'Temario', profe, [yo]));
        expect(buzon.buscarEnEntrada('vacaciones')).toEqual([]);
    });
});
