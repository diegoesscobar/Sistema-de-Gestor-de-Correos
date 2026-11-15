import { describe, it, expect } from 'vitest';
import { Agenda } from '../src/models/Agenda';
import { Contacto } from '../src/models/Contacto';

describe('RF-03: Agenda de contactos', () => {
    it('Debería agregar contactos y consultarlos por email sin importar mayúsculas', () => {
        const agenda = new Agenda();
        agenda.agregar(new Contacto('Diego', 'diego@ucp.edu.ar'));
        agenda.agregar(new Contacto('Gabi', 'gabi@ucp.edu.ar'));

        expect(agenda.obtenerContactos()).toHaveLength(2);
        expect(agenda.buscarPorEmail('DIEGO@ucp.edu.ar')?.nombre).toBe('Diego');
        expect(agenda.buscarPorEmail('nadie@ucp.edu.ar')).toBeUndefined();
    });

    it('No debería permitir dos contactos con el mismo email', () => {
        const agenda = new Agenda();
        agenda.agregar(new Contacto('Diego', 'diego@ucp.edu.ar'));

        expect(() => agenda.agregar(new Contacto('Otro Diego', 'Diego@UCP.edu.ar'))).toThrow('Ya existe un contacto con ese email');
        expect(agenda.obtenerContactos()).toHaveLength(1);
    });
});
