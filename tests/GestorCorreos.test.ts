import { describe, it, expect } from 'vitest';
import { GestorCorreos } from '../src/models/GestorCorreos';
import { Contacto } from '../src/models/Contacto';

describe('GestorCorreos: coordina los buzones de todos los usuarios', () => {
    const gabi = new Contacto('Gabi', 'gabi@ucp.edu.ar');
    const diego = new Contacto('Diego', 'diego@ucp.edu.ar');

    it('Cada usuario registrado tiene su propio buzón', () => {
        const gestor = new GestorCorreos();
        const buzonGabi = gestor.registrarUsuario(gabi);
        const buzonDiego = gestor.registrarUsuario(diego);

        expect(gestor.buzonDe('GABI@ucp.edu.ar')).toBe(buzonGabi);
        expect(buzonGabi).not.toBe(buzonDiego);
    });

    it('No se puede registrar dos veces el mismo email ni pedir el buzón de alguien no registrado', () => {
        const gestor = new GestorCorreos();
        gestor.registrarUsuario(gabi);

        expect(() => gestor.registrarUsuario(new Contacto('Otro', 'gabi@ucp.edu.ar'))).toThrow('El usuario ya está registrado');
        expect(() => gestor.buzonDe('nadie@ucp.edu.ar')).toThrow('El usuario no está registrado');
    });
});
