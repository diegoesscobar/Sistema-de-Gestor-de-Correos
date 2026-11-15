import { BandejaCorreos } from './BandejaCorreos';

export class BandejaEliminados extends BandejaCorreos {
  public readonly nombre = 'Eliminados';
  private readonly origenes = new Map<string, BandejaCorreos>(); // id del correo -> bandeja de donde salió

  // La papelera coordina el movimiento: saca el correo de su bandeja y se acuerda de dónde venía
  public recibirDesde(origen: BandejaCorreos, idCorreo: string): void {
    const correo = origen.removerCorreo(idCorreo);
    if (!correo) {
      throw new Error('El correo no existe');
    }
    this.agregarCorreo(correo);
    this.origenes.set(idCorreo, origen);
  }

  // Lo devuelve a la bandeja de origen, que es la única que sabe dónde va
  public restaurar(idCorreo: string): void {
    const origen = this.origenes.get(idCorreo);
    if (!origen) {
      throw new Error('El correo no está en Eliminados');
    }
    origen.agregarCorreo(this.removerCorreo(idCorreo)!);
    this.origenes.delete(idCorreo);
  }
}
