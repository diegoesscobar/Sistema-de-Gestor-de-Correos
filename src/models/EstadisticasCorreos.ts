import { Correo } from './Correo';
import { Predicado } from './Predicado';

// RF-10: resúmenes de una colección de correos con map, filter y reduce. Nunca modifica los correos
export class EstadisticasCorreos {
    private readonly _correos: ReadonlyArray<Correo>;

    constructor(correos: ReadonlyArray<Correo>) {
        this._correos = [...correos];
    }

    // map: misma cantidad de elementos, pero cada correo se transforma en su asunto
    public asuntos(): string[] {
        return this._correos.map(correo => correo.asunto);
    }

    // filter con cualquier predicado, incluidos los combinados con y, o, no
    public filtrar(condicion: Predicado<Correo>): Correo[] {
        return this._correos.filter(condicion);
    }
}
