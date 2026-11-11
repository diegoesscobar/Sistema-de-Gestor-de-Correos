import { IEstadoLectura } from './IEstadoLectura';
import { EstadoNoLeido } from './EstadoNoLeido';

export class EstadoLeido implements IEstadoLectura {
    public estaLeido(): boolean {
        return true;
    }

    // Ya está leído, se queda igual
    public marcarLeido(): IEstadoLectura {
        return this;
    }

    public marcarNoLeido(): IEstadoLectura {
        return new EstadoNoLeido();
    }
}
