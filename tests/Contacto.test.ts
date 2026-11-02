import { describe, it, expect } from 'vitest';
import { Contacto } from '../src/models/Contacto';

describe('Gestión de Contactos (RF-03)', () => {
  it('Debería crear un contacto válido usando getters y setters', () => {
    const contacto = new Contacto('Diego Escobar', 'DIEGOESCOBAR@EMAIL.COM');
    expect(contacto.nombre).toBe('Diego Escobar');
    expect(contacto.email).toBe('diegoescobar@email.com');
  });

  it('Debería lanzar un error si el formato del correo es inválido', () => {
    expect(() => {
      new Contacto('María Gómez', 'correo-invalido.com');
    }).toThrow('Dirección de correo no es válido');
  });

  it('Debería lanzar un error si el nombre está vacío o tiene solo espacios', () => {
    expect(() => {
      new Contacto('   ', 'contacto@email.com');
    }).toThrow('El nombre no puede estar vacío');
  });

  it('Debería permitir modificar el nombre y email a través de los setters validados', () => {
    const contacto = new Contacto('Juan', 'juan@email.com');

    contacto.nombre = 'Juan Pérez';
    expect(contacto.nombre).toBe('Juan Pérez');

    contacto.email = 'JUAN.PEREZ@EMAIL.COM';
    expect(contacto.email).toBe('juan.perez@email.com');
  });
});