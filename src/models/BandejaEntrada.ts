import { Bandeja } from './Bandeja';
import { Correo } from './Correo';

export class BandejaEntrada extends Bandeja {
  // agregarCorreo, buscarPorId y el control de duplicados se heredan de Bandeja.
  // Marcar como leído lo hace el propio Correo: bandeja.buscarPorId(id)?.marcarComoLeido()

  // Método específico: Buscar correos filtrando por el email del remitente
  public buscarPorRemitente(filtro: string): Correo[] {
    return this.correos.filter(c => 
      c.remitente.email.toLowerCase().includes(filtro.toLowerCase())
    );
  }
}