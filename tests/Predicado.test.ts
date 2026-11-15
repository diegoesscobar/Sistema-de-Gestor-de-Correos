import { describe, it, expect } from 'vitest';
import { Predicado, y, o, no } from '../src/models/Predicado';

describe('RF-05: Combinación de predicados', () => {
    const esPar: Predicado<number> = n => n % 2 === 0;
    const esMayorA10: Predicado<number> = n => n > 10;
    const numeros = [4, 7, 12, 15];

    it('y() se cumple solo si se cumplen todos', () => {
        expect(numeros.filter(y(esPar, esMayorA10))).toEqual([12]);
    });

    it('o() se cumple si se cumple alguno', () => {
        expect(numeros.filter(o(esPar, esMayorA10))).toEqual([4, 12, 15]);
    });

    it('no() invierte el predicado y se puede combinar con los otros', () => {
        expect(numeros.filter(no(esPar))).toEqual([7, 15]);
        expect(numeros.filter(y(no(esPar), esMayorA10))).toEqual([15]);
    });
});
