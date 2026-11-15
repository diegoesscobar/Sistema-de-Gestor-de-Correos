import { describe, it, expect } from 'vitest';
import { Bandeja } from '../src/models/Bandeja';
import { IIdentificable } from '../src/models/IIdentificable';
import { BandejaEntrada } from '../src/models/BandejaEntrada';
import { BandejaEnviados } from '../src/models/BandejaEnviados';
import { BandejaEliminados } from '../src/models/BandejaEliminados';
import { BandejaBorradores } from '../src/models/BandejaBorradores';

describe('RF-06: Herencia de bandejas', () => {
    it('Cada bandeja hija tiene su propio nombre aunque se usen todas como Bandeja', () => {
        const bandejas: Bandeja<IIdentificable>[] = [
            new BandejaEntrada(), new BandejaEnviados(), new BandejaEliminados(), new BandejaBorradores()
        ];

        expect(bandejas.map(b => b.nombre)).toEqual(['Entrada', 'Enviados', 'Eliminados', 'Borradores']);
    });
});
