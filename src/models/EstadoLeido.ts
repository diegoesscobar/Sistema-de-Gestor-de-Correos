import { IEstadoCorreo } from './IEstadoCorreo';
import { EstadoNoLeido } from './EstadoNoLeido';

export class EstadoLeido implements IEstadoCorreo {
    public estaLeido(): boolean {
        return true;
    }

    // Ya está leído, se queda igual
    public marcarLeido(): IEstadoCorreo {
        return this;
    }

    public marcarNoLeido(): IEstadoCorreo {
        return new EstadoNoLeido();
    }
}
