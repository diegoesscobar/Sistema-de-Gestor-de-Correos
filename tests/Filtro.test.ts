import { describe, it, expect, beforeEach } from 'vitest';
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

describe('RF-05: Filtro sobre una colección grande', () => {
    const profe = new Contacto('Profe', 'profe@ucp.edu.ar');
    const amigo = new Contacto('Amigo', 'amigo@gmail.com');
    const destino = new Contacto('Destino', 'destino@mail.com');

    // Los datos dependen solo del índice, sin azar: cada tercero es de la UCP y cada quinto tiene "Examen" en el asunto
    const crearCorreos = (cantidad: number): Correo[] => {
        const correos: Correo[] = [];
        for (let i = 0; i < cantidad; i++) {
            const remitente = i % 3 === 0 ? profe : amigo;
            const asunto = i % 5 === 0 ? `Examen ${i}` : `Asunto ${i}`;
            correos.push(new Correo(String(i), asunto, 'Texto', remitente, [destino]));
        }
        return correos;
    };

    let correos: Correo[];

    beforeEach(() => {
        correos = crearCorreos(100);
    });

    it('Un filtro simple devuelve exactamente los correos que cumplen la condición', () => {
        const filtro = new Filtro('Correos de la UCP', delDominio('@ucp.edu.ar'));

        const resultado = filtro.aplicar(correos);

        expect(resultado).toHaveLength(34); // índices 0, 3, 6, ..., 99
        expect(resultado).toEqual(correos.filter((_, i) => i % 3 === 0));
    });

    it('El mismo filtro se reutiliza sobre colecciones distintas y da el mismo resultado cada vez', () => {
        const filtro = new Filtro('Correos de la UCP', delDominio('@ucp.edu.ar'));

        expect(filtro.aplicar(correos.slice(0, 10))).toHaveLength(4); // 0, 3, 6, 9
        expect(filtro.aplicar(correos)).toHaveLength(34);
        expect(filtro.aplicar(correos)).toEqual(filtro.aplicar(correos));
    });
});
