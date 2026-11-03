import { Contacto } from './Contacto';

export class Correo {
  private _destinatarios: Contacto[];
  private _leido: boolean = false;
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
    this._destinatarios = [...destinatarios]; // Copia inicial
  }
  // Retorna una copia para que nadie modifique el array original
  public get destinatarios(): ReadonlyArray<Contacto> {
    return [...this._destinatarios];
  }

  public get leido(): boolean {
    return this._leido;
  }

  public get favorito(): boolean {
    return this._favorito;
  }
}