import { describe, it, expect } from 'vitest';
import { GestorCorreos } from '../src/models/GestorCorreos';
import { Contacto } from '../src/models/Contacto';
import { Correo } from '../src/models/Correo';

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

    describe('RF-02: Envío de correos', () => {
        it('Debería mover el borrador válido a Enviados', () => {
            const gestor = new GestorCorreos();
            const borrador = gestor.crearBorrador();
            gestor.editarBorrador(borrador.id, 'TP', 'Cuerpo', remitente, [dest1]);

            gestor.enviarBorrador(borrador.id);

            expect(gestor.obtenerEnviados()).toHaveLength(1);
            expect(gestor.obtenerBorradores()).toHaveLength(0);
        });

        it('No debería enviar un borrador incompleto y debería dejarlo en Borradores', () => {
            const gestor = new GestorCorreos();
            const borrador = gestor.crearBorrador();
            gestor.editarBorrador(borrador.id, 'TP', '', remitente, [dest1]);

            expect(() => gestor.enviarBorrador(borrador.id)).toThrow('El borrador no está completo para enviarse');
            expect(gestor.obtenerBorradores()).toHaveLength(1);
            expect(gestor.obtenerEnviados()).toHaveLength(0);
        });

        it('No debería duplicar el correo si se intenta enviar dos veces', () => {
            const gestor = new GestorCorreos();
            const borrador = gestor.crearBorrador();
            gestor.editarBorrador(borrador.id, 'TP', 'Cuerpo', remitente, [dest1]);

            gestor.enviarBorrador(borrador.id);
            expect(() => gestor.enviarBorrador(borrador.id)).toThrow('El borrador no existe');
            expect(gestor.obtenerEnviados()).toHaveLength(1);
        });
    });

    describe('Eliminar correos', () => {
        it('Debería pasar el correo de Entrada a Eliminados sin duplicarlo', () => {
            const gestor = new GestorCorreos();
            gestor.recibirCorreo(new Correo('1', 'Hola', 'Texto', dest1, [remitente]));

            gestor.eliminarCorreo('1');

            expect(gestor.obtenerEntrada()).toHaveLength(0);
            expect(gestor.obtenerEliminados()).toHaveLength(1);
        });
    });
});
