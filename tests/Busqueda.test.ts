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
});
