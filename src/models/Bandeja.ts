import { Correo } from './Correo';

export abstract class Bandeja {
    protected correos: Correo[];

    constructor() {
        this.correos = [];
    }

    // Método común para agregar un correo a la bandeja
    public agregarCorreo(correo: Correo): void {
        if (!this.correos.some(c => c.id === correo.id)) {
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
}

export class BandejaEntrada extends Bandeja {
    // Acá se puede agregar reglas o métodos específicos de la bandeja de entrada más adelante
}

export class BandejaSalidas extends Bandeja {
    // Reglas específicas para correos salientes
}

export class BandejaEnviados extends Bandeja {
    // Reglas específicas para correos ya enviados
}


export class BandejaSpam extends Bandeja {
    // Reglas específicas para correos marcados como spam
}