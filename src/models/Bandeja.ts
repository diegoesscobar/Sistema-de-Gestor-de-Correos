import { Correo } from './Correo';

export abstract class Bandeja {
    protected correos: Correo[];

    constructor() {
        this.correos = [];
    }

    // Busca un correo por su id, si no está devuelve undefined
    public buscarPorId(idCorreo: string): Correo | undefined {
        return this.correos.find(c => c.id === idCorreo);
    }

    // Método común para agregar un correo a la bandeja
    public agregarCorreo(correo: Correo): void {
        if (!this.buscarPorId(correo.id)) {
            this.correos.push(correo);
        }
    }

    // Método común para remover un correo por ID
    public removerCorreo(idCorreo: string): Correo | undefined {
        const index = this.correos.findIndex(c => c.id === idCorreo);
        if (index !== -1) {
            return this.correos.splice(index, 1)[0];
        }
        return undefined;
    }

    // Método común para obtener todos los correos (retornando una copia por seguridad)
    public obtenerCorreos(): Correo[] {
        return [...this.correos];
    }

    // RF-08: filter devuelve un array nuevo, asi que no se toca la bandeja original
    public obtenerNoLeidos(): Correo[] {
        return this.correos.filter(c => !c.leido);
    }

    // Estaban copiadas en Enviados y Salidas, ahora las heredan todas las bandejas
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
