// Mismo patrón State que la lectura, pero para favorito
export interface IEstadoFavorito {
    esFavorito(): boolean;
    alternar(): IEstadoFavorito;
}
