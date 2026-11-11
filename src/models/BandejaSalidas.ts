import { Bandeja } from './Bandeja';
import { Correo } from './Correo';

export class BandejaSalidas extends Bandeja {
  
  constructor() {
    super();
  }

  public override agregarCorreo(correo: Correo): void {
    const existe = this.correos.some(c => c.id === correo.id);
    
    if (!existe) {
      super.agregarCorreo(correo);
    } else {
      console.warn(`[Aviso] El correo con ID ${correo.id} ya se encuentra en la Bandeja de Salidas.`);
    }
  }

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