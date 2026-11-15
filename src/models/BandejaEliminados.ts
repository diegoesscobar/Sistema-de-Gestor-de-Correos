import { BandejaCorreos } from './BandejaCorreos';

export class BandejaEliminados extends BandejaCorreos {
  public readonly nombre = 'Eliminados';
  // Restaurar lo hace GestorCorreos.restaurarCorreo, que sabe a qué bandeja devolverlo
}
