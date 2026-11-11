import { IEstadoFavorito } from './IEstadoFavorito';
import { EstadoFavorito } from './EstadoFavorito';

export class EstadoNoFavorito implements IEstadoFavorito {
    public esFavorito(): boolean {
        return false;
    }

    public alternar(): IEstadoFavorito {
        return new EstadoFavorito();
    }
}
