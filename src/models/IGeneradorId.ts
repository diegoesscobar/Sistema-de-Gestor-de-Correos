// El Buzon depende de esta interfaz y no de cómo se generan los ids (inversión de dependencias)
export interface IGeneradorId {
    siguiente(): string;
}
