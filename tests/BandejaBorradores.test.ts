import { describe, it, expect } from 'vitest';
import { BandejaBorradores } from '../src/models/BandejaBorradores';
import { Borrador } from '../src/models/Borrador';

describe('RF-07: Bandeja de Borradores', () => {
    it('Debería guardar un borrador y poder recuperarlo por su ID', () => {
        const bandeja = new BandejaBorradores();
        bandeja.agregarCorreo(new Borrador('b1', 'Sin terminar'));

        expect(bandeja.buscarPorId('b1')?.asunto).toBe('Sin terminar');
    });

    it('No debería guardar borradores duplicados', () => {
        const bandeja = new BandejaBorradores();
        bandeja.agregarCorreo(new Borrador('b1'));
        bandeja.agregarCorreo(new Borrador('b1'));

        expect(bandeja.obtenerCorreos()).toHaveLength(1);
    });

    it('Debería remover un borrador y retornarlo', () => {
        const bandeja = new BandejaBorradores();
        bandeja.agregarCorreo(new Borrador('b1'));

        expect(bandeja.removerCorreo('b1')?.id).toBe('b1');
        expect(bandeja.obtenerCorreos()).toHaveLength(0);
    });
});
