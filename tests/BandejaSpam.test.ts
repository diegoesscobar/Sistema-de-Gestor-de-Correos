import { describe, it, expect, beforeEach } from 'vitest';
import { BandejaSpam } from '../src/models/BandejaSpam';
import { Correo } from '../src/models/Correo';
import { Contacto } from '../src/models/Contacto';

describe('Pruebas unitarias: Bandeja de Spam', () => {
  let remitente: Contacto;
  let destinatario: Contacto;

  beforeEach(() => {
    remitente = new Contacto('Spammer', 'spam@test.com');
    destinatario = new Contacto('Diego', 'diego@ucp.edu.ar');
  });

  it('Debería permitir agregar y obtener correos en la bandeja de spam', () => {
    const bandeja = new BandejaSpam();
    const correo = new Correo('1', '¡Ganá premios!', 'Texto sospechoso', remitente, [destinatario]);
    
    bandeja.agregarCorreo(correo);

    expect(bandeja.obtenerCorreos()).toHaveLength(1);
    expect(bandeja.obtenerCorreos()[0].asunto).toBe('¡Ganá premios!');
  });

  it('Debería permitir remover un correo de spam por su ID', () => {
    const bandeja = new BandejaSpam();
    const correo = new Correo('1', '¡Te ganaste un auto!', 'Texto sospechoso', remitente, [destinatario]);
    bandeja.agregarCorreo(correo);

    const correoRemovido = bandeja.removerCorreo('1');

    expect(correoRemovido).toBeDefined();
    expect(correoRemovido?.id).toBe('1');
    expect(bandeja.obtenerCorreos()).toHaveLength(0);
  });

  it('Debería retornar undefined al intentar remover un correo cuyo ID no existe en spam', () => {
    const bandeja = new BandejaSpam();
    const correo = new Correo('1', '¡Te regalamos un celular!', 'Texto sospechoso', remitente, [destinatario]);
    bandeja.agregarCorreo(correo);

    const resultado = bandeja.removerCorreo('777');

    expect(resultado).toBeUndefined();
    expect(bandeja.obtenerCorreos()).toHaveLength(1);
  });
});