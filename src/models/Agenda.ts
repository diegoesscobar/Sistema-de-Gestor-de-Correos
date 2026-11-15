import { Contacto } from './Contacto';

// RF-03: la agenda de contactos. El criterio para no duplicar es el email
export class Agenda {
    private readonly _contactos = new Map<string, Contacto>(); // email -> contacto

    public agregar(contacto: Contacto): void {
        if (this._contactos.has(contacto.email)) {
            throw new Error('Ya existe un contacto con ese email');
        }
        this._contactos.set(contacto.email, contacto);
    }

    // El email se guarda en minúsculas, asi que se busca igual
    public buscarPorEmail(email: string): Contacto | undefined {
        return this._contactos.get(email.toLowerCase().trim());
    }

    private buscarOError(email: string): Contacto {
        const contacto = this.buscarPorEmail(email);
        if (!contacto) {
            throw new Error('No existe un contacto con ese email');
        }
        return contacto;
    }

    // El nombre lo valida el propio Contacto
    public modificarNombre(email: string, nuevoNombre: string): void {
        this.buscarOError(email).nombre = nuevoNombre;
    }

    // Primero se valida todo y recién después se cambia la clave del map
    public modificarEmail(emailActual: string, nuevoEmail: string): void {
        const contacto = this.buscarOError(emailActual);
        if (this.buscarPorEmail(nuevoEmail)) {
            throw new Error('Ya existe un contacto con ese email');
        }
        contacto.email = nuevoEmail;
        this._contactos.delete(emailActual.toLowerCase().trim());
        this._contactos.set(contacto.email, contacto);
    }

    // Solo sale de la agenda: los correos que lo referencian siguen teniendo el objeto Contacto
    public eliminar(email: string): void {
        this._contactos.delete(this.buscarOError(email).email);
    }

    public obtenerContactos(): Contacto[] {
        return [...this._contactos.values()];
    }
}
