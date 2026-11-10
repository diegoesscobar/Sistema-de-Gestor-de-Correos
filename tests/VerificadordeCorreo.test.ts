import { describe, it, expect } from 'vitest';
import { VerificadorDeCorreo } from '../src/models/VerificadordeCorreo';

describe('VerificadorDeCorreo', () => {
  
  describe('Correos válidos', () => {
    it('Debería aceptar un correo con formato estándar', () => {
      const esValido = VerificadorDeCorreo.validar('usuario@dominio.com');
      expect(esValido).toBe(true);
    });

    it('Debería aceptar un correo con puntos y guiones en el nombre de usuario', () => {
      const esValido = VerificadorDeCorreo.validar('nombre.apellido-123@sub.dominio.org');
      expect(esValido).toBe(true);
    });

    it('Debería aceptar un correo eliminando espacios en blanco al inicio o final (trim)', () => {
      const esValido = VerificadorDeCorreo.validar('  correo@dominio.com  ');
      expect(esValido).toBe(true);
    });
  });

  describe('Correos inválidos', () => {
    it('Debería rechazar un correo sin el símbolo @', () => {
      const esValido = VerificadorDeCorreo.validar('usuariominio.com');
      expect(esValido).toBe(false);
    });
  });
})
