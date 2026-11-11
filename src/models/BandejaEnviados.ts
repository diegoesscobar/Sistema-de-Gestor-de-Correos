import { Bandeja } from './Bandeja';
import { Correo } from './Correo';

export class BandejaEnviados extends Bandeja {
  
  constructor() {
    super();
  }

  // Sobrescribimos el método agregarCorreo aplicando control de unicidad para enviados
  public agregarCorreo(correo: Correo): void {
    // Validamos si ya existe un correo con el mismo ID en la bandeja de enviados
    const existe = this.correos.some(c => c.id === correo.id);
    
    if (!existe) {
      // Si no existe, reutilizamos la lógica del padre para agregarlo
      super.agregarCorreo(correo);
    } else {
      console.warn(`[Aviso] El correo enviado con ID ${correo.id} ya se encuentra registrado.`);
    }
  }

  // Los métodos de removerCorreo, obtenerCorreos y obtenerNoLeidos 
  // ya se heredan de Bandeja como pasa en los demás.
}