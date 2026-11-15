import { Borrador } from './Borrador';
import { BandejaBorradores } from './BandejaBorradores';
import { Contacto } from './Contacto';
import { Correo } from './Correo';
import { BandejaCorreos } from './BandejaCorreos';
import { BandejaEntrada } from './BandejaEntrada';
import { BandejaEnviados } from './BandejaEnviados';
import { BandejaEliminados } from './BandejaEliminados';
import { IGeneradorId } from './IGeneradorId';
import { GeneradorIdSecuencial } from './GeneradorIdSecuencial';

// Las bandejas de UN usuario. Repartir correos entre usuarios lo hace el GestorCorreos
export class Buzon {
    private _borradores: BandejaBorradores = new BandejaBorradores();
    private _entrada: BandejaEntrada = new BandejaEntrada();
    private _enviados: BandejaEnviados = new BandejaEnviados();
    private _eliminados: BandejaEliminados = new BandejaEliminados();

    // El gestor le pasa a todos los buzones el mismo generador, asi los ids no se repiten entre usuarios
    constructor(private readonly _generadorIds: IGeneradorId = new GeneradorIdSecuencial()) { }

    // Al empezar a redactar se registra un borrador vacío con un id propio
    public crearBorrador(): Borrador {
        const borrador = new Borrador(this._generadorIds.siguiente());
        this._borradores.agregarCorreo(borrador);
        return borrador;
    }

    // Busca el borrador y si no está corta con error, asi no se repite en cada método
    private buscarBorradorOError(idBorrador: string): Borrador {
        const borrador = this._borradores.buscarPorId(idBorrador);
        if (!borrador) {
            throw new Error('El borrador no existe');
        }
        return borrador;
    }

    // Cada edición queda guardada en el borrador (simula el guardado automático)
    public editarBorrador(idBorrador: string, asunto?: string, contenido?: string, remitente?: Contacto, destinatarios?: Contacto[]): void {
        this.buscarBorradorOError(idBorrador).editar(asunto, contenido, remitente, destinatarios);
    }

    public obtenerBorrador(idBorrador: string): Borrador | undefined {
        return this._borradores.buscarPorId(idBorrador);
    }

    public obtenerBorradores(): Borrador[] {
        return this._borradores.obtenerCorreos();
    }

    // RF-02: el borrador válido se convierte en Correo, sale de Borradores y pasa a Enviados
    public enviarBorrador(idBorrador: string): Correo {
        const borrador = this.buscarBorradorOError(idBorrador);
        if (!borrador.esValidoParaEnviar()) {
            throw new Error('El borrador no está completo para enviarse');
        }
        const correo = new Correo(borrador.id, borrador.asunto, borrador.contenido, borrador.remitente!, borrador.destinatarios);
        this._borradores.removerCorreo(idBorrador);
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

    // El gestor solo encuentra en qué bandeja está, el movimiento lo coordina la papelera
    public eliminarCorreo(idCorreo: string): void {
        const bandejas: BandejaCorreos[] = [this._entrada, this._enviados];
        const origen = bandejas.find(b => b.buscarPorId(idCorreo));
        if (!origen) {
            throw new Error('El correo no existe');
        }
        this._eliminados.recibirDesde(origen, idCorreo);
    }

    public restaurarCorreo(idCorreo: string): void {
        this._eliminados.restaurar(idCorreo);
    }

    // RF-09: vista de favoritos de todas las bandejas menos Eliminados, sin mover los correos
    public obtenerFavoritos(): Correo[] {
        // No pregunta cuál es la papelera: cada bandeja responde si entra en la vista (polimorfismo)
        const bandejas: BandejaCorreos[] = [this._entrada, this._enviados, this._eliminados];
        return bandejas
            .filter(b => b.incluyeEnFavoritos())
            .flatMap(b => b.obtenerCorreos())
            .filter(c => c.favorito);
    }
}