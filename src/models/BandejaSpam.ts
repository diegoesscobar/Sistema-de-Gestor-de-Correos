import { Bandeja } from './Bandeja';
import { Correo } from './Correo';

export class BandejaSpam extends Bandeja {
  // agregarCorreo y el control de duplicados se heredan de Bandeja

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