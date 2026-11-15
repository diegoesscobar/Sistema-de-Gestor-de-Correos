import { describe, it, expect } from 'vitest';
import { Filtro } from '../src/models/Filtro';
import { Correo } from '../src/models/Correo';
import { Contacto } from '../src/models/Contacto';
import { delDominio } from '../src/models/PredicadosCorreo';

describe('RF-05: Filtro', () => {
    const profe = new Contacto('Profe', 'profe@ucp.edu.ar');
    const amigo = new Contacto('Amigo', 'amigo@gmail.com');
    const examen = new Correo('1', 'Examen', 'Temario', profe, [amigo]);
    const asado = new Correo('2', 'Asado', 'Sábado', amigo, [profe]);

    it('Debería devolver solo los correos que cumplen su condición', () => {
        const filtro = new Filtro('Correos de la UCP', delDominio('@ucp.edu.ar'));

        expect(filtro.nombre).toBe('Correos de la UCP');
        expect(filtro.aplicar([examen, asado])).toEqual([examen]);
    });

    it('No debería crearse sin nombre', () => {
        expect(() => new Filtro('  ', delDominio('@ucp.edu.ar'))).toThrow('El filtro necesita un nombre');
    });
});
