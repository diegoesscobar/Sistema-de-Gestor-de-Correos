import { describe, it, expect } from 'vitest';
import { EstadoLeido } from '../src/models/EstadoLeido';
import { EstadoNoLeido } from '../src/models/EstadoNoLeido';
import { EstadoFavorito } from '../src/models/EstadoFavorito';
import { EstadoNoFavorito } from '../src/models/EstadoNoFavorito';

describe('Patrón State: estados de lectura', () => {
    it('Un estado no leído debería pasar a leído', () => {
        const estado = new EstadoNoLeido().marcarLeido();
        expect(estado.estaLeido()).toBe(true);
        expect(estado).toBeInstanceOf(EstadoLeido);
    });

    it('Un estado leído debería pasar a no leído', () => {
        const estado = new EstadoLeido().marcarNoLeido();
        expect(estado.estaLeido()).toBe(false);
        expect(estado).toBeInstanceOf(EstadoNoLeido);
    });
});

describe('Patrón State: estados de favorito', () => {
    it('Alternar debería ir y volver entre favorito y no favorito', () => {
        const favorito = new EstadoNoFavorito().alternar();
        expect(favorito).toBeInstanceOf(EstadoFavorito);
        expect(favorito.alternar().esFavorito()).toBe(false);
    });
});
