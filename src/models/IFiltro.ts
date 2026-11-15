import { Correo } from './Correo';

export interface IFiltro {
    readonly nombre: string;
    cumple(correo: Correo): boolean;
    aplicar(correos: ReadonlyArray<Correo>): Correo[];
}
