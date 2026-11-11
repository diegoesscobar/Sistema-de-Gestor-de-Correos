import { Contacto } from './Contacto';
import { IEstadoCorreo } from './IEstadoCorreo';
import { EstadoNoLeido } from './EstadoNoLeido';
import { IEstadoFavorito } from './IEstadoFavorito';
import { EstadoNoFavorito } from './EstadoNoFavorito';

export class Correo {
  private _destinatarios: Contacto[];
  private _estado: IEstadoCorreo = new EstadoNoLeido(); // todo correo arranca sin leer
  private _estadoFavorito: IEstadoFavorito = new EstadoNoFavorito(); // y sin ser favorito

  constructor(
    public readonly id: string,
    public readonly asunto: string,
    public readonly contenido: string,
    public readonly remitente: Contacto,
    destinatarios: Contacto[]
  ) {
    if (!id || !asunto || !contenido || !remitente || !destinatarios || destinatarios.length === 0) {
      throw new Error('Faltan datos obligatorios');
    }

    // El email del remitente no se vuelve a validar: un Contacto no se puede crear con email inválido
    this._destinatarios = [...destinatarios]; // Copia inicial
  }

  // Retorna una copia para que nadie modifique el array original
  public get destinatarios(): ReadonlyArray<Contacto> {
    return [...this._destinatarios];
  }

  public get leido(): boolean {
    return this._estado.estaLeido();
  }

  public get favorito(): boolean {
    return this._estadoFavorito.esFavorito();
  }

  // El estado decide a cuál pasar, el correo solo guarda el nuevo
  public marcarComoLeido(): void {
    this._estado = this._estado.marcarLeido();
  }

  public marcarComoNoLeido(): void {
    this._estado = this._estado.marcarNoLeido();
  }

  public alternarFavorito(): void {
    this._estadoFavorito = this._estadoFavorito.alternar();
  }
}