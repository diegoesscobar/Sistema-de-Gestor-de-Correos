import { describe, it, expect, beforeEach } from 'vitest';
import { BandejaSalidas } from '../src/models/BandejaSalidas';
import { Correo } from '../src/models/Correo';
import { Contacto } from '../src/models/Contacto';

describe('Pruebas unitarias: Bandeja de Salidas', () => {
  let remitente: Contacto;
  let destinatario: Contacto;

  beforeEach(() => {
    remitente = new Contacto('Diego', 'diego@ucp.edu.ar');
    destinatario = new Contacto('Gabi', 'gabi@ucp.edu.ar');
  });

  it('Debería permitir agregar y obtener correos en la bandeja de salidas', () => {
    const bandeja = new BandejaSalidas();
    const correo = new Correo('1', 'Salida pendiente', 'Texto en cola', remitente, [destinatario]);
    
    bandeja.agregarCorreo(correo);

    expect(bandeja.obtenerCorreos()).toHaveLength(1);
    expect(bandeja.obtenerCorreos()[0].asunto).toBe('Salida pendiente');
  });

  it('Debería permitir remover un correo de salidas por su ID', () => {
    const bandeja = new BandejaSalidas();
    const correo = new Correo('1', 'Salida pendiente', 'Texto en cola', remitente, [destinatario]);
    bandeja.agregarCorreo(correo);

    const correoRemovido = bandeja.removerCorreo('1');

    expect(correoRemovido).toBeDefined();
    expect(correoRemovido?.id).toBe('1');
    expect(bandeja.obtenerCorreos()).toHaveLength(0);
  });

  it('Debería retornar undefined al intentar remover un correo cuyo ID no existe en salidas', () => {
    const bandeja = new BandejaSalidas();
    const correo = new Correo('1', 'Salida pendiente', 'Texto en cola', remitente, [destinatario]);
    bandeja.agregarCorreo(correo);

    const resultado = bandeja.removerCorreo('999');

    expect(resultado).toBeUndefined();
    expect(bandeja.obtenerCorreos()).toHaveLength(1);
  });

  it('Debería almacenar varios correos correctamente en la bandeja', () => {
    const bandeja = new BandejaSalidas();
    const correo1 = new Correo('1', 'Mensaje 1', 'Texto 1', remitente, [destinatario]);
    const correo2 = new Correo('2', 'Mensaje 2', 'Texto 2', remitente, [destinatario]);

    bandeja.agregarCorreo(correo1);
    bandeja.agregarCorreo(correo2);

    expect(bandeja.obtenerCorreos()).toHaveLength(2);
  });
});