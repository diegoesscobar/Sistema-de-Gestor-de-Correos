import { Contacto } from './Contacto';
import { VerificadorDeCorreo } from './VerificadordeCorreo';
import { IEstadoCorreo } from './IEstadoCorreo';
import { EstadoNoLeido } from './EstadoNoLeido';

export class Correo {
  private _destinatarios: Contacto[];
  private _estado: IEstadoCorreo = new EstadoNoLeido(); // todo correo arranca sin leer
  private _favorito: boolean = false;

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

    // Separación de responsabilidades: Validamos el formato del email usando la clase externa
    if (!VerificadorDeCorreo.validar(remitente.email)) {
      throw new Error('El correo electrónico del remitente no tiene un formato válido');
    }

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
    return this._favorito;
  }

  // El estado decide a cuál pasar, el correo solo guarda el nuevo
  public marcarComoLeido(): void {
    this._estado = this._estado.marcarLeido();
  }

  public marcarComoNoLeido(): void {
    this._estado = this._estado.marcarNoLeido();
  }

  public alternarFavorito(): void {
    this._favorito = !this._favorito;
  }
}