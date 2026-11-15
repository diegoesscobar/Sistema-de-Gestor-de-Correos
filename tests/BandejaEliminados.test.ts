import { describe, it, expect, beforeEach } from 'vitest';
import { BandejaEliminados } from '../src/models/BandejaEliminados';
import { BandejaEntrada } from '../src/models/BandejaEntrada';
import { Correo } from '../src/models/Correo';
import { Contacto } from '../src/models/Contacto';

describe('Pruebas unitarias: Bandeja de Eliminados', () => {
  let remitente: Contacto;
  let destinatario: Contacto;

  beforeEach(() => {
    remitente = new Contacto('Juan', 'juan@test.com');
    destinatario = new Contacto('Maria', 'maria@test.com');
  });

  it('Debería permitir agregar y obtener correos en la bandeja de eliminados', () => {
    const bandeja = new BandejaEliminados();
    const correo = new Correo('1', 'Papelera', 'Texto', remitente, [destinatario]);
    
    bandeja.agregarCorreo(correo);

    expect(bandeja.obtenerCorreos()).toHaveLength(1);
    expect(bandeja.obtenerCorreos()[0].asunto).toBe('Papelera');
  });

  it('Debería permitir remover un correo de la bandeja de eliminados por su ID', () => {
    const bandeja = new BandejaEliminados();
    const correo = new Correo('1', 'Papelera', 'Texto', remitente, [destinatario]);
    bandeja.agregarCorreo(correo);

    const correoEliminado = bandeja.removerCorreo('1');

    expect(correoEliminado).toBeDefined();
    expect(correoEliminado?.id).toBe('1');
    expect(bandeja.obtenerCorreos()).toHaveLength(0);
  });

  it('Debería retornar undefined al intentar remover un correo cuyo ID no existe en la papelera', () => {
    const bandeja = new BandejaEliminados();
    const correo = new Correo('1', 'Papelera', 'Texto', remitente, [destinatario]);
    bandeja.agregarCorreo(correo);

    const resultado = bandeja.removerCorreo('999'); // ID inexistente

    expect(resultado).toBeUndefined();
    expect(bandeja.obtenerCorreos()).toHaveLength(1);
  });

  it('Debería almacenar múltiples correos conservando el orden de llegada', () => {
    const bandeja = new BandejaEliminados();
    const correo1 = new Correo('1', 'Primero', 'Texto 1', remitente, [destinatario]);
    const correo2 = new Correo('2', 'Segundo', 'Texto 2', remitente, [destinatario]);

    bandeja.agregarCorreo(correo1);
    bandeja.agregarCorreo(correo2);

    const eliminados = bandeja.obtenerCorreos();
    expect(eliminados).toHaveLength(2);
    expect(eliminados[0].id).toBe('1');
    expect(eliminados[1].id).toBe('2');
  });

  it('Debería sacar el correo de su bandeja y después devolverlo a esa misma bandeja', () => {
    const papelera = new BandejaEliminados();
    const entrada = new BandejaEntrada();
    entrada.agregarCorreo(new Correo('1', 'Hola', 'Texto', remitente, [destinatario]));

    papelera.recibirDesde(entrada, '1');
    expect(entrada.obtenerCorreos()).toHaveLength(0);
    expect(papelera.obtenerCorreos()).toHaveLength(1);

    papelera.restaurar('1');
    expect(entrada.obtenerCorreos()).toHaveLength(1);
    expect(papelera.obtenerCorreos()).toHaveLength(0);
  });

  it('Debería lanzar error si el correo no está en la bandeja de origen o en la papelera', () => {
    const papelera = new BandejaEliminados();
    expect(() => papelera.recibirDesde(new BandejaEntrada(), 'x')).toThrow('El correo no existe');
    expect(() => papelera.restaurar('x')).toThrow('El correo no está en Eliminados');
  });
});