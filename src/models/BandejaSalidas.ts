import { Bandeja } from './Bandeja';
import { Correo } from './Correo';

export class BandejaSalidas extends Bandeja {
  
  constructor() {
    super();
  }

  // Sobrescribimos el método agregarCorreo adaptándolo a las salidas
  public agregarCorreo(correo: Correo): void {
    // Validamos que no exista un correo con el mismo ID en la bandeja de salidas
    const existe = this.correos.some(c => c.id === correo.id);
    
    if (!existe) {
      // Reutilizamos el método original del padre para agregar el correo de salida
      super.agregarCorreo(correo);
    } else {
      console.warn(`[Aviso] El correo de salida con ID ${correo.id} ya se encuentra registrado.`);
    }
  }

  // Los demás métodos de remover, obtener todos y filtrar los no leídos 
  // se heredan automáticamente de Bandeja.
}