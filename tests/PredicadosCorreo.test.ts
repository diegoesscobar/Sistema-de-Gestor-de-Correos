import { describe, it, expect } from 'vitest';
import { Correo } from '../src/models/Correo';
import { Contacto } from '../src/models/Contacto';
import { delDominio, asuntoContiene, contenidoContiene } from '../src/models/PredicadosCorreo';

describe('RF-05: Predicados de correo', () => {
    const profe = new Contacto('Profe', 'profe@ucp.edu.ar');
    const amigo = new Contacto('Amigo', 'amigo@gmail.com');
    const yo = new Contacto('Gabi', 'gabi@ucp.edu.ar');
    const examen = new Correo('1', 'Examen final', 'Fecha de Entrega', profe, [yo]);
    const asado = new Correo('2', 'Asado', 'El sábado', amigo, [yo]);

    it('delDominio se fija en el email del remitente', () => {
        expect([examen, asado].filter(delDominio('@ucp.edu.ar'))).toEqual([examen]);
    });

    it('asuntoContiene y contenidoContiene no distinguen mayúsculas y aceptan partes', () => {
        expect([examen, asado].filter(asuntoContiene('EXAM'))).toEqual([examen]);
        expect([examen, asado].filter(contenidoContiene('sábado'))).toEqual([asado]);
    });
});
