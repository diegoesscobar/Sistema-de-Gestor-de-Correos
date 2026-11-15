import { describe, it, expect } from 'vitest';
import { RegistroFiltros } from '../src/models/RegistroFiltros';
import { Filtro } from '../src/models/Filtro';
import { asuntoContiene } from '../src/models/PredicadosCorreo';

describe('RF-05: Registro de filtros', () => {
    it('Debería registrar hasta cinco filtros e impedir el sexto', () => {
        const registro = new RegistroFiltros();
        [1, 2, 3, 4, 5].forEach(n => registro.registrar(new Filtro('Filtro ' + n, asuntoContiene('x'))));

        expect(registro.obtenerFiltros()).toHaveLength(5);
        expect(() => registro.registrar(new Filtro('Filtro 6', asuntoContiene('x')))).toThrow('No se pueden registrar más de 5 filtros');
    });

    it('Debería buscar por nombre sin importar mayúsculas y no repetir nombres', () => {
        const registro = new RegistroFiltros();
        const filtro = new Filtro('Examenes', asuntoContiene('examen'));
        registro.registrar(filtro);

        expect(registro.obtener('EXAMENES')).toBe(filtro);
        expect(() => registro.registrar(new Filtro('examenes', asuntoContiene('x')))).toThrow('Ya existe un filtro con ese nombre');
    });
});
