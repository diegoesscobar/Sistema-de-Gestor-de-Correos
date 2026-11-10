import { Borrador } from './Borrador';
import { BandejaBorradores } from './BandejaBorradores';
import { Contacto } from './Contacto';
import { Correo } from './Correo';
import { BandejaEnviados } from './Bandeja';

export class GestorCorreos {
    private _borradores: BandejaBorradores = new BandejaBorradores();
    private _enviados: BandejaEnviados = new BandejaEnviados();
    private _contadorBorradores: number = 0;

    // Al empezar a redactar se registra un borrador vacío con un id propio
    public crearBorrador(): Borrador {
        this._contadorBorradores++;
        const borrador = new Borrador('b' + this._contadorBorradores);
        this._borradores.agregarBorrador(borrador);
        return borrador;
    }

    // Cada edición queda guardada en el borrador (simula el guardado automático)
    public editarBorrador(idBorrador: string, asunto?: string, contenido?: string, remitente?: Contacto, destinatarios?: Contacto[]): void {
        const borrador = this._borradores.obtenerBorrador(idBorrador);
        if (!borrador) {
            throw new Error('El borrador no existe');
        }
        if (asunto !== undefined) borrador.asunto = asunto;
        if (contenido !== undefined) borrador.contenido = contenido;
        if (remitente !== undefined) borrador.remitente = remitente;
        if (destinatarios !== undefined) borrador.destinatarios = [...destinatarios];
    }

    public obtenerBorrador(idBorrador: string): Borrador | undefined {
        return this._borradores.obtenerBorrador(idBorrador);
    }

    public obtenerBorradores(): Borrador[] {
        return this._borradores.obtenerBorradores();
    }

    // RF-02: el borrador válido se convierte en Correo, sale de Borradores y pasa a Enviados
    public enviarBorrador(idBorrador: string): Correo {
        const borrador = this._borradores.obtenerBorrador(idBorrador);
        if (!borrador) {
            throw new Error('El borrador no existe');
        }
        if (!borrador.esValidoParaEnviar()) {
            throw new Error('El borrador no está completo para enviarse');
        }
        const correo = new Correo(borrador.id, borrador.asunto, borrador.contenido, borrador.remitente!, borrador.destinatarios);
        this._borradores.removerBorrador(idBorrador);
        this._enviados.agregarCorreo(correo);
        return correo;
    }

    public obtenerEnviados(): Correo[] {
        return this._enviados.obtenerCorreos();
    }
}
