import { Bandeja } from './Bandeja';
import { Correo } from './Correo';

export class BandejaSpam extends Bandeja {
  
  constructor() {
    super();
  }

  // Sobrescribimos el método agregarCorreo aplicando control de unicidad para spam
  public agregarCorreo(correo: Correo): void {
    // Validamos si ya existe un correo con el mismo ID en la bandeja de spam
    const existe = this.correos.some(c => c.id === correo.id);
    
    if (!existe) {
      super.agregarCorreo(correo);
    } else {
      console.warn(`[Aviso] El correo de spam con ID ${correo.id} ya se encuentra registrado.`);
    }
  }
}