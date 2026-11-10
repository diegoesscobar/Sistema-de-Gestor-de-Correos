import { Borrador } from './Borrador';
import { BandejaBorradores } from './BandejaBorradores';
import { Contacto } from './Contacto';

export class GestorCorreos {
    private _borradores: BandejaBorradores = new BandejaBorradores();
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
}
