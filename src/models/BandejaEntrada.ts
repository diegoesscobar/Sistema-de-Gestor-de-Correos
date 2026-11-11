import { Bandeja } from './Bandeja';
import { Correo } from './Correo';

export class BandejaEntrada extends Bandeja {
  // agregarCorreo y el control de duplicados se heredan de Bandeja

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