import { Contacto } from './Contacto';
import { IIdentificable } from './IIdentificable';

export class Borrador implements IIdentificable {
    private _destinatarios: Contacto[];

    // Los datos son privados: solo cambian con editar(), asi nadie modifica el borrador por afuera
    constructor(
        public readonly id: string,
        private _asunto: string = '',
        private _contenido: string = '',
        private _remitente?: Contacto,
        destinatarios: Contacto[] = []
    ) {
        this._destinatarios = [...destinatarios];
    }

    public get asunto(): string { return this._asunto; }
    public get contenido(): string { return this._contenido; }
    public get remitente(): Contacto | undefined { return this._remitente; }

    // Copia, igual que en Correo, para que no se pueda hacer push desde afuera
    public get destinatarios(): ReadonlyArray<Contacto> {
        return [...this._destinatarios];
    }

    // El borrador cambia sus propios datos, solo los que le pasen
    public editar(asunto?: string, contenido?: string, remitente?: Contacto, destinatarios?: Contacto[]): void {
        if (asunto !== undefined) this._asunto = asunto;
        if (contenido !== undefined) this._contenido = contenido;
        if (remitente !== undefined) this._remitente = remitente;
        if (destinatarios !== undefined) this._destinatarios = [...destinatarios];
    }

    // Cada requisito es una lambda: para agregar uno nuevo se suma a la lista, sin tocar esValidoParaEnviar
    private readonly requisitosDeEnvio: Array<(b: Borrador) => boolean> = [
        b => b.remitente !== undefined,
        b => b.asunto.trim().length > 0,
        b => b.contenido.trim().length > 0,
        b => b.destinatarios.length > 0
    ];

    // El borrador puede estar incompleto, pero para enviarse tiene que cumplir todos los requisitos
    public esValidoParaEnviar(): boolean {
        return this.requisitosDeEnvio.every(requisito => requisito(this));
    }
}
