import { BandejaCorreos } from './BandejaCorreos';

export class BandejaEnviados extends BandejaCorreos {
  public readonly nombre = 'Enviados';
  // agregarCorreo, el control de duplicados y las búsquedas se heredan de Bandeja
}
