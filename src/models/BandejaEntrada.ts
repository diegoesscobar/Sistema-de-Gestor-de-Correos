import { Bandeja } from './Bandeja';
import { Correo } from './Correo';

export class BandejaEntrada extends Bandeja {
  
  constructor() {
    super(); // Inicializa el array de correos heredado de la superclase
  }

  // Control defensivo de duplicados al agregar un correo
  public override agregarCorreo(correo: Correo): void {
    const existe = this.correos.some(c => c.id === correo.id);
    
    if (!existe) {
      super.agregarCorreo(correo);
    } else {
      console.warn(`[Aviso] El correo con ID ${correo.id} ya existe en la Bandeja de Entrada.`);
    }
  }

  // Método específico: Marcar un correo como leído usando el método de Correo
  public marcarComoLeido(idCorreo: string): void {
    const correo = this.correos.find(c => c.id === idCorreo);
    if (correo) {
      correo.marcarComoLeido();
    } else {
      console.warn(`[Aviso] No se encontró el correo con ID ${idCorreo} en la Bandeja de Entrada.`);
    }
  }

  // Método específico: Buscar correos filtrando por el email del remitente
  public buscarPorRemitente(filtro: string): Correo[] {
    return this.correos.filter(c => 
      c.remitente.email.toLowerCase().includes(filtro.toLowerCase())
    );
  }
}