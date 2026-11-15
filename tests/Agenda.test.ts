import { describe, it, expect } from 'vitest';
import { Agenda } from '../src/models/Agenda';
import { Contacto } from '../src/models/Contacto';
import { Correo } from '../src/models/Correo';

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

    it('Debería modificar nombre y email, sin pisar el email de otro contacto', () => {
        const agenda = new Agenda();
        agenda.agregar(new Contacto('Diego', 'diego@ucp.edu.ar'));
        agenda.agregar(new Contacto('Gabi', 'gabi@ucp.edu.ar'));

        agenda.modificarNombre('diego@ucp.edu.ar', 'Diego Escobar');
        agenda.modificarEmail('diego@ucp.edu.ar', 'descobar@ucp.edu.ar');

        expect(agenda.buscarPorEmail('descobar@ucp.edu.ar')?.nombre).toBe('Diego Escobar');
        expect(agenda.buscarPorEmail('diego@ucp.edu.ar')).toBeUndefined();
        expect(() => agenda.modificarEmail('descobar@ucp.edu.ar', 'gabi@ucp.edu.ar')).toThrow('Ya existe un contacto con ese email');
    });

    it('Eliminar un contacto no borra los correos que lo referencian', () => {
        const agenda = new Agenda();
        const diego = new Contacto('Diego', 'diego@ucp.edu.ar');
        agenda.agregar(diego);
        const correo = new Correo('1', 'TP', 'Cuerpo', diego, [new Contacto('Gabi', 'gabi@ucp.edu.ar')]);

        agenda.eliminar('diego@ucp.edu.ar');

        expect(agenda.obtenerContactos()).toHaveLength(0);
        expect(correo.remitente.nombre).toBe('Diego');
        expect(() => agenda.eliminar('diego@ucp.edu.ar')).toThrow('No existe un contacto con ese email');
    });
});
