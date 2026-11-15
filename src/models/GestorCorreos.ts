import { Buzon } from './Buzon';
import { Contacto } from './Contacto';
import { Correo } from './Correo';
import { IGeneradorId } from './IGeneradorId';
import { GeneradorIdSecuencial } from './GeneradorIdSecuencial';

// Coordina los buzones de todos los usuarios: repartir correos entre usuarios lo hace el sistema, no el que lo usa
export class GestorCorreos {
    private readonly _buzones = new Map<string, Buzon>(); // email del usuario -> su buzón
    private readonly _generadorIds: IGeneradorId = new GeneradorIdSecuencial();

    // Cada usuario registrado tiene su propio buzón, todos con el mismo generador de ids
    public registrarUsuario(usuario: Contacto): Buzon {
        if (this._buzones.has(usuario.email)) {
            throw new Error('El usuario ya está registrado');
        }
        const buzon = new Buzon(this._generadorIds);
        this._buzones.set(usuario.email, buzon);
        return buzon;
    }

    public buzonDe(email: string): Buzon {
        const buzon = this._buzones.get(email.toLowerCase().trim());
        if (!buzon) {
            throw new Error('El usuario no está registrado');
        }
        return buzon;
    }

    // RF-02: el remitente lo guarda en sus Enviados y cada destinatario registrado recibe su propia copia
    public enviar(emailRemitente: string, idBorrador: string): Correo {
        const correo = this.buzonDe(emailRemitente).enviarBorrador(idBorrador);
        correo.destinatarios
            .filter(destinatario => this._buzones.has(destinatario.email))
            .forEach(destinatario => this.buzonDe(destinatario.email).recibirCorreo(correo.copiar()));
        return correo;
    }

    // Eliminar es de UN usuario: solo se toca su buzón, los demás conservan su copia
    public eliminarCorreo(emailUsuario: string, idCorreo: string): void {
        this.buzonDe(emailUsuario).eliminarCorreo(idCorreo);
    }

    public restaurarCorreo(emailUsuario: string, idCorreo: string): void {
        this.buzonDe(emailUsuario).restaurarCorreo(idCorreo);
    }
}
