import { IIdentificable } from './IIdentificable';

// Bandeja generica: guarda cualquier cosa con id (correos o borradores) sin duplicarla
export abstract class Bandeja<T extends IIdentificable> {
    protected correos: T[];

    constructor() {
        this.correos = [];
    }

    // Busca un correo por su id, si no está devuelve undefined
    public buscarPorId(idCorreo: string): T | undefined {
        return this.correos.find(c => c.id === idCorreo);
    }

    // Método común para agregar un correo a la bandeja
    public agregarCorreo(correo: T): void {
        if (!this.buscarPorId(correo.id)) {
            this.correos.push(correo);
        }
    }

    // Método común para remover un correo por ID
    public removerCorreo(idCorreo: string): T | undefined {
        const index = this.correos.findIndex(c => c.id === idCorreo);
        if (index !== -1) {
            return this.correos.splice(index, 1)[0];
        }
        return undefined;
    }

    // Método común para obtener todos los correos (retornando una copia por seguridad)
    public obtenerCorreos(): T[] {
        return [...this.correos];
    }
}
