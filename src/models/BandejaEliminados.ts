import { Bandeja } from './Bandeja';
import { Correo } from './Correo';

export class BandejaEliminados extends Bandeja {
  // agregarCorreo y el control de duplicados se heredan de Bandeja

  // Método específico: Restaura un correo de la papelera devolviéndolo para reubicarlo
  public restaurarCorreo(idCorreo: string): Correo | undefined {
    const correoEncontrado = this.correos.find(c => c.id === idCorreo);
    
    if (correoEncontrado) {
      return this.removerCorreo(idCorreo); // Lo quita de eliminados y lo retorna
    } else {
      console.warn(`[Aviso] No se encontró el correo con ID ${idCorreo} en la Bandeja de Eliminados.`);
      return undefined;
    }
  }
}