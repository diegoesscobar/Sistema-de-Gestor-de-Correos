import { describe, it, expect } from 'vitest';
import { BandejaEntrada } from '../src/models/BandejaEntrada';
import { Correo } from '../src/models/Correo';
import { Contacto } from '../src/models/Contacto';

describe('Prueba de independencia de bandejas entre destinatarios', () => {
  const remitente = new Contacto('Remitente', 'remitente@test.com');
  const persona1 = new Contacto('Persona 1', 'p1@test.com');
  const persona2 = new Contacto('Persona 2', 'p2@test.com');
  const persona3 = new Contacto('Persona 3', 'p3@test.com');

  it('Si se envía un correo a 3 personas y la persona 2 por ejemplo lo elimina de su bandeja de entrada, las bandejas de la persona 1 y 3 no se alteran', () => {
    const entradaPersona1 = new BandejaEntrada();
    const entradaPersona2 = new BandejaEntrada();
    const entradaPersona3 = new BandejaEntrada();

    const correo = new Correo('c1', 'Reunión importante', 'Temario del día...', remitente, [persona1, persona2, persona3]);

    entradaPersona1.agregarCorreo(correo);
    entradaPersona2.agregarCorreo(correo);
    entradaPersona3.agregarCorreo(correo);

    expect(entradaPersona1.obtenerCorreos()).toHaveLength(1);
    expect(entradaPersona2.obtenerCorreos()).toHaveLength(1);
    expect(entradaPersona3.obtenerCorreos()).toHaveLength(1);

    entradaPersona2.removerCorreo('c1');

    expect(entradaPersona2.obtenerCorreos()).toHaveLength(0);

    expect(entradaPersona1.obtenerCorreos()).toHaveLength(1);
    expect(entradaPersona1.obtenerCorreos()[0].id).toBe('c1');

    expect(entradaPersona3.obtenerCorreos()).toHaveLength(1);
    expect(entradaPersona3.obtenerCorreos()[0].id).toBe('c1');
  });
});