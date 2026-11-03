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
    this._destinatarios = destinatarios;
  }
}