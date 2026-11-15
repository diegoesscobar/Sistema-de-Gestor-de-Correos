import { Correo } from './Correo';
import { IFiltro } from './IFiltro';
import { Predicado } from './Predicado';

// RF-05: un filtro es un nombre + un predicado. No guarda correos, los evalúa cuando se aplica
export class Filtro implements IFiltro {
    constructor(public readonly nombre: string, private readonly condicion: Predicado<Correo>) {
        if (!nombre || nombre.trim().length === 0) {
            throw new Error('El filtro necesita un nombre');
        }
    }

    public cumple(correo: Correo): boolean {
        return this.condicion(correo);
    }

    // filter devuelve un array nuevo, los correos originales no se tocan
    public aplicar(correos: ReadonlyArray<Correo>): Correo[] {
        return correos.filter(correo => this.cumple(correo));
    }
}
