import { Bandeja } from './Bandeja';
import { Correo } from './Correo';

export class BandejaEliminados extends Bandeja {
  constructor() {
    super();
  }

  // Al igual que las demás, evitamos duplicados en la papelera
  public agregarCorreo(correo: Correo): void {
    const existe = this.correos.some(c => c.id === correo.id);
    if (!existe) {
      super.agregarCorreo(correo);
    } else {
      console.warn(`[Aviso] El correo con ID ${correo.id} ya se encuentra en eliminados.`);
    }
  }
  // Sacamos el correo de eliminados por su ID para que pueda volver a su bandeja
  public restaurarCorreo(idCorreo: string): Correo | undefined {
    return this.removerCorreo(idCorreo); 
    // Reutilizamos 'removerCorreo' del padre, ya que al removerlo de la papelera 
    // lo devolvemos listo para ser reingresado en su bandeja original.
  }
}