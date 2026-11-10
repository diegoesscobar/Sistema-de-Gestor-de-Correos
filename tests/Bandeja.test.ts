import { describe, it, expect } from 'vitest';
import { BandejaEntrada } from '../src/models/Bandeja';
import { Correo } from '../src/models/Correo';
import { Contacto } from '../src/models/Contacto';

describe('Estructura de Bandejas', () => {
  const remitente = new Contacto('Juan', 'juan@test.com');
  const destinatario = new Contacto('Maria', 'maria@test.com');

  it('Debería permitir agregar un correo a la bandeja', () => {
    const bandeja = new BandejaEntrada();
    const correo = new Correo('1', 'Hola', 'Contenido', remitente, [destinatario]);
    
    bandeja.agregarCorreo(correo);

    expect(bandeja.obtenerCorreos()).toHaveLength(1);
    expect(bandeja.obtenerCorreos()[0].asunto).toBe('Hola');
  });

  it('Debería permitir eliminar un correo por su ID y retornarlo', () => {
    const bandeja = new BandejaEntrada();
    const correo = new Correo('1', 'Hola', 'Contenido', remitente, [destinatario]);
    bandeja.agregarCorreo(correo);

    const correoEliminado = bandeja.removerCorreo('1');

    expect(correoEliminado).toBeDefined();
    expect(correoEliminado?.id).toBe('1');
    expect(bandeja.obtenerCorreos()).toHaveLength(0);
  });

  it('No debería permitir agregar correos con el mismo ID (duplicados)', () => {
    const bandeja = new BandejaEntrada();
    const correo1 = new Correo('1', 'Asunto Original', 'Texto 1', remitente, [destinatario]);
    const correo2 = new Correo('1', 'Asunto Duplicado', 'Texto 2', remitente, [destinatario]);

    bandeja.agregarCorreo(correo1);
    bandeja.agregarCorreo(correo2); // Intento de duplicado

    expect(bandeja.obtenerCorreos()).toHaveLength(1);
    expect(bandeja.obtenerCorreos()[0].asunto).toBe('Asunto Original');
  });
});