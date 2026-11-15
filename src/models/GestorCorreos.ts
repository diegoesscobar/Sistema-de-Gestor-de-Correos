import { Buzon } from './Buzon';
import { Contacto } from './Contacto';
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
}
