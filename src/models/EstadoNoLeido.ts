import { IEstadoLectura } from './IEstadoLectura';
import { EstadoLeido } from './EstadoLeido';

export class EstadoNoLeido implements IEstadoLectura {
    public estaLeido(): boolean {
        return false;
    }

    public marcarLeido(): IEstadoLectura {
        return new EstadoLeido();
    }

    // Ya está como no leído, se queda igual
    public marcarNoLeido(): IEstadoLectura {
        return this;
    }
}
