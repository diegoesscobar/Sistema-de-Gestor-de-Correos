import { IFiltro } from './IFiltro';

// RF-05: los filtros personalizados del usuario, como máximo 5 y sin nombres repetidos
export class RegistroFiltros {
    public static readonly MAXIMO = 5;
    private readonly _filtros = new Map<string, IFiltro>(); // nombre en minúsculas -> filtro

    public registrar(filtro: IFiltro): void {
        if (this._filtros.size >= RegistroFiltros.MAXIMO) {
            throw new Error('No se pueden registrar más de 5 filtros');
        }
        if (this._filtros.has(filtro.nombre.toLowerCase())) {
            throw new Error('Ya existe un filtro con ese nombre');
        }
        this._filtros.set(filtro.nombre.toLowerCase(), filtro);
    }

    public obtener(nombre: string): IFiltro | undefined {
        return this._filtros.get(nombre.toLowerCase());
    }

    public obtenerFiltros(): IFiltro[] {
        return [...this._filtros.values()];
    }
}
