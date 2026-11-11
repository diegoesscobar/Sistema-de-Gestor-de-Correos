import { Contacto } from './Contacto';

export class Borrador {
    constructor(
        public id: string,
        public asunto: string = '',
        public contenido: string = '',
        public remitente?: Contacto,
        public destinatarios: Contacto[] = []
    ) { }

    // El borrador cambia sus propios datos, solo los que le pasen
    public editar(asunto?: string, contenido?: string, remitente?: Contacto, destinatarios?: Contacto[]): void {
        if (asunto !== undefined) this.asunto = asunto;
        if (contenido !== undefined) this.contenido = contenido;
        if (remitente !== undefined) this.remitente = remitente;
        if (destinatarios !== undefined) this.destinatarios = [...destinatarios];
    }

    // El borrador puede estar incompleto, pero para enviarlo necesita remitente, asunto, contenido y al menos un destinatario
    public esValidoParaEnviar(): boolean {
        if (!this.remitente || this.asunto.trim().length === 0) {
            return false;
        }
        if (this.contenido.trim().length === 0) {
            return false;
        }
        return this.destinatarios.length > 0;
    }
}