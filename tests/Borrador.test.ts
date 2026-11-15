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

    it('No debería ser válido sin remitente o sin destinatarios', () => {
        expect(new Borrador('b6', 'TP', 'Cuerpo', undefined, [dest1]).esValidoParaEnviar()).toBe(false);
        expect(new Borrador('b7', 'TP', 'Cuerpo', remitente, []).esValidoParaEnviar()).toBe(false);
    });

    it('Los destinatarios no se pueden modificar desde afuera, solo con editar', () => {
        const borrador = new Borrador('b5', 'TP', 'Cuerpo', remitente, [dest1]);
        (borrador.destinatarios as Contacto[]).push(remitente);
        expect(borrador.destinatarios).toHaveLength(1);

        borrador.editar(undefined, undefined, undefined, [dest1, remitente]);
        expect(borrador.destinatarios).toHaveLength(2);
    });
});
