import { IEstadoCorreo } from './IEstadoCorreo';
import { EstadoLeido } from './EstadoLeido';

export class EstadoNoLeido implements IEstadoCorreo {
    public estaLeido(): boolean {
        return false;
    }

    public marcarLeido(): IEstadoCorreo {
        return new EstadoLeido();
    }

    // Ya está como no leído, se queda igual
    public marcarNoLeido(): IEstadoCorreo {
        return this;
    }
}
