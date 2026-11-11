import { Bandeja } from './Bandeja';
import { Correo } from './Correo';

export class BandejaSalidas extends Bandeja {
  // agregarCorreo y el control de duplicados se heredan de Bandeja

  // Método específico: Buscar correos salientes por destinatario
  public buscarPorDestinatario(destinatarioBuscado: string): Correo[] {
    const textoBuscado = destinatarioBuscado.toLowerCase().trim();
    
    return this.correos.filter(correo => 
      correo.destinatarios.some(d => 
        d.nombre.toLowerCase().includes(textoBuscado) || 
        d.email.toLowerCase().includes(textoBuscado)
      )
    );
  }

  // Método específico: Buscar correos salientes por asunto
  public buscarPorAsunto(asunto: string): Correo[] {
    const asuntoBuscado = asunto.toLowerCase().trim();
    return this.correos.filter(c => c.asunto.toLowerCase().includes(asuntoBuscado));
  }
}