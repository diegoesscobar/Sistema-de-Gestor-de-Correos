import { IEstadoFavorito } from './IEstadoFavorito';
import { EstadoNoFavorito } from './EstadoNoFavorito';

export class EstadoFavorito implements IEstadoFavorito {
    public esFavorito(): boolean {
        return true;
    }

    public alternar(): IEstadoFavorito {
        return new EstadoNoFavorito();
    }
}
