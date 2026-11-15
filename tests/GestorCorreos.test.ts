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

    it('Al enviar, el correo queda en Enviados del remitente y en la Entrada de cada destinatario', () => {
        const gestor = new GestorCorreos();
        const buzonGabi = gestor.registrarUsuario(gabi);
        const buzonDiego = gestor.registrarUsuario(diego);
        const externo = new Contacto('Externo', 'externo@gmail.com'); // no registrado, no se le entrega
        const borrador = buzonGabi.crearBorrador();
        buzonGabi.editarBorrador(borrador.id, 'TP', 'Cuerpo', gabi, [diego, externo]);

        gestor.enviar('gabi@ucp.edu.ar', borrador.id);

        expect(buzonGabi.obtenerEnviados()).toHaveLength(1);
        expect(buzonGabi.obtenerBorradores()).toHaveLength(0);
        expect(buzonDiego.obtenerEntrada()[0].asunto).toBe('TP');
    });

    it('Si la persona 2 borra un correo enviado a 3 personas, a la 1 y la 3 les sigue llegando', () => {
        const gestor = new GestorCorreos();
        const profe = new Contacto('Profe', 'profe@ucp.edu.ar');
        const personas = [1, 2, 3].map(n => new Contacto('Persona ' + n, `p${n}@ucp.edu.ar`));
        const buzonProfe = gestor.registrarUsuario(profe);
        const [buzon1, buzon2, buzon3] = personas.map(p => gestor.registrarUsuario(p));

        // El profe envía una sola vez y el gestor lo reparte
        const borrador = buzonProfe.crearBorrador();
        buzonProfe.editarBorrador(borrador.id, 'Examen', 'Temario', profe, personas);
        const correo = gestor.enviar('profe@ucp.edu.ar', borrador.id);

        gestor.eliminarCorreo('p2@ucp.edu.ar', correo.id);
        buzon1.obtenerEntrada()[0].marcarComoLeido();

        expect(buzon2.obtenerEntrada()).toHaveLength(0);
        expect(buzon2.obtenerEliminados()).toHaveLength(1);
        expect(buzon1.obtenerEntrada()[0].leido).toBe(true);
        expect(buzon3.obtenerEntrada()[0].leido).toBe(false); // la lectura de la 1 no le cambia a la 3

        gestor.restaurarCorreo('p2@ucp.edu.ar', correo.id);
        expect(buzon2.obtenerEntrada()).toHaveLength(1);
    });
});
