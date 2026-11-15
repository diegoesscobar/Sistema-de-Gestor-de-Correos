// Un predicado es una función que dice si algo cumple una condición
export type Predicado<T> = (elemento: T) => boolean;

// Funciones de orden superior: reciben predicados y devuelven uno nuevo que los combina
export const y = <T>(...predicados: Predicado<T>[]): Predicado<T> =>
    elemento => predicados.every(predicado => predicado(elemento));

export const o = <T>(...predicados: Predicado<T>[]): Predicado<T> =>
    elemento => predicados.some(predicado => predicado(elemento));

export const no = <T>(predicado: Predicado<T>): Predicado<T> =>
    elemento => !predicado(elemento);
