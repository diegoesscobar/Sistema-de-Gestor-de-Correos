import { describe, it, expect } from 'vitest';
import { GestorCorreos } from '../src/models/GestorCorreos';
import { Contacto } from '../src/models/Contacto';

describe('GestorCorreos', () => {
    const remitente = new Contacto('Gabi', 'gabi@ucp.edu.ar');
    const dest1 = new Contacto('Diego', 'diego@ucp.edu.ar');

    describe('RF-07: Gestión de borradores', () => {
        it('Debería registrar un borrador vacío al empezar a redactar', () => {
            const gestor = new GestorCorreos();
            const borrador = gestor.crearBorrador();

            expect(gestor.obtenerBorradores()).toHaveLength(1);
            expect(borrador.esValidoParaEnviar()).toBe(false);
        });

        it('Debería conservar los cambios al editar y recuperar el borrador', () => {
            const gestor = new GestorCorreos();
            const borrador = gestor.crearBorrador();

            gestor.editarBorrador(borrador.id, 'TP Final', 'Cuerpo', remitente, [dest1]);
            gestor.editarBorrador(borrador.id, 'TP Final v2');

            const recuperado = gestor.obtenerBorrador(borrador.id);
            expect(recuperado?.asunto).toBe('TP Final v2');
            expect(recuperado?.contenido).toBe('Cuerpo');
            expect(recuperado?.esValidoParaEnviar()).toBe(true);
        });

        it('Debería lanzar error al editar un borrador que no existe', () => {
            const gestor = new GestorCorreos();
            expect(() => gestor.editarBorrador('x', 'Hola')).toThrow('El borrador no existe');
        });
    });
});
