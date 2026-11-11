import { Bandeja } from './Bandeja';
import { Correo } from './Correo';

export class BandejaSpam extends Bandeja {
  
  constructor() {
    super();
  }

  // Control defensivo de duplicados al agregar un correo a Spam
  public override agregarCorreo(correo: Correo): void {
    const existe = this.correos.some(c => c.id === correo.id);
    
    if (!existe) {
      super.agregarCorreo(correo);
    } else {
      console.warn(`[Aviso] El correo con ID ${correo.id} ya se encuentra en la Bandeja de Spam.`);
    }
  }

  // Método específico: Saca el correo de spam y lo devuelve para moverlo a otra bandeja
  public sacarDeSpam(idCorreo: string): Correo | undefined {
    const correoEncontrado = this.correos.find(c => c.id === idCorreo);
    
    if (correoEncontrado) {
      return this.removerCorreo(idCorreo); // Lo quita de spam y lo retorna listo para reubicar
    } else {
      console.warn(`[Aviso] No se encontró el correo con ID ${idCorreo} en la Bandeja de Spam.`);
      return undefined;
    }
  }
}