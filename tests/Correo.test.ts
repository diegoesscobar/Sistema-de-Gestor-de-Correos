import { describe, it, expect } from 'vitest';
import { Correo } from '../src/models/Correo';
import { Contacto } from '../src/models/Contacto';

describe('RF-01: Entidad Correo Base', () => {
    const remitente = new Contacto('Diego', 'diego@ucp.edu.ar');
    const dest1 = new Contacto('Gabi', 'gabi@ucp.edu.ar');

    it('Debe crear un correo con estados por defecto', () => {
        const correo = new Correo('1', 'TP', 'Cuerpo', remitente, [dest1]);
        expect(correo.id).toBe('1');
        expect(correo.leido).toBe(false);
        expect(correo.favorito).toBe(false);
    });

    it('Debe encapsular la colección de destinatarios', () => {
        const correo = new Correo('2', 'TP', 'Cuerpo', remitente, [dest1]);
        const arrayExpuesto = correo.destinatarios as Contacto[];
        arrayExpuesto.push(new Contacto('Profe', 'profe@ucp.edu.ar'));

        expect(correo.destinatarios.length).toBe(1); 
    });

    it('Debe lanzar error si faltan datos', () => {
        expect(() => new Correo('', 'TP', 'Cuerpo', remitente, [])).toThrow();
    });

    describe('RF-08: Gestión de lectura', () => {
        it('Debería marcar y desmarcar correctamente el correo como leído', () => {
            const correo = new Correo('1', 'Test', 'Contenido', remitente, [dest1]);
            
            expect(correo.leido).toBe(false);

            correo.marcarComoLeido();
            expect(correo.leido).toBe(true);

            correo.marcarComoNoLeido();
            expect(correo.leido).toBe(false);
        });
    });

    describe('RF-09: Gestión de favoritos', () => {
        it('Debería alternar el estado de favorito correctamente', () => {
            const correo = new Correo('1', 'Test', 'Contenido', remitente, [dest1]);
            
            expect(correo.favorito).toBe(false);

            correo.alternarFavorito();
            expect(correo.favorito).toBe(true);

            correo.alternarFavorito();
            expect(correo.favorito).toBe(false);
        });
    });
});