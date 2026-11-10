import { Borrador } from './Borrador';
import { BandejaBorradores } from './BandejaBorradores';
import { Contacto } from './Contacto';
import { Correo } from './Correo';
import { Bandeja, BandejaEntrada, BandejaEnviados, BandejaEliminados } from './Bandeja';

export class GestorCorreos {
    private _borradores: BandejaBorradores = new BandejaBorradores();
    private _entrada: BandejaEntrada = new BandejaEntrada();
    private _enviados: BandejaEnviados = new BandejaEnviados();
    private _eliminados: BandejaEliminados = new BandejaEliminados();
    private _origenes: Map<string, Bandeja> = new Map(); // id del correo -> bandeja de donde salió
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

    // Simula la llegada de un correo a la bandeja de entrada
    public recibirCorreo(correo: Correo): void {
        this._entrada.agregarCorreo(correo);
    }

    public obtenerEntrada(): Correo[] {
        return this._entrada.obtenerCorreos();
    }

    public obtenerEliminados(): Correo[] {
        return this._eliminados.obtenerCorreos();
    }

    // Busca el correo en Entrada o Enviados, lo pasa a Eliminados y se acuerda de donde venía
    public eliminarCorreo(idCorreo: string): void {
        const bandejas: Bandeja[] = [this._entrada, this._enviados];
        const origen = bandejas.find(b => b.obtenerCorreos().some(c => c.id === idCorreo));
        if (!origen) {
            throw new Error('El correo no existe');
        }
        const correo = origen.removerCorreo(idCorreo)!;
        this._eliminados.agregarCorreo(correo);
        this._origenes.set(idCorreo, origen);
    }
}
