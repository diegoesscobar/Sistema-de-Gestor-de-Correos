import { Bandeja } from './Bandeja';
import { Correo } from './Correo';

export class BandejaEliminados extends Bandeja {
  constructor() {
    super();
  }

  // Control defensivo de duplicados al enviar un correo a la papelera
  public override agregarCorreo(correo: Correo): void {
    const existe = this.correos.some(c => c.id === correo.id);
    
    if (!existe) {
      super.agregarCorreo(correo);
    } else {
      console.warn(`[Aviso] El correo con ID ${correo.id} ya se encuentra en la Bandeja de Eliminados.`);
    }
  }

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