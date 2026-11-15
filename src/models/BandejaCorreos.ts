import { Bandeja } from './Bandeja';
import { Correo } from './Correo';

// Las bandejas de correos ya enviados o recibidos: lo que solo tiene sentido con un Correo completo
export abstract class BandejaCorreos extends Bandeja<Correo> {
    // RF-08: filter devuelve un array nuevo, asi que no se toca la bandeja original
    public obtenerNoLeidos(): Correo[] {
        return this.correos.filter(c => !c.leido);
    }

    public buscarPorAsunto(asunto: string): Correo[] {
        const asuntoBuscado = asunto.toLowerCase().trim();
        return this.correos.filter(c => c.asunto.toLowerCase().includes(asuntoBuscado));
    }

    public buscarPorDestinatario(destinatarioBuscado: string): Correo[] {
        const textoBuscado = destinatarioBuscado.toLowerCase().trim();
        return this.correos.filter(c =>
            c.destinatarios.some(d => d.nombre.toLowerCase().includes(textoBuscado) || d.email.includes(textoBuscado))
        );
    }
}
