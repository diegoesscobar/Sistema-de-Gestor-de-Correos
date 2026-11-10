import { describe, it, expect } from 'vitest';
import { Borrador } from '../src/models/Borrador';
import { Contacto } from '../src/models/Contacto';

describe('RF-07: Borrador', () => {
    const remitente = new Contacto('Gabi', 'gabi@ucp.edu.ar');
    const dest1 = new Contacto('Diego', 'diego@ucp.edu.ar');

    it('Debería permitir crear un borrador incompleto', () => {
        const borrador = new Borrador('b1');
        expect(borrador.asunto).toBe('');
        expect(borrador.esValidoParaEnviar()).toBe(false);
    });

    it('Debería ser válido cuando tiene remitente, asunto y destinatario', () => {
        const borrador = new Borrador('b2', 'TP', 'Cuerpo', remitente, [dest1]);
        expect(borrador.esValidoParaEnviar()).toBe(true);
    });

    it('No debería ser válido si el asunto tiene solo espacios', () => {
        const borrador = new Borrador('b3', '   ', 'Cuerpo', remitente, [dest1]);
        expect(borrador.esValidoParaEnviar()).toBe(false);
    });

    it('No debería ser válido si no tiene contenido', () => {
        const borrador = new Borrador('b4', 'TP', '', remitente, [dest1]);
        expect(borrador.esValidoParaEnviar()).toBe(false);
    });
});
